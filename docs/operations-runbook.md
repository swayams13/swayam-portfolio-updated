# Operations runbook

This repository deploys through its existing Vercel/Nitro configuration and remains connected to Lovable. No platform/framework migration is required. The current production decision is **hold until the blocking gates in launch-checklist.md pass**. A local generated artifact is not proof of a hosted deployment or inbox delivery.

## Reproduce the staging artifact

Use Node 22.23.2 (the package allows Node >=22.12 and <23) and Bun 1.4.4. The scoped security overrides produce lockfile format 3; use the pinned Bun runner instead of an older host default. `vercel.json` pins this runner for installation and build. Secrets must be server environment values, never VITE_ variables or source literals.

```sh
npx --yes --package=bun@1.4.4 bun install --frozen-lockfile
npx --yes --package=bun@1.4.4 bun run typecheck
npx --yes --package=bun@1.4.4 bun run test
npx --yes --package=bun@1.4.4 bun run lint
npx --yes --package=bun@1.4.4 bun run build:vercel
npx --yes --package=bun@1.4.4 bun run verify:vercel
npx --yes --package=bun@1.4.4 bun run verify:launch
```

`build:vercel` generates `.vercel/output`, then `scripts/finalize-vercel.mjs` installs baseline headers ahead of filesystem/server routing. Do not skip that finalization when deploying prebuilt output. `verify:launch` asserts the header route, 16 page documents, local destinations, IDs, metadata, native media defaults, static secret boundaries and a 150,000-byte gzip review budget for the main JS file. The bundle budget is a review guard, not a Core Web Vitals guarantee.

The default `bun run build` retains the Lovable/Cloudflare target. It was checked separately; Vercel-specific header routing is not a claim about other hosting platforms. Keep the wrapper's required peers and avoid duplicate Vite plugins.

To inspect the generated production artifact locally:

```sh
PORT=4175 node scripts/preview-vercel.mjs
```

Open http://127.0.0.1:4175. This loopback adapter serves the generated files/server and applies the artifact's declared baseline headers and static cache rules. It does **not** emulate Vercel's CDN compression, geographic latency, trusted ingress headers, WAF, billing, provider credentials or deployment protection. Close the owned process when finished. Never expose a Vite development server publicly for production traffic.

For simulated local form testing, run the development server separately with `CONTACT_TEST_MODE=true`. It is ignored in production builds. Successful simulation must say no email was sent. See PHASE6_CONVERSION.md for exact setup. No local test should create a real sales lead by accident.

## Environment inventory and activation

Start from `.env.example`. It contains names/templates, not working provider credentials. Use private Preview runtime settings first and redeploy/restart after changes. This audit checked local variable **presence only**, without printing private values; none of the provider, Redis, booking or advisor enable settings were configured locally.

| Setting                              | Purpose / failure mode                                                                                                                                 |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| RESEND_API_KEY                       | Sending-only server secret. Missing key disables online inquiry delivery. Do not use an invented/test string to make readiness appear true.            |
| CONTACT_FROM                         | Sender on a domain actually owned and verified with Resend. Gmail can receive inquiries but is not your owned sending domain.                          |
| CONTACT_TO                           | Agreed recipient mailbox; current public contact is sswayam506@gmail.com. Verify actual receipt and ownership operationally.                           |
| INQUIRY_RATE_SECRET                  | Random private value >=32 characters for rotating keyed abuse identifiers. Required with the shared gate in production.                                |
| UPSTASH_REDIS_REST_URL / TOKEN       | HTTPS Upstash REST credentials. Inquiry and paid-advisor counters use separate namespaces. Outage/denial must not fall through to unprotected sending. |
| BOOKING_URL                          | Optional real public HTTPS calendar. Leave empty until tested; the UI otherwise offers correctly labeled email scheduling.                             |
| CONTACT_TEST_MODE                    | Local development simulation only. Keep false in hosting. Production ignores an accidental true value.                                                 |
| ADVISOR_LLM_ENABLED                  | Off by default. Public deterministic lookup works without a provider. Enable paid matching only after a controlled provider/budget/privacy review.     |
| OPENAI_API_KEY / ADVISOR_RATE_SECRET | Server-only key and separate random >=32-character limiter secret for paid matching.                                                                   |
| ADVISOR_DAILY_BUDGET_CENTS           | Shared reservation ceiling; default 100, bounded by the application. Reservations are conservative controls, not an invoice reconciliation service.    |

GET /api/inquiry exposes deliveryAvailable and a validated public bookingUrl. GET /api/advisor exposes aiAvailable. These indicate configuration shape; they do not prove domain verification, Redis connectivity, account health, model availability or inbox receipt.

Before enabling sending, verify actual Upstash EVAL operation/expiry/denial from the deployed function and trusted client identity at the Vercel edge. The code trusts `x-vercel-forwarded-for`; outside Vercel it needs an equivalent ingress that overwrites visitor-supplied values. Without this header visitors share the unknown-client bucket. Add a host/WAF limit for request floods; application Origin/honeypot checks are not bot authentication.

Provider/domain activation, sender authentication, formatting and the controlled inbox test are detailed in PHASE6_CONVERSION.md. Do not record keys, full inquiry text or personal details in a QA spreadsheet, analytics payload or public issue.

## Browser, accessibility and performance checks

Inspect the homepage, all case studies, index, samples, advisor and privacy. Test 320/430/768/1366/1920 widths, keyboard Tab/Shift+Tab/Enter/Space/arrows/Home/End/Escape, menu dismissal/focus return, industry state, carousel alternatives, case return links and form errors/retries. Verify normal vertical scrolling cannot change the gallery selection. Test real touch and screen readers before claiming broad WCAG 2.2 AA conformance.

The review used Lighthouse 13.6.0, axe-core/CLI 4.14.0 and Chrome/ChromeDriver major 156 in a temporary tools directory outside the app. The first axe attempt failed on a driver mismatch; a matching driver enabled the final scans. These tools are not runtime site dependencies.

A reproducible Lighthouse command after starting the local production adapter is:

```sh
npx --yes --package=lighthouse@13.6.0 lighthouse http://127.0.0.1:4175/ --chrome-flags="--headless=new" --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=../homepage-lighthouse.json
```

Run at least three samples and retain settings, browser version, raw reports, warnings and timestamps. The reviewed mobile profile uses simulated 150ms RTT, 1,638.4 Kbps throughput and 4x CPU slowdown at 412x823 emulation. Localhost tests use a warm local server and lack real CDN/device variability. Do not compare a cold, uncompressed adapter result with a warm hosted result as a proven code-only gain.

For axe, use the pinned CLI with a ChromeDriver matching the installed browser and the WCAG2 A/AA, WCAG2.1 A/AA, WCAG2.2 AA and best-practice tags. Record the **actual** testEnvironment viewport from its JSON rather than assuming a command-line window flag became the viewport. Run all 15 indexed URLs; expand preserved demos and open dialogs for additional state checks. Review incomplete results (gradients, SVG text, glyph buttons and closed-dialog references) manually instead of treating them as passes. Zero automated violations is not a compliance certificate.

Reduced motion was also inspected in a real Chromium session forced to `prefers-reduced-motion: reduce`: perspective/transform/transition disabled, inactive slides hidden, scroll behavior auto, no running animations in the homepage sample. Keep this behavior when adding interaction. Real media currently does not exist in the content model; test captions, native controls, CORS, dimensions, mobile seeking and actual transfer sizes when supplied.

The p75 goals remain LCP <=2.5s, INP <=200ms and CLS <=0.1. Lighthouse TBT is a lab metric and **is not INP**. Use CrUX when the real production origin has sufficient field data, or design explicitly consent-compatible aggregated RUM before collecting it. Do not add private query strings, inquiry/chat content or visitor identifiers to performance events.

## Privacy and inquiry reliability

Optional analytics start off, honor DNT/GPC and can be withdrawn using the footer control. Only the preference is persisted in localStorage. Strict event schemas reject personal/free-text fields. Broad source/campaign attribution uses the same opt-in. Security counters are short-lived keyed identifiers; application transcript/lead databases do not exist.

The advisor's operational events are coarse counters without raw questions. Its model can select only retrieved public fact IDs and an allowed question key; server composition supplies maturity labels and site links. No arbitrary tool execution, private document ingestion, generated client claims or model-authored prose is exposed. Keep provider keys private and matching disabled when shared cost controls fail. See advisor-security.md and advisor-deployment.md for evaluation and cost controls.

An inquiry success means Resend acknowledgment with an ID, not inbox placement. Local deduplication/coalescing lasts 15 minutes; the provider's documented idempotency window is 24 hours. The browser reuses an unchanged attempt and the server rejects attempts older than 20 hours. A new UUID or edited message can be a new inquiry. Do not promise permanent deduplication. A timeout may be ambiguous; retry unchanged details rather than clicking a new submission repeatedly.

Maintain a real mailbox follow-up routine. Review Resend acceptance/bounce status and host 4xx/5xx/latency metadata without recording bodies. Optional conversion counts can be blocked or spoofed, so they are not a reliable delivery ledger. Establish mailbox/provider/log retention and deletion handling; the application does not automatically purge correspondence.

## Incident responses

| Symptom                          | Action                                                                                                                                                                                    |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Readiness false / draft fallback | Check private runtime presence, sender/recipient validity, shared gate and secret length, then redeploy. Do not switch the UI to pretend success.                                         |
| Inquiry 400/403/415              | Review field errors, consent, honeypot, Origin/content type and current form version. Do not relax validation or log request bodies to diagnose it.                                       |
| Inquiry 429                      | Honor Retry-After. Check shared global/client/email quotas and trusted-header behavior. Investigate abuse before increasing limits.                                                       |
| Inquiry 502 / ambiguous timeout  | Inspect provider status privately; retry the same request identity. Confirm actual receipt before asserting delivery.                                                                     |
| Inquiry 503                      | Shared store/configuration may be unavailable. Preserve details, keep direct email/draft options and restore the gate; do not bypass it.                                                  |
| AI matching unavailable          | Public lookup is the intended fallback. Check opt-in, enable/key/secret, shared budget, current model availability and coarse error metrics. Never expose provider errors or transcripts. |
| Unexpected analytics content     | Stop optional collection, investigate strict-schema changes, remove any recorded personal content through the actual provider workflow and update privacy handling.                       |
| Navigation/media regression      | Reproduce on a protected preview and use a verified rollback candidate. Never replace missing assets with fabricated implementation evidence.                                             |

During the first launch, check delivery/error status daily and re-audit dependencies regularly and after updates. `bun audit --json` currently retains one moderate minimatch advisory in development lint tooling; see launch-checklist.md. Do not expose build tools to untrusted network input or force an incompatible major override merely to obtain a clean audit count.

## Deploy and roll back

Use the existing Vercel project, not a new hosting service. Verify Node 22, the pinned Bun commands, root directory, branch-to-environment mapping and runtime variables. Current source is local and uncommitted: make an ordinary reviewed commit/branch before expecting a Git-based Preview. AGENTS.md prohibits force pushes or rewriting published Lovable history. Confirm which branch triggers production before pushing anything.

Create a protected Preview, record its immutable deployment URL and source identity, verify all blocking gates, then promote deliberately. Recheck actual response headers (including APIs/static/404s), sender receipt/Reply-To, privacy defaults, canonical origin/indexing, navigation and mobile controls on the hosted URL. The prepared Build Output has no evidence of actual geographic latency or platform enforcement until deployed.

Record a known good deployment that passed these checks before release. Use Vercel's deployment rollback/promotion mechanism to restore it if needed. Rollback was **not executed or account-verified** in this review. Settings and old deployment secrets may differ: do not assume code rollback restores safe environment state. If an old release lacks current abuse/privacy controls, disable/revoke sending access or block the affected endpoint before restoring it; keep direct email available. Recheck delivery and security after any restoration. Accepted emails remain in provider/mailbox systems and are not rolled back with code.

References: [Vercel Build Output routing](https://vercel.com/docs/build-output-api/configuration#routes), [Resend idempotency](https://resend.com/docs/dashboard/emails/idempotency-keys), [Resend domain setup](https://resend.com/docs/dashboard/domains/introduction), [Bun scoped overrides/lockfile compatibility](https://bun.com/docs/pm/overrides), [Core Web Vitals](https://web.dev/articles/vitals).
