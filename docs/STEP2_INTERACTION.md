# Step 2 — Interactive workflow prototype

Implemented 1 November 2026. Local preview: http://127.0.0.1:5174/.

The homepage now contains an original isometric operating model showing engineering structures, a factory, document layers and a commercial information block. It begins with separate workflows. Selecting a workflow highlights its path to a shared project record and exposes an explanation, handoff sequence and related project link with its real status. Connect all shows the MOS concept; Reset restores the initial state.

## Scope and files

- New `src/components/site/WorkflowExplorer.tsx`: deterministic SVG model and native HTML controls; local React state; no render loop, external model or new dependency.
- `src/components/site/Cinematic.tsx`: replaces the cosmetic connection toggle with the working explorer. Identity, positioning and primary CTAs precede the optional explorer so visitors can go directly to work/contact.
- `src/lib/content.ts`: central workflow descriptions, project associations and illustrative limitations.
- `src/styles.css`: isometric diagram, connected/selected states, responsive controls and explanatory panel. Existing global reduced-motion rules disable transitions.
- `src/test/foundation.test.tsx`: two new interaction tests covering selection, project/status mapping, reset and whole-system state.

This is the small interactive prototype proposed in Step 2: isometric SVG with a spatial appearance, not a realtime 3D scene. It makes no live integration, engineering certification or deployed-platform claim. A richer 3D renderer can be considered after reviewing this interaction's usefulness and device cost.

## Validation

- TypeScript passed; production build passed. Existing wrapper warnings remain.
- 19 tests passed across two files.
- Lint: zero errors, six existing UI Fast Refresh warnings.
- Browser: Enter activated Documents and Commercial; selected workflow linked to the correct project; Connect all linked to MOS; Reset restored separate workflows.
- Inspected desktop at 1440×1000 and mobile at 390×844; mobile document width matched viewport. Diagram labels are supplemental; named HTML buttons and explanatory text convey the same information.
- No warning/error messages captured in inspected browser states.
- No OS-level reduced-motion emulation, full screen-reader audit, GPU benchmark or Web Vitals measurement was performed. Reduced-motion behavior is implemented through existing CSS rules; no timed animation or automatic rendering runs.

Screenshots: `screenshots/step2-desktop.jpg` and `screenshots/step2-mobile.jpg`.

Remaining launch work: approved product evidence, real inquiry delivery and booking/email configuration, Vercel preview and release validation. No push or deployment was performed in this step.
