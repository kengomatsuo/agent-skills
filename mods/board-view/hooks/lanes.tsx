import type { ClientModule, ClientPointerEvent } from 'claude-code'

/** One lane as the hooks module hands it over: plain data only. */
export type LaneCard = { id: string; title: string; meta: string; isDone: boolean }
export type LaneData = { key: string; name: string; color: string; count: number; hint: string; cards: LaneCard[] }
export type CardDetail = { id: string; columnKey: string; columnName: string; title: string; fields: { label: string; value: string }[]; notes: string[] }
export type LanesProps = { lanes: LaneData[]; minWidth: number; fill: string; hairline: string; card: string; detail: CardDetail | null }
type LanesState = { first: number; dragFrom: number | null; downAt: { x: number; y: number } | null; shown: Record<string, number> }

const PAGE = 30
const NBSP = '\u00a0'
/** One line glyph per section, picked for equal size in the system font. */
const GLYPH: Record<string, string> = { backlog: '□', ready: '→', doing: '↻', review: '⊙', done: '✓' }
/** The picker's rows: a rounded segment is a border, its label and a border. */
const PICKER_ROWS = 3

const clip = (s: string, max: number) => (s.length <= max ? s : `${s.slice(0, Math.max(1, max - 1)).trimEnd()}…`)

/** Wraps words as the lane would and cuts at the last line, so no third line shows. */
export function clipLines(text: string, perLine: number, lines: number): string {
  const words = text.split(/\s+/).filter(Boolean)
  const out: string[] = []
  let line = ''
  for (let i = 0; i < words.length; i++) {
    const word = words[i]!
    const next = line ? `${line} ${word}` : word
    if (next.length <= perLine) {
      line = next
      continue
    }
    if (out.length === lines - 1) return [...out, clip(`${next} ${words.slice(i + 1).join(' ')}`.trim(), perLine)].join(' ')
    if (line) out.push(line)
    line = word.length > perLine ? clip(word, perLine) : word
  }
  return [...out, line].filter(Boolean).join(' ')
}

/** Lanes side by side; a drag or the arrow keys move them sideways a lane at a time. */
const Lanes: ClientModule<LanesProps, LanesState> = (props, surface) => {
  const { Box, Text, Button, Markdown } = surface.elements
  const state = surface.state ?? { first: 0, dragFrom: null, downAt: null, shown: {} }
  const lanes = props.lanes
  /** Read live, so a drag after a resize uses the new width. */
  const geometry = () => {
    const columns = surface.columns || props.minWidth
    const fits = Math.max(1, Math.floor((columns + 1) / (props.minWidth + 1)))
    return { fits, last: Math.max(0, lanes.length - fits), laneW: Math.floor((columns + 1) / Math.min(fits, lanes.length || 1)) - 1 }
  }
  const { fits, last, laneW } = geometry()
  const first = Math.min(state.first, last)
  /* a bold line holds ~1.25 glyphs per cell */
  const lineChars = Math.floor((laneW - 4) * 1.25)
  const go = (to: number) => surface.setState({ ...state, first: Math.max(0, Math.min(last, to)), dragFrom: null, downAt: null })

  if (surface.state === undefined) {
    surface.onPointer((event: ClientPointerEvent) => {
      const now = surface.state ?? state
      const g = geometry()
      const x = event.fine?.x ?? event.x
      if (event.type === 'down') surface.setState({ ...now, dragFrom: x, downAt: { x: event.x, y: event.y } })
      else if (event.type === 'up' && now.downAt && now.downAt.y < PICKER_ROWS && event.y < PICKER_ROWS && Math.abs(event.x - now.downAt.x) <= 1) {
        const width = surface.columns || props.minWidth
        const index = Math.max(0, Math.min(lanes.length - 1, Math.floor((event.x * lanes.length) / Math.max(1, width))))
        surface.setState({ ...now, first: Math.max(0, Math.min(g.last, index)), dragFrom: null, downAt: null })
      } else if (event.type === 'up' || event.type === 'leave') surface.setState({ ...now, dragFrom: null, downAt: null })
      else if (event.type === 'move' && now.dragFrom !== null && Math.abs(x - now.dragFrom) >= (g.laneW + 1) / 2) {
        const step = x < now.dragFrom ? 1 : -1
        surface.setState({ ...now, first: Math.max(0, Math.min(g.last, now.first + step)), dragFrom: x })
      }
    })
    surface.onKey(event => {
      const now = surface.state ?? state
      const g = geometry()
      if (event.key === 'right') surface.setState({ ...now, first: Math.min(g.last, now.first + 1) })
      if (event.key === 'left') surface.setState({ ...now, first: Math.max(0, now.first - 1) })
    })
    surface.setState(state)
  }

  if (props.detail) {
    const d = props.detail
    return (
      <Box flexDirection="column" gap={1}>
        <Button key="back" label="‹ Board" plain dimColor onPress={() => surface.post({ close: true })} />
        <Text>
          <Text dimColor>{GLYPH[d.columnKey] ?? '□'}</Text> <Text dimColor>{d.columnName}</Text>
        </Text>
        <Text bold>{d.id}</Text>
        <Markdown text={d.title} />
        {d.fields.map((f, i) => (
          <Box key={`field-${i}`} flexDirection="column">
            <Text dimColor>{f.label}</Text>
            <Markdown text={f.value} />
          </Box>
        ))}
        {d.notes.length ? (
          <Box flexDirection="column">
            <Text dimColor>Notes</Text>
            <Markdown text={d.notes.map(n => `- ${n}`).join('\n')} />
          </Box>
        ) : null}
      </Box>
    )
  }

  const visible = lanes.slice(first, first + fits)
  const card = (c: LaneCard) => (
    <Box key={`box-${c.id}`} flexDirection="column" backgroundColor={props.card} borderStyle="round" borderColor={props.hairline} paddingX={1}>
      <Text bold wrap="wrap">
        {clipLines(c.title, lineChars, 2)}
      </Text>
      {c.meta ? <Text dimColor>{clip(c.meta, lineChars)}</Text> : null}
      <Box flexDirection="row" justifyContent="space-between" alignItems="center">
        <Text dimColor>
          {c.id}
          {c.isDone ? <Text color="success"> ✓</Text> : ''}
        </Text>
        <Button key={`card-${c.id}`} label="Open" plain dimColor onPress={() => surface.post({ open: c.id })} />
      </Box>
    </Box>
  )
  const lane = (l: LaneData) => {
    const shown = state.shown[l.key] ?? PAGE
    const left = l.cards.length - shown
    return (
      <Box key={`lane-${l.key}`} flexDirection="column" gap={0.5} width={0} flexGrow={1} backgroundColor={props.fill} borderStyle="round" borderColor={props.fill} paddingX={1}>
        <Text>
          <Text dimColor>{GLYPH[l.key] ?? '□'}</Text> <Text bold>{l.name}</Text> <Text dimColor>{l.count}</Text>
          {l.hint ? <Text dimColor>{`  ${l.hint}`}</Text> : ''}
        </Text>
        {l.cards.length === 0 ? <Text dimColor>None</Text> : l.cards.slice(0, shown).map(card)}
        {left > 0 ? (
          <Button
            key={`more-${l.key}`}
            label={`+${Math.min(PAGE, left)}`}
            plain
            dimColor
            onPress={() => surface.setState({ ...state, shown: { ...state.shown, [l.key]: shown + PAGE } })}
          />
        ) : null}
      </Box>
    )
  }

  const segW = Math.floor(((surface.columns || props.minWidth) - (lanes.length - 1)) / Math.max(1, lanes.length))
  const segment = (l: LaneData, i: number) => {
    const isShown = i >= first && i < first + fits
    const glyph = GLYPH[l.key] ?? '□'
    const full = `${glyph}${NBSP}${l.name}${NBSP}${l.count}`
    return (
      <Box
        key={`seg-${l.key}`}
        width={0}
        flexGrow={1}
        justifyContent="center"
        borderStyle="round"
        borderColor={isShown ? props.fill : props.hairline}
        backgroundColor={isShown ? props.fill : undefined}
      >
        <Button
          key={`lane-pick-${l.key}`}
          plain
          dimColor={!isShown}
          label={full.length + 4 <= segW ? full : `${glyph}${NBSP}${l.count}`}
          onPress={() => go(i)}
        />
      </Box>
    )
  }

  return (
    <Box flexDirection="column" gap={1}>
      <Box flexDirection="row" gap={1}>
        {lanes.map(segment)}
      </Box>
      <Box flexDirection="row" gap={1} alignItems="flex-start">
        {visible.map(lane)}
      </Box>
    </Box>
  )
}

export default Lanes
