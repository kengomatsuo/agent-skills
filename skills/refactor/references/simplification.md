# Simplifying a function

Adapted from addyosmani/agent-skills `code-simplification` at aeac41d, MIT, Copyright (c) 2025 Addy Osmani.

The commit rules, the sweep rule and the checklist are in [SKILL.md](../SKILL.md). This file
holds the judgment for one function or one small area: what to look for, what to leave alone,
and where a simplification goes wrong. Measured thresholds (size, nesting, parameter count)
and the comment convention belong to `debt-review`: see
[its structure lens](../../debt-review/references/lenses/structure.md) and
[its JSDoc convention](../../debt-review/references/jsdoc.md).

## Contents

- The test for a simplification
- Understand the code first
- Signals worth acting on
- Where simplifying goes wrong
- TypeScript and JavaScript
- Python
- React
- Excuses and red flags

## The test for a simplification

A change counts when a new team member reads the result faster than the original. Fewer lines
is not the aim. A one-line nested ternary loses to a five-line `if` chain.

Three more conditions hold for every change:

- **Same behaviour for every input.** Same output, same errors, same side effects in the same
  order. A change you cannot show equivalent does not go in. If a test needs editing to pass,
  behaviour moved: revert the step.
- **The project's style.** Read `CLAUDE.md`, `.claude/rules/` and the neighbouring files, then
  match their import order, declaration style, naming, error handling and type depth. A
  change that adds a second style is churn.
- **Only the code the task touches.** Tidy what you changed or are about to build on. Code
  elsewhere stays as it is unless the owner widens the scope; a wider change follows the sweep
  rule.

## Understand the code first

A fence across a road stays until you know why it is there. Before changing or removing
anything, answer:

- What is this code responsible for, and what calls it or is called by it?
- Which edge cases and error paths does it handle, and which tests pin them?
- Why might it look this way: a performance limit, a platform quirk, an old incident?
- What does `git blame` and the commit message say about its origin?

When two of these have no answer, read more before editing. Code that looks pointless and has
no history is the residue of rushed iteration, and removing it is fine once the answer is
"nothing reaches it".

## Signals worth acting on

Each row is a signal, not a quota. Where `debt-review` gives a threshold, use its number.

| Signal | Move |
|---|---|
| Deep nesting | Guard clauses with early returns, or a named helper |
| A function holding two jobs | Split it, one name per job |
| Nested ternary | `if` chain, `switch` or a lookup table |
| Boolean flag parameter, `doThing(true, false)` | Options object or two functions |
| The same condition checked in several places | One named predicate |
| Generic names: `data`, `result`, `temp`, `item` | Name the content: `validationErrors` |
| Abbreviations: `usr`, `cfg`, `evt` | Full words; `id`, `url` and `api` stay short |
| A name that misstates the behaviour, such as a `get` that writes | Rename to the real behaviour |
| The same block in several places | One shared function, once the copies are truly the same job |
| Unreachable branch, unused variable, commented-out code | Delete after `blast-radius` confirms nothing reaches it |
| A wrapper that adds nothing, a factory for one product, a strategy with one strategy | Call the thing directly |
| A cast to a type the compiler already infers | Remove the cast |
| A comment that restates the next line | Delete it; the code says it |
| A comment giving a reason | Move it into the JSDoc `@remarks` of the exported symbol; an inline line stays only for a hazard no name can carry |

## Where simplifying goes wrong

- **Inlining a helper that named a concept.** The call site gets harder to read.
- **Merging two simple functions into one complex one.**
- **Dropping an abstraction that exists for a test seam or a second caller.** Check the callers
  and the tests first. An abstraction with no caller today and no reason in its history goes.
- **Counting lines.** See the test above.
- **Removing error handling to make code look cleaner.** That is a behaviour change.
- **Making a hot path slower.** Where a measurement shows the plain version loses, keep it.
- **Simplifying code about to be rewritten.** Leave throwaway code alone.

Prop drilling through several components is a design question (context or composition). Flag
it to the owner; do not refactor it as part of a tidy-up.

## TypeScript and JavaScript

```typescript
// Dense ternary chain
const label = isNew ? 'New' : isUpdated ? 'Updated' : isArchived ? 'Archived' : 'Active';

// Named mapping
function getStatusLabel(item: Item): string {
  if (item.isNew) return 'New';
  if (item.isUpdated) return 'Updated';
  if (item.isArchived) return 'Archived';
  return 'Active';
}
```

```typescript
// Chained reduce with inline logic
const result = items.reduce((acc, item) => ({
  ...acc,
  [item.id]: { ...acc[item.id], count: (acc[item.id]?.count ?? 0) + 1 }
}), {});

// Named step
const countById = new Map<string, number>();
for (const item of items) {
  countById.set(item.id, (countById.get(item.id) ?? 0) + 1);
}
```

```typescript
// Manual array building
const activeUsers: User[] = [];
for (const user of users) {
  if (user.isActive) activeUsers.push(user);
}
// Filter
const activeUsers = users.filter((user) => user.isActive);

// Redundant boolean return
function isValid(input: string): boolean {
  if (input.length > 0 && input.length < 100) return true;
  return false;
}
// Return the condition
function isValid(input: string): boolean {
  return input.length > 0 && input.length < 100;
}
```

Two rewrites look safe and are not:

- **`return await` to `return` in an async function.** Inside `try/catch` it changes which
  errors the function catches, and it changes stack traces. Remove it only where no `try`
  wraps the call and nothing reads the trace.
- **`if (x) a = x; else a = y` to `a = x || y`.** `||` also replaces `0` and `''`. Use `??`
  when only `null` and `undefined` should fall through, and check which one the original meant.

## Python

```python
# Verbose dictionary building
result = {}
for item in items:
    result[item.id] = item.name
# Comprehension
result = {item.id: item.name for item in items}

# Nested conditionals
def process(data):
    if data is not None:
        if data.is_valid():
            if data.has_permission():
                return do_work(data)
            else:
                raise PermissionError("No permission")
        else:
            raise ValueError("Invalid data")
    else:
        raise TypeError("Data is None")

# Guard clauses, same errors in the same order
def process(data):
    if data is None:
        raise TypeError("Data is None")
    if not data.is_valid():
        raise ValueError("Invalid data")
    if not data.has_permission():
        raise PermissionError("No permission")
    return do_work(data)
```

## React

```tsx
// Two branches that differ in two values
function UserBadge({ user }: Props) {
  if (user.isAdmin) {
    return <Badge variant="admin">Admin</Badge>;
  }
  return <Badge variant="default">User</Badge>;
}
```

Collapsing this into two ternaries on the same condition is not simpler: the reader checks
the condition twice. Leave it, or move the pair into one lookup keyed by role when a third
role arrives. User-visible strings such as "Admin" stay in the app's language and its
string files; only identifiers are English.

## Excuses and red flags

| Excuse | Answer |
|---|---|
| "It works, leave it" | Code that is hard to read is hard to fix when it breaks. |
| "Fewer lines is simpler" | Comprehension speed is the measure. |
| "I will tidy this unrelated code too" | Noisy diff, unplanned regressions. Stay in scope. |
| "The types document it" | Types give structure. A name gives intent. |
| "The abstraction might help later" | Delete it now, add it when a second caller exists. |
| "The author must have had a reason" | Check `git blame`. Often the reason is gone. |
| "I will refactor while I add the feature" | Two commits, refactor first. |

Stop and reconsider when any of these appears:

- A test needed editing to pass.
- The "simpler" code is longer and harder to follow.
- Names changed to your taste, away from the project's.
- Error handling went missing.
- You edited code you do not fully understand.
- One commit holds many simplifications, or code outside the task.
