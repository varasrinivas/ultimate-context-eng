# U01 Lab: Build It with AI — The Layer Profiler

## Objective
Build a script that asks one question across all ten modes and prints a layer-by-mode matrix — the diagnostic table that tells you which strategy family to reach for.

## Prerequisites
- Completed the U01 Understand It lab (app running in replay mode; you've seen the ten receipts by hand)
- Python 3.10+

## The Build (35 min)

### Step 1: Scaffold the profiler (12 min)
**Claude prompt to use:**
```
Write layer_profile.py using only the Python standard library. It POSTs to
http://localhost:8080/api/copilot/ask with {"question": QUESTION, "mode": m,
"sessionId": "profile"} for each mode in
["naive","budgeted","compressed","cached","jit","graph","okf","notes","isolated","routed"].
QUESTION = "Summarize member M-2001's authorization history: how many requests and what were the outcomes?"
The response shape is {"primary": {"answer": ..., "receipt": {...}}}. From each
receipt read layers {system,retrieved,tool,history,user}, inputTokens, and
correctness.verdict. Print a matrix: one row per mode, columns
sys/ret/tool/hist/user/TOTAL/verdict, right-aligned numbers. After the matrix,
for each mode print the DOMINANT layer and which strategy family attacks it
using this map: retrieved->select, history->write or compress, tool->isolate
(if sub-call) or select (if jit), system->static design. Fail loudly with the
HTTP body on non-200. Return only the code.
```

### Step 2: Run it (5 min)
```bash
python layer_profile.py
```
**Expected output (shape; replay values are deterministic):**
```
mode        sys   ret  tool  hist  user  TOTAL  verdict
naive        65  1379   115   122    19   1700  PASS
compressed   65    89     0    35    19    208  FAIL
notes        65    64     0    19    19    167  PASS
isolated     65    93  1599     0    19   1796  PASS
...
naive: dominant=retrieved -> select family
isolated: dominant=tool -> isolate (sub-call visible on the bill)
```

### Step 3: Read the FAIL row (5 min)
The compressed row is the cheapest-looking aggregation answer — and its verdict column says FAIL (it dropped PA-1004). Extend the print: any FAIL row gets ` <- SAVINGS VOID` appended. Your profiler now refuses to recommend a broken lever.

### Step 4: Profile a different class (8 min)
Run the same script with Q3 (the thresholds question) by changing QUESTION. Compare dominant layers: aggregation questions are history/retrieved-dominated; canonical questions make even small retrieval look wasteful next to okf's 186. One profiler, two classes, two different family recommendations — that's diagnosis.

## Deliverable
`u01-lab/layer_profile.py` — a layer-by-mode diagnostic matrix with family recommendations and savings-void annotations.

## Stretch Goals
- Add `--question-id Q1..Q10` reading the text from `bench/seed/dataset.json`.
- Emit the matrix as markdown so it can be pasted into a team doc.

## Connection to Next Module
You can now diagnose one call. U02 scales diagnosis to a campaign: every mode × every question, graded, with the methodology rules (medians, Three Quantities, the canary) that make the resulting table trustworthy.
