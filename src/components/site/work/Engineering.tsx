import { useState } from "react";
import { bySlug, interactionSamples } from "@/lib/content";
import { Capabilities, Ctas, Meta, Sample } from "./shared";

/** Bellows expansion joint, side elevation. Geometry is generic and illustrative. */
function Drawing() {
  const N = 8,
    P = 60,
    X0 = 260;
  let top = `M140,200 L${X0},200`;
  let bot = `M140,400 L${X0},400`;
  for (let i = 0; i < N; i++) {
    const x = X0 + i * P;
    top += ` L${x + 5},200 A25 55 0 0 1 ${x + 55},200 L${x + 60},200`;
    bot += ` L${x + 5},400 A25 55 0 0 0 ${x + 55},400 L${x + 60},400`;
  }
  top += " L860,200";
  bot += " L860,400";
  const arrow = (x: number, y: number, d: number) => `M${x},${y} l${8 * d},-3 v6 z`;
  return (
    <svg
      viewBox="0 0 1000 620"
      className="h-auto w-full text-charcoal"
      role="img"
      aria-label="Illustrative engineering drawing of a bellows expansion joint"
    >
      <g fill="none" stroke="currentColor" strokeWidth={1.4}>
        <path d={top} />
        <path d={bot} />
        <rect x={100} y={150} width={40} height={300} />
        <rect x={860} y={150} width={40} height={300} />
        <path d="M60,200 H100 M60,400 H100 M900,200 H940 M900,400 H940" strokeWidth={1} />
        {/* tie rods */}
        <path d="M90,95 H910 M90,505 H910" strokeWidth={1} />
        {[90, 900].map((x) => (
          <g key={x}>
            <rect x={x - 6} y={86} width={16} height={18} />
            <rect x={x - 6} y={496} width={16} height={18} />
          </g>
        ))}
        <path d="M120,104 V150 M880,104 V150 M120,450 V496 M880,450 V496" strokeWidth={1} />
      </g>
      {/* centreline */}
      <path
        d="M40,300 H960"
        stroke="currentColor"
        strokeWidth={0.6}
        strokeDasharray="22 5 3 5"
        opacity={0.6}
      />
      {/* hatching on flanges */}
      <g stroke="currentColor" strokeWidth={0.5} opacity={0.5}>
        {Array.from({ length: 14 }).map((_, i) => (
          <path key={i} d={`M100,${160 + i * 20} l40,-14 M860,${160 + i * 20} l40,-14`} />
        ))}
      </g>
      {/* dimensions */}
      <g
        className="text-steel"
        fill="currentColor"
        stroke="currentColor"
        fontFamily="var(--font-mono)"
        fontSize={13}
        letterSpacing="0.08em"
      >
        <g data-dim="oal">
          <path d="M100,560 H900 M100,545 V575 M900,545 V575" strokeWidth={0.8} fill="none" />
          <path d={arrow(100, 560, 1)} stroke="none" />
          <path d={arrow(900, 560, -1)} stroke="none" />
          <text x={500} y={552} textAnchor="middle" stroke="none">
            OAL 800
          </text>
        </g>
        <g data-dim="id">
          <path d="M40,200 V400 M30,200 H60 M30,400 H60" strokeWidth={0.8} fill="none" />
          <text x={34} y={305} textAnchor="middle" stroke="none" transform="rotate(-90 34 305)">
            ID 500
          </text>
        </g>
        <g data-dim="pitch">
          <path
            d={`M${X0},128 H${X0 + P} M${X0},120 V136 M${X0 + P},120 V136`}
            strokeWidth={0.8}
            fill="none"
          />
          <text x={X0 + P / 2} y={118} textAnchor="middle" stroke="none">
            q 60
          </text>
        </g>
        <g data-dim="height">
          <path d="M780,145 V200 M770,145 H790" strokeWidth={0.8} fill="none" />
          <text x={796} y={178} stroke="none">
            w 55
          </text>
        </g>
      </g>
      {/* title block */}
      <g fontFamily="var(--font-mono)" fontSize={11} letterSpacing="0.1em" fill="currentColor">
        <rect
          x={640}
          y={590}
          width={360}
          height={30}
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
        />
        <text x={652} y={609}>
          DRG SAMPLE-EJ-014 · REV B · ILLUSTRATIVE
        </text>
      </g>
    </svg>
  );
}

const kv = "flex items-baseline justify-between gap-6 border-b border-border py-2.5 text-sm";

const PANELS = [
  {
    t: "Engineering parameters",
    dim: "id",
    body: (
      <>
        {[
          ["Nominal size", "DN 500"],
          ["Design pressure", "10 barg"],
          ["Design temperature", "350 °C"],
          ["Axial movement", "± 25 mm"],
          ["Bellows material", "SS 321"],
          ["Convolutions", "8"],
        ].map(([k, v]) => (
          <div key={k} className={kv}>
            <span className="text-muted-foreground">{k}</span>
            <span className="font-mono">{v}</span>
          </div>
        ))}
      </>
    ),
  },
  {
    t: "Calculation results",
    dim: "pitch",
    body: (
      <>
        {[
          ["Circumferential membrane stress", "Within allowable"],
          ["Meridional bending stress", "Within allowable"],
          ["Instability — column squirm", "Check passed"],
          ["Fatigue life (design cycles)", "Check passed"],
          ["Axial spring rate", "Computed"],
        ].map(([k, v]) => (
          <div key={k} className={kv}>
            <span className="text-muted-foreground">{k}</span>
            <span className="label text-xs text-copper">{v}</span>
          </div>
        ))}
      </>
    ),
  },
  {
    t: "Structured BOM",
    dim: "oal",
    body: (
      <>
        <div className="label grid grid-cols-[2rem_1fr_5rem_2.5rem] pb-2 text-xs text-muted-foreground">
          <span>#</span>
          <span>Item</span>
          <span>Material</span>
          <span className="text-right">Qty</span>
        </div>
        {[
          ["Bellows element", "SS 321", 1],
          ["Weld-end pipe DN500", "CS A106", 2],
          ["Flange DN500 PN16", "CS A105", 2],
          ["Tie rod M24", "CS B7", 4],
          ["Hex nut M24", "2H", 16],
        ].map(([a, b, n], i) => (
          <div
            key={a as string}
            className="grid grid-cols-[2rem_1fr_5rem_2.5rem] border-b border-border py-2.5 font-mono text-[0.8rem]"
          >
            <span className="text-muted-foreground">{i + 1}</span>
            <span>{a}</span>
            <span className="text-muted-foreground">{b}</span>
            <span className="text-right">{n}</span>
          </div>
        ))}
      </>
    ),
  },
  {
    t: "Costing & documentation",
    dim: "height",
    body: (
      <>
        {["Material cost", "Fabrication", "Testing & inspection", "Packing"].map((k) => (
          <div key={k} className={kv}>
            <span className="text-muted-foreground">{k}</span>
            <span className="font-mono">₹ ——</span>
          </div>
        ))}
        <p className="label mt-6 text-xs text-muted-foreground">Generated outputs</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {["Calculation report.pdf", "BOM.xlsx", "Datasheet.pdf", "Cost sheet.xlsx"].map((f) => (
            <span key={f} className="border border-border px-2.5 py-1.5 font-mono text-[0.7rem]">
              {f}
            </span>
          ))}
        </div>
      </>
    ),
  },
];

function SampleBom() {
  const [quantity, setQuantity] = useState("1");
  const count = Number(quantity);
  const valid = Number.isInteger(count) && count >= 1 && count <= 20;
  return (
    <div className="sample-bom">
      <label htmlFor="sample-assembly-count">Try a sample BOM quantity</label>
      <input
        id="sample-assembly-count"
        type="number"
        min={1}
        max={20}
        step={1}
        value={quantity}
        aria-invalid={!valid}
        aria-describedby="sample-bom-note"
        onChange={(event) => setQuantity(event.target.value)}
      />
      <p id="sample-bom-note" className="caption">
        Choose 1–20 assemblies. Quantity multiplication only; no sizing, stress or compliance
        calculation.
      </p>
      <div className="sample-bom-output" aria-live="polite" aria-atomic="true">
        {!valid && <p>Enter a whole number between 1 and 20.</p>}
        {interactionSamples.bom.map((item) => (
          <p key={item.name}>
            <span>{item.name}</span>
            <output>{valid ? count * item.perAssembly : "—"}</output>
          </p>
        ))}
      </div>
    </div>
  );
}

export function Engineering() {
  const p = bySlug("engineering-automation");
  const [active, setActive] = useState(0);
  const panel = PANELS[active]!;
  return (
    <article
      id={`${p.slug}-demo`}
      className="engineering-section section-space"
      aria-labelledby="engineering-title"
    >
      <div className="shell">
        <Meta p={p} />
        <div className="editorial-heading">
          <h3 id="engineering-title">
            Precision in.
            <br />
            <span className="muted">Repetition out.</span>
          </h3>
          <div>
            <p className="project-subtitle">{p.title}</p>
            <p>{p.summary}</p>
          </div>
        </div>
        <div className="engineering-layout">
          <figure className="engineering-drawing">
            <Drawing />
            <figcaption>
              Fig. 01 — Bellows expansion joint. Illustrative geometry and sample values.
            </figcaption>
          </figure>
          <div className="engineering-output">
            <p className="eyebrow">From input to output</p>
            <div className="engineering-steps" role="group" aria-label="Engineering process steps">
              {PANELS.map((v, i) => (
                <button
                  key={v.t}
                  type="button"
                  aria-pressed={active === i}
                  aria-controls="engineering-panel"
                  onClick={() => setActive(i)}
                >
                  <span className="label">0{i + 1}</span>
                  {v.t}
                </button>
              ))}
            </div>
            <div key={active} id="engineering-panel" className="engineering-panel panel-enter">
              <h4>{panel.t}</h4>
              <Sample>Illustrative output · not design advice</Sample>
              {panel.body}
            </div>
            <SampleBom />
          </div>
        </div>
        <div className="project-bottom">
          <p className="caption">{p.statusNote}</p>
          <Ctas p={p} />
        </div>
        <details className="scope-details">
          <summary>Delivered & planned capabilities</summary>
          <Capabilities p={p} />
        </details>
      </div>
    </article>
  );
}
