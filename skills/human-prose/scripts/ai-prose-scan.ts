#!/usr/bin/env bun
/**
 * ai-prose-scan: flags the sentence shapes and stock phrases that make copy read as machine-written
 * or as every rival's page, line by line, as lines worth rereading. It reports and always exits 0.
 *
 * Usage:
 *   bun ai-prose-scan.ts <file> [<file> ...] [--register kamu] [--rules <file.json>] [--json]
 *
 * Files:
 *   .txt / .md   every non-empty line is one string (markdown table pipes, code spans and links are stripped)
 *   .json        every string leaf; when some leaf sits under a language key (id, en, en-GB, ms, ...) only
 *                those leaves are read, and leaves under example / evidence / note / intent / where / about /
 *                source / proof / rethink are skipped, so a copy deck's briefs are not scanned as copy.
 *   HTML tags inside a string are removed before scanning.
 *
 * Rules are "ban" (a tell even once) or "cap" (fine once by choice, a tell when it is the default).
 * --register kamu lists "Anda" in Indonesian strings, for a product whose brand skill sets kamu.
 * --rules adds a product's own rules (the phrases its rivals print), a JSON array of
 * { id, level, lang, re, flags, why }.
 *
 * Sources: Wikipedia "Signs of AI writing"; coreyhaines31/marketingskills copywriting and its
 * references/ai-tells.md (MIT); Reinhart et al. PNAS 2025 (participle clauses).
 */
import { readFileSync } from 'node:fs'
import { extname } from 'node:path'

type Lang = 'en' | 'id'
type Rule = { id: string; level: 'ban' | 'cap'; lang: Lang | 'any'; re: RegExp; why: string }

const SKIP_KEYS = new Set(['example', 'evidence', 'note', 'intent', 'where', 'about', 'source', 'proof', 'rethink', 'url', 'href', 'src'])
const LANG_KEY = /^(id|en|en-GB|en-US|ms|th|vi|zh(-\w+)?|ja|ko)$/

const RULES: Rule[] = [
  { id: 'em-dash', level: 'ban', lang: 'any', re: /—| – | -- /, why: 'dash as the default pause: use a period, comma or colon' },
  // Shapes, English
  { id: 'not-x-but-y', level: 'ban', lang: 'en', re: /\b(?:it'?s |this is |is |are )?not (?:just |only |merely |about )?[^.;!?]{1,60}?,? (?:but|it'?s|it is)\b/i, why: 'contrast reveal: state the true thing with its reason' },
  { id: 'not-x-but-y', level: 'ban', lang: 'en', re: /\b(?:rather than|instead of being|isn'?t (?:just )?about)\b/i, why: 'contrast reveal: say what it is' },
  { id: 'not-x-but-y', level: 'ban', lang: 'en', re: /\bNot because\b/, why: 'contrast reveal' },
  { id: 'negative-anaphora', level: 'ban', lang: 'en', re: /\b(?:no|zero|without) [\w-]+(?: [\w-]+)?[,.] (?:no|zero|without) [\w-]+/i, why: 'negation list: say what does happen; one absence, once, by the button' },
  { id: 'participle-tail', level: 'ban', lang: 'en', re: /, (?:highlighting|showcasing|ensuring|making it|allowing|enabling|providing|offering|helping|giving you|reflecting|underscoring|emphasi[sz]ing|fostering|letting you|so that you can)\b/i, why: 'participle tail: end the sentence at the claim' },
  { id: 'copula-avoidance', level: 'ban', lang: 'en', re: /\b(?:serves as|stands as|acts as|functions as|boasts|represents a|features an? )/i, why: 'use is / has, or the real verb' },
  { id: 'colon-reveal', level: 'ban', lang: 'en', re: /\b(?:The (?:result|catch|best part|secret|kicker|truth|answer|twist)|Here'?s (?:the thing|why|how)|One word)\s*[?:]/i, why: 'self-answered setup: just say it' },
  { id: 'stock-opener', level: 'ban', lang: 'en', re: /\b(?:In today'?s|Whether you'?re|Say goodbye to|Say hello to|Imagine (?:a|never|if)|When it comes to|Look no further|all-in-one|everything you need|at the end of the day|like a pro|power of|reimagined|redefined|next level|built for teams)\b/i, why: 'stock phrase every rival prints' },
  { id: 'uplift-ending', level: 'ban', lang: 'en', re: /(?:changes everything|the future of [\w ]+|shouldn'?t wait|you deserve|is here)[.!]?\s*$/i, why: 'uplift ending: end on a concrete point' },
  { id: 'inflation', level: 'ban', lang: 'en', re: /\b(?:testament|pivotal|seamless(?:ly)?|elevate[sd]?|empower(?:s|ing)?|unlock(?:s|ing)?|unleash|effortless(?:ly)?|game[- ]changer|revolutioni[sz]e|cutting[- ]edge|robust|streamline[sd]?|supercharge|next[- ]level|world[- ]class|best[- ]in[- ]class|leverage[sd]?|delve|tapestry|landscape|transformative|holistic|synergy|innovative|hassle[- ]free|peace of mind|at scale)\b/i, why: 'inflation word: replace with the fact it stands in for' },
  { id: 'era-word', level: 'cap', lang: 'en', re: /\b(?:clearer|dependable|quietly|steady|foster|prioriti[sz]e|matters|multifaceted|genuinely|honestly|load-bearing|actually|truly|incredibly|simply|crucial|vital|powerful|comprehensive)\b/i, why: '2026 model-era word' },
  { id: 'rule-of-three', level: 'cap', lang: 'en', re: /\b[\w'-]+(?: [\w'-]+)?, [\w'-]+(?: [\w'-]+)?,? (?:and|or) [\w'-]+/i, why: 'three-item list: use as many items as the facts have' },
  { id: 'exclamation', level: 'cap', lang: 'en', re: /!/, why: 'exclamation mark in copy' },
  // Shapes, Indonesian
  { id: 'not-x-but-y', level: 'ban', lang: 'id', re: /\b(?:bukan (?:hanya|sekadar|sekedar|cuma)|bukan [^.;!?]{1,50}?,? (?:melainkan|tapi|tetapi|namun))\b/i, why: 'contrast reveal (bukan X, melainkan Y)' },
  { id: 'negative-anaphora', level: 'ban', lang: 'id', re: /\b(?:tanpa|tidak ada|bebas) [\w-]+(?: [\w-]+)?[,.] (?:tanpa|tidak ada|bebas) [\w-]+/i, why: 'negation list (tanpa X, tanpa Y)' },
  { id: 'participle-tail', level: 'ban', lang: 'id', re: /, (?:memastikan|menjadikan|memungkinkan|membuat (?:bisnis|usaha)|sehingga (?:bisnis|usaha|kamu|Anda) (?:bisa|dapat|lebih))\b/i, why: 'trailing clause: end at the claim' },
  { id: 'copula-avoidance', level: 'ban', lang: 'id', re: /\b(?:berfungsi sebagai|hadir sebagai|hadir untuk|menghadirkan|merupakan)\b/i, why: 'use "adalah", or the verb' },
  { id: 'stock-opener', level: 'ban', lang: 'id', re: /\b(?:di era (?:digital|modern)|saatnya|ucapkan selamat tinggal|bayangkan|tak perlu khawatir|jangan khawatir|yuk)\b/i, why: 'stock opener' },
  { id: 'translated-order', level: 'ban', lang: 'id', re: /\b(?:yang mana|dimana|di mana (?!saja)(?=[^?]*$)|adalah sebuah|oleh karena itu|hal ini|dalam rangka|melakukan (?:pembayaran|pemesanan|pencatatan|pengelolaan)|untuk dapat)\b/i, why: 'English clause order or nominal phrasing; compose from the meaning' },
  { id: 'register-anda', level: 'ban', lang: 'id', re: /\bAnda\b/, why: 'this product\'s register is kamu / -mu' },
  { id: 'rule-of-three', level: 'cap', lang: 'id', re: /\b[\w'-]+(?: [\w'-]+)?, [\w'-]+(?: [\w'-]+)?,? (?:dan|atau) [\w'-]+/i, why: 'three-item list' },
  { id: 'exclamation', level: 'cap', lang: 'id', re: /!/, why: 'exclamation mark in copy' },
  // Either language
  { id: 'ownership-line', level: 'ban', lang: 'any', re: /\b(?:is (?:a|an|the) [\w ]{0,30}(?:product|service|brand|company) of\b|is (?:a|an) [\w]+ (?:product|service)\b|is the name (?:they|it|we) (?:ship|ships|go|goes|sell|sells) under|are the first (?:two|three|few)\b|adalah produk|merupakan produk|produk dari \w+$)/i, why: 'ownership explained to the operator: a buyer gains nothing; list the product, put "X by Parent" in the product footer (site-design company-profile.md)' },
  { id: 'and-more', level: 'ban', lang: 'any', re: /\b(?:and (?:much )?more|and so on|dan (?:masih )?(?:banyak )?lagi|dan lain-lain|dll)\b/i, why: '"and more": name the thing or stop the list' },
  { id: 'label-colon', level: 'cap', lang: 'any', re: /^(?:[A-Z][\w']*)(?: [\w']+){0,2}: [A-Z\d]/, why: 'label and colon announcing the sentence' },
]

const ID_WORDS = /\b(?:yang|dan|untuk|dengan|dari|kamu|Anda|tidak|bisa|ini|itu|di|ke|sudah|akan|meja|struk|pesanan|kasir)\b/gi
const EN_WORDS = /\b(?:the|and|for|with|from|you|your|not|can|this|that|is|are|to|of|table|receipt|order)\b/gi

function langOf(text: string, hint?: string): Lang {
  if (hint) return hint.startsWith('id') || hint === 'ms' ? 'id' : 'en'
  const id = text.match(ID_WORDS)?.length ?? 0
  const en = text.match(EN_WORDS)?.length ?? 0
  return id > en ? 'id' : 'en'
}

function clean(s: string): string {
  return s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim()
}

type Item = { where: string; text: string; lang?: string }

function fromJson(v: unknown, path: string[], out: Item[]) {
  if (typeof v === 'string') { out.push({ where: path.join('.'), text: v, lang: path.find((p) => LANG_KEY.test(p)) }); return }
  if (Array.isArray(v)) { v.forEach((x, i) => fromJson(x, [...path, String(i)], out)); return }
  if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) { if (!SKIP_KEYS.has(k)) fromJson(x, [...path, k], out) }
}

function itemsOf(file: string): Item[] {
  const raw = readFileSync(file, 'utf8')
  if (extname(file) === '.json') {
    const all: Item[] = []
    fromJson(JSON.parse(raw), [], all)
    const withLang = all.filter((i) => i.lang)
    return withLang.length ? withLang : all
  }
  return raw.split('\n').map((line, n) => ({ where: `L${n + 1}`, text: line.replace(/`[^`]*`/g, ' ').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/^\s*[#>*-]+\s*/, '').replace(/\|/g, ' . ') }))
}

const args = process.argv.slice(2)
const files = args.filter((a) => !a.startsWith('--'))
const asJson = args.includes('--json')
const regIdx = args.indexOf('--register')
const register = regIdx >= 0 ? args[regIdx + 1] : undefined
const rulesIdx = args.indexOf('--rules')
const rulesFile = rulesIdx >= 0 ? args[rulesIdx + 1] : undefined
if (rulesFile) for (const r of JSON.parse(readFileSync(rulesFile, 'utf8'))) RULES.push({ ...r, re: new RegExp(r.re, r.flags ?? 'i') })
if (!files.length) { console.error('usage: bun ai-prose-scan.ts <file...> [--register kamu] [--rules <file.json>] [--json]'); process.exit(2) }

type Hit = { file: string; where: string; rule: string; level: string; match: string; text: string; why: string }
const hits: Hit[] = []
let scanned = 0
for (const file of files.filter((f) => f !== register && f !== rulesFile)) {
  for (const it of itemsOf(file)) {
    const text = clean(it.text)
    if (!/[A-Za-z]{3}/.test(text)) continue
    scanned++
    const lang = langOf(text, it.lang)
    for (const r of RULES) {
      if (r.lang !== 'any' && r.lang !== lang) continue
      if (r.id === 'register-anda' && register !== 'kamu') continue
      const m = text.match(r.re)
      if (m) hits.push({ file, where: it.where, rule: r.id, level: r.level, match: m[0].trim(), text: text.slice(0, 160), why: r.why })
    }
  }
}

if (asJson) console.log(JSON.stringify({ scanned, hits }, null, 1))
else {
  for (const h of hits) console.log(`${h.file}:${h.where}  [${h.rule}${h.level === 'cap' ? ', cap' : ''}] "${h.match}"  <- ${h.text}`)
  console.log(`${scanned} strings, ${hits.length} hits (${hits.filter((h) => h.level === 'ban').length} ban, ${hits.filter((h) => h.level === 'cap').length} cap)`)
}
process.exit(0)
