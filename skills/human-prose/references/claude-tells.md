# The Claude tells (2026)

Part 1 §24 to §30 of SKILL.md, moved here on 2026-10-27 with the text unchanged. SKILL.md keeps one index line per section, and the Part 4 checklist still runs their searches.

## Contents

- 24. Label, colon, sentence (Claude, 2026)
- 25. Things given human verbs (Claude, 2026)
- 26. Compressed noun stacks (Claude, 2026)
- 27. One-fragment openers (Claude, 2026)
- 28. Mannered prose (Claude, 2026)
- 29. Writing about the previous version, and reasoning leaks (Claude, 2026)
- 30. The coda and the quotable last line (Claude, 2026)

### 24. Label, colon, sentence (Claude, 2026)

A short label, a colon, then the sentence the label announced. The colon stages a reveal
the sentence does not need. Six sources name it, among them Claude Style Patch, FeedHive
(S-07, F-05) and unsloppify (research T2).

| Language | Surface forms |
|---|---|
| English | The fix: · The catch: · Short version: · Honest caveat: · The best part: it's free. |
| Indonesian (UNSURE) | Intinya: · Kuncinya: · Masalahnya: |

- Avoid: "The fix: stya prints the order first."
- Write: "Stya prints the order before it takes payment."

A colon that opens a list, a quotation, a code block or a time stays.

### 25. Things given human verbs (Claude, 2026)

An inanimate subject doing what a person does: a check that bites, a rule that holds, a
figure that earns its place. arXiv 2610.29162 found that all nine frontier models it
tested write more of these than people do, and the 2026 pull-request cluster in the
load-bearing corpus has refused, holds, carries, owed, bites, survived, earns and outranks
among its top words (research T3).

| Language | Surface forms |
|---|---|
| English | refuses · holds · carries · owes · bites · survives · earns · outranks · decides · lands · wedges · lives · sits |
| Indonesian (UNSURE) | aturan ini menolak … · cek ini menahan … |

- Avoid: "A pending answer refuses nothing."
- Write: "While the access check is still loading, the person stays on the screen they opened."

Make the person, or the named screen or function that does the work, the subject, or use
"is". House commit subjects picked the form up in October 2026, so check commits too.

### 26. Compressed noun stacks (Claude, 2026)

Half-sentences made of nouns used as adjectives, with packed phrases pressed against each
other: "Cap the study-lifecycle handlers so a hung study can't wedge the deep-link".
Claude Style Patch traces it to turning a concept into a metaphor, freezing the verb into a
noun phrase and packing the units tight. Anthropic reports Fable 5.1 prose as "denser", and
two sources see it thicken the longer a session runs (research T5).

- Avoid: "Venue-plan unread state now holds pending-not-empty."
- Write: "Until the venue's plan has loaded, the menu shows a loading state instead of an
  empty list."

Keep verbs as verbs, use one figure per sentence at most, and write the sentence you would
say aloud to the reader. Re-check this late in a long session.

### 27. One-fragment openers (Claude, 2026)

A verbless fragment that opens a paragraph to introduce the sentence after it: "Two things
worth watching." "The difference." "One caution." §3 covers runs of fragments, and this is
the single one in front. Japanese does it with a 体言止め opener (「注意点。」), Indonesian
with "Satu hal lagi." (UNSURE).

- Avoid: "One caution. The printer drops jobs over 4 KB."
- Write: "The printer drops any job over 4 KB."

Search `grep -nE '^[A-Z][a-z]+( [a-z]+){0,3}\.$'` and merge each hit into the sentence it
introduces.

### 28. Mannered prose (Claude, 2026)

Anthropic's own term and definition: "Mannered prose substitutes metaphor and flourish for
direct statement. Instead of 'a parameter worth varying,' the mannered writer produces 'a
dial worth turning.' Instead of 'this point still matters,' they write 'this point earns its
keep.'" Its fix is "When a literal phrase is available, use it." The stock props are lever,
ladder, rung, backstop, tripwire, teeth, knob, dial, seat, floor, ceiling, seam, wedge,
engine and fuel, and things that "live" or "sit" somewhere (research T9).

- Avoid: "Rate bands are the lever here."
- Write: "Changing the rate bands changes what an hour costs."

When briefing a model, Anthropic's tested prompt is the full paragraph in
`~/library/research/ai-prose-2026/opus/src/anthropic-prompting-fable-5-1.md` ("Writing
density"), and its short form "Please remove all mannered prose." also works.

### 29. Writing about the previous version, and reasoning leaks (Claude, 2026)

A revised page written to someone who read the old one: a title that names the change
("The cause and the lever were misstated"), findings tagged Revised or Retracted, a "What
changed in v3" table at the top, "does not survive contact with the source data". The
reasoning leak is its sibling, where the writer narrates its own thinking: "I want to be
exact about what this means", "the prior runs the other way". slhck calls it "the giveaway
tone of an AI proving its reasoning rather than informing a reader", and Anthropic says
Opus 5 "narrates readily" (research T10).

- Avoid: "Revised: v2 misstated the cause. The real cause is the printer queue."
- Write: "The printer queue causes the delay."

A changelog keeps history. Every other page says what is true now, to a reader who never
saw the earlier draft.

### 30. The coda and the quotable last line (Claude, 2026)

The epilogue habit: a paragraph after the natural end that wraps up, often in a quiet,
reverent tone, or a last line built to be quoted. A coda can be flat, which is how it
differs from §12 (humanizer-stack, slop-guard's "aphoristic closers", stop-slop's "Cut
quotables"; research T12).

- Avoid: "…and the till prints the summary at close. In the end, a till is only as good
  as the morning after."
- Write: "…and the till prints the summary at close."

Delete the last paragraph, then the last line. Whatever the reader does not miss stays
deleted.
