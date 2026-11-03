# Content update guide

The website keeps its existing TanStack Start routes, premium ivory/charcoal/copper theme and public evidence distinctions. Update content in data, not inside page-layout components. Do not turn a prospective sector association into a deployment claim.

## Project stories and status

`src/lib/content.ts` is the central source for original `projects`, `caseStudyEvidence`, derived `caseStudies`, homepage previews and industry mappings. The typed case-study contract is in `src/lib/case-study.ts`. Consult `project-evidence-register.md` before changing a capability or maturity state.

- Preserve project IDs/slugs and the ten existing URLs. Update every related-project/industry reference if adding a new record. If a public URL must change, provide an explicit redirect and keep the old URL discoverable.
- Keep verified capabilities, authored implementation reports, development and planned scope separate. A working illustrative UI is evidence of that UI, not a client deployment, production readiness or business outcome.
- Record verifiedOutcomes only with attributable supporting evidence and permission to publish it. Do not infer savings, implementation scope, testimonials or customer identities from a demo. Do not set lastVerifiedDate simply because copy was edited.
- Keep MedPulse a separate research story. Patent/publication attribution must retain its current verification limitations until primary evidence has actually been checked.
- Add a project under multiple sectors only when the workflow is relevant. The four-sector mapping (`consultingIndustries`) drives filters, the gallery and retrieval context. Construction/real-estate relevance is not an assertion of an industry deployment.

After adding a public project, update `public/sitemap.xml` and related-project links. Run `verify:vercel` and `verify:launch`; they check sitemap coverage, route metadata and internal destinations. Do not add duplicated industry landing pages merely to target keywords.

## Homepage and conversion copy

Edit `consultingHomepage`, `homepageProjectPreviews`, `homepageCopy` and `contactDetails` in the central content module. Keep paragraphs short, preserve the intended-benefit wording and use a concise challenge/solution rather than feature inventories. CTAs should lead to selected work or the real inquiry destination. Direct public email and discovery-call subject are content; server sender/recipient and credentials are runtime configuration.

The industry CTA preselects only the industry. Advisor summary transfer requires visitor consent and must leave inquiry consent separate. Do not add automatic lead creation, a marketing subscription or conversation persistence while changing copy.

## Screenshots and videos

Case-study fields support screenshots (ID, source, descriptive alt text, real width/height, caption and optional srcSet/sizes), videoPoster, videoSource, captions and an optional transcript. See `case-study-assets.md` and `sample-case-study.json` for the existing structure.

1. Verify publication rights and remove private client identifiers, document contents, credentials, access tokens and personal data before adding a file or public hosting URL. Do not place private material in `public/`, source assets or an archive that will be published.
2. Prefer authentic screenshots, appropriately sized WebP/AVIF plus a supported fallback when needed. Preserve aspect ratios and accurate dimensions; supply several responsive widths if the image is large. Avoid embedding a full-resolution screenshot into every gallery card.
3. Use a real poster frame and a public, stable media URL with correct MIME/CORS/range-request behavior. Do not use short-lived signed URLs containing private access credentials in public content. Embed remains `preload="none"` with native controls and no audio autoplay.
4. Supply caption tracks for speech, a useful transcript and any audio description needed to understand visual information. Check keyboard play/pause/seeking/captions and phone readability with the actual asset. A missing-video notice is preferable to a fake play button.
5. Match alt text and captions to the image’s business context without inventing a customer, deployment or result. The existing missing-asset posters must stay honestly labeled until authentic captures are supplied.
6. Repeat lab performance, layout-shift, gallery interaction and accessibility checks after adding media. Present lab results separately from field p75 data; current measurements use placeholders, not future product recordings.

Existing industrial plates are illustrative scene art, not product captures. They are not loaded by the current homepage/project gallery. Their presence in source/build output does not mean they belong in a case-study evidence slot.

## Typography and layout

Brand/semantic tokens, scale and spacing live in `src/theme.css`; reusable primitives are in `src/components/design-system`. Locally subset WOFF2 files use optional font display and system fallbacks in `src/fonts.css`. Keep licenses with them. Normal/italic Instrument Serif, Manrope and Space Grotesk currently total about 89 KB of font data.

Use semantic foreground colors for text; copper palette swatches are not automatically accessible on every surface. Small text needs at least 4.5:1 contrast, large text at least 3:1; check actual composites and gradient endpoints. Do not apply low opacity to essential copy. Preserve visible focus indicators, meaningful labels, touch targets and reduced-motion CSS. Do not add continuously animated ornaments or WebGL to the gallery.

## SEO and privacy-sensitive measurement

Case-study titles, descriptions, canonical/OG URLs and CreativeWork data are derived by `src/routes/work.$slug.tsx`. Static routes define their own metadata. Person JSON-LD is in the root shell. Do not add reviews/ratings, a business address or service certifications without factual support.

If the production origin changes, update SITE_ORIGIN in `src/lib/case-study.ts`, static canonical/OG URLs, root Person URL, sitemap and robots together. Verify redirects and indexing on the actual deployment. The design-system route remains noindex and excluded from the sitemap. Preview deployments need host-level protection/noindex; production public pages must remain indexable deliberately.

Optional analytics use strict public identifiers from `src/lib/analytics.ts`. Do not attach inquiry/chat text, emails, names, phone numbers, arbitrary URLs or unique visitor IDs. Keep opt-in, DNT/GPC behavior and withdrawal intact. Source attribution accepts only broad categories and allowlisted campaigns. Any new collection or retention must first be reflected in visitor choices and the privacy notice.

## Review before merging

Run the commands in `operations-runbook.md`, check affected routes at 320/430/768/1366/1920 widths, use keyboard navigation and reduced motion, and inspect the actual assets. Review the deployed Preview with the owner. Follow AGENTS.md: no force pushes or rewriting published history on this Lovable-connected repository. A successful build does not verify email receipt, factual project claims or accessibility of newly added media.
