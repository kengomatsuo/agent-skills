---
name: debt-review
description: "Use BEFORE merging a large change, when code feels like spaghetti or every change touches too many files, and when asked to clean up, optimise, minimise, DRY up or simplify a codebase or review it for maintainability. Measures hotspots, clones, dead code, import cycles and complexity with tools, runs four parallel reviewers (structure, duplication and abstraction, dead code, types and state) against KISS, DRY, YAGNI, SOLID and Fowler's smells, ranks findings by what they cost to keep, then fixes them one behaviour-preserving commit at a time."
when_to_use: "Triggers: spaghetti code, tech debt, maintainability review, KISS, DRY, YAGNI, SOLID, clean code, code smells, dead code, duplicated logic, a file too big to work in, unspaghettify, optimise or minimise code."
user-invocable: true
---

# Debt is ranked by what it costs, then paid one commit at a time

> **Local notes.** If `~/.claude/skill-notes/debt-review.md` exists, read it before starting.
> It holds this user's own projects, exceptions and commands, and where it disagrees with this
> file, it wins.

Three rules decide most questions here.

**RANK BY COST, NEVER BY UGLINESS.** Most changes land in a few files. Debt in a file that
changed 400 times this half-year costs every one of those changes; the same debt in a file
untouched for a year costs nothing until someone opens it. CodeScene's guidance: low code
health in a hotspot is expensive, in stable code it has lower priority
(codescene.io/docs/guides/technical/hotspots.html). Measure first, then review the top of the
list.

**FEWER LINES IS NOT THE GOAL; LESS TO KNOW IS.** The test for every change: will the next
person need to hold less in their head to change this safely? A clever one-liner that replaces
five plain lines fails it. Deleting a wrapper nobody needs passes it.

**THE FLOOR IS NEVER CUT.** Validation at a trust boundary (user input, network, database rows,
another process), authorisation and security checks, protection against data loss,
accessibility affordances, and behaviour somebody asked for. Removing one is a behaviour change,
never a cleanup, however redundant it looks.

Copy this checklist into your reply and tick items off:

```
- [ ] 1. Scope fixed: a diff, a folder, or the repo's top hotspots
- [ ] 2. Project rules read (CLAUDE.md, AGENTS.md, .claude/rules, lint config)
- [ ] 3. Measured: bun ${CLAUDE_SKILL_DIR}/scripts/measure.ts, report saved
- [ ] 4. Four lenses run in parallel, each given its prompt file verbatim
- [ ] 5. Every finding verified against the code (unverifiable: dropped or marked UNSURE)
- [ ] 6. Ranked table written: cost to keep × hotspot rank
- [ ] 7. Fixes applied one per commit, each green before the next (red: undo, return to 5)
- [ ] 8. Re-measured; before and after numbers in the report
```

## 1. Scope

| Asked for | Scope |
|---|---|
| Review a change, a PR, "before I merge" | `git diff <base>...HEAD`, plus the files it touches |
| Clean up a folder, a module, a feature | that path |
| "The codebase", "optimise everything" | the top 10 to 20 files of the hotspot list, never the whole tree |

A whole-repo pass reviewed file by file buries the five findings that matter under five hundred
that do not. The hotspot list is the scope. Generated, vendored and lock files are never in it.

## 2. Read the project's rules first

A documented project convention beats every heuristic in this skill. If the project's rules
say comments are long incident records, a long comment is not a finding. If they say a
pattern exists for a reason, the duplication it causes is not a finding. Collect the rules
files once and hand them to every lens.

## 3. Measure

```bash
bun ${CLAUDE_SKILL_DIR}/scripts/measure.ts --out <scratch-dir> [path...]
```

It needs `git` and `bun`; everything else runs through `bunx` and is skipped with a note when
it does not apply to the project. What it runs, and why each tool, is in
[references/tools.md](references/tools.md). It writes `report.md` and one JSON file per tool
into `<scratch-dir>`, outside the repo. Run it ONCE and hand the report to every lens; lenses
never run heavy checks of their own.

The report's sections: hotspots (commits × lines), unused files, exports and dependencies,
copy-paste clones, import cycles, and functions over the complexity limits.

## 4. Four lenses, in parallel

Spawn one subagent per lens. Pass each the FULL text of its prompt file (read it, do not
paraphrase), the scope, the report path, and the rules files from step 2.

| Lens | Prompt | Finds |
|---|---|---|
| Structure | [references/lenses/structure.md](references/lenses/structure.md) | size, nesting, parameter sprawl, shallow modules, cycles, divergent change |
| Duplication and abstraction | [references/lenses/duplication.md](references/lenses/duplication.md) | one rule in two places, missed reuse, wrong abstractions, speculative generality |
| Dead and stale | [references/lenses/dead-code.md](references/lenses/dead-code.md) | unused code, flags that stopped deciding, stale comments, needless guards |
| Types, state and errors | [references/lenses/types-and-state.md](references/lenses/types-and-state.md) | type escapes, illegal states, redundant state, swallowed errors |

Small scope (one file, a diff under ~300 lines): run the four prompts yourself in sequence
instead of spawning agents.

The principles behind every lens, with sources and the cases where each one is WRONG, are in
[references/principles.md](references/principles.md). Read it when a finding rests on one and
you are not sure it applies.

## 5. Verify every finding

A lens reports leads. Before a finding enters the table, open the code and confirm it:

- **"Unused"**: search the whole repo for the name as a string too (routes, RPC and SQL
  names, i18n keys, computed imports, scripts, other apps, older clients in the field). Use
  `blast-radius` if the project has it.
- **"Duplicate"**: say what single rule both copies encode. If you cannot name it, the two only
  look alike: drop it.
- **"Too big / too complex"**: name the two reasons it changes. If there is one, size alone is
  not a finding.
- **"Redundant guard"**: prove untrusted data cannot reach it. If it can, it is the floor.
- **Against the rules**: if a project rule endorses it, drop it.

Drop what fails. Keep what you could not check, marked UNSURE, at the bottom.

## 6. Rank

One table, most expensive first:

| # | Where | Finding | Principle | Fix | Cost to keep | Hotspot rank | Effort |
|---|---|---|---|---|---|---|---|

- **Cost to keep** is concrete: "every new tender type edits these three switches", "a status
  added in SQL silently falls into `default`". Never "hurts readability".
- **Effort** is S (one commit, under an hour), M (a few commits) or L (a plan of its own).
- Order: cost × hotspot rank, then effort ascending. An L finding in a hotspot is proposed as
  its own plan with the steps and the file count, never started inside this review.

Write the table to the scratch folder and show the top of it in the reply.

## 7. Fix

Everything the user asked to have fixed, S and M first, in table order. Use the project's
`refactor` skill where it has one; the rules that matter:

- **One finding, one commit, shape only.** A bug found while refactoring is its own commit,
  before or after, never inside.
- **Pin behaviour first.** A test covers the code before you change it, or you write one.
- **Green after every step.** Run the project's typecheck and the tests that cover the files,
  scoped to them. Red: undo that step, fix your understanding, try again.
- **Delete the old shape in the same commit** once nothing reaches it. Leaving both doubles the
  surface.
- **Never start a sweep unprompted.** A rename or pattern change across many files is proposed
  with its file count and waits for a yes.
- **Match the neighbours.** The target shape is the one the codebase already uses.

## 8. Re-measure and report

Run `measure.ts` again into a second folder and compare. The report gives the findings fixed
with their commits, the numbers before and after (unused exports, clone lines, cycles,
functions over the limits, the top hotspot's size), what was skipped and why, and the L
findings proposed as plans. Never a quality score: there is no baseline that makes one mean
anything.

## Thresholds

Defaults, overridden by the project's lint config. `measure.ts` uses these:

| Measure | Flag above | Source of the number |
|---|---|---|
| Cyclomatic complexity per function | 20 | ESLint `complexity` default |
| Cognitive complexity per function | 15 | `sonarjs/cognitive-complexity` default |
| Nesting depth | 4 | ESLint `max-depth` default |
| Parameters | 4 | ESLint `max-params` defaults to 3; 4 leaves room for an options object |
| Function length | 80 lines | ESLint `max-lines-per-function` defaults to 50; 80 keeps JSX components out of the noise |
| Clone | 50 tokens and 5 lines | jscpd `--min-tokens` / `--min-lines` |

A threshold opens a question; the finding is the answer to it. A function over a limit with
one reason to change is not a finding.

## When NOT to

| Looks like debt | Leave it |
|---|---|
| Two similar blocks encoding different rules | they will change apart; merging couples them |
| A long file that is data (catalogues, manifests, test tables, migrations) | size is its job |
| A seam with a test adapter and a real one | two adapters make it a real seam |
| A guard at a trust boundary | the floor |
| Code nobody will change this year | cost is near zero; note it, fix nothing |
| A rewrite that "would be cleaner" | a rewrite is a project, proposed separately |
