# INDUSTRY → INTELLIGENCE — Design system

Creative direction v1 · 31 October 2026 · Proposed, not implemented.

Read alongside [CINEMATIC_STORYBOARD.md](CINEMATIC_STORYBOARD.md) and [ASSET_MANIFEST.md](ASSET_MANIFEST.md). Based on ARCHITECTURE.md, DESIGN_AUDIT.md and IMPLEMENTATION_PLAN.md, plus the source and six existing image plates in `five-scene-homepage-story.zip`. Source paths below are archive-relative. Browser inspection was attempted but a saved permission policy blocked the local preview; rendered layout/device approval remains outstanding. No new cinematic artwork or application code was produced.

## 1. Creative thesis

**Make industrial complexity legible.** The portfolio moves from physical scale to the information that makes work coordinated: a factory bay becomes engineering linework, structural lines become a built asset, and its facade resolves into the grid of a software interface.

The governing visual idea is **the working line**: a real beam, a drawing edge, a slab line, a facade mullion, then a table rule. Copper identifies the selected piece of information. It is never a neon energy trail or an implication that AI invisibly runs an industrial plant.

The experience should resemble an architectural monograph with useful software demonstrations. Cinematic imagery establishes context; real artifacts establish credibility; interaction explains one decision at a time. Swayam's role is independent AI & Software Solutions Consultant, not a factory owner, property developer or vendor of already-complete enterprise software.

### What to preserve and change

| Current evidence | Creative decision |
|---|---|
| `styles.css`: charcoal/paper/copper, Big Shoulders Display, Geist, Geist Mono | Retain the family resemblance; improve reading sizes, contrast and hierarchy |
| `Cinematic.tsx`: five chapters and matched-plate reveals | Keep one concise cinematic introduction, with explicit skip/chapter controls |
| Manufacturing/wireframe assets | Strong shared aisle/perspective reference. Rebuild registered pairs; current rasters do not establish identical geometry |
| Construction/wire/completed assets | Strong same-corner motif. Existing floor/facade details are not guaranteed to register; commission a single source model |
| `Engineering.tsx`: bellows drawing; `BOQ.tsx`: review steps | Use meaningful diagrams and functional sample controls as the interaction vocabulary |
| `MOS.tsx`: 900vh tour; `Work.tsx`: repeated large exhibitions | Move depth into optional explorers/case studies; do not follow the opening with another compulsory cinematic |
| `IntelligenceUI.tsx`, project statuses | Keep sample and implementation-state disclosure next to the visual, not hidden in a footer |

## 2. Color system

Proposed canonical values use sRGB hex for predictable handoff; convert to OKLCH without changing the intended color when implementing current CSS variables. Existing OKLCH values are not assumed identical to these hex values.

| Token | Value | Role |
|---|---|---|
| `surface.paper` | `#F2F0EA` | Main editorial canvas, light text on dark |
| `surface.charcoal` | `#111417` | Cinematic canvas, primary text on light |
| `surface.graphite` | `#17191B` | Dark demo interiors / secondary dark surface |
| `surface.soft` | `#E6E3DA` | Secondary light sections and field background |
| `text.light.primary` | `#111417` | Light-canvas body/headings |
| `text.light.secondary` | `#56616A` | Supporting light-canvas text |
| `text.dark.primary` | `#F2F0EA` | Dark-canvas body/headings |
| `text.dark.secondary` | `#AAB3B8` | Supporting dark-canvas text |
| `accent.copper` | `#B8794B` | Selected geometry, dark-canvas links, progress |
| `accent.copperInk` | `#80502E` | Small links/labels on paper |
| `accent.steel` | `#77858D` | Diagram secondary lines and decorative details; not normal small text on paper |
| `border.light` | `#D2CFC7` | Decorative section rules on paper |
| `border.dark` | `#3E454A` | Decorative rules on charcoal |
| `control.border.light` | `#77858D` | Input/button boundary on paper |
| `control.border.dark` | `#77858D` | Input/button boundary on charcoal |
| `state.error.light/dark` | `#9B302B` / `#F0A59D` | Error text plus explicit icon/message; verify in final component context |
| `state.success.light/dark` | `#315E47` / `#A4C6AD` | Confirmed action only; never inferred engineering validity |

Calculated contrast for solid sRGB pairs: paper/charcoal **16.22:1**; copper/charcoal **5.17:1**; copperInk/paper **5.94:1**; secondary light text/paper **5.56:1**; secondary dark text/charcoal **8.67:1**. Copper/paper is only **3.14:1**, steel/paper **3.34:1**: do not use either for normal-size copy on paper. These are token calculations, not rendered accessibility certification. Opacity, images, blending and overlays change contrast.

Do not use mix-blend-difference for essential nav text. Use a solid charcoal header in cinematic mode, paper header over editorial content; switch at a section boundary without a flash. For cinematic copy, use an authored dark lower-left region plus a restrained charcoal scrim; if contrast cannot be guaranteed, use a solid panel. No blur/glass surface behind essential information.

## 3. Typography

Use the existing families: Big Shoulders Display 700/800 for short display headlines; Geist 400/500 for reading and controls; Geist Mono 400/500 for identifiers and metadata. No simulated light display weight, no third display/serif voice in the primary journey. Research may retain a quiet serif treatment on its own detail page.

| Role | Mobile 320–767 | Tablet/static 768–1023 | Desktop 1024+ | Line height / tracking |
|---|---|---|---|---|
| Hero h1 | 40–56px | 64–80px | clamp(64px, 6vw, 104px) | .98 / −.01em; 700 |
| Scene h2 | 36–48px | 48–64px | clamp(52px, 5vw, 80px) | 1.0 / −.005em; 700 |
| Editorial h2 | 32–40px | 44–56px | 56–64px | 1.05 / −.01em; 700 |
| Project h3 | 28–32px | 32–40px | 40–48px | 1.08; 700 |
| Lead | 18px | 20px | 20–24px | 1.45; 400 |
| Body | 16px | 17px | 18px | 1.6; 400 |
| Controls/table | 14–16px | 14–16px | 14–16px | 1.4; 400/500 |
| Metadata | 12px minimum | 12px | 12–13px | 1.5 / .08em; mono |

Uppercase only for display/short metadata; sentences and buttons use sentence case. Use real text, never burn site headings into imagery. Body measure 55–70ch; scene support copy ≤42ch; hero headline ≤18ch per line. Exact copy and preferred desktop line breaks are in the storyboard; mobile wrapping can change. Do not fix text container heights or clip ascenders/descenders.

Use one homepage h1 in scene 01, h2 for subsequent narrative chapters and Featured Work, h3 for project entries. The accessible heading tree must not depend on currently selected animation state.

## 4. Space and grid

Space tokens in px: `4, 8, 12, 16, 24, 32, 48, 64, 96, 128`. Use 4/8 for controls, 16/24 for related content, 32/48 for groups, 64–128 for section separation. Avoid a universal 128px spacer after every block.

| Viewport | Grid | Outer gutter | Gap | Section vertical padding |
|---|---|---|---|---|
| 320–767px | 4 columns | 20px (16 at 320) | 16px | 56–72px |
| 768–1023px | 8 columns | 32px | 24px | 80px |
| 1024–1599px | 12 columns | 40px | 24px | 96px |
| 1600px+ | 12 columns, content max 1440px | centered, ≥48px | 32px | 112–128px |

Full-bleed cinematic imagery may extend beyond the content grid. Reference storyboard canvas: 1920×1080. Keep upper 88px clear for nav, lower 88px clear for chapter controls. Editorial content after scene 05 returns to the same left text/grid axis. No arbitrary extra-wide project cards or floating panels outside these alignments.

## 5. Component language

- **Navigation:** 72px desktop / 64px mobile; identity left, Work/Industries/About center where space permits, Discuss a project right. Mobile menu button opens a properly labeled dialog with close, Escape, focus containment/return. Menu includes all section links. No custom cursor.
- **Chapter navigation:** five compact numbered buttons with full accessible names, visible active text and a thin copper rule. Min target 44×44px. Desktop bottom rail; static/mobile uses ordinary in-page links. Progress conveys reading position, not a fabricated completion score.
- **Primary action:** rectangular charcoal fill on paper, paper fill on dark; 48px minimum height; 20–24px horizontal padding; 2px radius. One scene-specific action at most. “View selected work” remains the shortest route to proof.
- **Secondary action:** text plus simple arrow, persistent underline or border. Entire label is the target. No magnetic motion. A hover arrow can move 2px; reduced-motion keeps it static.
- **Status label:** text first, modest rule/dot second. Preserve existing six project statuses and four capability states. Never map green to “shipped” unless status is confirmed. “Illustrative sample” is persistent within demos.
- **Project presentation:** editorial rows, one evidence-led feature, then compact related systems. Use actual output, schematic or screenshot based on the project; do not wrap every project in an identical card. Plans get less visual weight than verified delivered work.
- **Software frame:** honest application name/path, 1px border, 2px corner, no fake macOS traffic lights. One restrained shadow only when distinguishing document from background. Keep real interface typography legible; do not recolor screenshots to match the site if that misrepresents the product.
- **Data tables:** semantic table, text headers, readable units, explicit row status. On narrow screens use row details or a labeled overflow region, not microscopic type. Copper denotes selection, not engineering pass/fail.
- **Hotspot:** numbered button plus adjacent label and connector anchored to actual equipment/geometry. Never more than two visible in an optional explorer; none required to understand a scene.
- **Form:** persistent labels, helpful examples, native input semantics, explicit errors, pending/delivery failure/success states. Do not add a fake usable contact endpoint during the creative prototype stage.

## 6. Interaction states and priority

| State | Visual behavior | Input / accessibility contract |
|---|---|---|
| Default | Clear boundary or underlined text | Accessible name describes destination/action |
| Hover | CopperInk on paper/copper on dark; subtle rule emphasis | Never the sole way to reveal required content |
| Focus-visible | 2px high-contrast outline + 3px offset | Paper ring on dark, charcoal ring on paper; no outline clipping |
| Pressed | Surface change; no scale bounce | Native button/link activation |
| Selected | Copper rule + text/aria state | State must not rely on color alone |
| Disabled | Muted appearance + reason if needed | Actual disabled semantics; unavailable primary actions should usually be omitted |
| Loading | Stable dimensions + “Loading…” | Named status; skeleton only where space is known |
| Error | Message, recovery, preserved inputs | Focus error summary on submission failure; no repeated live announcements |
| Success | Explicit accepted action | Never display form delivery success without server acknowledgment |

**Priority 0:** read, skip, navigate, view case study, contact. **Priority 1:** one contextual scene action. **Priority 2:** optional explorer controls (departments, review decisions, drawing parameters). **Priority 3:** decorative progress and camera motion. Failure of a lower-priority layer must not block a higher one.

## 7. Motion rules

Every motion either establishes scale, explains a change of state or preserves an object relationship. No random particles, idle bobbing, glow sweeps, spinning icons, sound, autoplay video backgrounds or spring overshoot.

Continuous camera framing follows scroll linearly. Wipes use smoothstep `3u²−2u³`; opacity changes are linear. State feedback 120–180ms, menu/panel 180–240ms, optional programmatic chapter travel ≤400ms. User scroll speed controls the cinematic; its timeline units are not elapsed seconds. No snapping and no wheel/touch interception. Numerical choreography is exclusively in CINEMATIC_STORYBOARD.md.

Transforms and opacity are preferred; every mask must earn its paint cost in device review. Do not animate text blur or letter-by-letter headlines. Transition copy fades out before incoming copy appears; no two readable headlines collide. Copy is stationary during its reading hold.

## 8. Responsive and accessible modes

Proposed cinematic eligibility: width ≥1024px, height ≥700px, fine pointer and `prefers-reduced-motion: no-preference`, with decoded required plates and successful initialization. This deliberately tightens the current 768px gate; update CSS and JS together after approval. Any user can choose “Reduce motion”/static presentation. Data-saving preference uses static mode where detectable; do not rely on unsupported signals as the sole safeguard.

At smaller/shorter/touch viewports, use five compact editorial sections, not five full-screen panels: image around 40–55svh with natural-height text below, 48px chapter separation, work/industry shortcut in the first section. Tablet can use a 5/3 image/copy split. Large text/zoom that no longer fits the stage must fall back to natural document flow.

Reduced motion: static registered posters, no parallax, wipe, translation, sticky narrative or animated chapter scroll; normal links and working demos remain. No-JS and failed-GSAP mode use the same readable structure. Screen readers receive one logical sequence; hide decorative duplicates, never hide the sole copy. Do not announce scroll progress continuously. Inactive visual layers cannot contain focusable actions.

## 9. Featured Work continuity

Scene 05's application rectangle is the first work artifact, not a collage of invented dashboards. Use the Production Intelligence interface if an approved capture is supplied; otherwise use clearly labeled illustrative UI. At the end, the scroll stage unpins naturally above Featured Work. The next section begins “Selected systems.” with the same artifact identity and a link to its existing case study. Then show delivered engineering automation and the remaining work according to verified evidence. MOS may be explored, but its development status stays visible.

## 10. Handoff and approval

This document defines design intent; it does not approve production claims, asset licenses or full implementation. Keep the current framework and content/status model. The next creative review should approve five static compositions, four transition pairs and desktop/mobile text layouts before animation polish. Full implementation follows explicit approval and the source-baseline milestone in IMPLEMENTATION_PLAN.md.

## Visual and technical review checklist

- [ ] One clear identity and h1; scene 05 leads into actual work, not another generic hero.
- [ ] Essential typography never drops below specified sizes; line breaks survive zoom and localization-length copy.
- [ ] Copper/steel usages meet context-specific contrast; no blend-mode dependency for navigation.
- [ ] Grid, edges, borders, status labels and interaction targets follow the shared system.
- [ ] Every visible control works with keyboard and touch; focus is clear and restored after overlays.
- [ ] Static, reduced-motion, short-screen and loading-failure modes remain complete and useful.
- [ ] Project and sample labels remain attached to the evidence; no invented metrics or implied client affiliations.
- [ ] No full cinematic implementation or production publishing occurs before approval.
