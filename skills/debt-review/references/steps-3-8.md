# Steps 3 to 8: spec, design, plan, draft, execute, verify

Recovered verbatim on 2026-11-03 from SKILL.md at c18cc5d^ (the commit that moved this text out of SKILL.md did not write the file).

## 3 to 8. Spec, design, plan, draft, execute, verify

Path C only, except 7 and 8, which path B also runs. The detail and templates are in
[references/pipeline.md](references/pipeline.md). The rules that matter:

- **Spec before design.** What must not change is written down, with the test that pins it.
- **Prior art before any design.** A path C job on a rule or feature other systems have shipped (pricing, billing, booking, stock, auth, queues, sync) runs `prior-art`, and `backend-research` or `code-to-copy` when the answer is code, BEFORE a design is drawn. `04-target.md` opens with `## Prior art`: the saved folder, one row per project (how it shapes the thing, which file), what we take and reject. One design is the shape the mature projects use. `board.ts` fails a job whose `04-target.md` has no such section (2026-10-08, plan 0120 designed its shapes from the codebase alone).
- **The recommendation ranks by future debt, never by rewrite size**: pick the shape that leaves the fewest places a rule can drift and the least for the next feature to know; backfills and migration count are handled by characterisation tests and staging, not by choosing the smaller shape.
- **Design twice.** At least two target shapes, each with a module diagram, a wireframe of
  exported signatures with JSDoc (no bodies), and a sequence diagram of the flows that cross
  new seams. Delete any module that fails the deletion test, and any seam with one
  implementation.
- **Plan backwards** with a Mikado graph; leaves first; one commit per task; at most about
  five files per task; every file marked `[NEW]`, `[MODIFY]` or `[DELETE]`.
- **Draft first.** The wireframe goes into the repo as compiling files that delegate to the
  old code, before anything moves.
- **One task, one commit, shape only.** A bug found is its own commit. Pin behaviour with a
  test before changing it. Green after every step; red means revert and add a prerequisite.
  Delete the old shape once nothing reaches it. Never start a sweep the owner did not ask for.
  Use the project's `refactor` skill where it has one.
- **Pin untested behaviour with characterisation tests** (record what the code does today,
  assert exactly that) before anything moves.
- **Verify and lock in.** Re-measure and re-model; set the new diagrams beside the target;
  commit `summary.json` as the job's `baseline.json` and run `measure.ts --baseline=…` in the
  project's pre-push or ship check so no count can grow back; add a rule forbidding the old
  import direction; record the decision where the project keeps its rules. Never report a
  quality score.
- **Teach the next build.** Every path, A included, ends by adding each finding that holds
  beyond this project as one line, with project and date, under its area in
  `claude-house-rules/docs/build-checklist.md`, which the building skills read before writing;
  the project's own copy goes in a path-scoped rule pointing at `02-findings.md`.

