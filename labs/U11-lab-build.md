# U11 Lab: Build It with AI — The Seed-Change Drill

## Objective
Run the freshness drill end-to-end: tamper a criterion weight in a COPY of the seed, watch the contract gate refuse with the exact blast radius, extend the gate to also flag stale fixtures, and restore — proving detection-within-a-day takes under a minute.

## Prerequisites
- Completed the U11 Understand It lab (you have the derivation inventory)
- Python 3.10+; work in `u11-lab/` — the drill NEVER touches the real seed in place

## The Build (40 min)

### Step 1: Stage the drill safely (5 min)
```bash
mkdir -p u11-lab && cp bench/seed/dataset.json u11-lab/dataset-drill.json
```

### Step 2: The tamper + gate harness (15 min)
**Claude prompt to use:**
```
Write drill.py in u11-lab/. It must:
1. Load u11-lab/dataset-drill.json, change criterion C-72148-2's weight from 35
   to 30, and save it back (announce the edit).
2. Run the contract gate against the drilled copy: import generate_keys logic
   by reading the file bench/keys/generate_keys.py is NOT importable directly,
   so instead reimplement its check inline: recompute every auth_request's
   score+decision from the drilled dataset's own policy/criteria (eligibility
   first, then summed weights, both thresholds inclusive) and compare with each
   request's "expected" block. Print every mismatch as
   "  <id>: computed (<score>,<decision>) != expected (...)" under the header
   "CONTRACT BROKEN:".
3. Exit 1 if any mismatch, 0 otherwise. Standard library only. Return only code.
```
Run: `python u11-lab/drill.py`
**Expected output:**
```
drill: C-72148-2 weight 35 -> 30
CONTRACT BROKEN:
  PA-1001: computed (95,APPROVED) != expected (100,APPROVED)
  PA-1002: computed (60,MANUAL_REVIEW) != expected (65,MANUAL_REVIEW)
  PA-1009: computed (0,DENIED) != expected (0,DENIED)  <- should NOT appear
exit 1
```
PA-1009 must NOT be listed (eligibility short-circuits before the tampered weight matters) — if your drill flags it, your reimplementation checks scoring before eligibility, which is itself a contract violation. PA-1003 must also be absent (didn't meet C-2). The gate names exactly the blast radius, nothing more.

### Step 3: Extend the gate to fixtures (15 min)
**Claude prompt to use:**
```
Add --check-fixtures to drill.py: after the contract check, stat every
bench/fixtures/*.json and flag any whose mtime is OLDER than the seed file
passed in (they were synthesized from a previous truth). Print
"STALE FIXTURE: <name> (<age vs seed>)" per hit and include them in the
exit-1 condition. Note in a comment why mtime is a heuristic, not proof
(a regenerated-but-identical fixture is fine; content-hash comparison is
the stretch goal).
```
Run against the REAL seed path (read-only) to see the heuristic in action, then against the drilled copy.

### Step 4: Restore and verify green (5 min)
```bash
rm -rf u11-lab/dataset-drill.json && cp bench/seed/dataset.json u11-lab/dataset-drill.json
python u11-lab/drill.py --no-tamper   # add a flag run: gate must print
# "contract consistent (10 determinations verified)" and exit 0
```
Total drill time, tamper to restore: under a minute. THAT is what "detect staleness within 24 hours" looks like in practice — it's not a big system, it's a small gate you actually run.

## Deliverable
`u11-lab/drill.py` (tamper + contract gate + fixture-age check + --no-tamper) and one paragraph in `u11-lab/NOTES.md`: which artifact from your Understand-lab inventory still has NO gate, and the check you'd build next.

## Stretch Goals
- Content-hash the fixtures against a manifest written at synthesis time — mtime lies; hashes don't.
- Gate the hand-mirrored UI files: assert `standingQuestions.ts` contains every question id and text from the seed.

## Connection to Next Module
Your truth now has gates at both altitudes. U12 spends that trust: with every arm graded against fresh keys, you can finally route each question class to its cheapest CORRECT arm — and prove the routing table from your own grid.
