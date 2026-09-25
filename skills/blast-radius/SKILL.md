---
name: blast-radius
description: Work out everything a change can break before making it — callers, policies, generated types, other apps in the monorepo, other tenants, and the clients still running last week's bundle. Use before deleting or renaming anything, before changing an RPC signature or a database column, before a refactor, and whenever a change looks local but the thing being changed is reached from more than one place.
when_to_use: "Trigger phrases: can I delete this, is this used anywhere, rename it, what breaks if, is anything still calling this."
user-invocable: true
---

# The deploy is not atomic, and the tree is not the system

**A ROUTE DELETED THIS MORNING CRASHED A DEVICE THIS AFTERNOON.** A change removed two
routes from a board app; a device still holding the previous bundle asked for one of them
and threw `Cannot read properties of undefined`. Nothing in the diff was wrong. The tree
was consistent with itself and inconsistent with what was running.

Answer all six questions before the change, and write the answers down.

## 1. Who calls it, in this repo?

`grep -rn` the identifier — the symbol, the route path, the RPC name, the message key, the
column name — across **every** app and package, not the one you are editing. In a
monorepo a shared package reaches apps you are not thinking about.

Search strings too. An RPC called through a REST layer is a string literal, and a rename
that type-checks clean still 404s at runtime.

## 2. What does the database hold that names it?

For a column or a table, before you drop or rename:

| Reaches it | Find with |
|---|---|
| RLS policies | `pg_policies` — a policy naming a dropped column fails at query time, not at migration time |
| Triggers and functions | `pg_get_functiondef` over `pg_proc`, grepped for the name |
| Views and generated columns | `pg_views`, `information_schema.columns` |
| Generated types | the generated types file — regenerate it in the same change |
| pgTAP | the suites that assert its shape |

## 3. Who is running the OLD code right now?

The clients that outlive a deploy, in descending patience:

- **A native app build.** A version from two months ago is still someone's daily driver,
  shipped through an app store's review process. The server stays compatible with it or
  the change is a breaking release.
- **A PWA with a service worker.** It polls and broadcasts a release, and there is still a
  window where a tab holds the old bundle.
- **A device that never reloads.** A till, a kitchen display, a board on a wall. These are
  the ones that find deleted routes.

A removal is therefore two deploys: stop producing it, wait out the clients, then delete —
add the new path, run both in parallel, and only then remove the old one.

## 4. Which tenants does it touch?

Multi-tenant means a data-shape change lands on every venue at once. Name them and say
what each holds today. A backfill that resolves for one tenant and not another is a
half-migration.

## 5. What is generated from it?

Generated types, the docs site built from `pg_catalog`, the sidebar index, message-key
unions, icon manifests, the plan index. Each one fails the check later rather than the
edit now, and each is cheap to regenerate in the same commit.

## 6. What proves the radius was covered?

Name the test, the pgTAP assertion, or the check that would fail if you missed one of the
five above. When nothing would, that is the first thing to write.

## Output

Before touching code, write the radius as a short list: what is reached, what is
generated, who is still running the old thing, which tenants, and what proves it. Where the
answer is "nothing else", say that too — a radius that was checked and found small is a
different statement from a radius nobody looked at.
