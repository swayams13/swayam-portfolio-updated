# INDUSTRY → INTELLIGENCE — Asset production manifest

Production brief v1 · 31 October 2026 · **No new cinematic assets have been created.**

This file is the current planning manifest. It supersedes the stale manifest **inside** `five-scene-homepage-story.zip` for future implementation; the ZIP and its internal document remain unchanged. Camera rigs, registration, masks and timing are specified in [CINEMATIC_STORYBOARD.md](CINEMATIC_STORYBOARD.md); UI/color/type in [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md).

## 1. Status definitions and inventory basis

- **Exists / reference:** physically present in the archive, usable for exploration; neither final quality nor licensing clearance implied.
- **Exists / illustrative component:** source UI is present; not a screenshot or evidence of a deployed product.
- **Create:** commissioned or authored asset required; not currently available.
- **Supply + clear:** owner/client must provide the real artifact and approve its use/redaction.
- **Optional:** outside baseline; do not download, render or implement without the separate decision described here.

The archive was inventoried and extracted unchanged for audit. All six JPEGs are 1920×1088, together 2,336,862 bytes. All six have been visually inspected across the audit/creative phases. Filenames below refer to archive-relative paths. No raw CAD, 3D model, registered render passes, video, frame sequence, real product capture, portrait, font binaries or licensing receipts were found in the supplied application assets.

| Existing path | Bytes | Actual content / use | Decision and rights status |
|---|---:|---|---|
| `src/assets/scene-01-manufacturing.jpg` | 335,610 | Warm steel-mill aisle; current manufacturing photo plate | Exists/reference. Good scale/perspective; final fabrication/assembly setting should better match actual consulting work. Archived manifest calls it AI-generated; provenance/license evidence not supplied |
| `src/assets/scene-01b-manufacturing-wire.jpg` | 593,173 | Similar factory aisle in dense linework, with unverified dimension marks | Exists/reference. Not a real CAD document; cannot assume exact registration or dimensional correctness |
| `src/assets/scene-02-engineering.jpg` | 350,238 | Different vessel/process hall linework; engineering project image | Exists/reference. Do not use for a same-camera transition from the factory aisle |
| `src/assets/scene-03-construction.jpg` | 282,545 | Low-angle building corner, cranes and sunset | Exists/reference. Use tone/corner motif only until B model produces matching passes |
| `src/assets/scene-03a-structure-wire.jpg` | 491,053 | Similar building and crane linework | Exists/reference. Generated-like dimension marks must be removed/replaced with reviewed annotation |
| `src/assets/scene-03b-completed.jpg` | 284,243 | Similar completed building, glazing, dusk sky | Exists/reference; not guaranteed same geometry/camera/lighting as construction. This is the actual scene-04 file |
| `src/components/site/IntelligenceUI.tsx` | source | Sample production overview | Exists/illustrative component; not a supplied real product capture |
| `src/components/site/work/{MOS,Production,Engineering,Tender,BOQ}.tsx` | source | Sample dashboards, SVG drawing, tender and BOQ fixture views | Exists/illustrative components. Useful design starting points; several visible controls are not functional |
| `public/favicon.ico` | 20,373 | Existing favicon | Exists; inspect/replace as identity work, rights not established here |

`scene-04-realestate.jpg` **does not exist**. The older internal manifest's four-project count and status labels are outdated; use current `content.ts` status types and ten-project inventory. `Scene.video` and `plates.*.video` are not interchangeable implementations; adding a file does not magically enable scrubbed sequences.

## 2. Master standards

**Source handoff:** editable DCC project with version/readme, linked textures packaged, cameras in metres, object names/IDs, material variants, lighting, render settings and color-management profile. Artist may use a suitable DCC; do not introduce runtime 3D just to consume its output.

**Image masters:** 2944×1656 with centered 2560×1440 active composition and 15% overscan relative to active dimensions. 16-bit EXR or TIFF for graded material/lighting masters; 16-bit PNG/TIFF lossless registered image deliveries where needed. Output web images in sRGB with correct embedded color metadata. Use one fixed exposure/color transform for every matched pair; no independent auto-enhancement/sharpening. Web output active sizes 2560×1440, 1920×1080, 1280×720; if animation requires overscan, export corresponding oversized raster and record active rect in manifest metadata rather than mislabel its natural dimensions.

**Masks:** lossless grayscale PNG at the exact paired master resolution; white=revealed, black=hidden. Supply soft-edge masks separately from binary object-ID masks; no JPEG alpha approximations. Simple straight wipes can be CSS/SVG instead of downloading mask images. Floor/temporary-work masks must trace real model geometry.

**Mobile posters:** recompose from the same model, 1080×1350 (4:5), variants 720×900 and 480×600; avoid blindly center-cropping desktop. Preserve the identifiable aisle/building corner; text sits outside the image. If ground context cannot fit 4:5, provide a separately approved 1080×1080 version rather than distorting geometry.

**Vector documentation:** SVG with viewBox, named groups, sanitized markup, no external resources/scripts, selectable/readable HTML text where practical; PDF source optional for provenance/download, never a required hero download. All dimensions/revisions/captions reviewed by a domain-competent owner.

## 3. Required assets by ID

The IDs below are production identifiers, not claims that these files already exist. File naming after approval: `cine/{rig}/{state}/{id}-{width}w-v01.{avif,webp,jpg}`; registry records active crop, camera/version, rights, alt strategy and derivative hashes. Keep masters outside the initial web bundle.

| ID / scene | Deliverable and exact relationship | Dimensions / formats | Load strategy / mobile alternative | Status / ownership |
|---|---|---|---|---|
| F-SOURCE / 01–02 | Credible fabrication hall model, F0 camera, photo and selective line materials; no unnecessary mesh edge noise | Editable DCC + packaged licensed textures; camera JSON/CSV | Production only, never shipped; same source produces portrait poster | Create; commissioned rights/source handoff required |
| F-PHOTO / 01 | Factory material plate at F0, copy-safe composition | Master standard; web AVIF/WebP with JPEG fallback | Only responsive first-scene candidate high priority; mobile F-MOBILE | Create; existing JPEG is reference only |
| F-LINE / 02 | Same F geometry/camera/exposure framing; hidden-line render, no fabricated text | Registered master; WebP/AVIF for image, SVG for clean annotations | Fetch after first-paint essential work when cinematic eligible; decode before T12 | Create; source renderer rights follow F-SOURCE |
| F-EDGE / T12/T23 | Named actual bay edge, registration reference and anchor coordinates; optional silhouette mask | JSON normalized coordinates + SVG line; PNG master if irregular mask needed | Tiny vector bundled with experience; omit decorative tracing mobile | Create; engineer and artist agree on projection |
| DOC-ENG / 02 | Redacted drawing revision/BOM relationship, or clearly labeled sample authored from reviewed geometry | SVG viewBox 1000×620; source PDF if cleared; raster preview 1600×992 | Lightweight preview near scene 02; full document only on explicit request; mobile HTML three-row summary | Supply + clear real evidence, or create honest sample; existing bellows SVG is illustrative reference |
| B-SOURCE / 02–04 | One B development model, B0 camera; wire, construction and complete material states; stable floor count | Editable DCC/textures; camera and projection export | Production only; all exterior derivatives from this model | Create; architecture/texture rights and no unapproved real-project attribution |
| B-LINE / T23 | Selective structural line render using B0 | Registered master + web variants | Near scene 02, only when paired construction is ready; static mode can omit transition-only plate | Create |
| B-CONSTRUCTION / 03 | B frame/materials, scaffolding and crane separate from permanent geometry | Registered master + web variants | Prefetch one chapter ahead; B-MOBILE-CONSTRUCTION on phones | Create |
| B-COMPLETE / 04 | Same building complete, same lens/sky/sun/crop as construction | Registered master + web variants | Prefetch near 03; B-MOBILE-COMPLETE on phones | Create |
| B-MASKS / T23/T34 | Eight floor-band IDs, construction temporary works, clean background and silhouette masks | Grayscale PNG master; delivery max 1920×1080 unless quality demands more; 8 bands + separate temporary-work mask | Load with B pair; browser may use simple vector masks if matched proof supports them; none mobile | Create; no per-floor geometry inventions |
| B-ANCHORS / T45 | Four projected facade-corner points plus chosen sill/mullion, under the fixed B crop | JSON normalized 0…1 coordinates + small SVG reference | Load with experience; scene 05 HTML frame consumes it; omitted static mode | Create; generated from projection, not guessed by frontend |
| F-MOBILE / 01–02 | Factory material portrait and corresponding linework portrait | 1080×1350 / 720×900 / 480×600; AVIF/WebP/JPEG | Material eager; linework lazy; natural-height sections | Create from F-SOURCE |
| B-MOBILE-CONSTRUCTION / 03 | Reframed B construction portrait | Same mobile standard | Native lazy loading, decode near viewport | Create from B-SOURCE |
| B-MOBILE-COMPLETE / 04 | Exactly matching completed portrait | Same mobile standard | Native lazy loading; reduced-motion poster | Create from B-SOURCE |
| UI-PRODUCTION / 05 | Approved production tracking task view with meaningful rows and actual status; existing illustrative DOM is interim fallback | Screenshot master 2400×1500 PNG; 1600×1000 / 1200×750 WebP; HTML preview preferred where available | Defer until approaching 05; mobile task crop 1080×810, or responsive rows; no tiny entire desktop screenshot | Supply + clear. No real capture exists in archive |
| UI-MOS / optional explorer | Department/job handoff fixture or approved current application capture with planned features marked | Responsive HTML fixture; screenshot 2400×1500 PNG if useful | Load on explorer entry; compact mobile department list | Existing illustrative source; final fixture/capture needs review and completion |
| DOC-BOQ / optional explorer | One sample document and deterministic extracted rows including missing quantity, duplicate and unit review | 2-page max PDF source, each 1240×1754 preview WebP; typed JSON rows + source box coordinates; accessible HTML transcript | JSON/HTML on explorer entry; PDF download on request; mobile stacked rows | Create reviewed/redacted sample from existing six-line fixture; current UI is not a real supplied source PDF |
| EVIDENCE-ENG / Featured Work | Approved calculation/BOM output showing actual delivered scope, not an invented successful calculation | 2000px-wide PNG master; WebP derivatives; source PDF/XLSX only if authorized | Lazy below fold; mobile annotated crop; accessible caption/transcript | Supply + clear from Swayam/client |
| EVIDENCE-PRODUCTION / Featured Work | Approved task screenshot + optional short workflow recording with status/date | Screenshot as UI-PRODUCTION; optional 1920×1080 MP4 H.264/WebM + WebVTT, 30fps recording | Poster lazy; recording `preload=none`, controls, explicit playback; mobile 720p | Supply + clear; recording not created |
| PORTRAIT / About | Professional environmental or neutral portrait; no simulated identity | 1600×2000 master, 800×1000 and 480×600 WebP/AVIF | Lazy below fold | Supply + clear photographer and subject rights |
| BRAND-SOCIAL / metadata | Simple name/role/industrial line composition; favicon | OG 1200×630 PNG/JPEG; SVG favicon + 32/48px ICO + 180px touch icon | Metadata/favicon only; not part of cinematic budget | Create; existing favicon is unapproved reference |
| FONTS / all | Big Shoulders Display 700/800, Geist 400/500, Geist Mono 400/500 or equivalent verified variable subsets | WOFF2 + license files; dimensions not applicable | Preload only critical subset(s); fallback immediately, font-display swap; avoid all weights | Families referenced via Google Fonts now; local binaries and license records must be supplied/verified before self-hosting |

If approved real UI is not ready, scene 05 must keep the visible “Illustrative sample” label and link to accurately described work. Do not quietly substitute invented product screenshots. The final hero can use commissioned illustrative architecture with disclosure in media credits; it cannot be captioned as a client site.

## 4. Loading strategy and proposed budgets

All values here are planning ceilings, not achieved compression measurements. Reject a derivative that meets bytes by destroying technical line fidelity; simplify the composition or defer it instead.

| Asset class | Proposed transfer target | Scheduling |
|---|---|---|
| First mobile poster | ≤180 KiB at chosen candidate | High priority; no simultaneous hidden desktop image fetch |
| First desktop plate | ≤350 KiB at chosen candidate | High priority; text and navigation paint without awaiting it |
| Subsequent desktop material plate | ≤350 KiB each | One chapter ahead; bound concurrent requests |
| Dense linework plate | ≤450 KiB each | Only enhanced mode; prefer fewer meaningful lines over noisy compression |
| Next mobile poster | ≤150–180 KiB each | Near-viewport lazy decode, not all five eager |
| Mask/anchor package | ≤200 KiB transfer total target | Prefer vector/simple procedural wipe where equivalent; check decoded size separately |
| UI screenshot | ≤250 KiB desktop / ≤140 KiB mobile | Near scene 05; prioritize HTML fixture if lighter and more legible |
| Critical mobile resources | ≤1 MiB total, including first poster/fonts/application | Same provisional budget as implementation plan; measure production waterfall before claiming pass |
| Full desktop cinematic still package | ≤2.5 MiB on demand | Across entire journey, not all initial-load resources; verify at export |

Use `<picture>`/srcset/sizes and art-directed mobile sources; CSS-hidden duplicate img/video nodes do not establish a no-download guarantee. Pair dimensions and registration must remain equal at each selected resolution. Decode only current/next needed plates and release unused high-resolution image/canvas references where applicable. An image's compressed size is not its decoded GPU/memory size.

Do not delay reading/consultation behind a “Loading experience” curtain. If first required pair has not decoded before an early user scroll, retain static mode; no late pinning jump. Mid-story missing assets degrade to static chapter content. Failed optional demos retain their textual explanation and case-study link. Do not prefetch PDFs, videos, every case-study hero or optional sequences with the first scene.

## 5. Optional rendered-motion package — not baseline

If the true camera upgrade in the storyboard is approved, render frame sequences rather than trying to scrub arbitrary autoplay video. Artist review animatic is 20 seconds at 24fps: 480 frame samples, f=0…479; position `t=100*f/479` so both endpoints are represented. Use the specified optional F/B camera paths; HTML copy/UI are composited in browser, not baked into frames. Export only camera-varying spans for web use; static holds do not need repeated identical frames. Deduplicate shared endpoints.

Source frames 1920×1080 lossless PNG/EXR; trial browser variants 1280×720 WebP/AVIF, optional 1920 tier only after tests. Render photo/line material pairs for matching camera frames if their transition moves. Keep an index manifest with span, frame count, frame rate for review, projected camera, URLs, dimensions and content hashes. Do not request all 480 images in a browser.

Suggested pilot: a single factory dolly, 0–16 units, nominal 3.2 seconds at 24fps; export endpoint-inclusive 78 frames (sample the exact start/end poses), then tune sampling after visual review. Cap decoded working set to current/nearby frames (initial proposal ≤12 at 1280×720, about 42 MiB raw RGBA); reduce on constrained devices. Cancel obsolete fetches on large scroll jumps and show nearest available frame/poster. No frame-sequence preload on mobile/reduced-motion mode. Target pilot transfer ≤3 MiB; if it cannot meet quality within an approved resource budget, retain stills. These are constraints to test, not performance promises.

Review MP4/WebM may be delivered for approval, but it is not automatically a usable scroll-scrub asset. Real-time Three.js models/textures are not requested by this baseline brief.

## 6. Rights, ownership and evidence controls

Maintain a record per ID: creator, source URL/file, acquisition date, license/version, invoice/permission reference, modification and derivative rights, web/commercial distribution rights, attribution requirements, expiry, client approval, redaction approval and status. “Present in repo” and “AI-generated” do not mean cleared for publication.

- **Commissioned renders:** contract must cover web/commercial use, derivatives, editable source/camera delivery and licensed textures/models. Keep receipt/attribution of third-party model libraries. Remove third-party brands unless authorized.
- **Generated reference plates:** record tool/model/date and applicable terms if reused; inspect for recognizable properties/logos and technical hallucinations. Do not state that any specific AI tool/license was verified in this audit.
- **Client evidence:** permission must cover screenshots, drawings, documents and project description; remove names, job IDs, prices, personal information, credentials and sensitive specifications. Redact source exports, not merely an overlay that can be removed. Record whether outcomes and deployment status were independently confirmed.
- **Engineering visuals:** authored sample geometry is illustrative. A drawing number, revision, symbol or dimension must have a coherent purpose; invented symbols and passing calculation results are not decoration. Owner/domain review is a release gate.
- **Architecture:** illustrative model is not a represented completed commission. If real architecture replaces it, clear image/model usage and any required attribution and explicitly identify Swayam's actual role.
- **Typography/icons:** verify licenses for the actual binaries used; package notices as required. Existing remote font URLs do not establish that a local file is available or that every redistribution mode was reviewed.
- **People/portrait:** obtain appropriate photographer rights and subject permission; no fabricated client testimonials or generated substitute portrait presented as a photograph.

Keep licensing evidence private if it contains personal/commercial terms; public media credits should contain only required attribution and appropriate illustration disclosure.

## 7. Production order and delivery gates

1. **Graybox:** artist supplies F and B model/camera proof, five compositions, portrait crops and the four transition contact sheets. Approve scale/copy zones and shared geometry before materials.
2. **Registered stills:** deliver photo/line pairs and B states; engineer checks projected anchors and mask dimensions. Engineering reviewer clears annotation/geometry meaning.
3. **Evidence:** obtain approved UI/task captures and actual output artifacts; resolve sample-versus-real labels before final scene 05 composition.
4. **Finish:** grade, export responsive derivatives and rights registry; preview compression at intended display sizes and high-DPI screens.
5. **Integration review after approval:** check loading budgets, fallback/readability and transitions on devices; full animation implementation is a separate authorized milestone.

Required artist delivery folder: source project + textures/licenses; cameras/projection/readme; masters; masks; desktop derivatives; mobile derivatives; contact sheets; anchor JSON; checksum inventory. Required product-owner delivery: evidence files, factual status/capability approvals, consent/redaction notes and portrait rights. Required frontend handoff: explicit pixel dimensions/crop metadata, focal points, logical ID mapping and fallback per asset.

## Visual and technical review checklist

- [ ] Every claimed existing asset is present; every missing final asset is labeled create/supply, never “done.”
- [ ] F pair and all B states share camera/projection/geometry/crop/color settings; no silhouette/floor-count jump.
- [ ] Master, desktop and mobile dimensions, masks and alpha semantics agree with registry metadata.
- [ ] All diagrams/annotations are meaningful, reviewed and readable; no unverified pseudo-CAD text.
- [ ] Real product evidence is cleared/redacted and visibly distinguished from illustrative fixtures.
- [ ] Licenses, attribution and source ownership are recorded for models, textures, fonts, imagery and photography.
- [ ] First image is responsive and prioritized; optional masks/frames/video/documents are deferred appropriately.
- [ ] Missing images, failed decode and constrained/reduced-motion devices show complete static content.
- [ ] Compressed bytes and decoded memory are measured separately during integration; planning ceilings are not reported as results.
- [ ] Optional sequence production and full cinematic implementation remain unstarted pending approval.
