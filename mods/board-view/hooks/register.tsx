import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, RenderElement, RenderInput, Space, TextProps } from 'claude-code'

import type { BoardViewState } from '../types'
import { chipsFor, clip, decode, findCard, headerSvg, parseBoard, plain } from './board'
import type { CardDetail, LaneData, LanesProps } from './lanes'
import type { Board, Card, Column } from './board'

const PANE = 'board'
const PAGE = 30
const POLL_MS = 4000
/** A lane keeps this many cells; a narrow pane scrolls sideways. */
const LANE = 34
/** Cards a lane hands the lanes module; Client props stay under 100,000 characters. */
const LANE_CARDS = 120
/** Translucent greys read on light and dark alike. */
const LANE_FILL = '#8080801f'
const HAIRLINE = '#80808040'
const RESCAN_MS = 60_000

const view = atom({ plugin: 'board-view', key: 'view' } as const, { openId: null, shown: {}, chosen: null } as BoardViewState)
const stamp = atom({ plugin: 'board-view', key: 'stamp' } as const, 0)

const COLOR: Record<string, string> = {
  backlog: 'inactive',
  ready: 'suggestion',
  doing: 'warning',
  review: 'merged',
  done: 'success',
}
const FIELD_LABEL: Record<string, string> = {
  source: 'Source',
  claim: 'Claimed by',
  commit: 'Commit',
  check: 'Checked',
}

type Loaded = { root: string; boards: string[]; path: string; mtimeMs: number; board: Board }
type Status = { kind: 'none'; root: string } | { kind: 'failed'; reason: string } | ({ kind: 'ready' } & Loaded)

let cache: Status | null = null
let scannedAt = 0

type Gaps = { xs: Space; sm: Space; md: Space }
/** Gaps in cells; a graphical surface takes halves. */
type Ui = ReturnType<EngineInterface['ui']['resolve']>
type TextNode = TextProps & { children?: unknown }

/** Text without the props this engine build still refuses. */
const textFor = (ui: Ui) => (props: TextNode) => {
  const { size: _size, mono: _mono, tabular: _tabular, weight, ...rest } = props
  return ui.Text({ ...rest, ...(weight === 'semibold' || weight === 'bold' ? { bold: true } : {}) } as never)
}

const gapsFor = (surface: string): Gaps => (surface === 'terminal' ? { xs: 0, sm: 1, md: 1 } : { xs: 0.5, sm: 1, md: 2 })

const parent = (dir: string) => dir.replace(/[\\/][^\\/]+[\\/]?$/, '')
const join = (dir: string, name: string) => `${dir.replace(/[\\/]$/, '')}/${name}`
const relative = (root: string, path: string) => (path.startsWith(root) ? path.slice(root.length + 1) : path)

async function gitRoot($: EngineInterface, start: string): Promise<string> {
  for (let dir = start; dir; ) {
    if (await $.fs.exists(join(dir, '.git'))) return dir
    const up = parent(dir)
    if (!up || up === dir) break
    dir = up
  }
  return start
}

async function findBoards($: EngineInterface, dir: string, depth: number): Promise<{ path: string; mtimeMs: number }[]> {
  const entries = await $.fs.list(dir).catch(() => [])
  const found: { path: string; mtimeMs: number }[] = []
  for (const entry of entries) {
    if (entry.kind === 'file' && entry.name === 'BOARD.md') found.push({ path: join(dir, entry.name), mtimeMs: entry.mtimeMs })
    else if (entry.kind === 'dir' && depth > 0 && !entry.name.startsWith('.') && entry.name !== 'node_modules')
      found.push(...(await findBoards($, join(dir, entry.name), depth - 1)))
  }
  return found
}

/** Reads the board when its file changed; answers whether the pane must redraw. */
async function load($: EngineInterface): Promise<boolean> {
  try {
    if (cache?.kind === 'ready' && Date.now() - scannedAt < RESCAN_MS) {
      const stat = await $.fs.stat(cache.path)
      if (stat.mtimeMs === cache.mtimeMs) return false
    }
    scannedAt = Date.now()
    const root = await gitRoot($, await $.session.cwd())
    const found = (await findBoards($, join(root, 'docs/plans'), 4)).sort((a, b) => b.mtimeMs - a.mtimeMs)
    if (!found.length) {
      const changed = cache?.kind !== 'none'
      cache = { kind: 'none', root }
      return changed
    }
    const { chosen } = await read($, view)
    const pick = found.find(f => f.path === chosen) ?? found[0]!
    const stat = await $.fs.stat(pick.path)
    const boards = found.map(f => f.path)
    if (cache?.kind === 'ready' && cache.path === pick.path && cache.mtimeMs === stat.mtimeMs && cache.boards.join() === boards.join())
      return false
    const text = await $.fs.read(pick.path)
    cache = { kind: 'ready', root, boards, path: pick.path, mtimeMs: stat.mtimeMs, board: parseBoard(text) }
    return true
  } catch (err) {
    cache = { kind: 'failed', reason: String((err as Error)?.message ?? err) }
    return true
  }
}

async function refresh($: EngineInterface) {
  if (await load($)) await update($, stamp, n => n + 1)
}

async function isOpen($: EngineInterface) {
  return (await $.ui.panes()).some(p => p.id === PANE)
}

function lanesOf(board: Board): LaneData[] {
  return board.columns.map(column => ({
    key: column.key,
    name: column.name,
    color: COLOR[column.key] ?? 'inactive',
    count: column.cards.length,
    hint: column.hint,
    cards: column.cards.slice(0, LANE_CARDS).map(card => ({
      id: card.id,
      title: clip(plain(card.title), 160),
      meta: chipsFor(card).join('   '),
      isDone: column.key === 'review' || column.key === 'done',
    })),
  }))
}

/** What the lanes region draws: the lanes, or one card's full text over them. */
function lanesProps(board: Board, openId: string | null): LanesProps {
  const found = openId ? findCard(board, openId) : null
  const detail: CardDetail | null = found
    ? {
        id: found.card.id,
        columnKey: found.column.key,
        columnName: found.column.name,
        title: decode(found.card.title),
        fields: found.card.fields.map(f => ({ label: FIELD_LABEL[f.key] ?? f.key.charAt(0).toUpperCase() + f.key.slice(1), value: decode(f.value) })),
        notes: found.card.notes.map(decode),
      }
    : null
  return { lanes: lanesOf(board), minWidth: LANE, fill: LANE_FILL, hairline: HAIRLINE, card: 'composerSidebarBackground', detail }
}

async function drawPane($: EngineInterface, e: RenderInput<'Pane'>) {
  await read($, stamp)
  const state = await read($, view)
  if (!cache) await load($)
  const ui = $.ui.resolve(e)
  const { Box, Button } = ui
  const Text = textFor(ui)
  const width = Math.max(30, e.props.bodyColumns || 60)
  const gap = gapsFor(e.surface)
  const status = cache!

  if (status.kind === 'failed')
    return (
      <Box flexDirection="column" gap={gap.xs}>
        <Text weight="semibold">The board could not be read</Text>
        <Text dimColor>{status.reason}</Text>
      </Box>
    )
  if (status.kind === 'none')
    return (
      <Box flexDirection="column" gap={gap.xs}>
        <Text weight="semibold">No board in this project</Text>
        <Text dimColor>The pane shows docs/plans/**/BOARD.md under {status.root}.</Text>
      </Box>
    )

  const { board } = status
  const setView = (fn: (v: BoardViewState) => BoardViewState) => update($, view, fn)
  const dot = (key: string) => <Text color={COLOR[key] ?? 'inactive'}>●</Text>

  const opened = state.openId ? findCard(board, state.openId) : null
  if (opened && !('Client' in ui)) return drawCard(ui, Text, gap, opened.card, opened.column, dot, () => setView(v => ({ ...v, openId: null })))

  const W = Math.max(240, Math.min(1600, width * 8 - 8))
  const figure = `${board.done}/${board.total}`
  const header =
    e.surface !== 'terminal' && 'Svg' in ui ? (
      <ui.Svg source={headerSvg(W, board.title, figure, board.percent)} alt={`${board.title} ${figure} ${board.percent}%`} width={W} height={44} />
    ) : (
      <Box flexDirection="column">
        <Text bold>
          {board.title} <Text dimColor>{figure} {board.percent}%</Text>
        </Text>
        <Text>
          <Text color="success">{'█'.repeat(Math.round((board.percent / 100) * (width - 2)))}</Text>
          <Text dimColor>{'░'.repeat(width - 2 - Math.round((board.percent / 100) * (width - 2)))}</Text>
        </Text>
      </Box>
    )
  const boardPicker = status.boards.length > 1 && (
    <Box flexDirection="row" flexWrap="wrap" gap={gap.sm}>
      {status.boards.map(path => (
        <Button
          key={`pick-${path}`}
          plain
          dimColor={path !== status.path}
          label={relative(status.root, path).replace(/^docs\/plans\//, '').replace(/\/BOARD\.md$/, '')}
          onPress={async () => {
            await setView(v => ({ ...v, chosen: path, openId: null }))
            scannedAt = 0
            await refresh($)
          }}
        />
      ))}
    </Box>
  )

  const lanes = lanesOf(board)

  return (
    <Box flexDirection="column" gap={gap.md}>
      {header}
      {boardPicker}
      {'Client' in ui ? (
        <ui.Client key="lanes" module="./lanes.tsx" props={lanesProps(board, state.openId)} />
      ) : (
        lanes.map(l => (
          <Box key={`lane-${l.key}`} flexDirection="column">
            <Text bold>{`${l.name} ${l.count}`}</Text>
            {l.cards.slice(0, 10).map(c => (
              <Button key={`card-${c.id}`} plain label={`${c.id} ${c.title}`} onPress={() => setView(v => ({ ...v, openId: c.id }))} />
            ))}
          </Box>
        ))
      )}
    </Box>
  )
}

function drawCard(
  ui: Ui,
  Text: (props: TextNode) => RenderElement,
  gap: Gaps,
  card: Card,
  column: Column,
  dot: (key: string) => RenderElement,
  back: () => unknown,
) {
  const { Box, Button, Markdown } = ui
  return (
    <Box flexDirection="column" gap={gap.md}>
      <Box flexDirection="row">
        <Button key="back" label="‹ Board" plain dimColor onPress={() => void back()} />
      </Box>
      <Box flexDirection="column" gap={gap.xs}>
        <Box flexDirection="row" gap={gap.xs} alignItems="center">
          {dot(column.key)}
          <Text dimColor>{column.name}</Text>
        </Box>
        <Text mono size="heading" weight="semibold">
          {card.id}
        </Text>
        <Markdown text={decode(card.title)} />
      </Box>
      {card.fields.map((field, i) => (
        <Box key={`field-${i}`} flexDirection="column" gap={gap.xs}>
          <Text size="caption" dimColor>
            {FIELD_LABEL[field.key] ?? field.key.charAt(0).toUpperCase() + field.key.slice(1)}
          </Text>
          <Markdown text={decode(field.value)} />
        </Box>
      ))}
      {card.notes.length > 0 && (
        <Box flexDirection="column" gap={gap.xs}>
          <Text size="caption" dimColor>
            Notes
          </Text>
          <Markdown text={card.notes.map(n => `- ${decode(n)}`).join('\n')} />
        </Box>
      )}
    </Box>
  )
}

async function toggle($: EngineInterface) {
  if (await isOpen($)) return $.ui.close({ id: PANE })
  await refresh($)
  await $.ui.open({ id: PANE, title: 'Board', columns: 180 })
}

export const register: Register = (on, options) => {
  on('session.start', async ($, e, next) => {
    await $.command.register({ name: 'kanban', description: "Show or hide the project's kanban board" }).catch(() => undefined)
    const started = await next(e)
    await refresh($)
    if (options.openOnStart !== false && cache?.kind === 'ready') void $.ui.open({ id: PANE, title: 'Board', columns: 180 })
    $.clock.every(POLL_MS, () => {
      void isOpen($).then(open => (open ? refresh($) : undefined))
    })
    return started
  })

  on('command.run', { command: 'kanban' }, async $ => {
    await toggle($)
    return {}
  })

  on('turn.complete', async ($, e, next) => {
    const done = await next(e)
    void refresh($)
    return done
  })

  on('ui.message', { element: 'lanes' }, async ($, e) => {
    const data = e.data as { open?: string; close?: boolean }
    if (!cache) await load($)
    if (cache?.kind !== 'ready') return {}
    if (typeof data?.open === 'string' || data?.close) {
      const openId = typeof data.open === 'string' ? data.open : null
      await update($, view, v => ({ ...v, openId }))
      return { props: lanesProps(cache.board, openId) }
    }
    return {}
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    try {
      return await drawPane($, e)
    } catch (err) {
      const { Text } = $.ui.resolve(e)
      return <Text dimColor>Board: {String((err as Error)?.message ?? err)}</Text>
    }
  })
}
