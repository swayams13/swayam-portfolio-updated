# Visual foundation handoff

Completed 1 November 2026 on `codex/premium-visual-foundation`. Changes are local and uncommitted; nothing was pushed, deployed or migrated to another framework. The Sites skill's local development workflow was used. The original ZIP and dependency lockfile are preserved.

## What changed

The original archive source was promoted to the repository root. Existing audit/creative documents were preserved rather than overwritten by the stale archive manifest. Unmodified application assets, UI primitives, server middleware and routing infrastructure were retained.

The homepage now contains a static cinematic hero, an interactive five-industry preview, Selected Systems, Specialized Systems, Research, About, Workflow Diagnostic and Contact. The five featured projects retain the requested MOS → Production → Engineering → Tender → BOQ order. Long pinned scroll demonstrations have been replaced in this phase by natural document flow and user-selected sample views.

Typography, spacing, grid, light/dark surfaces and contrast tokens follow the design direction. Mobile navigation uses a native dialog with Escape/focus return. Controls use native buttons, explicit selected states and named content regions. Reduced-motion CSS removes animation and smooth scrolling. No full 3D or cinematic timeline was implemented.

## Files changed relative to the archive

- `src/styles.css`: shared tokens, responsive architectural layouts, components and reduced-motion rules.
- `src/components/site/Nav.tsx`: desktop navigation, native mobile dialog, skip link.
- `src/components/site/Cinematic.tsx`: static hero with illustrative environment disclosure.
- New `src/components/site/IndustryJourney.tsx`: five scene choices and contextual work links.
- `src/components/site/IntelligenceUI.tsx`: semantic sample production table.
- `src/components/site/Work.tsx`: work index and prioritized showcase composition.
- `src/components/site/work/MOS.tsx`: department selector and explicit planned/development scope.
- `src/components/site/work/Production.tsx`: five selectable product views, reusing existing sample renderers.
- `src/components/site/work/Engineering.tsx`: existing drawing and four selectable output panels.
- `src/components/site/work/Tender.tsx`: editorial process sequence and optional sample stage viewer.
- `src/components/site/work/BOQ.tsx`: semantic table, stage navigation, accept/reject sample decisions and reset.
- `src/components/site/work/shared.tsx`: reusable status/metadata/CTA components and readable sample labels.
- `src/components/site/work/Specialized.tsx`: concise editorial project list.
- `src/components/site/work/Research.tsx`: research presentation with explicit limitations and verification note.
- `src/components/site/AboutContact.tsx`: editorial biography; native validated local inquiry draft with copy fallback.
- New `src/components/site/WorkflowDiagnostic.tsx`: local challenge-to-case-study guide; no tracking or stored answers.
- `src/lib/content.ts`: requested display status wording, industry labels and accurate product-scope CTA.
- `src/routes/index.tsx`: new homepage composition and main landmark.
- `src/routes/work.$slug.tsx`: preserved case-study loader/URLs; semantic section headings, honest media fallback and refined layout.
- `src/routes/__root.tsx`, `src/lib/useCine.ts`, `src/routes/README.md`: formatting normalization only.
- `src/test/app-routing.test.tsx`: existing homepage route test plus ten project matches and unique slugs.
- New `src/test/foundation.test.tsx`: industry, MOS, BOQ, diagnostic and inquiry interaction checks.
- `package.json`: typecheck script and runtime/package-manager metadata; `.nvmrc`: Node version; `README.md`: actual local setup.
- `docs/screenshots/`: desktop, tablet and mobile preview captures.

Other root files are newly visible to Git because the original repository tracked only the ZIP. Generated output and node_modules remain ignored.

## Actual validation

- Production build executed successfully during the implementation session: client, SSR and Nitro Cloudflare module output.
- TypeScript `tsc --noEmit` passed.
- Vitest: **2 files, 17 tests passed**, including the original routing test. One new assertion initially used an unsupported asymmetric value matcher; it was corrected and the suite rerun successfully.
- ESLint: **zero errors**, six pre-existing Fast Refresh warnings in unused UI primitives. The former 285 formatting errors were normalized.
- Browser inspections at 1440×1000, 768×1024 and 390×844; additional document-width check at 320×740. No document-level horizontal overflow was observed. Wide sample tables retain labeled local scrolling regions.
- Browser interaction checks: MOS selection, BOQ review/reset, diagnostic result, inquiry preparation, native menu opening, Escape and focus return. Production case-study navigation/rendering checked. No warnings/errors were captured in the browser console in inspected states.
- Homepage DOM inspection found one h1 and no unresolved local hash destinations.
- Accessibility review covered semantic headings, labels, selected states, native controls, menu keyboard behavior and source-level reduced-motion rules. This is not a WCAG certification; no axe, screen-reader, OS-level reduced-motion emulation, zoom or cross-browser matrix was run.

Build warnings remain from the existing wrapper: redundant vite-tsconfig-paths and an ignored inlineDynamicImports option when codeSplitting is present. These do not fail the build.

Route tests verify matching and params; they are not production HTTP status checks for all ten routes. Production hosting and 404 status behavior still need deployment-environment verification.

## Preview

Run `bun run dev --host 127.0.0.1 --port 5174`, then open http://127.0.0.1:5174. The development server may require local-network permission in the desktop environment. This preview is local, not published.

Screenshots: `screenshots/desktop-foundation.jpg`, `screenshots/tablet-foundation.jpg`, `screenshots/mobile-foundation.jpg`.

## Remaining work and limits

1. Connect validated server-side inquiry delivery, verified recipient/contact links, abuse controls and honest failure/retry states. Current form deliberately prepares/copies a local draft and never claims delivery.
2. Supply and clear real product captures, output artifacts, portrait and research attribution. Existing images are references/illustrations; no new cinematic assets were created.
3. Build the approved cinematic only after asset production and an explicit implementation decision. Current placeholders remain useful without it.
4. Complete BOQ editing/export or real extraction only as separately scoped features. Current accept/reject decisions are local sample state.
5. Run device/browser, screen-reader, zoom, automated accessibility and production performance checks; no performance score is asserted here.
6. Confirm host/domain, metadata/share images, production route responses, privacy-aware analytics and release rollback.
