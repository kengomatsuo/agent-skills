---
name: refactor
description: "Changes code shape without changing behaviour: extract, rename, move, split, deduplicate. Use before cleaning up or simplifying existing code."
when_to_use: "Triggers: requests to clean up, simplify, extract, split a large file, deduplicate logic or tidy naming."
user-invocable: true
---

# A refactor changes shape and nothing else

> **Local notes.** If `~/.claude/skill-notes/refactor.md` exists, read it before starting. It
> holds this user's own folders, project rules and examples, and where it disagrees with
> this file, it wins.

Two rules decide almost every question here.

**ONE COMMIT IS A REFACTOR OR A BEHAVIOUR CHANGE, NEVER BOTH.** A rename mixed into a bug
fix makes the fix unreviewable and un-revertable, and `git log -S` stops finding when the
behaviour actually moved. Split them, refactor first.

**NEVER START A SWEEP UNPROMPTED.** A repo-wide rename, a convention change, a
dependency-wide migration: propose it, name the file count, and wait. When joining a
codebase that already mixes two conventions, match the file you are editing and say so.
This is a global rule, written because painful rename sweeps were needed after somebody
started one on their own judgment.

Copy this checklist into your reply and tick items off:

```
- [ ] blast-radius answered
- [ ] Behaviour pinned by a passing test, numbers recorded (no test: write it first)
- [ ] Sibling modules read
- [ ] Each step run green (red: undo that step, return to it)
- [ ] The project's full check passes, with no new warnings and no test edited to pass
- [ ] The diff is shape-only (an output changed: move that change to its own commit)
```

## Before

1. **`blast-radius`.** A refactor is where "it looked local" goes wrong most often — a
   rename hits string literals, RPC names, policy definitions and generated types that no
   compiler checks.
2. **Establish the behaviour you are preserving.** Where a test already pins it, run it and
   record the numbers. Where none does, write it FIRST — a refactor with no test is a
   rewrite with optimism. `blind-audit` is the method when the subsystem is large.
3. **Read the neighbours.** `match-the-app` for UI; for anything else, the sibling module
   that does the same job. The target shape is the one the codebase already uses, not the
   one you would pick from scratch.

## During

- Move in steps that keep the tree green. Extract, run. Rename, run. Delete, run.
- Identifiers stay **English**, whatever language the UI speaks. Table, column, function,
  variable, type, prop, token, route segment, test name. Only strings a user reads are
  localised.
- Delete the old path in the same change once nothing reaches it. A refactor that leaves
  both shapes standing has doubled the surface, not simplified it.
- The code explains itself, and JSDoc documents the contract (`debt-review`,
  [its JSDoc convention](../debt-review/references/jsdoc.md)). An inline comment stays only for
  a hazard no name can carry, in one short line of seven words or fewer. Names: four words.
  If the name needs more, the thing does too much.
- Simplify what the task touched or is about to build on, and leave other code as it is. The
  catalogue of signals, the equivalence traps and the TypeScript, Python and React examples
  are in [references/simplification.md](references/simplification.md).
- Understand before removing: what calls it, which test pins it, what `git blame` says. A guard
  with no known reason stays until you find one.
- A change that would touch more than 500 lines by hand gets a codemod or AST transform, and
  as a sweep it is proposed first.
- Values keep coming from tokens and config. A refactor is not the moment a literal
  appears.

## Not a refactor

| Looks like one | Actually |
|---|---|
| "Simplifying" a guard that was load-bearing | a behaviour change — find why the guard exists first |
| Replacing a hand-rolled thing with a library | a dependency decision — `prior-art` first |
| Reformatting a file you also edited | two commits |
| Deleting an unused export | check `blast-radius` question 1 for string callers before believing "unused" |
| Renaming to a convention this repo does not use | a sweep — propose it |

## After

- The project's own check command, run in full.
- The diff reads as shape-only. Anything in it that changes an output is the thing you
  said you were not doing.
- The commit subject says what the shape now is: `Move scanCue to scan-dedup, which imports
  nothing`.

For the mechanics of simplifying a specific function (nesting, naming, early returns, which
rewrites change behaviour), read [references/simplification.md](references/simplification.md).
This file decides what may be touched and when.

Revert a step when a test needed editing to pass, the result reads harder than the original,
or error handling went missing. Not every attempt succeeds.

**Target shape:** a refactor moves code toward the five units in ~/claude-house-rules/docs/creation-pattern.md; name the unit each moved piece becomes.
