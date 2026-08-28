# U05 Lab: Build It with AI — The Selector Probe

## Objective
Build (with Claude writing the code) a probe that runs all 10 standing questions through the three structural selectors, tabulates tokens and verdicts by question class, and prints the routing table that U12 will later automate.

## Prerequisites
- Completed the U05 Understand It lab (app running in replay mode)
- Python 3.10+

## The Build (35 min)

### Step 1: Scaffold the probe (10 min)
**Claude prompt to use:**
```
Write selector_probe.py using only the Python standard library. Resolve the dataset as Path(__file__).resolve().parents[2] / "bench" / "seed" / "dataset.json" (the script lives in labs/uXX-lab/) and load it and take standing_questions (each has id, class,
text). For every question, POST to http://localhost:8080/api/copilot/ask
with {"question": text, "mode": m, "sessionId": "u05-probe"} for each mode
in ["jit", "graph", "okf"]. The response JSON has primary.receipt with
inputTokens and correctness.verdict. Collect rows (qid, class, mode,
tokens, verdict). Print a table grouped by question class showing, per
class: each mode's median tokens and pass rate, with the cheapest
ALL-PASS mode marked "<- route here". 60s timeout; on any non-200 print
the body and exit 1. Return only the code.
```

### Step 2: Run it (5 min)
```bash
python selector_probe.py
```
**Expected output (shape — replay numbers):**
```
class        jit          graph        okf
structural   215 (2/2)    444 (2/2)    364 (2/2)    <- route here: jit
canonical    215 (2/2)    947 (2/2)    186 (2/2)    <- route here: okf
logic        304 (2/2)    472 (2/2)    189 (2/2)    <- route here: okf
abstention   200 (2/2)    273 (2/2)    155 (2/2)    <- route here: okf
aggregation  268 (2/2)    393 (2/2)    187 (2/2)    <- route here: okf
```
Your exact medians may differ slightly by rounding; verdicts must all PASS.

### Step 3: Misroute on purpose (10 min)
**Claude prompt to use:**
```
Add a --misroute flag: when set, answer canonical-class questions with
mode "graph" instead of the table's winner, and print a final line
comparing the session total against the properly-routed total.
```
Run `python selector_probe.py --misroute`.
**Expected:** the canonical rows jump (Q3: 840, Q4: 1,054) and the summary shows the misrouted session costing roughly 1.5–2x the routed one — at identical correctness. Write the number down; it is the price of selector loyalty.

### Step 4: Save the table
Write the routing table to `u05-lab/routing_table.json` ({class: mode}). U12's router lab imports this exact file.

## Deliverable
`u05-lab/selector_probe.py` + `u05-lab/routing_table.json` — a measured, misroute-aware routing table.

## Stretch Goals
- Add `naive` as a fourth column and compute each selector's savings multiple against it per class.
- Add a `--fail-on-fail` flag that exits non-zero if any cell FAILs — the campaign-gate habit before U13 formalizes it.

## Connection to Next Module
Your probe measured the *dynamic* selectors. U06 turns to the part of the receipt that never changes between calls — the static surface — and shows how altitude, tool minimalism, and static-first ordering make the cache pay for it.
