# Design and technical quality audit

31 October 2026 · Baseline `9b5705bf15c6e49ac66413efa360e0130148864e` · documentation only.

## Assessment basis

The application exists inside `five-scene-homepage-story.zip`. File references below are archive-relative. This audit evaluates source, content, layout rules, interactions, configuration and supplied assets. Two key image plates were directly inspected: the factory aisle and completed building. A rendered browser/device review has not been completed; observations about layout risks are identified as such, not presented as measured visual defects. Actual command results are recorded below. No production URL was supplied or found in repository metadata.

## Executive assessment

This is more distinctive than a default SaaS landing page. Its charcoal/paper/copper palette, condensed industrial typography, technical drawings and varied work presentations form a credible direction worth retaining. It already has the five requested industry scenes, individually designed project showcases and unusually useful distinctions between delivered, pilot, development and planned capabilities.

It is nevertheless a **demonstration of an intended portfolio**, not a launch-ready consulting site. The strongest weakness is missing evidence: illustrated dashboards, generic descriptions, empty video slots and a portrait placeholder outweigh real artifacts. A second weakness is pacing: multiple full-length scroll narratives compete for attention before the visitor reaches a working inquiry path—which is currently absent.

## Design dimensions

| Dimension | Evidence and assessment | Recommended direction |
|---|---|---|
| Visual hierarchy | `Cinematic.tsx` uses large h2 copy; `Work.tsx` reaches 14rem display type; MOS reaches 26rem. Most sections demand hero-level emphasis; home has no h1 | One clear introductory h1 about Swayam's work; subordinate chapter headings; prioritize verified work over planned platforms |
| Typography | `styles.css`: Big Shoulders Display, Geist, Geist Mono; display line-height .88; labels 11px with .14em tracking, often overridden to 8.8–10px | Retain the industrial display face, but enlarge essential labels and status information. Load only used weights; `font-light` is requested where display font only loads 700/800 |
| Spacing | Repeated py-32/py-28 and very tall cinematic tracks; roomy desktop rhythm but extreme cumulative length | Keep generous editorial spacing at key moments; shorten repeated capability blocks and move detailed narratives into case studies |
| Color system | Centralized OKLCH charcoal/paper/steel/copper tokens and dark sections are coherent | Retain palette; verify copper/steel small-text contrast and text over images. Do not assume named tokens imply sufficient contrast |
| Composition | Factory aisle has strong central perspective; building has a dramatic low-angle facade. Case studies reuse atmosphere as hero evidence | Keep atmosphere for chapter-setting. Use actual software screenshots, annotated records and approved drawings to demonstrate the work |
| Navigation | `Nav.tsx` has fixed blend-mode styling, Work/Expertise/About/Contact at md+, only identity and Let's talk below md | Provide an accessible mobile menu and clear industry/work access. Ensure predictable contrast and visible focus across changing backgrounds |
| Project presentation | Five flagships get bespoke displays, while `/work/$slug` repeats the same eight blocks and empty demo panel | Preserve varied summaries; make each detail page evidence-specific with role, constraints, scope, artifacts, outcomes and context-sensitive CTA |
| Motion | Hero 700vh; MOS 900vh; Engineering 600vh; Tender 520vh; Production adds five md:min-h-[80vh] narrative steps | These declared tracks total 2720vh before Production and surrounding content; this is CSS arithmetic, not measured scroll time. Reserve long motion for one story, make other demos visitor-driven |
| Responsiveness | 12-column grids, clamp type, md/cine breakpoints, svh mobile scenes and static motion fallbacks; MOS/Production/BOQ tables require 860/540/640px minimum widths | Keep controlled table scrolling but provide compact readable summaries and clear overflow affordances. Test 320px, zoom, landscape and tablet layouts |
| Professional credibility | Honest sample labels and capability statuses; unresolved verification notes, pending contact/portrait and patent assertion without source link | Verify every release claim; publish fewer complete case studies first. Verify patent attribution/publication before presenting it as authority |

## What feels templated

- `README.md` remains generic Lovable onboarding; it contains no operational instructions for this actual repository packaging or deployment.
- The unused shadcn catalog and broad dependencies are scaffold residue. Their presence alone does not make the visible design generic or inflate production bytes.
- `AboutContact.tsx` uses broad consultant copy and “Let's build something that actually works.” Replace it with a specific invitation tied to operational bottlenecks and the engagement process.
- `/work/$slug` applies a universal eight-section template even to planned concepts and research. Repeated pending-media boxes reduce trust rather than adding depth.
- Dashboard chrome, sample status bars and repeated capability lists can look like invented SaaS products if separated from their sample/planned labels. Keep the labels adjacent and show actual evidence early.

There is no basis to claim this site currently uses standard gradient blobs, pricing tables, testimonial carousels or rounded-card grids. Its actual direction is editorial and industrial; preserve that originality.

## Section decisions

| Section / actual file | Decision | Concrete change after approval |
|---|---|---|
| Navigation — `site/Nav.tsx` | Redesign behavior; retain identity | Mobile menu, industry access, clear consultation CTA, stable contrast; retain semantic navigation |
| Five-scene story — `site/Cinematic.tsx` | Retain concept; redesign pacing and initialization | Shorter story, selectable chapters, static-first layout and a direct evidence path; commission consistent plates before more effects |
| Illustrative UI — `site/IntelligenceUI.tsx` | Retain as labeled concept | Replace with real product media where available; fix mobile grid columns that still reserve hidden stage tracks |
| Work index — `site/Work.tsx` | Retain; reprioritize | Lead with strongest verified delivered/pilot work, not automatically MOS in development; distinguish concepts from completed work |
| MOS — `site/work/MOS.tsx` | Retain architecture, redesign interaction | Replace 900vh automatic tour with department buttons and one sample job handoff; make planned architecture label prominent |
| Production — `site/work/Production.tsx` | Retain and prioritize if evidence confirms pilot | Add real screenshots and narrative evidence; optional user-selected steps; consistent reduced-motion behavior |
| Engineering — `site/work/Engineering.tsx` | Retain SVG explanation | Add bounded parameter/step interaction and actual output examples; keep illustrative values distinct from engineering calculations |
| Tender — `site/work/Tender.tsx` | Reduce homepage presence | Summarize as planned/developing; move full sample walkthrough to detail/explorer. “Send for approval” must not impersonate a working control |
| BOQ — `site/work/BOQ.tsx` | Retain interactive foundation; complete it | Accessible stepper/tabs, source links, working review decisions and reset; keep synthetic data disclosure |
| Specialized — `site/work/Specialized.tsx` | Retain concise list | Remove decorative cursor-following preview if it cannot show useful evidence; support focus previews if retained; avoid per-pointer React updates |
| Research — `site/work/Research.tsx` | Retain as secondary credibility | Verify publication and contribution; link to evidence; maintain research/clinical limitations and avoid distracting from industrial consulting |
| About — `site/AboutContact.tsx` | Redesign proof and copy | Professional portrait, verifiable experience and clear role; remove the public dashed placeholder |
| Contact — same file | Replace prototype behavior | Real validated delivery, pending/error/retry states and verified email/LinkedIn; describe next step after inquiry |
| Case studies — `routes/work.$slug.tsx` | Retain routes; redesign content/media | Actual deliverables and specific constraints; omit empty sections rather than publishing “pending” boxes |

Remove public placeholders before launch, not honesty disclosures. Do not remove an inconvenient “Planned” status to make a prototype appear completed.

## Accessibility and mobile detail

1. Preserve native headings, links, labels and focus order independently of scroll effects. Home needs a meaningful h1. CaseStudy's Block titles should be headings.
2. BOQ `role=tab` alone is incomplete: add associated tabpanels, IDs, roving tabIndex, arrows/Home/End and orientation semantics, or simplify to ordinary step buttons with a named content region.
3. BOQ review labels are spans; they must become actual buttons if presented as actions. Tender approval text has the same expectation problem.
4. Display data as semantic tables where row/column relationships matter. Current dashboard and BOQ tables are grids of div/span elements.
5. Desktop cinematic copies are translated outside visual clipping but remain in the accessibility tree. Expose a single logical narrative and hide decorative duplicates, without hiding essential copy.
6. Reduced-motion behavior must include Production's opacity/translation, BOQ's CSS animation and hover translations—not only GSAP sections. Stop hidden/offscreen video and offer pause for any persistent motion.
7. Mobile navigation hides every section link except contact. Five static full-viewport scenes still require considerable travel; offer an early work/industry shortcut.
8. Check body/footer nowrap behavior, Work's three-column index, small labels, scrollable previews, tablet-height clipping and form focus borders at 200% zoom. These are source-based risk areas pending browser confirmation.

## Performance and reliability detail

The archive's JPEG bytes are measured disk size, not initial transfer size or LCP. Multiple overlapping image elements sit near the viewport, so lazy attributes alone do not guarantee staged loading. No responsive variants or width-dependent sources exist. Case-study heroes reuse scene assets; real product media must be separately budgeted.

The hero and `useCine` import GSAP after hydration but before determining eligibility. Treat the semantic page as the baseline, use eligibility checks before import, and defer nonessential showcases near viewport/interaction. CSS-driven cinematic positioning currently assumes successful JavaScript; a failure-safe readiness switch is more urgent than additional visual effects.

Use React for selected scene state; update continuous progress and pointer-following transforms outside React. Restrict `will-change` to active transitions. Profile clipping/painting on actual devices before replacing masks or claiming GPU acceleration. Font preconnects are present, but three external families add requests; evaluate self-hosted subsets with the correct licenses.

The sole routing test only checks that `/` matches a non-root route. It does not render the page, execute loaders, validate case studies, exercise forms or test motion. A passing result would not establish product readiness.

## Validation record

Validation ran against an unchanged temporary extraction, not the repository root. Node reported `v22.23.2`, npm `10.9.8`; Bun was initially unavailable. An ephemeral npm-exec Bun runner was used to install the actual frozen lockfile. No formatting, lint autofix, application edits, remote push or deployment was performed.

| Check | Actual result |
|---|---|
| `git ls-remote <repo>` | Passed after network permission; HEAD/main = baseline commit |
| Fetch and checkout | Passed; origin/main connected |
| `unzip -t five-scene-homepage-story.zip` | Passed: no compressed-data errors |
| Archive inventory | 100 entries; root application source absent outside ZIP |
| Image inspection | Six JPEGs, all 1920×1088; 2,336,862 bytes combined |
| Initial `npm install --ignore-scripts --package-lock=false --no-audit --no-fund` | Environment failure: Homebrew Node dependency `libsimdutf.34.dylib` missing. Retried using explicit NVM Node/npm paths |
| Explicit npm install, sandboxed | Registry DNS ENOTFOUND; retried with network permission |
| Explicit npm install, network enabled | Failed inside npm dependency resolution: `Cannot read properties of null (reading 'edgesOut')`; not a demonstrated application error |
| `bun install --frozen-lockfile --ignore-scripts` via temporary npm-exec runner | Passed using Bun 1.4.4; 517 packages installed. Original bun.lock and all archive files remained byte-identical |
| `node node_modules/typescript/bin/tsc --noEmit` | Passed, exit 0 |
| `node node_modules/vitest/vitest.mjs run` | Passed: 1 test file, 1 routing test; reported duration 2.33 seconds |
| `node node_modules/eslint/bin/eslint.js . --format json --output-file /tmp/swayam-eslint.json` | Failed, exit 1: 285 `prettier/prettier` errors across 18 files, 6 `react-refresh/only-export-components` warnings; no other reported rule categories |
| `node node_modules/vite/bin/vite.js build` | Passed client, SSR and Nitro build, exit 0; Cloudflare module output generated |
| Build warnings | Vite reports native tsconfig path support makes vite-tsconfig-paths redundant; Nitro/Rolldown reports inlineDynamicImports ignored with codeSplitting. Do not change the wrapper blindly |
| Local dev start | Failed to bind 127.0.0.1:5173 with sandbox EPERM. No running preview was established |
| Browser preview | Browser origin permission gate declined access to localhost. No alternative browser/permission workaround attempted; visual/device QA remains pending |
| Source integrity after validation | All 100 original archive entries compared byte-for-byte with the extraction: no differences; tracked repository diff empty; only requested docs untracked |

Production build reported these **artifact sizes**, not runtime performance measurements: main index JS 355.19 kB (113.15 kB gzip); routes JS 68.40 kB (17.00 kB gzip); GSAP 69.60 kB (27.29 kB gzip); ScrollTrigger 42.75 kB (17.54 kB gzip); CSS 92.23 kB (16.18 kB gzip). Shared JS is 3.73 kB and case-study JS 4.18 kB. This confirms separate motion chunks, but does not establish which assets load on each device or prove a waterfall/performance budget pass.

The six Fast Refresh warnings occur in UI kit `badge.tsx`, `button.tsx`, `form.tsx`, `navigation-menu.tsx`, `sidebar.tsx` and `toggle.tsx`. Formatting-only lint failures still block the declared lint command; normalize them in a separate implementation change after approval.

No rendered-browser, accessibility-tool, vulnerability-audit, Lighthouse, FPS, production route-status or field analytics result is claimed. Development-server binding was not retried after browser permission was declined; the remaining documentation work did not require it.
