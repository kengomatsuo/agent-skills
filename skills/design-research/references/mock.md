# Mock, then show

Recovered verbatim on 2026-11-03 from step 4 of SKILL.md at d460a46^.

Only after step 3's README exists. Build the mock as a route in the app itself, from the
files in `code/`: install the kit's primitives, port the saved components, and change
tokens and copy (read the app's CSS and two sibling screens first, as `match-the-app`
says). Never a hand-written static HTML page.

A picture shown to the owner is exactly what ships, with no difference: every size, colour, position and control in it is what the build will have. A look the kit cannot reach gets a new component, built to the picture; the kit part is never shipped in its place.
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
**No page of any direction is built until `bun ${CLAUDE_SKILL_DIR}/check-directions.ts
<research>/<project>-<topic>` exits 0.** It reads `directions.md`: one row per page the
product has (storefront and back office, every route), one column per direction, each cell
citing the saved file(s) that page copies, in backticks. A cell with no saved source, a
missing file, or the same source as another direction fails. A page with no captured
source gets a capture agent, never a shared fallback layout.
The checker proves sources exist, never that the build copied them. Build agents drift
to one shared component with a note added or a section renamed per direction; the brief
says in words that this is restyling, and that each page rebuilds its source's structure
(sections, order, columns, controls) on one shared data layer. After every build round,
shoot each page in every direction and run `bun ${CLAUDE_SKILL_DIR}/review-grid.ts <shots>
<dir1,dir2,...> <page>...`, then open every sheet. Two columns with the same structure
send that page back with its source files named, before anyone else sees it.
Before rendering, write a skeleton table: one row per structural choice (header and
navigation, home hero, category entry, product card, listing and filters, product page,
admin shell, admin dashboard, admin order list) and one column per direction, each cell naming the file it came from. When
more than half the rows are the same across two directions, they are one direction:
rebuild one of them from a different card before anyone sees it. A direction whose cells
cite no research file is built from memory.
Run `bun ${CLAUDE_SKILL_DIR}/check-siblings.ts <url>...` on every mock route: components of one
kind sitting together (info cards, tiles, list items) must share one height and one inner
layout, and a badge never repeats its card's title. `--selftest` must fail, proving the
check can see. A screen that fails is fixed before it is shot.
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

Once a direction is approved, the mock code IS the spec. Write the whole plan to disk in the
repo (every screen with its mock file, the tokens, each approved revision in the owner's
words and the exact code change, the build order, and the parity check) so any later
session builds the same thing. Production screens are ports of the mock files and are
checked code against code: the same tree, classes and copy, then a pixel comparison of the
production route and the mock route rendered from one shared seed. Rebuilding a screen from
its screenshot is how differences creep in, so never do it.
The hand-off also holds a build spec data file (every figure's data, ranges, geometry, timings and copy keys) and the check script that prints any number on a slide or mock that the file lacks; both are written before any build card is briefed.
