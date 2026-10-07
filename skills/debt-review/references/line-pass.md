# The line pass

The lenses look for kinds of problem. The line pass reads every function in the top hotspots,
line by line, and gives each a verdict. Google's review guide asks for the same discipline:
"look at _every_ line of code that you have been assigned to review", and do not "scan over a
human-written class, function, or block of code and assume that what's inside of it is okay"
(https://google.github.io/eng-practices/review/reviewer/looking-for.html, "Every Line").

## Contents
- When to run it
- What a reader does with each function
- The verdicts
- The per-file table
- Cutting a huge file across parallel agents
- Rules for the readers
- Merging and verifying

## When to run it

An option on path A, and part of path C's stage 2 when the scope is a hotspot. "The whole app"
runs it over the top 10 to 20 hotspots; a single file or a diff of a few hundred lines runs it
over everything in scope. It runs after the lenses, never instead: the lens findings are
passed to each reader so they are not found twice. Generated files, data tables, migrations
already shipped and test fixtures are scanned, not read line by line.

## What a reader does with each function

For every function, component, hook, SQL function and exported constant in its range, in file
order, answer these in this order and stop at the first that fails:

1. **Does anything call it?** Search by name and as a string. No caller: delete (dead-code
   rules apply, including older clients and string lookups).
2. **Is each line needed?** Read every line. A line that repeats a check the caller made, sets
   a value that is never read, builds something thrown away, or restates the line above is
   waste. Trust boundaries stay (the floor).
3. **Is each call cheap?** A call inside a loop, a sort or filter run on every render, a
   second pass over the same list, a query per item, an object rebuilt on each call: unoptimised.
   Count how often it runs per screen load or per action.
4. **Does it do one thing?** Name it in one sentence without "and". Two sentences: it holds two
   functions.
5. **Does the same rule live elsewhere?** Search a distinctive token. A copy elsewhere:
   merge with it.
6. **Would a new reader need a comment?** Then the name or the shape is wrong; say which.
7. **How does it connect?** Note the features and tables it touches. Two features that call it
   for different reasons mean it carries two rules.

## The verdicts

Every function gets exactly one:

| Verdict | Means | Must say |
|---|---|---|
| keep | Needed, one job, cheap, named well | nothing, or one phrase |
| simplify | Needed, but lines are wasted or work is repeated | how: the lines to remove or the form to use, with the line numbers |
| delete | Nothing needs it | why: the searches that found no caller, including string and older-client searches |
| merge with | The rule lives in a second place | where: the other function as `file:line`, and which becomes the single source |

A fifth outcome, **split**, is allowed as "simplify: split into A and B" when step 4 failed.
Never "rewrite" and never "refactor": a verdict names the change. A function over 50 lines
with a keep verdict states the one reason it is allowed to be long.

## The per-file table

One table per file, in file order, in the job folder as `02-line-pass/<file>.md`:

| Lines | Function | Verdict | Detail | Calls per use | Hotspot rank |
|---|---|---|---|---|---|
| 120-148 | `quoteHour` | simplify: remove the second sort (L131), the list is sorted at L122 | `rate`, `bands` | 1 per line change | 3 |

Under each table: the counts (functions read, keep, simplify, delete, merge, split), and the
total lines the verdicts would remove. Every row has a verdict: a function with no row was not
read, and the table is not complete.

## Cutting a huge file across parallel agents

A file too large for one reader is cut by line range. Cutting a file for READING never means
splitting it in the repo: where a project forbids splitting a file (a template of tens of
thousands of lines kept whole by the owner's rule), the ranges exist only in the job folder.

```bash
bun ${CLAUDE_SKILL_DIR}/scripts/chunks.ts <file> --size=1500
```

1. **Ranges come from the script, ending at a top-level declaration.** A function belongs to
   the chunk where it starts, whole, even when it runs past the chunk's last line. Chunks never
   overlap and together cover line 1 to the last line, so every line has exactly one reader.
   Check that the `from` of each chunk is the `to` of the one before, plus one.
2. **Size by cost, not only by lines.** About 1,500 lines per reader (about 1,000 for dense
   JSX or SQL). A chunk the script flags as over 1.5x is cut by hand at a blank line between
   declarations, or given to a reader whose whole job is that one declaration.
3. **Every reader gets the same context pack:** the header range (imports and setup, chunk 1),
   a symbol index of the file (the script's declaration list, with line numbers), the lens
   findings for the file, the project's rules, and the verdict format. A reader may open any
   other range to follow a call, never to judge it.
4. **Cross-chunk questions go in a column, not in a guess.** "Called from another chunk" and
   "same rule as a function in another chunk" are marked UNSURE with the other function's
   name; the merge step resolves them with one repo-wide search.
5. **At most four readers run at once** (the project's limits on parallel work apply: no
   reader runs tests or the full lint; each is read-only and runs no heavy check). Hand the
   rest out as readers finish. Record the chunk table and each chunk's state (queued, reading,
   done) in `02-line-pass/chunks.md` so a session that dies loses one chunk.
6. **Smaller files in the hotspot list are not cut.** One reader per file, up to three files
   per reader when each is under 600 lines.

## Rules for the readers

- Report, never edit. No file outside the job folder changes.
- Judge the code, not the style of the person who wrote it, and never by line count alone.
- A verdict without evidence is not a verdict: a "delete" without searches, a "simplify"
  without lines, a "merge" without the other location, is returned as UNSURE.
- Where the project has a rule that endorses what a step flags, the verdict is keep, and the
  row cites the rule.
- A bug found on the way goes in a separate list at the foot of the table, one line each. It
  is not a verdict and not fixed here.

## Merging and verifying

The coordinator concatenates the tables, runs the lens findings and the verdicts through the
same checks as every finding ("Verify every finding" in SKILL.md), resolves each UNSURE with a
repo-wide search, and rolls the counts up: functions read, lines removable, deletions,
merges. Show the totals and the five rows with the most removable lines in the reply; the
tables stay in the job folder. Each simplify, delete and merge verdict enters `02-findings.md`
as a finding, ranked the usual way, with the table row as its evidence.
