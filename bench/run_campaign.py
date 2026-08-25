"""run_campaign — graded multi-mode campaign against the running MedFlow backend.

Every cell = one POST /api/copilot/ask; every answer graded via verify.grade.
Savings only count when correct: FAILED cells are reported with savings void.

Usage:
  python run_campaign.py --modes naive,graph,okf [--reps 3] [--replay]
                         [--questions Q1,Q3,Q7] [--base http://localhost:8080]
                         [--out results/campaign.json]
Replay mode needs no API key (backend default); --reps > 1 only makes sense
live (replay is deterministic).
"""
from __future__ import annotations

import argparse
import json
import statistics
import time
import urllib.request
from pathlib import Path

from verify import grade, load_keys

SEED = Path(__file__).parent / "seed" / "dataset.json"


def ask(base: str, question: str, mode: str, session: str) -> dict:
    payload = json.dumps({"question": question, "mode": mode, "sessionId": session}).encode()
    req = urllib.request.Request(f"{base}/api/copilot/ask", data=payload, method="POST",
                                 headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=300) as r:
        resp = json.load(r)
    # backend wraps in {primary:{answer,receipt}, compare:...}; accept flat too
    return resp.get("primary", resp)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--modes", required=True)
    ap.add_argument("--reps", type=int, default=1)
    ap.add_argument("--replay", action="store_true", help="informational; backend decides")
    ap.add_argument("--questions", default=None)
    ap.add_argument("--base", default="http://localhost:8080")
    ap.add_argument("--out", default=None)
    args = ap.parse_args()

    seed = json.loads(SEED.read_text(encoding="utf-8"))
    questions = seed["standing_questions"]
    if args.questions:
        want = {q.strip() for q in args.questions.split(",")}
        questions = [q for q in questions if q["id"] in want]
    modes = [m.strip() for m in args.modes.split(",")]
    keys = load_keys()

    rows = []
    for rep in range(args.reps):
        for q in questions:
            for mode in modes:
                session = f"bench-{q['id']}-{mode}-r{rep}"
                t0 = time.time()
                try:
                    resp = ask(args.base, q["text"], mode, session)
                except Exception as exc:  # noqa: BLE001 — a dead backend must be loud
                    print(f"ERROR {q['id']}/{mode}/r{rep}: {exc}")
                    rows.append({"qid": q["id"], "mode": mode, "rep": rep, "error": str(exc)})
                    continue
                receipt = resp.get("receipt", {})
                g = grade(q["id"], resp.get("answer", ""), keys)
                rows.append({
                    "qid": q["id"], "class": q["class"], "mode": mode, "rep": rep,
                    "tokens_in": receipt.get("inputTokens"), "tokens_out": receipt.get("outputTokens"),
                    "cache_read": receipt.get("cacheReadTokens"), "cost": receipt.get("costUsd"),
                    "layers": receipt.get("layers"), "source": receipt.get("source"),
                    "verdict": g["verdict"], "missing_facts": g["missing_facts"],
                    "forbidden_hits": g["forbidden_hits"],
                    "backend_verdict": (receipt.get("correctness") or {}).get("verdict"),
                    "elapsed_s": round(time.time() - t0, 1),
                    "answer": (resp.get("answer") or "")[:2000],
                })
                r = rows[-1]
                print(f"{q['id']:>3} {mode:<10} r{rep} {r['tokens_in'] or 0:>7,} tok  "
                      f"{r['verdict']:<4} {'(SAVINGS VOID)' if r['verdict']=='FAIL' else ''}", flush=True)

    good = [r for r in rows if "error" not in r]
    print(f"\n{'mode':<11} {'graded':>6} {'correct%':>8} {'median tok (correct only)':>26}")
    print("-" * 56)
    for mode in modes:
        rs = [r for r in good if r["mode"] == mode and r["verdict"] != "UNGRADED"]
        passed = [r for r in rs if r["verdict"] == "PASS"]
        med = statistics.median(r["tokens_in"] for r in passed) if passed else 0
        pct = 100 * len(passed) / len(rs) if rs else 0
        print(f"{mode:<11} {len(rs):>6} {pct:>7.0f}% {med:>26,.0f}")
    mism = [r for r in good if r.get("backend_verdict") and r["backend_verdict"] != r["verdict"]]
    if mism:
        print(f"\nWARNING: {len(mism)} backend/harness grading mismatches — two instruments must agree")

    out = Path(args.out) if args.out else Path(__file__).parent / "results" / f"campaign-{'-'.join(modes)}.json"
    out.parent.mkdir(exist_ok=True)
    out.write_text(json.dumps(rows, indent=2), encoding="utf-8")
    print(f"\nwrote {out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
