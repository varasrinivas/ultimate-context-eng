"""verify — grade an answer against a standing question's answer key.

Contract (bench/seed/dataset.json): key_facts are case-insensitive substrings
that must ALL appear; forbidden are REGEXES none of which may match.
Savings only count when the answer is right: a FAIL voids the token number.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

SEED = Path(__file__).parent / "seed" / "dataset.json"


def load_keys(seed_path: Path | None = None) -> dict[str, dict]:
    data = json.loads((seed_path or SEED).read_text(encoding="utf-8"))
    return {q["id"]: q for q in data["standing_questions"]}


def grade(question_id: str, answer: str, keys: dict[str, dict] | None = None) -> dict:
    """Return {graded, verdict, missing_facts, forbidden_hits}."""
    keys = keys or load_keys()
    key = keys.get(question_id)
    if key is None:
        return {"graded": False, "verdict": "UNGRADED", "missing_facts": [], "forbidden_hits": []}
    low = answer.lower()
    missing = [f for f in key["key_facts"] if f.lower() not in low]
    hits = [rx for rx in key.get("forbidden", []) if re.search(rx, answer, re.IGNORECASE)]
    verdict = "PASS" if not missing and not hits else "FAIL"
    return {"graded": True, "verdict": verdict, "missing_facts": missing, "forbidden_hits": hits}


def grade_table(rows: list[dict]) -> dict:
    """rows: [{qid, mode, answer, tokens, ...}] -> summary with per-mode correctness %."""
    keys = load_keys()
    out = []
    for r in rows:
        g = grade(r["qid"], r.get("answer", ""), keys)
        out.append({**r, **{"verdict": g["verdict"], "missing_facts": g["missing_facts"],
                            "forbidden_hits": g["forbidden_hits"]}})
    modes = sorted({r["mode"] for r in out})
    summary = {}
    for m in modes:
        rs = [r for r in out if r["mode"] == m and r["verdict"] != "UNGRADED"]
        passed = [r for r in rs if r["verdict"] == "PASS"]
        summary[m] = {"graded": len(rs), "passed": len(passed),
                      "correctness_pct": round(100 * len(passed) / len(rs), 1) if rs else None,
                      "tokens_correct_only": sum(r.get("tokens", 0) for r in passed)}
    return {"rows": out, "by_mode": summary}


if __name__ == "__main__":
    import sys
    if len(sys.argv) == 3:
        print(json.dumps(grade(sys.argv[1], sys.argv[2]), indent=2))
    else:
        print(__doc__)
