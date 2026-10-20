import { expect, test } from 'claude-code/testing'
import { clipLines } from './lanes'
import { chipsFor, clip, findCard, fitText, headerSvg, parseBoard, plain, textWidth } from './board'

const LONG = 'x'.repeat(1500)
const BOARD = [
  '# Debt review 2026-10: board',
  '',
  '## Handoff',
  '- Next action: walk the phone',
  '',
  '## Backlog',
  `- **HR-T7-walk** Android phone and tablet \`walks\` · source: HR-T7 builder 2026-10-15 · iPhone part 2026-10-20: contracts ${LONG}`,
  '- **ADV-1** Pin search_path &lt;empty&gt; · source: docs/plans/advisor-cleanup.md',
  '',
  '## Ready',
  '',
  '## Doing (limit 1 per session)',
  '- **SYNC-T12b** Sync the queue · claim: fixer 2026-10-20T09:00:00Z',
  '',
  '## Review',
  '- **CM-T15** Chart · commit: owner · check: jest 18 passing',
].join('\n')

test('a board parses into its five columns with counts and progress', () => {
  const board = parseBoard(BOARD)
  expect(board.title).toBe('Debt review 2026-10')
  expect(board.columns.map(c => c.key)).toEqual(['backlog', 'ready', 'doing', 'review', 'done'])
  expect(board.columns.map(c => c.cards.length)).toEqual([2, 0, 1, 1, 0])
  expect(board.columns[2]!.name).toBe('Doing')
  expect(board.columns[2]!.hint).toBe('limit 1 per session')
  expect([board.done, board.total, board.percent]).toEqual([1, 4, 25])
})

test('a card splits into title, named fields and notes', () => {
  const { card, column } = findCard(parseBoard(BOARD), 'HR-T7-walk')!
  expect(column.key).toBe('backlog')
  expect(card.title).toBe('Android phone and tablet `walks`')
  expect(card.fields).toEqual([{ key: 'source', value: 'HR-T7 builder 2026-10-15' }])
  expect(card.notes.length).toBe(1)
  expect(card.notes[0]!.length).toBeGreaterThan(1500)
})

test('a long title becomes one plain line', () => {
  expect(plain('Pin `search_path` &lt;empty&gt; **now**')).toBe('Pin search_path <empty> now')
  const line = clip(plain(LONG), 60)
  expect(line.length).toBe(60)
  expect(line.endsWith('…')).toBe(true)
})

test('a board with no columns still shows the standard five', () => {
  const board = parseBoard('# Plan\n')
  expect(board.columns.map(c => c.name)).toEqual(['Backlog', 'Ready', 'Doing', 'Review', 'Done'])
  expect(board.percent).toBe(0)
})

test('a card face shows who holds it, a real commit and its notes, and never repeats the source', () => {
  const board = parseBoard(BOARD)
  expect(chipsFor(findCard(board, 'SYNC-T12b')!.card)).toEqual(['fixer'])
  expect(chipsFor(findCard(board, 'CM-T15')!.card)).toEqual([])
  expect(chipsFor(findCard(board, 'ADV-1')!.card)).toEqual([])
  expect(chipsFor(findCard(board, 'HR-T7-walk')!.card)).toEqual(['1 note'])
})

test('the header svg fits its title and carries the dark palette', () => {
  const svg = headerSvg(300, 'x'.repeat(200), '609 of 618 done', 98)
  expect(svg).toContain('prefers-color-scheme: dark')
  expect(svg).toContain('…')
  expect(textWidth(fitText('y'.repeat(300), 14, 200), 14)).toBeLessThanOrEqual(200)
})

test('a title wraps by words and stops at the second line', () => {
  const title = 'Complete one approve and one reject of a void with a PIN-holding account on phone'
  const cut = clipLines(title, 32, 2)
  expect(cut.endsWith('…')).toBe(true)
  expect(cut.length).toBeGreaterThan(50)
  expect(cut.length).toBeLessThanOrEqual(64)
  expect(clipLines('Short title', 32, 2)).toBe('Short title')
})
