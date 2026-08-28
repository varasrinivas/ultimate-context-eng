# U08 Lab: Build It with AI — The Compactor That Refuses to Forget

## Objective
Build (with Claude writing the code) a session-pressure simulator and a compactor with a decisions/open-items fidelity assertion — then compact away an open item on purpose and watch the assertion refuse.

## Prerequisites
- Completed the U08 Understand It lab
- Python 3.10+

## The Build (40 min)

### Step 1: The pressure simulator (12 min)
**Claude prompt to use:**
```
Write session_pressure.py. Define a scripted 8-turn MedFlow review session as
a list of turn dicts {kind, text} where kind is one of: chatter, tool_dump,
decision, open, resolved. Include at least: 2 decisions ("PA-1002: wait for
EMG before re-scoring", "PA-1010: borderline 50 - keep in review"), 1 open
item ("PA-1004: conservative-mgmt window ends 2026-09-23"), 2 tool_dumps of
~800 chars of fake queue JSON, and chatter/resolved filler.
Simulate two strategies over the 8 turns, counting history tokens (chars//4)
carried into each call:
- append_only: history = all prior turns
- compacted: every 3rd call, replace all but the last 2 turns with a
  compact() board (implement compact() with DECISIONS/OPEN sections kept
  VERBATIM and everything else summarized to a count line, plus an assertion
  that every decision and open text appears verbatim in the board)
Print a two-column table of per-call history tokens and totals, then an
ASCII sparkline per strategy. Standard library only. Return only the code.
```
**Expected output (shape):**
```
call   append-only   compacted
1            0            0
2          210          210
3          640           95   <- board rewrite
...
total     ~4,900        ~1,400
append:  ▁▂▃▄▅▆▇█    compacted: ▁▂▃▁▂▃▁▂
```

### Step 2: Audit what survived (8 min)
Print the final compacted board. Verify by eye: both decisions verbatim, the open item verbatim, the tool dumps reduced to a count. The chatter is gone and nothing graded went with it.

### Step 3: Break it on purpose (10 min)
**Claude prompt to use:**
```
Add a --lossy flag: when set, compact() "helpfully" also summarizes OPEN
items into a count ("1 item pending"). Do not weaken the assertion.
```
Run `python session_pressure.py --lossy`.
**Expected:**
```
AssertionError: compaction lost: 'PA-1004: conservative-mgmt window ends 2026-09-23'
```
The open item is precisely the thing a future call needs and can't reconstruct — your assertion just refused the case board that dropped the case.

### Step 4: The cadence experiment (5 min)
Change the compaction cadence from every 3rd call to every 6th and rerun. Note both totals and where the sparkline peaks — compacting at the cliff means the biggest board rewrite happens in the most pressured context. Pick the cadence you'd ship and defend it in one sentence.

## Deliverable
`u08-lab/session_pressure.py` — two strategies, honest curves, and a compactor whose seatbelt fires.

## Stretch Goals
- Add a third strategy `notes`: after each turn, extract facts to an external dict; history carries only the last 2 turns; compare all three totals (expect the U08 grid's shape: notes flattest).
- Feed a decision whose text contains a request id, then tamper the board formatting — does your assertion catch partial survival ("PA-1002" present but the decision text mangled)? Tighten it until it does.

## Connection to Next Module
Compaction and notes shrink what the window carries. U09 removes work from the window entirely — sub-agents with clean windows and a hand-back contract — and pays isolation's honest price to prove when it's worth it.
