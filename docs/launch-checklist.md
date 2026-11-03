# Launch checklist and QA assessment

Review date: 2 November 2026. Scope: the local redesigned source on `codex/website-audit`, not a verified deployment of this revision. Earlier phases remain uncommitted on that branch. **Production promotion is on hold.** The source can be reviewed as a protected staging build; successful local checks do not establish live delivery, hosted abuse protection, or field Core Web Vitals.

## Blocking release gates

- [ ] Configure a real Resend sender, recipient and private sending key; verify the owned sender domain and SPF/DKIM/DMARC results. Submit one controlled nonconfidential inquiry from the actual Preview origin, confirm provider acceptance **and inbox receipt**, inspect formatting/Reply-To, and retry unchanged details without a second email.
- [ ] Configure the production Upstash URL/token and a random INQUIRY_RATE_SECRET of at least 32 characters. Verify shared denial/outage/recovery and trusted `x-vercel-forwarded-for` handling at the actual Vercel ingress. Confirm edge request limits before public sending. Local tests mock Redis; they are not a real Redis/edge certification.
- [ ] Create a protected Vercel Preview deployment from the reviewed source with the pinned Node/Bun versions. No local Vercel project binding or provider runtime configuration was present during this review. Check HTTPS, generated response headers on pages/static/API/404 responses, no-store API responses and deployment identity there.
- [ ] Review the public privacy notice against actual mailbox/provider/hosting retention, opt-out behavior and AI-provider settings. Verify analytics remain off initially and that withdrawing consent stops optional events on the hosted build. No marketing subscription or transcript archive is implemented.
- [ ] Complete final keyboard and mobile contact checks on the hosted build; approve content/evidence states and public contact destinations. Record the actual deployment and its verified rollback candidate.

The public site was observed returning `deliveryAvailable:false` and no booking URL on this review date. Its response had HSTS but lacked the additional baseline headers now prepared in source. The public endpoint cannot identify which hosted secret/configuration is absent or which source revision is deployed. No real email, paid AI request, hosted promotion or rollback was performed during this phase.

## Local checks

- [x] Homepage, project index, samples, advisor, privacy and all ten case-study routes render; design-system remains available but noindex.
- [x] Industry selection, carousel keys, stable query state, ordinary vertical scrolling and case-study return state inspected in a browser.
- [x] Inquiry validation, explicit consent, optional fields, retry identity, duplicate prevention, safe sender/recipient handling and honest offline fallback covered by tests; the offline draft journey inspected in a browser.
- [x] Public advisor lookup distinguishes reported/development/planned scope. Reviewed-summary handoff requires a separate consent, focuses the inquiry brief and leaves inquiry/analytics consent unchecked. No lead is sent by handoff alone.
- [x] Security boundary, bounded request reads, strict analytics fields, privacy default, rate limiting and prompt-injection/unsupported-claim cases checked locally.
- [x] Canonical/OG metadata, sitemap coverage, Person/CreativeWork JSON-LD, one h1, unique IDs, local anchor targets, media dimensions and server/client separation checked by scripts.
- [x] Five responsive widths checked: 320, 430, 768, 1366 and 1920 CSS pixels. No homepage horizontal overflow in inspected states. Native mobile menu opens with Close focused; Escape returns focus to Menu.
- [x] Reduced-motion browser probe confirms no gallery perspective/transform/transition, hidden inactive slides, automatic rather than smooth scrolling and no running animations in the inspected homepage state.

Final automated accessibility/performance results are recorded in `production-qa-report.md`; automated scans do not certify WCAG conformance. A real screen reader, physical touch device and Safari/Android hardware review remain outstanding. No real product screenshot/video has been supplied, so media fallback is tested; actual encoding, captions, audio description, CORS and playback cannot yet be certified.

## Fixes in this phase

1. Patched affected serialization/validation and build/test dependencies, with compatible transitive overrides. Zod 4.6.6 replaces the affected v3 API; consent error configuration was updated and request schemas retested. Vite 8.1.6 and Vitest 4.1.12 remain on their existing major lines.
2. Removed unused direct `@hookform/resolvers` and `date-fns` declarations, plus the unused React Query provider/context/dependency. No application query hook used that provider. Retained libraries required by preserved UI/legacy modules and Lovable peers.
3. Added baseline security headers to the generated Vercel routes before static/server handling, bounded font caching, and matching local-adapter handling. Added XML/VTT/video content types to the local adapter. This is a partial CSP, not a nonce-based script policy or an XSS-proof guarantee.
4. Fixed accessible names for the visible logo/numbered gallery indicators, replaced an invalid article/group role combination, corrected the samples footer landmark, and gave advisor suggestions a valid named group role.
5. Improved small case-preview label contrast across the darkest-to-copper gradient; the original highlight could fall below 4.5:1 at the copper endpoint. Other semantic and gradient pairs were reviewed numerically.
6. Fixed repeated identical client validation failures leaving focus on Submit rather than returning it to the error summary; added a regression test.
7. Fixed a stalled request-body parser accepting a valid JSON prefix after cancellation; timed-out bodies now reject. Added streaming/timeout regression tests.
8. Added `verify:launch` for all-page link/anchor/ID/metadata/media/public-boundary checks and a main-JS size review budget. Pinned the Bun runner in Vercel commands because the scoped security overrides require the current lockfile format.

## Remaining non-blocking or conditional items

- One moderate minimatch advisory remains in two **development lint-tool** versions. `bun why minimatch` traced these to ESLint/typescript-eslint, not a visitor-input server path. Do not feed untrusted glob patterns into those tools or expose dev servers. Track upstream compatible fixes; replacing legacy minimatch with v11 blindly would change its import/API contract. This is not a clean dependency-audit claim.
- Six pre-existing Fast Refresh lint warnings remain in retained UI primitives; no lint error was introduced. Vite still reports its existing tsconfig-paths redundancy notice, but the Lovable wrapper declares that plugin as a peer.
- No booking destination is configured. Email scheduling remains correctly labeled. Add a calendar only when its actual URL, timezone, duration and availability have been verified; this is optional if direct inquiry delivery works.
- Real media and approved social imagery are missing. Add only consented, publishable assets; require captions/transcripts and any necessary audio description before publishing a video with meaningful speech/visual-only information.
- The current CSS still contains styles for preserved legacy demos. Do not delete them based only on initial-page coverage. No WebGL dependency or continuous render loop was introduced; the advisor UI chunk is absent from initial-homepage script requests in the audited run.
- No field p75 LCP/INP/CLS data is available for this revision. LCP ≤2.5 s, INP ≤200 ms and CLS ≤0.1 remain targets, not promises. Re-audit after real media or third-party scripts are added.

## Release sequence

1. Resolve the blocking gates in a protected Preview, using `operations-runbook.md` and the delivery procedures in `PHASE6_CONVERSION.md`.
2. Run frozen install, tests, types, lint, both retained build targets, Vercel artifact checks and browser QA. Record source/deployment identity without secret values.
3. Check actual production domain/canonicals, sitemap/robots and Preview indexing protection. Do not globally add noindex to the production source as a staging workaround.
4. Confirm a known good rollback candidate and current security/runtime settings. Then promote through the existing Vercel project; do not rewrite Lovable-connected Git history.
5. Immediately repeat delivery, navigation, privacy, headers and mobile checks on the promoted URL. Observe provider/hosting errors and collect consent-compatible field evidence before asserting the p75 performance targets are met.

References: [WCAG 2.2 quick reference](https://www.w3.org/WAI/WCAG22/quickref/), [Core Web Vitals thresholds and field measurement](https://web.dev/articles/vitals), [OWASP header guidance](https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Headers_Cheat_Sheet.html), [Vercel Build Output routing](https://vercel.com/docs/build-output-api/configuration#routes).
