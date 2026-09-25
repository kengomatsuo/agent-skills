---
name: refactor
description: Change the shape of existing code without changing what it does — extract, rename, move, split, deduplicate, simplify. Use when code works but is hard to read or extend, when the same logic exists twice, when a file has grown past its subject, and before building on top of something confusing. Covers what may be touched in one commit and what must wait.
when_to_use: "Trigger phrases: clean this up, simplify it, extract that, this file is too big, we have the same logic twice, tidy the naming."
user-invocable: true
---

# A refactor changes shape and nothing else

Two rules decide almost every question here.

**ONE COMMIT IS A REFACTOR OR A BEHAVIOUR CHANGE, NEVER BOTH.** A rename mixed into a bug
fix makes the fix unreviewable and un-revertable, and `git log -S` stops finding when the
behaviour actually moved. Split them, refactor first.

**NEVER START A SWEEP UNPROMPTED.** A repo-wide rename, a convention change, a
dependency-wide migration: propose it, name the file count, and wait. When joining a
codebase that already mixes two conventions, match the file you are editing and say so.
This is a global rule, written because painful rename sweeps were needed after somebody
started one on their own judgment.

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
- Comments: seven words. Names: four. If the name needs more, the thing does too much.
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

For the mechanics of simplifying a specific function — nesting, naming, early returns —
a dedicated simplification skill, where the project has one, carries the catalogue. This
skill is about what may be touched and when.
