/** A card as the board script writes it: `- **ID** text · field: value · note`. */
export type Field = { key: string; value: string }
export type Card = { id: string; title: string; fields: Field[]; notes: string[] }
export type Column = { key: string; name: string; hint: string; cards: Card[] }
export type Board = { title: string; columns: Column[]; done: number; total: number; percent: number }

const ID = /^- \*\*([\w.-]+)\*\*\s?(.*)$/
const STANDARD = ['backlog', 'ready', 'doing', 'review', 'done']
const DONE_COLUMNS = ['review', 'done']
const FIELD = /^([a-z][a-z-]{0,23}): ([\s\S]*)$/

export const decode = (s: string): string => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')

/** One line of plain text: no markdown marks, no entities. */
export const plain = (s: string): string =>
  decode(s)
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()

export const clip = (s: string, max: number): string =>
  s.length <= max ? s : `${s.slice(0, Math.max(1, max - 1)).trimEnd()}…`

export function parseCard(id: string, rest: string): Card {
  const parts = rest.split(' · ')
  const fields: Field[] = []
  const notes: string[] = []
  for (const part of parts.slice(1)) {
    const text = part.trim()
    const field = text.match(FIELD)
    if (field) fields.push({ key: field[1]!, value: field[2]!.trim() })
    else if (text) notes.push(text)
  }
  return { id, title: parts[0]!.trim(), fields, notes }
}

const columnKey = (heading: string) => heading.split(/[\s(]/)[0]!.toLowerCase()
const titleCase = (key: string) => key.charAt(0).toUpperCase() + key.slice(1)

export function parseBoard(text: string): Board {
  let title = ''
  const columns: Column[] = []
  let column: Column | null = null
  for (const line of text.split('\n')) {
    if (!title && line.startsWith('# ')) title = line.slice(2).replace(/:\s*board\s*$/i, '').trim()
    if (line.startsWith('## ')) {
      const heading = line.slice(3).trim()
      const key = columnKey(heading)
      if (key === 'handoff') {
        column = null
        continue
      }
      column = columns.find(c => c.key === key) ?? null
      if (!column) {
        column = { key, name: heading.replace(/\s*\(.*\)\s*$/, ''), hint: heading.match(/\(([^)]*)\)/)?.[1] ?? '', cards: [] }
        columns.push(column)
      }
      continue
    }
    const card = line.match(ID)
    if (card && column) column.cards.push(parseCard(card[1]!, card[2]!))
  }
  for (const key of STANDARD)
    if (!columns.some(c => c.key === key)) columns.push({ key, name: titleCase(key), hint: '', cards: [] })
  const rank = (c: Column) => {
    const i = STANDARD.indexOf(c.key)
    return i < 0 ? STANDARD.length + columns.indexOf(c) : i
  }
  columns.sort((a, b) => rank(a) - rank(b))
  const total = columns.reduce((n, c) => n + c.cards.length, 0)
  const done = columns.filter(c => DONE_COLUMNS.includes(c.key)).reduce((n, c) => n + c.cards.length, 0)
  return { title: title || 'Board', columns, done, total, percent: total ? Math.floor((done * 100) / total) : 0 }
}

export function findCard(board: Board, id: string): { card: Card; column: Column } | null {
  for (const column of board.columns) {
    const card = column.cards.find(c => c.id === id)
    if (card) return { card, column }
  }
  return null
}

const FIELD_OF = (card: Card, key: string) => card.fields.find(f => f.key === key)?.value

/** The card face's meta: who holds it, its commit, its notes. */
export function chipsFor(card: Card): string[] {
  const chips: string[] = []
  const claim = FIELD_OF(card, 'claim')
  if (claim) chips.push(claim.split(' ')[0]!)
  const commit = FIELD_OF(card, 'commit')
  if (commit && /^[0-9a-f]{7,}$/i.test(commit)) chips.push(commit.slice(0, 7))
  if (card.notes.length) chips.push(`${card.notes.length} ${card.notes.length === 1 ? 'note' : 'notes'}`)
  return chips.slice(0, 3)
}

const FONT = "-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',sans-serif"
const xml = (s: string): string => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] ?? c)
const charEm = (ch: string): number => (/[\s.,:;'|!il1()[\]]/.test(ch) ? 0.3 : /[A-Zmw@%]/.test(ch) ? 0.72 : 0.56)
export const textWidth = (s: string, size: number): number => [...s].reduce((w, ch) => w + charEm(ch) * size, 0)

/** Cuts `s` to `maxW` pixels of system text, with an ellipsis when cut. */
export function fitText(s: string, size: number, maxW: number): string {
  if (textWidth(s, size) <= maxW) return s
  let out = ''
  for (const ch of s) {
    if (textWidth(out + ch + '…', size) > maxW) break
    out += ch
  }
  return out + '…'
}

/** The board's title, figure and a thin bar, in savvy-progress's palette and dark theme. */
export function headerSvg(W: number, title: string, figure: string, percent: number): string {
  const right = `${figure}  ${percent}%`
  const name = fitText(title, 14, Math.max(60, W - textWidth(right, 12.5) - 16))
  const fill = Math.round((W * percent) / 100)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="44" viewBox="0 0 ${W} 44"><style>.t{fill:#1f1f1f}.m{fill:#8a8a8a}.k{fill:#e4e4e2}@media (prefers-color-scheme: dark){.t{fill:#ececec}.m{fill:#9a9a9a}.k{fill:#2c2c2c}}</style>
<text class="t" x="0" y="17" font-family="${FONT}" font-size="14" font-weight="600">${xml(name)}</text>
<text class="m" x="${W}" y="17" text-anchor="end" font-family="${FONT}" font-size="12.5" font-variant-numeric="tabular-nums">${xml(right)}</text>
<rect class="k" x="0" y="30" width="${W}" height="6" rx="3"/><rect x="0" y="30" width="${fill}" height="6" rx="3" fill="#5fbf8f"/></svg>`
}
