#!/usr/bin/env bash
# Build dist/<skill>.zip for every skill, for the Claude app (Customize > Skills > Upload a skill).
# Each ZIP holds the skill folder at its root, as the upload expects. The Claude app
# accepts only name, description, license, allowed-tools, metadata and compatibility
# (anthropics/skills quick_validate.py), so the Claude Code keys are folded into description.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."
rm -rf dist && mkdir -p dist
stage=$(mktemp -d); trap 'rm -rf "$stage"' EXIT

for dir in skills/*/; do
  name=$(basename "$dir")
  cp -R "$dir" "$stage/$name"
  bun -e '
const f = process.argv[1], t = await Bun.file(f).text();
const [, head, body] = t.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
const get = (k) => head.match(new RegExp(`^${k}: (.*)$`, "m"))?.[1].replace(/^"|"$/g, "");
const description = `${get("description")} ${get("when_to_use") ?? ""}`.trim();
if (description.length > 1024) throw new Error(`${f}: description is ${description.length} chars, over 1024`);
await Bun.write(f, `---\nname: ${get("name")}\ndescription: ${JSON.stringify(description)}\n---\n${body}`);
' "$stage/$name/SKILL.md"
  (cd "$stage" && zip -qr -X "$OLDPWD/dist/$name.zip" "$name" -x '*.DS_Store')
  echo "dist/$name.zip"
done
