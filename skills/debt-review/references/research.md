# What mature audits check, and what the lenses would miss

Fetched on 2026-10-07 from each organisation's own pages. This file decided the lens set in
[../SKILL.md](../SKILL.md): each row says what the source checks and which lens now covers
what the original five (structure, duplication, dead code, types and state, slop) did not.

## Contents
- The sources
- What changed in the lens set, and why
- Not fetched

## The sources

| Source | What it checks | What the five lenses missed | Now covered by |
|---|---|---|---|
| Google, "What to look for in a code review" https://google.github.io/eng-practices/review/reviewer/looking-for.html | Design, functionality (including concurrency and "edge cases"), complexity ("can't be understood quickly", over-engineering for a future problem), tests, naming, comments, style, consistency, documentation, and "look at _every_ line" you were assigned; ask a qualified reviewer for concurrency, security, accessibility, internationalization | Functionality and concurrency (races), the user-facing effect of a change, and the every-line rule | bandages (races), product (accessibility, consistency), [line-pass.md](line-pass.md) |
| Google, "The Standard of Code Review" https://google.github.io/eng-practices/review/reviewer/standard.html | The test is whether overall code health improves over time; "codebases degrade through small decreases in code health" under time pressure, by shortcuts | Small shortcuts that each look fine; the pile is the finding | bandages |
| Lighthouse overview https://developer.chrome.com/docs/lighthouse/overview | Audit categories: Performance, Accessibility, Best Practices, SEO | Accessibility as a category of its own; the five lenses only named it as part of "the floor" | product (accessibility section), layout-stability |
| Lighthouse performance scoring https://developer.chrome.com/docs/lighthouse/performance/performance-scoring | Weights in Lighthouse 10: FCP 10%, Speed Index 10%, LCP 25%, TBT 30%, CLS 25% | Time spent blocking the main thread is the heaviest lab weight; nothing measured it | layout-stability (long tasks), network (critical-path bundle) |
| Web Vitals https://web.dev/articles/vitals | Core Web Vitals cover loading (LCP within 2.5 s), interactivity (INP 200 ms or less) and visual stability (CLS 0.1 or less), measured in the field | All three user-visible outcomes | network, layout-stability |
| React, "You Might Not Need an Effect" https://react.dev/learn/you-might-not-need-an-effect | Derive during render; do work in the event that caused it; an Effect that notifies a parent "runs too late" and starts another render pass | Effect chains as a performance and correctness cost | network (effects for data flow), model |
| React, `memo` and `useMemo` https://react.dev/reference/react/memo , https://react.dev/reference/react/useMemo | Both are performance optimisations; React Compiler can apply the equivalent automatically | Hand-written memoisation that buys nothing | layout-stability (render cost) |
| React, "Choosing the State Structure" https://react.dev/learn/choosing-the-state-structure | Avoid redundant, duplicated and contradictory state | Already in types-and-state; extended to gating state | model |
| TanStack Query guides: request waterfalls, prefetching, query keys, important defaults, invalidation https://tanstack.com/query/latest/docs/framework/react/guides/request-waterfalls | Dependent and nested-component waterfalls, prefetch at the router, keys as the dependency list, `staleTime` default of zero, prefix invalidation | Everything about the client's request count | network |
| PostgreSQL, "Performance Tips" and "Using EXPLAIN" https://www.postgresql.org/docs/current/performance-tips.html | `EXPLAIN ANALYZE` actually executes the query and reports real time per node and `loops` | Per-call SQL cost; no lens read a plan | data-layer |
| PostgreSQL, "Explicit Locking" https://www.postgresql.org/docs/current/explicit-locking.html | Deadlocks, including from row locks without explicit locking | Lock order across functions | data-layer |
| Supabase, RLS and RLS performance https://supabase.com/docs/guides/database/postgres/row-level-security-performance | Index policy columns, wrap `auth.uid()` in `select`, name the role, compare timings with RLS on and off | Policy cost per row | data-layer |
| Supabase advisors https://supabase.com/docs/guides/database/database-advisors | A fixed list of performance and security checks, among them unindexed foreign keys, auth RLS initplan, unused index, multiple permissive policies, duplicate index | A ready checklist for the database | data-layer |
| SonarQube, "SonarQube rules" https://docs.sonarsource.com/sonarqube-server/quality-standards-administration/managing-rules/rules.md | Rules sorted by software quality (security, reliability, maintainability) and by coding attribute (consistency, intentionality, adaptability, responsibility); a "security hotspot" is code a person must review by hand | Reliability (bugs) is code-review's job and stays out; consistency across screens and features had no owner | product, duplication |
| Lean Enterprise Institute, "5 Whys" https://www.lean.org/lexicon-terms/5-whys/ | Ask why until the root cause is reached and eliminated; "the specific number five is not the point"; replacing the fuse or the pump lets the failure recur | Fixes that patch the symptom | bandages |
| Toyota, Toyota Production System https://global.toyota/en/company/vision-and-philosophy/production-system/ | Eliminate waste, inconsistency and unreasonable requirements (muda, mura, muri); stop the line on an abnormality so it is built out, not passed on | Waste in what the user does (extra presses) and an abnormality handled by a workaround downstream | product (presses), bandages |
| Google SRE Workbook, "Postmortem Culture" https://sre.google/workbook/postmortem-culture/ | Action items have an owner, a priority and "a verifiable end state"; "trying to change human behavior is less reliable than changing automated systems and processes"; a postmortem without action is "indistinguishable from no postmortem" | A finding with no end state; a fix that depends on people remembering | bandages, and the findings table in SKILL.md |
| Google SRE Book, "Postmortem Culture" https://sre.google/sre-book/postmortem-culture/ | A postmortem records root causes and follow-up actions that prevent recurrence; "You can't 'fix' people, but you can fix systems and processes" | Where the whys stop: at a design decision or a process with no feedback loop, never at a person | bandages |
| Stripe API, "Idempotent requests" https://docs.stripe.com/api/idempotent_requests | The server saves the status code and body of the first request per client-generated key and returns them on repeats, including 500s; keys up to 255 characters; pruned after 24 hours; errors if parameters differ from the original | Prior art for a command ledger as the root fix of retries and duplicate-write guards | bandages |
| IETF draft, "The Idempotency-Key HTTP Header Field" (v07, expired) https://www.ietf.org/archive/id/draft-ietf-httpapi-idempotency-key-header-07.html | Key MUST be unique and not reused with a different payload; reuse with a different payload SHOULD get 422; a retry while the original is processing SHOULD get 409 | Same; the standard shape of the two conflict answers | bandages |
| git-log documentation https://git-scm.com/docs/git-log | `-L` takes no pathspec and needs the function at the starting revision; `-S` finds commits that change the count of a string | Why SQL in migrations is traced with `-S<token> -- <dir>`, not `-L` | bandages |

## What changed in the lens set, and why

1. **Added `bandages`.** Google's standard (small shortcuts under pressure), the 5-whys
   source and the SRE workbook all treat a fix that stops at the symptom as the central
   failure, and none of the five lenses looked for it. It reads git history, which no other
   lens does.
2. **Kept the owner's five** (`network`, `layout-stability`, `data-layer`, `model`,
   `product`): each maps to a source above (Web Vitals and TanStack; Web Vitals CLS and INP;
   PostgreSQL and Supabase; React state guidance and Sonar's consistency attributes;
   Lighthouse and Google's consistency check).
3. **Accessibility lives in `product`, not in a lens of its own.** Lighthouse lists it as a
   category, but the checks are about screens and flows, which `product` already walks. Its
   rules come from WCAG 2.2 (see that file).
4. **Memoisation joined `layout-stability`** as a render-cost item, because React's own
   pages call it an optimisation to be measured, and it is the usual wrong answer to an INP
   problem.
5. **Tiers.** The original five run on every scope. `bandages` also runs on every scope (it
   costs one `git log`). `network` and `layout-stability` run when the scope holds client
   code, `data-layer` when it holds SQL or server functions, `model` and `product` when the
   scope crosses features. Reported in SKILL.md.
6. **Every finding names a verifiable end state** (SRE workbook): a count that must fall, a
   plan that must show an index scan, a metric that must stay under a limit.

## Not fetched

- `rules.sonarsource.com` (the rule catalogue): DNS lookup failed from this machine. The rule
  taxonomy above comes from Sonar's documentation site instead.
- React Compiler introduction (`react.dev/reference/dev-tools/react-compiler/introduction`):
  404. The compiler claim rests on the notes in the `memo` and `useMemo` reference pages.
- Supabase advisor pages per lint (`?lint=0003_...`): the site returned the same list page for
  each, so only the lint names are cited, and the rule texts come from the RLS pages.
