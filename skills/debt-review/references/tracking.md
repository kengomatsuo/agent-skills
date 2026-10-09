# Tracking and handoff

## Contents
- The rule
- The job folder
- The board
- Pulling a card
- Handoff at any moment
- Checking the board

## The rule

**THE REPO IS THE ONLY MEMORY THAT EVERY SESSION SHARES.** A chat transcript, a scratchpad
and Claude Code's auto memory all live on one machine (auto memory sits in
`~/.claude/projects/<project>/memory/`); another account or another laptop never sees them.
So findings, plan, board and handoff are files in the repo, committed and pushed, and a
session can stop at any second without losing more than the step it was in.

## The job folder

```
<plans folder>/<slug>/
  01-current.md     measurements and diagrams
  02-findings.md    ranked findings, each with an id D1, D2 …
  03-spec.md
  04-target.md
  05-plan.md        Mikado graph and tasks T1, T2 …
  BOARD.md          the kanban board and the handoff block
  08-verify.md
```

The plans folder is the project's own (`docs/plans/`, `docs/refactor/`), else
`docs/refactor/`. Raw tool output (`measure/`, `model/`) stays outside the repo or gitignored;
the numbered files quote what matters from it.

## The board

Kanban (看板) is Toyota's card system: work is pulled by whoever has capacity, never pushed,
and each column caps how much may sit in it at once. `BOARD.md`:

```markdown
# <job>: board

Run by the debt-review skill: load it, then `bun <skill>/scripts/board.ts` on this file.

## Handoff
- Updated: 2026-10-05T14:20Z by <session name> on <machine>
- Last commit: abc1234 T3 Move rental quoting into pos/rental/quote.ts
- In hand: T4, step 2 of 4: callers in apps/admin moved, apps/ops not yet
- Next action: `bun test packages/pos` then move apps/ops/src/data.ts:1180 to the new import
- Blocked on: nothing | owner's answer on <question>

## Backlog
- **D7** Benefit is a bag of optionals (types and state) · effort M

## Ready
- **T5** Delete the old quote helpers · blocked by T4 · finding D2

## Doing (limit 1 per session)
- **T4** Point callers at pos/rental/quote.ts · claim: <session>@<machine> 2026-10-05T14:02Z

## Review
- **T3** … · commit: abc1234 · check: `bun test packages/pos` 212 pass

## Done
- **T1** Draft: pos/rental/quote.ts delegates to data.ts · commit: 9f8e7d6
```

| Column | Holds | Leaves when |
|---|---|---|
| Backlog | findings (D) not yet planned, and L findings waiting for path C | a plan turns it into tasks |
| Ready | tasks (T) whose "blocked by" are all Done | a session claims it |
| Doing | claimed tasks, one per session | its commit lands green |
| Review | committed, waiting for the checkpoint checks or the owner | the checkpoint passes |
| Done | finished tasks with their commit | never |

A project whose rules forbid the agent to commit keeps finished cards in Review with
`commit: owner`; the owner's commit moves them to Done with its sha.

## Pulling a card

1. `git pull --rebase`. Read `BOARD.md`, the Handoff block first.
2. Take the top card in Ready (or resume your own in Doing). Move it to Doing with your claim,
   commit only `BOARD.md` with the message `Claim T4`, and push at once. A push that is
   rejected means someone else moved first: pull, read again, pick again.
3. Work the task as the plan says.
4. The task's commit carries the code AND the board move to Review (with the check that
   passed) AND a fresh Handoff block. One commit, so board and code never disagree.
5. At a checkpoint, run the checks for every card in Review and move them to Done.

A claim older than two hours with no commit after it is stale; another session may take it
over, writing `taken over from <old claim>` on the card.

## Handoff at any moment

A session can end mid-step: usage runs out, the laptop sleeps, context compacts. So the
Handoff block is rewritten at every commit, never only at the end, and it says enough for a
stranger to continue with no transcript:

- what was last committed;
- what is in hand right now, down to the step and the file;
- the exact next command or edit;
- anything waiting on the owner.

Uncommitted work at a hard stop is lost by design: steps are small enough that losing one
costs minutes. When a session sees its budget running low, it finishes or reverts the current
step, commits the board, and pushes.

The next session, on any account, starts with "continue the debt-review job in
`<plans folder>/<slug>`"; the skill sends it to `BOARD.md`.

## Checking the board

```bash
bun ${CLAUDE_SKILL_DIR}/scripts/board.ts <plans folder>/<slug>/BOARD.md
```

Prints the Handoff block and the next card to pull, and fails when a Done or Review card names
a commit git does not have, when a session holds more than one Doing card, or when a claim is
stale. Run it when picking up and before every push.
