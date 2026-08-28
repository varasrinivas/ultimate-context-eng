# U00 Lab: Build It with AI — Your Own Receipt Auditor

## Objective
Build a small script (with Claude writing the code) that calls the copilot API directly, audits every TokenReceipt for the reconciliation rule, and flags any call whose layers don't sum to its total.

## Prerequisites
- Completed the U00 Understand It lab (app running in replay mode)
- Python 3.10+

## The Build (30 min)

### Step 1: Scaffold the auditor (10 min)
**Claude prompt to use:**
```
Write audit_receipts.py. It POSTs to http://localhost:8080/api/copilot/ask
with JSON {"question": q, "mode": m, "sessionId": "audit"} for every
combination of these questions and modes:
questions = ["Which criteria apply to procedure 72148 and what is the weight of each?",
             "What score thresholds route a request to approval, manual review, and denial?"]
modes = ["naive", "okf"]
For each response, read receipt.layers (system, retrieved, tool, history, user)
and receipt.inputTokens. Print one line per call:
  {mode:<8} {question_id} layers_sum={X} input={Y} {"OK" if X==Y else "DRIFT " + str(X-Y)}
Use only urllib from the standard library, 60s timeout, and fail loudly with
the HTTP body on any non-200. End with a summary: N calls, M reconciled.
Return only the code.
```

### Step 2: Run it (5 min)
```bash
python audit_receipts.py
```
**Expected output:**
```
naive    Q1 layers_sum=9014 input=9014 OK
okf      Q1 layers_sum=...  input=...  OK
naive    Q3 layers_sum=...  input=...  OK
okf      Q3 layers_sum=...  input=...  OK
4 calls, 4 reconciled
```

### Step 3: Break it on purpose (10 min)
**Claude prompt to use:**
```
Add a --tamper flag to audit_receipts.py: when set, add 137 to the retrieved
layer after fetching (simulating a buggy instrument) before the check runs.
```
Run `python audit_receipts.py --tamper` — every line must now print `DRIFT 137`. This proves your auditor detects lying instruments rather than decorating them. An auditor that can't fail is not an auditor.

### Step 4: Keep it
You will reuse this script in U13, where the app's Lens is reconciled against the external campaign harness.

## Deliverable
`u00-lab/audit_receipts.py` — a working, tamper-detecting receipt auditor.

## Stretch Goals
- Add cost recomputation from the token counts and the pricing table in the module; flag any receipt whose costUsd differs from yours by > $0.0001.
- Point it at all 10 standing questions × all 10 modes (100 replay calls, still free).

## Connection to Next Module
You can now read and audit a single receipt. U01 zooms out: which *layer* each piece of context belongs to, and the four strategy families (write / select / compress / isolate) that will shrink each one.
