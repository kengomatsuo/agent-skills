# Code conventions the review holds code to

## Contents
- Where these come from
- Readable code with no comments
- Size and shape
- TypeScript
- Errors and boundaries
- State and data
- Leftovers

## Where these come from

The numbers and TypeScript rules follow Everything Claude Code's `rules/common/coding-style.md`,
`rules/common/code-review.md` and `rules/typescript/coding-style.md`
(https://github.com/affaan-m/everything-claude-code, MIT), checked against ESLint's own rule
defaults. A project's documented convention overrides any line here; say so in the finding.

## Readable code with no comments

The code says what it does through names and shape. A comment is the last resort, never the
first.

| Instead of a comment that… | Do this |
|---|---|
| says what the next lines do | extract them into a function whose name says it |
| explains a variable | rename the variable |
| explains a magic value | a named constant |
| explains a condition | a named predicate (`const isLateCheckout = …`) |
| documents what a function takes, returns or throws | JSDoc on the function ([jsdoc.md](jsdoc.md)) |
| tells the story of a bug or a decision | the commit message, or the project's docs |
| marks a section of a long file | split the file |

What may stay inline: one short line giving a reason the code cannot show (a browser bug, a
law, an ordering constraint), seven words or so. Commented-out code never stays.

## Size and shape

| Measure | Limit |
|---|---|
| Function | 50 lines; over it, name the two jobs and split |
| File | 200 to 400 lines typical; 800 needs a stated reason (data, generated and test files are exempt) |
| Nesting | 4 levels; use early returns |
| Parameters | 4; then an options object |
| Cyclomatic complexity | 20 (ESLint default); cognitive 15 (SonarJS default) |

One concept per file. One reason to change per module.

## TypeScript

- Exported functions declare parameter and return types; locals infer.
- `type` for unions and mapped types, `interface` for shapes meant to be extended.
- String-literal unions or `as const` objects, never `enum`.
- `unknown` and a narrow, never `any`. No `!` non-null assertion outside tests.
- A `switch` over a union ends in an exhaustive check (`const _exhaustive: never = x`).
- Ids, money and other domain values get a branded or named type, not a bare `string` or
  `number`.
- Named props types for components.
- `import type` for type-only imports.

## Errors and boundaries

- Validate at every boundary (request, database row, storage, URL, another process) with a
  schema; infer the type from the schema.
- Inside the boundary, trust the types: no defensive checks for impossible cases.
- Never swallow an error. Catch only what you can recover from; narrow `error: unknown`
  before use.
- Fail fast and visibly; a failure never reads as empty data.

## State and data

- Return new objects; do not mutate arguments. Copy before `sort`.
- Derive what can be derived; store only what cannot.
- Independent async work runs together (`Promise.all`), dependent work in sequence.
- No N+1 queries, no unbounded queries, pagination on lists that grow.

## Leftovers

No `console.log` in production code, no TODO without an owner and a date, no hardcoded
success value, no fixture outside tests, no dead flag, no re-export kept "for compatibility"
with nothing to be compatible with.
