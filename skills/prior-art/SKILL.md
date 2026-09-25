---
name: prior-art
description: Before building a subsystem, find the mature systems that already solved it and decide deliberately whether to use one, copy its design, or build. Use at the start of any non-trivial feature — booking, auth, payments, search, scheduling, PDF, sync, queueing, i18n — and whenever a plan proposes writing something a well-known project already does. Records the decision so it is not relitigated.
when_to_use: "Trigger phrases: should we build this or use something, is there a library for it, how do other people solve this, roll our own."
user-invocable: true
---

# Look at what already works before designing

> **Local notes.** If `~/.claude/skill-notes/prior-art.md` exists, read it before starting. It
> holds this user's own folders, project rules and examples, and where it disagrees with
> this file, it wins.

**THE DEFAULT IS NOT TO BUILD IT.** A project that switched a booking flow onto an
off-the-shelf scheduling platform kept a `docs/booking-is-<choice>.md` record of what was
rejected to get there — including its own earlier booking engine, with an exclusion
constraint stopping two parties holding one slot at once, rate bands, and an anon-callable
offer RPC. The decision is dated, signed off by whoever owns the product, and marked *do not relitigate without new
evidence*. That page is the shape this skill produces.

## 1. Name the problem in one sentence, without your solution in it

"Guests pick a time and a table, and cannot double-book." Not "build a booking table with
a range type". The sentence is what you search with.

## 2. Find the mature implementations — primary sources only

- GitHub, sorted by stars, then **verify the numbers with `gh api repos/<owner>/<name>`**.
  Listicles and comparison sites invent them: one blog reported 143.7k stars for a repo
  that has 58.
- Check `pushed_at`. A 40k-star project last pushed in 2025 is a museum piece.
- Read the project's OWN docs and source, never an SEO comparison page.
- For an installed dependency, `node_modules/` beats every docs site — the `exports` map
  for the real import path, the `.d.ts` for the typed API, the compiled JS for runtime
  behaviour the docs do not surface.

## 3. Read how they solved it, especially the parts you would have got wrong

For anything bigger than one library, run `backend-research` here: its agents read the
schemas, API references and bug record this step needs.

The value is rarely the code. It is the constraint they discovered: what they do about
concurrent writes, about timezones, about partial failure, about the thing that only shows
up at scale. Write those down even when you decide to build.

## 4. Choose, on the record

| Choice | When | Cost to name |
|---|---|---|
| **Use it** | it is maintained, the licence fits, and the shape it imposes is acceptable | the integration surface, and what happens when it is down |
| **Copy its design** | it solves it well but drags a stack you will not adopt | the parts you are NOT copying, and why |
| **Build** | your constraint genuinely differs, or the surface is small | what the mature ones do that you are choosing to skip |

"Build" is a legitimate answer. It is only illegitimate when nobody looked.

## 5. Write the page

`docs/<thing>-is-<choice>.md`, in the shape of `booking-is-calcom.md`:

- **The decision, the date, who directed it, and "do not relitigate without new evidence".**
- **What was rejected**, in detail — including your own existing systems. That section is
  what stops the next session rebuilding it.
- What is missing or unbuilt, named precisely, so the door stays open.

Then one headline pointing at that page, in whatever rules file the project keeps for the
code it covers.

## When the answer changes

New evidence reopens it: the project was abandoned, the licence changed, the constraint
you were told about turned out not to hold. Amend the page with the date and the evidence
rather than starting a fresh argument.
