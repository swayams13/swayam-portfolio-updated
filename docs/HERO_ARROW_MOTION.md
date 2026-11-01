# Hero arrow — headline to operating model

Implemented 1 November 2026. The copper arrow is a decorative visual bridge between “Industry into intelligence” and “Interactive operating model”.

## Behavior

- Desktop/tablet from 768px, with motion allowed: arrow floats gently in the original headline gap, then follows a continuous curved path as the visitor scrolls.
- The path leaves the headline at 45 degrees, sweeps toward the right margin, curls across the gap above the model and arrives pointing right immediately before its label. A short moving tail bends along the path and retracts on arrival. Scrolling back reverses the motion.
- Start: hero top reaches 88px from viewport top. End: label center reaches 38% of viewport height. GSAP scrub smoothing is 0.45 seconds. The page uses natural scrolling; no pinning or scroll capture.
- SVG path measurements use actual headline/destination coordinates, refreshed after resizing and font readiness. No React state updates per frame. Pointer events are disabled on the decorative SVG.
- Under 768px or with reduced motion, the headline arrow and a right-facing label arrow remain static. No hidden information, disabled navigation or mandatory animation.
- Without JavaScript or before animation initializes, static arrows remain visible. SVG is hidden from assistive technology; heading text and interactive controls retain their semantics.

## Implementation

`HeroScrollArrow.tsx` uses the existing `useCine` hook, dynamically loaded GSAP/ScrollTrigger and `gsap.matchMedia`. The hook now accepts a cleanup callback for observers/classes. The SVG uses native path length/tangent sampling, so no new animation dependency is needed. Mobile/query changes revert the animation and observer; returning to desktop reinitializes it.

Related files: `Cinematic.tsx`, `WorkflowExplorer.tsx`, `useCine.ts`, `styles.css`. No project/status/contact content changed.

## Validation

- TypeScript passed; 46 tests passed; lint zero errors with the six existing UI Fast Refresh warnings.
- Vercel production build and generated-artifact checks passed, including all ten case studies and correct 404 responses.
- Browser review at 1440px checked initial position, movement, final right-facing dock and reverse scrolling. At 390px, the overlay was hidden, both static arrows were visible, and document width matched viewport width. Returning to desktop restored animation.
- No warning/error entries captured in the inspected browser states. OS-level reduced-motion emulation and exhaustive real-device testing were not performed; its fallback is enforced by the same CSS/matchMedia motion query.

Preview: http://127.0.0.1:5176/. Screenshots: `screenshots/arrow-start.jpg`, `screenshots/arrow-travelling.jpg`, `screenshots/arrow-docked.jpg`. A still image cannot demonstrate timing; use the preview and scroll through the hero.
