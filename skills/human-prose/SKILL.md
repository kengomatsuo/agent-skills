---
name: "human-prose"
description: "Removes LLM tells and applies human editing in any language, and writes text agents parse. Use before writing or reviewing prose a person reads."
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
Gorrie's rhetorical analysis of AI prose makes this point, and it is the frame this skill
works from. Use a device where the content calls for it, and at most once per piece.

Apply this to prose only. Do not apply it to code, config, data, or quoted material.

---


## Core rules

1. **The shape is the tell, not the words.** Rewording a sentence keeps its shape; restructure it. Name the pattern first.
2. **Non-English prose is composed from the meaning, never translated.** Every language has its own surface forms of each tell (Chinese 翻译腔, Korean 번역투, Spanish "lógica anglosajona"). A rule about one glyph or word, such as the dash, is local.
3. **No antithesis ("not X, it's Y")**, no rule of three, no staccato stack, no stacked parallelism, no negative anaphora ("No X. No Y."), no copula avoidance (`serves as`), no participle tails (`, highlighting…`), no significance inflation (`testament`, `pivotal`), no uplift or restating ending.
4. **Use a device only where the content calls for it, once per piece.** Fix a hit by restructuring, then re-scan; a fix often makes a neighbouring tell (a three cut to a pair, a dash turned into a colon label).
5. **Claim, then mechanism, then example.** Define a term once and reuse the word. Name the person, the price, the day or the failure; a line a rival's page could say word for word goes.
6. **Software copy** (errors, buttons, empty states, commits, comments, release notes) follows `references/product-copy.md`.
7. **Text an agent parses** follows `references/machine-read-text.md`.

## Where the parts are

Read the part the task needs, not all of them.

| Need | File |
|---|---|
| Writing or reviewing in any language: the Part 0 method, then the Part 1 catalogue (§1 to §30; read the section for the language you write in) | [references/language-and-anti-patterns.md](references/language-and-anti-patterns.md) |
| Shaping a draft (Part 2: claim-mechanism-example, subordination, one term, directions blocks, flat register, sentence length) | [references/desired-patterns.md](references/desired-patterns.md) |
| Before shipping any draft: the revision checklist with greps (Part 4) | [references/checklist.md](references/checklist.md) |
| Product copy (Part 3) | [references/product-copy.md](references/product-copy.md) |
| What removes a tell and what only moves it | [references/what-removes-a-tell.md](references/what-removes-a-tell.md) |

## When the user pushes back

If someone says a draft still sounds like AI, do not reword the same sentence. Find which pattern from Part 1 is present, name it, and restructure. For a non-English draft, check Part 0 first: the complaint is usually the English skeleton under all the sentences.

---

## Reference files

Read these only when the task needs them. Every file is linked here, so none of them needs another one.

- [references/language-surface-forms.md](references/language-surface-forms.md): inflated vocabulary and register rules for Japanese, Indonesian, Korean, Chinese and Spanish, and the method for deriving the forms of any other language (the six-step method that Part 0 points to). Read before writing or reviewing non-English prose.
- [references/ai-tells-2026.md](references/ai-tells-2026.md): the 2026 tells with surface forms, before/after pairs and sources, grouped as framing, evaluation words, the Claudish word list, structure and process, plus the Indonesian rows. Read when a draft passed Part 4 and still reads as AI, and before writing a decision sheet.
- [references/machine-read-text.md](references/machine-read-text.md): Simplified Technical English rules for text an agent or program parses with no human to resolve ambiguity (tool descriptions, error strings, inter-agent instructions, status lines). Read before writing or rewriting such text.
- [references/machine-markup-and-citations.md](references/machine-markup-and-citations.md): per-model markup residue and citation checks for pasted text.
- [references/general-tells.md](references/general-tells.md), [references/tells-2026-framing.md](references/tells-2026-framing.md) and [references/claude-tells.md](references/claude-tells.md) hold the full text of Part 1 §6 to §12, §16 to §18 and §20 to §30, which the body indexes.
- [references/product-copy.md](references/product-copy.md) holds Part 3, the rules for error messages, buttons, empty states, commits, docs, comments and release notes.
- [references/what-removes-a-tell.md](references/what-removes-a-tell.md) lists the editing methods the sources tested and how each one changed the reader's verdict.
- [references/sources.md](references/sources.md): the articles and standards this skill was built from.

### Absorbed catalogues

Two third-party prose skills were merged in rather than left competing for the same trigger. They are
English-only and do not outrank this file; where one disagrees with it, this file stands. Their
advice to answer a triple with two items was changed in the copies here on 2026-10-27 (§2). Reach for them
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
