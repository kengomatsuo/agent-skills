---
name: "human-prose"
description: "Strips LLM tells from prose a person will read, in any language, and applies human editorial patterns. Use BEFORE writing or reviewing docs, README files, UI copy, error messages, commit messages, release notes, teaching material, articles, emails, slide decks and marketing pages. Covers the tells (antithesis, rule of three, negative anaphora, staccato fragments, copula avoidance, participle tails, significance inflation, dash and footnote clutter, inflated vocabulary, translationese, decorative formatting, leftover model markup) with concrete surface forms for English, Japanese, Indonesian, Korean, Chinese and Spanish, and a method for any other language. Also use when a draft \"sounds like AI\" or the user asks for a style or copy review."
---

# Human Prose (any language)

> **Local notes.** If `~/.claude/skill-notes/human-prose.md` exists, read it before starting. It
> holds this user's own folders, project rules and examples, and where it disagrees with
> this file, it wins.

A ruleset for writing that a person will read. It exists because LLM prose has a
recognisable voice, and readers notice it even when they cannot name what they noticed.

The techniques below are not bad in themselves. Antithesis, tricolon, and parallelism
are classical rhetoric and appear throughout good human writing. The problem is
frequency: LLMs deploy them constantly, which turns a special effect into a tic. Colin
Gorrie's rhetorical analysis of AI prose makes this point precisely, and it is the frame
this skill works from. Use each device once when it earns its place, and not otherwise.

Apply this to prose only. Do not apply it to code, config, data, or quoted material.

---

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

**So the single strongest tell in any non-English language is English structure wearing
local vocabulary.** Every word is native, every sentence is grammatical, and the shape
underneath is English. That is what a native reader flinches at, usually without being
able to point to a word.

Three consequences for how you work:

1. **Never translate the English draft.** Compose in the target language, from the
   meaning. A translated sentence keeps English clause order, English connector
   density, and English paragraph rhythm, which is the whole problem.
2. **Do not port this file's fixes literally.** The pattern carries over to any language,
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

One antithesis per piece is fine if the contrast is genuinely the point. Zero is safer.

### 2. Compulsive rule of three

Three-item lists are over-represented because the rhythm feels resolved. Vary the count
to two, four, or a sentence.

- Avoid: "fast, reliable, and secure" / "短く、弱く、はっきり言わない" / "cepat, andal, dan aman"
- Write: "fast and reliable" or the full sentence that says what you actually mean.

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

### 4. Stacked parallelism

Balanced clause pairs and repeated sentence frames used as decoration. One deliberate
parallel structure per piece is plenty.

### 5. Dashes and connector punctuation — CHECK THE LANGUAGE FIRST

This rule is genuinely different per language, and getting it wrong produces text that
is not merely AI-flavoured but incorrect.

- **English:** use a comma, colon, full stop, or parentheses. If a sentence only holds
  together with a dash, rewrite it. Remove em dashes and en dashes.
- **Japanese:** use 、and 。 normally, and avoid ― as a connector.
- **Chinese:** the 破折号 (——) is STANDARD native punctuation, defined in GB/T
  15834-2011 as a two-character-width mark for annotation, supplement, or a shift in
  sense. Do NOT strip it. The AI tell is DENSITY: 破折号 plus 冒号, 分号, 括号 and 引号
  arriving far more often than a Chinese writer would use them, which readers name as
  翻译腔. Cut the frequency, keep the mark.
- **Korean and Indonesian:** the dash is not a normal connector. Prefer a comma, a
  colon, or a new sentence.
- **Any other language:** ask whether the mark is native to its punctuation system
  before writing a rule about it (method in `references/language-surface-forms.md`).

The underlying universal is: **do not carry a clause on punctuation that the language
would carry on a conjunction.**

### 6. Inflated vocabulary and filler

**English:** delve, leverage, robust, seamless, effortless, unlock, harness, elevate,
navigate (figurative), landscape (figurative), realm, testament to, at its core,
it's worth noting, in today's fast-paced world, let's dive in.

**Other languages:** read `references/language-surface-forms.md` for the Japanese, Indonesian,
Korean, Chinese and Spanish word lists before writing or reviewing in those languages.

### 7. Over-scaffolding and footnote clutter

Signs of it: a subtitle under every heading, a parenthetical gloss after every term, a
grey caption at the foot of every slide, a "Note:" on every paragraph, bold lead-ins on
every bullet, a summary that repeats the section that just ended.

Rules:

- Caveats and sourcing go in one place at the end, or in speaker notes, not scattered.
- If a slide or card needs a footnote to make sense, fix the slide.
- Small grey print teaches nothing. Either it matters and gets normal weight, or it goes.

The connector-scaffold version of this is the clearest AI tell in Chinese and Korean:
首先 / 其次 / 此外 / 最后 / 总之 in Chinese, and 그리고 / 하지만 / 그래서 / 또한 / 따라서
in Korean, applied to every joint whether or not the logic needs marking. Human writers
leave most joints unmarked and let the sentences carry the relation.

### 8. Negation-then-reveal openings

Building tension by ruling things out before saying the thing.

- Avoid: "We won't cover X today. Instead, ..." / 「今日は〜はしません。そのかわり、〜」
- Write: "Today covers X." Then move on.

### 9. Uniform paragraph shape

Every paragraph three sentences long, every section the same depth, every bullet the
same length. Vary it. Some points need one line, some need six.

### 10. Register drift and misjudged formality

The model picks a register and then fails to hold it, or picks the wrong one for the
language entirely. This barely shows in English and is glaring elsewhere (Korean speech
levels, Japanese です・ます against だ・である, Indonesian school-essay passives, Chinese
bureaucratic phrasing). Pick one register, hold it to the last sentence, and read
`references/language-surface-forms.md` for the per-language rules.

### 11. Borrowed authority

Claims that sound sourced and are not: 大量实践证明, 相关研究表明, "studies show",
"experts agree", "tak dapat dipungkiri", "es bien sabido". Chinese readers list this as
a distinct marker: the argument is 很完整 but 证据不足. Either cite the actual source or
make the claim in your own voice and own it.

### 12. The uplift ending

Closing on encouragement, synthesis, or a widened horizon that the piece did not earn.
Chinese readers describe it as writing 像个好学生 hoping for the teacher's praise;
Spanish readers describe an excess of empathy and motivational tone. English does it
with "and that's the real power of X". Stop when the content stops.

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
tail asserts significance the sentence did not earn.

- Avoid: "The migration moved 15 money columns to int8, underscoring the importance of
  precision in financial systems."
- Write: "The migration moved 15 money columns to int8. Every amount is now in sen."

Japanese produces the same effect by chaining 〜しており、〜を示している. Cut the chain and
let the sentence end.

### 16. Significance inflation and promotional adjectives

Claiming importance instead of demonstrating it: **stands as a testament to, plays a
pivotal/crucial/vital role, left an indelible mark, reflects broader trends, a rich
tapestry of**. And the brochure adjectives: **vibrant, rich, nestled, diverse array,
groundbreaking, seamless, robust**.

State the fact and let the reader judge the importance. If the significance genuinely
needs saying, say it as a claim with a mechanism behind it (Part 2 §1).

This is the same instinct that Chinese readers call 假大空 and Spanish readers call the
motivational register. See §6 for those vocabularies.

### 17. Section formulas and outline conclusions

Whole sections that exist because the shape expects them, not because there is content:
"Challenges and Future Prospects", "Awards and Recognition", any section opening
"Despite its X, it faces several challenges", and a Conclusion that restates the
introduction.

Also: every section ending in a one-line summary of the section. Stop when the content
stops. A reader who needed the recap will scroll up.

### 18. Formatting used as decoration

- A **bold lead-in on every bullet**, which cancels the emphasis it was meant to give.
- Title Case On Every Heading.
- Emoji as structure.
- A thematic break between every section.
- Headings that contain only subheadings and no prose.
- Curly quotes mixed with straight ones inside one document.

Bold is for the sentence a skimming reader must not miss. If every bullet has one, none
of them do.

### 19. Machine markup and citation damage (when reviewing pasted text)

Leftover model markup (`oaicite`, `[cite: 1]`, `grok_card`, stray 【】) and broken citations prove the
text was never read before it was pasted. Read [references/machine-markup-and-citations.md](references/machine-markup-and-citations.md)
for the per-model residue table and the citation checks, then strip and verify before shipping.

---

## Part 2 — Desired patterns

Taken from human instructional and technical writing. These hold in every language;
only the grammar used to achieve them changes.

### 1. Claim, then mechanism, then example

Name the property, explain what it causes, show it happening. No wind-up, no rhetorical
question, no punchline.

> English is a stress-timed language. This means the timing is built around stressed
> syllables, which are longer and have clearer vowels. Unstressed syllables get shorter
> and their vowels reduce to schwa.

### 2. Carry logic in subordination, not in fragments

Connected sentences explain. Short declaratives assert. Each language has its own
machinery for this, and using the native machinery is what kills the translation accent.

| Language | Use |
|---|---|
| English | because, so that, once, when, since, if |
| Japanese | ので, ため, と, 場合, たら |
| Indonesian | karena, sehingga, setelah, kalau, saat |
| Korean | 〜기 때문에, 〜도록, 〜면, 〜자마자 (verb-ending subordination, not connector adverbs) |
| Chinese | 因为…所以, 只要…就, 一旦, 等到 (and often no connector at all: Chinese carries relation by order) |
| Spanish | porque, para que, una vez que, cuando, si |

### 3. Define a term once, then reuse the same word

Do not cycle through synonyms for variety. If it is a thought group, call it a thought
group every time. This matters more, not less, in languages with rich synonym sets.

### 4. Give the reader something to do with their hands

Instructional writing is concrete about action.

> Put your tongue tip lightly between your teeth and blow.

Not: "This sound is difficult for many learners."

### 5. Directions blocks in exercises

> **How to do it:** Listen to the audio and circle A or B.
> **やり方：** 音声を聞いて、A か B に丸をつけてください。
> **Cara mengerjakan:** Dengarkan audio, lalu lingkari A atau B.

### 6. Flat register

No exclamation marks. No promises of transformation. No "here's the interesting part".
The material carries itself. In languages with grammatical politeness, flat means
consistent, not cold: pick the level and hold it.

### 7. Say the difficulty plainly

> This sound takes most Japanese speakers a few weeks. That is normal.

Not: "It might seem hard at first, but don't worry, you'll get it in no time!"

### 8. Vary sentence length deliberately

A long explanatory sentence followed by a short one lands. Six short ones in a row read
as a machine reaching for emphasis, and twenty of the same middling length read as a
machine that never stopped.

---

## Part 3 — Software and product copy

The same rules, with specifics.

**Error messages.** Say what happened, then what to do. No "Oops!", no "Something went
wrong", no apologies.

- Avoid: "Oops! Something went wrong. Please try again."
- Write: "Couldn't save the file. The folder is read-only. Choose a different folder."

**Buttons and labels.** Verb plus object. "Save draft", not "Get started". Avoid
"Learn more" when you can name the thing: "Read the setup guide".

**Empty states.** Say what goes here and how to add the first one. Skip the illustration
caption that says "Nothing here yet!"

**Commit messages.** Imperative mood, what changed and why. "Fix race condition in
session refresh" rather than "This commit fixes...".

**Docs and READMEs.** Open with what the thing does and who it is for. Cut "In this
guide, we will explore", "Let's dive in", and the closing "Conclusion" section that
restates the intro.

**Code comments.** Explain why the code is the way it is. The what is already on screen.

**Release notes.** One line per change, in the user's vocabulary, not the codebase's.

**Localised UI copy.** A translated string carries the source language's rhythm into a
UI that is read in fragments, which is where translationese is most obvious. Write each
locale's string from the meaning, not from the English. Never concatenate translated
fragments: word order moves. Where the project's own design rules bind, they
win on structure; this file governs voice.

---

## Part 4 — Revision checklist

Run this over any draft before shipping. Fix every hit by restructuring, then run the list again on
the rewritten text, and ship only when a pass finds nothing. Items marked [L] need the target language's
own forms from Part 1 or `references/language-surface-forms.md`.

- [ ] [L] Search the antithesis forms. English `not just`, `it's not`, `isn't about`;
      Japanese `ではなく`, `ではありません`, `というより`; Indonesian `bukan`, `melainkan`;
      Korean `아니라`; Chinese `不是……而是`, `与其说`; Spanish `sino`. Rewrite every hit.
- [ ] Count three-item lists. More than one per section means change a count.
- [ ] Measure sentence-length spread. If every sentence is within a few words of every
      other, vary them. If a run of very short ones is doing drama, join them.
- [ ] [L] Apply the dash rule FOR THIS LANGUAGE (Part 1 §5). Strip in English. Thin out,
      do not strip, in Chinese.
- [ ] [L] Search that language's inflated-vocabulary list.
- [ ] [L] Check connector density: 首先/其次/总之, 그리고/하지만/따라서, first/next/finally.
      Delete the ones the logic did not need.
- [ ] [L] Check register consistency to the last sentence, and that no three consecutive
      sentences share an ending form.
- [ ] Check paragraph lengths. If they are all the same, vary them.
- [ ] Check headings: does every one have a subtitle or gloss under it? Cut them.
- [ ] Find claims of the form "research shows" with no research. Cite or own them.
- [ ] Search `No ` and `Not ` at the start of consecutive sentences (§13). One negated
      list is a tic; write what the thing is instead.
- [ ] [EN] Search `serves as`, `boasts`, `features`, `functions as`, `stands as`. Most
      want to be `is`.
- [ ] [EN] Search `, highlighting`, `, underscoring`, `, ensuring`, `, reflecting`,
      `, contributing`. Delete the tail or promote it to a real sentence.
- [ ] Search the significance words: `testament`, `pivotal`, `crucial`, `vital`,
      `indelible`, `tapestry`, `vibrant`, `nestled`, `groundbreaking`.
- [ ] Check for sections that exist only because the shape expects them, and for a
      Conclusion that restates the intro.
- [ ] Check formatting: a bold lead-in on every bullet, title case everywhere, emoji as
      structure, a rule between every section. Cut to what earns it.
- [ ] For pasted text: search `oaicite`, `contentReference`, `[cite:`, `grok_card`, `【`,
      and `utm_source=`. Verify every citation resolves.
- [ ] Check the ending. If it widens, uplifts, or summarises what was just said, cut it.
- [ ] Read it aloud. Anywhere it sounds like a speech, flatten it.
- [ ] For any non-English draft: would a native reader say this was translated? If the
      words are native but the clause order is English, rewrite from the meaning.

---

## When the user pushes back

If someone says a draft still sounds like AI, do not reword the same sentence. Find which
pattern from Part 1 is present, name it, and restructure. Rewording preserves the shape,
and the shape is what the reader noticed.

For a non-English draft, check Part 0 first. The complaint is usually not any single
sentence but the English skeleton under all of them, and no amount of local word-swapping
will fix that.

---

## Reference files

Read these only when the task needs them. Every file is linked here, so none of them needs another one.

- [references/language-surface-forms.md](references/language-surface-forms.md): inflated vocabulary and register rules for Japanese, Indonesian, Korean, Chinese and Spanish, and the method for deriving the forms of any other language (the six-step method that Part 0 points to). Read before writing or reviewing non-English prose.
- [references/machine-markup-and-citations.md](references/machine-markup-and-citations.md): per-model markup residue and citation checks for pasted text.
- [references/sources.md](references/sources.md): the articles and standards this skill was built from.

### Absorbed catalogues

Two third-party prose skills were merged in rather than left competing for the same trigger. They are
English-only and do not outrank this file; where one disagrees with it, this file stands. Reach for them
when you want a longer catalogue of a specific tell or a worked before/after. The unslop entry file routes
to `commands/`, `presets/`, `scripts/` and `maintenance` files that are not bundled: skip those routes and
use the files listed here.

deslop (from `stephenturner/skill-deslop`, MIT, copied 2026-09-10; its tropes list comes from tropes.fyi,
which carries no licence, so read it at https://tropes.fyi instead):

- [references/deslop.md](references/deslop.md): entry point, the short rules and a quick scoring check.
- [references/deslop-structures.md](references/deslop-structures.md): structures to avoid (binary contrasts, negative listings, fragmentation, rhetorical setups).
- [references/deslop-phrases.md](references/deslop-phrases.md): phrases to remove or replace.
- [references/deslop-examples.md](references/deslop-examples.md): before/after transformations.

unslop (from `theclaymethod/unslop`, MIT, copied 2026-09-10), a two-pass diagnose-then-rewrite flow:

- [references/unslop.md](references/unslop.md): entry point and routing.
- [references/unslop-core-contract.md](references/unslop-core-contract.md): the rewrite contract; read for every audit or rewrite.
- [references/unslop-pipeline.md](references/unslop-pipeline.md): tiered execution for multi-agent harnesses.
- [references/unslop-rubric.md](references/unslop-rubric.md): strict 8-criterion scoring.
- [references/unslop-edit-library.md](references/unslop-edit-library.md): before/after edit patterns.
- [references/unslop-taboo-phrases.md](references/unslop-taboo-phrases.md): the densest phrase catalogue.
- [references/unslop-fact-preservation.md](references/unslop-fact-preservation.md): what a rewrite must leave unchanged.
- [references/unslop-rewrite-examples.md](references/unslop-rewrite-examples.md): compact executable examples.
- [references/unslop-personality-guide.md](references/unslop-personality-guide.md): restoring voice after the tells are removed.
- [references/unslop-calibrate.md](references/unslop-calibrate.md) and [references/unslop-mimic.md](references/unslop-mimic.md): voice calibration and mimicry internals.
