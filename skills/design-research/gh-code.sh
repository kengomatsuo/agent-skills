#!/usr/bin/env bash
# Save one file from a GitHub repo at its current default-branch commit, with the permalink on line 1.
# usage: gh-code.sh <owner/repo> <path in repo> <out file>
# Many pairs: gh-code.sh -f <list>, one "owner/repo path out" per line.
set -euo pipefail
one() {
  local repo=$1 path=$2 out=$3 sha
  sha=$(gh api "repos/$repo/commits?per_page=1" --jq '.[0].sha')
  if gh api "repos/$repo/contents/$path?ref=$sha" --jq .content | base64 -d > "$out.tmp" 2>/dev/null && [ -s "$out.tmp" ]; then
    { echo "// https://github.com/$repo/blob/$sha/$path"; cat "$out.tmp"; } > "$out"; rm -f "$out.tmp"
    echo "OK $out ($(wc -l < "$out") lines)"
  else
    rm -f "$out.tmp"; echo "FAIL $repo $path" >&2
  fi
}
if [ "${1:-}" = "-f" ]; then
  while read -r r p o; do [ -n "${r:-}" ] && one "$r" "$p" "$o" || true; done < "$2"
else
  one "$@"
fi
