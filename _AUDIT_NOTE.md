# Audit Apply Notes — AILabSimulationPlatform

## Source
`/Users/erolakarsu/projects/_AUDIT/reports/batch_05.md` section 3.

## Original Recommendations (AI Counterparts)
- `/student-misconception-detector`
- `/real-time-safety-monitor`
- `/lab-equipment-predictor`

## Implemented (this pass)
Three endpoints appended to `server/routes/ai.js` using existing `queryOpenRouter`, `parseAIJson`, `saveAiResult`, and the global `aiRateLimiter` already mounted on the router:

- `POST /api/ai/student/misconception-detector` — analyzes a student submission, identifies misconceptions, error patterns, suggests remediation steps and follow-up questions.
- `POST /api/ai/safety/realtime-monitor` — advisory in-progress safety check; returns risk level, violations, recommended action (continue/warn/pause/stop/evacuate) with explicit "advisory only" disclaimer.
- `POST /api/ai/equipment/predict` — predicts equipment, consumables, PPE for an experiment type with cost estimates and low-budget alternatives.

All three persist via `AiResult` Sequelize model.

Syntax: `node --check` passes.

## Backlog (Custom Feature Suggestions)
- Vision-based lab procedure verification (image upload + setup validation; service has text-only `queryOpenRouter` — vision adapter would be a small service addition).
- Agentic lab assistant for real-time procedural guidance.
- Multi-modal documentation (video + notes + results).
- Streaming real-time safety anomaly detection (current `/safety/realtime-monitor` is request-response; streaming variant would require websockets).
- VR lab integration.
- Auto-generated peer feedback summaries (could compose with existing `/collaboration/suggest`).

Non-AI: peer collaboration tools, equipment inventory/booking, plagiarism detection, parent notifications.

## Categorization
- MECHANICAL: 3 endpoints (done — exhausts the audit's missing list).
- TOO-RISKY mechanically: streaming/real-time autonomous safety control (mechanical pass kept it advisory).
- NEEDS-PRODUCT-DECISION: vision adapter selection, websocket streaming architecture.

## Apply pass 3 (frontend)

- **Action:** LEFT-AS-IS — frontend already wired.
- `client/src/pages/AdvancedAITools.js` exposes a tabbed UI for the three apply2 endpoints (`/ai/student/misconception-detector`, `/ai/safety/realtime-monitor`, `/ai/equipment/predict`) using `services/api.js` (JWT Bearer from localStorage).
- Route registered in `client/src/App.js` (`advanced-ai`).
- Error path handles 429 rate limit and surfaces `error.response?.data?.error` (covers 503 no-key).
- See `_AUDIT/apply3_logs/ab3_82.md`.

## Apply pass 4 (mechanical backlog)

- **Action:** SKIPPED — no MECHANICAL backlog remaining.
- All 3 audited missing endpoints (`/student/misconception-detector`, `/safety/realtime-monitor`, `/equipment/predict`) were implemented in apply pass 2 and are wired in `client/src/pages/AdvancedAITools.js`.
- Remaining backlog is TOO-RISKY (websocket streaming, autonomous safety control) or NEEDS-PRODUCT-DECISION (vision adapter, VR integration, multi-modal docs).
- See `_AUDIT/apply4_logs/ab3_82.md`.
