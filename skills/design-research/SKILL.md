---
name: design-research
description: "Researches how real products solved a screen and draws mocks from saved references. Use before designing or restyling a screen or when one looks unfinished."
user-invocable: true
---

# Look at how others built it, then mock

> **Local notes.** If `~/.claude/skill-notes/design-research.md` exists, read it before starting. It
> holds this user's own folders, project rules and examples, and where it disagrees with
> this file, it wins.

Read `ui-patterns` only when the screen has motion, states or tokens in question; the project's own tokens win over it.

## Research and drawing feed each other

A mock shown to the owner names the saved references it learned from, because a mock drawn
from memory repeats the average; sketch freely while research runs and redraw against what
it finds.

References come from the best work in any category; direct rivals are saved too, so the README can say what a buyer in this market already expects and where the mocks go past it.

The scripts are tools the run may use: `check-notes.ts` proves each cited reference is on disk, `check-directions.ts` does the same for the sources a direction cites, `review-grid.ts` puts every direction of a page side by side, and `check-siblings.ts` measures like components on a mock route.

Dependencies: `bun`, `gh` (`brew install gh`), `curl`, and Playwright for the scripts
(`bun add -d playwright && bunx playwright install chromium` in the project, or
`PLAYWRIGHT=<path to playwright/index.js>`).

A staff screen is judged on a shift of real work (speed, density, errors), so its references include software staff use all day, beside the best work from any category.

## 1. Brief (one paragraph, you write it)

For a new app or a redesign, first list EVERY screen the requirements imply (each role's
list, detail, form, approval, report, printout, empty and error state), and brief the
agents on the whole list. Mocking a sample of screens leaves the rest to be drawn from
memory later. Each screen's notes name the references that shaped it; a screen with none
is drawn from memory and says so.

What the screen is for, who reads it, every state it must show (e.g. Paid, Due soon,
Grace, Lapsed, Not enforced), the device widths, and the app's component kit (shadcn,
the project's own UI package and so on). Every agent gets the same brief.

## 2. Fan out

Fan out as wide as the screen deserves: one agent per source, in the background (GitHub, Galleries, Mobbin and
Refero, Dribbble, Real products, and UX research for commerce), more waves while they keep finding better work; a small screen may need less, and that is the session's call, never a saving.

**A Mobbin query names the product's own niche, in the words its users say.** Each query describes one screen with the kind of venue or business and the trade's term for the act; a category word alone ("POS app", "payment") returns consumer checkout. Search `ios` and `web`, in screens and flows, and name real apps from adjacent trades that do the same job.

The notes table carries a `screen` column; list the screens as a
table with IDs (`| S01 | ... |`) in `screens.md`, and `bun ${CLAUDE_SKILL_DIR}/check-notes.ts <folder> --screens screens.md`
prints every screen that has no saved reference yet.

The gallery sources the Galleries agent searches (Kombai Gallery and the rest) are in [references/galleries.md](references/galleries.md). The source table, the named-product DESIGN.md route, the shop-flow study, the folder layout, the
capture rules and the screenshot tool are in [references/fan-out.md](references/fan-out.md). The
shared-browser rules (own tab per agent, read-only in the user's logged-in browser) are in
[references/browser-tabs.md](references/browser-tabs.md); put them in every brief that sends an
agent to Claude in Chrome. Each agent runs `check-notes.ts <its folder>` and reports only at exit 0.
References live outside the repo (default `~/design-research/`).

## 3. Synthesise

Run `bun ${CLAUDE_SKILL_DIR}/check-notes.ts <research>/<project>-<topic>` first; a non-zero exit
sends the agent that owns the missing rows back. Then read every `notes.md`, `flow.md`, the
`languages/` cards and the strongest images. Write `<research>/<project>-<topic>/README.md` with the
patterns worth copying, each named with the file it came from, and the ones rejected with the reason.

## 4. Mock, then show

Show the idea in whatever form shows it truest and soonest (a canvas, a page, a route in the app); once a
direction is approved, its mock is rebuilt as a route in the app so the build can be checked against it.
Replace a kit preset's heights, radius and weights with the project's tokens before the first screen
built on it.

The checks, all detailed in [references/mock.md](references/mock.md):

- Each direction's page says what it learned from which saved reference, or says it is original; two directions that share a structure are one direction.
- After every build round, shoot each page in every direction and open the `review-grid.ts` sheets; two columns with the same structure send one of them back to be rebuilt on a different structure.
- `check-siblings.ts <url>...` passes on every mock route (`--selftest` fails first).
- Mock data carries the screen's worst case: the most items the live screen allows in one place, and each direction is judged on it.
- Check contrast, glyph coverage and the project's own design rules before shooting.
- Show the directions as one labelled sheet in the same turn, as many as are truly different, each saying what it learned from where.
- An approved direction's mock code is the spec: write the plan to disk and port the mock files, never rebuild from a screenshot.
