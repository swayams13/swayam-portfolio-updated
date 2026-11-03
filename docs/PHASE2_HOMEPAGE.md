# Phase 2 — Industry-led consulting homepage

Completed locally on `codex/website-audit`, 2026-11-01. Builds on the Phase 1 Editorial Contrast system. No framework/package changes, chatbot, Phase 3 3D renderer, contact hardening or deployment.

## Homepage experience

Seven sections: requested consulting hero and two CTAs; four-sector selector; selected-work carousel; intended business benefits; four-step engagement; concise consultant introduction; existing contact destination/form. EPC & Engineering appears explicitly in the hero navigation and selector. The hero composition is CSS geometry, not a new stock image or WebGL scene. Existing title/description/Open Graph metadata remains.

Industry navigation and the selector share page state. Manufacturing is the initial category, showing Production Intelligence first. Native buttons support Tab, Enter and Space; Left/Right/Home/End also select sectors and move focus. Selection updates use-case text, sector explanation, selected styling and project list together. A category change starts its carousel at the first valid project; clicking the active category retains its position. State is kept for this page session, not persisted to storage or URL. Changing projects does not scroll or move focus.

The standard carousel renders one project slide at a time with previous/next buttons, disabled boundary states, position/project announcements, slide labels and focusable region with Left/Right/Home/End navigation. No autoplay, drag library, wheel capture, scroll lock or required animation. Construction and Real Estate each have one relevant BOQ project, so both navigation buttons correctly disable. Hero anchors use ordinary browser navigation. Reduced-motion styling is inherited from Phase 1.

## Content and preservation

`consultingIndustries` in content.ts is the central relevance mapping. Multiple sectors may reference the same project. `homepageProjectPreviews` supplies concise business challenge/solution and preview type; all maturity badges come from the existing project status arrays. Homepage copy and intended-benefit categories live in `consultingHomepage`. No original project records/features/architecture/media were deleted or reclassified.

Preview renderer prefers an actual supplied project screenshot. Until approved screenshots exist, sample-based interface previews are explicitly labeled illustrative and never presented as client product captures. No results, deployments, customers or accuracy figures were invented. The intended-benefit section says these are not measured results. Real Estate copy explicitly says the BOQ example is not a deployed property platform. Homepage MedPulse wording is only a link to the research brief; no unverified patent publication/grant claim is added.

The old five project demonstrations and interactive workflow explorer are available on the additive `/samples` page. This keeps feature inventories/architecture out of the homepage while preserving working controls and source content. Project-page sample links now target `/samples#<slug>-demo`. Legacy explicit `/#<slug>` and `/#<slug>-demo` links are retained as client-side aliases to `/samples` with the same hash; the matching disclosure opens and the target scrolls into view. No ordinary page scrolling is intercepted. Without hydration, those legacy aliases cannot redirect; current project links point directly to the new page. All ten project pages remain, including supporting systems and MedPulse. Homepage supporting links expose the five specialized/research briefs.

The contact component, inquiry schema, server route and provider implementation are unchanged in this phase. Its direct email and explicitly unsent draft fallback remain. No online delivery or inbox receipt is claimed or tested with a real message.

## Phase 2 files

| File | Purpose |
|---|---|
| src/lib/content.ts | Add central sectors, project relevance, concise previews and homepage copy |
| src/components/site/home/ConsultingHomepage.tsx | Hero, sector controls, preview renderer, standard carousel, benefits, process and about |
| src/homepage.css | Responsive Phase 2 composition and lightweight hero styling |
| src/styles.css | Import the isolated homepage layer |
| src/routes/index.tsx | Compose seven sections, own shared industry state, preserve legacy demo aliases |
| src/routes/samples.tsx | Additive page preserving workflow explorer and five demos |
| src/components/site/Work.tsx | Support section ID; open explicit hash ancestors; route contact links to homepage |
| src/components/site/Nav.tsx | Align benefits navigation label with homepage content |
| src/routes/work.$slug.tsx | Only update sample destinations; no case-study rebuild |
| src/routeTree.gen.ts | Router-generated samples entry |
| src/test/homepage.test.tsx | Seven new behavior/contract tests |
| scripts/verify-vercel.mjs | Extend smoke coverage to samples and design-system routes |
| docs/PHASE2_HOMEPAGE.md | This handoff |

Prior Phase 0/1 work remains in the checkout; the table describes this phase, not the cumulative diff against original main.

## Validation actually run

- `typecheck`: PASS.
- `test`: PASS, 7 files / 58 tests (51 existing plus 7 new). Covers shared mapping validity, unchanged-filter stability, filter/list synchronization, single-item boundary states, keyboard/focus behavior, truthful preview/outcome wording, CTA hrefs and controlled hero-sector navigation.
- `lint`: PASS, 0 errors and the same 6 pre-existing fast-refresh warnings in dormant UI components.
- `build:vercel`: PASS, existing native tsconfig-paths plugin suggestion remains.
- `verify:vercel`: PASS; homepage, samples, design system and all ten case studies return 200 with metadata; unknown page/slug return 404; public readiness response and invalid inquiry POST checked without sending email.
- `git diff --check`: PASS.

Initial new test assertions incorrectly included aria-hidden arrows in accessible control names; corrected tests to use the actual accessible names. Existing 51 tests continued passing. Browser QA found a 6px selector overflow at 320px; fixed min-content grid sizing and label wrapping, then rechecked at 320px. No unresolved introduced test failure remains.

Local browser review: 1440×1000 desktop hero, 768×1024 tablet gallery, 390×844 mobile sector controls and 320×740 narrow layout. Document width matched viewport at reviewed sizes after the fix. Selected Construction/EPC/Real Estate, changed carousel slide, confirmed correct brief links and one-item controls. Verified the selected-work anchor destination and the legacy BOQ hash redirect to `/samples#boq-intelligence-demo` with its disclosure open. No real form submission. This was targeted browser QA, not exhaustive assistive-technology/cross-browser certification or a measured Core Web Vitals study.

## Remaining integration requirements

Phase 3 can replace `ProjectCarousel`'s renderer behind the same industry/project mapping and `ProjectPreview` boundary (`data-gallery-renderer="standard"`). Retain a standard DOM/keyboard fallback, status labels, focus behavior, case links, explicit slide navigation and reduced-motion operation. Do not replace relevance mapping with implied client deployments. No 3D dependencies were added now.

Supply approved product screenshots/walkthroughs with version, scope and publication permission; screenshots can populate existing `project.media.screenshots`. Keep authored delivery/pilot claims subject to the Phase 0 evidence register. Clinical/patent attribution verification remains there as well. Phase 6 will handle inquiry hardening and actual delivery activation separately. All original detailed content remains in case pages/source/samples. Homepage Phase 2 is complete; these later-phase integrations are not implemented here.
