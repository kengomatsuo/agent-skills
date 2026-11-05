---
name: "human-prose"
description: "Writes and edits prose a person reads so it reads as a person's, in any language, including landing-page and marketing copy; also writes text agents parse. Use before writing or reviewing prose, site copy, emails or docs."
---

# Human Prose (any language)

> **Local notes.** If `~/.claude/skill-notes/human-prose.md` exists, read it before starting. It
> holds this user's own folders, project rules and examples, and where it disagrees with
> this file, it wins.

Readers who use chatbots themselves spot machine text almost every time (five such readers
misjudged 1 article in 300 in a 2025 study). They do not react to one word. They react to a
cluster: inflated words, a sentence shape repeated through the page, claims nobody could check,
and a rhythm that never changes. Every rule below comes from research fetched on 2026-11-05,
listed with URLs in [references/sources.md](references/sources.md).

Apply this to prose. Code, config, data and quoted material stay as they are.

## How to write it

Write toward the target. A list of banned words only moves the writer to the next stock word,
and Wikipedia's editors note that a flagged word's synonyms are not flagged at all.

1. **Start from the reader's question.** Before a sentence exists, write down who reads this and
   what they came to find out. A restaurant owner on a pricing page wants the price and what it
   includes. Answer that first.
2. **Collect the facts only this writer has.** A price, a count, a name, a day, a screen, a
   thing that went wrong, a customer's own words. Professional editors of LLM drafts added
   detail as often as they cut (LAMP, CHI 2025). If you have no facts, ask for them or say the
   draft is a placeholder. Style edits cannot make an empty claim read as human.
3. **Write it the way you would say it to that reader.** Use "you" and "we" or "I" where a person
   is speaking. Use is, has, uses, costs, and the plain verb (wrote, moved, tried). Join ideas
   with the words a speaker uses: and, but, so, because, which, when. A sentence may start with
   And or But.
4. **Let length follow the thought.** Some sentences run to thirty words because the idea has a
   condition in it, and some are four words because the point is short. Commas, parentheses, a
   colon before a list and the odd dash are all available. In late 2026 the machine voice is a
   page of periods and commas with every sentence between 8 and 20 words (Wikipedia, GPT-6 era),
   so a clipped page is now as much a tell as a long-winded one.
5. **Give the action a verb and a person.** LLMs write participle tails (", highlighting the…")
   at up to 5 times the human rate and nominalizations at about twice it (Reinhart et al., PNAS
   2025). "The implementation of tracking enables reduction of waste" becomes "When you count
   stock, you throw less away."
6. **Say it once.** One name per thing, used every time. No paragraph that restates the last one,
   and no closing line that sums up the page.
7. **Read it aloud.** Wherever you would not say it to the reader across a table, rewrite that
   sentence from what you mean.

## What gives text away in 2026

These are the patterns readers and studies catch now. One of them on a page is chance; several
together are the tell. The catalogue, with model eras and examples, is
[references/ai-tells-2026.md](references/ai-tells-2026.md).

- **Words of the current model era**, in clusters. GPT-6 era (mid-2026 on): clearer, dependable,
  practical, quietly, steady, foster, leverage, prioritize, matters, multifaceted. Claude: genuinely,
  honestly, load-bearing, actually, and figures such as lever, dial or "earns its keep". Older
  eras (delve, tapestry, testament, pivotal, showcasing, enhance) still turn up from older tools.
- **Sentence shapes repeated through a page**: "not X but Y" and "Y rather than X", three items
  where the content has two or four, a label and colon before the sentence it announces, a
  one-fragment opener ("One caution."), and a paragraph that ends on a quotable moral.
- **Inflation with no fact under it**: significance claims (marks a turning point, plays a key
  role), "serves as" and "features" where "is" and "has" are meant, praise with no number, and
  benefits that cost nothing.
- **Uniform rhythm and punctuation**, as in step 4 above.
- **Formatting**: bold lead-ins on every bullet, title case headings, emoji as structure, a
  heading on every short section.
- **Reasoning on the page**: "I want to be precise here", notes about the previous draft, "So, to
  answer your question".

Some things that used to be called tells are not. Wikipedia lists these as ordinary in human
writing: "very", "perhaps", "tends to", "in order to", a true "the first" or "the only", perfect
grammar, a mix of casual and formal, and a transition word on its own. Keep them where a person
would say them.

## Fixing a draft

Name the pattern, then rewrite the sentence from its meaning and its fact. Swapping a word keeps
the shape, and the shape is what the reader caught. The method and a set of before/after pairs
from real pages are in [references/editing.md](references/editing.md).

If someone says a draft still sounds like AI, look first for a missing fact, then for one shape
repeated down the page, then for rhythm. Changing words is the last thing to try.

## Marketing and landing-page copy

Headlines, subheads, feature lines and buttons follow
[references/marketing-copy.md](references/marketing-copy.md). The short version: say what the
product does for this reader in the words they use, put the checkable fact (price, time, count,
name) in the line, and name the button after what happens when it is pressed. Copyhackers moved a
button from "Sign up now" to "Show me outfits I'll love" and clicks rose 124%.

## Other text

| Text | Read |
|---|---|
| Error messages, buttons, empty states, commits, docs, comments, release notes | [references/product-copy.md](references/product-copy.md) |
| Any language other than English | [references/language-surface-forms.md](references/language-surface-forms.md) |
| Text an agent or program parses (tool descriptions, inter-agent instructions, status lines) | [references/machine-read-text.md](references/machine-read-text.md) |
| Text pasted from a chatbot (leftover markup, broken citations) | [references/machine-markup-and-citations.md](references/machine-markup-and-citations.md) |
| Where each claim in this skill comes from | [references/sources.md](references/sources.md) |

## Final check

Run this on the finished draft, in order. Fix by rewriting the sentence, then run it again on what
you changed.

1. For each paragraph, say aloud what the reader learns from it. If the answer is nothing new,
   cut the paragraph.
2. Underline every number, name, price, time and quoted customer phrase. A page or section with
   none is generic: add the fact or ask for it.
3. For each claim, ask whether a competitor's page could print it word for word. If so, replace
   it with what only this product does or costs.
4. Count sentence lengths in one paragraph. If they all sit between 8 and 20 words, or several
   short ones in a row are doing drama, rejoin or split by meaning.
5. Scan for the shapes in "What gives text away": "not … but", "rather than", label colons, lists
   of three, fragment openers, participle tails, "serves as". Keep one where it is the clearest way
   to say the thing, and rewrite the rest.
6. Scan for the current era words. More than two on a page means the page was written on autopilot:
   rewrite those sentences from their facts, without reaching for a synonym.
7. Delete the last paragraph and see whether anything is lost. Then do the same for the last line.
8. Read the whole thing aloud as if to the reader. Rewrite any sentence you would not say.

Changelog: 2026-11-05, rebuilt from fresh research (card S63) after the owner found the old rules
made prose sound more like AI. Removed the ban lists, the short-sentence and fragment rules, the
connector stripping, the English dash ban and the absorbed deslop and unslop catalogues; added the
write-toward-the-target method, the 2026 tells, the marketing section and before/after pairs.
