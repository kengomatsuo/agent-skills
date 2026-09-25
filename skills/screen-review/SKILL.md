---
name: screen-review
description: Look at the UI you just changed by running the real app and taking screenshots, then check what you see against the house rules and the repo's own reference screens. Use after any UI change, before saying a screen is done, when a layout is suspected of breaking at a width, and whenever a claim about how something looks would otherwise come from reading the code.
when_to_use: "Trigger phrases: does it look right, screenshot it, check it on a phone, is it responsive, does dark mode hold, at 320px."
user-invocable: true
---

# Reading the JSX is not looking at the screen

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
4. `resize_window` with `preset: "mobile"` (375×812) and `tablet`, then back to `desktop`.
   Reload after switching so load-time device gates re-run.
5. `resize_window` with `colorScheme: "dark"` and look again.

## iOS

`mcp__Claude_Code_iOS_Simulator__control` — call `attach` FIRST, before the build, so the
panel is already open. Screenshots and taps are headless and need no panel.

For Swift edited outside Xcode, a phantom `No such module 'UIKit'` is a missing or stale
build-server config, never a code fault — check the project's own editor setup docs for
the fix.

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

## Say what you saw

Report the screenshot, not the intention. "The row's action button is clipped at 320px"
beats "responsive handling added". When you did not look at a state, say which one and
why — a review that quietly skipped the error state is worth less than no review.
