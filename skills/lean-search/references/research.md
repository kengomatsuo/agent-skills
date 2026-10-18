# Research behind lean-search

Read 2026-10-18 from primary sources: each project's own repository, its installed files, and
the Claude Code docs.

| Source | What it says |
|---|---|
| [Graphicle README](https://github.com/Graphicle-AI/graphicle) | "In our tests it tied grep on finding code, and we do not claim it saves tokens." On 100 SWE-bench Verified tasks plain Claude Code, Graphicle and Graphify found every changed file in 95, 95 and 94; "Graphicle used 16% and Graphify 29% more tokens than plain Claude Code, and the agent never called Graphicle's tools." Created 2026-10-14, Apache-2.0. |
| [Graphicle migration guide](https://github.com/Graphicle-AI/graphicle/blob/main/docs/migrate-from-graphify.md) | Graphicle is a Rust port of Graphify's code graph with a memory layer. |
| [Graphify README](https://github.com/Graphify-Labs/graphify) | tree-sitter graph of about 40 languages, no LLM for code; `graphify claude install` adds a PreToolUse hook before search calls and file reads. "Cut agent token spend by 80%" is claimed for the paid Graphify Cloud only. Apache-2.0. |
| [context-mode README](https://github.com/mksglu/context-mode) and installed v1.0.169 `hooks/hooks.json` | 11 `ctx_*` MCP tools over a SQLite FTS5 index. PreToolUse on Bash, WebFetch, Read, Grep, Agent and every `mcp__` tool; PostToolUse on nearly every tool, each a `node` process. SessionStart routing block of 4,169 characters. Elastic License 2.0, not OSI open source. |
| context-mode `BENCHMARK.md` (installed) | 96% saved across 21 scenarios on captured fixtures (376 KB to 16.5 KB); its own network-requests row saves 13%. |
| [Claude Code tools reference](https://code.claude.com/docs/en/tools-reference) | Bash output inline up to about 30,000 characters; past that, a file in the session directory plus a 2,000-character preview. Grep's `output_mode` defaults to `files_with_matches`. |
| [Claude Code hooks reference](https://code.claude.com/docs/en/hooks) | "All matching hooks run in parallel"; PostToolUse `updatedToolOutput` can replace a result. |
| ripgrep 14.1.1 `rg --help` (installed) | `-c/--count`, `-l`, `-m/--max-count`, `-M/--max-columns`, `-o`. |
| ast-grep 0.45.3 and 0.51.0 `run --help` (installed, `bunx @ast-grep/cli`) | `-p` pattern, `-l` language, `--files-with-matches`, `--json`; checked on TypeScript and Swift call sites. |

## The owner's own numbers

30 longest recent transcripts, counted by script on 2026-10-18:

| What | Calls | Tokens |
|---|---|---|
| Bash grep or rg | 7,829 | about 1.6M, 200 a call |
| Bash cat, sed, head | 5,757 | about 1.1M |
| Read of text files | 806 | about 0.2M |
| context-mode `ctx_search` and `ctx_execute` | 60 | about 74K |

The search output was small per call; the count of calls was the cost.
