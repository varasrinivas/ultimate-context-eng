# U14 Lab: Build It with AI — scorecard.py, the Exam That Grades Itself

## Objective
Build the capstone runner: execute the full six-gate protocol on your clone, emit the five-line Mastery Scorecard plus the six-competency rubric with evidence pointers — and prove the scorecard refuses to render when a gate is broken.

## Prerequisites
- Completed the U14 Understand It lab (DRYRUN.md in hand)
- App bootable in replay mode; all prior lab artifacts available; work in `u14-lab/`

## The Build (60 min)

### Step 1: The protocol runner (20 min)
**Claude prompt to use:**
```
Write u14-lab/scorecard.py. It runs the six-gate protocol in order, stopping
with exit 1 and "GATE N FAILED - scorecard not rendered" on any failure:
G1 contract: run [sys.executable, "bench/keys/generate_keys.py"] via subprocess
   from the repo root; require exit 0 and capture the "contract consistent" line.
G2 grader: run bench/verify_selftest.py; require "SELFTEST PASSED" in stdout.
G3 app: run ["./mvnw","-q","test"] with cwd app/api; on Windows use
   ["cmd","/c", str(ROOT/"app/api/mvnw.cmd"), "-q","test"] with an ABSOLUTE
   path and NO shell=True (a bare "mvnw.cmd" fails under Git Bash because
   NoDefaultCurrentDirectoryInExePath blocks cwd resolution, and shell=True
   with an args list mangles arguments); require exit 0. THEN require http://localhost:8080/api/policy to
   answer 200 (the operator boots the app; the gate only verifies it's up).
G4 campaign: run bench/run_campaign.py --modes <all ten> --replay
   --out u14-lab/grid.json; require exit 0.
G5 reconcile: load u14-lab/grid.json; require zero cells where backend_verdict
   differs from verdict, and zero cells with tokens_in in (None, 0) and PASS.
G6 route: derive the routing table from u14-lab/grid.json with the
   route-only-among-correct rule (inline, ~15 lines).
Then print the scorecard: line 1 routed-vs-naive medians with (source) label
read from the grid rows; line 2 per-arm correctness % with FAIL cells named;
line 3 Q7/Q8 verdicts + note whether any fidelity-class FAIL exists; line 4 the
G1 output line + run timestamp; line 5 the provenance sentence ("all cells
source=<label>; quantity: your-bench replay"). Finally the rubric: six lines,
each "COMPETENCY N: <claim> -> evidence: <file or gate output>".
Standard library only. Return only the code.
```

### Step 2: The green run (10 min)
Boot the app, then: `python u14-lab/scorecard.py`
**Expected output (abridged):**
```
G1 OK  contract consistent (10 determinations verified)
G2 OK  SELFTEST PASSED
G3 OK  15 tests, app answering
G4 OK  100 cells -> u14-lab/grid.json
G5 OK  0 disagreements, 0 impossible cells
G6 OK  routes: canonical->okf, abstention->okf, logic->compressed, aggregation->notes|isolated
================ MASTERY SCORECARD ================
1 TOKENS      routed 239 vs naive 1,696 median (7.1x) [synthetic-pre-recording]
2 CORRECTNESS routed 100% | naive 90% (Q7 FAIL, void) | compressed 90% (Q9 FAIL, void) | others 100%
3 TRUTH       Q7 PASS (refusal) · Q8 PASS · fidelity FAILs: 1 disclosed (Q9-compressed)
4 FRESHNESS   contract verified @ <timestamp>
5 PROVENANCE  100 cells, source=synthetic-pre-recording; quantity: your-bench replay
COMPETENCY 1..6 -> evidence pointers
```

### Step 3: Break a gate, watch it refuse (15 min)
Three sabotages, one at a time, restoring after each:
1. **G1:** tamper a weight in a COPY and point scorecard.py at it via an env var you add (`SEED_PATH`) → `GATE 1 FAILED`.
2. **G2:** temporarily rename `verify_selftest.py` → `GATE 2 FAILED` (the runner must not skip a missing gate).
3. **G5:** run with the app stopped after G3's check passes? No — stop the app BEFORE running: `GATE 3 FAILED` on the liveness check. 
**Expected output each time:** the named gate, exit 1, and NO scorecard text after the failure line. A capstone that renders a scorecard past a broken gate has learned nothing from fourteen modules.

### Step 4: Write the seams section into the output (10 min)
**Claude prompt to use:**
```
Add a SEAMS section to scorecard.py's output, printed only on full success:
read u14-lab/SEAMS.md (the two seam risks + guards from the Understand lab)
and echo it verbatim under the rubric. If SEAMS.md is missing, treat it as
GATE 7 FAILED - a run without a seams section is not a capstone run.
```

## Deliverable
`u14-lab/` with `scorecard.py`, `grid.json`, `SEAMS.md`, and the rendered scorecard saved as `SCORECARD.txt`. That folder IS your course completion artifact.

## Stretch Goals
- Live mode: set ANTHROPIC_API_KEY + MEDFLOW_LIVE=1, re-run G4 with --reps 3, and produce a second scorecard whose line 5 reads "live-recorded; medians of 3" — then diff the two scorecards and explain every delta's quantity class.
- CI-ify: a GitHub Action that runs G1-G2-G5 on every push (G3/G4 nightly).

## Connection to Next Module
There isn't one — this is the exam. If your SCORECARD.txt renders green and you can defend each line out loud, you have the course outcome: you excel at context engineering, and you can prove it with instruments you built, gates you ran, and numbers whose provenance you can name.
