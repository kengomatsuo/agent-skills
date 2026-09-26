---
name: backend-research
description: Before designing any backend feature (tables, statuses, an API, a webhook, a job, permissions, billing or stock logic), look at how competitors and open-source apps with the same feature built it. Fan out parallel agents to open-source codebases (their migrations, schema and service code), competitors' public API and webhook references, the bug and incident record of both, and the specs that bind the feature; save everything into a research folder outside the repo, then design from it. The backend twin of design-research. Use whenever a backend feature is new or being reworked.
when_to_use: "Trigger phrases: how do others model this, what does Stripe or Square or Toast do, look at competitors, design the tables, schema for, status flow, state machine, webhook, refunds, subscriptions, inventory, split bill, loyalty points, multi-tenant, how should the API look."
user-invocable: true
---

# Read how others built the feature, then design

> **Local notes.** If `~/.claude/skill-notes/backend-research.md` exists, read it before starting. It
> holds this user's own folders, project rules and examples, and where it disagrees with
> this file, it wins.

`prior-art` asks whether to use an existing system, copy its design, or build. This skill
gathers the evidence for the second and third answers: how the mature products shaped the
same data, and what broke for them. When the question is "should we adopt X", run
`prior-art` and hand its step 3 to the agents below.

## RESEARCH FIRST. NO MIGRATION IS WRITTEN UNTIL EVERY AGENT HAS REPORTED.

Until the last agent is back AND `README.md` (step 3) exists, you do not write a
migration, a table sketch, an RPC signature or a status enum. A schema drafted in parallel
is built from memory and the research then only decorates it, the same failure
`design-research` exists to stop. Count the agents launched against the completion notices.

## 1. Brief (one paragraph, you write it)

The feature in one sentence without your solution in it ("a customer pays part of a bill
now and the rest later, and the cashier never loses track of what is owed"). Then the
actors, every state you already know of, the edge cases you suspect, and the constraints
that are this project's alone: multi-tenancy, offline clients, the local payment
gateways, the runtime (serverless, edge, a queue or none). Every agent gets the same brief.

## 2. Fan out: four agents in parallel, in the background

| Agent | Source | Best output |
|---|---|---|
| Open-source code | apps that ship the same feature, found with `gh search repos` and `gh search code` (for commerce and POS: Medusa, Saleor, Odoo, ERPNext, Invoice Ninja; for billing: Lago, Polar, Kill Bill; for booking: Cal.com, Hi.Events; for CRM and ops: Twenty, Chatwoot, Plane) | **their migrations, schema files and service code** in `code/`, each with the permalink at the commit SHA in a header comment |
| Competitor APIs | public API and webhook references of the commercial products (Stripe, Square, Toast, Shopify, Adyen and whoever leads the domain) | the object model: fields, statuses and allowed transitions, idempotency keys, the webhook event list, versioning |
| Failure record | issues, changelogs, migration guides and postmortems of the projects above, searched for `race`, `duplicate`, `double`, `timezone`, `rounding`, `refund`, `idempotent`, `offline`, `migration` | each bug they hit, dated and linked, with the fix they chose |
| Specs | the rules the feature cannot negotiate: the payment network's or central bank's spec, tax and invoicing rules, the gateway's settlement rules, Standard Webhooks, ISO 4217 minor units | constraints, each quoted briefly with the link |

Each agent writes into `<research>/<project>-<topic>/<source>/`, where `<research>` is a
folder outside every repo (the user's choice; default `~/backend-research/`):
- `code/<repo>--<path-with-dashes>` for copied source, never paraphrased
- `notes.md`: a table of # | URL | file | what to take, in one concrete sentence. The file
  column names a file in this folder for EVERY row, or says `gated: <reason>`

**Looked at is not captured.** Every source is saved before it is cited:
- an issue: `gh issue view <n> --repo <o>/<r> --json number,title,state,createdAt,closedAt,url,body,comments > issues/<o>-<r>-<n>.json`
- an API reference or doc page: its text as `<vendor>-<page>.md`, URL and date on line 1
  (a JS-rendered page through Claude in Chrome `get_page_text`)
- a regulation or spec: the PDF itself with `curl`, checked with `file` so an HTML error
  page never lands as `.pdf`
- code: the raw file at the commit SHA, never a paraphrase

Before reporting, each agent runs `bun <skill-dir>/check-notes.ts <its folder>` and reports
only when it exits 0.

Parallel agents share one browser window: each opens its own tab (`tabs_create_mcp`),
batches navigate and read in one call, and never closes a tab it did not open.

Primary sources only: the project's own repo and docs, never a comparison blog. Verify a
project is alive with `gh api repos/<owner>/<repo> --jq
'{stars:.stargazers_count,pushed:.pushed_at,archived:.archived}'` before learning from it.
A gated or paywalled source is written down as gated. JS-rendered docs are opened in a
real browser session such as Claude in Chrome, never guessed. In a repo that forbids agents from running heavy checks, say so
in the brief.

The folder sits outside the repo for the same reason as in `design-research`: one
project's research serves the next.

## 3. Synthesise

Run `bun <skill-dir>/check-notes.ts <research>/<project>-<topic>` first; a non-zero exit
sends the agent that owns the missing rows back. Then read the four `notes.md` files and
the strongest code. Write
`<research>/<project>-<topic>/README.md` with:

- a table, one row per product, showing how each models the core entity: its tables or
  objects, its statuses, who may move it between them
- every edge case at least one of them handles, with the file it came from
- what we take, and what we reject with the reason (it assumes one tenant, it needs a
  queue we do not run, it solves a scale we will not reach)
- open questions only the user can answer

## 4. Design, then propose

Only after the README exists. Write the design against the project's own conventions for
SQL and for shipping migrations, citing the README row behind each decision: a table,
status diagram or API shape, never paragraphs. This is new work, so propose it and wait
for yes. When the research ends in a use, copy or build decision, record it in
`docs/<thing>-is-<choice>.md` as `prior-art` describes.
