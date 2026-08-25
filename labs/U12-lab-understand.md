# U12 Lab: Understand It — Read the Router's Choices

## Objective
Ask one question from each class in routed mode, read which arm actually served it off the receipt, and verify every choice against the grid — including the case where the cheapest arm was disqualified for failing.

## Prerequisites
- Completed U12 module content
- App running in replay mode; `bench/results/replay-fullgrid.json` present

## Setup (2 min)
Copilot panel open, mode set to **routed**. Have the grid summary handy:
```bash
cd bench && python -c "
import json, collections
rows = json.load(open('results/replay-fullgrid.json'))
for r in rows:
    if r['qid'] in ('Q3','Q7','Q5','Q9'): print(r['qid'], r['mode'], r['tokens_in'], r['verdict'])"
```

## Exercise (25 min)

### Step 1: One ask per class
Ask **Q3** (canonical), **Q7** (abstention), **Q5** (logic), **Q9** (aggregation) — all in routed mode.
**What to observe:** the receipt's mode field names the delegate: `routed:okf`, `routed:okf`, `routed:compressed`, `routed:isolated`.
**Expected tokens:** 186 · 157 · ~206 · 1,796.

### Step 2: Verify each choice against the grid
For each class, list every arm's (tokens, verdict) from your Step-0 printout and confirm the router picked the cheapest PASS.
**Expected output (the aggregation row is the lesson):**
```
Q9 candidates: compressed 208 FAIL | notes 167 PASS | okf 190 PASS | isolated 1,796 PASS ...
router chose: isolated (or notes, per the shipped table) — NOT the 208-token FAIL
```
Write down the router's "waste" on Q9 versus compressed — that delta is the measured price of a complete answer.

### Step 3: The counterfactual router
Compute what a tokens-only router would have scored: for each of the 10 questions, take the cheapest arm regardless of verdict, sum the tokens, and count the FAILs it would have served.
**Expected shape:** a lower token total than routed — with 2 wrong answers baked in (Q7's fabrication cell isn't cheapest, but Q9's FAIL is). Cheaper, and lying.

### Step 4: Session totals
Ask all 10 standing questions in routed mode in one session and read the session strip.
**Expected output:** total ≈ the sum of routed cells from the grid; correctness 10/10; compare against a 10-question naive session (~17K tokens) — the 7.1x headline, reproduced by you.

## Reflection Questions
1. The router's Q9 choice costs ~8.6x compressed's failed attempt. Under what business framing is that obviously correct — and under what metric would it get "optimized" away?
2. Which routing choice would change first if the compressed arm's fidelity bug were fixed? What has to happen BEFORE the router may use it again?
3. How does this connect to the triage desk — and what corresponds to a unit failing its safety audit?

## Key Insight
A router is only as honest as its eligibility rule: cheapest-among-correct produces defensible savings, cheapest-overall produces cheap wrong answers with great-looking totals.
