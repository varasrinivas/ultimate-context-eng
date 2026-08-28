# U13 Lab: Understand It — Sort the Claims Into the Three Quantities

## Objective
Take six real published claims (from the canon and the parent courses) and classify each into its quantity — mechanical floor, others' sessions, or your-stack-live — then find the one pair in your own grid that a naive reader would compare directly, and explain why that comparison is invalid. Paper analysis; no API calls.

## Prerequisites
- Completed U13 module content
- `docs/canon.md` and `bench/results/replay-fullgrid.json` open

## Setup (2 min)
Draw three columns: FLOOR (arithmetic, no model) · THEIRS (real sessions, not your stack) · YOURS (your bench, your grading).

## Exercise (25 min)

### Step 1: Classify the six claims
Sort these into your columns, one sentence of justification each:
1. "71.5x token reduction" (a vendor's benchmark on a 52-file corpus)
2. "6.8–49x, depending on task mix" (independent replications of claim 1)
3. "33.7x per-question" (the knowledge-graph course's spring-framework harness — whole-file grep baseline, no model)
4. "graph-forced won structural questions at −26%" (that course's live campaign, medians of 3)
5. "okf answers Q3 at 186 vs naive 1,696 (9.1x)" (your replay grid)
6. "compaction preserves decisions while discarding redundant outputs" (Anthropic's engineering post — trick entry)
**Expected output:** 1→FLOOR-presented-as-THEIRS (the trap), 2→THEIRS, 3→FLOOR, 4→THEIRS (their stack's YOURS!), 5→YOURS (replay-labeled), 6→none: it's a technique claim, not a quantity — numbers aren't the only thing needing classification.

### Step 2: The invalid comparison hiding in your own grid
Find it: **isolated 1,805 median vs okf 186** — "isolated is 10x worse." Write the two reasons the direct comparison misleads: (a) different task fit — isolated's price buys a clean sub-window whose value appears on aggregation/long-horizon work, not per-question medians; (b) the sub-call's tokens are IN the receipt (tool layer) by design — an instrument choice another bench might hide, making cross-bench "isolated" numbers incomparable without reading the instrument's definition.

### Step 3: The canary audit
List your bench's fallback structure: which of the ten modes could silently degrade to naive-like behavior if their infrastructure broke (retrieval store, graph builder, notes store), and which would fail loudly? Mark the loudest as your canary.
**Expected shape:** okf (concept store gone → visible failure) is the natural canary; jit/graph/notes have partial fallbacks worth listing.

### Step 4: Reconciliation receipts
```bash
cd bench && python -c "
import json
rows = json.load(open('results/replay-fullgrid.json'))
d = [r for r in rows if r.get('backend_verdict') and r['backend_verdict'] != r['verdict']]
print(len(rows), 'cells;', len(d), 'instrument disagreements')"
```
**Expected output:** `100 cells; 0 instrument disagreements` — write down what you would do FIRST on the day that prints 1.

## Reflection Questions
1. Claim 4 is someone else's your-stack-live. What single change would promote it to YOUR column?
2. Your grid's source labels all read synthetic-pre-recording. Which of your Step-1 classifications would change after you record live, and which wouldn't?
3. How does this connect to the two-scale pharmacy — and which claim above is a scale that never gets checked against a reference weight?

## Key Insight
Numbers don't lie, but they travel badly: every context-engineering figure is true only inside its quantity class, its instrument, and its bench — and expertise is refusing to compare across any of the three unlabeled.
