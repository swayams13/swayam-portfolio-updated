# INDUSTRY → INTELLIGENCE — Cinematic storyboard

Production brief v1 · 31 October 2026 · Proposed choreography; no new assets or application implementation.

Companions: [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md), [ASSET_MANIFEST.md](ASSET_MANIFEST.md). Existing implementation: archive `src/components/site/Cinematic.tsx`, `src/lib/content.ts`, `src/lib/useCine.ts`. This specification replaces its proposed timing, not its source code. Current imagery is reference material, not evidence of a registered 3D scene or a real client facility. Browser rendering remains unreviewed because saved browser permissions blocked preview access.

## 1. Story and production decision

**Physical work → engineering information → built structure → usable place → operational software.** One line survives each transition, allowing the visitor to follow the relationship without a tutorial.

The baseline is **GSAP + registered still plates + HTML/SVG**, with modest 2D framing moves. Commission offline 3D source geometry to produce matching stills; this does not require Three.js in the website. A 2D zoom suggests a forward move but is not true spatial parallax. Do not sell the baseline as a continuous photoreal camera flight.

There are two intentional spaces: factory interior (01–02) and one development exterior (late 02–04). The move between them is an editorial match cut through a real structural line, not an impossible trip through a wall or a claim they are one client project. Within each pair, geometry/camera registration is exact. The architecture is illustrative, and structural dimensions below are art-direction geometry—not engineering design advice or construction documents.

```text
FACTORY MATERIAL → SAME FACTORY LINEWORK → STRUCTURAL LINE MATCH CUT
                                                ↓
                                    BUILDING FRAME → CONSTRUCTION
                                                          ↓
                                                    COMPLETED ASSET
                                                          ↓
                                                FACADE RULE → UI RULE
                                                          ↓
                                                     FEATURED WORK
```

## 2. Shared spatial and render contract

### Coordinate and lens conventions

All world coordinates in metres, right-handed: X right/east, Y forward/north, Z up. Positions/targets below are authoritative; use look-at with world up `(0,0,1)`, roll 0°. Render 36mm horizontal sensor gate, 16:9 image, zero lens distortion; focal length specified per rig. No handheld shake, depth-of-field rack or motion blur in still plates. Export camera transforms, projection, object-ID masks and color settings with source files. Adapt DCC axis conventions on import rather than reinterpret coordinates.

**Factory rig F:** 24m wide ×72m long hall; X −12…12, Y 0…72; 14m eaves. Camera F0 `(0,4,1.7)`, look-at `(0,44,6.5)`, 28mm. Central aisle remains clear; readable machinery/structure mostly in side thirds. The hero pair is rendered at this same locked camera. Geometry need not reproduce the current generated steel-mill machinery; prefer a credible fabrication/assembly bay aligned to Swayam's work, validated by an industrial reviewer. No unreviewed readable machine specification plates.

**Development rig B:** one 36m ×24m illustrative commercial/industrial campus building, X 0…36, Y 0…24, Z 0…28.8; eight 3.6m levels, 6m structural bays; completed facade subdivides bays into 1.5m panels. Preserve slabs, columns, corner, setbacks and window divisions across wire/construction/completed layers. Camera B0 `(-36,-48,8)`, look-at `(12,8,16)`, 35mm. Anchor is the southwest corner `(0,0,0…28.8)`. Artist supplies a fixed 2D framing transform to place its projected mid-height corner near `(62%,43%)` on the 1920×1080 composition. Apply that same transform to every B layer; do not independently recrop to “look better.”

The 3D dimensions define a consistent illustrative model, not a structural certification. During graybox review the camera may be revised once if necessary to meet safe areas; version the change and regenerate all dependent passes. Do not quietly adjust it during finishing.

### Layer hierarchy and safe areas

Back to front: environment plate → registered material/linework reveal → selective vector annotations → restrained readability scrim → HTML copy → navigation/chapter controls. Text is never rendered into a plate. No decorative background grid beyond geometry needed to explain a transition.

On 1920×1080 reference canvas: nav safe zone y=0…88px; chapter rail y=992…1080px. For scenes 01–04, copy lives x=6.25…43%, y=59…89%; dominant geometry lies x=48…88%, y=15…75%. Copy has eyebrow, max two-line heading, short support and one action. On narrow eligible desktop, use compact typography and support ≤40ch; if the group exceeds available height, choose static layout. Scene 05 copy moves to x=6.25…35%, y=35…76%; interface occupies x=40…94%, y=18…82%.

Use a 15% overscan master for framing transforms: 2560×1440 active composition inside 2944×1656 master. All paired exports share dimensions, active crop, alpha/masks and color transform. At 21:9 do not indiscriminately cover/crop away copy-safe geometry: use contained active composition with graphite side extension, or an approved wide derivative. At 4:3 use static layout unless separately composed.

## 3. Precise scroll timeline

### Units and mapping

Eligible desktop uses one sticky stage. Let `V` be its stable CSS viewport height in pixels captured at initialization; use a 600V/100 section height (6×V) with a stage height V, producing **5×V scroll travel**. Recompute on meaningful resize with progress preserved. The story starts when section top reaches viewport top and ends when section bottom reaches viewport bottom.

`p = clamp((scrollY − sectionTop) / (5 × V), 0, 1)`; timeline position `t = 100 × p`. Each unit is **5vh of travel**, not one second. A nominal 20-second animatic uses 0.2 seconds per unit solely for artist review; runtime has no fixed duration, autoplay or enforced dwell. Proposed scrub is direct (`scrub: true`), with no inertia lag so copy and actions agree with actual progress. No scroll snapping.

| Segment | Units / progress | Travel | Animatic equivalent | Scene / action |
|---|---|---|---|---|
| H01 | 0–16 | 80vh | 0.0–3.2s | Manufacturing reading hold and slow framing push |
| T12 | 16–22 | 30vh | 3.2–4.4s, 1.2s transition | Same-camera photo → technical linework |
| H02 | 22–36 | 70vh | 4.4–7.2s | EPC & Engineering; inspect one credible document relation |
| T23 | 36–44 | 40vh | 7.2–8.8s, 1.6s transition | Structural line match cut, then frame → material |
| H03 | 44–58 | 70vh | 8.8–11.6s | Construction; upward framing move |
| T34 | 58–66 | 40vh | 11.6–13.2s, 1.6s transition | Same building construction → completion |
| H04 | 66–80 | 70vh | 13.2–16.0s | Real Estate; gentle facade push |
| T45 | 80–88 | 40vh | 16.0–17.6s, 1.6s transition | Facade rule → interface rule; software appears |
| H05 | 88–100 | 60vh | 17.6–20.0s | Digital Intelligence; camera stationary; work CTA |
| Release | after 100 | natural document flow | no timed transition | Sticky stage releases; Featured Work follows |

The segments are contiguous and total 100 units / 500vh travel. Stage contributes another 100vh of physical section height. At V=900px, section height=5400px and scroll travel=4500px. This is shorter than the current 700vh hero; downstream showcases must not add another forced sequence.

**Chapter ownership boundaries:** 01 `[0,19)`, 02 `[19,40)`, 03 `[40,62)`, 04 `[62,84)`, 05 `[84,100]`. Boundaries are transition midpoints, distinct from fully readable holds. Chapter buttons land at **0, 24, 46, 68, 90** units respectively. The latter four land after incoming copy is complete. The current chapter label updates discretely at these boundaries; it is not an aria-live progress announcement.

### Copy and controls during transitions

At every T segment, outgoing copy opacity goes 1→0 across its first two units; incoming copy opacity goes 0→1 across its last two units. Both remain spatially fixed; no sliding/staggered words. Incoming CTA is enabled only after its copy is fully shown. Scene 01 copy exists at first paint with no entrance delay. DOM reading order remains logical in the accessible/static layer.

Always preserve a stable “View selected work” link and chapter controls outside the fading copy. On keyboard focus entering the cinematic, suspend automated visual layer switching and present the relevant static content/controls until focus leaves or the user explicitly resumes motion. Never make a focused control inert or remove it because scrolling crossed a boundary. No camera effect may trap scrolling.

## 4. Baseline 2D camera/framing keyframes

Values are applied to a common paired-image wrapper, **scale first, then translation in percentages of stage width/height**. Transform origin is normalized to the stage; use inner image fit with the same crop for all pair members. At shared boundaries the outgoing and incoming registered layers inherit identical transforms. Linear interpolation within holds. “Push” and “rise” here mean framing of stills, not invented 3D parallax.

| Units | Layer rig | Scale start→end | Translation x/y start→end | Origin | Purpose |
|---|---|---|---|---|---|
| 0–16 | F photo | 1.04→1.10 | (0,0)→(0,0) | (50%,43%) | Move attention into factory aisle |
| 16–22 | F photo + line pair | 1.10→1.10 | (0,0) | (50%,43%) | Frozen registration for technical reveal |
| 22–36 | F line pair | 1.10→1.12 | (0,0)→(0,−1%) | (50%,43%) | Very restrained engineering inspection |
| 36–40 | F line outgoing | 1.12 fixed | (0,−1%) | (50%,43%) | Hold the structural edge for match cut |
| 40–44 | B wire + construction | 1.04 fixed | (0,0) | (62%,43%) | Establish new environment without a fly-through |
| 44–58 | B construction | 1.04→1.08 | (0,0)→(0,−2%) | (62%,43%) | Reveal upper structural order |
| 58–66 | B construction + completed | 1.08 fixed | (0,−2%) | (62%,43%) | Material completion without geometry shift |
| 66–80 | B completed | 1.08→1.12 | (0,−2%)→(−1%,−2%) | (62%,43%) | Bring facade divisions forward |
| 80–84 | B completed | 1.12→1.16 | (−1%,−2%) fixed | (62%,43%) | Small final push, no giant pixelated zoom |
| 84–88 | DOM interface | 1.00 fixed | (0,0) | center | Opacity reveal only; no pseudo-3D screen tilt |
| 88–100 | DOM interface | 1.00 | (0,0) | center | Readable software and direct work navigation |

Do not add per-layer parallax with guessed depth values. Baseline plates alone cannot reveal unseen geometry. The approved graybox/contact-sheet composition must demonstrate safe crop at all endpoints.

### Optional true camera-motion upgrade, separate approval

Only if the baseline cannot deliver approved depth: render F camera from F0 to `(0,6.5,1.7)`, target from `(0,44,6.5)` to `(0,46.5,6.5)`, 28mm across 0–16; freeze at that camera through 36. B camera rises from B0 to `(-36,-48,9.5)`, target from `(12,8,16)` to `(12,8,17.5)` across 44–58; freeze through 66. Across 66–80 dolly B to `(-34.5,-46.25,9.75)` and target stays `(12,8,17.5)`, 35mm. Freeze after 80 and perform UI transition in DOM. Use linear coordinate interpolation, no lens animation. Re-render paired material passes at these same cameras; never combine moving photo with stationary linework. Disable the baseline wrapper zoom/rise when using true camera frames—do not double the motion. No realtime WebGL is required for this upgrade.

## 5. Scene 01 — Manufacturing

1. **Narrative purpose:** establish the scale of physical operations and introduce the challenge of coordinating jobs, people and information. Identify Swayam immediately through navigation and role eyebrow.
2. **Environment:** credible fabrication/assembly hall, clear central aisle, structural bays and inactive equipment. No flying sparks, unsafe worker staging or generic science-fiction plant. Existing mill image is tonal reference, not a client photograph.
3. **Camera position:** F0, 28mm, eye height 1.7m, zero roll; shared with the linework plate.
4. **Camera movement:** 0–16 framing push 1.04→1.10; central perspective establishes depth. Optional actual dolly is specified above, not assumed to exist.
5. **Lighting:** large warm side opening from frame right, diffuse daylight fill from roof. Suggested scene light temperatures 4800K key/6500K fill; protect metal highlights. No animated furnace glow. Grade restrained warm-neutral, not orange/teal.
6. **Composition:** vanishing point near (50%,43%); machinery in outer thirds; quieter/darker lower-left copy area. Avoid cropping machinery into ambiguous shapes.
7. **Text placement:** standard lower-left safe zone; role eyebrow “Swayam Singh · AI & Software Solutions Consultant”; headline max two lines on desktop; support underneath.
8. **Headline:** “Software for industries / that build the world.” (the slash marks a preferred line break, not literal punctuation).
9. **Supporting copy:** “I design AI, automation and custom software around the realities of industrial work.”
10. **Interactive elements:** one contextual link, “Explore a production workflow.” Global “View selected work” remains available. No factory hotspots in the opening.
11. **Entry transition:** immediate static photo and copy at initial paint. No loader curtain or fade from black.
12. **Exit transition:** T12, 16–22: a left-to-right material/linework wipe on the same camera, smoothstep mask from x=0→100%. A 1px copper edge accompanies the reveal only; no glow. Existing drawing details become clearer, not more numerous.
13. **Required assets:** F-PHOTO, F-LINE, F-EDGE mask/anchor map, mobile F poster; production workflow fixture or verified capture for linked explorer. All final versions to create/supply.
14. **Mobile adaptation:** 4:5 portrait crop with aisle visible; photo above copy; no zoom or pinning. Early work shortcut avoids scrolling all chapters.
15. **Reduced-motion fallback:** F-PHOTO as static illustration, full text and direct workflow link; engineering follows as a separate static section.

## 6. Scene 02 — EPC & Engineering

1. **Narrative purpose:** show that useful automation starts with structured engineering inputs and traceable decisions, not a decorative wireframe effect.
2. **Environment:** same F hall in selective technical linework. One small HTML/SVG document panel explains drawing revision → BOM → review. The perspective linework is explicitly a schematic visualization, not a certified CAD deliverable.
3. **Camera position:** exact F0 projection and framing inherited from T12. No new perspective introduced during the wipe.
4. **Camera movement:** 22–36 scale 1.10→1.12 and y 0→−1%; no orbit. Document panel remains screen-fixed and readable.
5. **Lighting:** neutral graphite background; line passes use paper at reduced intensity, selected member copper. Hidden-line removal, no full mesh triangulation. Keep the material pair's silhouette rather than arbitrary technical noise.
6. **Composition:** one selected right-side structural bay; line thickness 1–1.5px at 1920 output for primary edges, secondary 0.5–0.75px. Document panel upper right x=66…92%, y=20…48%, no overlap with copy.
7. **Text placement:** lower-left standard zone. Panel contains maximum three rows and a “Illustrative workflow” label, not unreadable blocks of text.
8. **Headline:** “Engineering information. / Connected workflows.”
9. **Supporting copy:** “Bring calculations, drawings and bills of materials into traceable engineering workflows.”
10. **Interactive elements:** “Inspect an engineering process” opens the optional existing bellows-drawing workflow after implementation. No parameters can be mistaken for an approved design calculator. Supply actual redacted engineering outputs when permitted.
11. **Entry transition:** same-camera T12. Incoming copy at 20–22; documentation panel opacity 0→1 at 22–24, no motion.
12. **Exit transition:** T23 at 36–44. Fade panel at 36–38. At 36–38 isolate one real column edge while other linework dims; retain a vertical screen-space line at x=62%, y=22…73%. At 38–40 F linework fades into B wireframe, aligned by that edge; call this an editorial match cut. At 40–44 reveal B construction material bottom→top with a soft 2% height mask edge. Avoid implying factory equipment morphs physically into a building. Copy switches using shared timing.
13. **Required assets:** F-LINE, approved DOC-ENG vector/panel data, B-LINE, B-CONSTRUCTION, explicit screen-space anchor coordinates. Existing generated dimension marks are not acceptable engineering documentation.
14. **Mobile adaptation:** static factory linework with three-row document panel below the image or inline in the text; no layer overlay at tiny sizes. Engineering CTA remains a normal link.
15. **Reduced-motion fallback:** show linework then a readable “Drawing → BOM → Review” diagram; no wipes, masked shift or synthetic morph.

## 7. Scene 03 — Construction

1. **Narrative purpose:** connect design information to site coordination, quantities, documents and review.
2. **Environment:** the single B development mid-construction, slabs and columns consistent with its finished state. Place scaffolding/crane outside the corner used for registration. No random construction-site swap.
3. **Camera position:** B0, 35mm, view from southwest, zero roll, same projection as B-LINE and B-COMPLETE.
4. **Camera movement:** 44–58 slight scale increase and 2% upward framing shift; reads as attention moving up the structure. No fake drone acceleration. True rise only via optional rendered path.
5. **Lighting:** soft late-afternoon light from image right; no dramatic sun jump relative to completion. Construction and completed material passes use the same sun direction, sky and exposure.
6. **Composition:** southwest corner near x=62%; slab bands legible; left third quiet. Remove foreground obstruction over key structural anchors.
7. **Text placement:** lower-left standard zone, separate from building identification annotations.
8. **Headline:** “From drawings / to coordinated delivery.”
9. **Supporting copy:** “Turn project documents and quantities into structured information that teams can review and use.”
10. **Interactive elements:** “Analyze a sample BOQ.” Link to one deterministic sample with source, extracted items, flagged issues and review actions. No upload requirement and no claim of live AI extraction.
11. **Entry transition:** B wireframe becomes construction via T23's bottom-up reveal. At 44 the construction state is fully opaque and copy fully readable.
12. **Exit transition:** T34 58–66: use eight registered floor-band masks. Band j=0…7 begins at `58 + 0.75j`, completes 2 units later; bands reveal completed materials bottom→top, overlapping softly. Final band ends 65.25; remove remaining crane/scaffolding via their masks at 64–66. Buildings do not stretch, grow floors or change silhouette. This is a conceptual state comparison, not a construction sequencing claim.
13. **Required assets:** B-LINE, B-CONSTRUCTION, B-COMPLETE, eight floor masks, separate temporary-works mask, matching clean sky/background, B mobile still.
14. **Mobile adaptation:** portrait construction poster; optional discrete “Frame / Complete” buttons outside the narrative only if useful, with immediate image switch. BOQ demo uses stacked rows rather than horizontal desktop screenshot.
15. **Reduced-motion fallback:** construction and completion appear in consecutive static sections with a plain explanatory caption; no floor-by-floor effect.

## 8. Scene 04 — Real Estate

1. **Narrative purpose:** show the outcome of engineering/construction and the continuing need for reliable project and property information. Do not imply Swayam developed or manages the depicted building.
2. **Environment:** completed B development from identical camera. Use restrained stone/metal/glass, plausible occupied interior cues and landscaping at ground level. No luxury-sales CGI tropes, pools or unrelated skyline.
3. **Camera position:** same B0 and crop. Completed facade aligns exactly with construction slab/column axes.
4. **Camera movement:** 66–80 framing push 1.08→1.12 with x drift −1%; keeps the shared corner in view. Target a facade bay that can supply the interface alignment line.
5. **Lighting:** preserve construction sun/sky/exposure; interior practical lights may be baked subtly into the complete plate. No accelerated day-to-night timelapse.
6. **Composition:** facade grid prominent on right; clear quiet left; keep full architectural context until T45. The left edge of the selected bay supplies a vertical rule, one sill supplies the horizontal rule.
7. **Text placement:** lower-left standard zone; no sales figures or “projects delivered” claims.
8. **Headline:** “Built assets. / Better information.”
9. **Supporting copy:** “Connect project records, property information and operational workflows beyond handover.”
10. **Interactive elements:** one text link “Explore property workflows” to the industry-filtered work/solutions view. Do not fabricate a real-estate case study: BOQ may be relevant but must retain its prototype status.
11. **Entry transition:** T34 finishes in exactly the same projected building, now completed. No camera cut.
12. **Exit transition:** T45 80–88. At 80–82 reveal a DOM/SVG tracing of the selected facade rule; at 82–84 fade photograph 1→0 over graphite while retaining that tracing. At 84–86 interpolate its screen-space quadrilateral to the interface frame rectangle x=40…94%, y=18…82%; at 86–88 fade interface content in. The scene-05 copy appears at 86–88. Use plain lines; no luminous portal, flying dashboard or zoom into a window claiming interior access.
13. **Required assets:** B-COMPLETE, facade anchor map (four projected corner points and selected sill/mullion), B mobile complete poster, approved product capture/DOM fixture.
14. **Mobile adaptation:** static completed-building crop, then ordinary text and relevant-work link. No perspective warp.
15. **Reduced-motion fallback:** static complete building with next section showing software directly; explanatory narrative bridges them without animation.

## 9. Scene 05 — Digital Intelligence

1. **Narrative purpose:** reveal what Swayam actually works on and move directly into evidence. The industry imagery becomes context for software, not a substitute for proof.
2. **Environment:** charcoal canvas, one legible Production Intelligence interface/fixture, and a restrained “Selected systems” identifier. No invented screen collage or KPI wall.
3. **Camera position:** screen-space orthographic presentation; no physical camera. Interface front-on with square edges, no perspective skew.
4. **Camera movement:** none during 88–100. Keep text and UI steady for inspection.
5. **Lighting:** flat UI surfaces; no photoreal reflections over the interface. Use real product styling if approved capture differs from site palette.
6. **Composition:** interface in right 54% of frame; copy left 29%; visible title/status and three representative rows minimum. Frame crops must preserve the task being explained; never squeeze an entire desktop app into a tiny rectangle.
7. **Text placement:** left middle safe zone; project name/status above interface; “Illustrative sample” remains visible until real evidence is supplied and approved.
8. **Headline:** “The systems behind / the work.”
9. **Supporting copy:** “Explore production software, engineering automation and document workflows—each with its scope and current status made clear.”
10. **Interactive elements:** primary “View selected work” → `#work`; secondary “Open a MOS module” only as an optional explorer entry, visibly marked in development. Inside the cinematic the UI is a preview, not a live nested app. Real controls live below the stage/in explorer.
11. **Entry transition:** interface frame aligns from facade at T45, content opacity completes at 88. No UI elements animate independently for spectacle.
12. **Exit transition:** at 100 normal sticky release; no fade to a second copy. Featured Work is the immediate next section, heading “Selected systems.” Its first project refers to this same Production Intelligence artifact. It may repeat a title for navigation clarity, but must not repeat a giant hero or force another long scroll demonstration.
13. **Required assets:** UI-PRODUCTION approved capture or existing illustrative component refined later; UI-MOS fixture/capture with capability states; Featured Work evidence images and metadata. None of the actual product captures is currently supplied in the archive.
14. **Mobile adaptation:** cropped legible task screenshot or actual DOM rows, text and work CTA; no fake small-screen desktop interface. Status labels remain readable.
15. **Reduced-motion fallback:** identical static DOM/content; work follows immediately. No sticky release animation is necessary because there is no pinned stage.

## 10. Interaction routing and state contract

| Priority / trigger | Intended destination after approval | Minimum useful behavior | Existing anchor / fallback |
|---|---|---|---|
| P0 global work | Featured Work | Direct navigation; focus heading on explicit activation | `#work` exists |
| P1 production | Production workflow explorer | Select job/stage, read owner/handoff, reset sample | `#production-intelligence`; case study `/work/production-intelligence` |
| P1 engineering | Engineering explorer | Select step/dimension, inspect a corresponding input/output | `#engineering-automation`; `/work/engineering-automation#workflow` |
| P1 BOQ | BOQ sample explorer | Source highlight, accept/edit/reject flagged rows, reset | `#boq-intelligence`; `/work/boq-intelligence#workflow` |
| P1 property | Proposed industry-filtered work view | Show relevant verified scope/status; no empty fake case study | Until implemented, link to BOQ case study with honest wording |
| P2 MOS | Department explorer | Engineering→procurement→production sample handoff; capability state on each panel | `#manufacturing-operating-system`; `/work/manufacturing-operating-system` |

Prefer in-page destinations or existing case-study routes over a modal inside the pinned experience. This avoids nested scroll traps and lets a visitor resume via browser back/section links. If a later design uses a dialog: pause decorative motion, preserve scroll, focus dialog heading, Escape closes, restore trigger focus; no timeline progression while the dialog is active. No demo changes a real system or sends user data.

## 11. Implementation handoff constraints

- Keep scene/content metadata in the existing typed content layer; proposed fields include `holdStart`, `holdEnd`, `transition`, `plateIds`, `copy`, `cta`, `poster`, `focalPoint`, `sampleState`. Do not create a parallel untyped source of copy.
- Static semantic sections render first. Enable cinematic positioning only when eligible and required plate pairs are decoded. If readiness is late or user has already moved beyond the intro, retain static mode for that visit to avoid layout jumps.
- A missing transition asset must not create a blank or misregistered scene. Remain static, or use an explicitly approved simple cut; never stretch unrelated imagery to fake continuity.
- Use refs/timeline values for continuous transforms, discrete React state for chapter selection. On cleanup revert styles and observers; on resize remeasure without duplicating animation instances.
- Every reverse-scroll frame is defined by the same timeline. No one-way DOM mutation, frame-counter increment or construction animation that cannot run backward.
- Global work/consultation links and a static narrative remain available with image failures and no JS. No dependencies, providers or framework migration are authorized by this storyboard.

## Visual and technical review checklist

- [ ] Graybox approval: F and B camera rigs, active crop and all transform endpoints fit copy-safe zones.
- [ ] Factory/photo and factory/line passes align; B wire/construction/completed share exact geometry, lens, sky and crop.
- [ ] Factory→building reads as an intentional editorial match cut, not false same-site continuity.
- [ ] Engineering labels/drawing relationships are domain-reviewed; no generated pseudo-dimensions survive.
- [ ] T12/T23/T34/T45 and copy fades follow the exact unit ranges; no overlap, gap or unreadable double headline.
- [ ] Construction completion does not change floor count, silhouette or structural location.
- [ ] Facade→UI uses the supplied anchor map; UI text remains legible, sample/status disclosures remain visible.
- [ ] Five chapter destinations, work skip and reverse scrolling behave consistently; focused controls never disappear.
- [ ] Static/mobile/reduced-motion modes retain all five meanings without forced full-screen scrolling.
- [ ] No-JS, failed assets, delayed decode, resize, back-navigation and short-height screens remain usable.
- [ ] Browser/device rendering, contrast, keyboard and screen-reader review completed before approval to release.
- [ ] Final assets, optional rendered upgrade and full implementation separately approved; this document alone is not a launch instruction.
