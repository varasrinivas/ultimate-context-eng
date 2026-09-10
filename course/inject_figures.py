# -*- coding: utf-8 -*-
"""Inject docs/figures.json into the player as `workedExample` on each module.

Follows inject_staged.py's contract rather than re-serialising the file: find
each module in `const MODS = [ ... \\n];` and splice one key in, so the diff stays
small and the file's own formatting survives. Idempotent — an existing block is
stripped first, so a re-run replaces rather than appends.

The `\\n];` search is newline-anchored for the same reason inject_staged.py's is:
module strings may legally contain `];` inside a citation.

Run from the repo root:
    python course/inject_figures.py
    python course/inject_figures.py --check
"""
from __future__ import annotations

import io
import json
import re
import sys
from pathlib import Path

HTML = Path("course/index.html")
FIGURES = Path("docs/figures.json")

# Inserted before this key, which every module carries.
ANCHOR = '"sections":'


def esc(value: str) -> str:
    # MODS lives inside a <script>, so a literal </script> would close it early.
    return json.dumps(value, ensure_ascii=False).replace("</script>", r"<\/script>")


def block(indent: str, fig: dict) -> str:
    pad = indent + "  "
    return (
        f'{indent}"workedExample": {{\n'
        f'{pad}"title": {esc(fig["title"])},\n'
        f'{pad}"body": {esc(fig["body"])},\n'
        f'{pad}"caption": {esc(fig["caption"])}\n'
        f'{indent}}},\n'
    )


def main() -> int:
    check = "--check" in sys.argv
    figures = {k: v for k, v in json.loads(FIGURES.read_text(encoding="utf-8")).items()
               if not k.startswith("_")}

    with io.open(HTML, encoding="utf-8", newline="") as f:
        raw = f.read()
    nl = "\r\n" if "\r\n" in raw else "\n"
    src = raw.replace("\r\n", "\n")

    start = src.index("const MODS = [")
    end = src.index("\n];", start)
    head, mods, tail = src[:start], src[start:end], src[end:]

    had = len(re.findall(r'^\s*"workedExample": \{$', mods, re.M))
    mods = re.sub(
        r'^[ \t]*"workedExample": \{\n'
        r'[ \t]*"title": .*\n'
        r'[ \t]*"body": .*\n'
        r'[ \t]*"caption": .*\n'
        r'[ \t]*\},\n',
        "", mods, flags=re.M)

    injected = 0
    for mid in sorted(figures):
        m = re.search(r'"id": "%s"' % re.escape(mid), mods)
        if not m:
            print(f"  ! {mid}: not found in MODS")
            continue
        anchor = re.search(r'^([ \t]*)%s' % re.escape(ANCHOR), mods[m.end():], re.M)
        if not anchor:
            print(f"  ! {mid}: no {ANCHOR} key to anchor on")
            continue
        # the anchor must belong to this module, not the next one
        nxt = re.search(r'"id": "U\d\d"', mods[m.end():])
        if nxt and nxt.start() < anchor.start():
            print(f"  ! {mid}: anchor crosses into the next module")
            continue
        at = m.end() + anchor.start()
        mods = mods[:at] + block(anchor.group(1), figures[mid]) + mods[at:]
        injected += 1

    print(f"{had} module(s) already carried a figure; injecting {injected}")
    if injected != len(figures):
        print(f"ERROR: expected {len(figures)}, injected {injected}")
        return 1

    src = head + mods + tail
    if check:
        print("--check: nothing written")
        return 0
    HTML.write_text(src.replace("\n", nl), encoding="utf-8", newline="")
    print(f"wrote {HTML} — {injected} figures")
    return 0


if __name__ == "__main__":
    sys.exit(main())
