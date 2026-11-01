# Minimal motion and interactive demonstrations

Implemented 1 November 2026. Extends the existing visual foundation and hero-arrow gesture without adding a runtime dependency or changing project delivery claims.

## Motion hierarchy

- **Signature:** retain the scroll-linked copper hero arrow. No new pinned sections or scroll capture.
- **Explanation:** operating-model connections draw in when selected; existing structures, core and connection states remain meaningful. MOS department changes transition their explanation and handoff.
- **Exploration:** selected industries crossfade their environments and transition their copy. Only a requested replacement is decoded; previous imagery remains visible until ready. Late requests cannot replace a newer selection. Failed decorative images retain the previous available plate.
- **Reading:** offscreen homepage section headings and project introductions reveal once with 16px travel over 480ms. Content already visible at initialization remains visible. Native IntersectionObserver is a progressive enhancement; missing support or reduced motion leaves content readable. Focus within a reveal makes it immediately visible.
- **Feedback:** 180ms button/link/navigation feedback; approximately 250–380ms panel, form and image transitions. Focus indicators remain explicit. The inquiry pending indicator runs only during a real pending request, not as a decorative loop.

All interactions use native buttons, inputs, details and links. Reduced-motion CSS removes panel/drawing/loading animations; motion preference changes also clean up section observers and the existing GSAP cinematic context. Mobile retains static hero arrows, while useful button-driven demonstrations remain interactive. No custom cursor, magnetic controls, autoplay demo, fake metric or additional 3D runtime.

## Project demonstrations

| Project                 | Interaction                                                               | Boundary                                                                             |
| ----------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| MOS                     | Choose a department, reveal its handoff and implementation state          | Existing concept; planned modules remain planned                                     |
| Production Intelligence | Select a job to inspect its stage sequence and owner                      | Fixed illustrative jobs, not connected production records                            |
| Engineering Automation  | Change the assembly count; sample component quantities update             | Integer count 1–20; arithmetic only, no engineering sizing or compliance calculation |
| Tender/RFQ              | Select a source excerpt; corresponding field and clause appear            | Three predefined source mappings, no uploaded document or live AI extraction         |
| BOQ Intelligence        | Open a flagged item’s explanation; existing review decisions/reset remain | Predefined review prompts; no inferred quantities or automatic corrections           |

New sample content is centralized in `src/lib/content.ts`. Project and capability statuses are unchanged. Replacing a panel does not remount its selection controls; focus stays with the selected button/input.

## Files

- `useSectionReveals.ts`, homepage route: observer-based reading reveals and cleanup.
- `CrossfadeImage.tsx`, `IndustryJourney.tsx`: decoded imagery, stale-request cancellation and copy transition.
- `WorkflowExplorer.tsx`: normalized SVG connection paths.
- Five individual `site/work/` components: distinct demonstrations and panel transitions.
- `styles.css`: motion tokens, feedback, drawing, form states and responsive/reduced-motion rules.
- `interaction-demos.test.tsx`: five meaningful behavior/regression tests.

## Validation

- 51 tests across six files passed; strict TypeScript passed. Lint: zero errors, six existing Fast Refresh warnings in UI primitives after resolving the new crossfade hook warning.
- Vercel-target production build and generated-artifact checks passed: homepage and all ten case studies, metadata, 404 handling, readiness and invalid inquiry rejection. Resend remained unconfigured; no live email was sent.
- Browser at 1440px: selected workflow path uses connection-draw animation; industry switches update imagery and copy; selected job exposes its own owner/stages; quantity 6 produces sample counts 6/12/24; Enter activates source mapping.
- Browser at 390px: tender and BOQ interactions usable with no document overflow; BOQ explanation opened with keyboard input. Width matched at 768px as well. No warning/error entries captured in inspected states.
- Tests cover invalid quantities, job-stage mapping, source provenance, expandable validation explanations and stale image decode results.
- No OS-level reduced-motion emulation, complete screen-reader audit, real-device certification or performance-score measurement was performed. Hosted Vercel review and live email setup remain separate release work.

Preview: http://127.0.0.1:5177/. Screenshots: `screenshots/interactions-industry.jpg`, `screenshots/interactions-production.jpg`, `screenshots/interactions-mobile.jpg`. Scroll naturally; choose an industry; expand a featured project to try its sample. Still screenshots show final states, not animation timing.

## Rollback

Revert this motion-system commit with a new revert commit if necessary; do not rewrite published Lovable history. The earlier hero-arrow commit and inquiry integration are independent. Preserve server environment configuration and project status/content honesty when reverting presentation changes.
