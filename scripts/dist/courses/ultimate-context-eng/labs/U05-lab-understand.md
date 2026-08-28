# U05 Lab: Understand It — Three Librarians, Six Receipts

## Objective
Ask one relational question and one canonical question through the three structural selectors (`jit`, `graph`, `okf`) and read the six receipts: watch the tool layer appear, the graph win relations and lose policy, and okf's flat minimum.

## Prerequisites
- Completed U05 module content
- App running in replay mode (U00 lab setup) — no API key needed

## Exercise (25 min)

### Step 1: The relational question, three ways
Pin standing question **Q2** ("Which requests are currently in MANUAL_REVIEW, and which criterion is each missing?") and ask it in `jit`, then `graph`, then `okf`.
**What to observe:** the receipt totals and which layer carries the weight.
**Expected output (replay fixtures, synthetic-pre-recording):**
```
jit     286 tok   tool layer appears (the loader round trips)
graph   437 tok   retrieved = the [EXTRACTED]-tagged subgraph
okf     365 tok   canonical files strain to cover a relational ask
naive (reference from U01): 1,697 tok
```
All four stamps read ✓ — the differences here are pure economics.

### Step 2: The canonical question, three ways
Now pin **Q4** ("What is the eligibility rule, and which plan tier covers surgical procedures?") and repeat.
**Expected output:**
```
okf     186 tok   ✓   one policy file, no search
jit     145 tok   ✓   one policy record fetched
graph 1,054 tok   ✓   the subgraph ballooned — policy isn't a neighborhood
```
**What to observe:** the graph — the star of Step 1 — just cost 5.7x okf's price at identical correctness. Same selector, different question class, opposite verdict on cost.

### Step 3: Chart the ownership map
Fill in, from your receipts plus the module's grid:
```
question class   cheapest correct selector   worst tested selector
relational (Q2)  ____                        ____
canonical  (Q4)  ____                        ____
sparse    (Q1)   ____ (hint: 143)            ____
```

### Step 4: Find the provenance
In `graph` mode's answer for Q2, find the `[EXTRACTED]` tags. Every edge the answer relies on is labeled with where it came from. Ask yourself what an answer built on *unlabeled* edges would let you audit — that thread continues in U10.

## Reflection Questions
1. Why did `jit` beat `okf` on Q4 (145 vs 186) yet the module still routes canonical questions to okf? (Hint: what happens to jit's edge when the policy grows past one record?)
2. The graph's Q4 receipt was 1,054 tokens and still PASSED. Why is "correct but 5.7x the price" still a routing failure?
3. How does this connect to the three librarians — and which librarian did you just catch wheeling out the full cart?

## Key Insight
Selectors have question classes they own; the receipt — not the selector's reputation — tells you whose question this was.
