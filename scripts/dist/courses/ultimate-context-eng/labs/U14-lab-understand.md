# U14 Lab: Understand It — Dry-Run the Protocol, Draft the Seams

## Objective
Execute the capstone protocol's first two gates for real, trace the remaining four through the shipped artifacts, and draft your seams section — the two places your run's stages meet that could fail without an error.

## Prerequisites
- Completed U14 module content (and U00–U13 labs — this lab audits their artifacts)
- Repo checked out; Python 3.10+; app NOT required running for steps 1–2

## Setup (2 min)
Open `docs/curriculum-map.md` (the protocol lives in U14's module page) and a blank `u14-lab/DRYRUN.md`.

## Exercise (30 min)

### Step 1: Gate 1 — the contract, for real
```bash
cd bench/keys && python generate_keys.py
```
**Expected output:** `contract consistent (10 determinations verified); 10 keys -> keys.json`
In DRYRUN.md, record the command, output, and timestamp — scorecard Line 4 (freshness) is built from entries like this one.

### Step 2: Gate 2 — the grader must be able to fail
```bash
cd .. && python verify_selftest.py
```
**Expected output:** six `[PASS]` lines ending `SELFTEST PASSED — the grader catches wrong answers and fabrications`. Note WHICH two planted failures prove the two failure classes (the wrong-threshold answer; the fabricated DOB).

### Step 3: Trace gates 3–6 through the shipped artifacts
Without booting anything, locate and record the evidence each remaining step would produce: backend test names for gate 3 (read `app/api` test classes: golden determinations, per-mode reconciliation, abstention, fidelity), the 100-cell grid for gate 4 (`results/replay-fullgrid.json` — count rows, count FAILs, name them), the zero-disagreement check for gate 5 (the `backend_verdict` fields), the derivable table for gate 6 (which classes exclude which arms).
**Expected output in DRYRUN.md:** four entries, each with a file path and the number you'd defend.

### Step 4: Draft the seams section
Write TWO seam risks for your own future full run, each with its mechanical guard. Use the course's own history as your pattern book: the response-shape seam (harness expected flat JSON, backend wrapped in `primary` — 100 cells of impossible zeros), the instrument seam (a benchmark arm running against silently-broken infrastructure for two campaigns), the derivation seam (hand-mirrored UI data one edit behind the seed).
**Expected shape:** e.g. "Seam: campaign runner ↔ backend contract; guard: reconcile.py's exit-1 on any zero-token PASS" — a seam names TWO stages and the guard names a CHECK, not a hope.

## Reflection Questions
1. Gate 2 ran in seconds. What, concretely, would you lose by skipping it on a clone where "nothing changed"?
2. Your grid has exactly two FAILs, both disclosed teaching fixtures. On YOUR live run, what distinguishes an expected FAIL from a finding?
3. How does this connect to opening night — and which gate is the walk-in check the kitchen does before service, not during?

## Key Insight
The capstone's difficulty isn't any single step — it's refusing to let confidence substitute for a gate, six times in a row, on a day when everything would probably have been fine.
