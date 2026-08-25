"""generate_keys — validate the seed contract and export answer keys.

Checks that every expected determination in dataset.json is consistent with
the scoring rule (the same golden check the backend runs), then writes
keys.json for consumers that want keys without the full dataset.
"""
from __future__ import annotations

import json
from pathlib import Path

SEED = Path(__file__).parent.parent / "seed" / "dataset.json"
OUT = Path(__file__).parent / "keys.json"


def main() -> int:
    d = json.loads(SEED.read_text(encoding="utf-8"))
    pol = d["policy"]
    procs = {p["code"]: p for p in d["procedures"]}
    members = {m["id"]: m for m in d["members"]}
    errors = []

    for r in d["auth_requests"]:
        member = members[r["member"]]
        proc = procs[r["procedure"]]
        eligible = member["plan_status"] == "ACTIVE" and (
            proc["tier"] == "diagnostics" or member["plan_tier"] == "PREMIUM")
        if not eligible:
            score, decision = 0, "DENIED"
        else:
            weights = {c["id"]: c["weight"] for c in proc["criteria"]}
            score = sum(weights[c] for c in r["criteria_met"])
            if score >= pol["auto_approve_threshold"]:
                decision = "APPROVED"
            elif score >= pol["manual_review_threshold"]:
                decision = "MANUAL_REVIEW"
            else:
                decision = "DENIED"
        exp = r["expected"]
        if (score, decision) != (exp["score"], exp["decision"]):
            errors.append(f"{r['id']}: computed ({score},{decision}) != expected ({exp['score']},{exp['decision']})")

    if errors:
        print("CONTRACT BROKEN:")
        for e in errors:
            print(" ", e)
        return 1

    OUT.write_text(json.dumps({q["id"]: q for q in d["standing_questions"]}, indent=2),
                   encoding="utf-8")
    print(f"contract consistent ({len(d['auth_requests'])} determinations verified); "
          f"{len(d['standing_questions'])} keys -> {OUT.name}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
