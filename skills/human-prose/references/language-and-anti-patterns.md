# Part 0 and Part 1: the pattern is universal, the anti-pattern catalogue

Recovered verbatim on 2026-11-03 from SKILL.md at ea7a3d3^ (the commit that moved this text out of SKILL.md did not write the file).

## Part 0 — The pattern is universal, the surface form is local

The tells in Part 1 are not English tells. They are model tells, and every language
receives them through its own grammar. Readers in each language have named the result
independently, and they all named the same thing:

| Language | What readers call it | What it means |
|---|---|---|
| Chinese | 翻译腔 | translation accent |
| Korean | 번역투 | translation style |
| Spanish | "lógica anglosajona" | Anglo sentence logic in Spanish clothes |
| Indonesian | calqued clichés | "di era digital yang serba cepat" is "in today's fast-paced world" translated |

**So the strongest tell in any non-English language is English structure wearing
local vocabulary.** Every word is native, every sentence is grammatical, and the shape
underneath is English. That is what a native reader flinches at, usually without being
able to point to a word.

When you write in another language:

1. **Never translate the English draft.** Compose in the target language, from the
   meaning. A translated sentence keeps English clause order, English connector
   density, and English paragraph rhythm, which is the whole problem.
2. **Do not port this file's fixes literally.** The pattern applies in any language,
   and each language needs its own repair. Splitting a sentence at an em dash is an English repair. In Japanese the same
   idea is repaired by moving the load into ので or ため.
3. **A rule about a specific glyph or word is local, not universal.** See the dash rule
   in Part 1 §5: the same character is a foreign import in one language and standard
   punctuation in another.

If the target language is not covered in this file, derive its surface forms with the
method in `references/language-surface-forms.md` before you start.

---

## Part 1 — Anti-patterns

Each one states the pattern first, then the surface forms per language.

### 1. Explicit antithesis: "not X, it's Y"

The most recognisable tell. Negating something in order to reveal the real point.

| Language | Surface forms |
|---|---|
| English | It's not X, it's Y · Not just X, but Y · Not because X, but because Y · This isn't about X. It's about Y. · Less X, more Y · X isn't the problem. Y is. |
| Japanese | 〜ではなく、〜です · 〜ではありません。〜です · 〜からではなく、〜だからです · 〜というより、むしろ〜 · 問題は〜ではない。〜だ。 |
| Indonesian | bukan X, melainkan Y · bukan hanya X, tetapi juga Y · Ini bukan soal X. Ini soal Y. · lebih dari sekadar X |
| Korean | X가 아니라 Y다 · 단순히 X가 아니라 Y입니다 · 문제는 X가 아니라 Y입니다 · X라기보다는 Y |
| Chinese | 不是……而是…… · 与其说……不如说…… · 问题不在于……而在于…… |
| Spanish | No se trata de X, sino de Y · No solo X, sino Y · No es X. Es Y. |

**Fix:** state the point positively and let the contrast sit implicit.

| Avoid | Write |
|---|---|
| The bottleneck isn't the database, it's the serialisation step. | The serialisation step is the bottleneck. It runs single-threaded and holds the lock for 400 ms. |
| This isn't a redesign, it's a rethink. | We rebuilt the navigation model from scratch. |
| 音が間違っているからではなく、リズムが平らだからです。 | 原因はリズムです。拍のまま平らに読むと、単語の切れ目が伝わりません。 |
| 重要なのは速度ではなく、正確さです。 | 正確さを優先します。速度は許容範囲に収まっていれば十分です。 |
| Ini bukan sekadar laporan, melainkan alat kerja. | Laporan ini dipakai setiap hari saat tutup kasir. |
| 问题不在于速度，而在于准确性。 | 准确性优先。速度只要在可接受范围内就够了。 |

Keep one antithesis per piece at most, and only when the contrast is the point.

### 2. Compulsive rule of three

Three-item lists are over-represented because the rhythm feels resolved. Write as many
items as the content has. When a list is there for its rhythm, replace it with the
sentence that says what you mean, and never cut it to two: a pair chosen to dodge a triple
is the paired cadence in §4 (stop-slop's "Two items beat three" and this file's old "vary
the count to two" both taught it, ONE-Y31.12, 2026-10-27).

- Avoid: "fast, reliable, and secure" / "短く、弱く、はっきり言わない" / "cepat, andal, dan aman"
- Write: "A cold start takes 40 ms, and the service has kept its data through 400 days of
  power cuts at the shop." Or one fact, if only one is true.

Watch especially for adjective triplets, three-bullet lists where the third bullet is
padding, and three-sentence paragraphs that each restate the last.

In Chinese this is the 排比 / 对偶 habit, and it is the single most-cited component of
"AI 味". Chinese rewards parallelism more than English does, which makes the overuse
easier to reach for and just as recognisable.

### 3. The staccato stack

Runs of five-to-eight-word sentences and standalone fragments, used for a dramatic pause
the page cannot deliver.

- Avoid: "Ship it. Then measure. Then decide." / 「三つ目。カタカナの罠です。」
- Write: "Ship it, measure for a week, then decide whether to keep it."

In Japanese this shows up as excessive 体言止め (noun-final fragments). Keep those for
headings.

The mirror image is just as bad and is the dominant failure in Indonesian and Chinese:
every sentence the SAME middling length. Chinese readers describe AI text as 每句都是
20字上下. Indonesian readers describe monotonous, uniformly long formal sentences. The
tell is uniformity in either direction.

### 4. Stacked parallelism and the paired cadence

Two units of matched length and matched grammar set side by side so they read as a set.
Rhetoric calls it isocolon. Readers now call the Claude voice "Claudish", and seven
independent sources name this cadence as its mark (`~/library/research/ai-prose-2026/opus/README.md`
T1, cited below as "research T1" and so on). It is also what a ban on threes turns into, so a draft that passed §2 is where to
look for it.

| Form | English | Indonesian (UNSURE, needs a native reader) |
|---|---|---|
| Comma couplet in a heading or slogan | Two jobs, one binary · Local loop, remote box | Cepat dipasang, murah dijalankan |
| Clipped sentence pair | Shippers scan. Practitioners read. | Kasir mencatat. Dapur menyiapkan. |
| Balanced declarative pair | X is the engine. Y is the moat. · Anyone can build the model. Nobody else has the data. | |
| Announce, then deliver | On paper, X. In practice, Y. · X looks like the win. Y is the actual win. | Di atas kertas X. Kenyataannya Y. |
| Imperative slogan | Emit 1,100 tokens. Ship 237KB. | |
| Inside one sentence | simple and straightforward · X guards it from A; Y guards it from B · for X and for Y | |

By eye, read each pair of adjacent sentences aloud. The pair is the tell when both run
within a few words of the same length, have different subjects and close like a slogan.
Deleting the first sentence often leaves the second still shaped as half of a pair, so
read the survivor again.

By search, in English:

```
grep -nE '^[A-Z][a-z]+( [a-z]+)?, [a-z]+( [a-z]+)?\.?$'   # comma couplets
grep -nE '\. [A-Z][a-z]+ [a-z]+ [a-z]+\.$'               # a short closer; read the sentence before it
grep -noE '\b[a-z]+ and [a-z]+\b' | sort | uniq -c        # doublets that repeat
grep -nE '; [a-z]+ [a-z]+s '                              # semicolon balances
grep -nE 'for [a-z ]+ and for '                           # the doubled "for"
```

Fix it in this order (claude-better-text-skill's ladder):

1. Keep the half that makes the point and cut the other.
2. If both halves are needed and one ranks above the other, make the lesser one a
   subordinate clause (Part 2 §2).
3. If they rank equal, give each its own line with its own fact, at whatever length the
   fact needs.

Jumping to step 2 when step 1 applies merges two subjects into one sentence with two
verbs, and the pair is still there inside it.

- Avoid: "Shops change hours. Stya changes with them."
- Write: "When a shop moves its opening to 06:30, the till opens the first shift at 06:30
  the next morning."

Keep one deliberate parallel per piece at most, where the content itself is a comparison.

### 5. Dashes and connector punctuation — CHECK THE LANGUAGE FIRST

This rule differs per language, and applying the wrong one makes the text incorrect in
that language.

- **English:** use a comma, a full stop or parentheses, and never swap the dash for a
  colon, which turns the sentence into the label-colon line in §24. If a sentence only
  makes sense with a dash, rewrite it. Remove em dashes and en dashes.
- **Japanese:** use 、and 。 normally, and avoid ― as a connector.
- **Chinese:** the 破折号 (——) is STANDARD native punctuation, defined in GB/T
  15834-2011 as a two-character-width mark for annotation, supplement, or a shift in
  sense. Do NOT strip it. The AI tell is DENSITY: 破折号 plus 冒号, 分号, 括号 and 引号
  arriving far more often than a Chinese writer would use them, which readers name as
  翻译腔. Cut the frequency, keep the mark.
- **Korean and Indonesian:** the dash is not a normal connector. Prefer a comma, a
  conjunction or a new sentence.
- **Any other language:** ask whether the mark is native to its punctuation system
  before writing a rule about it (method in `references/language-surface-forms.md`).

The underlying universal is: **do not carry a clause on punctuation that the language
would carry on a conjunction.**

### 6 to 12. General tells (index)

Each section keeps its full text and before/after in [references/general-tells.md](references/general-tells.md).

- **§6 Inflated vocabulary and filler.** Search `delve`, `leverage`, `robust`, `seamless`, `testament to`, `it's worth noting`. The other languages' lists are in the same file.
- **§7 Over-scaffolding and footnote clutter.** Look for a subtitle under every heading, a gloss after every term and a `Note:` on every paragraph.
- **§8 Negation-then-reveal openings.** Search `won't cover`, `Instead,` at the start of a piece.
- **§9 Uniform paragraph shape.** Count sentences per paragraph and items per section.
- **§10 Register drift and misjudged formality.** Check that one register holds from the first line to the last.
- **§11 Borrowed authority.** Search `studies show`, `experts agree`, `相关研究表明`, `tak dapat dipungkiri`.
- **§12 The uplift ending.** Read the last paragraph for encouragement or a widened horizon.

### 13. Negative anaphora and asyndeton: "no X, no Y"

Repetition at the start of successive clauses with the conjunctions stripped out.
Rhetoric calls it anaphora plus asyndeton; it is filler dressed as emphasis, and it is
oral performance transplanted onto a page that does not need it.

- Avoid: "No fluff. No filler. No BS." · "Not a demo. Not a prototype. A product."
- Write what the thing IS: "Setup is one command and takes about a minute."

| Language | Surface forms |
|---|---|
| English | No X. No Y. · Not X. Not Y. · Never X, never Y. |
| Japanese | 〜なし、〜なし · 〜も不要、〜も不要 |
| Indonesian | Tanpa X. Tanpa Y. · Tidak perlu X, tidak perlu Y. |
| Korean | X도 없고, Y도 없다 · X도 필요 없고 Y도 필요 없습니다 |
| Chinese | 不需要X，不需要Y · 没有X，没有Y |
| Spanish | Sin X. Sin Y. · Ni X ni Y. |

Related to §1, and not the same thing. §1 negates one thing to reveal another; this
negates a list to sound decisive. Both can appear in one paragraph.

### 14. Copula avoidance (English-specific)

Refusing the plain verb "to be" in favour of something that sounds weightier:
**serves as, boasts, features, marks, functions as, maintains, stands as, represents,
constitutes**.

- Avoid: "The ledger serves as the single source of truth."
- Write: "The ledger is the single source of truth."

The same instinct in other languages is reaching for an ornate verb where the ordinary
one is correct (Chinese 作为 / 成为 where 是 is meant).

### 15. Present-participle tails (English-specific)

A trailing "-ing" clause bolted onto a finished sentence, adding commentary rather than
information: **..., highlighting the importance of X · ..., underscoring its role ·
..., ensuring compliance · ..., reflecting broader trends · ..., contributing to Y**.

This is among the most recognisable English tells and it is nearly always empty. The
tail claims a significance the sentence never showed.

- Avoid: "The migration moved 15 money columns to int8, underscoring the importance of
  precision in financial systems."
- Write: "The migration moved 15 money columns to int8. Every amount is now in sen."

Japanese produces the same effect by chaining 〜しており、〜を示している. Cut the chain and
let the sentence end.

### 16 to 18. Inflation, section formulas, decoration (index)

Full text in [references/general-tells.md](references/general-tells.md).

- **§16 Significance inflation and promotional adjectives.** Search `pivotal`, `testament`, `indelible`, `vibrant`, `nestled`, `rich tapestry`.
- **§17 Section formulas and outline conclusions.** Search `Challenges and Future Prospects`, `Despite its`, a closing `Conclusion` heading.
- **§18 Formatting used as decoration.** Look for a bold lead-in on every bullet, Title Case headings and emoji.

### 19. Machine markup and citation damage (when reviewing pasted text)

Leftover model markup (`oaicite`, `[cite: 1]`, `grok_card`, stray 【】) and broken citations prove the
text was never read before it was pasted. Read [references/machine-markup-and-citations.md](references/machine-markup-and-citations.md)
for the per-model residue table and the citation checks, then strip and verify before shipping.

### 20 to 30. The 2026 and Claude tells (index)

Each section below keeps its full text, surface forms and before/after in the linked file. Search the draft for the forms named here, then read the section for the fix.

- **§20 Corrective framing and disclaimers.** Search `rather than`, `not simply`, `does not establish`, `less like a`. Full text in [references/tells-2026-framing.md](references/tells-2026-framing.md).
- **§21 Importance flags and tradeoff-free promises.** Search `matters because`, `without sacrificing`, `without losing`. Same file.
- **§22 Evaluative adjectives that rate without describing.** Search `dependable`, `practical`, `meaningful`, `genuinely`, `single most`. Same file.
- **§23 Premise stacking and announced counts.** Search `Two constraints`, `Four reasons` and an evidence paragraph before the point. Same file.
- **§24 Label, colon, sentence.** Search `The fix:`, `The catch:`, `Short version:`, `Intinya:`. Full text in [references/claude-tells.md](references/claude-tells.md).
- **§25 Things given human verbs.** Search `refuses`, `holds`, `carries`, `bites`, `earns`, `lives`, `sits` with a thing as the subject. Same file.
- **§26 Compressed noun stacks.** Search hyphenated noun runs such as `venue-plan unread state`. Same file.
- **§27 One-fragment openers.** Search `grep -nE '^[A-Z][a-z]+( [a-z]+){0,3}\.$'` for lines like `One caution.` Same file.
- **§28 Mannered prose.** Search `lever`, `dial`, `rung`, `backstop`, `tripwire`, `seam`, `wedge`. Same file.
- **§29 Writing about the previous version, and reasoning leaks.** Search `Revised`, `Retracted`, `What changed in`, `I want to be exact`. Same file.
- **§30 The coda and the quotable last line.** Search the last paragraph and the last line of the piece. Same file.

