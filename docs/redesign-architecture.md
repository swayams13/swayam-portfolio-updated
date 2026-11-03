# Incremental redesign architecture

Audit baseline: bd19d2c5a3a3987b55f137cd67f50a965489848f, 2026-11-01. Proposal only; no redesign implemented.

## Keep the platform

Retain React, TanStack Start SSR/file routing, Bun lockfile, Lovable's plugin wrapper and Nitro Vercel deployment. Current checks pass; no demonstrated need for framework migration. Preserve `/`, `/api/inquiry`, all ten `/work/<slug>` URLs, case-study hashes and homepage deep links. Preserve generated route workflow, SSR boundaries, error handling and contact state machine. No heavy 3D dependencies are needed for an editorial consulting site.

## Proposed structure

```text
src/lib/content.ts                 existing public source of truth
src/lib/inquiry.ts                 existing shared validation contract
src/server/inquiry.server.ts       existing server-only delivery
src/components/site/
  Nav.tsx                         preserve modal/focus behavior
  layout/Section.tsx               proposed spacing/width primitive
  layout/SectionHeading.tsx        proposed heading hierarchy
  layout/PrimaryAction.tsx         proposed consistent inquiry link
  home/ConsultingHero.tsx          proposed offer/audience/action
  Capabilities.tsx                 retain service and engagement data
  IndustryJourney.tsx              retain industry selection
  Work.tsx                        concise selected-work summaries
  ProjectEvidence.tsx             preserve evidence limitations
  work/*                          preserve all five demos + supporting work
  AboutContact.tsx                preserve about/export boundary
  Contact.tsx                     preserve inquiry state machine
src/routes/work.$slug.tsx           retain case template and all projects
src/styles.css                     introduce semantic tokens first
```

These are proposed extraction boundaries, not instructions to split every component immediately. Keep ten content records together until there is a concrete editing need. Later extend each capability with optional evidence reference and reviewed date; retain existing honesty states, and distinguish authored status from verified public proof. Prefer an explicit slug-to-demo map over `demos[i]` so content reordering cannot mount the wrong project sample. No CMS is necessary now.

## Editorial Contrast foundations

Use ivory as the default reading surface, ink for headings/body, copper for restrained emphasis and selected dark sections. Define semantic surface/text/border/action/focus tokens before replacing individual hard-coded colors. Scope `.dark` to dark regions; current `:root, .dark` grouping must be separated carefully. Update root color-scheme/theme-color alongside actual surfaces. Select copper shades separately for light and dark backgrounds after measuring text and control contrast; current pale copper should not automatically become ivory-background small text.

Keep typography to readable body copy and a distinctive display face, with a limited mono label role. Use spacing, rules and typographic hierarchy for premium character. Retain existing fonts initially; assess actual used weights before replacing or self-hosting. No new visual dependency is required.

## Homepage and content preservation

Aim for offer + audience + primary inquiry action, concise capabilities, selected projects with honest status, industry relevance, engagement process, consultant credibility and inquiry. Show enough evidence to make evaluation possible; preserve the current workflow explorer and five demos in purposeful disclosures or later load them on demand. Keep specialized engineering and MedPulse accessible through links and their current pages. Do not delete hidden content or count hidden content as removed from payload.

Avoid repeating full capability lists and architecture on the homepage; existing case pages remain the detailed reference. Preserve sample labels and real limitations close to interactive UI. Move private verification instructions into the evidence register only when public wording can truthfully represent the confirmed scope. Keep supplied copy history in Git and existing docs; do not overwrite old design documentation as if it described the new target. Brand concept images are illustrative, never client imagery.

## Dependency decisions

No dependency changes in this phase. Keep GSAP until arrow/demo interactions are migrated or measured unnecessary. Keep Zod and server delivery contracts. Audit the unused UI graph before removing Radix packages, cmdk, date-fns, embla, input-otp, react-day-picker, react-hook-form/resolvers, react-resizable-panels, recharts, sonner and vaul: many are imported by dormant `ui/` components and are not literally unreferenced packages. Their absence from active pages does not imply they inflate the production bundle. Preserve those files now.

React Query is instantiated at the root but no business query hooks were found; consider removing its provider/package only in a separate validated change. Vite reports native tsconfig path support; coordinate any removal of vite-tsconfig-paths with Lovable's wrapper rather than adding duplicate config. Review Nitro beta and the rolldown override with compatibility evidence in a separate maintenance task. Do not run blanket version upgrades or an automatic audit fix during visual work.

## Safe sequence and rollback

First implementation slice: add semantic theme tokens and an explicit page surface boundary in styles/root, migrate Nav and the static hero to ivory/ink/copper, and add truthful consulting positioning plus the existing #contact action. Leave demos/API/routes untouched in that slice. Validate then commit it separately; each subsequent section migration is independently reversible. Add canonical/social metadata and sitemap as a separate functional slice. Optimize media and lazy demo mounting after baseline measurements, retaining hash-open behavior. Activate inquiry only with server configuration and a controlled acceptance/receipt test. No commits have been pushed and no deployment has been performed in this audit.
