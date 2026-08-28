# U02 Lab: Build It with AI — The Class Report

## Objective
Build the per-class cheapest-correct report — the artifact every later module cites when it claims a mode "owns" a question class.

## Prerequisites
- Completed the U02 Understand It lab (you have `results/my-grid.json`)
- Python 3.10+

## The Build (30 min)

### Step 1: Scaffold the report (12 min)
**Claude prompt to use:**
```
Write class_report.py using only the standard library. It loads a campaign
results file (default bench/results/replay-fullgrid.json, overridable as
argv[1]) — a JSON list of rows with fields qid, class, mode, tokens_in,
verdict. Group by class. For each class print a table of modes sorted by
median tokens_in ASCENDING, columns: mode, median tokens, verdict summary
(e.g. "2/2 PASS" or "1/2 PASS — SAVINGS VOID on Q9"). Mark the first mode
whose verdicts are all PASS as "<- CHEAPEST CORRECT". Exclude nothing:
FAILed modes stay visible with their void annotation (the Honesty Rule —
failures are taught, not hidden). End with a one-line-per-class summary:
"aggregation: notes (167-262 tok, 100%)". Return only the code.
```

### Step 2: Run it (5 min)
```bash
python class_report.py results/my-grid.json
```
**Expected output (abridged):**
```
== canonical (Q3,Q4)
okf          186   2/2 PASS   <- CHEAPEST CORRECT
jit          215   2/2 PASS
...
== aggregation (Q9,Q10)
notes        214   2/2 PASS   <- CHEAPEST CORRECT
compressed   222   1/2 PASS — SAVINGS VOID on Q9
...
```
Cross-check three cells against your own grid run — a report you haven't spot-checked is a rumor with formatting.

### Step 3: Break it on purpose (8 min)
**Claude prompt to use:**
```
Add --strict to class_report.py: exit 1 if any class has NO all-PASS mode,
printing "NO CORRECT ARM for <class>". Also add a unit check function
selftest() run via --selftest: feed it a tiny in-memory rows list where every
mode fails one question in a class, and assert --strict semantics trigger.
```
Run `python class_report.py --selftest`. **Expected:** the planted no-correct-arm class trips the exit. This matters in U12: the router may only route among correct arms — and now you have the tool that tells it when there are none.

## Deliverable
`u02-lab/class_report.py` — the per-class cheapest-correct report with void annotations and a strict gate.

## Stretch Goals
- Add `--markdown` output and paste the canonical-class table into your notes; it should match U02's module table exactly.
- Add a `--min-correct 100` flag that filters the candidate set the way U12's router will.

## Connection to Next Module
The grid says WHAT wins per class; the next two tracks explain WHY, one strategy family at a time — starting with write (U03), the family that owns your aggregation column.
