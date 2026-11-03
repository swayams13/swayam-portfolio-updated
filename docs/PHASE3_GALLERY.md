# Phase 3 — Perspective project exhibition

Implemented locally on the existing `codex/website-audit` branch, 2026-11-01. No deployment, framework migration, new dependency, React Three Fiber, WebGL or GSAP timeline was added. CSS transforms provide the needed depth without an additional runtime.

## Delivered

The homepage gallery uses the existing central industry-to-project mapping and project records. Desktop cards occupy one shared CSS grid cell: the center card is fully opaque and flat; immediate neighbors translate sideways and 120px into depth with a 9-degree rotation. Distant cards are hidden visually. A 440ms transform/opacity transition handles deliberate navigation; no scale pulsing or automatic advance.

Below 768px the perspective is removed, cards fill the available width and transition horizontally. Text, status and CTAs remain in normal card layout. Touch/pen horizontal swipes navigate on release when displacement exceeds 48px and is clearly more horizontal than vertical. `touch-action: pan-y pinch-zoom` preserves vertical scrolling and pinch zoom. There is no wheel listener, scroll lock, nested scrolling pane or pointer-move render loop. Mouse users have arrows, adjacent-card targets and numbered controls.

The four existing sector controls remain synchronized with the gallery. Manufacturing has four relevant projects; EPC & Engineering has three; Construction and Real Estate each have the BOQ prototype. No fake extra cards are created for single-item categories. All ten projects, including specialized systems and MedPulse, are listed on the additive `/projects` page. `/samples`, all case studies and the inquiry API remain.

## Reusable implementation

- `src/components/site/gallery/ProjectGallery.tsx`: exported ProjectGallery and memoized ProjectMedia; internal memoized exhibition card; controls, announcements, inactive-slide isolation and gesture handling. Optional selectedSlug/onProjectChange enable controlled state; the gallery also supports local state for reuse.
- `src/gallery.css`: perspective, poster/media sizing, mobile fallback, indicators and reduced-motion variant. Imported after the existing design/homepage styles.
- `src/lib/gallery.ts`: validates industry/project pairs against the central mapping, rejecting unknown or cross-sector combinations.
- `src/routes/index.tsx`: validated shareable `industry` and `project` search parameters; default values stripped so `/` remains HTTP 200. Gallery changes replace the current history entry and disable scroll reset/hash re-scrolling.
- `src/routes/work.$slug.tsx`: optional validated galleryIndustry search context and matching Selected systems return URL. Case-study content/architecture is unchanged.
- `src/routes/projects.tsx`: all-projects index, with existing statuses and case links.
- `src/components/site/home/ConsultingHomepage.tsx`: consumes the new gallery instead of the Phase 2 renderer.
- `src/routeTree.gen.ts`: generated route registration.
- `src/test/gallery.test.tsx`, updated homepage tests and `scripts/verify-vercel.mjs`: behavior and SSR coverage.

## Return navigation

Selected industry and project are in the homepage URL. Browser Back therefore restores both. Gallery case links carry galleryIndustry; the case page’s Selected systems link restores the same sector and project. This also works on refresh/share without relying on sessionStorage. Direct case visits without gallery context retain the default homepage behavior. Unknown search values normalize to a known sector/project pair. No credentials or inquiry fields are stored in URLs.

## Media and honesty

The gallery no longer creates dashboard-like sample previews. Missing media is represented by a typographic concept poster reading “Product capture not supplied · concept poster.” It is not evidence of an implemented product. Existing illustrative industrial JPEGs remain in project data; they are not relabeled as client screenshots.

Supply approved screenshots via existing project.media.screenshots. These render with lazy loading, async decoding and reserved dimensions/aspect ratio. Supply an actual walkthrough through project.media.video to enable the optional Watch Demo action, which opens the case-study demo section. If a video is the primary gallery media it uses preload=none, native controls and no autoplay. Inactive gallery video pauses. Existing case-page video rendering remains unchanged. When both screenshots and video exist, the screenshot is used on the card and the video is accessible through Watch Demo. No current project has supplied video or product captures, so no Watch Demo action is shown today.

Missing real assets (approved/redacted captures and optional recordings):

1. Production Intelligence: job list, actual stage change and department view from the pilot, with scope/version confirmed.
2. Engineering Automation: real calculation/BOM input-output capture, with delivered scope identified.
3. MOS: current working modules, clearly separated from planned departments/integrations.
4. Tender-to-Quotation: actual built-stage capture if available; otherwise keep the concept poster.
5. BOQ Intelligence: actual source/output/review capture with current prototype limitations.

Include publication permission, your contribution and current maturity. The Phase 0 evidence register remains authoritative about unverified claims. No business results, clients or deployments were invented.

## Accessibility and review notes

Gallery region and active slide have explicit names/positions. Arrow buttons have accessible labels and disabled endpoints; numbered controls expose aria-current. Native focus styles remain visible. Focus the region to use Left/Right/Home/End; sector controls retain their existing keyboard behavior. Inactive cards use aria-hidden and inert so offscreen links/video controls are removed from reading/focus order. Neighbor pointer targets are redundant with the accessible numbered controls and arrows. There is no automatic focus jump when selecting a slide.

Reduced-motion CSS removes perspective/transitions and hides inactive cards while retaining the same controls/content. This media-rule behavior was reviewed in source; an OS-level reduced-motion browser session and dedicated screen-reader testing were not performed. Touch swipe direction/cancellation were tested with synthetic pointer events; a physical touchscreen was not tested.

Local browser review covered 1440px desktop, 768px tablet measurements, and 390px/320px mobile. Reviewed desktop depth, filter states, case links and return navigation. At 320/390/768/1440 widths the reviewed page did not overflow horizontally. Mobile computed perspective was none. Desktop navigation between two projects kept the stage height at approximately 678px and page scroll at 1128px in the checked viewport. Browser Back restored the MOS selection; the explicit case return link restored EPC + Tender-to-Quotation. These are targeted observations, not universal layout or performance guarantees.

## Performance observations

CSS owns animation; handlers do not read layout or update state on each pointer move. Memoized cards reuse centralized project objects; the active-state change chiefly affects the old/new active card and CSS position styles. One grid row reserves the largest card height in a sector so neighboring/active transitions do not resize that stage. Real media has reserved slots and lazy loading/preload boundaries. Current posters require no image/video requests. No continuously promoted layers or will-change allocations were added.

No FPS, Core Web Vitals, CPU/GPU profiling or field CLS score is asserted. Actual screenshot/video weight still needs measurement when real assets arrive. The shared grid can reserve some empty space on mobile to keep all sector cards readable and stable; the page remains vertically scrollable.

## Checks actually run

- TypeScript typecheck: PASS.
- Vitest: PASS, 8 files / 63 tests (58 previous + 5 new gallery tests). New coverage: active/inert slide isolation, indicator links, touch/vertical/cancel/wheel behavior, controlled selection, validated URL pairs, lazy screenshot slots, video preload and pause.
- ESLint: PASS, 0 errors; same 6 pre-existing fast-refresh warnings in UI primitives.
- Vercel build: PASS; existing tsconfig-path plugin suggestion remains.
- verify:vercel: PASS for homepage, projects, samples, design-system and all ten case studies; unknown routes 404; safe inquiry readiness/invalid POST checks. Added SSR selected-project/return URL assertions pass. No email was sent.
- git diff --check: PASS.

Initial implementation type errors around optional router search inputs were corrected using TanStack’s SearchSchemaInput input contract. The first artifact check exposed a newly introduced default-query redirect on `/`; default-search stripping fixed it and `/` again returns 200. No unresolved introduced check failure remains. Default Cloudflare build was not rerun in this phase.

Stopped at Phase 3. Real media approval, wider assistive-technology/device testing and profiling with final assets remain follow-up work; no later-phase features were implemented.
