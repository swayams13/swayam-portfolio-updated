# Step 3 — Project evidence layer

1 November 2026. Available-material implementation completed locally. Verified product evidence remains pending owner input; this work does not certify delivery or deployment.

## Implemented

Each featured project now has an explicit evidence classification and a concise explanation of what the sample demonstrates and what it cannot establish. Homepage project briefs identify the available sample. Dedicated project pages show:

- MOS: conceptual department-to-job handoff diagram with planned/development states.
- Production: existing illustrative production overview with sample jobs.
- Engineering: structured sample BOM, not an actual tool export or certified calculation result.
- Tender/RFQ: sample requirement with predefined reviewable specification fields; no live extraction/quotation generation.
- BOQ: sample validation flags, not measured extraction results.

Project context avoids duplicate summary text and omits client identities. Architecture arrays are labeled conceptual rather than verified deployed infrastructure. Existing capability/status markers are preserved. Interactive samples remain accessible on the homepage via deep links, which now open their native disclosure.

## Files

`src/lib/content.ts` adds typed evidence metadata and the next artifact needed. `src/components/site/ProjectEvidence.tsx` renders semantic figures, captions, tables and the conceptual department map. `src/components/site/Work.tsx` adds evidence labels and expands linked samples. `src/routes/work.$slug.tsx` displays evidence and clarifies architecture scope. Styles and evidence tests accompany these changes.

## Actual checks

TypeScript, production build, 25 Vitest tests and lint were run. Lint reports zero errors and six existing UI Fast Refresh warnings. Browser review inspected the BOQ evidence page and verified the sample deep link after fixing disclosure expansion; no console warnings/errors were captured in inspected states. This focused review is not exhaustive accessibility or cross-device certification.

Screenshot: `screenshots/step3-evidence.jpg`.

## Owner evidence checklist — pending

For each capture/output, supply permission to use it, redact confidential/personal details and identify what actually works. No client names are required. State your contribution and distinguish delivered, pilot, developing, planned and prototype scope.

| Project | Most useful next artifact |
|---|---|
| MOS | Capture of a currently working module; mark built versus planned modules |
| Production | Pilot screenshot or brief recording of a real job/stage update |
| Engineering | Real redacted input and resulting calculation/BOM output; clarify review and delivered scope |
| Tender/RFQ | Confirm built stages first; provide a permitted source-to-output example only for those stages |
| BOQ | Source page with actual prototype output, including known errors and review boundaries |

A 30–60 second recording is optional; one clear, permitted screenshot/output pair is enough to start. These are proposed collection formats, not claims that files were supplied. Do not manufacture metrics or replace the illustrative label until provenance is established. Quantified results can follow when verified.

Contact delivery, calendar/email configuration and Vercel release validation remain later steps. No push or deployment performed.
