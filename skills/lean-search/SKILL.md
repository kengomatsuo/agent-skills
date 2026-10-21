---
name: lean-search
description: "Use BEFORE searching a codebase or running a command whose output size is unknown (grep, rg, find, logs, test runs, JSON, git log), and when a code-graph index (graphify, Graphicle, Graft or Trail-code), an LSP plugin or an output sandbox plugin is suggested. Finds code with counts before content, batches searches into one call, answers structure questions with ast-grep, and reduces many files or big output to the answer in one script."
when_to_use: "Triggers: a search that returned too much, a session that feels slow or expensive, questions about who calls a function or where something is defined, and any proposal to install a code graph, a language server plugin or an output sandbox."
user-invocable: true
---

# Search for the answer

> **Local notes.** If `~/.claude/skill-notes/lean-search.md` exists, read it before starting.
> Where it disagrees with this file, it wins.

A search costs twice: the bytes it returns stay in context for every later turn, and each call
is a full round trip. In one owner's 30 longest sessions grep returned about 200 tokens a call,
but there were 7,829 calls. Fewer calls save more than shorter output. graphify, Graphicle and
the context-mode sandbox plugin (removed 2026-10-21) measured no better than this (see
[references/research.md](references/research.md)).

## The habits

1. **Count, then read.** Ask how many and where before asking what.
   - `rg -c 'pattern' src | sort -t: -k2 -nr | head -20` gives files by match count.
   - `rg -l 'pattern'` lists files only. The Grep tool's default `output_mode` is already
     `files_with_matches`; switch to `content` only for the few files that matter.
   - Read content once the list is under about 20 files. Over that, narrow the pattern or the path.

2. **Read only the lines you need.** Locate with `rg -n -m 5 -M 200 'pattern' file`
   (`-m` caps matches per file, `-M` cuts minified lines), then `Read` with `offset` and `limit`
   of 40 to 80 lines around the hit. Add `-C 2` only when the match alone does not answer.

3. **One call, several questions.** Independent searches go in one message as parallel tool
   calls, or in one Bash call with a label each:
   ```bash
   rg -l 'useAuth' src; echo '== callers'; rg -n 'useAuth\(' src | head -20; echo '== tests'; rg -l 'useAuth' tests
   ```

4. **Structure questions go to ast-grep.** "Who calls X", "where is X defined" and "which files
   import X" are syntax questions, and a text grep also hits comments, strings and look-alikes.
   ast-grep matches the parse tree with no index to rebuild, for TypeScript, TSX, Swift and
   the other languages it parses:
   ```bash
   bunx @ast-grep/cli run -l ts -p 'refund($$$A)' --files-with-matches src
   bunx @ast-grep/cli run -l tsx -p 'import { $$$A } from "@/lib/money"' src
   bunx @ast-grep/cli run -l swift -p 'func load($$$A) { $$$B }' Sources
   ```
   Before deleting or renaming, hand the call sites to the `blast-radius` skill.

   Ask the LSP tool first: one call returns a symbol's definition or every reference, and
   after each edit Claude Code reports the type errors it introduced, so no build runs to find
   them. Every house machine has it: the `house-lsp` plugin (TypeScript, Swift, Python servers)
   from claude-house-rules `mods/`, with the binaries `install.sh` puts on the PATH and a
   session-start check that reinstalls them. Cloud sessions start no language server, so there
   ast-grep stays.

6. **"Which files does this task touch" goes to Trail-code.** The house build (`trail`, from
   claude-house-rules `scripts/trail-code.sh`, usage stats removed) keeps a tree-sitter map of
   every function and caller: `trail ask "<task>"` lists the matching files and functions,
   `trail callers <symbol> -d 3` gives the blast radius, `trail skeleton <file>` every signature
   without bodies. Run `trail init --agents claude` once per repo to add its prompt hooks.

5. **Big output becomes an answer in a script.** When a command can print more than a screen
   (a test run, a log, an API listing, `git log`), pipe it to what you want to know:
   - counts by name: `bun test 2>&1 | grep -E '^\s*[0-9]+ (pass|fail)'`
   - JSON: `gh api ... | jq '[.[] | select(.state=="open")] | length'`
   - anything else: `| bun -e 'const t = await Bun.stdin.text(); console.log(...)'`

   Claude Code already saves Bash output over 30,000 characters to a file and shows a
   2,000-character preview. Search that file with `rg` instead of running the command again.

7. **Think in code: one script for many files.** A question that needs 20 files read one by one
   (every route without an auth check, every `TODO` with its owner, the exports nothing
   imports) is one script that walks the files, tests each, and prints only the hits with
   `file:line`:
   ```bash
   bun -e 'for await (const f of new Bun.Glob("src/**/*.ts").scan()) { const t = await Bun.file(f).text(); if (/fetch\(/.test(t) && !/AbortSignal/.test(t)) console.log(f) }'
   ```
   Print findings with ids, lines and exact values, never the raw data: a script that dumps
   JSON has moved the cost, not removed it. A file you will edit still goes through `Read`.

8. **Save a big result once, then query the file.** A browser snapshot, a console or network
   dump, an MCP listing or a fetched page is saved to a file the first time (most browser
   tools take a filename; otherwise redirect into the session scratchpad) and then
   searched with `rg -n -m 5` or a script, as many times as the questions need. Re-running the
   call pays its bytes again each time. For a corpus queried over many turns (a doc set, a long
   log), load it once into `bun:sqlite` with an FTS5 table (it works on macOS as shipped; call
   `db.clearQueryCache()` before dropping or renaming the table) and ask ranked questions
   with `MATCH` and `ORDER BY rank`; put all the terms of one question in one query.

## What is installed, and what not

| Tool | What its own sources say | Verdict |
|---|---|---|
| house-lsp | Anthropic's typescript-lsp, swift-lsp and pyright-lsp configs in one house plugin | installed everywhere (owner, 2026-10-20) |
| Trail-code (was Graft) | tree-sitter map whose hooks add matching files to every prompt; 42% fewer tokens (8,070 to 4,650) and 4.2 to 2.3 calls on its authors' own 162-run benchmark | house build, usage stats, update check and npx launch removed (owner, 2026-10-20) |

Not installed (context-mode was removed, not just switched off):

| Tool | What its own sources say | Verdict |
|---|---|---|
| graphify | tree-sitter graph plus a hook on every search; tied grep on 100 SWE-bench tasks and used 29% more tokens | skip |
| Graphicle | Rust port of graphify, a week old; "tied grep on finding code, and we do not claim it saves tokens"; 16% more tokens | skip |
| context-mode | two node processes on nearly every tool call, about 1,050 tokens at session start, redirects WebFetch; its 96% saving is on chosen fixtures | removed 2026-10-21; habits 5, 7 and 8 do its useful part |

Re-check the graph tools when a benchmark from someone other than their authors shows a win on
code like yours.

The think-in-code, save-once and index-once habits come from reading context-mode's own
README and skills (Elastic-2.0, ideas only, no text or code taken).
