---
name: debt-review
description: "PR review and maintainability audit: tests first, mutation check, twelve lenses, then a plan and board. Use for reviewing a PR or diff, tech debt, or a multi-file refactor plan."
user-invocable: true
---

# Debt is measured, modelled, planned, then paid one commit at a time

> **Local notes.** If `~/.claude/skill-notes/debt-review.md` exists, read it before starting.
> It holds this user's own projects, exceptions and commands, and where it disagrees with this
> file, it wins.

Four rules decide most questions here.

**RANK BY COST, NEVER BY UGLINESS.** Most changes land in a few files. Debt in a file that
changed 400 times this half-year costs every one of those changes; the same debt in a file
untouched for a year costs nothing until someone opens it. CodeScene's guidance: low code
health in a hotspot is expensive, in stable code it has lower priority
(codescene.io/docs/guides/technical/hotspots.html).

**LESS TO KNOW, NOT FEWER LINES.** The test for every change: will the next person need to
hold less in their head to change this safely? A clever one-liner that replaces five plain
lines fails it. Deleting a wrapper nobody needs passes it.

**THE CODE EXPLAINS ITSELF; JSDOC DOCUMENTS THE CONTRACT.** Names and shape carry the
meaning. An exported symbol gets a JSDoc block a caller can use; a reason goes in `@remarks`;
history goes in the commit or the docs. An inline comment survives only for a hazard no name
can carry, in one short line. [references/jsdoc.md](references/jsdoc.md) has the convention.

**THE FLOOR IS NEVER CUT.** Validation at a trust boundary (user input, network, database rows,
another process), authorisation and security checks, protection against data loss,
accessibility affordances, and behaviour somebody asked for. Removing one is a behaviour change,
never a cleanup, however redundant it looks.

## Steps

Read the file for the step you are on; each holds the full text, gates and commands.

| Step | File |
|---|---|
| The pipeline and its gates, 0b inventory, 1 measure and model | [references/steps-0-1.md](references/steps-0-1.md) |
| 2 lenses in parallel, verify every finding, rank | [references/step-2-lenses.md](references/step-2-lenses.md) |
| 3 to 8 spec, design, plan, draft, execute, verify | [references/steps-3-8.md](references/steps-3-8.md) |
| Numeric thresholds | [references/thresholds.md](references/thresholds.md) |

The twelve lens prompts: [Structure](references/lenses/structure.md), [Duplication](references/lenses/duplication.md), [Dead code](references/lenses/dead-code.md), [Types and state](references/lenses/types-and-state.md), [Slop](references/lenses/slop.md), [Network](references/lenses/network.md), [Layout stability](references/lenses/layout-stability.md), [Data layer](references/lenses/data-layer.md), [Backend structure](references/lenses/backend-structure.md), [Model](references/lenses/model.md), [Product](references/lenses/product.md), [Bandages](references/lenses/bandages.md). What each finds is in [references/lenses.md](references/lenses.md). Pass each lens the whole text of its prompt file.

## When NOT to

| Looks like debt | Leave it |
|---|---|
| Two similar blocks encoding different rules | they will change apart; merging couples them |
| A long file that is data (catalogues, manifests, test tables, migrations) | size is its job |
| A seam with a test adapter and a real one | two adapters make it a real seam |
| A guard at a trust boundary | the floor |
| Code nobody will change this year | cost is near zero; note it, fix nothing |
| A rewrite that "would be cleaner" | a rewrite is a project: path C, proposed separately |

## Evaluations

`evals/evals.json` holds six scenarios (a spaghetti module, a PR review, resuming a job, a whole-app depth audit, a network and layout audit, a bandages hunt)
with the behaviour each must show; `evals/results.md` records each run.

## Other references

[conventions](references/conventions.md), [jsdoc](references/jsdoc.md), [line-pass](references/line-pass.md), [pipeline diagrams](references/pipeline.md), [PR review](references/pr-review.md), [principles](references/principles.md), [research](references/research.md), [tools](references/tools.md), [tracking and board](references/tracking.md).
