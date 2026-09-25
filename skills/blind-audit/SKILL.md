---
name: blind-audit
description: Audit a whole subsystem against the promise its users were given, by writing assertions BEFORE reading the code underneath. Use when asked to audit, sweep, or check a system end to end, when a subsystem has grown past what anyone has verified, before a release that touches money or access, and whenever every existing test passes and the behaviour is still suspect. Produces findings, not reassurance.
when_to_use: "Trigger phrases: audit it, sweep the whole thing, go through every, check it end to end, all the tests pass and I still do not trust it."
user-invocable: true
---

# Assert the promise, then read the code — never the reverse

> **Local notes.** If `~/.claude/skill-notes/blind-audit.md` exists, read it before starting. It
> holds this user's own folders, project rules and examples, and where it disagrees with
> this file, it wins.

**A SUITE WRITTEN FROM THE CODE ASSERTS WHAT THE CODE ALREADY DOES.** It goes green on
day one and finds nothing, forever. The method that works is the **blind suite**: state
the promise made to the user in plain sentences, turn each clause into an assertion, and
only then open the implementation.

One project's set of six such suites yielded, across three rounds: a tax posted as revenue
instead of a liability across three venues, a package a guest could buy for the price of a
tea, a stranger who could read every table's key, and eleven other findings — in a
codebase where every test was already passing.

## 1. Write the promise first, in the user's words

Open the file with it, verbatim, as the header comment:

> "A guest scans the QR on the table and joins it. They see your menu, add what they want
> with its options, and send the order. If you are closed, or past last order, they are
> told so instead of being allowed to order. They never see anyone else's table."

Take it from the marketing page, the onboarding copy, the client's own message, or the
user. Do not paraphrase it from the schema — the schema is the thing under test.

## 2. One clause, one assertion

Every clause of the promise becomes at least one case. Cover, for each:

- the happy path
- the boundary the clause names (closed, past last order, sold out)
- **what the actor may WRITE**, not only what they may read — for any surface reachable
  without an account, most of the file belongs here
- the other tenant. Every cross-tenant case needs a second fixture that exists only to be
  denied

## 3. Assert the STORED VALUE, never the absence of an error

An UPDATE a policy filters out changes zero rows and raises nothing. "The statement did
not throw" is not a denial. Read the row back and assert what it holds.

## 4. Only an assertion naming a figure can fail

The most expensive finding in one audit survived every existing test because the ledger's
closing plug absorbed the gap: the entry always balanced, so a test asserting "it
balances" was structurally incapable of failing. **An invariant the system maintains by
construction is not a test.** Name the account and the amount. Name the row and the value.

## 5. RED assertions stay red

An assertion that fails is a finding, not a bug in the suite. Mark it in place:

```sql
-- [RED] app.compute_charges omits `kind`, so post_sales_day credits every tax to 4200.
```

**Never make a RED green by weakening it.** A test that agrees with a defect is worth less
than no test. Each RED names the finding it carries and points at the report holding the
defensible reading.

## 6. The report, then the fixes

Write the findings up before fixing any of them — one entry per finding, with the reading
that is defensible and the one that is not. Then close them, one migration or one patch
per finding, and re-run. The suite is done when no TODO is left anywhere and every RED is
either green or re-marked with a reason.

## Scope one suite to one promise

Six narrow suites beat one wide one: `a ticket adds up`, `a line is what it says`, `a
member earns and spends`, `a table is rented by the hour`. Name the file after the
sentence, not the subsystem.

## Reporting

Numbers, always. `test db: 263 files, 6482 tests, PASS`. Then the findings, most expensive
first, each with what it cost in the real data — three venues, $1,070, $1,778, $27. A
finding without its magnitude cannot be prioritised.

Related: run `blast-radius` before you fix any finding, and turn each finding that
deserves one into a permanent guard so it cannot recur silently.
