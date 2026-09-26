---
name: code-to-copy
description: Find open-source projects that already built what you need, worldwide, read their schema and service code, and write down exactly what to copy and what to leave. Use when the user says "find open source we can copy", "search for more", "go wider", before designing a feature a hobby shop, template or regional platform has likely already shipped, and whenever a plan leans on a paid API that someone may have replaced with free code or data. Complements prior-art (decide use, copy or build) and backend-research (fan-out across competitors).
when_to_use: "Trigger phrases: find open source to copy, search for more, go wider, is there an open-source version, who else built this, free alternative, we don't want to pay for it."
user-invocable: true
---

# Find code to copy, then read it

> **Local notes.** If `~/.claude/skill-notes/code-to-copy.md` exists, read it before starting.
> It holds this user's own folders and constraints, and where it disagrees with this file,
> it wins.

The famous platforms are rarely the best thing to copy. A 68-star shop engine built for
the same country on the same ORM, or a 295-star delivery app from a market with the same
problem, often holds the exact table you need. The job is to find those, read their code,
and say precisely what to take.

## 1. Write the need and the constraints

One sentence for the need, without your solution in it. Then the constraints that filter
candidates: runtime, database, ORM, auth library, hosting size, licence, and **what the
user will not pay for**. The free path is searched first; a paid service is listed only
as a fact when no free one exists.

## 2. Search wide with topics, not phrases

`gh search repos "nextjs ecommerce drizzle"` matches phrases in names and descriptions and
often returns nothing. Topics work:

```bash
gh search repos --topic=ecommerce --topic=drizzle-orm --sort stars --limit 10 \
  --json fullName,stargazersCount,pushedAt,description,isArchived
```

Run many combinations in one sandboxed script and print only the table:

- **Stack topics:** the ORM, the auth library, the framework, the database.
- **Domain topics:** the feature's own words, plus `self-hosted`, `single-store`.
- **Local words:** the domain's term in the market's language (the word for shipping cost,
  for province, for cash on delivery). Regional projects never use the English term.
- **Markets with the same problem:** another country with the same payment habit, courier
  landscape or regulation often solved it first.
- **The business's own name in every big market:** the same kind of business goes by a
  different word, and a different codebase, in each country (a cram school is a 培训机构
  selling 课时包 in China, a 塾 in Japan, a 학원 in Korea, a bimbel in Indonesia). Search
  each word, and the forges where that market publishes: Chinese projects mostly live on
  Gitee, which `gh` cannot search, so open it in a real browser session.

An English-only search that finds nothing close is a signal to go local, never a verdict
that nothing exists. Keep going until at least four candidates survive step 3 beyond the
ones already known.

Parallel agents share one browser window: each opens its own tab (`tabs_create_mcp`),
batches navigate and read in one call, and never closes a tab it did not open.

## 3. Verify each candidate from its own repo

```bash
gh api repos/<o>/<r> --jq '"stars=\(.stargazers_count) license=\(.license.spdx_id) pushed=\(.pushed_at[:10]) archived=\(.archived)"'
```

Drop it, with the reason written down, when it is archived, stale for a year, unlicensed,
or when its schema turns out not to cover the feature (a template with 1.5k stars can have
no orders table).

Judge a fork against the project's own stack. A close domain match on a different ORM or
auth library is a set of modules to copy, never a base to fork: moving it costs a rewrite
before the first feature. Read the licence per package: a monorepo can ship an AGPL app
beside MIT UI packages, so the app is layout reference only while the packages can be
copied.

## 4. Read the tree, then the files

The README says what the project wants to be. The tree says what it is:

```bash
gh api "repos/<o>/<r>/git/trees/<branch>?recursive=1" --jq '.tree[].path' \
  | grep -iE 'schema|migrations?/|state|stock|inventory|shipping|webhook|audit|review'
```

Copy each file worth reading into the research folder with its permalink at the commit
SHA on the first line. Code is copied, never paraphrased. For a candidate whose screens
the project may copy, the UI goes in too: app shell and navigation, theme tokens, page
layouts and the list, table and status components, plus its README or docs screenshots
downloaded with `curl`. A file you read but did not save does not count.

## 5. Grep for the mechanics that break

For every candidate, find how it handles the parts that go wrong, and quote the line:

- **Concurrency:** is stock checked and decremented under a row lock, or read in app code
  and written back? `$inc: -qty` with no check means stock can go negative.
- **State:** are status changes a `from → to` table enforced in the query, or free writes?
- **Idempotency:** what stops a webhook delivered twice from acting twice?
- **Money:** integer minor units or floats?

These findings are what make a project worth copying or not.

## 6. Check every claim in the source's own words

A paid service is compared on its pricing, API and terms pages: per-transaction fee,
subscription, payout time, onboarding requirements (business registration, tax number,
bank account), and whether the same API covers a second need (a shipping aggregator that
collects cash on delivery also issues tracking numbers and labels). A cell nobody could
confirm stays marked unconfirmed, and a number found only on a reseller's blog counts as
unconfirmed. Signing up for an account is the user's step, never the agent's.

Demo content follows the same free-first rule: seed photos come from a free-licence library
(quote the licence page's commercial-use sentence), are downloaded only with the user's
yes, and every file's page URL, author and licence go in a `sources.json` beside them.


"Free" is checked on the vendor's page, "may get banned" in the library's README, a
regulation's status in the official register. A page that will not load in a fetch tool
opens in a real browser session. Quote the sentence; a summary from memory is a guess.

## 7. Write the table

| Project | Where, licence, activity | Stack | Take (file) | Leave (why) |
|---|---|---|---|---|

Then one line per dropped candidate with the reason, and the file each "take" came from.
Every "take" names a file in the folder; run `bun <skill-dir>/check-notes.ts <folder>`
on the notes table and fix what it lists before handing the table on.
Hand the table to `prior-art` when the question becomes use, copy or build.
