# U01 Lab: Understand It — One Question, Ten Receipts

## Objective
Ask the SAME question in all ten strategy modes and read the receipts side by side: see which layers each strategy attacks, and meet the four canonical families (write / select / compress / isolate) as they appear on real bills.

## Prerequisites
- Completed U01 module content; app running in replay mode (U00 lab setup)

## Exercise (25 min)

### Step 1: Collect the ten receipts
Pin standing question **Q9** ("Summarize member M-2001's authorization history…") and ask it once in each mode using the toggle bar: naive → budgeted → compressed → cached → jit → graph → okf → notes → isolated → routed. The session strip at the bottom accumulates a sparkline as you go.
**What to observe:** the *shape* of each receipt, not just the total — which layer shrank, which appeared, which vanished.
**Expected output (replay-mode medians you should see on the receipts, Q9):**
```
naive 1,700 · budgeted ~560 · compressed 208 ✕FAILED · cached ~730
jit ~250 · graph ~440 · okf ~190 · notes 167 · isolated ~1,800 · routed ~240
```

### Step 2: Classify each mode into its family
Fill this table (module U01 has the answer key — fill first, then check):
```
mode        biggest layer     family (W/S/C/I)   why
naive       retrieved         (none — the control)
budgeted    ____              C (compress)       caps + eviction
compressed  ____              C                  prune/extract/abstract
cached      ____              (positioning aid)  same tokens, cheaper reads
jit         tool              S (select)         identifiers now, records on demand
graph       ____              S                  subgraph instead of dump
okf         ____              S                  one canonical concept file
notes       history→____      W (write)          external memory replaces history
isolated    ____              I (isolate)        sub-agent summary arrives ~1.5K
routed      ____              (meta)             picks one of the above
```

### Step 3: Watch a family fail honestly
In the Compare drawer, pin Q9 with **compressed** vs **naive**. In the shipped replay data, compressed drops a required fact on Q9 — its stamp reads **✗ FAILED** and the drawer prints **"FAILED — savings void."**
**Expected output:** the compressed column shows `208 input tokens` with a rotated ✕ FAILED stamp and the drawer prints **"FAILED — savings void"**; hovering the stamp lists `PA-1004` and `MANUAL_REVIEW` as the missing facts.

### Step 4: The taxonomy map
The module lists three lever taxonomies you'll meet in the wild (write/select/compress/isolate; add/compress/retrieve/offload; crop/compress/summarize/select). Assign each of the ten modes to all three taxonomies. Two won't fit cleanly (cached, routed) — note why: one optimizes *cost of position*, the other *chooses* levers.

## Reflection Questions
1. Which mode changed the receipt's shape the most while keeping the same verdict? Which changed the verdict?
2. Why does `jit` grow the tool layer while shrinking retrieved — and when would that trade go wrong?
3. How does this connect to the module's analogy of four ways to lighten a suitcase — ship ahead, pack less, vacuum-bag, or send a second traveler?

## Key Insight
Strategies aren't magic words — each one attacks a specific layer of the bill, and the stamp decides whether the attack was legitimate.
