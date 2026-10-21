# Reviewing one diff or PR before merge

Adapted from addyosmani/agent-skills `code-review-and-quality` at aeac41d, MIT, Copyright (c) 2025 Addy Osmani.

The standard: approve a change when it leaves the code healthier, even if it is not how you would have written it. Block only on a finding you can prove and name. Review a diff you wrote yourself the same way; the author is the reader least able to see the gaps.

## Contents

- Who owns what
- Order of work
- Merge-ready pass: review, verify, fix, open
- The axes
- Tests first, then the mutation check
- Change sizing
- Findings and their labels
- Dead code
- Dependencies
- Verifying the verification
- Honesty
- Checklist

## Who owns what

| Question | Owner |
|---|---|
| Does the diff do what it claims: edge cases, error paths, races, off-by-one | `/code-review` (Claude Code's built-in), run at the effort the diff deserves. This path reads its output and judges whether the tests would catch what it found; it does not repeat the hunt. With no `/code-review` available, read the diff for these yourself, tests first. |
| Slop, comments, structure, duplication, dead code, types and state, bandages | the debt-review lenses, scoped to `git diff <base>...HEAD` and the files it touches |
| Request waterfalls, N+1, layout shifts, query cost, RLS cost | the network, layout stability and data layer lenses, measured, never guessed |
| Vulnerabilities, auth, injection, secrets | the floor (SKILL.md) checked on the diff; a whole-repo audit is `security-audit-house`; Postgres, RLS, RPC rules are `supabase-conventions` |
| What else this change can break (callers, policies, old clients) | `blast-radius` |
| A known cleanup the review asks for | `refactor`, as its own commit |
| Library choice and animation or component sources | `library-catalog` |
| Whether the tree is shippable | `ship-gate` |
| The commit message and PR title | `house-commit` |

A finding goes to the one owner above. Two owners reporting the same line is a duplicate; keep the sharper one.

## Order of work

1. Say the path (A, or B when the owner wants fixes) in one line, as for any job.
2. Context: read the PR text, the spec or card it implements, and the project's rules files. State the intended behaviour change in one sentence. A diff with no stated intent gets that question back before anything else.
3. Size the diff (below). A diff that is too large goes back for a split before the review.
4. Tests, then the mutation check.
5. Implementation, file by file, against the axes.
6. Lenses for the scope. Under about 300 changed lines, run the tiers that apply yourself in sequence, as SKILL.md says.
7. Verify every finding (SKILL.md, "Verify every finding"), then label and rank.
8. Verdict: approve, or request changes with the blockers listed.

## Merge-ready pass: review, verify, fix, open

When the owner asks to get a branch ready for their review (path B), run this around the steps above. Method from every-app/open-seo `merge-ready` at f569726, MIT, Copyright (c) 2026 Ben Senescu, rewritten.

1. **Bring the branch up to date first.** Fetch and merge the base into the branch, resolve conflicts (the base wins where the branch did not mean to change the code), and commit the merge alone, so conflict resolution stays apart from review fixes.
2. **Cover the whole scope.** The diff against the base, staged and unstaged changes, and every untracked file read in full. A new file the base lacks is still in the review.
3. **Run the axes in parallel subagents**, one per lens the scope touches, each with the full scope and the intent sentence. Add a **billing and metering** axis when the diff touches money or usage: spend a user can trigger without being counted, a charge on a failed path, a retry loop that multiplies a paid call, an endpoint whose cost per call is far above the rest. Each finding returns `file:line`, a label and one line of reason; theoretical edge cases in an early-stage product are a Consider.
4. **Verify each Required or Critical finding with its own subagent.** The verifier tries to disprove the finding against the code and answers one of three verdicts: APPLY (the finding stands), APPLY-MODIFIED (the problem is real and the proposed fix is wrong or too big; the verdict states the fix) or REJECT (the code already handles it or the finding misreads it). A rejected finding is dropped and, if it deserves a second opinion, listed in the PR's review notes. Considers and Nits need no verifier.
5. **Fix in logical commits**, one per concern, so the fix history reads on its own. Then run the project's full gate (`ship-gate` finds it) and repeat from step 3 on the changed lines when a fix was more than formatting, until the gate is green and no verified finding is open.
6. **Write the PR body** with three parts: what changed and why, in a few sentences with no per-file list; how to review (what to read first, which areas need judgment, what was left out); review notes (unfixed Nits, REJECT verdicts worth a second look). The title follows `house-commit`.
7. **The agent never merges the PR.** The owner reviews last. The report gives the PR link, a paragraph of summary and the points that need the owner's judgment.

## The axes

Each axis names who answers it.

1. **Correctness.** `/code-review`, plus the tests-first reading below.
2. **Readability and simplicity.** Structure and slop lenses against [conventions.md](conventions.md) and [jsdoc.md](jsdoc.md). The code explains itself; a new inline comment needs a hazard no name can carry. Could fewer lines do it, and does each new abstraction have a second caller (rule of three, [principles.md](principles.md))?
3. **Architecture.** Structure and duplication lenses. Does it follow the existing pattern, and if it adds one, why? Does a refactor remove concepts or only move them? Count what a reader must hold before and after; an unchanged count means the change did not simplify. A new conditional bolted onto an unrelated flow, or the same conditional repeated on one shape, is a missing model: ask for a helper, state or policy. Feature logic inside a shared module, a near-copy of the canonical helper, and a silent fallback hiding an unclear invariant are findings, each with the move that fixes it: replace the conditional chain with a typed model, collapse duplicate branches, reuse the canonical helper, make the type boundary explicit, delete the pass-through wrapper, extract or split.
4. **Security.** The floor. Is input validated at each trust boundary the diff adds, are secrets out of code and logs, is authorisation checked where the diff opens a door, are queries parameterised, is external data treated as untrusted? Removing any of these is a behaviour change, never a cleanup.
5. **Performance.** The diff-sized slice of the network and data-layer lenses: an N+1 or unbounded fetch, a missing page limit on a list, a waterfall, a large object in a hot path. Say the count ("one request per row, 40 rows on this screen"), never "could be slow".

## Tests first, then the mutation check

Read the tests before the implementation; they show what the author thinks the change does.

- Do tests exist for the change, and do they fail without it?
- Do they check behaviour through the public interface, not the implementation?
- Are the edge cases the diff introduces covered? Are the names readable?
- A bug fix carries the regression test that failed first.

Then answer "would these tests catch a regression?" by experiment, not by reading:

1. Copy the file to the scratchpad.
2. Invert one condition the change adds: drop a negation, swap `&&` for `||`, flip a comparison.
3. Run the test file or package that covers it, never the whole repo suite.
4. Restore the file from the copy. Never `git checkout` or `git stash` to restore: the tree is shared.

A mutation that stays green is a finding: name the missing test case. Try one mutation per condition the diff adds, up to about three; stop at the first red result per condition. A test whose only oracle is the code it tests is verification theatre (slop lens, item 8), not coverage.

## Change sizing

| Changed lines | Verdict |
|---|---|
| about 100 | reviewable in one sitting |
| about 300 | fine when it is one logical change |
| about 1,000 | too large; ask for a split |

One change addresses one thing, carries its tests and leaves the system working. Refactoring and new behaviour in one diff are two changes; a rename inside the touched lines may stay. File size counts as well as diff size: a small diff that grows a file past 800 lines (the house threshold, SKILL.md) without a stated reason needs the extraction first, then the addition. Where a project forbids splitting a file, its notes win and the finding is fixed inside the file.

Splits: stack (each change built on the last), horizontal (shared code or stubs first, then consumers), vertical (a thin full-stack slice), by file group (when reviewers differ). Large is acceptable for whole-file deletions and mechanical codemods where the reviewer checks the intent and the pattern's reach.

## Findings and their labels

A removal finding carries the evidence tier the lenses use: HIGH, MEDIUM, LOW ([lenses/slop.md](lenses/slop.md)). That tier says how sure you are the code can go. The label on the PR comment says what the author must do; the two are separate and a comment may carry both.

| Label | Meaning |
|---|---|
| none | Required: fix before merge |
| Critical: | Blocks merge: data loss, a security hole, broken behaviour, a floor check removed |
| Consider: | Worth doing, not required |
| Nit: | Style the formatter or the author may ignore |
| FYI | No action |

Every finding gives `file:line` and the concrete fix. Order by leverage: correctness and security, then structural regressions and missed simplifications, then the rest. One structural problem and ten nits means the structural problem is the review. Never report a quality score.

These are Required when the change makes structure worse, and a Consider otherwise: a refactor that relocates complexity, a file pushed past the threshold with no decomposition, feature logic in a shared module, a near-duplicate of a canonical helper, a silent fallback over an unclear invariant.

"I will clean it up later" is not accepted for a defect or for slop the diff adds: fix it in this change or file it as a card with an id. Surrounding old debt outside the diff is a card, never a blocker.

## Dead code

After any refactor, list what the diff left unreachable or unused, then verify it the house way (SKILL.md, "Verify every finding": search the whole repo for the name as a string too). A HIGH finding inside the diff's own code is deleted in the same change. A MEDIUM finding stays until its named gap is closed. A LOW finding is reported and kept. Ask the owner only when the evidence cannot settle it; do not ask about what a search already answers.

```
DEAD CODE
- formatLegacyDate() in src/utils/date.ts:12, replaced by formatDate(); no caller, no string reference. HIGH, delete.
- LEGACY_API_URL in src/config.ts:4, read by a script outside src/. MEDIUM, gap: whether the script still runs.
```

## Dependencies

Before a dependency is added, `library-catalog` says whether the house already uses or has researched one for the need. Then the usual four questions: does the existing stack already solve it, what does it weigh in the bundle, is it maintained (last release, open issues), what is its licence and does the project's audit report known vulnerabilities. The default is the standard library or an existing utility; every dependency is a liability.

An upgrade is a code change like any other:

1. Read the changelog, not the version number; a patch can change behaviour, and a major needs the migration notes.
2. One dependency per change, so a break names its cause and the revert is clean.
3. The suite is green before and after. Thin coverage around the dependency is the real finding: add the test first.
4. Review the lockfile diff for indirect changes. Never hand-edit it, and commit it.

Install and update with bun only. Triage of audit output and supply-chain risk is a security question, answered under the floor.

## Verifying the verification

Ask what the author ran and check it with your own eyes:

- Which tests ran, and on which packages? The review runs only the typecheck and tests of the packages the diff touches; a whole-repo suite, lint or build is the gate's job (`ship-gate`).
- Did a UI change get looked at on a running app, with screenshots or a width check?
- Is there a before and after for a performance claim?
- Does the commit message state the finding or the new invariant in `house-commit` form? "Fix bug" and "Phase 1" are not messages.

A claim of "tested" with no named command or screen is unverified.

## Honesty

- No rubber stamp: an approval states what was read and what was run.
- State a real defect as a defect, with the sequence that triggers it, not as "a minor concern".
- Push back on an approach with a clear problem and propose the alternative. Agreeing with the author to be agreeable is a failure.
- When the author has context you lack and disagrees, defer on the judgment call and keep the Critical items. Technical facts and measurements outrank preference; the project's style guide outranks taste; consistency with the codebase is acceptable when it does not make the code worse.
- Comment on the code, never on the person.
- AI-written code gets more scrutiny, not less: it reads as confident whether or not it is right.

## Checklist

Copy into the reply:

```
- [ ] Intent stated in one sentence; spec or card and rules files read
- [ ] Diff sized; split asked for if about 1,000 lines or two kinds of change
- [ ] /code-review run (or the correctness read done), tests read first
- [ ] Mutation check run on the conditions the diff adds, file restored from the copy
- [ ] Lenses run for the scope; every finding verified in the code
- [ ] Floor intact: boundary validation, authorisation, data-loss guards, accessibility
- [ ] Dead code listed with evidence tiers; HIGH removed
- [ ] New or upgraded dependencies checked against library-catalog and the changelog
- [ ] Author's verification checked; only touched packages run
- [ ] Findings labelled, ranked by leverage, each with file:line and a fix
- [ ] Verdict: approve, or request changes with the blockers named
```
