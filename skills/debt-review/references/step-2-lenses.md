# Step 2: lenses, verify, rank

Recovered verbatim on 2026-11-03 from SKILL.md at c18cc5d^ (the commit that moved this text out of SKILL.md did not write the file).

## 2. Lenses, in parallel

Spawn one read-only subagent per lens in the tier below, on a mid-tier model with Read, Grep, Glob and Bash only (a lens never edits). Pass each the whole text of its prompt file, since a summary
drops the rules that keep its findings honest, the scope, the report and model paths, the rules files, and
[references/conventions.md](references/conventions.md).

The twelve lens prompts: [Structure](references/lenses/structure.md), [Duplication](references/lenses/duplication.md), [Dead code](references/lenses/dead-code.md), [Types and state](references/lenses/types-and-state.md), [Slop](references/lenses/slop.md), [Network](references/lenses/network.md), [Layout stability](references/lenses/layout-stability.md), [Data layer](references/lenses/data-layer.md), [Backend structure](references/lenses/backend-structure.md), [Model](references/lenses/model.md), [Product](references/lenses/product.md), [Bandages](references/lenses/bandages.md). What each finds is in [references/lenses.md](references/lenses.md). Pass each lens the whole text of its prompt file.

**Every path runs the core five (structure, duplication, dead code, types and state, slop) and bandages.** The other six
run only when the scope holds client code, SQL, server handlers or crossing screens, or when the owner asks for the whole app. A lens that runs and finds nothing in scope reports "nothing in scope". A lens that needs the running app or the database
and cannot run now (the machine is held, no app is up) becomes a board card with an id, done
before gate 1, never dropped; "not asked for in the brief" is not a reason. Model and product
read the project's design and feature documents first. `02-findings.md` has a `## Which lenses
ran` section naming the lenses that ran, and `board.ts` fails a job that omits a core lens or lists a
skipped lens with no card. The research
behind this set, and what each source checks, is in [references/research.md](references/research.md).

The measuring lenses (network, layout stability, data layer) use the running app and the
database for counts, plans and timings; they take the dev server the project already shares,
and run no whole-repo test, lint or build (the project's rules on heavy checks apply). The
**line pass** ([references/line-pass.md](references/line-pass.md)) is the other way in: one
verdict per function (keep, simplify, delete, merge) over the top hotspots, cut into
non-overlapping ranges with `scripts/chunks.ts` when a file is too big for one reader. Offer
it on path A, and run it whenever the request says "every line" or "the whole app".

Small scope (one file, a diff under ~300 lines; a PR review follows [references/pr-review.md](references/pr-review.md)): run the prompts of the tiers that apply yourself in sequence.

Where each principle is checked:

| Principle | Lens |
|---|---|
| KISS | structure (layers, nesting), duplication (speculative generality), slop (premature structure) |
| DRY, rule of three, wrong abstraction | duplication |
| YAGNI | duplication, dead code (options nothing sets), slop (compatibility for nothing) |
| SOLID: single responsibility | structure (divergent change) |
| SOLID: open-closed | duplication (repeated switches) |
| SOLID: Liskov, interface segregation, dependency inversion | structure (shallow modules, dependency direction), duplication (one-implementation seams) |
| Command-query separation | types and state |
| Fowler's smells | across all lenses, by name |
| Readable code, JSDoc | structure, slop, against [references/jsdoc.md](references/jsdoc.md) |
| Web Vitals (loading, interactivity, visual stability) | network, layout stability |
| Effects and state (React) | network (effects for data flow), model (redundant and contradictory state) |
| Query cost, RLS cost, locking | data layer |
| Service layer, idempotent webhooks, one rule one decider | backend structure |
| Consistency, one source of truth for a decision | model (gating), product (screens and copy), duplication |
| Accessibility (WCAG 2.2) | product; the floor in every lens |
| Root cause (five whys), a fix that prevents recurrence | bandages |
| Every line read | [references/line-pass.md](references/line-pass.md) |

The principles, with sources and the cases where each is WRONG:
[references/principles.md](references/principles.md). The numeric limits and TypeScript rules:
[references/conventions.md](references/conventions.md).

### Verify every finding

A lens reports leads. Before a finding enters the table, open the code and confirm it:

- **"Unused"**: search the whole repo for the name as a string too (routes, RPC and SQL names,
  i18n keys, computed imports, scripts, other apps, older clients in the field). Use
  `blast-radius` if the project has it.
- **"Duplicate"**: name the single rule both copies encode. No rule: they only look alike.
- **"Too big"**: name the two reasons it changes. One reason: size alone is not a finding.
- **"Redundant guard"**: prove untrusted data cannot reach it. If it can, it is the floor.
- **Against the rules**: if a project rule endorses it, drop it.

Drop what fails. Keep what you could not check, marked UNSURE, at the bottom.

### Rank

`02-findings.md`, most expensive first:

| # | Where | Finding | Principle | Fix | End state | Cost to keep | Hotspot rank | Effort |
|---|---|---|---|---|---|---|---|---|

**End state** is what proves the fix landed, checkable by someone else: a count that must fall
("11 requests on open, target 3"), a plan that must show an index scan, a constraint that
rejects the bad row, a test that fails without the change. A finding with no end state is not
finished. **Cost to keep** is concrete ("every new tender type edits these three switches"), never
"hurts readability". **Effort** is S (one commit), M (a few commits) or L (needs path C).
Order by cost × hotspot rank, then effort. Show the top of the table in the reply.

