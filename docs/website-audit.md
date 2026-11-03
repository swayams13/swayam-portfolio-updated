# Website audit

Audit date: 2026-11-01 (Asia/Kolkata). Repository: swayams13/swayam-portfolio-updated. Baseline: `bd19d2c5a3a3987b55f137cd67f50a965489848f` (main). Local branch: `codex/website-audit`. Scope: documentation only; no redesign, route deletion, dependency changes, deployment or real inquiry submission. Existing AGENTS.md rules apply, including preserving Lovable history and capability honesty states.

## Architecture and inspected scope

React 19 / TypeScript, TanStack Start SSR and file-based TanStack Router, Vite 8.1.5, Nitro 3 beta. Bun 1.4.4 with committed `bun.lock`; Node 22.23.2 matches `.nvmrc` and package engine. No Next.js migration is justified. `vite.config.ts` delegates React, Tailwind 4, routing, aliases, Nitro and error tooling to Lovable's config; adding duplicate plugins would break the application.

`src/routes/__root.tsx` provides head, shell, QueryClientProvider, Outlet, error and 404 UI. `index.tsx` composes the homepage. `work.$slug.tsx` resolves ten content-driven briefs and rejects unknown slugs. `api.inquiry.ts` exposes GET/POST. `routeTree.gen.ts` is generated; do not edit manually. No other application routes, authentication, database, CMS or live AI integration were found. Specialized/research routes are linked through a collapsed homepage disclosure and related links: low discoverability, not orphaned routes.

Styling is Tailwind v4 plus a roughly 3,100-line global `src/styles.css`, semantic classes, CSS variables, repeated breakpoint blocks and later overrides. Root and `.dark` currently share the black palette. UI primitives in `src/components/ui/` are a broad shadcn-style Radix library; most are outside the active site's component graph. Animation uses dynamically imported GSAP/ScrollTrigger, CSS transitions, IntersectionObserver and custom hooks. No Three.js dependency is present.

`vercel.json` selects frozen Bun install and `build:vercel`; Nitro outputs `.vercel/output`, Node 22 runtime. Default `build` targets Cloudflare modules. `scripts/preview-vercel.mjs` and `verify-vercel.mjs` support local artifact checks. `.lovable/project.json`, Lovable config and optional browser error hooks establish editor integration. External services: Google Fonts; Resend server-only email; optional HTTPS booking URL. React Query is present but no business query integration was found. No tracked CI workflow exists.

## Ranked findings

| Severity | Finding and evidence | Recommendation |
|---|---|---|
| High | Delivery/pilot/Implemented labels in `content.ts` lack product source, outputs or acceptance evidence in this repository. | Keep claim versus verification separate; obtain artifacts before promoting delivered capability. |
| High | Live homepage shows email draft fallback; online inquiry delivery is unavailable. GET readiness alone cannot prove inbox receipt. | Configure server environment, verified sender and recipient; validate provider acceptance and mailbox receipt in a separate authorized delivery test. |
| High | Live first screen is title-only “Industry into intelligence.”; `Cinematic.tsx` lacks an explicit consulting offer and primary inquiry CTA; `Nav minimal` omits desktop contact action. | Next phase: put audience, offer and discovery action above the fold. |
| Medium | Public copy includes “Verify Before Publication”, “confirmed by Swayam before publishing”, and “Publication and attribution require verification” (`content.ts`, Research.tsx). | Resolve editorial tasks privately; retain factual public limitations and sample labels. |
| Medium | Repetition across workflow explorer, capabilities, industries, five project summaries, embedded demos, engagement and about; project context and final status repeat `statusNote`. | Shorten the homepage; preserve detailed scopes on existing briefs and demos in disclosures. |
| Medium | Black-only tokens contradict requested Editorial Contrast identity; many accumulated CSS overrides increase regression risk. | Introduce semantic ivory/ink/copper tokens and migrate one section at a time. |
| Medium | No canonical links, og:url, og:image, Twitter image, sitemap or structured data in source. Robots permits crawling but supplies no sitemap. | Add absolute per-route canonical/social metadata and sitemap using confirmed production origin. |
| Medium | Browser JS bundles include ~365.22 kB main +119.75 kB route JS; CSS 120.66 kB; GSAP+ScrollTrigger ~112.35 kB uncompressed. Six JPEGs total ~2.34 MB. | Measure loading, split demos on demand, size responsive images, audit unused font/CSS. These are build sizes, not measured Core Web Vitals. |
| Medium | Server limiter/idempotency maps are per process, not distributed; same-origin headers can be forged by non-browser clients. | Add host-level distributed abuse controls before scaling delivery. Keep bounded body, schema, honeypot, timeouts and idempotency. |
| Medium | Form only handles JSON through JS; native POST is form-encoded and fails API content-type checks; submit initially disabled without hydration. | Keep visible mailto fallback and consider progressive enhancement. |
| Low | Small labels (9–12 px), wide sample tables and complex SVGs need zoom, keyboard and screen-reader review. `useCine` imports GSAP before checking media eligibility. | Verify 320/360/768/1024/1440, 200% zoom, reduced motion and touch; gate animation imports earlier if beneficial. |
| Low | WorkflowDiagnostic is not mounted; IntelligenceUI is reached through ProjectEvidence. Legacy scene/plate manifests and archive are broader than the current hero. | Preserve inventory; consolidate only after reachability review. |
| Low | Six lint fast-refresh warnings; build plugin warning and Cloudflare code-splitting warning. | Isolate cleanup from redesign; no functional baseline failure established. |

No critical vulnerability or confirmed broken internal route was established. This is not a penetration test or a complete browser accessibility certification.

## Functionality, accessibility and links

Preserve Nav's native modal dialog, skip link, focus restoration, labeled form fields, field-level errors, live status messages, semantic tables, reduced-motion CSS and GSAP matchMedia cleanup. Industry buttons use pressed states and live updates. Decorative images correctly use empty alt. `useSectionReveals` starts with visible content and degrades progressively. Small labels, copper contrast on future ivory backgrounds, hidden demo focus, mobile menu focus and wide-table scrolling remain explicit manual QA targets, not confirmed WCAG violations.

Live browser inspection showed the black title-only opening and matching homepage content; “Connect all workflows” changed to Connected view and exposed the MOS link. Source/tests cover MOS department selection, production job/stage/owner views, engineering BOM input validation, tender predefined mapping, BOQ review/reset and rapid image switching. These controls demonstrate deterministic frontend state, not backend product functionality. The existing test suite provides interaction coverage; not every control was clicked live.

Known homepage nav targets: #work, #industries, #services, #about, #approach, #contact, #main-content and #top. Flagship IDs and `<slug>-demo` IDs exist; Work opens containing details when navigating to a demo hash. Case pages have #workflow, #demo and #architecture. Unknown slugs are rejected. No placeholder `href="#"` was identified in the inspected site controls. No external product/demo service link exists: labels should continue saying portfolio sample. Remaining keyboard and cross-browser behavior requires targeted QA.

## Inquiry architecture and security scope

Contact GETs `/api/inquiry` (8s timeout) for delivery availability/booking URL. Zod validates required name, company, email, industry, challenge plus optional workflow/budget/contact preference and honeypot. Missing configuration creates a local unsent draft with mailto/copy. Configured POST uses UUID request identity, JSON, 15s client timeout; server enforces same Origin, content type, 12KB body, strict schema, per-instance budgets, SHA-256 payload identity, deduplication and 10s provider timeout. Resend acceptance yields a reference; it correctly does not claim inbox delivery. No persistence or delivery webhook is implemented. Errors preserve entered fields. Booking is validated HTTPS or email scheduling.

`RESEND_API_KEY`, `CONTACT_FROM`, `CONTACT_TO`, `BOOKING_URL` are server environment names; never put delivery credentials in VITE variables. `.env.example` has empty key/from and a public business email. `.gitignore` excludes env/local/Vercel credentials. Signature scan of tracked text and all original ZIP members found no private-key, Resend-style, GitHub-style, AWS-access-key or Stripe-live token signatures. This limited scan does not establish the absence of secrets across history, hosting settings or arbitrary token formats. Optional Lovable error reporting and server stack logging warrant redaction review; no credentials were printed or changed.

## Baseline checks

Node 22.23.2, Bun 1.4.4 temporary npm runner, frozen lock install succeeded. Initial Homebrew npm/node runner aborted for missing simdutf dylib; resolved by prepending the existing nvm Node directory to PATH. This was an environment issue, not a repository failure.

| Check | Result before documentation |
|---|---|
| typecheck | PASS |
| lint | PASS, 0 errors / 6 pre-existing react-refresh warnings: badge, button, form, navigation-menu, sidebar, toggle |
| test | PASS, 6 files / 51 tests |
| build | PASS, Cloudflare modules; native tsconfig-path plugin suggestion and inlineDynamicImports/codeSplitting warning |
| build:vercel | PASS; native tsconfig-path plugin suggestion; final artifact regenerated sequentially |

No application code changed, so no new runtime regression was introduced by implementation. Build output is ignored. Build success is not production environment or email acceptance evidence. No Lighthouse/field CWV scores or exhaustive visual regression results are asserted.

## Reusable components and asset inventory

Reuse Nav, Contact, StatusTag/Ctas/shared sample primitives, ProjectEvidencePanel/EvidenceLabel, CrossfadeImage, IndustryJourney, WorkflowExplorer and all five work demos. IntelligenceUI is a static production evidence table. WorkflowDiagnostic is test-covered but not mounted; preserve it as an available local guide. AboutContact only re-exports Contact and defines About; it is not a duplicate inquiry form.

| Asset | Approximate bytes | Current meaning/use |
|---|---:|---|
| src/assets/scene-01-manufacturing.jpg | 335,610 | Illustrative factory; manufacturing scene and project media reference |
| src/assets/scene-01b-manufacturing-wire.jpg | 593,170 | Wireframe factory; engineering scene and expansion-joint media reference |
| src/assets/scene-02-engineering.jpg | 350,230 | Engineering concept; project media reference |
| src/assets/scene-03-construction.jpg | 282,540 | Construction illustration; construction scene / BOQ reference |
| src/assets/scene-03a-structure-wire.jpg | 491,050 | Wireframe structure; vendor concept reference |
| src/assets/scene-03b-completed.jpg | 284,240 | Completed building illustration; real estate scene |
| public/favicon.svg | small vector | Branded S monogram |
| public/robots.txt | text | Allows crawlers |
| docs/screenshots/*.jpg | historical QA captures | Prior versions, not product/client evidence |
| five-scene-homepage-story.zip | original source archive | Duplicates legacy source/assets; not an active route or runtime bundle |

No video files, real product screenshot sets, client logos, portrait or testimonial artifacts were found. Scene and case templates accept videos/screenshots for future insertion, but all project media.video/screenshots entries are empty. Preserve the original ZIP and historical docs now; do not mistake their legacy components or old design instructions for the current rendered architecture. Archive/download contents remain public repository material even though they are not copied into Vite's public output.

Vercel artifact verification passed after a sequential rebuild: homepage plus all ten project routes 200 with title/description; two unknown routes 404; inquiry GET no-store with only public fields; invalid POST 400. Delivery readiness false in the local unconfigured environment. No live email sent.

## Repository inventory

The following is the complete tracked baseline file inventory (including documentation, screenshot history, original archive and configuration). Generated outputs and node_modules are excluded.

```text
.env.example
.gitignore
.lovable/project.json
.nvmrc
.prettierignore
.prettierrc
AGENTS.md
README.md
bun.lock
bunfig.toml
components.json
docs/ARCHITECTURE.md
docs/ASSET_MANIFEST.md
docs/CINEMATIC_STORYBOARD.md
docs/DESIGN_AUDIT.md
docs/DESIGN_SYSTEM.md
docs/FOUNDATION_HANDOFF.md
docs/HERO_ARROW_MOTION.md
docs/IMPLEMENTATION_PLAN.md
docs/LAUNCH_PLAN.md
docs/MOTION_SYSTEM.md
docs/STEP1_HOMEPAGE.md
docs/STEP2_INTERACTION.md
docs/STEP3_EVIDENCE.md
docs/STEP4_INQUIRY.md
docs/STEP5_RELEASE.md
docs/WEBSITE_BRIEF.md
docs/screenshots/arrow-docked.jpg
docs/screenshots/arrow-start.jpg
docs/screenshots/arrow-travelling.jpg
docs/screenshots/black-homepage.jpg
docs/screenshots/clean-homepage-desktop.jpg
docs/screenshots/desktop-foundation.jpg
docs/screenshots/interactions-industry.jpg
docs/screenshots/interactions-mobile.jpg
docs/screenshots/interactions-production.jpg
docs/screenshots/mobile-foundation.jpg
docs/screenshots/step1-mobile.jpg
docs/screenshots/step1-work-desktop.jpg
docs/screenshots/step2-desktop.jpg
docs/screenshots/step2-mobile.jpg
docs/screenshots/step3-evidence.jpg
docs/screenshots/step4-contact.jpg
docs/screenshots/step5-desktop.jpg
docs/screenshots/step5-mobile.jpg
docs/screenshots/step5-tablet.jpg
docs/screenshots/tablet-foundation.jpg
eslint.config.js
five-scene-homepage-story.zip
package.json
public/favicon.svg
public/robots.txt
scripts/preview-vercel.mjs
scripts/verify-vercel.mjs
src/assets/scene-01-manufacturing.jpg
src/assets/scene-01b-manufacturing-wire.jpg
src/assets/scene-02-engineering.jpg
src/assets/scene-03-construction.jpg
src/assets/scene-03a-structure-wire.jpg
src/assets/scene-03b-completed.jpg
src/components/site/AboutContact.tsx
src/components/site/Capabilities.tsx
src/components/site/Cinematic.tsx
src/components/site/Contact.tsx
src/components/site/CrossfadeImage.tsx
src/components/site/HeroScrollArrow.tsx
src/components/site/IndustryJourney.tsx
src/components/site/IntelligenceUI.tsx
src/components/site/Nav.tsx
src/components/site/ProjectEvidence.tsx
src/components/site/Work.tsx
src/components/site/WorkflowDiagnostic.tsx
src/components/site/WorkflowExplorer.tsx
src/components/site/work/BOQ.tsx
src/components/site/work/Engineering.tsx
src/components/site/work/MOS.tsx
src/components/site/work/Production.tsx
src/components/site/work/Research.tsx
src/components/site/work/Specialized.tsx
src/components/site/work/Tender.tsx
src/components/site/work/shared.tsx
src/components/ui/accordion.tsx
src/components/ui/alert-dialog.tsx
src/components/ui/alert.tsx
src/components/ui/aspect-ratio.tsx
src/components/ui/avatar.tsx
src/components/ui/badge.tsx
src/components/ui/breadcrumb.tsx
src/components/ui/button.tsx
src/components/ui/calendar.tsx
src/components/ui/card.tsx
src/components/ui/carousel.tsx
src/components/ui/chart.tsx
src/components/ui/checkbox.tsx
src/components/ui/collapsible.tsx
src/components/ui/command.tsx
src/components/ui/context-menu.tsx
src/components/ui/dialog.tsx
src/components/ui/drawer.tsx
src/components/ui/dropdown-menu.tsx
src/components/ui/form.tsx
src/components/ui/hover-card.tsx
src/components/ui/input-otp.tsx
src/components/ui/input.tsx
src/components/ui/label.tsx
src/components/ui/menubar.tsx
src/components/ui/navigation-menu.tsx
src/components/ui/pagination.tsx
src/components/ui/popover.tsx
src/components/ui/progress.tsx
src/components/ui/radio-group.tsx
src/components/ui/resizable.tsx
src/components/ui/scroll-area.tsx
src/components/ui/select.tsx
src/components/ui/separator.tsx
src/components/ui/sheet.tsx
src/components/ui/sidebar.tsx
src/components/ui/skeleton.tsx
src/components/ui/slider.tsx
src/components/ui/sonner.tsx
src/components/ui/switch.tsx
src/components/ui/table.tsx
src/components/ui/tabs.tsx
src/components/ui/textarea.tsx
src/components/ui/toggle-group.tsx
src/components/ui/toggle.tsx
src/components/ui/tooltip.tsx
src/hooks/use-mobile.tsx
src/lib/content.ts
src/lib/error-capture.ts
src/lib/error-page.ts
src/lib/inquiry.ts
src/lib/lovable-error-reporting.ts
src/lib/useCine.ts
src/lib/useSectionReveals.ts
src/lib/utils.ts
src/routeTree.gen.ts
src/router.tsx
src/routes/README.md
src/routes/__root.tsx
src/routes/api.inquiry.ts
src/routes/index.tsx
src/routes/work.$slug.tsx
src/server.ts
src/server/inquiry.server.ts
src/start.ts
src/styles.css
src/test/app-routing.test.tsx
src/test/contact.test.tsx
src/test/evidence.test.tsx
src/test/foundation.test.tsx
src/test/inquiry-server.test.ts
src/test/interaction-demos.test.tsx
src/test/setup.ts
tsconfig.json
vercel.json
vite.config.ts
vitest.config.ts
```
