# Architecture assessment — Swayam Singh portfolio

Audit date: 31 October 2026. Repository: https://github.com/swayams13/swayam-portfolio-updated. Baseline commit: `9b5705bf15c6e49ac66413efa360e0130148864e`.

## Scope and evidence

The remote is connected as `origin`, with local `main` tracking `origin/main`. The baseline contains **one ZIP**, `five-scene-homepage-story.zip`, not a checked-in application source tree. Its 100 entries were inventoried and extracted unchanged to `/tmp/swayam-portfolio-audit` for inspection and validation. All `src/`, configuration, and asset references in these documents refer to paths **inside that archive**. No application code, archive content, dependency declarations, or remote commits were changed.

Archive SHA-256: `e56abc307e440266e0420b2a6798443c6e963d960c7476ca310470769b540ba2`.

This distinction matters: a standard deployment pointing at the repository root cannot find `package.json`. The README's clone/install instructions do not work for this packaging. Source extraction into version control is a proposed implementation task, not something performed during this audit.

## Executive decision

**Retain TanStack Start, React, TypeScript, Tailwind and GSAP.** This is already a server-rendered React application with typed routes, case-study URLs and browser-only motion initialization. The proposed experience does not require Next.js or a full WebGL engine. The primary work is credible content, reliable operation, usable navigation and restrained motion—not framework replacement.

## Current architecture

| Area | Actual implementation |
|---|---|
| Framework | TanStack Start `1.168.60`, React/React DOM `^19.2.0`; not Next.js |
| Build | Vite `8.1.5`, `@lovable.dev/vite-tanstack-config` `2.26.5`; its wrapper supplies React, Tailwind, Start, Nitro and aliases |
| Server | `src/server.ts` dynamically loads Start's server entry and normalizes catastrophic SSR failures |
| Request lifecycle | `src/start.ts` error middleware and CSRF middleware restricted to server functions |
| Router | `src/router.tsx` creates router and QueryClient; scroll restoration enabled; generated `src/routeTree.gen.ts` |
| Root shell | `src/routes/__root.tsx`: HTML/head/scripts, QueryClientProvider, Outlet, 404 and recoverable error UI |
| Pages | `/` plus `/work/$slug`; 10 project entries feed the dynamic route; unknown slug throws `notFound()` |
| Styling | Tailwind 4, `src/styles.css` OKLCH tokens, dark section theme, display/label utilities, `cine:` media variant; no separate Tailwind config |
| Motion | GSAP `^3.15.0` and ScrollTrigger; CSS transitions and `tw-animate-css`; IntersectionObserver in Production; no Three.js or Framer Motion |
| State | Local React state for chapter/progress, BOQ stage, hover preview and contact status; refs for timelines; Query provider exists but no application query fetching was found |
| Data | Typed static `src/lib/content.ts`: scenes, plates, five flagships, four specialized projects, one research project |
| UI kit | 46 shadcn-style files in `src/components/ui`; Radix primitives; current site components do not import this kit |
| Assets | Six JPEGs under `src/assets`, each 1920×1088; combined 2,336,862 bytes (~2.23 MiB), plus favicon and robots.txt in `public` |
| External services | Google Fonts; optional Lovable error-reporting globals; no lead delivery, database, CRM, conversion analytics or live extraction integration found |
| Deployment | Production build confirmed Nitro `cloudflare-module` and generated Wrangler configuration with worker name `tanstack-start-ts`. No explicit provider account, domain, deployment workflow or Wrangler config in the source archive; actual deployed environment is unverified |

### Component hierarchy

```text
server.ts → TanStack Start → start.ts middleware → router.tsx
  __root.tsx (HeadContent / Scripts / QueryClientProvider / Outlet)
    / → index.tsx
      Nav
      Cinematic → Plate / Copy / IntelligenceUI
      Work → flagship index
        MOS → dashboard modules / flow SVG / architecture
        Production → five illustrative product views
        Engineering → SVG drawing / four output panels
        Tender → source / specification / review / quotation
        BOQ → five stage selector / sample document and table
        Specialized → linked list / atmospheric hover previews
        Research → MedPulse / method figure
      About / Contact
    /work/$slug → loader lookup → CaseStudy → related links / CTA
```

`work/shared.tsx` supplies metadata, status, capability grouping, CTA links, sample labels, frames and bars. It is a useful reusable boundary. `useCine.ts` encapsulates dynamic GSAP imports and matchMedia cleanup for MOS, Engineering and Tender. Cinematic independently duplicates the lifecycle. Production independently uses IntersectionObserver and CSS transitions.

### Content and contact behavior

Projects have six allowed status labels and four capability states. Preserve this honesty model. `bySlug()` uses a non-null assertion and assumes internal slugs always exist; public case-study lookup correctly handles absence. Project architecture arrays describe the showcased systems, **not verified implementations of those products**.

`AboutContact.tsx` uses native required/email/maxLength validation. Submit prevents the default request and sets local `sent=true`; it never sends data. The resulting status explains that delivery is not connected, but only after the visitor fills the form. Email and LinkedIn remain text placeholders. There is no persistence, error/retry flow or server-side lead validation.

### Dependency assessment

Runtime declarations also include TanStack Query, React Hook Form/resolvers, Zod, Lucide, Recharts, date-fns, react-day-picker, Embla, cmdk, OTP, resizable panels, Sonner, Vaul, clsx, class-variance-authority and tailwind-merge. Most serve the scaffolded UI kit rather than the current site. Installed dependencies are not equivalent to shipped bundle bytes; measure tree-shaken output before attributing performance cost.

Tooling includes TypeScript `^5.8.3`, ESLint 9, Prettier 3, Vitest 4, Testing Library, jsdom 20, React Vite plugin, Nitro `3.0.260603-beta` and a Rolldown override `1.2.1`. Start, Router and router-plugin use different pinned patch/minor versions; compatibility needs validation, not an automatic upgrade. Nitro's beta and the opaque Lovable wrapper increase deployment coupling. `bun.lock` is the only lockfile, while README recommends npm. No package-manager/runtime version pin or CI configuration is present. `bunfig.toml` has a minimum release-age guard; preserve it when choosing the reproducible install path.

Validation subsequently confirmed a frozen Bun 1.4.4 install of 517 packages, successful TypeScript check, one passing test and a successful production build. Thus the pinned framework combination has no demonstrated compile/build incompatibility in this environment. Lint fails on 285 Prettier violations and six Fast Refresh warnings. Full browser/runtime compatibility and dependency advisories remain unverified. Generated asset headers use a one-year immutable cache for `/assets/*`; this is not proof of deployed security headers.

## Technical findings

| Priority | Finding and evidence | Consequence / action |
|---|---|---|
| Critical for release | Archive-only root | Establish a normal source tree and reproducible build before deployment |
| Critical for release | Contact only changes local state, `AboutContact.tsx` | Qualified inquiries are not delivered; connect verified server delivery before launch |
| High | Desktop layouts activate in CSS before GSAP initializes; `Cinematic.tsx`, MOS and Engineering position multiple layers absolutely | Slow/failed JS can show overlapping copy/plates/panels. Static DOM must be the default; enable cinematic layout only after successful initialization |
| High | GSAP async imports lack catch/fallback in `useCine.ts` and Cinematic | Module failure has no local recovery; retain readable content and report a sanitized error |
| High | Motion fallback inconsistent: Production uses `md:` sticky/opacity behavior and BOQ has unconditional slide/fade classes | Reduced-motion users still receive animated transitions; use one shared preference policy and static content mode |
| High | BOQ tab roles lack roving focus, arrow-key behavior, panel association; review actions are spans | Implement a complete accessible tabs pattern or use ordinary step buttons; make actions functional or clearly illustrative |
| High | Homepage has no h1; case-study Block titles are paragraphs; inactive cinematic copy remains semantic text | Provide meaningful heading hierarchy and one accessible narrative, independent of visual layers |
| Medium | All Work showcases are statically imported; `StatusTag` is re-exported through Work into the case-study route | Inspect chunk graph; import shared primitives directly and defer heavy demonstrations without losing SSR summaries |
| Medium | Cinematic sets React progress state on every ScrollTrigger update; Specialized updates state on pointer movement | Prefer refs/GSAP transforms for continuous visuals; React state only for meaningful discrete changes |
| Medium | GSAP imports execute before checking motion/viewport eligibility; all plates have permanent will-change | Avoid unnecessary downloads/texture promotion; schedule assets and animation resources by actual need |
| Medium | Six desktop-sized JPEGs, no srcset/sizes or mobile crops | Add responsive formats and art-directed crops; visible lazy layers may still load together |
| Medium | No canonical URL, og:image, og:url, sitemap or structured identity data | Add after canonical domain and verified identity are known; retain current per-route title/description |
| Medium | `error-capture.ts` wraps global console.error and stores one last error per process/isolate | Concurrent requests can misattribute diagnostics. Prefer request-correlated logging; redact PII before future lead processing |
| Medium | Prototype video API uses looping autoplay rather than scroll seeking | Adding a video URL does not implement an image sequence or a synchronized camera move |
| Medium | `ASSET_MANIFEST.md` references absent scene-04-realestate.jpg and outdated status categories/four projects | Reconcile manifest with six real files and ten projects; establish one content/asset contract |
| Medium | CaseStudy always renders a pending demonstration box despite media model | Real videos/screenshots must have a proper renderer and empty-state policy |
| Low | Large sample-data/markup/timeline components; many casts/non-null assertions | Extract only cohesive media, fixture and interaction units; runtime-check content references and validate data schema |

Security positives: React text rendering, no submitted data persistence, native constraints, server CSRF middleware, generic user-facing errors. No obvious credential was identified in reviewed application/configuration files; this is not a complete secret-history or dependency-vulnerability certification. The unused chart primitive inserts generated CSS through `dangerouslySetInnerHTML`; keep any future config trusted. No exploit is established by its presence. Provider security headers and production telemetry cannot be verified from this archive.

Accessibility positives: `lang=en`, named primary nav and sections, skip-to-work link, focus-visible style, decorative empty image alts, native form labels, status announcement and motion-aware static hero. These do not establish WCAG compliance. Contrast over imagery/blended navigation, focus visibility, reflow, table semantics and screen-reader reading order require rendered checks.

## Recommended target architecture

Keep SSR routes and a lightweight content-first page. Evolve the existing modules rather than rebuilding the application:

1. **Content layer:** preserve typed project/status data; add industry IDs, evidence provenance, role, verified outcomes, media kind and explicit demonstration state. Split content files only as they become difficult to maintain. No CMS needed initially.
2. **Presentation layer:** shared navigation, typography, project metadata, real media renderer, case-study layout and accessible form controls. Server-render the core positioning, evidence, summaries and inquiry route.
3. **Experience layer:** a shared motion controller plus independently loaded Cinematic and Industrial Explorer. Static semantic content remains usable without animation, canvas, JS or successful asset fetches.
4. **Interaction layer:** local state/reducers for deterministic sample workflows; URL parameters for industry/project selections when shareability helps. No Redux/global store required.
5. **Server boundary:** a small validated contact server function or endpoint, provider adapter and minimal delivery observability. Secrets stay server-side. No industrial production system connection is required for the portfolio.
6. **Delivery layer:** select and validate the actual supported host, explicit runtime/package manager, clean install/build checks and preview deployment. Keep Lovable history intact; never force-push its connected branch.

Possible future folders: `components/experience/`, `components/explorer/`, `components/case-study/`, `lib/content/`, and server-only inquiry modules. These are proposed boundaries, not files created by this audit.

## Five-scene cinematic feasibility

The current implementation already follows A: layered stills, masked reveals, scale/translation and DOM/SVG. Its desktop track is 700vh. Manufacturing → wireframe → construction → completed property → intelligence is present. It is a 2D illusion, not real camera navigation. Scene video and plate video fields are separate; the mobile renderer currently uses images only.

| Option | Visual quality | Complexity and assets | Mobile / loading | Accessibility and maintenance | Fit here |
|---|---|---|---|---|---|
| A. GSAP + layered images | Strong art direction, convincing depth/reveals; cannot produce arbitrary 3D parallax | Low–medium; matched stills, masks, crops and a storyboard | Lowest relative cost; responsive images and staged decoding; static mobile posters | HTML narrative and simple fallback; easiest assets to replace | **Recommended first release**, builds directly on current code |
| B. GSAP + rendered sequences | High, deterministic materials/lighting and camera continuity | Medium–high; shared 3D scene/camera, frame export, compression, manifest, canvas frame scheduler | Potentially heavy transfer and decoded memory; bounded frame window, cancellation, resolution tiers; posters on constrained devices | Canvas needs DOM equivalents; camera edits require rerendering | Optional enhancement after one transition proves worthwhile |
| C. Three.js realtime scenes | True interactive camera, object inspection and dynamic light; premium quality depends on skilled production | High; optimized models, textures, lighting, LOD, renderer lifecycle and input design | GPU/battery/thermal costs, context loss, device variation; model/texture loading | Separate accessible controls and fallback; ongoing GPU/resource maintenance | Unjustified for five authored scroll chapters |
| D. Sequences + interactive WebGL | High authored cinema plus selective spatial inspection | Highest integration cost; both B and C pipelines and synchronization | Two resource pipelines; never load both eagerly; mobile defaults to static/DOM | Most failure modes and maintenance; independent fallbacks required | Reserve for one proven spatial use case, not baseline |

These are engineering estimates, not benchmark results. An uncompressed 1920×1088 RGBA frame is ~7.97 MiB; 120 decoded frames would approach 956 MiB before other overhead. Download compression does not eliminate decoded-memory cost. Never preload an entire high-resolution sequence by default.

### Recommended implementation design

Use A, with five semantic chapter records and a shared motion lifecycle. Establish a static first paint, then initialize on capable desktop devices that allow motion. Enhance the layout only after essential assets decode. Render copy and CTAs in HTML, not canvas. Make skip, chapter selection and direct work navigation always available. Avoid mandatory smooth-scroll libraries or scroll hijacking.

Storyboard: factory aisle → matching engineering linework; engineering → structural frame as an intentional editorial transition; construction → completed building from the same camera; facade grid → actual software workflow. Do not promise geometric morphs between unrelated generated images. Asset production and continuity will determine the premium result more than adding libraries.

If A cannot satisfy the approved camera transition, prototype B for **one** short passage. Map scroll to a clamped frame index; draw through requestAnimationFrame only when the index changes; decode a bounded nearby window; cancel on unmount; cap rendering resolution; use posters on failure, reduced motion and constrained devices. Keep sequence code out of the initial route payload. Do not introduce WebGL unless users need spatial selection or inspection that SVG cannot explain.

GSAP matchMedia collects and reverts animations for changing media conditions ([official documentation](https://gsap.com/docs/v3/GSAP/gsap.matchMedia/)). ScrollTrigger owns scroll synchronization ([documentation](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)). Three.js requires deliberate GPU resource disposal ([cleanup](https://threejs.org/manual/pages/cleanup.html)) and render-size handling ([responsive design](https://threejs.org/manual/pages/responsive.html)). TanStack Start already supplies the full-stack React foundation required here ([overview](https://tanstack.com/start/latest/docs/framework/react/overview)).

## Industrial Explorer architecture

Build a small interactive React feature with an industry selector, a diagram or workflow, a details panel, evidence links and a contextual inquiry CTA. Use structured fixture data, a reducer for transitions and reusable native controls. Keep sample data isolated from real project claims. No visitor account, production credentials or upload service is needed.

| Interaction | Actual interactive UI | Simulated behavior | 3D value |
|---|---|---|---|
| Manufacturing hotspots | Keyboard-operable buttons on SVG or a photo with an equivalent list; select production/QC/procurement details | Sample job state and operational narrative | Optional equipment geometry inspection only; photo/SVG suffices for workflow explanation |
| MOS departments | Accessible department selector, shared sample job, traceable handoff panel | Deterministic BOM → procurement → production → QC scenario; visibly mark planned capabilities | None for department relationships |
| Engineering workflow | Select parameters, highlight dimensions in the existing SVG, inspect BOM/output relationships | Predefined reviewed examples; no claimed engineering-certified calculation service | Optional rotation/exploded assembly if it clarifies geometry |
| BOQ extraction | Functional edit/accept/reject actions, validation state, source highlighting, reset | Bundled sample document and deterministic extraction; no live AI or document uploads initially | None |
| Industry discovery | Filtered problems, relevant projects/status and contextual CTA; selection reflected in URL if useful | No AI advisor needed | None |

“Real components” means working selection, review, validation and keyboard behavior in this portfolio; it does not mean connecting to a client's production software. Reuse real product UI only with permission and a sanitized adapter/fixture boundary. Sample calculations and documents must remain explicitly illustrative. Give every demo a reset, textual explanation and equivalent non-motion path.

## Conversion architecture

Route visitors from **industry/problem → relevant verified case study → optional demonstration → project inquiry → acknowledged delivery → human qualification**. Keep the homepage concise enough that the cinematic is an invitation, not a gate.

- Add industry choices to desktop and mobile navigation; initially link to meaningful filtered sections. Create separate industry routes only when there is enough distinct evidence/content.
- Case studies need actual problem, Swayam's role, constraints, delivered scope, artifacts, implementation status, verified outcome or qualitative evidence, and a contextual consultation CTA. Do not publish fabricated impact numbers.
- Keep name, email, company, industry and challenge. Add optional timeline/current workflow only if it helps qualification; defer budget questions until useful. Prefill project/industry context, allow correction and preserve input on error.
- Use a small optional workflow diagnostic: industry → bottleneck → current tools → suggested relevant case study. Do not gate results behind email or claim to perform an AI audit.
- Implement server validation, length limits, rate limiting, accessible errors, duplicate-submit protection and an idempotency strategy. Report success only after the delivery provider accepts the message; verify inbox receipt in staging and distinguish acceptance from actual delivery. Keep an accessible direct-email fallback.
- Explain purpose/retention near the form, select appropriate privacy/consent behavior for the deployed audience and keep free-text inquiry content out of analytics. No CRM automation or newsletter is required for launch.

Minimal events: `industry_selected`, `case_study_viewed`, `demo_started`, `demo_completed`, `consultation_cta_clicked`, `inquiry_started`, `inquiry_validation_failed` (field code only), `inquiry_accepted`, `inquiry_failed` (sanitized error class). Attach only project/industry/source identifiers, not email/name/challenge. Track acceptance server-side with deduplication. Separately record qualified inquiries manually; form completions are not qualified leads. Review the funnel to identify friction without treating scene completion as the business objective.

## Validation record

See the final validation section in DESIGN_AUDIT.md for executed commands and actual results. No Lighthouse score, Core Web Vitals, FPS or production conversion measurement is asserted by this audit.
