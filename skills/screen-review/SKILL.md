---
name: screen-review
description: "Runs the app and screenshots it at the widths and themes that matter. Use after any UI change and before saying a screen is done."
user-invocable: true
---

# Reading the JSX is not looking at the screen

> **Local notes.** If `~/.claude/skill-notes/screen-review.md` exists, read it before starting. It
> holds this user's own folders, project rules and examples, and where it disagrees with
> this file, it wins.

**If the `ui-patterns` skill is installed, read it first** (its Step 0 and the component's reference file) for the motion, easing, state-coverage and token numbers; the project's own tokens win over them; its `audit-checklist.md` lists what to look for on the screenshots.

**A LAYOUT CLAIM MADE FROM SOURCE IS A HYPOTHESIS.** Overflow, contrast, a control the
row swallows, a sheet that travels past the viewport, a skeleton the wrong height — none
of them are visible in the diff. Run the app.

## Web

1. `.claude/launch.json` holds the dev servers. Start the one you need with
   `preview_start` by NAME. Never `bun run dev` in a Bash tool: the Browser pane is what
   takes the screenshots.
2. If no configuration fits, add one. Give it a `//`-prefixed sibling key saying what it
   is for and which session it belongs to — the entries pile up without it.
3. Walk the screen: `navigate`, then `computer` for the interactions, `read_page` to check
   text and structure, `screenshot` for anything visual.
4. `resize_window` with `preset: "mobile"` (375×812) and `tablet` (768×1024); a custom width
   and height covers 320, 1024 and 1440. Then back to `desktop`. Reload after switching so
   load-time device gates re-run.
5. `resize_window` with `colorScheme: "dark"` and look again.

**Without the Browser pane, or for the same widths again after every fix,** use
[playwright-cli](https://github.com/microsoft/playwright-cli) headless when it is
installed: `playwright-cli open <url>`, then per width `playwright-cli resize <w> <h>` and
`playwright-cli screenshot --filename=<width>.png`, then `playwright-cli set-color-scheme
dark` and shoot again, and `playwright-cli close` at the end. Open each file with Read; a
screenshot nobody looked at checks nothing. A role walk signed in to a real account is not
this: that belongs to the project's walk notes or a real browser session.

## iOS

`mcp__Claude_Code_iOS_Simulator__control` — call `attach` FIRST, before the build, so the
panel is already open. Screenshots and taps are headless and need no panel.

For Swift edited outside Xcode, a phantom `No such module 'UIKit'` is a missing or stale
build-server config, never a code fault — check the project's own editor setup docs for
the fix.

Copy this checklist into your reply and tick items off:

```
- [ ] App running; the screen walked in every state
- [ ] Shot at every width in the table below, then in dark
- [ ] Built to a reference: compared side by side at its viewport, differences listed
- [ ] Every row of the checks table passed (a failure: fix it, return to the walk, shoot again)
- [ ] Report names what was seen and which state was not looked at, with the reason
```

## What to check, in this order

| Check | Fails when |
|---|---|
| Every state | loading, empty, error, one row, many rows, the longest string the data allows |
| Against its sibling | put the new screen beside the reference `match-the-app` named; unjustified differences are bugs |
| Copy | every visible string is checked for accuracy and is not over-explained |
| Behaviour | states never fail silently, dangerous actions get a confirmation dialog, hover and alpha states are consistent, values come from design tokens |
| Width | 320, 375, 768, 1024, 1440. Nothing scrolls sideways |
| Dark | contrast holds, no token defined only inside a media query |
| Keyboard | tab through it; a focus ring is visible on every stop |
| Touch rows | any pressable row, chip or radio row has a hit area (the box that takes the tap, padding and `hitSlop` included, not the drawn shape) under 44 pt on iOS, 48 dp on Android or 44 CSS px on a phone browser, or shorter than its sibling controls in the same sheet (2026-10-20: a discarder list at 31px under 50px winner chips passed a walk) |

## Matching a reference

When the screen was built to match a reference (a mock, a design image, a screenshot of
another product), "it looks like it" is decided side by side, never from memory:

1. Read the reference's pixel size and device pixel ratio, and shoot the build at that
   same viewport and ratio. A width that differs means the shots are not comparable: fix
   the viewport, never scale either image to fit.
2. Put the two next to each other (one image, reference left), plus crops of the parts
   that matter most: the header, the first card, the primary button.
3. List each difference in position, size, spacing, colour, type and missing content,
   with the measured number ("title 32px in the reference, 28px built"). Fix, shoot again
   at the same viewport, compare again.
4. A pixel-diff score can point at where to look; it never passes a screen. The eye on
   the side-by-side does.

## Send the shots

A shot the owner should see is copied, in the turn it is taken, to the Mac's `~/Downloads/<plain-topic>/` (from WSL: `~/mac/Downloads/<plain-topic>/`, with `timeout 60 cp`). Folder and file names say what the shot shows, never a card id or internal code, and the reply names the folder. A path in a shared folder, the repo or a scratchpad is not delivery, and SendUserFile does not reach the owner (2026-10-29, owner: "just put into downloads on my mac"; notes in `references/research.md`).

## Say what you saw

Report the screenshot, not the intention. "The row's action button is clipped at 320px"
beats "responsive handling added". When you did not look at a state, say which one and
why — a review that quietly skipped the error state is worth less than no review.
