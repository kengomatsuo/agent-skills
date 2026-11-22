# Mock, then show

Show the idea in whatever form shows it truest and soonest (a canvas, a page, a route in
the app); once a direction is approved, its mock is rebuilt as a route in the app so the
build can be checked against it.

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
the user's yes and each file's source recorded. Directions differ in structure
(navigation, page skeleton, density), not only in colour; a direction may follow one
product's language, combine several or be new, and says which. A direction is its own
answer to the user's core jobs, each part filled from the strongest saved reference for
that part and cited; a product's language card supplies a part, not the skeleton. Two
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
A direction covers every surface the product has; recolouring one shared admin is not a
direction.
Each direction's page says what it learned from which saved reference, or says it is
original; two directions that share a structure are one direction. `directions.md` holds
it as a table: one row per page the product has, one column per direction, each cell
naming the saved file(s) that page learned from, in backticks, or the word `original`.
`bun ${CLAUDE_SKILL_DIR}/check-directions.ts <research>/<project>-<topic>` proves each
cited file is on disk.
Build agents drift to one shared component with a note added or a section renamed per
direction; that is restyling, and each direction's page has its own structure
(sections, order, columns, controls) on one shared data layer. After every build round,
shoot each page in every direction and run `bun ${CLAUDE_SKILL_DIR}/review-grid.ts <shots>
<dir1,dir2,...> <page>...`, then open every sheet. Two columns with the same structure
send that page back before anyone else sees it.
Before rendering, write a skeleton table: one row per structural choice (navigation, page
skeleton, each page kind the product has) and one column per direction, each cell naming
the file it came from or `original`. When more than half the rows are the same across two
directions, they are one direction: rebuild one of them on a different structure before
anyone sees it.
Run `bun ${CLAUDE_SKILL_DIR}/check-siblings.ts <url>...` on every mock route: components of one
kind sitting together (info cards, tiles, list items) must share one height and one inner
layout, and a badge never repeats its card's title. `--selftest` must fail, proving the
check can see. A screen that fails is fixed before it is shot.
Render it with `shot.ts` at desktop and phone widths, save the PNGs beside the research as
`mock-<name>-<width>.png`, and show them to the user **in the same turn**, with the
reference each decision came from. Offer as many directions as are truly different. Mock each one and let the
user pick, as one contact sheet with each direction's name and what it learned from where printed above
its row (rendered with `shot.ts`), never a batch of unlabelled PNGs under one caption.
The sheet shows every page the product has, not a chosen few, and labels each one as
having its own layout or only restyled ("shell and colours only"). A
summary never says a direction has its own layout when only some pages do; it names the
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
