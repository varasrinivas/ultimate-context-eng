# U02 Lab: Understand It — Prove the Grader, Then Generate the Grid

## Objective
Verify the correctness harness can catch lying answers, then generate the course's 10×10 graded baseline grid yourself and read it the way the course will for the next twelve modules: cheapest-correct, per question class.

## Prerequisites
- Completed U02 module content; backend running in replay mode
- Python 3.10+

## Setup (3 min)
```bash
cd bench
python keys/generate_keys.py
```
**Expected output:** `contract consistent (10 determinations verified); 10 keys -> keys.json` — the answer keys derive from the same seed the app loads, and the scoring rule cross-checks before anything is graded.

## Exercise (25 min)

### Step 1: Try to fool the grader
```bash
python verify_selftest.py
```
**Expected output:** six lines, all `[PASS]` — including the planted wrong threshold (`FAIL ... missing=['80','50'] forbidden=['70']`) and the planted fabricated DOB (`forbidden=['19[0-9]{2}-...']`), ending `SELFTEST PASSED — the grader catches wrong answers and fabrications`.
**What to observe:** a grader is only trustworthy if you've watched it fail things. This is the same lesson as U00's `--tamper` flag, one level up.

### Step 2: Generate the grid
```bash
python run_campaign.py --modes naive,budgeted,compressed,cached,jit,graph,okf,notes,isolated,routed --replay --out results/my-grid.json
```
**Expected output:** 100 per-cell lines, then the summary — naive `90%` correct (Q7: `FAIL (SAVINGS VOID)`), compressed `90%` (Q9), all other modes `100%`, medians from okf 186 up to isolated 1,805.

### Step 3: Read per class, not per average
From the per-cell lines, fill in the cheapest CORRECT mode for each class:
```
structural (Q1,Q2):  ____   canonical (Q3,Q4): ____
logic (Q5,Q6):       ____   abstention (Q7,Q8): ____
aggregation (Q9,Q10): ____
```
(Expect: notes/jit trade the structural crown, okf owns canonical and abstention, notes owns aggregation — and note how `routed` inherits whichever it delegates to.)

### Step 4: Catch the mismatch that isn't there
The runner cross-checks its own verdicts against the verdict inside every receipt and prints a warning on any disagreement. Confirm your run printed **no** mismatch warning — then write down what it would mean if it had (one instrument is lying; the canary rule says find which before trusting either).

## Reflection Questions
1. Why is `okf 186 at 100%` a stronger claim than `compressed 231 at 90%` even though both numbers are small?
2. Your grid is deterministic (replay). Which of its properties survive a live rerun, and which numbers must be re-earned as medians of 3?
3. How does this connect to the clinical-trial analogy — what part is the control group, and what part is the predefined success criterion?

## Key Insight
A baseline you generated, graded, and tried to fool is the only baseline that can settle future arguments.
