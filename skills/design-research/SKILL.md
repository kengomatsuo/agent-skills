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

## RESEARCH FIRST. NOTHING IS DRAWN UNTIL EVERY AGENT HAS REPORTED.

The steps below run in order, and each one waits for the one before it. Until the last
research agent has come back AND `README.md` (step 3) is written, you do not:

1. write a mock, a canvas, an HTML page or a line of screen code
2. read the app's CSS or sibling screens "to get ahead on the mock"
3. propose a layout, a table of columns or a status list

While the agents run, the only allowed work is unrelated to this screen, or nothing.
A mock started in parallel is built from memory, and the research then only decorates
it: that is the failure this skill exists to stop.

A screen proposed from memory comes out as a table with a word in each cell. The full
research runs for a new app, a redesign, or when the owner asks. A single new screen takes
three saved references (the project's own siblings plus Galleries and Real products) and the
same rule: nothing is drawn before they are saved.

Copy this checklist into your reply and tick items off as they pass:

```
- [ ] 0. Read before the brief: the local notes (folder, house rules), `ui-patterns` reference file
        for every component the screens use, the library catalog's component sources, and the
        house design rules; the brief names each source the agents must pull from
- [ ] 1. Brief written; every screen of the app listed in screens.md with an ID
- [ ] 2. Agents launched: N. Completion notices received: N (numbers must match)
- [ ] 2. check-notes.ts --screens screens.md --min 5 (3 for a single screen) exits 0
        (exit 2: launch the next wave on the screens it lists, return to step 2)
- [ ] 3. check-notes.ts on the whole folder exits 0 (non-zero: send the owning agent back to step 2)
- [ ] 3. README.md written, each pattern named with its source file
- [ ] 4. directions.md filled; check-directions.ts exits 0 (a page with no source gets a capture agent: return to step 2)
- [ ] 4. Every build round shot; review-grid.ts sheets opened (same structure in two columns: rebuild from a different card)
- [ ] 4. check-siblings.ts passes on every mock route (--selftest fails first)
- [ ] 4. Contact sheet shown in this turn; implementation proposed; yes received
```

Dependencies: `bun`, `gh` (`brew install gh`), `curl`, and Playwright for the scripts
(`bun add -d playwright && bunx playwright install chromium` in the project, or
`PLAYWRIGHT=<path to playwright/index.js>`).

## 1. Brief (one paragraph, you write it)

For a new app or a redesign, first list EVERY screen the requirements imply (each role's
list, detail, form, approval, report, printout, empty and error state), and brief the
agents on the whole list. Mocking a sample of screens leaves the rest to be drawn from
memory later. The research target is at least five saved references per screen (three for one screen), counted
per screen in the notes, before anything is drawn.

What the screen is for, who reads it, every state it must show (e.g. Paid, Due soon,
Grace, Lapsed, Not enforced), the device widths, and the app's component kit (shadcn,
the project's own UI package and so on). Every agent gets the same brief.

## 2. Fan out (only for a new app, a redesign or when asked)

One agent per source, in the background, five (six for commerce): GitHub, Galleries, Mobbin and
Refero, Dribbble, Real products, and UX research for commerce. For one screen, run one agent over
Galleries and Real products. The notes table carries a `screen` column; list the screens as a
table with IDs (`| S01 | ... |`) in `screens.md`, and `bun ${CLAUDE_SKILL_DIR}/check-notes.ts <folder> --screens screens.md --min 5`
prints every screen short of its references and exits 2; the next wave targets those.

The source table, the named-product DESIGN.md route, the shop-flow study, the folder layout, the
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

Only after step 3's README exists. Build the mock as a route in the app itself, from the saved
`code/` files, never a static HTML page; read the app's CSS and two sibling screens first, as
`match-the-app` says. Replace a kit preset's heights, radius and weights with the project's tokens
before the first screen.

Hard gates, all detailed in [references/mock.md](references/mock.md):

- `check-directions.ts <research>/<project>-<topic>` exits 0 before any page of any direction is built (every page cites a saved source per direction).
- After every build round, shoot each page in every direction and open the `review-grid.ts` sheets; two columns with the same structure go back to be rebuilt from a different card.
- `check-siblings.ts <url>...` passes on every mock route (`--selftest` fails first).
- Check contrast, glyph coverage and the project's own design rules before shooting.
- Show one labelled contact sheet of three or four directions in the same turn, each naming its source product and the pages it truly copies; then propose the implementation and wait for yes.
- An approved direction's mock code is the spec: write the plan to disk and port the mock files, never rebuild from a screenshot.
