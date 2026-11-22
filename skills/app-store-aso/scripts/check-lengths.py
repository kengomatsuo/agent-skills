#!/usr/bin/env python3
"""Check proposal.json fields against App Store Connect length limits.

Usage: check-lengths.py docs/aso/proposal.json
proposal.json is {"<locale>": {"name", "subtitle", "keywords", "promo", ...}} or a
list of those objects, each with a "locale" key. Limits follow section 1; when the
fetched rules in docs/aso/sources.md say otherwise, change LIMITS to match.
Also flags keyword words already in the name or subtitle (they waste bytes).
Exit 1 when any field fails, so the loop is: run, rewrite, run again.
"""
import json
import re
import sys

LIMITS = {"name": 30, "subtitle": 30, "promo": 170}  # characters
KEYWORD_BYTES = 100  # UTF-8 bytes of the comma-joined field


def locales(data):
    if isinstance(data, dict):
        return list(data.items())
    return [(entry.get("locale", f"#{i}"), entry) for i, entry in enumerate(data)]


def keyword_field(value):
    words = value if isinstance(value, list) else value.split(",")
    return ",".join(w.strip() for w in words if w.strip())


def main(path):
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    failures = 0
    for locale, entry in locales(data):
        for field, limit in LIMITS.items():
            text = entry.get(field) or ""
            if len(text) > limit:
                failures += 1
                print(f"{locale} {field}: {len(text)} chars, limit {limit}: {text}")
        if entry.get("keywords"):
            field = keyword_field(entry["keywords"])
            size = len(field.encode("utf-8"))
            if size > KEYWORD_BYTES:
                failures += 1
                print(f"{locale} keywords: {size} bytes, limit {KEYWORD_BYTES}: {field}")
            shown = set(re.findall(r"\w+", f"{entry.get('name', '')} {entry.get('subtitle', '')}".lower()))
            repeated = sorted({w for w in re.findall(r"\w+", field.lower()) if w in shown})
            if repeated:
                failures += 1
                print(f"{locale} keywords repeat name/subtitle words: {', '.join(repeated)}")
    print(f"{failures} problem(s)" if failures else "all fields within limits")
    return 1 if failures else 0


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    sys.exit(main(sys.argv[1]))
