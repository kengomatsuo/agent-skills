---
name: match-the-app
description: Read the code of the app's existing pages before writing a new one — or, when nothing in the app is like it (a new page type or a new mechanic), open a design canvas first. Use BEFORE writing ANY new screen, page, view, component, dialog, sheet, form, list, tab or section in an existing codebase — open the siblings' source first, every time.
when_to_use: "Trigger phrases: any request for a screen, page, view, form, list, dialog, sheet, tab or component — add a screen, new page, build the X page, make a view for, put a form on, this looks off next to the others."
user-invocable: true
---

# Open the other pages and read them

**NEVER WRITE A SCREEN FROM MEMORY. Read the source of the ones already there first.**
That is the whole skill. An agent that writes a list page from its own idea of a list page
produces one that is defensible alone and wrong beside the four already in the app.

## When nothing in the app is like it — canvas first

If no existing page shares its archetype, OR it needs a mechanic no page has yet (a new
flow, gesture, interaction, layout behaviour), there is nothing to read. Do not invent it
in code. Open a canvas first:

0. Run `design-research` and WAIT for every agent and its README before drawing anything.
1. Open a multi-artboard design canvas.
2. Draw two or three directions, pulling in whatever design references and taste tools are
   available to the project.
3. The user picks. Build the chosen direction in code, reading the app's nearest siblings
   for its imports, tokens and state wiring even though the look is new.
4. **The canvas's SOURCE is the spec, never a screenshot of it.** Read each artboard's
   markup element by element and carry over its structure, element order, labels, column
   headers and concrete values (rail width, row heights, header grid columns, the button
   list and its order). A brief that hands a builder pictures plus prose gets back a
   screen that is defensible alone and unlike the canvas — one project measured a rebuild
   from screenshots and prose alone missing an icon rail, missing document tabs, renamed
   columns, and a collapsed lines area. Screenshots are the final sanity check. Anything
   you deviate from, name it and say which rule or token forced it.

Same archetype AND the same mechanics already exist: skip this and read the code below.

## Which files

Same archetype first, then near neighbours:

| Archetype | Named | Read |
|---|---|---|
| List | `<Plural>List` | one simple, one with search and paging |
| Home / dashboard | `<Role>Home` | the busiest role's |
| Detail | `<Entity>Details` | one for a thing, one for a person |
| Form | `Create<Entity>` / `Edit<Entity>` | the one whose validation works |
| Picker | `Select<Entity>` | any that closes on choose |
| Scan | `Scan<Thing>` | one full, one minimal |
| Sheet | `...Sheet` | any |
| Viewer | `...Viewer` | any |
| Settings | bare noun | the group already shipped |

Find them by name, or `git log --diff-filter=A --name-only -- 'src/**'` for the most
recently added sibling. Read two, not one.

## What to take from them

- The imports, hooks and primitives they use — the same ones, not equivalents.
- The screen container, and how it is configured.
- Where state comes from, and what is passed straight through rather than derived.
- The row or section anatomy: which fact is on which line, what is left, what is right.
- Loading, empty and error, and which component renders each.
- Tokens for every colour, space, radius, duration. Never a literal.
- Naming: file, component, props, handlers.

Copy the CONTENT decisions, not only the skeleton. Getting the padding right while
inventing the row's contents still produces a wrong screen.

## Then

Check behaviour against the project's own UI rules, check every string, then
`screen-review` to look at it running.

To make this fire on writes rather than trust it: `templates/check-screen.template.ts`
blocks a screen write until the archetype blueprint has been injected.
