---
name: design-research
description: Before designing or redesigning any screen, look at how real products solved it. Fan out parallel agents to GitHub (open-source apps' component code), UI galleries (shadcn, Tremor, Stripe and vendor docs), Mobbin and Dribbble, save the references as screenshots and code into a research folder outside the repo, then draw mocks from them and send the screenshots. Use whenever a screen is new, being redesigned, or the user says it looks unfinished, bare, half-baked or wrong.
when_to_use: "Trigger phrases: half-baked, looks bad, looks unfinished, where is the colour-coding, redesign, make it look good, inspo, inspiration, references, how do others do it, mock it up, show me mocks, dribbble, mobbin."
user-invocable: true
---

# Look at how others built it, then mock

> **Local notes.** If `~/.claude/skill-notes/design-research.md` exists, read it before starting. It
> holds this user's own folders, project rules and examples, and where it disagrees with
> this file, it wins.

## RESEARCH FIRST. NOTHING IS DRAWN UNTIL EVERY AGENT HAS REPORTED.

The steps below run in order, and each one waits for the one before it. Until the last
research agent has come back AND `README.md` (step 3) is written, you do not:

1. write a mock, a canvas, an HTML page or a line of screen code
2. read the app's CSS or sibling screens "to get ahead on the mock"
3. propose a layout, a table of columns or a status list

While the agents run, the only allowed work is unrelated to this screen, or nothing.
A mock started in parallel is built from memory, and the research then only decorates
it: that is the failure this skill exists to stop.

Count the agents you launched, count the completion notices, and start step 3 only
when the two numbers match.

A screen proposed from memory comes out as a table with a word in each cell. Research
runs first, unasked, every time a screen is new or is being redesigned.

## 1. Brief (one paragraph, you write it)

What the screen is for, who reads it, every state it must show (e.g. Paid, Due soon,
Grace, Lapsed, Not enforced), the device widths, and the app's component kit (shadcn,
the project's own UI package and so on). Every agent gets the same brief.

## 2. Fan out: four agents in parallel, in the background

One agent per source:

| Agent | Source | Best output |
|---|---|---|
| GitHub | open-source apps with the same screen (Lago, Polar, Cal.com, Supabase Studio, Twenty, Dub, shadcn examples, Tremor) | **component source code** in `code/`, with the URL and branch in a header comment |
| Galleries | ui.shadcn.com blocks, tremor.so, tailwindcss.com/plus previews, saaspo, nicelydone, and vendor docs that show real dashboards (Stripe, Chargebee, Paddle, Linear, Vercel) | screenshots, plus code when the gallery exposes it |
| Mobbin | public mobbin.com pages and CDN images; when gated, the same apps' public help-centre screenshots | screenshots |
| Dribbble | `dribbble.com/search/<terms>`, then the full-size image from each shot page | screenshots, skipping concept art no product would ship |

Each agent writes into `<research>/<project>-<topic>/<source>/`, where `<research>` is a
folder outside every repo (the user's choice; default `~/design-research/`):
- `NN-<site>-<what>.png`, each opened with Read to confirm it shows the thing, junk deleted
- `code/<repo>--<File>.tsx` when code is available (code beats a picture)
- `notes.md`: a table of # | URL | file | what to take, in one concrete sentence

Screenshots come from `bun <skill-dir>/shot.ts <url> <out.png> [w] [h] [selector]`
(Playwright from the current project, or `PLAYWRIGHT=<path>`).
When a site blocks it (bot wall, login, Cloudflare), open it in a real browser session
such as Claude in Chrome and screenshot there; never write a blocked site off as blocked
without trying one. Agents never fabricate a URL or an image. A gated source is written
down as gated.
In a repo that forbids agents from running heavy checks, say so in the brief.

The folder sits outside the repo on purpose: the references stay out of the product's
history, and one project's references are reusable in the next.

## 3. Synthesise

Read the four `notes.md` files and the strongest images. Write
`<research>/<project>-<topic>/README.md` with the patterns worth copying, each named
with the file it came from, and the ones rejected with the reason (it breaks one of the
project's design rules, or suits a marketing page and not a working tool).

## 4. Mock, then show

Only after step 3's README exists. Build the mock as a static HTML page that uses the app's real tokens and component
classes (read the app's CSS and two sibling screens first, as `match-the-app` says).
**Before shooting, check the mock against the project's own design rules**, not only its
tokens: list rules, row targets, borders, how status is shown, and real brand marks
(never a text lockup) when a payment method or partner has a logo. A mock that copied a
screen which already broke them repeats the defect: fix the screen too.
Render it with `shot.ts` at desktop and phone widths, save the PNGs beside the research as
`mock-<name>-<width>.png`, and show them to the user **in the same turn**, with the
reference each decision came from. For more than one direction, mock each one and let the
user pick.

Only then propose the implementation, and wait for yes.
