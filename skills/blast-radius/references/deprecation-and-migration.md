# Retiring a system and moving its users

Adapted from addyosmani/agent-skills `deprecation-and-migration` at aeac41d, MIT, Copyright (c) 2025 Addy Osmani.

Read this after the six questions in `SKILL.md`, when the change removes or replaces something: an RPC, a route, a feature, a library, a whole service. The questions say what the change reaches; this page says how to move what it reaches off the old thing before the old thing goes. Database columns and tables follow `schema-change` (expand, backfill, move readers, wait out clients, drop). An API that only grows follows `backend-research`'s `references/interface-design.md` (additive changes, one version).

## Contents

- Decide first
- Who has to move
- The four steps
- Three ways to run old and new together
- Code nobody owns
- Excuses that come up
- Done when

## Decide first

Every line kept costs tests, upgrades, security patches and attention from whoever works nearby. With enough users every observable behaviour is depended on, bugs and timing included, so an announcement alone moves nobody. Answer these before proposing a removal:

1. Does the old thing still do something nothing else does? Then it stays.
2. Who uses it? Count from the callers search, the database search and the production logs, never from memory.
3. Does the replacement exist and run in production? If not, build it first.
4. What does each user's move cost? A move you can script, you make yourself.
5. What does keeping it cost: a vulnerable dependency, a second code path in every change, a test suite nobody trusts?

Removing a feature people use, or replacing a service, is a new design direction: propose it to the owner with these five answers before starting. Deleting code with zero users found by questions 1 to 3 is a cleanup and needs no proposal.

When building something new, ask how it would be removed in three years. A narrow interface and a single entry point make that cheap.

## Who has to move

In this house the users of old code are the owner's own apps and the clients still running an old build (question 3). There is no outside team to announce to, so the rule is the one Addy calls the churn rule: whoever removes a thing moves its users.

| Kind | When | How |
|---|---|---|
| Advisory | the old path is safe and only costs upkeep | keep it working, route new work to the replacement, remove it once logs show no use |
| Compulsory | the old path is unsafe, or blocks a change that cannot wait | a minimum-version gate for native builds, a reload for PWAs and wall devices, then removal on a date the owner sets |

Default to advisory. A compulsory move on a native app means an App Store or Play release first, so the date follows review times, never the reverse.

## The four steps

1. **Build the replacement** and run it in production for the cases the old path covers. A replacement that is "better in theory" has not started.
2. **Write the move down.** One `docs/<subject>.md` page (see `new-project`'s decision records) says what replaces what, why, and the steps; a `@deprecated` JSDoc tag on the old symbol points at it.
3. **Move users one at a time.** For each caller: switch it, run its tests and the project's gate, remove its reference to the old path. A caller per commit keeps each step reversible.
4. **Remove the old path** only when callers, database objects and production logs all show zero use: the code, its tests, its config, its generated artefacts and the `@deprecated` notes, in one change, with the check from question 6 proving nothing still reaches it.

A new feature added to the old path while the move runs is a defect: it goes into the replacement.

## Three ways to run old and new together

**Strangler.** Both run; traffic moves to the new one in steps (a tenant, a share of requests, a venue), and the old one goes when it serves nothing. Fits a service or an RPC with a router in front.

**Adapter.** The old interface stays and calls the new implementation, so callers move later or never. Fits a module many callers import. The adapter is temporary and gets its own removal step.

```typescript
/** @deprecated Use `TaskService.findById`; see docs/task-service.md. */
export function getTask(id: number): OldTask {
  return toOldTask(taskService.findById(String(id)))
}
```

**Flag.** A per-tenant or per-user switch picks old or new, so one venue moves first. Every flag gets a removal date the day it is added; flags left behind are the sprawl `debt-review` hunts.

## Code nobody owns

Code with live callers and no one maintaining it: no change in six months, failing tests left failing, a dependency with a known vulnerability, docs that name systems that are gone. It gets one of two outcomes, an owner and upkeep, or a removal through the four steps. It never stays as it is.

## Excuses that come up

| Excuse | Answer |
|---|---|
| "It still works" | Unmaintained code gathers vulnerabilities and slows every change near it |
| "Someone might need it" | The commit history keeps it; rebuilding is cheaper than carrying it |
| "The move costs too much" | Compare with two or three years of upkeep for both paths |
| "Users will move on their own" | They do not; the remover moves them |
| "We can keep both" | Two paths double the tests, the docs and the bugs |
| "It is a one-line rename" | Old and new code run together during a deploy; see question 3 and `schema-change` |

## Done when

- The replacement ran in production for every case the old path covered.
- Every caller moved, each in its own commit, each passing the gate.
- Logs, the callers search and the database search show zero use.
- The old code, tests, config, generated files and `@deprecated` notes are gone.
- A named check fails if anything reaches the old path again.
