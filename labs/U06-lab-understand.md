# U06 Lab: Understand It — Watch One Timestamp Kill the Cache

## Objective
Warm a cached-mode session and watch the cache-read badge climb; then dirty the prefix with a single volatile token and watch the discount vanish — with zero errors anywhere.

## Prerequisites
- Completed U06 module content; app running in replay mode (U00 lab setup)

## Exercise (25 min)

### Step 1: Read a cold cached receipt
Switch the mode toggle to **cached** and ask **Q1**. 
**What to observe:** input ~730 tokens, and on the first call the cache badge shows *cache write* (the prefix is being stored), not yet a discount.
**Expected output (replay fixtures, synthetic-pre-recording):**
```
CACHED               token receipt
Input total            ~730
cache read  0%   ·   cache write > 0
```

### Step 2: Warm the session
Ask **Q3**, then **Q4**, then **Q6** in the same session — four canonical-shaped asks sharing the same static prefix (system + tools + policy block, ordered static-first).
**What to observe:** the cache-read badge climbs on each subsequent call — the stable prefix is now billed at the ~90%-discount cache-read rate. The *input total does not shrink*; the *cost* does. Note both numbers per call:
```
call   input   cache-read %   cost
Q1     ~730          0%       $____   (cold: paying the write)
Q3     ~732        ~__%       $____
Q4     ~732        ~__%       $____
Q6     ~729        ~__%       $____
```

### Step 3: The one-token sabotage
The backend exposes the dirty-prefix demonstration the module described (a timestamp prepended at position zero). Ask the same Q3 with the session id `dirty-<anything>` — the assembler prepends `Generated at <clock>` for such sessions, exactly the anti-pattern.
**What to observe:** cache-read drops to 0% and stays there call after call, because the prefix is never byte-stable twice. Nothing errors. Nothing warns. Only the badge tells you.

### Step 4: Total the damage
Compute the 4-call session cost both ways (your Step 2 vs Step 3 numbers). The delta is the rent the cache was paying — and one token at position zero evicted the payer.

## Reflection Questions
1. Why does the *input total* stay ~730 in both sessions while the *cost* diverges? Which column would a naive dashboard have watched, and what would it have missed?
2. If the timestamp had been appended at the *end* of the context instead, what would Step 3 have shown, and why?
3. How does this connect to the relabeled salt container in the prep kitchen — and who noticed first, the cooks or the accountant?

## Key Insight
Caching is positional: the discount lives on the byte-stable prefix, dies at the first volatile token, and fails without an error message — the badge is the only witness.
