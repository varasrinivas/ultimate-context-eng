# U07 Lab: Build It with AI — The Ladder with a Seatbelt

## Objective
Build (with Claude writing the code) the three-rung compressor for MedFlow histories with a fidelity assertion, measure ratio AND fidelity per rung — then sabotage the extract rung and watch your own seatbelt refuse to ship the result.

## Prerequisites
- Completed the U07 Understand It lab
- Python 3.10+

## The Build (40 min)

### Step 1: The ladder (12 min)
**Claude prompt to use:**
```
Write compress_audit.py. Resolve the dataset as Path(__file__).resolve().parents[2] / "bench" / "seed" / "dataset.json" (the script lives in labs/uXX-lab/) and load it. Build
member_history(member_id) returning that member's auth_requests joined with
their expected decision and score. Then compress(history, budget_tokens=400)
implementing three rungs in order:
1. PRUNE: keep only the requested member's records (drop everything else).
2. EXTRACT (verbatim): one exact line per kept request:
   "<id> | <decision> | score <score>" - NEVER paraphrased.
3. ABSTRACT: one summary line for counts ("N requests on file").
Then a FIDELITY CHECK before returning: assert every kept request id AND its
decision string appear verbatim in the output block; raise AssertionError
naming exactly what was lost. Also assert len(block)//4 <= budget_tokens
with the message "over budget - evict, don't truncate".
A main that compresses M-2001 and prints: the block, the naive size
(len(json.dumps(all requests))//4), the compressed size, the ratio, and
"FIDELITY: PASS". Standard library only. Return only the code.
```
**Expected output (shape):**
```
HISTORY (verbatim):
  PA-1001 | APPROVED | score 100
  PA-1004 | MANUAL_REVIEW | score 65
SUMMARY: 2 requests on file.
naive ~410 tok -> compressed ~40 tok  (10.2x)   FIDELITY: PASS
```

### Step 2: Per-rung accounting (8 min)
**Claude prompt to use:**
```
Add a --per-rung flag printing a table of size after each rung (raw, pruned,
extracted+abstracted) with the cumulative ratio, so the contribution of each
rung is visible separately.
```
**What to observe:** prune does the cheap bulk (other members gone), extraction is nearly free in tokens but priceless in fidelity, abstraction only touches the leftovers — the ladder's order made visible.

### Step 3: Break it on purpose (10 min)
**Claude prompt to use:**
```
Add a --tamper flag: when set, replace the EXTRACT rung's verbatim lines with
an abstractive summary that mentions only the first request id and describes
the rest as "consistent history" - the exact Q9 failure. Do not weaken the
fidelity check.
```
Run `python compress_audit.py --tamper`.
**Expected:**
```
AssertionError: compression lost: 'PA-1004' (and its decision MANUAL_REVIEW)
```
Your compressor now refuses to produce the star exhibit. That AssertionError is the difference between this lab and the 208-token FAIL you met in the Understand lab — same failure, but yours never left the function.

### Step 4: Prove the app agrees (5 min)
Ask the running app Q9 in `compressed` mode and compare: the app's fixture demonstrates the unprotected outcome (✗ FAILED, savings void); your pipeline demonstrates the protected one (AssertionError before shipping). Two endings, one lesson — write which one you'd rather debug at 2am.

## Deliverable
`u07-lab/compress_audit.py` — three rungs, per-rung accounting, and a seatbelt proven to fire.

## Stretch Goals
- Make the budget enforce by *eviction* (drop oldest whole record, re-check) rather than failure, and log each eviction — budgeted mode's rule inside your ladder.
- Extend the fidelity contract with forbidden content: assert the block never contains another member's request id (a contamination check, previewing U10).

## Connection to Next Module
You compressed a *data* history. U08 applies the identical ladder-and-assertion discipline to *conversation* history — compaction — and adds the write strategy that moves memory out of the window entirely.
