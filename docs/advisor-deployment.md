# Advisor setup, deployment and operation

## Start with lookup mode

Use the existing Node 22.23.2 / Bun 1.4.4 workflow. No dependency was added.

```sh
bun install --frozen-lockfile
bun run dev --host 127.0.0.1 --port 5174
```

Open /advisor. Without extra environment configuration, public lookup works and paid matching remains off. GET /api/advisor returns only an aiAvailable configuration flag, not a live provider-health certificate. Existing inquiry delivery may still be unavailable; its explicit unsent-draft fallback remains.

## Private environment configuration

Use .env.example as the empty template. Store actual values only in ignored local environment files or the hosting platform’s private environment settings. Never paste them into chat, public source, VITE_ variables or browser code.

| Variable | Purpose |
|---|---|
| ADVISOR_LLM_ENABLED | Default false. Set true only after the other controls are configured and staged acceptance is complete |
| OPENAI_API_KEY | Dedicated server-side provider project key with access to the pinned model |
| ADVISOR_RATE_SECRET | Private random secret, at least 32 characters; used for rotating HMAC rate keys |
| UPSTASH_REDIS_REST_URL | HTTPS database REST root URL on an upstash.io subdomain |
| UPSTASH_REDIS_REST_TOKEN | Private write-capable token supporting EVAL and its GET/INCR/INCRBY/EXPIRE commands |
| ADVISOR_DAILY_BUDGET_CENTS | Default 100 cents; clamped to 2–1,000. Shared reservation budget, not invoice reconciliation |

The model is deliberately pinned in provider.server.ts to gpt-5.4-mini-2026-03-17. Changing it requires revisiting schema support, token/cost assumptions and evaluations; visitors cannot choose a more expensive model through the API. No database is created automatically. Use an appropriately scoped budget database; the advisor budget key namespace is shared across deployments pointing to that database.

Keep Resend’s existing RESEND_API_KEY, CONTACT_FROM, CONTACT_TO and optional BOOKING_URL separate. The advisor never submits the inquiry form. Real human-follow-up delivery still requires a verified sender and a separately authorized acceptance/inbox test.

## Staged acceptance and deployment

1. Configure private environment values with paid matching initially disabled. Verify a trusted ingress identity and edge WAF/rate controls for POST /api/advisor and /api/advisor-metrics. Do not trust an arbitrary forwarded-IP header from the public internet.
2. Run typecheck, test, lint, build:vercel and verify:vercel. The verification script deliberately keeps AI off on its requests and sends no valid lead.
3. Use the existing Vercel/Nitro configuration; do not publish only static assets, because advisor/inquiry endpoints need the server functions. No deployment was performed during Phase 5.
4. In a private staging environment with a small explicit budget, enable paid matching, explicitly opt in through the UI and ask a non-sensitive public project question. Check a provider_ok event, valid canonical facts and unchanged evidence labels. Confirm your actual account accepts the pinned Responses request. This live check was not performed here.
5. Test shared budget reservation/denial across processes, invalid Redis credentials, provider outage, timeout, malformed input and rate limiting. Confirm deterministic fallback, no retry loop and no prompt/response content in logs. Verify actual Redis scripting/permissions and TTL behavior; unit tests use mocks.
6. Verify that a review checkbox starts unchecked, only the reviewed summary/industry copy, existing contact fields remain intact, and no inquiry is sent until the visitor separately submits. Test real email delivery separately if enabled.
7. Review actual provider and hosting retention settings, privacy copy, model access and costs before production activation. Add only approved public evidence to content.ts; do not ingest private client files.

For an immediate paid-path shutdown across old deployments, revoke/disable the dedicated provider credential. Set ADVISOR_LLM_ENABLED=false and redeploy for the application-level kill switch. The public lookup mode continues to work.

## Operating costs

As checked on 2026-11-01, the official [GPT-5.4 mini model page](https://developers.openai.com/api/docs/models/gpt-5.4-mini) lists $0.75 per million input tokens and $4.50 per million output tokens. At those rates an illustrative 2,000-input/256-output-token request is about $0.002652; this is arithmetic, not measured production usage. Recheck pricing before activation.

The server caps serialized provider request bytes at 12,000 and output at 256 tokens. Byte limits conservatively constrain input size but are not an exact tokenizer/billing report. It reserves $0.02 before each possible provider request. The default 100-cent UTC-day budget permits at most 50 reservations/day; failed requests and oversized contexts are not refunded. Global/client minute caps and process concurrency apply in addition. The day changes at 00:00 UTC (05:30 India time).

Reservations are a conservative application control, not a guaranteed provider-invoice ceiling: prices, protocol overhead, other uses of the same key, Redis and hosting costs are separate. Use a dedicated key/project and independent billing controls/alerts. There are no embedding, tool, file-search, vector-store, model-retry or full-history token costs in this implementation. Paid matching is optional; public lookup does not incur LLM charges.

## Monitoring

Collect JSON logs where service=solutions-advisor. Event vocabulary:

- question_started: visitor begins a question; no question text.
- project_opened: case-link action, optionally with a validated public project slug.
- handoff_started: consented summary copy; this is not proof of a submitted or delivered lead.
- lookup, provider_ok, provider_error, budget_error, budget_blocked, rate_limited: operational health, with coarse paid-path latency buckets where available.

Alert on sustained provider_error/budget_error, unexpected rate-limit growth and nearing the private Redis reservation ceiling. Inspect provider billing separately. Compare event counts for broad usage trends without interpreting them as unique visitors or achieved sales conversions. Bot/spoofed events, repeat clicks, aborted navigation, telemetry failure and blocked requests affect counts.

Retain only the event fields you need, restrict log/database access and set host/log-drain retention explicitly. Do not add prompt/body capture to error monitoring. Shared minute counters expire after 120 seconds; reservation counters after two days. The UI notice links [provider data controls](https://developers.openai.com/api/docs/guides/your-data): store=false does not eliminate default abuse-monitoring retention. Review configured account controls for your deployment.
