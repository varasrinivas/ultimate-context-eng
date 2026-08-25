# U13 Lab: Build It with AI — The Two-Instrument Reconciler

## Objective
Build reconcile.py: audit all 100 replay cells for layer-sum integrity AND instrument agreement (harness grade vs backend grade), then tamper one fixture and prove the reconciler catches the instruments disagreeing.

## Prerequisites
- Completed the U13 Understand It lab; U00's audit_receipts.py concepts fresh
- App running in replay mode; Python 3.10+; work in `u13-lab/`

## The Build (40 min)

### Step 1: The reconciler (15 min)
**Claude prompt to use:**
```
Write u13-lab/reconcile.py. For every standing question (load ids and text from
bench/seed/dataset.json) x every mode in [naive,budgeted,compressed,cached,jit,
graph,okf,notes,isolated,routed]:
1. POST http://localhost:8080/api/copilot/ask {"question": text, "mode": mode,
   "sessionId": "reconcile"} and unwrap the "primary" object.
2. CHECK A (integrity): sum(receipt.layers.values()) == receipt.inputTokens.
3. CHECK B (agreement): receipt.correctness.verdict must equal the verdict from
   bench/verify.py's grade(qid, answer) run locally.
Print one line per cell only when a check fails; end with
"N cells | A-failures: x | B-failures: y" and exit 1 if x+y > 0.
Standard library + importing bench/verify.py (adjust sys.path). Return only code.
```
Run: `python u13-lab/reconcile.py`
**Expected output:** `100 cells | A-failures: 0 | B-failures: 0`

### Step 2: Tamper the second instrument (15 min)
Make the backend's grader and yours disagree — without touching the backend:
```bash
cp bench/fixtures/Q3-okf.json u13-lab/Q3-okf.backup.json
```
**Claude prompt to use:**
```
Write u13-lab/tamper.py: edit bench/fixtures/Q3-okf.json's answer to replace
"80" with "eighty" (spelled out), keeping everything else. Add --restore
copying back from u13-lab/Q3-okf.backup.json.
```
Now think before running reconcile: the backend graded the ORIGINAL answer when the fixture was synthesized? No — the backend grades at ask time from the fixture's answer, and so do you, so both instruments should now agree the cell FAILs (missing key fact "80"). Where's the disagreement? Run and observe:
**Expected output:** `B-failures: 0` but the cell now FAILs on both instruments — agreement about a failure is still agreement. Write this down: **reconciliation checks instrument consistency, not correctness** — a cell can be red on both scales and the scales still healthy.

### Step 3: Manufacture a REAL disagreement (8 min)
**Claude prompt to use:**
```
Add --skew to u13-lab/reconcile.py: before comparing in CHECK B, lowercase the
answer AND strip all digits from it for YOUR local grade() call only (simulating
a harness whose text normalization diverged from the backend's).
```
Run `python u13-lab/reconcile.py --skew` (with the fixture restored).
**Expected output:** a burst of B-failures on every cell whose key facts contain digits ("80", "25", "65"...) — `B-failures: ~30+, exit 1`. THIS is what instrument drift looks like: not one dramatic error, but a systematic skew that makes one scale read differently. Restore everything: `python u13-lab/tamper.py --restore`.

### Step 4: The day-one runbook (2 min)
In `u13-lab/NOTES.md`, write the three-line runbook for a real disagreement: (1) freeze both results, trust neither; (2) bisect which instrument changed (git log on verify.py vs backend grader); (3) re-run the full grid only after the cause is named — never after "it went green again."

## Deliverable
`u13-lab/` with `reconcile.py` (+ --skew), `tamper.py` (+ --restore), the backup, and NOTES.md.

## Stretch Goals
- Add CHECK C: recompute costUsd from tokens and the pricing table; flag drift > $0.0001.
- Run reconcile in CI order: contract gate → selftest → reconcile → campaign, and time the whole chain.

## Connection to Next Module
You now hold every instrument this course owns, and proof they agree. U14 is the exam: run the entire protocol on a fresh clone and produce the scorecard — five lines, each of which survives "how do you know?"
