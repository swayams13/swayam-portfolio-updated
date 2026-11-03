# Advisor security notes

## Enforced application boundaries

- Server-only OpenAI/Redis credentials and fixed outbound endpoints. Browser requests cannot supply a key, model, host, tool definition or private document. The Redis endpoint must be HTTPS on an upstash.io subdomain without credentials/path/query.
- POST requires matching Origin and JSON content type. This is a browser cross-origin protection, not authentication against bots that can forge headers.
- Strict schemas: current question 3–1,200 characters, advisor body at most 6,500 bytes, metric body at most 400 bytes, no extra history/file/tool fields. Body reading has a five-second cancellation deadline.
- Local limits: 120 combined endpoint calls per instance/60-second window; separate advisor 12 and metric 40 per-client windows; bounded entry maps with expiry. Missing trusted network identity shares the conservative unknown-client bucket.
- Paid path additionally requires an atomic shared reservation: 2 cents per attempt, a UTC-day monetary ceiling, 10 global calls/fixed minute and 4 client calls/fixed minute. Three provider operations may be in flight per process. Defaults cannot silently turn into unmetered calls when Redis is absent or fails.
- Redis EVAL checks all ceilings before incrementing; all keys use the same {budget} hash tag. Client/minute keys expire in 120 seconds, day keys in 172,800 seconds. The adapter uses the documented [REST JSON command format](https://upstash.com/docs/redis/features/restapi). The Lua/REST interaction is mocked in tests; actual store acceptance is an operator check.
- Provider timeout 10 seconds, shared-store timeout 3 seconds, request JSON capped at 12,000 UTF-8 bytes before provider fetch, maximum output 256 tokens, pinned model, no retries.
- User input and retrieved text are data, not instructions. Prompt boundaries reinforce this, but the stronger control is constrained fact-ID output and server-side composition. Extra output fields, unknown IDs and incomplete/refused replies are discarded. No model-authored prose/URL/capability state is displayed. All original evidence states and planned limitations remain available.
- Basic boundary checks refuse secret/client-identity requests, fabricated results, authoritative engineering approval, obvious personal details and off-topic prompts. They are supplementary heuristics, not a claim of perfect intent/PII detection. The advisor has no private data to reveal and no arbitrary tools to execute.
- React renders plain escaped text; no generated HTML/Markdown parser is used. Client response validation restricts project links to local /work/<slug> paths.
- No conversation persistence, file upload, retrieval crawler or CRM writing. Human follow-up requires reviewed-summary consent, then a separate normal inquiry submission. An unconsented prefill event is ignored; an in-flight inquiry cannot be overwritten by a new handoff.

## Remaining operational responsibilities

The cheap lookup/metrics throttles are per instance. Global paid spending/rates use Redis, but anonymous traffic can still consume the public budget or hosting/Redis capacity. Put edge WAF/bot limits in front of both endpoints before public paid activation. Counters limit spend, not visitor fairness. Telemetry counts are unauthenticated and not reliable unique-user/conversion evidence.

clientKey currently reads x-vercel-forwarded-for, matching the intended hosting integration. Verify your ingress overwrites/strips this header; client-supplied network headers are otherwise forgeable. For another hosting proxy, adapt the trusted identity boundary. Missing identity deliberately groups visitors; shared NATs may also share limits. The global monetary cap does not depend on trusting an IP header.

Provider/host logging, retention, access controls, price changes and account/model access must be reviewed in the actual deployment. store=false is not Zero Data Retention. Do not log request bodies, prompt/response content or provider error bodies in newly added monitoring. Use private, scoped credentials; rotate/revoke keys after exposure and never prefix them with VITE_.

The public model can only be as accurate as approved content. Keep the evidence register current and review claims before publishing verified fields. A screenshot is not proof of deployment or a business outcome. Neither this model nor the advisor provides engineering certification, regulatory sign-off or guaranteed benefits.

No claim of complete prompt-injection immunity, bot-proofing, legal compliance or production acceptance is made. The tested invariant is that provider output cannot create facts, change evidence labels, generate actions or execute tools through this application.
