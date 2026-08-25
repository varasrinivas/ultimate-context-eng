# MedFlow Copilot — Backend (`app/api`)

Spring Boot 3.5 / Java 21. Loads `bench/seed/dataset.json` (the contract) into H2 at boot, computes every determination from the contract's scoring rule, and serves the copilot with a **TokenReceipt** on every answer.

## Run
```bash
./mvnw spring-boot:run        # port 8080, replay mode (no API key needed)
# live mode: export ANTHROPIC_API_KEY=... && MEDFLOW_LIVE=1 ./mvnw spring-boot:run
```

## Endpoints
| | |
|---|---|
| `GET /api/policy` | thresholds, eligibility rule, redaction rule |
| `GET /api/queue` | MANUAL_REVIEW requests with missing-criteria explanations |
| `GET /api/requests` · `GET /api/requests/{id}` | all / one (criteria breakdown + notes) |
| `GET /api/members/{id}` | member + history (`dob` returns `REDACTED` when PHI-minimized) |
| `GET /api/copilot/questions` | the ten standing questions (keys stay server-side) |
| `POST /api/copilot/ask` | `{question, mode, sessionId?, compareWith?}` → answer + TokenReceipt (+ compare answer/receipt) |

`question` may be a standing id (`"Q3"`), the full standing text, or free-form (replay answers free-form with a deterministic notice; live mode answers it for real).

## Modes (`mode` param — curriculum 1:1)
`naive · budgeted · compressed · cached · jit · graph · okf · notes · isolated · routed`
- `compressed` enforces the **fidelity assertion** (load-bearing PA-ids must survive) — it throws rather than silently dropping one.
- `graph` context is provenance-tagged (every edge `[EXTRACTED]` from stored records).
- `isolated` folds the sub-agent call's tokens into the `tool` layer and the totals — isolation's price is visible, not hidden.
- `routed` reports as `routed:<target>`.

## TokenReceipt contract
`inputTokens` = **total** prompt tokens entering the window; the five `layers` always sum to it exactly (tested for every mode). `cacheReadTokens`/`cacheCreationTokens` are the cached subset and price differently ($3/M plain in, $15/M out, $0.30/M cache read, $3.75/M cache write). `correctness` grades standing questions against the seed's answer keys: `PASS | FAIL | UNGRADED` with `missingFacts` and `forbiddenHits`.

## Replay fixtures
`bench/fixtures/{questionId}-{mode}.json`. Missing fixtures are synthesized deterministically from the seed (source `synthetic-pre-recording`, answers correct by construction) so the app always works keyless; live recordings overwrite them with real usage numbers.

## Tests (`./mvnw test`, 15 tests)
golden determinations vs seed `expected` · per-mode layer/inputTokens reconciliation · abstention PASS in okf/routed + grader catches planted fabricated DOB and planted wrong thresholds · compression fidelity keeps PA-ids verbatim.
