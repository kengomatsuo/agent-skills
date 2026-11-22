---
name: match-the-app
description: "Builds a new screen from the app's existing pages and services. Use before adding any page, view, dialog, form, list or component to an existing app."
user-invocable: true
---

# Open the other pages and read them

> **Local notes.** If `~/.claude/skill-notes/match-the-app.md` exists, read it before starting. It
> holds this user's own folders, project rules and examples, and where it disagrees with
> this file, it wins.

Read `ui-patterns` only when the screen has motion, states or tokens in question; the project's own tokens win over it.

**A new screen in an app shares its siblings' parts, tokens and wiring so the app reads as
one product; where the siblings are themselves weak, say so and rethink the kind
(`reimagine`) instead of copying the weakness.**

## When nothing in the app is like it — canvas first

If no existing page shares its archetype, OR it needs a mechanic no page has yet (a new
flow, gesture, interaction, layout behaviour), there is nothing to read, and a mechanic invented
directly in code is hard for the owner to compare. Open a canvas first:

1. Open a canvas and draw the mechanic as many ways as are truly different; research how
   shipped products solved it alongside (`design-research`), and show which references
   changed the drawing.
2. The user picks. Build the chosen direction in code, reading the app's nearest siblings
   for its imports, tokens and state wiring even though the look is new.
3. **The canvas's SOURCE is the spec, never a screenshot of it.** Read each artboard's
   markup element by element and carry over its structure, element order, labels, column
   headers and concrete values (rail width, row heights, header grid columns, the button
   list and its order). A brief that hands a builder pictures plus prose gets back a
   screen that is defensible alone and unlike the canvas, with parts dropped, columns renamed
   and areas collapsed. Screenshots are the final sanity check. Anything
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
- Loading, empty and error, and which component renders each. A new page in an app with
  per-page loading files (Next.js `loading.tsx`) gets its own, mirroring that page's title and
  sections from the app's skeleton kit; a shared generic fallback is not a skeleton. A list sends one page of rows, never all of
  them, and a sibling's header keeps its actions in one container.
- Tokens for every colour, space, radius and duration, so a theme change reaches the screen.
- Naming: file, component, props, handlers.

Copy the CONTENT decisions, not only the skeleton. Getting the padding right while
inventing the row's contents still produces a wrong screen.

## Backend: tables, migrations, jobs, services

The same rule holds under the screen. A rule other systems have shipped (pricing, billing, booking, stock, auth, sync) also gets `backend-research` or `code-to-copy` before the first table is drawn: siblings in the repo show the house style, never whether the rule is right. Before a new table, migration, trigger, job or
server action, read two siblings of the same kind in the repo and take from them:

- The column helpers, id and timestamp shapes, money type, and how a status is declared
  and checked.
- Constraint and index naming, and where guards live (a check, a trigger, app code).
- How a state change, a reversal and an audit row are written.
- Migration file naming, and how a migration is generated and applied.
- Error shape and how a server action reports it.
- Naming: tables, columns, functions, jobs. One word per meaning across the repo; a
  ported module takes the repo's word, never its source's.

A ported module (`code-to-copy` step 8) passes through this before it ships.

## Then

Check behaviour against the project's own UI rules, check every string, then
`screen-review` to look at it running.
