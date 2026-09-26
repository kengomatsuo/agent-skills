---
name: design-research
description: Before designing or redesigning any screen, look at how real products solved it. Fan out parallel agents to GitHub (open-source apps' component code), UI galleries (shadcn, Tremor, Stripe and vendor docs), Mobbin, Dribbble and the real products users already know, save the references as screenshots and code into a research folder outside the repo, then draw mocks from them and send the screenshots. Use whenever a screen is new, being redesigned, or the user says it looks unfinished, bare, half-baked or wrong.
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

For a new app or a redesign, first list EVERY screen the requirements imply (each role's
list, detail, form, approval, report, printout, empty and error state), and brief the
agents on the whole list. Mocking a sample of screens leaves the rest to be drawn from
memory later. The research target is at least five saved references per screen, counted
per screen in the notes, before anything is drawn.

What the screen is for, who reads it, every state it must show (e.g. Paid, Due soon,
Grace, Lapsed, Not enforced), the device widths, and the app's component kit (shadcn,
the project's own UI package and so on). Every agent gets the same brief.

## 2. Fan out: five agents in parallel, in the background (six for commerce)

One agent per source:

The notes table carries a `screen` column naming which screen(s) of the list each
reference serves. Write the list as a table with IDs (`| S01 | ... |`) in `screens.md`,
then `bun <skill-dir>/check-notes.ts <folder> --screens screens.md --min 5` prints every
screen short of five saved references and exits 2; the next wave of agents targets those.

| Agent | Source | Best output |
|---|---|---|
| GitHub | open-source apps with the same screen (Lago, Polar, Cal.com, Supabase Studio, Twenty, Dub, shadcn examples, Tremor) | **the whole look in `code/`**: app shell and navigation, theme tokens (colours, radius, fonts), page layout, and the screen's components, each with the permalink at the commit SHA in a header comment |
| Galleries | ui.shadcn.com blocks, tremor.so, tailwindcss.com/plus previews, saaspo, nicelydone, and vendor docs that show real dashboards (Stripe, Chargebee, Paddle, Linear, Vercel) | screenshots, plus code when the gallery exposes it |
| Mobbin | public mobbin.com pages and CDN images; when gated, the same apps' public help-centre screenshots | screenshots |
| Dribbble | `dribbble.com/search/<terms>`, then the full-size image from each shot page | screenshots, skipping concept art no product would ship |
| Real products | the domain's competitors and the local apps the users already open daily (their help centres, docs and app-store listings carry real in-app screenshots) | one `languages/<product>.md` card each, the source a direction is built from; a shipped product outranks a Dribbble concept |
| UX research (commerce and ordering screens) | Baymard Institute, Nielsen Norman Group, and primary market surveys on how local buyers pay and ship | a rule per step with a short quote and URL; a paywalled page is written down as gated |

**For a shop, checkout or any ordering screen, the real-products agents study flows before
looks.** One agent per market leader the users already know (the local marketplaces plus
Amazon and eBay), each covering the buyer side (search, filters, product page, variant,
cart, checkout, payment, tracking, review, return) and the seller side (new order to
shipped, add a product with variants, stock, promotions, returns). Each writes `flow.md`:
step | screen | what it shows, with the exact labels in the users' language | taps from the
last step | source. Seller screens behind a login come from the platform's public seller
education pages. The synthesis compares the app's own flow step by step against them;
the look is chosen after the flow is settled. Brand sites and Dribbble alone produce a
restyled screen with the wrong flow.

Each agent writes into `<research>/<project>-<topic>/<source>/`, where `<research>` is a
folder outside every repo (the user's choice; default `~/design-research/`):
- `NN-<site>-<what>.png`, each opened with Read to confirm it shows the thing, junk deleted
- `code/<repo>--<File>.tsx` when code is available (code beats a picture)
- `notes.md`: a table of # | URL | file | what to take, in one concrete sentence. The
  file column names a file in this folder for EVERY row, or says `gated: <reason>`
- `../languages/<product>.md`: one card per real product seen (competitor, open-source app
  or vendor): navigation, page skeleton, density, how figures, lists, tables and status
  look, component shapes, type, colour, and 2–4 signature moves, each backed by a saved
  image or code file. A mock direction copies one card end to end, so the cards are what
  make directions differ in layout and not only in colour

**Looked at is not captured.** A source counts only when its bytes are in the folder:
- An image: download the original with `curl` (full resolution, not a thumbnail).
- A page Playwright cannot load: open it in Claude in Chrome, read the image URLs with
  `javascript_tool` (`[...document.images].map(i => i.currentSrc)`, CSS backgrounds too)
  and `curl` them; for rendered text, save `get_page_text` output to a `.md` file with the
  URL and date on line 1. A Chrome screenshot ID is not a file.
- Code: the raw file from `gh api repos/<o>/<r>/contents/<path>?ref=<sha>`, never a
  paraphrase.

Parallel agents share one browser window: each opens its own tab (`tabs_create_mcp`),
batches navigate and read in one call, and never closes a tab it did not open. They share
the scratch folder too: each works in its own subfolder and deletes only files it created.

**That browser is the user's own, logged in to their real accounts, so research in it is
read-only.** Every brief that sends an agent to Claude in Chrome says so in words:
navigate, scroll, read and screenshot only; never click add to cart, buy, wishlist,
follow, chat, claim a voucher, or anything that changes an account, cart or order; the
flow behind such a button comes from the site's help centre. An agent that changed
something undoes it and reports exactly what it did, and the coordinator checks the
account page itself before telling the user it is clean.

Screenshots come from `bun <skill-dir>/shot.ts <url> <out.png> [w] [h] [selector]`
(Playwright from the current project, or `PLAYWRIGHT=<path>`).
When a site blocks it (bot wall, login, Cloudflare), open it in a real browser session
such as Claude in Chrome and screenshot there; never write a blocked site off as blocked
without trying one. Agents never fabricate a URL or an image. A gated source is written
down as gated.
In a repo that forbids agents from running heavy checks, say so in the brief.

Before reporting, each agent runs `bun <skill-dir>/check-notes.ts <its folder>`; it lists
every row whose file is missing or empty and exits 1. An agent reports only after it
exits 0.

The folder sits outside the repo on purpose: the references stay out of the product's
history, and one project's references are reusable in the next.

## 3. Synthesise

Run `bun <skill-dir>/check-notes.ts <research>/<project>-<topic>` first; a non-zero exit
sends the agent that owns the missing rows back. Then read every `notes.md` file and `flow.md`, the
`languages/` cards and the strongest images. Write
`<research>/<project>-<topic>/README.md` with the patterns worth copying, each named
with the file it came from, and the ones rejected with the reason (it breaks one of the
project's design rules, or suits a marketing page and not a working tool).

## 4. Mock, then show

Only after step 3's README exists. Build the mock as a route in the app itself, from the
files in `code/`: install the kit's primitives, port the saved components, and change
tokens and copy (read the app's CSS and two sibling screens first, as `match-the-app`
says). Never a hand-written static HTML page.
A kit preset ships its own control heights, radius and weights: replace them with the
project's tokens before the first screen is built on it, and screenshot one form beside the
token sheet. Screens built on the preset's numbers read as the stock kit however the
colours change.
For a brand direction that touches every page, add a development-only switch instead of a
separate route: a cookie set by a dev route, read in the root layout into a
`data-brand` attribute, with each direction's tokens and fonts scoped under
`html[data-brand="…"]`. Then one script shoots the same real pages, storefront and admin,
in every direction, and the user can flip them live.
Placeholder tiles make any direction look like a template: show real photos, from the
client or from a free-licence library whose licence page you quoted, downloaded only with
the user's yes and each file's source recorded. When the app has no brand yet, each
direction takes ONE `languages/` card whole, layout and navigation included; two
directions sharing a skeleton are one direction, and the kit's stock neutral theme is not
a direction.
**Before shooting, check the mock against the project's own design rules**, not only its
tokens: list rules, row targets, borders, how status is shown, and real brand marks
(never a text lockup) when a payment method or partner has a logo. A mock that copied a
screen which already broke them repeats the defect: fix the screen too.
Then check the render itself: compute the contrast of each direction's accent against its
backgrounds with a script (4.5:1 for text) and darken what fails before anyone sees it;
every script in the content has a glyph (a Latin-only font
shows Chinese or Arabic as empty boxes, so load a fallback), words are not run together by
a font's narrow space, the framework's dev badge is off, and the route answers 200 on the
port you shot (another project's server may hold the default port; pin one). A style
generator's suggested palette and fonts are input, never a direction: when they do not
fit the audience, drop them and say so.
A direction covers every surface the product has. When the app has a back office, each
direction's admin copies the SAME product's seller or merchant side (its seller centre,
merchant admin or partner app), captured into its own `languages/admin-<product>.md` card;
recolouring one shared admin is not a direction.
**No page of any direction is built until `bun <skill-dir>/check-directions.ts
<research>/<project>-<topic>` exits 0.** It reads `directions.md`: one row per page the
product has (storefront and back office, every route), one column per direction, each cell
citing the saved file(s) that page copies, in backticks. A cell with no saved source, a
missing file, or the same source as another direction fails. A page with no captured
source gets a capture agent, never a shared fallback layout.
Before rendering, write a skeleton table: one row per structural choice (header and
navigation, home hero, category entry, product card, listing and filters, product page,
admin shell, admin dashboard, admin order list) and one column per direction, each cell naming the file it came from. When
more than half the rows are the same across two directions, they are one direction:
rebuild one of them from a different card before anyone sees it. A direction whose cells
cite no research file is built from memory.
Render it with `shot.ts` at desktop and phone widths, save the PNGs beside the research as
`mock-<name>-<width>.png`, and show them to the user **in the same turn**, with the
reference each decision came from. Offer three or four directions, each copying a different kind of
product the users know: the local marketplace, the global leader, a small-shop theme, a
specialist in the domain. Mock each one and let the
user pick, as one contact sheet with each direction's name and source product printed above
its row (rendered with `shot.ts`), never a batch of unlabelled PNGs under one caption.
The sheet shows every page the product has, not a chosen few, and labels each one as
copied from the source ("own layout") or only restyled ("shell and colours only"). A
summary never says a direction "copies" a product when only some pages do; it names the
pages that do. Overclaiming coverage reads as a lie.
Name a direction by what the user sees ("red accent, Mekari Talenta"), not by an internal
key.

Only then propose the implementation, and wait for yes.
