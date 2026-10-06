# Measurement tools

## Contents
- What measure.ts runs
- Requirements and defaults
- model.ts
- When a number is wrong
- Optional tools
- Versions checked

## What measure.ts runs

| Step | Tool | Command it runs | Finds |
|---|---|---|---|
| Hotspots | git | `git log --since=6.months --name-only`, lines per file | where change concentrates; commits × lines ranks it |
| Unused code | knip 6 | `bunx knip@6 --reporter json --no-exit-code --no-progress` | unused files, exports, types, dependencies, duplicate exports |
| Clones | jscpd 5 | `bunx jscpd@5 <paths> --min-tokens 50 --min-lines 5 --reporters json --output <dir>` | copy-pasted blocks |
| Cycles | knip 6 | `bunx knip@6 --cycles --reporter json` | import loops touching the scope |
| Limits | the project's ESLint | `bunx eslint -f json --rule '{"complexity":["warn",20]}' …` on the scope or top hotspots | functions over complexity, depth, parameter and length limits |

Every result is filtered to files git tracks and that are not generated (a path under `dist*/`,
a `.gen.`/`.d.ts` file, or a header saying generated, do not edit, or database dump; see
`scripts/generated.ts`). ESLint runs only on the scope or the top hotspots, so a whole-repo
pass stays cheap.

## Requirements and defaults

`git` and `bun` must be installed. knip, jscpd and dependency-cruiser are fetched on first use
(`bunx`, and `~/.cache/debt-review-tools` for dependency-cruiser), so the first run needs the
network. Defaults and why:

| Default | Why |
|---|---|
| `--since=6.months` | long enough to see which files every feature touches, short enough to ignore code that has settled |
| `--top=20` | the top of the list holds most of the churn; a longer list buries it |
| generated-header check reads the first 600 characters | generators write their banner on the first lines |
| board claim stale after 2 hours | a task is sized to finish well inside that; longer means the session died |

## When a number is wrong

- **knip reports a whole app as unused.** It could not load that app's config (the report's
  notes list each failure). Add a `knip.json` that declares the entries by hand and disables
  the plugin that failed (`"vite": false` per workspace). Plugin and workspace options:
  https://knip.dev/reference/configuration.
- **knip reports scripts and CLIs as unused files.** Nothing imports a script you run by hand.
  Declare `scripts/**` as an entry in the root workspace.
- **Clones between a source and its synced copy.** A file another script writes (an edge
  function copy of a shared module) is generated; give it a "GENERATED FILE - DO NOT EDIT"
  header and the scan skips it.
- **A JSX component over the length limit.** Most screens are. Length is a question, never a
  finding: the structure lens decides whether it has two reasons to change.

## model.ts

`model.ts` runs dependency-cruiser 18 with `--no-config -T mermaid`: once with `--collapse`
to one box per top-level folder (`packages.mmd`), once with `--focus <path> --focus-depth 1`
for the scope and its neighbours (`focus.mmd`). dependency-cruiser reads TypeScript only when
the `typescript` package sits beside it, which `bunx` does not arrange, so the script installs
both once into `~/.cache/debt-review-tools`.

## Optional tools

| Tool | Use it for | Command |
|---|---|---|
| dependency-cruiser 18 | forbidden imports between layers or packages, beyond cycles | `bunx depcruise --init`, then `bunx depcruise src -c .dependency-cruiser.js -T err` |
| eslint-plugin-sonarjs 4 | cognitive complexity (default 15), identical functions, duplicated strings | add `sonarjs.configs.recommended` to the flat config |
| type-coverage 2 | share of identifiers typed `any` | `bunx type-coverage -p tsconfig.json --detail --strict` |
| lizard 1.24 | per-function complexity outside JS/TS (Swift, Kotlin, Python, Go, Rust and more; not Postgres SQL) | `pipx run lizard -C 15 -w .` |
| fallow 3 | a single-binary second opinion: dead code, dupes, health, hotspots | `bunx fallow health --format json` (young; run beside knip, never instead) |
| ast-grep | a project-specific smell as a rule that can then run in CI | `sg scan` with YAML rules |

typescript-eslint rules worth enabling for debt that no preset turns on:
`switch-exhaustiveness-check`, `consistent-type-imports`; `no-unnecessary-condition` is only
in `strict-type-checked`.

## Versions checked

2026-10-05 from the npm registry: knip 6.39.0, jscpd 5.4.0 (a Rust rewrite), dependency-cruiser
18.5.0, eslint-plugin-sonarjs 4.2.2, type-coverage 2.30.3, fallow 3.31.0. ESLint core defaults
from its rule docs: `complexity` 20, `max-depth` 4, `max-params` 3, `max-lines-per-function`
50. ts-prune still works but finds only unused exports; knip covers it.
