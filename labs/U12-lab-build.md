# U12 Lab: Build It with AI — Derive the Routing Table From Evidence

## Objective
Build the route-derivation script from the graded grid, prove it excludes a FAILED arm, then fix the failure, re-grade, re-derive, and watch the arm earn its way back in — the full lifecycle of an evidence-based router.

## Prerequisites
- Completed the U12 Understand It lab
- `bench/results/replay-fullgrid.json` present; Python 3.10+; work in `u12-lab/`

## The Build (45 min)

### Step 1: The derivation script (15 min)
**Claude prompt to use:**
```
Write u12-lab/derive_routes.py. It loads bench/results/replay-fullgrid.json
(rows with qid, class, mode, tokens_in, verdict). For each question class:
1. ELIGIBILITY: exclude any mode with a FAIL verdict on ANY question of that
   class (route-only-among-correct).
2. Among eligible modes, pick the one with the lowest mean tokens_in for the
   class.
Print a table: class | chosen mode | mean tokens | excluded modes with reasons
(e.g. "compressed: FAILED Q9"). Then print the projected routed session total
(sum over questions of the chosen mode's cell) vs the naive session total,
as "routed ~X tok vs naive ~Y tok (Zx) at 100% correctness".
Standard library only. Return only the code.
```
Run it. **Expected output (key lines):**
```
aggregation  -> notes|isolated  ...   excluded: compressed (FAILED Q9), naive? no - naive passed Q9
abstention   -> okf   ~157 tok        excluded: naive (FAILED Q7)
routed ~... tok vs naive ~16,9xx tok (~7x) at 100% correctness
```
The two exclusions MUST appear with their reasons — a derivation that doesn't print WHY an arm is out will get argued with by every stakeholder who sees the cheaper number.

### Step 2: Prove the exclusion is load-bearing (10 min)
**Claude prompt to use:**
```
Add --reckless to derive_routes.py: skip the eligibility filter (pick cheapest
regardless of verdict). Print the same table plus a line
"WOULD SERVE N WRONG ANSWERS" counting FAIL cells the reckless table selects.
```
**Expected output:** reckless saves a few hundred tokens over honest — and `WOULD SERVE 2 WRONG ANSWERS` (Q7 via naive is not selected since naive isn't cheapest anywhere; verify what your data actually shows and write down which FAILs it serves — for the shipped grid, compressed's Q9 at minimum).

### Step 3: The redemption cycle (15 min)
Fix the failure, then re-derive:
```bash
cp bench/fixtures/Q9-compressed.json u12-lab/Q9-compressed.backup.json
```
**Claude prompt to use:**
```
Write u12-lab/fix_fixture.py: rewrite bench/fixtures/Q9-compressed.json's
answer to a CORRECT Q9 answer (member M-2001, 2 requests: PA-1001 APPROVED and
PA-1004 MANUAL_REVIEW), keep usage unchanged, set source to
"synthetic-teaching-failure-FIXED". Also restore-mode via --restore copying
back from u12-lab/Q9-compressed.backup.json.
```
Re-run the campaign for that cell and re-derive:
```bash
cd bench && python run_campaign.py --modes compressed --questions Q9 --replay --out ../u12-lab/regrade.json
python ../u12-lab/derive_routes.py   # point it at a merged grid, or rerun the full campaign
```
**Expected output:** Q9/compressed now PASS → aggregation's excluded list no longer names compressed → the router adopts it (~208 tok) and the projected routed total drops. Then `python u12-lab/fix_fixture.py --restore` — the course's teaching failure goes back (verify with one more campaign run: FAIL again).

### Step 4: Leave no trace (2 min)
`git status` must show `bench/` clean (fixture restored). The routing table you keep is `u12-lab/routes.txt` from Step 1.

## Deliverable
`u12-lab/` with `derive_routes.py` (+ --reckless), `fix_fixture.py` (+ --restore), the backup, and `routes.txt`.

## Stretch Goals
- Add per-class Bonferroni-adjusted caveats to the printout when reps > 1 exist (live grids).
- Emit the table as JSON in the exact shape the backend's routed mode consumes, and diff it against the shipped routing.

## Connection to Next Module
You derived a router from one grid measured by one instrument. U13 asks the professional's question: how do you know the grid itself is true — and what does it take to compare YOUR numbers with anyone else's?
