# JSDoc in place of comments

## Contents
- The rule
- When to write a block
- What a good block holds
- Tags in TypeScript
- Turning a comment into code or JSDoc
- Examples
- Enforcing it
- Sources

## The rule

Code explains itself through names and shape. JSDoc documents the contract a caller needs:
what the symbol does, what it takes when that is not obvious, what it throws, how to use it.
An inline `//` comment survives only for a hazard no name can carry (a browser bug, an
ordering trap), in one short line.

## When to write a block

- Every exported function, class, type, interface and constant gets one. Non-exported
  symbols get one only when name and type do not say what they are for.
- A block that repeats the name is worse than none: `/** The user id. */ userId` is a
  finding. Google's guide gives `@param fooBarService The Bar service for the Foo
  application.` as the example of what not to write.
- `@param` and `@returns` appear only when they add something the name and type do not.

## What a good block holds

| Part | Holds | Notes |
|---|---|---|
| Summary (first sentence, before any tag) | what it does, as a third-person verb phrase | "Rounds a bill to the venue's smallest coin." |
| `@param name - text` | a fact about the argument the type cannot state (unit, range, who owns it) | hyphen after the name, no `{type}` |
| `@returns` | what comes back when it is not obvious (never rejects, empty on X) | |
| `@throws` | every error a caller must handle, and when | one tag per error |
| `@remarks` | the reason, constraint or history behind the design | where a "why" comment moves to |
| `@example` | a short fenced `ts` block, title on the first line | one per distinct use |
| `@see`, `{@link Symbol}` | related symbols | TypeScript resolves both in the editor |
| `@deprecated` | what to use instead | a bare `@deprecated` is a finding |
| `@typeParam T - text` | what a type parameter means | not `@template` |

## Tags in TypeScript

- No types in braces: `@param {string} id` repeats the signature. TypeScript reads types from
  the code in `.ts` files; JSDoc types matter only in `.js` files.
- Do not use `@type`, `@typedef`, `@callback`, `@template`, `@implements`, `@private`,
  `@override` or `@enum` in `.ts` files; the language says each of these itself.
- `@internal`, `@beta`, `@alpha` only when an API extractor reads them.

TSDoc sorts standard tags into core (`@param`, `@returns`, `@remarks`, `@deprecated`,
`@typeParam`, `@link`, `@privateRemarks`, `@label`, `@packageDocumentation`), extended
(`@example`, `@throws`, `@see`, `@defaultValue`, `@inheritDoc`, `@override`, `@readonly`, …)
and discretionary (`@alpha`, `@beta`, `@experimental`, `@internal`, `@public`).

## Turning a comment into code or JSDoc

Try these in order and stop at the first that works:

1. **Rename** the variable or function so the comment is no longer needed.
2. **Extract** the commented lines into a function, constant or predicate whose name is the
   comment. A boolean argument with a `/* shouldRender= */` note becomes an options object.
3. **Move the reason** a caller needs into the symbol's JSDoc summary or `@remarks`.
4. **Move the history** (which incident, which ticket, which date) into the commit message or
   the project's docs. Code is not a changelog.
5. **Keep** one short `//` line only for a hazard inside the body that no name can carry.

## Examples

Before:

```ts
// Round to the nearest 100 because IDR has no coins under Rp100.
// This came from the 2026-08 incident where a till showed Rp12.345.
const r = Math.round(x / 100) * 100;
```

After:

```ts
/**
 * Rounds an amount to the smallest coin the venue's currency has.
 *
 * @remarks Cash tills cannot pay out a value below the smallest coin.
 */
function roundToSmallestCoin(amount: MinorUnits, coin: MinorUnits): MinorUnits {
  return Math.round(amount / coin) * coin;
}
```

A contract with an error and an example:

```ts
/**
 * Splits a bill into equal shares, putting the remainder on the first share.
 *
 * @param parts - how many people pay; at least 1
 * @throws RangeError when `parts` is below 1
 *
 * @example Three ways
 * ```ts
 * splitEvenly(10_000, 3); // [3_334, 3_333, 3_333]
 * ```
 */
export function splitEvenly(total: MinorUnits, parts: number): MinorUnits[] { … }
```

A deprecation that helps:

```ts
/** @deprecated Use {@link splitEvenly}, which keeps the remainder on one share. */
```

Real codebases worth copying, read on 2026-10-05: TanStack Query `queryClient.ts` (summary,
`@param x -` only with real information, fenced `@example`, `{@link}`), Effect `Option.ts`
(summary, when to use, titled examples, `@see`), Zod (one-line member summaries, deprecations
naming the replacement), Supabase-js `SupabaseClient.ts` (several titled examples). Vitest's
bare `@deprecated` is the counter-example.

## Enforcing it

eslint-plugin-jsdoc 65 ships a TSDoc preset. Add to the flat config:

```js
import jsdoc from 'eslint-plugin-jsdoc';

export default [
  jsdoc.configs['flat/recommended-tsdoc-error'],
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'jsdoc/require-jsdoc': ['error', {
        publicOnly: { esm: true, cjs: false },
        require: { FunctionDeclaration: true, ClassDeclaration: true, ArrowFunctionExpression: true, MethodDefinition: true },
        contexts: ['TSInterfaceDeclaration', 'TSTypeAliasDeclaration'],
      }],
      'jsdoc/informative-docs': 'error',
      'jsdoc/no-types': 'error',
      'jsdoc/require-param': 'off',
      'jsdoc/require-returns': 'off',
      'jsdoc/require-throws': 'error',
      'jsdoc/require-hyphen-before-param-description': ['error', 'always'],
    },
  },
];
```

`require-param` is off because it demands a tag for every parameter, which contradicts "only
when it adds something"; review catches the rest. No plugin rule limits inline `//` comments;
the core rules `no-inline-comments` and `no-warning-comments` cover part of it, and the slop
lens covers the rest. Run the config on the scope before turning it on repo-wide; on a large
existing codebase add it as `warn` first and fix file by file.

## Sources

TSDoc tag kinds https://tsdoc.org/pages/spec/tag_kinds/; TypeScript JSDoc reference
https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html; Google TypeScript
style guide, comments and documentation
https://google.github.io/styleguide/tsguide.html#comments-documentation; jsdoc.app tag pages;
eslint-plugin-jsdoc README and rule docs (github.com/gajus/eslint-plugin-jsdoc).
