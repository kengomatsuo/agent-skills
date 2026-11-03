# Fan out: sources, capture rules and folder layout

Recovered verbatim on 2026-11-03 from SKILL.md at d460a46^. Shared-browser rules are in browser-tabs.md.

## 2. Fan out: five agents in parallel, in the background (six for commerce)

The notes table carries a `screen` column naming which screen(s) of the list each
reference serves. Write the list as a table with IDs (`| S01 | ... |`) in `screens.md`,
then `bun ${CLAUDE_SKILL_DIR}/check-notes.ts <folder> --screens screens.md --min 5` prints every
screen short of five saved references and exits 2; the next wave of agents targets those.

One agent per source:

| Agent | Source | Best output |
|---|---|---|
| GitHub | the component sources the library catalog lists (its registries and the house's own kit) first, then open-source apps with the same screen (Lago, Polar, Cal.com, Supabase Studio, Twenty, Dub, shadcn examples, Tremor) | **the whole look in `code/`**: app shell and navigation, theme tokens (colours, radius, fonts), page layout, and the screen's components, each with the permalink at the commit SHA in a header comment |
| Galleries | ui.shadcn.com blocks, tremor.so, tailwindcss.com/plus previews, saaspo, nicelydone, and vendor docs that show real dashboards (Stripe, Chargebee, Paddle, Linear, Vercel) | screenshots, plus code when the gallery exposes it |
| Mobbin and Refero | public mobbin.com pages and CDN images; Refero's MCP (`api.refero.design/mcp`, Pro plan only) when it is connected, searched by screen or flow; when gated, the same apps' public help-centre screenshots | screenshots |
| Dribbble | `dribbble.com/search/<terms>`, then the full-size image from each shot page | screenshots, skipping concept art no product would ship |
| Real products | the domain's competitors and the local apps the users already open daily (their help centres, docs and app-store listings carry real in-app screenshots) | one `languages/<product>.md` card each, the source a direction is built from; a shipped product outranks a Dribbble concept |
| UX research (commerce and ordering screens) | Baymard Institute, Nielsen Norman Group, and primary market surveys on how local buyers pay and ship | a rule per step with a short quote and URL; a paywalled page is written down as gated |

**A screen meant to feel like a named product starts with that product's DESIGN.md.**
[VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) (MIT) holds
84 brand files in Google Stitch's DESIGN.md format (Vercel, Linear, Stripe, Apple, Airbnb,
Notion, Supabase, Expo and more); the full file is `design-md/<brand>/DESIGN.md` in the
repo, and getdesign.md hosts the same with previews. When the user names a product the
screen should resemble, the real-products agent reads that file's `## Layout` section
(spacing base, container width, gutters, columns per section, breakpoints, collapse
order) as a first measurement, saves it as `<brand>-DESIGN.md` with the URL and commit on
line 1, and checks each number against a screenshot of the live site before the language
card uses it. When VoltAgent has no file for the brand, Refero Styles
(styles.refero.design) has 2,000+ more, opened one at a time and copied with its Copy
button, never scraped (Refero's terms forbid it). Both sets were written from the public sites, so a file is a secondary
source: the live site wins where they differ. The project's own tokens and `ui-patterns`
still win over both. Never copy one in as a project's `docs/design.md`: it is another
company's look.

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


Screenshots come from `bun ${CLAUDE_SKILL_DIR}/shot.ts <url> <out.png> [w] [h] [selector]`
(Playwright from the current project, or `PLAYWRIGHT=<path>`).
When a site blocks it (bot wall, login, Cloudflare), open it in a real browser session
such as Claude in Chrome and screenshot there; never write a blocked site off as blocked
without trying one. Agents never fabricate a URL or an image. A gated source is written
down as gated.
In a repo that forbids agents from running heavy checks, say so in the brief.

Before reporting, each agent runs `bun ${CLAUDE_SKILL_DIR}/check-notes.ts <its folder>`; it lists
every row whose file is missing or empty and exits 1. An agent reports only after it
exits 0.

The folder sits outside the repo on purpose: the references stay out of the product's
history, and one project's references are reusable in the next.

