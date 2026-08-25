"""check_labs — verify every lab file's references resolve.

Checks, per labs/*.md:
  1. referenced repo paths (bench/..., app/..., scripts/..., ../labs/...) exist
  2. referenced modes are real ContextAssembler modes
  3. referenced standing-question ids exist in the seed
  4. the kit template headings are present (Objective + either Exercise or The Build)
Exit 1 on any failure — run before committing course content.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).parent.parent
MODES = {"naive", "budgeted", "compressed", "cached", "jit", "graph", "okf",
         "notes", "isolated", "routed"}
SEED = json.loads((ROOT / "bench" / "seed" / "dataset.json").read_text(encoding="utf-8"))
QIDS = {q["id"] for q in SEED["standing_questions"]}

failures = []
labs = sorted((ROOT / "labs").glob("U*.md"))
for lab in labs:
    t = lab.read_text(encoding="utf-8")
    # 1. path references
    for ref in re.findall(r"(?:\.\./)?(?:bench|app|scripts|labs|docs|course)/[A-Za-z0-9_\-./]+", t):
        ref_clean = ref.lstrip("./")
        p = ROOT / ref_clean
        # allow deliverable folders the learner creates (uXX-lab/) and glob-ish refs
        if any(seg in ref for seg in ("{", "*", "<", "uXX")) or re.search(r"u\d\d-lab", ref):
            continue
        if not p.exists() and not (ROOT / "labs" / ref_clean).exists():
            failures.append(f"{lab.name}: missing path {ref}")
    # 2. mode names in --arms / "mode" contexts
    for m in re.findall(r'"mode"\s*:\s*"(\w+)"', t) + re.findall(r"--arms[= ]([\w,]+)", t):
        for mode in re.split(r"[,\s]+", m):
            if mode and mode not in MODES:
                failures.append(f"{lab.name}: unknown mode {mode!r}")
    # 3. standing question ids
    for q in set(re.findall(r"\bQ(\d{1,2})\b", t)):
        if f"Q{q}" not in QIDS and f'"id": "Q{q}"' not in t:
            # a lab may define NEW questions in its own extended dataset copy
            failures.append(f"{lab.name}: unknown question Q{q}")
    # 4. template headings
    if "## Objective" not in t:
        failures.append(f"{lab.name}: missing '## Objective'")
    if "understand" in lab.name and "## Exercise" not in t:
        failures.append(f"{lab.name}: understand lab missing '## Exercise'")
    if "build" in lab.name and "## The Build" not in t:
        failures.append(f"{lab.name}: build lab missing '## The Build'")

print(f"{len(labs)} lab files checked")
if failures:
    print("FAILURES:")
    for f in failures:
        print(" ", f)
    sys.exit(1)
print("ALL LAB REFERENCES RESOLVE")
