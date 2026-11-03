# Phase 4 — Reusable evidence-led case studies

Completed locally on `codex/website-audit`, 2026-11-01. No deployment, new dependency, framework migration, chatbot or later-phase inquiry work. All ten `/work/<slug>` URLs remain. The homepage, perspective gallery, all-projects index, samples and API remain functional.

## Architecture and source of truth

`CaseStudyProject` in `src/lib/case-study.ts` defines every requested field: id, slug, title, industries, shortDescription, businessProblem, solutionSummary, maturityStatus, verifiedCapabilities, inDevelopmentCapabilities, plannedCapabilities, technologyStack, architectureSummary, screenshots, videoPoster, videoSource, videoCaptions, verifiedOutcomes, limitations, caseStudySections, relatedProjects and lastVerifiedDate.

Additional fields keep the story honest and reusable: kind (industrial/research), reportedImplementedCapabilities, unverifiedCapabilities, workflow, sampleUrl, videoTranscript and assetRequirements. Screenshot records require actual intrinsic dimensions, alt, caption and stable id, with optional srcSet/sizes. Verified statements require an evidence description and verification date.

All project-specific copy lives in `src/lib/content.ts`. `caseStudies` adapts the preserved original `projects` records, with per-project editorial scope and limitations. `caseStudyEvidence` is the typed registry for approved media, supported stack information and verified evidence. The old model is retained for existing demos and source preservation; components do not invent project details. The Phase 3 gallery now also consumes the new evidence registry’s media, dimensions and captions.

The Phase 0 register establishes no independently verified delivered product artifacts. Accordingly all verifiedCapabilities/verifiedOutcomes/technologyStack arrays are currently empty, screenshots/captions are empty, video/poster/transcript are null, and lastVerifiedDate is null. Original Implemented features are preserved as “Reported implemented · evidence pending,” rather than silently promoted or deleted. Development, planned and scope-to-confirm lists retain every original capability. Authored pilot/delivery status is explicitly attributed to the brief.

`docs/sample-case-study.json` is an exported snapshot of the real Production Intelligence content model. It demonstrates the complete shape with honest empty media/verification fields. Edit content.ts, not the snapshot, to change the website.

## Components and page behavior

- `CaseStudyPage.tsx`: data-driven hero, page contents links, challenge/solution narrative, project-specific story sections, capability groups, optional native architecture disclosure, stack, outcomes, limitations, related projects, contextual email/form CTA and footer.
- `CaseStudyMedia.tsx`: ProductPreview, CaseStudyVideo and ScreenshotGallery. Hero uses the first approved screenshot; missing screenshots use a visibly labeled evidence placeholder, not an industrial plate or fake dashboard. Media area has functional empty states with no decorative play button.
- `work.$slug.tsx`: looks up the typed record, rejects unknown slugs, supplies SEO/head data and gallery return context, then renders the shared template.
- `case-study.css`: isolated responsive layout, media ratio reservations, gallery/lightbox and editorial spacing.

Production emphasizes reported job/stage/department/BOM scope and the authored pilot status. Engineering separates calculation/BOM/costing claims from document development and planned CAD. MOS separates vision, developing modules and planned integrations. Tender distinguishes unverified extraction from planned end-to-end work. BOQ separates its deterministic sample review from product scope and unmeasured accuracy. MedPulse has research-specific headings/CTA, is not a lead industrial case, and attributes the supplied application reference as unverified publication/attribution rather than a granted patent or clinical result.

The architecture remains labeled conceptual because no deployed inventory was supplied. Detailed source content and illustrative demos remain available under `/samples`; each flagship story links to its matching sample. No source project was deleted. The contextual CTA uses the existing public contact destination with the project title in the email subject and an alternative existing inquiry-form link.

## Media contract and authoring

Add actual approved data to `caseStudyEvidence[slug]` in content.ts. Every entry supplies screenshots, videoPoster, videoSource, videoCaptions, videoTranscript, verifiedCapabilities, verifiedOutcomes, lastVerifiedDate and technologyStack; use empty arrays/null for missing evidence. The record is overlaid on the compatibility adapter. Do not assign an industrial concept plate as a real poster. Screenshot dimensions must describe the supplied image, not a guessed standard size. The sample JSON shows current missing fields rather than executable paths to nonexistent media.

Native video uses controls, playsInline, preload=none and no autoplay. A real poster is required for embedding; a supplied recording without a poster gets a direct functional recording link plus an explanation. Caption tracks and an expandable transcript render only when provided. Anonymous cross-origin video/track loading requires appropriate hosting CORS; no credentials or authenticated streaming are built here. Browser codec/source compatibility still needs checking against the actual recordings. Native players avoid a heavy SDK; there is no new streaming service integration.

The screenshot grid uses native buttons and a shared native-dialog lightbox. Viewer supports previous/next controls, arrow keys, Escape/backdrop dismissal and restoration of focus to the original thumbnail. Browser modal behavior contains focus and makes the background inert. Images keep their intrinsic ratios, thumbs are lazy/async and the hero screenshot has high fetch priority. The first real image is reused from the browser cache; larger responsive variants can be supplied through srcSet. No nonexistent real media was compressed or “optimized” during this phase.

A development-only media fixture section in `/design-system#media-review` uses existing illustrations explicitly labeled as layout fixtures, not product screenshots. It is never added to project media and is excluded from production rendering. This made it possible to test the actual lightbox without fabricating product evidence.

## SEO

Every project has a relevant title/description, absolute canonical URL on the supplied production domain and matching og:url. Gallery context query parameters are excluded from the canonical. Social images are added only when a real screenshot exists. The structured-data helper emits CreativeWork with author, summary, URL, sector relevance and an appropriate project/research-brief genre. It does not emit reviews, customer results, deployment status, unverified publication dates or patent-grant metadata. JSON-LD escapes `<` before rendering. Research uses the same neutral schema with a research-brief genre. Unknown project URLs remain 404/noindex.

## Checks and local review actually performed

- TypeScript: PASS.
- Vitest: PASS, 9 files / 69 tests (63 existing + 6 new case-study tests). Covers complete migration/capability preservation, no false verified fields, planned CAD separation, fallback without fake controls, native video/poster/captions/transcript, keyboard lightbox navigation/focus restoration and research/schema wording. Gallery regression tests were updated to require a real poster for video and continue to pass.
- ESLint: PASS, 0 errors and the same six pre-existing fast-refresh warnings in dormant UI primitives.
- Vercel build: PASS; existing tsconfig-path plugin suggestion remains.
- verify:vercel: PASS for all ten project pages and other existing routes; unknown routes 404; per-case canonical/parseable CreativeWork JSON-LD; gallery SSR selection and return link; safe inquiry readiness/invalid POST without email delivery.
- git diff --check: PASS.

Browser review: 1440px Production Intelligence hero and canonical/schema; 390px and 320px case containment; 768px Engineering architecture disclosure. Document width matched viewport in checked views. The native screenshot viewer opened with Close focused, ArrowRight changed the image, Escape dismissed it and focus returned to the original thumbnail. Fixture captions explicitly stated they were illustrations. Real product media playback, caption timing and final-image visual QA cannot be validated without the actual assets. OS-level reduced-motion and dedicated screen-reader sessions were not run; native/Phase 1 reduced-motion/focus rules remain in place.

The initial lightbox unit test needed jsdom dialog-method stubs, since jsdom does not implement native showModal/close. The real browser checks separately verified actual native behavior. No unresolved introduced test failure remains. Default Cloudflare build was not rerun. No real inquiry/email was sent.

## Performance observations

No player/lightbox dependency or per-frame animation was introduced. Native video declares preload=none to defer stream fetching; this is a browser hint, and actual loading/poster behavior depends on supplied media and hosting. Screenshot width/height and video aspect-ratio reserve layout space. The current missing-media state requests no product assets. The build’s case-template client chunk is approximately 11.67kB uncompressed / 3.58kB gzip, excluding shared dependencies; shared content is approximately 29.85kB / 8.95kB gzip. These are artifact sizes, not page-transfer totals or measured Core Web Vitals. No field CLS, FPS or network-performance score is asserted.

## Changed files in this phase

New: src/lib/case-study.ts; src/components/site/case-study/CaseStudyPage.tsx; CaseStudyMedia.tsx; MediaReviewExamples.tsx; src/case-study.css; src/test/case-study.test.tsx; docs/PHASE4_CASE_STUDIES.md; docs/case-study-assets.md; docs/sample-case-study.json.

Updated: src/lib/content.ts; src/routes/work.$slug.tsx; src/components/site/gallery/ProjectGallery.tsx; src/routes/design-system.tsx (development QA fixtures only); src/styles.css (new layer import); src/test/gallery.test.tsx; scripts/verify-vercel.mjs. Prior phases remain in the checkout; this list describes Phase 4, not the cumulative diff against original main.

See case-study-assets.md for the missing-asset/evidence checklist. Stop here: no real screenshots, verified milestones, savings or stacks should be promoted until supported material is supplied.
