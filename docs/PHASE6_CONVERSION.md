# Phase 6 — Inquiry delivery, conversion and SEO

Implemented locally on 2 November 2026 on `codex/website-audit`. No deployment, real email, provider account or DNS change was performed. This document supersedes the activation instructions in STEP4_INQUIRY.md and STEP5_RELEASE.md for the current source.

## Audit and resulting behavior

The public endpoint returned `{"deliveryAvailable":false,"bookingUrl":null}` before this work. The old server enabled delivery only with a Resend key and valid sender/recipient; otherwise the UI prepared an explicitly unsent email draft. The public response cannot establish which private hosting setting is absent, whether the deployed revision matches this checkout, or whether a domain is verified. See PHASE6_CONTACT_AUDIT.md.

The current form collects name, work email, company, industry and challenge, plus explicit permission to process that inquiry. Phone, budget and current workflow are optional. Consumer email providers are not artificially blocked. Consent to an inquiry does not subscribe anyone to marketing or enable optional analytics. The advisor still needs a separate explicit consent to copy a workflow summary; the visitor can edit it and separately submit the inquiry. Industry CTAs preselect only the industry, preserving the visitor’s brief.

Client/native and strict server validation, associated labels, field errors, focused error summary, status announcements, disabled pending controls and a synchronous submission lock are in place. Failed or ambiguous sends preserve fields. Unchanged retries retain a request identifier and exact provider message; edited details create a new attempt. Provider acceptance is shown only after a successful provider acknowledgment containing an ID. The confirmation explicitly says it does not guarantee inbox receipt. Draft/copy/email actions do not pretend to send. Optional booking appears only for a configured HTTPS destination; its reachability must be checked by the operator.

## Server boundary and duplicate handling

`POST /api/inquiry` requires same-origin JSON, a strict schema, explicit consent, empty honeypot, bounded 12 KB body and bounded parsing time. Sender, recipient and subject come from server configuration or a fixed industry enum. Visitor email is Reply-To; the message is plain text so submitted markup is not interpreted as HTML. Provider requests have a 10-second timeout; browser requests allow 15 seconds. Private provider errors and request bodies are not logged or returned.

Local work is bounded by global instance and email limits, a pending-work ceiling and expiring caches. Concurrent duplicate requests coalesce, including while the shared limit check is pending. Production additionally requires the Upstash gate and a private random INQUIRY_RATE_SECRET of at least 32 characters. An atomic Redis script permits at most 30 attempts/minute globally, 5/client and 3/email per fixed 15-minute bucket. Boundary bursts can occur. Keys use rotating keyed hashes and expire within 30 minutes; there is no Redis inquiry body or email address. Missing gate configuration disables production delivery. Store failure returns 503 and no provider call; limit denial returns 429 and Retry-After. Limits can also be consumed by failed provider attempts.

Client identity trusts Vercel’s `x-vercel-forwarded-for`; confirm the edge strips/overwrites visitor-supplied values. Outside Vercel, adapt this header to a trusted ingress before enabling sending. Without it all visitors share the unknown-client bucket. Apply an edge/WAF limit as defense against distributed request floods; Origin and honeypot checks alone are not bot authentication. Analytics has separate local bounded counters; it is not an authenticated billing ledger.

Stable provider keys combine UUID and message hash, including across server instances. Local success caches expire after 15 minutes; provider idempotency covers 24 hours according to [Resend’s documentation](https://resend.com/docs/dashboard/emails/idempotency-keys). The application rejects client attempts over 20 hours old. These controls are bounded retry protection, not permanent deduplication: a reload/new UUID or deliberate new attempt can create another inquiry. No lead database or delivered/bounced webhook state has been invented.

## Local test mode

Use Node 22 and Bun 1.4.4:

```sh
bun install --frozen-lockfile
CONTACT_TEST_MODE=true bun run dev --host 127.0.0.1 --port 5175
```

This server environment variable is honored only outside production. It needs no provider key, supplies example sender/recipient internally, runs the normal validation and response path, never calls Resend, and labels both the submit control and success as simulation. A repeated simulation remains labeled simulation. Do not use a VITE_ prefix. Test values must be fictitious. Without test mode or real configuration the draft/direct-email flow remains available. Runtime env changes require a restart/redeployment.

## Production setup and controlled delivery test

1. Verify an owned sending domain in Resend. Configure the exact SPF/DKIM records supplied by the provider and review DMARC alignment with your DNS operator; do not invent record values. Gmail can be the recipient, not your owned verified sender domain. See [Resend verified domains](https://resend.com/docs/dashboard/domains/introduction).
2. Configure RESEND_API_KEY, CONTACT_FROM and CONTACT_TO privately in Vercel Preview runtime settings. Use a least-privilege sending key, CONTACT_FROM on that verified domain, and the agreed recipient. Keep CONTACT_TEST_MODE=false. Never commit secrets or put them in VITE_ variables.
3. Provision Upstash Redis and configure UPSTASH_REDIS_REST_URL/TOKEN plus INQUIRY_RATE_SECRET. Redis may be shared with the advisor; inquiry counters have separate namespaces. Use a random private secret of at least 32 characters. Configure appropriate account regions, access and retention.
4. Leave BOOKING_URL empty until a real public calendar exists. Check a configured link on mobile and confirm its duration/timezone/availability manually.
5. Build and deploy the preview using `bun run build:vercel`. Confirm GET /api/inquiry reports readiness without secret values. This validates configuration shape, not DNS, account health, Redis connectivity or inbox placement. Keep previews protected/noindex through host settings.
6. Submit one controlled nonconfidential inquiry from that preview with consent. Record deployment SHA, UTC time, anonymous reference and provider status, never inquiry details in analytics. Confirm actual inbox receipt, spam-folder behavior, readable plain-text fields and working Reply-To. Inspect original message authentication headers for SPF/DKIM/DMARC results and provider bounce/failure status. A provider `id` alone is insufficient.
7. Check one unchanged retry does not produce a second email. Test rejected validation, honeypot, rate limits and store/provider failure in an isolated preview/test setup, not by exhausting production visitor quotas. Restore valid settings, retry and confirm recovery.
8. Agree mailbox/provider/hosting retention and deletion handling. Update public privacy wording if processing changes. No automatic mailbox purge is implemented. Keep transactional email tracking disabled unless there is a documented need and appropriate notice.
9. Promote only after the controlled inbox test and hosted mobile/accessibility checks. Submit sitemap to the actual search console if owned. If the primary domain changes, update canonical/OG URLs, SITE_ORIGIN, Person JSON-LD, robots and sitemap together. Roll back through a known deployment and recheck runtime configuration.

Use .env.example as names only; exporting variables or hosting runtime configuration is required. No real values are included. Credentials, Redis and sender-authentication were not available during this implementation, so live delivery verification remains outstanding.

## Analytics, attribution and conversion

Optional conversion events use `/api/analytics`; the UI sends nothing until opt-in and respects DNT/GPC. The footer preference can withdraw consent. Only this preference is stored in localStorage. The strict endpoint rejects extra fields, unknown events and unknown project IDs. It logs an event name, optional public project/industry and fixed service label; it never logs the submitted request. Browser fetch failures are ignored so analytics cannot block an inquiry. Event fetches suppress the referrer header. Hosting infrastructure may independently record network request logs; review their retention.

| Event               | Trigger                                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------------------------- |
| industry_selected   | Visitor changes the active homepage industry; not initial default rendering                             |
| project_card_viewed | Selected gallery stage at least 50% visible, once per project in that mounted gallery                   |
| case_study_opened   | Case-study page mounts or visitor opts in while there; once per project per mounted page                |
| video_started       | Native media play event, once per mounted project media slot                                            |
| video_completed     | Native ended event after an observed consented start, once per slot; not proof every second was watched |
| chat_started        | First valid question initiated in the advisor conversation after opt-in; reset on Clear                 |
| chat_lead_handoff   | Visitor explicitly consents and requests summary transfer; not a submitted inquiry                      |
| inquiry_submitted   | Provider acceptance acknowledgment, once per reference in that mounted form; never drafts/tests/errors  |
| booking_clicked     | Click on configured HTTPS calendar; not the email fallback or completed appointment                     |

No unique visitor/session ID, chat text, confidential brief, name, email, phone or full referral URL is accepted by this analytics schema. Counts are best effort and can be blocked, spoofed or lost; no durable analytics dashboard is claimed. Application-level advisor request/error counters remain operational logs without transcripts. The legacy advisor-metrics route is preserved for compatibility but is no longer called by the UI.

With the same optional permission, the inquiry can include only search/social/referral/direct or an allowlisted campaign category. Arbitrary query values are discarded; this is current-page coarse attribution, not persistent first-touch tracking. Turning analytics off prevents its collection. Analytics consent is distinct from inquiry-processing consent.

## SEO and content integrity

Unique titles/descriptions, absolute canonical and Open Graph URLs cover the homepage, project index, samples, advisor, privacy and all ten project stories. Case studies retain existing CreativeWork metadata and conditional real-image metadata. Factual Person JSON-LD identifies Swayam Singh and the public consulting role; no ProfessionalService address, reviews, logos or unsupported results were added. No new thin industry landing pages were created. A static sitemap includes 15 indexed URLs, excludes APIs/design-system, and must be updated when public routes change. Robots advertises it and discourages API crawling; robots is not access control. The design-system route retains noindex.

No approved social/product photography was supplied, so no fabricated OG image or client screenshot was introduced. Twitter cards fall back to summary without a real image. Existing descriptive image slots, aspect ratios and accessible semantic structure are retained. Server checks verify one h1 per page; a full screen-reader audit is still separate.

## Changed files in this phase

- Inquiry: src/lib/inquiry.ts; src/server/inquiry.server.ts; new src/server/inquiry-abuse.server.ts; src/routes/api.inquiry.ts; src/components/site/Contact.tsx; .env.example.
- Privacy/measurement: new src/lib/analytics.ts, src/lib/use-conversion.ts, src/server/analytics.server.ts, src/routes/api.analytics.ts, src/components/site/AnalyticsConsent.tsx, src/routes/privacy.tsx; generated src/routeTree.gen.ts.
- Funnel wiring: src/components/site/home/ConsultingHomepage.tsx, gallery/ProjectGallery.tsx, case-study/CaseStudyPage.tsx, case-study/CaseStudyMedia.tsx, advisor/SolutionsAdvisor.tsx; src/routes/index.tsx.
- SEO/layout: src/routes/__root.tsx, projects.tsx, samples.tsx, advisor.tsx; src/styles.css; new public/sitemap.xml; public/robots.txt.
- Verification/docs: src/test/contact.test.tsx, foundation.test.tsx, inquiry-server.test.ts; new conversion-server.test.ts and conversion-ui.test.tsx; scripts/verify-vercel.mjs; README.md; audit and this report. Historical setup docs now link here. Earlier phase changes are also present on the working branch; no route/project was removed and no dependency added.

## Actual verification

Results are recorded below after the final checks. Live inbox delivery, DNS authentication, real Upstash connectivity, a real booking destination and hosted edge behavior were not tested. No Lighthouse score, full screen-reader audit, real-device/Safari certification or verified search indexing is claimed.

| Check actually run          | Result                                                                                                                                                     |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Vitest                      | 122 tests passed across 13 files, including 18 added Phase 6 cases; all 104 earlier tests remain passing                                                   |
| TypeScript                  | Passed after route generation                                                                                                                              |
| ESLint                      | Zero errors; same six pre-existing Fast Refresh warnings in UI primitives                                                                                  |
| Vercel production build     | Passed with Node 22/Bun runner; no new dependency                                                                                                          |
| Generated server checks     | 16 pages returned 200; canonical/OG/title/description and one h1 checked; all ten case studies preserved; unknown pages returned 404                       |
| Static SEO                  | 15 unique sitemap URLs; all project slugs included; APIs/design-system excluded; robots sitemap reference verified                                         |
| API artifact                | Readiness returned false without credentials, invalid inquiry 400; invalid analytics containing email rejected 400; public advisor lookup preserved        |
| Production simulation guard | Re-ran artifact verification with CONTACT_TEST_MODE=true; production did not expose/enable simulation                                                      |
| Client boundary             | 17 static JS/HTML/JSON files scanned for provider endpoints, secret variable names and Redis script markers; none found                                    |
| Local browser end-to-end    | Test form → actual local server → explicit simulation success; unchanged retry preserved reference and test label; no email sent                           |
| Mobile form behavior        | Empty submit rejected with Name focused; completed consented submit focused the success status; phone/budget/workflow optional, all visible fields labeled |
| Responsive inspection       | At 390×844, 768×1024 and 1440×1000, document width equaled viewport width; mobile fields 350px wide, no horizontal overflow                                |
| Screenshot evidence         | phase6-mobile.jpg and phase6-desktop.jpg; synthetic test details only                                                                                      |
| Whitespace                  | git diff --check passed                                                                                                                                    |

Provider tests use injected mock responses: successful acknowledgment, HTTP/network/invalid-ack errors, exact formatting/fixed recipient/Reply-To, unchanged and edited retries, cross-instance stable keys, pending duplicate coalescing, shared denial/outage, stale attempts, missing consent, honeypot, invalid/oversized fields, local rate limits and expiry. Redis REST shape is mocked; a real Redis script execution has not been verified. Browser end-to-end is simulation only, not live Resend delivery. Synthetic video lifecycle tests verify event semantics; no real project videos are supplied. Consent/DNT/GPC, no-PII schema, visible-impression threshold, case visit deduplication, native play/ended, test-versus-live inquiry counts and configured booking-click behavior have automated coverage. Industry/chat event wiring was inspected; no complete external analytics dashboard or hosted funnel certification was performed.

One new test initially failed because jsdom does not provide a doNotTrack getter; its fixture was corrected. No unresolved test failure introduced by Phase 6 remains. The six UI lint warnings predate this phase. Vite’s existing tsconfig-paths plugin redundancy notice remains informational. Real inbox/DNS/booking/host checks remain external release gates, rather than passing tests.

Next exact step: privately configure Preview-scope Resend sender/recipient/key and Upstash limits/secret, redeploy this branch as a protected preview, then perform and record the controlled inbox/authentication test above. No need for a framework migration or CRM subscription to validate this delivery path.
