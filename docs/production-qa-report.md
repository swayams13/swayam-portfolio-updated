# Production QA report

2 November 2026. **Production launch is on hold.** Local application checks pass, but this source revision has not been deployed and real inquiry delivery, sender authentication, shared-hosted protection and production privacy settings remain unverified. The existing public endpoint still reported delivery unavailable. This is a staging/source handoff, not production certification.

## Issues fixed

- Security advisories addressed through Zod 4.6.6, Vite 8.1.6, Vitest 4.1.12 and compatible transitive overrides for seroval, shell-quote, launch-editor, js-yaml, nanoid, source-map-js and the two brace-expansion lines. Consent error handling was migrated and schemas retested.
- Removed unused direct dependencies @hookform/resolvers/date-fns and the unused React Query provider/context/dependency. Libraries used by preserved UI/legacy modules and wrapper peers remain.
- Generated Vercel output now applies nosniff, frame denial, a conservative Referrer-Policy, disabled unused device permissions, and a partial CSP for base/object/frame/form restrictions before file/server routing. Font caching is bounded; the local adapter uses the same declarations and correct XML/media MIME types. No nonce-based script CSP or hosted enforcement is claimed.
- Corrected logo/numbered indicator accessible names, carousel slide grouping, the samples footer landmark and the advisor suggestions group. Small case-preview labels now retain at least 8.89:1 contrast across the industrial gradient instead of a possible 4.27:1 at its copper endpoint.
- Repeated identical client validation errors now return focus to the error summary. This was reproduced in the browser and covered by a regression test.
- Timed-out streamed bodies reject even when their received prefix is syntactically valid JSON. Streaming limits/timeouts have regression coverage.
- Added complete artifact link/anchor/ID/metadata/media/public-boundary checks, a main-JS review budget, Node 22 function verification and an explicitly pinned Bun runner in Vercel commands. Existing routes, data, demos and APIs remain available; no framework migration or 3D dependency was added.

## Tests actually performed

| Check                            | Result                                                                                                                                                                                                                                                                                   |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Frozen Bun 1.4.4 installation    | Passed with current scoped overrides/lockfile                                                                                                                                                                                                                                            |
| Vitest                           | 125 tests passed across 14 files; the 122 prior tests still pass                                                                                                                                                                                                                         |
| TypeScript                       | Passed                                                                                                                                                                                                                                                                                   |
| ESLint                           | Zero errors; six pre-existing UI Fast Refresh warnings                                                                                                                                                                                                                                   |
| Default Lovable/Cloudflare build | Passed; preserved separately                                                                                                                                                                                                                                                             |
| Vercel production build          | Passed; Node 22 streaming function plus finalized header routes                                                                                                                                                                                                                          |
| verify:vercel                    | All existing page/metadata/404/inquiry/advisor checks passed                                                                                                                                                                                                                             |
| verify:launch                    | 16 documents, 462 internal links/anchors, unique IDs, control references, heading/canonical/schema/media/boundary checks passed                                                                                                                                                          |
| Actual local HTTP                | Pages/static/API/404 headers, XML MIME, API no-store, valid-but-unconfigured inquiry 503 with unsent wording, invalid/consent/honeypot 400, cross-origin 403, wrong type 415, oversized body 400, no-PII analytics 400, strict advisor 400 and a 12-allowed/13th-429 lookup limit passed |
| Reduced-motion browser probe     | Media preference true; perspective/transform/transition disabled, inactive slides hidden, scroll behavior auto, zero running animations in inspected homepage state                                                                                                                      |
| Full dependency audit            | One moderate minimatch advisory remains in development lint tooling, two resolved version lines                                                                                                                                                                                          |
| Production dependency audit      | Empty advisory object from Bun registry audit at review time; not a guarantee against unknown vulnerabilities                                                                                                                                                                            |
| Secret/public asset review       | No high-confidence credential pattern matches in 185 source text files and 86 archived text files; static client boundary checks passed. Six illustrative JPEGs visually reviewed, all with zero EXIF entries                                                                            |
| Diff whitespace                  | Checked before handoff                                                                                                                                                                                                                                                                   |

The standalone axe CLI initially failed because its bundled ChromeDriver supported major 152 while installed Chrome was major 156. A matching driver corrected the tool setup. Its first successful scan found two pre-existing semantic issues in homepage/samples; both were fixed and all 15 pages rescanned. No unresolved introduced test failure remains. The six lint warnings and Vite's tsconfig-paths redundancy notice predate this QA work.

## Performance: lab results, not field p75

Lighthouse 13.6.0 ran in Headless Chrome 156 against the generated artifact on a warm loopback adapter. The mobile profile uses 412x823 emulation, simulated 150ms RTT / 1,638.4 Kbps / 4x CPU slowdown. **The Lighthouse LCP figures below are simulated lab estimates derived from browser traces.** The observed-LCP column is an actual unthrottled local trace timing; it is not a real phone/network measurement. The adapter does not provide Vercel CDN compression or global latency.

| Sample                              | Lighthouse LCP (simulated ms) | Observed local trace LCP (ms) | CLS | Lab TBT (ms) | Performance / accessibility / best practices / SEO |
| ----------------------------------- | ----------------------------: | ----------------------------: | --: | -----------: | -------------------------------------------------- |
| home-mobile-1                       |                        1507.6 |                           220 |   0 |            0 | 100 / 100 / 100 / 100                              |
| home-mobile-2                       |                        1514.4 |                           216 |   0 |            0 | 100 / 100 / 100 / 100                              |
| home-mobile-3                       |                        1508.0 |                           168 |   0 |            0 | 100 / 100 / 100 / 100                              |
| production-mobile                   |                        1510.1 |                           148 |   0 |            0 | 100 / 100 / 100 / 100                              |
| advisor-mobile                      |                        1506.5 |                           152 |   0 |            0 | 100 / 100 / 100 / 100                              |
| home-desktop                        |                         367.2 |                           164 |   0 |            0 | 100 / 100 / 100 / 100                              |
| case-manufacturing-operating-system |                        1511.8 |                           189 |   0 |            0 | 100 / 100 / 100 / 100                              |
| case-engineering-automation         |                        1507.5 |                           138 |   0 |            0 | 100 / 100 / 100 / 100                              |
| case-tender-to-quotation            |                        1509.6 |                           166 |   0 |            0 | 100 / 100 / 100 / 100                              |
| case-boq-intelligence               |                        1509.2 |                           175 |   0 |            0 | 100 / 100 / 100 / 100                              |
| case-expansion-joint-automation     |                        1503.9 |                           147 |   0 |            0 | 100 / 100 / 100 / 100                              |
| case-pressure-vessel-tools          |                        1513.1 |                           146 |   0 |            0 | 100 / 100 / 100 / 100                              |
| case-vendor-registration            |                        1507.4 |                           139 |   0 |            0 | 100 / 100 / 100 / 100                              |
| case-workforce-resource-management  |                        1508.0 |                           163 |   0 |            0 | 100 / 100 / 100 / 100                              |
| case-medpulse                       |                        1516.0 |                           100 |   0 |            0 | 100 / 100 / 100 / 100                              |

Three homepage mobile samples have median simulated LCP **1508.0ms**, median observed local LCP **216ms**, CLS **0** and TBT **0ms**. INP and field p75 values were **not measured**. TBT is not INP. The target remains LCP <=2.5s, INP <=200ms, CLS <=0.1 at p75; these reports do not establish that the production targets are met.

All ten case-study routes received an individual mobile Lighthouse sample. There were no Lighthouse runtime errors or run warnings in the final reports. Scores describe the audited initial states, not every interaction or future asset. Authentic screenshots/videos are absent, so these results must be repeated when real media is introduced.

The main JS file is **383,586 bytes raw / 118,406 bytes gzip** using the verification script's gzip calculation. The same security-patched baseline before removing the unused query provider was 408,204 raw bytes; this is about 24.6 KB of removed code, not a claim that every dependency update reduced the earlier Phase 6 bundle. Global CSS is approximately 147 KB raw / 27 KB gzip and retains preserved legacy styles. The four local WOFF2 files total about 89 KB. Initial-homepage script requests contained no advisor UI chunk, GSAP or WebGL; advisor UI loads on its own route. Illustrative scene JPEGs were not requested by the current homepage.

The first cold baseline scored 90 and had different server/cache/CPU conditions. No code-only speedup is inferred from that comparison. Use the retained final settings/raw reports for repeatability; obtain CrUX or explicitly consent-compatible RUM on the actual production revision before making field claims.

## Accessibility and responsiveness

Axe-core 4.14.0 scanned all 15 indexed pages with WCAG 2 A/AA, 2.1 A/AA, 2.2 AA and best-practice tags: **0 detected violations** in the final scan. Actual axe viewport was 756x413; mobile Lighthouse and manual browser tests supplied additional narrow-layout coverage. The command-line window request was not misreported as the real axe viewport.

There are **28 incomplete rule results across pages**, not automatically passing results. Remaining classes are color contrast over gradients/SVGs, glyph-only arrow labels, and aria-controls references to closed native dialogs. Reviewed palette/gradient pairs, meaningful arrow names, redundant SVG/button labels and actual DOM dialog IDs address the inspected cases, but they remain marked incomplete in raw axe output. A comprehensive manual conformance evaluation is still required.

Numerical contrast review: body on ivory 15.97:1; light muted copy 6.18:1; light copper text 5.17:1; dark muted copy 7.89:1; dark copper accent 6.90:1; case title/label at the copper gradient endpoint 8.89:1; case caption at that endpoint 6.00:1. Disabled/decorative neighboring slides are not the only navigation mechanism. Focus indicators remain visible and meaningful controls have named alternatives.

Manual browser checks used 320x740, 430x932, 768x1024, 1366x900 and 1920x1080. Homepage document width matched each viewport; selected card widths remained usable, and visible form controls had associated labels. At 320px the repeated-error fix returned focus to the role=alert summary and the phone field retained aria-invalid/aria-describedby. At 430px the offline inquiry produced an explicitly unsent draft with preserved values and no analytics opt-in.

Keyboard checks covered menu Enter/Escape/Tab behavior, initial Close focus and return to Menu; industry arrow navigation; carousel arrows; case-study links and return state. Normal vertical scrolling preserved the selected project. The EPC Tender-to-Quotation case returned to the same industry/project. Manufacturing, EPC, Construction and Real Estate selection updated sector copy and the corresponding project set. Native dialog background was inert; full screen-reader/virtual-cursor behavior and all browser-chrome focus boundaries were not certified.

Advisor lookup correctly described CAD integration as planned and distinguished authored implementation reports from verified evidence. Handoff stayed disabled before consent; after explicit consent it copied only the reviewed summary, focused the brief, left inquiry and analytics consent unchecked and reported that nothing was sent. Actual paid model matching was not exercised. Optional phone/budget/workflow fields remain optional.

No real project video or screenshot exists in the supplied model. Native controls/preload/caption/lightbox architecture has fixture tests, but real playback, captions, audio description, CDN CORS, touch seeking and production lightbox media remain unverified. Physical iOS/Android touch testing, VoiceOver/NVDA review, full zoom/text-spacing testing and every expanded legacy demo state were not certified. Zero automated violations is not a WCAG 2.2 AA conformance claim.

## Security, privacy and SEO observations

Current application requests have bounded strict schemas and same-origin/content-type checks. Inquiry adds consent, a honeypot, stable idempotency, provider acknowledgment validation, local quotas and a fail-closed required production shared gate. Advisor uses public retrieval, restricted fact-ID selection, bounded model output/cost controls and server composition; no arbitrary tools, client files or raw model prose are exposed. Evaluation tests include fabricated results, unverified capability questions, injection/confidentiality/off-topic cases, provider failures and incorrect matches.

No real provider credentials were configured or invented. Runtime variables were checked for presence only; private values were not printed. The working-source/archive pattern scan and generated-public-boundary scan found no exposed credential patterns in their defined scopes. Ignored runtime secret files, complete Git history, account permissions and independent penetration testing were not scanned/certified. Reviewed public images contain generic industrial/architectural imagery, not identifiable client UI or client documents. Ownership/publication approval for future assets remains an operator responsibility.

The remaining minimatch advisory is traced to ESLint/typescript-eslint development tooling, not an identified visitor-input runtime path. It remains a tracked issue; no incompatible v11 override was forced. The production dependency graph returned no current advisories in this audit. See the raw before/after records and [Zod advisory](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5), [seroval advisory](https://github.com/advisories/GHSA-f86p-h4j2-7qgj), [shell-quote advisory](https://github.com/advisories/GHSA-pqg4-j6r4-53mv).

Analytics stay opt-in, DNT/GPC-aware and restricted to public event identifiers; tests reject confidential/free-text fields. Chat handoff consent remains separate from inquiry processing and optional analytics. No default transcript store or silent sales-lead creation was introduced. Hosting/provider retention must still be reviewed against the public notice before launch.

SEO checks cover all 15 unique sitemap URLs, static robots configuration, single h1/canonical, unique IDs and descriptive metadata, Person/CreativeWork JSON-LD without invented reviews/ratings, 462 working internal page/anchor links and unknown-route 404s. Design-system stays noindex. No thin industry pages were added. Actual search indexing, Preview protection, a future custom domain and approved social imagery remain external/content gates.

## Deployment decision and next step

**Do not promote yet.** The public site returned deliveryAvailable:false and no booking URL during read-only inspection. Its additional baseline headers were absent (HSTS was present), so the new Vercel headers are prepared/tested locally, not claimed live. No local Vercel project binding was present; no hosted staging, DNS change, email send, paid AI call, promotion or rollback was performed.

Next: configure private Vercel Preview runtime settings for the verified Resend sender/recipient/key and shared Upstash gate/secret, create a protected Preview from the reviewed source, and perform the controlled inbox/authentication/edge/privacy checks in launch-checklist.md. Verify any real booking URL only when supplied. Follow operations-runbook.md for deployment and rollback, and content-update-guide.md for safe content/media updates. Do not rewrite Lovable-connected published Git history.

## Files changed in this QA phase

- package.json, bun.lock, vercel.json; src/lib/inquiry.ts; src/router.tsx; src/routes/__root.tsx; src/components/site/Contact.tsx; src/components/site/Nav.tsx; src/components/site/gallery/ProjectGallery.tsx; src/components/site/advisor/SolutionsAdvisor.tsx; src/routes/samples.tsx; src/case-study.css; src/server/advisor/protection.server.ts.
- scripts/preview-vercel.mjs; new scripts/security-headers.mjs, scripts/finalize-vercel.mjs and scripts/verify-launch.mjs.
- src/test/app-routing.test.tsx, src/test/gallery.test.tsx, src/test/contact.test.tsx; new src/test/launch-security.test.ts.
- README.md; new docs/launch-checklist.md, docs/content-update-guide.md, docs/operations-runbook.md and this report. Generated route output may be refreshed by Vite; no route was deleted. Earlier phase changes are also present in the source handoff.

Full raw Lighthouse/axe/HTTP/reduced-motion/dependency/secret-scan records and browser screenshots are included in the separate QA evidence archive. Local source ZIP excludes credentials, dependencies and generated outputs. A separately packaged Vercel artifact is for protected staging review only; it does not bypass the launch gates.
