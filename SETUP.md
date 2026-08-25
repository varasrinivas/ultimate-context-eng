# Setup — MedFlow Copilot & the Course Bench

## Requirements
- Java 21 + Maven (wrapper included) — backend
- Node 18+ — frontend
- Python 3.10+ — bench harness (`pip install anthropic` only needed for live mode)
- **No API key required** for the course: the app ships with recorded replay fixtures. Live mode is optional (`export ANTHROPIC_API_KEY=...`).

## Run the app (replay mode — default)
```bash
# backend (port 8080)
cd app/api && ./mvnw spring-boot:run
# frontend (port 5173, proxies /api to 8080)
cd app/ui && npm install && npm run dev
```
Open http://localhost:5173 — Review Queue → open PA-1002 → ask the Copilot a question → watch the **Token Lens**: the five-layer stacked bar, cost, cache badges, and the **correctness badge**. Flip strategy toggles and re-ask; pin two strategies in the **Compare drawer**.

Replay mode answers the 10 standing questions (and close paraphrases) from recorded fixtures with real recorded usage numbers; free-form questions get a deterministic "replay mode" notice. Set `ANTHROPIC_API_KEY` and `MEDFLOW_LIVE=1` to go live.

## Run the bench
```bash
cd bench
python keys/generate_keys.py          # derive answer keys from seed/dataset.json
python run_campaign.py --modes naive,graph --reps 1        # live (needs key) — graded table
python run_campaign.py --modes naive,graph --replay        # keyless, from fixtures
python verify_selftest.py             # proves the grader catches planted wrong/fabricated answers
```
Every campaign cell reports `tokens · correct?`; an arm that drops a key fact is **FAILED — savings void**.

## One source of truth
`bench/seed/dataset.json` — members, procedures, criteria, requests with expected determinations, the 10 standing questions with answer keys. The backend loads it at boot; keys derive from it; module tables regenerate from `bench/results/`. Change it and everything downstream must be regenerated (that's module U11's drift lesson, on purpose).
