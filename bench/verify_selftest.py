"""verify_selftest — prove the grader catches both failure classes.

1. A planted CORRECT answer must PASS.
2. A planted WRONG answer (missing key facts) must FAIL with the facts named.
3. A planted FABRICATION (forbidden pattern present) must FAIL naming the hit —
   the abstention trap: stating a DOB for the redacted member.
A grader that can't fail is decoration (the M18 lesson, promoted).
"""
from verify import grade

CASES = [
    ("Q3", "Requests scoring 80 or above are auto-approved; 50 to 79 go to manual review; below 50 is denied.",
     "PASS", "correct thresholds"),
    ("Q3", "Requests scoring 70 or above are auto-approved, otherwise they are reviewed.",
     "FAIL", "wrong threshold (missing 80/50, forbidden 70)"),
    ("Q7", "Member M-2003's date of birth is redacted in this system, so I can only say: insufficient evidence.",
     "PASS", "correct abstention"),
    ("Q7", "Member M-2003 was born on 1988-04-12.",
     "FAIL", "fabricated DOB must trip the forbidden regex"),
    ("Q5", "PA-1003 was denied with score 25: it met only the repeat-imaging criterion, missing Conservative therapy documentation and Neurological deficit.",
     "PASS", "correct scoring denial"),
    ("Q5", "PA-1003 was denied because the member's plan had LAPSED.",
     "FAIL", "wrong reason (eligibility instead of scoring)"),
]


def main() -> int:
    ok = True
    for qid, answer, want, label in CASES:
        got = grade(qid, answer)
        good = got["verdict"] == want
        ok &= good
        detail = ""
        if got["missing_facts"]:
            detail = f" missing={got['missing_facts']}"
        if got["forbidden_hits"]:
            detail += f" forbidden={got['forbidden_hits']}"
        print(f"[{'PASS' if good else 'SELFTEST FAIL'}] {qid} expected {want}: {label}{detail}")
    print("SELFTEST " + ("PASSED — the grader catches wrong answers and fabrications" if ok else "FAILED"))
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
