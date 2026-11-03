# Editorial Contrast design system

Implemented 2026-11-01 in the existing TanStack Start repository. This is a foundation pass, not a case-study rebuild. All ten existing project records, routes, interactive samples, API contracts and SEO titles/descriptions remain. New noindex `/design-system` provides visual examples. No runtime dependencies were added or changed; package.json and bun.lock are untouched. Work is local on `codex/website-audit`; no production deployment or push.

## Theme and typography

`src/theme.css` owns the supplied seven brand colors and three gradient references, spacing steps, responsive type sizes, gutters, borders, shadows and light/dark semantic roles. `src/editorial.css` owns primitives and integration with legacy layouts; `src/styles.css` keeps existing geometry and demo behavior. Theme/integration are imported last deliberately. Do not add another blanket palette override in styles.css.

Use the supplied brand copper #AD633D decoratively. Semantic `--copper` uses #985332 on ivory and #D5A17B on charcoal for readable small labels. `--ring` is deep copper on light and highlighted copper on dark. Text is #171717 on #F6F1EC and #F8F4F0 on #141414. Gradients belong to dividers, bounded sample swatches, warm sections and the engagement surface; body text should not sit across the copper accent gradient.

Body/UI: Manrope. Technical headings/labels: Space Grotesk. Large selected editorial headlines: Instrument Serif (regular/italic). Four locally hosted Latin WOFF2 assets total approximately 89KB, including two variable fonts (weights 400–700). Licenses ship in public/fonts. Google Fonts was the source; no runtime Google Fonts request remains. Existing arrows outside the Latin subset use system fallback glyphs.

`font-display: optional`, system fallbacks and preloads for Manrope/Instrument Serif regular avoid late font swaps: a slow first visit may retain fallback fonts for that navigation. This intentionally prioritizes stable layout. No measured field CLS score is claimed. Only preload genuinely critical weights. Add a script subset later if multilingual content requires it.

Spacing: .25/.5/.75/1/1.5/2/3/4rem, with section padding 4–8rem and gutters 1.25–4rem. Container caps at 1440px. Editorial type scales responsively; narrow screens stack section headings/cards. Fine borders and soft/raised shadow tokens supply depth without blur/glass decoration.

## Components and use

All primitives live in `src/components/design-system/index.tsx`; Navigation lives in `src/components/site/Nav.tsx` with a backwards-compatible Nav alias.

| Component | Usage/contract |
|---|---|
| Container | Width/gutters only; composes inside Section |
| Section | Semantic section; tone light, dark or warm; pass id and aria-labelledby as appropriate |
| SectionHeading | Eyebrow, title, optional description; as h1/h2/h3 for correct hierarchy |
| EditorialHeading | Instrument Serif large title; default h2, explicit as supported |
| PrimaryButton / SecondaryButton | href renders anchor; otherwise native button default type=button; explicit type=submit allowed |
| IndustryBadge | Static industry label, no fake interactive behavior |
| ProjectStatusBadge | Existing Status[] and optional authored label; never derives a delivery claim |
| ProjectCardShell | Article surface with spacing/border; interactive links belong inside, not a nested whole-card button |
| CopperDivider | Decorative gradient rule; no motion |
| LightDarkSectionTransition | Decorative to-dark/to-light bridge; no text inside |
| Navigation | Existing links/modal behavior retained through AccessibleModal |
| Footer | Shared identity/back-to-top; replaces duplicated footer markup |
| AccessibleModal | forwardRef native dialog; caller must provide accessible title, close control and trigger focus restoration; call showModal(), not an open attribute, for actual modality |

```tsx
<Section tone="dark" aria-label="Selected work">
  <Container>
    <SectionHeading eyebrow="Selected systems" title="Visible scope." />
    <ProjectCardShell>
      <ProjectStatusBadge status={["In Development"]} />
      <h3>Project name</h3>
      <SecondaryButton href="/work/manufacturing-operating-system">Read brief</SecondaryButton>
    </ProjectCardShell>
  </Container>
</Section>
```

Supply a matching heading id when using aria-labelledby (or use aria-label). `SectionHeading` does not auto-generate IDs. For links styled as buttons, navigation is appropriate; native disabled is available on buttons only. For pressed toggles use aria-pressed and retain the existing handlers. The modal’s native Escape/inert/focus-containment behavior is browser supplied; consumers own focus restoration, demonstrated in showcase and Navigation.

## Motion and integration

No continuous decorative motion is introduced; the previous looping hero-arrow hover was removed. Existing scroll-linked arrow/demo GSAP behavior remains. Feedback uses short opacity/transform/color changes; prefers-reduced-motion disables transitions/animations and smooth scrolling. Pending inquiry animation remains tied to an active request. Focus outlines are visible and offset; primary/secondary actions meet 48px minimum height. Status indicators combine a dot with readable text.

The homepage opening now uses ivory/editorial typography and Work uses scoped charcoal tokens. Existing case-study structure is unchanged and inherits shared typography/controls. Existing concept imagery is preserved and labeled illustrative; no generic stock imagery or invented product evidence was added. Real project imagery can replace placeholders when approved material is supplied.

## Local visual review and validation

Browser review: 390×844 mobile homepage/showcase, 768×1024 tablet showcase, 1440×1000 desktop homepage, industry-to-gallery boundary and inquiry form. Narrow 320×740 showcase also checked. DOM measurements showed document width equal to viewport at 320/390/768/1440 in the reviewed views. Confirmed computed homepage ivory rgb(246,241,236), gallery charcoal rgb(20,20,20), inverse text rgb(248,244,240), and body Manrope. Screenshots were inspected in-session; this written review is the retained deliverable.

Showcase primary/secondary/disabled actions and responsive headings displayed clearly. Modal opening focused Close preview, Escape closed it and restored focus to the trigger. Tablet retained a two-column heading; mobile stacked it. Inquiry fields remained readable on ivory. Reduced-motion coverage is stylesheet inspection, not an emulated OS/browser media test. This is targeted visual QA, not exhaustive WCAG or cross-browser certification.

Checks actually run after implementation: typecheck PASS; test PASS (6 files/51 tests); lint PASS (0 errors, same six pre-existing fast-refresh warnings); build:vercel PASS; verify:vercel PASS (home + ten projects 200/metadata, unknown routes 404, public readiness/invalid POST checks). No email was sent. Existing tsconfig-path plugin warning remains. Default Cloudflare build passed during Phase 0, not rerun in this phase. Initial font subsetting attempt lacked Brotli; switched to Google's already-subset WOFF2 files without changing app dependencies. git diff --check PASS.

Run locally with Node 22.23.2, Bun 1.4.4: `bun run dev --host 127.0.0.1 --port 5174`, then open `/design-system`. If the port is occupied Vite selects the next port. Remaining work: full homepage content/conversion redesign, real product evidence, measured CWV/CLS, broader assistive-tech QA and inquiry activation. No chatbot or case-study rebuild included.

## Black-led palette revision

The review palette now uses near-black (#090909) as the default canvas and
subtle charcoal surfaces for depth. Cream (#F6F1EC) is reserved for typography
and primary actions; copper highlight (#D5A17B) identifies labels, selection,
and focus. Light/warm section APIs remain compatible but render black-led
surfaces. The warm gradient is now a subdued black-to-brown material treatment.
Homepage architectural blocks and advisor/industry selected states follow the
same semantic tokens. No dependency, route, content, or delivery changes.

Validation: Vercel artifact build and 125 existing tests pass. Local homepage
visually reviewed in-browser. This palette revision does not constitute a fresh
full-site accessibility certification or hosted delivery verification.
