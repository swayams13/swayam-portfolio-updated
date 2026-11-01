# Website brief and next-phase plan

Final business direction · 1 November 2026 · Confirmed by Swayam. This document records requirements; application implementation and deployment are separate work.

This brief updates the business/content direction in the earlier implementation plan. Completed visual-foundation work is recorded in FOUNDATION_HANDOFF.md; the original audit plan is historical, not an instruction to repeat that work. The current studio-inspired visual direction is accepted as a starting point. Final sector solutions and project evidence remain to be supplied.

## Confirmed positioning

- Identity: Swayam Singh, independent consultant. Premium engineering consultancy positioning; currently working alone. A future team is an ambition, not a present company claim.
- Public title: AI & Solutions Consultant. Build operational software, engineering automation and intelligent business systems for industrial and business teams.
- Four capabilities: Operational Intelligence Systems; AI & Document Automation; Engineering & Process Automation; Custom Business Platforms & Integrations.
- Avoid generic website-development positioning or an all-services agency offer.
- Audience: owners, directors, plant heads and engineering managers.
- Sector order: Manufacturing first; Construction and Real Estate share the next priority; EPC follows. These are navigation/content priorities, not a change to the physical sequence of a future cinematic.
- Acquisition: LinkedIn, personal introductions, referrals and proposals. The site supports an informed conversation and validates credibility after an introduction.
- Reach: open to remote, on-site and international engagements; do not imply offices or existing global clients.
- Authorized credibility: consulting experience in manufacturing and engineering operations in Gujarat, India. Highlight production tracking, engineering automation, operational systems and applied AI. Keep clients confidential; omit equipment counts and other unverified scope/outcome claims.
- English only; Swayam maintains project content.

Core message: **I understand operational problems, design practical solutions, and build systems that businesses can actually use.**

Proposed headline for copy review: **Practical intelligence for complex operations.** Supporting text should describe the four capabilities and relevant sectors, without promising unverified performance improvements.

## Engagement and commercial guardrails

Complimentary 20-minute discovery call: understand the problem, existing workflow and fit. Complex requirements may proceed to a paid workflow assessment producing documented scope, recommended architecture, implementation phases and commercial proposal.

Delivery is phased: discovery → scoped implementation → validation → deployment → ongoing improvement. Workflow assessment, implementation planning and support belong to this process. Support terms are agreed per engagement, not implied to be unlimited.

Do not publish fixed pricing or universal duration promises. A focused initial implementation may take approximately 4–8 weeks, depending on requirements and dependencies; use this only with its qualification, preferably in the engagement FAQ. Previous INR 1–10 lakh information remains private context and does not establish a public rate card.

## Information architecture

| Page | Visitor question | Proposed content |
|---|---|---|
| `/` | Is this person relevant to my business? | Positioning, interactive opening, industry entry points, concise selected work, engagement process, brief biography and inquiry CTA |
| `/industries/manufacturing` | What could improve our operation? | Owner-approved problems and 3–4 solution opportunities, relevant project summaries/statuses, optional production/MOS sample, inquiry context |
| `/industries/construction` | What could improve project information and coordination? | Separately approved problems/solutions, BOQ relevance, sample source-to-review workflow, inquiry context |
| `/industries/real-estate` | Which development/property workflows can you support? | Distinct content from construction, with proposed versus implemented scope explicit; no fabricated property platform |
| `/industries/epc` | Can you work with engineering and commercial workflows? | Approved opportunities, engineering automation and tender/RFQ context, review/handoff explanation |
| Existing `/work/$slug` | What is this system and why is it relevant? | Concise anonymized project brief; current state, Swayam's role, sample/evidence, optional high-level diagram, contextual inquiry |
| Homepage contact / optional later `/contact` | How do we start? | Inquiry form, verified email and booking option; consistent context and delivery handling |

Proposed navigation: Work · Industries · Approach · About · Discuss a project. Keep diagnostic as an optional decision aid, not a required intake funnel. No blog, newsletter, careers page, team page or client portal is required for this release.

Industry pages must not be published with generic filler. Swayam will supply the actual problems/solutions later. Draft routes can be prepared after approval, but content must remain clearly draft until reviewed.

## Concise homepage

1. **Opening:** modern studio aesthetic and one restrained interactive 3D/schematic object. Make consultancy identity and value proposition visible without scrolling through a long animation.
2. **Choose your industry:** Manufacturing, Construction, Real Estate, EPC. For initial launch, use relevant in-page explanations and project links. Publish deeper sector pages only after their distinct content is approved; avoid five competing homepage demonstrations.
3. **Selected systems:** preserve MOS → Production Intelligence → Engineering Automation → Tender-to-Quotation → BOQ order. Show a short problem/scope/status summary and a link. Prioritize demo depth for MOS, BOQ, Production and Tender as requested; this does not change their actual implementation states.
4. **Four capabilities and engagement process:** explain the defined capability areas, the complimentary 20-minute discovery call, optional paid assessment, and phased implementation.
5. **Independent expertise:** short biography, domain understanding and verified role. Keep specialized systems and research as compact supporting material or links.
6. **Workflow guide:** brief optional entry, or integrate into the industry selector rather than another large section.
7. **Project inquiry:** primary conversion, with booking and email alternatives.

## Project-brief policy

Public pages give the gist; deeper technical/commercial detail belongs in a conversation. Use a consistent short content contract:

- Industry and anonymized operational context.
- The business challenge, without fabricated cost/savings figures.
- What the system is designed to do and Swayam's actual role.
- Current project/capability state; planned work cannot appear delivered.
- One useful screenshot/sample or simple high-level architecture diagram, when cleared.
- Clear next step: discuss a similar workflow.

Do not expose client documents, pricing, sensitive architecture or complete source code. Anonymization still requires permission for any recognizable screenshot/document. Keep sample labels adjacent to synthetic data. Use qualitative descriptions now; add quantified outcomes only after verification and disclosure approval. Research remains explicitly research.

## Interaction and 3D direction

Priority order: industry exploration → functional samples → architecture diagrams → product videos. The homepage 3D element establishes character and connects industry to information; visitors never have to manipulate it to read or contact Swayam.

Recommend one small original structural assembly or isometric operating model. Selecting an industry can change its highlighted region and supporting content. Combine abstract architectural geometry with recognizable engineering/infrastructure elements, showing disconnected workflows becoming connected systems. Begin with still compositions/graybox before selecting runtime technology or commissioning final assets. Use the current SVG as fallback; provide touch controls, reduced-motion/static mode and delayed loading. Do not add a full five-scene realtime world by default.

No affiliation logos, client counts, invented metrics or team-scale claims. Do not import the reference site's distinctive branding, slogans or graphics.

## Conversion and deployment

Primary CTA: **Discuss Your Project** → inquiry form. Secondary CTA: **Explore My Work** → work section. Also offer professional email and booking for the complimentary 20-minute call.

Form: company, industry, business problem/proposed project, current workflow/system, optional budget range, preferred contact method. Include name and work email as necessary contact details; make timeline optional. Budget must never block submission. If phone is offered, request a number conditionally; exact options and optional budget brackets are implementation decisions. Do not gate case studies behind email.

Delivery must be verified end-to-end; preserve input on failure and never claim success before acceptance. Do not send inquiry text or personal details to analytics. Booking provider, recipient email and privacy/retention wording need confirmation. The current local-draft form is not launch-ready delivery.

Vercel is the requested initial host, followed by a personal domain. Existing build configuration currently targets Cloudflare through the Lovable/Nitro wrapper. Verify and configure a supported Vercel output in an isolated preview; this is a deployment task, not an approved framework migration. Preserve working routes/SSR/server error behavior and test inquiry delivery on the actual host before launch.

## Release plan

Target an initial polished release within **7–10 days** from implementation kickoff, subject to required contact configuration and review turnaround. Follow [LAUNCH_PLAN.md](LAUNCH_PLAN.md) for the scoped schedule and release gates. Prioritize homepage, capabilities, featured work, About and working contact. Detailed sector pages, deeper case studies and additional demos follow the initial launch.

## Remaining inputs

- Professional recipient email, booking URL/provider and availability; configure before launch.
- Three or four actual sector-specific problems/solutions; owner deferred these for a later discussion. No fabricated solution inventory.
- A safe, credible artifact for each featured project: approved screenshot, working labeled sample or reviewed high-level diagram; capability/status verification where needed.
- Privacy/retention details and support boundaries for actual engagements.

Identity, services, discovery offer, budget optionality, 3D subject, Gujarat wording and launch target are now decided. Do not reopen these questions without a new reason. Project-by-project detail remains a separate later exercise; public summaries remain concise.
