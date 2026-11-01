# Implementation plan — approval required

31 October 2026. Baseline commit: `9b5705bf15c6e49ac66413efa360e0130148864e`.

This is a proposal only. Application implementation, dependency changes, source promotion, publishing and remote writes have not been performed. The audit documents are the only deliverables added to the working tree.

## Direction

Retain TanStack Start, React, TypeScript, Tailwind and GSAP. Deliver credible project evidence and reliable inquiry handling before expanding cinematic complexity. Use layered images for the first five-scene release and React/SVG for the Industrial Explorer. A short rendered sequence is an optional later upgrade, contingent on demonstrated visual benefit and device tests.

## Ranked improvements

| Rank | Improvement | Impact / reason |
|---|---|---|
| 1 | Promote archived source into a reproducible, validated application repository | Enables every safe implementation and deployment step |
| 2 | Implement reliable contact delivery and verified contact links | Restores the intended business outcome; current form sends nothing |
| 3 | Publish two evidence-backed case studies with real artifacts and approved claims | Largest credibility improvement; prioritize delivered engineering work and the production pilot if verified |
| 4 | Make cinematic layouts static-first and failure-safe | Prevents animation loading failures from breaking the core experience |
| 5 | Shorten the homepage and add industry/mobile navigation | Helps visitors reach relevant proof without completing multiple long tours |
| 6 | Complete accessible controls, heading structure and reduced-motion behavior | Makes demos and navigation usable across input modes and devices |
| 7 | Produce cohesive, rights-cleared cinematic plates and real product media | Improves premium quality more directly than adding a 3D engine |
| 8 | Build one useful Industrial Explorer with working sample actions | Turns abstract capabilities into understandable workflows |
| 9 | Optimize image variants, continuous animation updates and deferred loading | Reduces avoidable loading/rendering costs; confirm through measurements |
| 10 | Finish SEO, minimal funnel analytics and release observability | Supports discovery and reveals whether qualified inquiries arrive |

Ranks reflect impact/dependencies, not a rigid production order. Contact/content preparation can proceed alongside visual design once implementation is authorized.

## Phases, tasks and estimates

Ranges are person-days for experienced contributors, not elapsed-time guarantees. They include normal review/QA but exclude waiting for access, client permissions, supplied product screenshots and bespoke 3D production. A person-day is approximately 6–8 focused hours. Re-estimate after a runnable baseline and content review.

| Phase | Tasks | Dependencies | Effort | Acceptance criteria |
|---|---|---|---|---|
| 0. Source and validation baseline | Promote archive contents preserving bytes; reconcile existing audit docs; retain AGENTS rules/history; choose and pin lockfile-compatible runtime/package manager; resolve install/build blockers; document deployment target; run lint/types/tests/build; add CI and preview process | Approval to implement; dependency access; host selection before deployment | 2–4 days, plus 1–3 if toolchain incompatibility needs repair | Clean checkout installs reproducibly; checks pass or explicitly approved isolated exceptions; preview returns homepage, real case study and correct 404; no undocumented source changes |
| 1. Evidence and narrative | Verify project/capability status, role and permission; collect screenshots/outputs/portrait; verify research citation; select two lead case studies; industry mapping and CTA copy | Swayam's source artifacts and factual confirmation | 3–6 days | Two complete evidence-backed stories; no invented metrics; planned work clearly distinct; no empty public media slots |
| 2. Accessible design foundation | Refine type/spacing/contrast; mobile/industry nav; semantic headings; static-first layouts; complete keyboard controls; unified reduced-motion behavior; image media renderer | Phase 0; narrative direction from phase 1 | 4–7 days | All core content usable at 320px and 200% zoom; keyboard navigation complete; no hidden-content trap on JS/motion failure; approved desktop/mobile design |
| 3. Consultation path | Implement server-only delivery adapter, validation, rate limiting, idempotency, errors/retry, privacy copy and real links; contextual CTA; minimal events | Phase 0; recipient/provider/domain and approved privacy decisions | 3–5 days | Valid submission reaches test inbox; invalid/failed requests never show success; duplicate handling verified; PII absent from analytics and client bundle |
| 4. Cinematic refinement | Storyboard all five scenes; matched still assets/crops; shared lifecycle; readiness/failure fallback; chapter controls; responsive scheduling; remove repeated long automatic tours | Phases 1–2; approved assets | 5–9 engineering days + 3–7 art-direction/asset days | Five scenes coherent at agreed viewports; skip/direct access works; reduced-motion and failed-assets modes remain readable; measured loading and scroll behavior reviewed |
| 5. Industrial Explorer | Build industry selector, hotspots and one sample job handoff; MOS departments; engineering SVG stepper; BOQ review actions/reset; contextual case-study links | Phases 1–2; approved sample workflow fixtures | 6–10 days | Every visible action works; keyboard/touch parity; no claim of live AI or client connectivity; deterministic sample output; accessible alternate view |
| 6. Release verification | Responsive asset tuning, route metadata/canonical/OG/sitemap, privacy-aware analytics, browser/device QA, dependency audit, delivery monitoring, rollback rehearsal | Phases 0–5, canonical domain, deployed preview | 3–5 days | No unresolved release blockers; route/status/metadata checks pass; agreed budgets measured; contact verified; prior deploy recoverable |

Indicative baseline effort: **26–46 engineering/content/QA person-days plus 3–7 visual-asset days**, with an additional 1–3 day toolchain contingency if needed. Existing artifacts and constrained explorer scope can reduce this. Do not commit to a calendar deadline before verifying the build and evidence availability.

Optional B: one rendered transition pilot, 3–6 engineering days plus 5–12 rendering/asset days. Optional C/D: separately scope after a concrete spatial use case; do not absorb it invisibly into the baseline estimate. A full five-scene realtime 3D production is not recommended.

## Exact first implementation milestone

**M1 — A reproducible source checkout and verified preview of the existing prototype.** Target 2–4 person-days after approval, with compatibility contingency above. It contains no visual redesign, new 3D engine or production launch.

Tasks:

1. Create a `codex/` implementation branch from the audited commit; preserve the original archive and remote history.
2. Promote its application files into the repository as a transparent source-import change, preserving AGENTS.md and existing audit documents. Record per-file hashes; distinguish normalization/toolchain fixes in subsequent commits.
3. Install with the existing lockfile using a verified runtime/package-manager combination; pin it. Do not silently replace the lockfile or relax dependency constraints to make installation appear successful.
4. Resolve only reproducibility blockers, documenting exact before/after behavior. Preserve the intended framework, routes, styling and content.
5. Run type check, lint, existing test and production build; add focused route smoke checks for `/`, a valid `/work/$slug`, an invalid slug and an unknown route. Test production output, not only development server behavior.
6. Establish a reviewable preview on the selected host when authorized for deployment; document configuration, required environment names and rollback instructions. Keep secrets out of source.

Exit criteria: clean checkout reproduces results; all required checks pass (or an explicitly reviewed baseline exception is documented); valid routes return correct content and unknown routes return 404; preview contains the existing app; all source deltas are explained; no application redesign or public production deployment has occurred. If the host is not yet chosen, local production preview and documented deployment candidates are the intermediate output, not a claim of completed hosting verification.

## Testing requirements

| Area | Required checks before release |
|---|---|
| Baseline | Frozen install; lint without autofix; `tsc --noEmit`; existing Vitest suite; production build; dependency advisories with scope/versions recorded |
| Routes and content | Every listed project loads; unknown slug/route returns correct 404; metadata uses approved content; no duplicate/invalid slug or unsupported status; internal anchors resolve |
| Inquiry | Valid/invalid/overlong input; server validation bypass attempt; provider timeout/failure; double click/retry; rate limit; input preservation; live-region feedback; inbox receipt and bounce handling procedure |
| Explorer | Selected industry and department, state transitions, BOQ editing/review/reset; deterministic output; planned/sample labels persist; keyboard and touch equivalent to mouse |
| Motion | Preference enabled before load and toggled at runtime; resize/orientation changes; navigate away/back; GSAP/chunk/image failure; JS disabled; rapid scroll; no duplicate timelines or leaked observers |
| Accessibility | Automated axe or equivalent plus manual keyboard, VoiceOver/NVDA representative paths, heading structure, focus contrast/order, tabs/dialogs, zoom/reflow, non-color status indicators; target WCAG 2.2 AA |
| Responsive | 320/375/390/768/1024/1440 widths, short-height desktop, phone landscape; Safari/iOS and Chrome/Android plus desktop Firefox/Chromium; horizontal overflow limited to labeled data regions |
| Performance | Production Lighthouse under documented conditions; browser trace during transitions; network waterfall and chunk graph; midrange-device scroll responsiveness; report actual values and conditions, never speculative scores |
| Deployment/security | Direct deep links, SSR status codes, cache behavior, server secrets absent from assets, HTTPS/security headers, sanitized logs, abuse controls, privacy/event payload inspection |

Provisional targets, **not current measurements**: LCP ≤2.5s, INP ≤200ms and CLS ≤0.1 at p75 once enough field data exists. Before traffic, use repeatable lab checks as proxies, not field evidence. Initial transfer budget proposal: ≤1 MiB for critical mobile page resources and ≤250 KiB gzip initial application JS, excluding explicitly deferred cinematic media. Confirm feasibility in Phase 0 and approve tradeoffs rather than silently moving the thresholds. No mandatory full sequence download on mobile or reduced-motion mode.

## Risks and mitigations

| Risk | Mitigation / decision gate |
|---|---|
| Export/lockfile/toolchain cannot reproduce | Resolve in Phase 0 before design implementation; retain exact archive and logs; no migration without a demonstrated unsupported requirement |
| Lovable wrapper hides deployment behavior | Inspect installed config and production output; select explicit supported target; avoid duplicating supplied Vite plugins |
| Source promotion interacts with Lovable sync | Use reviewable branch/commits and confirm connected branch behavior; never rewrite published history |
| Assets look premium but imply nonexistent work | Separate atmospheric illustration from actual project evidence; secure permissions and verify captions |
| Long cinematic harms discovery | Persistent skip, direct industry/case-study navigation, shorter homepage and optional demos |
| Mobile GPU/memory pressure | Prefer stills, cap resolution, bound decoding, defer resources; make WebGL optional and independently unloadable |
| Motion initialization fails | Static content is the default; readiness flag only after success; timeout/failure leaves content usable |
| Inquiry lost or duplicated | Provider acknowledgment, idempotency, monitored failure path and inbox verification; do not log sensitive challenge text |
| Research/engineering content overclaims | Owner review and source citations; sample parameters and research limitations remain explicit |
| Scope grows into a full enterprise demo platform | Bundled fixtures and local state first; no uploads, authentication, live AI extraction or industrial APIs without a separate requirement |

## Rollback strategy

- Keep the audited commit/archive and a hash manifest as the source baseline. Use additive commits and reviewed branches; never force-push, rebase or amend published Lovable history.
- Make source promotion, toolchain fixes, content, layout, motion, explorer and delivery separately reviewable/revertible changes. Revert only the relevant implementation commits; preserve these audit documents and unrelated user work.
- Keep the static semantic experience available behind the same routes. A motion/explorer feature switch must disable enhancement without deleting content or breaking navigation.
- Use preview deployments before production. Record the last known good deployment and provider rollback procedure. Rehearse restoring it and check `/`, a case study and contact afterward.
- If contact delivery fails, stop accepting submissions or show an honest failure with a verified direct-email fallback. Do not roll back to the prototype's apparent success state.
- Preserve already accepted inquiries through application rollback. Avoid introducing a lead database unless retention/delivery requirements justify it; if added later, use backward-compatible migrations and a separate data rollback plan.
- Abort release on delivery failure, inaccessible core navigation, broken direct routes, unreadable non-motion mode or unexplained dependency/build failures. Document the issue and return to the last verified release.

## Approval boundary

The requested audit is documentation-only. **M1 is the first proposed implementation step and requires your approval.** Asset production, production integrations and optional sequence/3D work remain later decisions supported by concrete previews and validation results.
