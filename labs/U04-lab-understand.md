# U04 Lab: Understand It — Three Select Postures, One Desk

## Objective
Read naive, budgeted, and jit receipts on the same questions and learn select's signature shapes: the cap, the on-demand fetch — and the boundary where retrieval itself is the wrong tool.

## Prerequisites
- Completed U04 module content; app running in replay mode

## Exercise (25 min)

### Step 1: The cap
Ask **Q1** (criteria for 72148) in **naive**, then **budgeted**.
**Expected output:** naive ~1,694 tokens; budgeted ~559 · ✓ VERIFIED (replay grid, synthetic-pre-recording). In the budgeted receipt, retrieved shrank by whole records — the assembler evicted low-priority records entirely rather than truncating any mid-record. Both PASS: the cap kept what Q1 needed.

### Step 2: The on-demand fetch
Same Q1 in **jit**.
**Expected output:** ~143 tokens — cheaper than budgeted — and a *different shape*: retrieved is near zero while a small **tool** layer appears. Jit shipped identifiers, the model asked for the one procedure record, the server injected only that. Select moved from "cap the shipment" to "ship a catalog, fetch one item."

### Step 3: Find jit's price
Pin Q1 in the Compare drawer: budgeted vs jit. Jit wins tokens; now look at **latency** on the two receipts. Jit's two-pass fetch costs a round trip. Write the rule: *unpredictable needs → jit; predictable shape → pre-select and skip the trip.*

### Step 4: The boundary — where select loses to lookup
Ask **Q3** (score thresholds) in jit (~285), graph (~840), then **okf** (~186 · ✓).
**What to observe:** every retrieval posture pays to *find* something that was never lost — 80 and 50 are settled policy. The okf receipt's retrieved layer is one small canonical concept. Say the boundary out loud: *fuzzy gets retrieval, settled gets lookup* — it's the single highest-leverage sentence in the select family.

## Reflection Questions
1. Budgeted evicts whole records, never truncating. What specific failure does mid-record truncation invite that whole-record eviction cannot?
2. Q1's answer needs ~40 tokens of facts. Jit delivered a PASS at 143. Where did the other ~100 go, and are they reducible?
3. How does this connect to the reference librarian — and which posture is the librarian who brings three books opened to the right chapter?

## Key Insight
Select is two disciplines: search wide but ship narrow, and — before searching at all — check whether the fact is settled enough to simply look up.
