---
name: "blind-translation"
description: "Use BEFORE adding a language or locale to any product (an iOS String Catalog or .xcstrings, Android strings, a web _locales or i18n folder, App Store copy per storefront), and when existing non-English strings read as translated or someone says a locale sounds off. Localises by having each language written from the screen by a writer who never sees the source string, then checks the draft back against meaning, for the tells of translation and for fit."
when_to_use: "Triggers: requests to localise, translate or add a language, complaints that a locale sounds machine-translated, and per-storefront or per-locale copy."
---

# Blind translation

> **Local notes.** If `~/.claude/skill-notes/blind-translation.md` exists, read it before starting. It
> holds this user's own folders, project rules and examples, and where it disagrees with
> this file, it wins.

A translated string keeps the source language's clause order, connector density and
rhythm. Every word is native and the shape underneath is English, which is the thing a
native reader flinches at. The repair is to never hand the writer the English sentence.

`human-prose` says compose in the target language rather than translate. This skill is
how that survives contact with fifty keys and a deadline: the writer is given the
screen, not the sentence, and nothing about the result is trusted until it is checked.

## The rule

**The writer of a locale never sees the source string.** They see what the screen is,
what the person is about to do, and what the string has to accomplish. They write what
someone in that language would say at that moment.

The English (or whatever the product was built in) is a peer locale written the same
way, never the master the others descend from. Write that down in the repo: no locale is
the source the others are translated from.

## The loop

Copy this checklist into your reply and tick items off:

```
- [ ] 1. Brief built per key, in a file
- [ ] 2. One parallel writer per language, no source string given
- [ ] 3. Drafts collected with back-translations
- [ ] 4. Back-translation matches the brief (mismatch: fix the brief, re-run that key)
- [ ] 5. human-prose Part 1 clean for each language (a tell found: return to step 2 for that language)
- [ ] 6. Every locale rendered on the real surface (clipped or broken: return to step 2 with the length budget)
- [ ] 7. Review table handed over
```

1. **Build the brief, once per key.** For each string: which screen, what the person
   just did, what happens when they act, the control's role (title, button, error,
   empty state), the length budget in characters, and every variable with an example
   value. Name the register: who is speaking to whom. This is the only thing the
   writers receive.
2. **Spawn one writer per language, in parallel.** A subagent per locale. Give it the brief, the target language, the repo's copy rules
   (`human-prose`, the project's own copy and design docs) and nothing else. Tell it
   explicitly that no source string exists and that it must not ask for one.
3. **Collect drafts.** Each writer returns, per key: the string, a literal
   back-translation into the orchestrator's language, and one line on the register or
   grammar choice it made.
4. **Check meaning, not wording.** The orchestrator compares the back-translation with
   the brief. A mismatch means the brief was thin or the writer guessed; fix the brief
   and re-run that key rather than editing the string toward the English.
5. **Check the tells.** Run `human-prose` Part 1 for that language over the draft:
   antithesis frames, connector scaffolding, register drift, calqued clichés, the
   dash rule for that script.
6. **Check the fit.** Render every locale on the real surfaces and look. Japanese and
   German break row widths before they break grammar, and a clipped string is a bug.
7. **Hand the user a review table.** Key, target string, back-translation, one-line
   reason. A wrong line has to be obvious without reading code.

## What the writers must be told

- The screen and the moment, never the sentence.
- Variables with real example values, so plural and counter forms come out right.
- The length budget, in the units the surface actually enforces.
- The product's own vocabulary: the words this product has already decided on in that
  language, so two screens never name one thing twice.
- Who the reader is. An owner closing a till and a first-time visitor are different
  people, and the politeness level follows from that.

## Pinning it so it cannot rot

A locale is only correct until the next contributor edits it. Leave a test, not a
promise: pin the known-wrong spellings of each language in a test, and scan punctuation
the language does not use. A page outside the copy guards otherwise breaks the language's
own spelling rules unseen.

Per language, pin what a native reader would catch instantly: the wrong member of a
spelling family, the space where the orthography wants a hyphen, the honorific the
product does not use, the punctuation that is foreign to the script.

## When not to use it

- **A language nobody on the project can judge.** Ship English there instead, or buy a
  native review. Three checkable languages beat fifteen unverifiable ones.
- **Legal, medical or safety text.** That goes to a human translator.
- **Proper nouns, brand names and units.** Those are data, not prose.

## Orchestration notes

- Writers run in parallel and never read each other's output, so one locale's phrasing
  cannot leak into the next.
- Keep the brief in a file, not in chat, so a re-run months later is identical.
- Record per key which brief produced it. When a string changes, the brief changes
  first and every locale is re-written from it, rather than the other locales being
  patched to match the new English.
