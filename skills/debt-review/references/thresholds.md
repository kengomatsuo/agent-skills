# Numeric thresholds

Recovered verbatim on 2026-11-03 from SKILL.md at c18cc5d^ (the commit that moved this text out of SKILL.md did not write the file).

## Thresholds

Defaults, overridden by the project's lint config; `measure.ts` uses these:

| Measure | Flag above | Source |
|---|---|---|
| Function length | 50 lines | ESLint `max-lines-per-function` default; Everything Claude Code |
| File length | 800 lines without a stated reason | Everything Claude Code |
| Cyclomatic complexity | 20 | ESLint `complexity` default |
| Cognitive complexity | 15 | `sonarjs/cognitive-complexity` default |
| Nesting depth | 4 | ESLint `max-depth` default |
| Parameters | 4 | ESLint `max-params` defaults to 3; 4 leaves room for an options object |
| Clone | 50 tokens and 5 lines | jscpd `--min-tokens` / `--min-lines` |

A threshold opens a question; the finding is the answer to it.

