"""inject_staged — merge staged module JSON + SVG cases into course/index.html.

Kit-convention marker injection (never rewrites the file wholesale):
  MODS entries  -> inserted before the closing of `const MODS = [ ... ];`
  SVG cases     -> inserted before `default: return '';` in renderVisual
Idempotent: a module id already present in MODS is skipped (use --force to replace nothing —
edit by hand instead; wholesale replacement defeats the marker discipline).

Usage: python inject_staged.py [--ids U00,U01,...]   (default: all staged, sorted)
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

HERE = Path(__file__).parent
HTML = HERE / "index.html"
STAGING = HERE / "staging"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--ids", default=None)
    args = ap.parse_args()

    html = HTML.read_text(encoding="utf-8")
    staged = sorted(STAGING.glob("U*.json"))
    if args.ids:
        want = {i.strip() for i in args.ids.split(",")}
        staged = [p for p in staged if p.stem in want]

    mods_open = html.index("const MODS = [")
    mods_close = html.index("];", mods_open)
    svg_marker = "default: return '';"
    assert svg_marker in html, "renderVisual marker missing"

    inserted = []
    for jf in staged:
        mid = jf.stem
        if f'"id": "{mid}"' in html or f"\"id\":\"{mid}\"" in html:
            print(f"{mid}: already in MODS, skipping")
            continue
        obj = json.loads(jf.read_text(encoding="utf-8"))  # validates
        assert obj.get("id") == mid, f"{jf.name}: id mismatch ({obj.get('id')})"

        svg_file = STAGING / f"{mid}.svg.js"
        svg = svg_file.read_text(encoding="utf-8").strip()
        assert svg.count(f'case "{mid}":') == 1, f"{svg_file.name}: must contain exactly one case"

        # insert module JSON before the MODS closing bracket.
        # NEWLINE-ANCHORED: a module string may legally contain "];" (e.g. a
        # citation like "[ROT-LIT, ...];"), but JSON strings cannot contain a
        # real newline, so "\n];" only ever matches the true array close.
        mods_close = html.index(chr(10) + "];", html.index("const MODS = [")) + 1
        existing = html[html.index("const MODS = [") + len("const MODS = ["):mods_close].strip()
        sep = ",\n" if existing else "\n"
        entry = json.dumps(obj, indent=2, ensure_ascii=False)
        html = html[:mods_close] + (sep if existing else "\n") + entry + "\n" + html[mods_close:]

        # insert SVG case before the default marker
        idx = html.index(svg_marker)
        html = html[:idx] + svg + "\n      " + html[idx:]
        inserted.append(mid)

    HTML.write_text(html, encoding="utf-8")
    print(f"injected: {inserted or 'nothing'}")

    # final validation: MODS array must parse as JSON.
    # Close is newline-anchored — an inner STRING can contain "];" but never a
    # real newline before it (JSON strings escape newlines as \n two-char).
    html2 = HTML.read_text(encoding="utf-8")
    start = html2.index("const MODS = [") + len("const MODS = [")
    end = html2.index(chr(10) + "];", start)
    body = html2[start:end].strip()
    parsed = json.loads("[" + body + "]") if body else []
    print(f"MODS parses: {len(parsed)} modules")
    return 0


if __name__ == "__main__":
    sys.exit(main())
