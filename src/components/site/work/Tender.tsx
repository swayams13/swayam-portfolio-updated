import { useState } from "react";
import { bySlug } from "@/lib/content";
import { Capabilities, Ctas, Meta, Sample } from "./shared";

const STEPS = ["Document", "Structured data", "Engineering review", "Quotation"];

function Hl({ children }: { children: React.ReactNode }) {
  return (
    <mark
      data-hl
      className="[box-decoration-break:clone] bg-transparent text-inherit [background-image:linear-gradient(color-mix(in_oklab,var(--copper)_35%,transparent),color-mix(in_oklab,var(--copper)_35%,transparent))] bg-no-repeat [background-size:100%_100%] "
    >
      {children}
    </mark>
  );
}

function TenderDoc() {
  return (
    <div className="mx-auto w-full max-w-[34rem] bg-paper p-10 font-serif text-[0.82rem] leading-[1.7] text-charcoal shadow-[0_50px_90px_-40px_black]">
      <p className="label text-xs text-muted-foreground">
        Sample tender — illustrative, not a real enquiry
      </p>
      <p className="mt-6 text-center font-sans text-sm font-semibold tracking-wide uppercase">
        Section 4 — Technical Specification
      </p>
      <p className="mt-1 text-center font-sans text-xs">
        Supply of Metallic Expansion Joints for Flue Gas Duct
      </p>
      <p className="mt-6">
        <b>4.1 Scope.</b> The bidder shall design, manufacture, inspect and supply{" "}
        <Hl>six (6) nos. metallic bellows expansion joints</Hl> for the duct system described in
        Annexure B.
      </p>
      <p className="mt-3">
        <b>4.2 Design basis.</b> Joints shall be suitable for a <Hl>design pressure of 10 barg</Hl>{" "}
        and a <Hl>design temperature of 350 °C</Hl>, with <Hl>axial movement of ±25 mm</Hl>. Design
        shall follow <Hl>EJMA, latest edition</Hl>.
      </p>
      <p className="mt-3">
        <b>4.3 Materials.</b> Bellows shall be <Hl>SS 321</Hl>; end connections{" "}
        <Hl>DN 500 flanged, PN16</Hl>. Material test certificates per EN 10204 3.1.
      </p>
      <p className="mt-3">
        <b>4.4 Inspection.</b> <Hl>Hydrostatic test at 1.5× design pressure</Hl>; 100% DPT of
        longitudinal seams.
      </p>
      <p className="mt-3">
        <b>4.5 Delivery.</b> Within <Hl>16 weeks</Hl> from purchase order.
      </p>
    </div>
  );
}

const SPEC = [
  ["Item", "Metallic bellows expansion joint"],
  ["Quantity", "6 nos."],
  ["Size / connection", "DN 500 · flanged PN16"],
  ["Design pressure", "10 barg"],
  ["Design temperature", "350 °C"],
  ["Axial movement", "± 25 mm"],
  ["Bellows material", "SS 321"],
  ["Design code", "EJMA"],
  ["Testing", "Hydro 1.5× DP · DPT 100%"],
  ["Delivery", "16 weeks"],
];

function Structured() {
  return (
    <div className="w-full max-w-[34rem]">
      <div className="mb-4 flex justify-between">
        <p className="label text-paper">Structured specification</p>
        <Sample />
      </div>
      {SPEC.map(([k, v]) => (
        <div
          key={k}
          data-spec
          className="grid grid-cols-[11rem_1fr] border-b border-line-dark py-2.5 text-sm"
        >
          <span className="text-muted-foreground">{k}</span>
          <span className="font-mono text-paper">{v}</span>
        </div>
      ))}
      <p className="label mt-4 text-xs text-muted-foreground">
        Each field keeps a link to its source clause (4.1 – 4.5)
      </p>
    </div>
  );
}

function Review() {
  const rows: [string, string, string][] = [
    ["Design pressure · 10 barg", "§4.2", "Accepted"],
    ["Design temperature · 350 °C", "§4.2", "Accepted"],
    ["Axial movement · ±25 mm", "§4.2", "Clarify lateral?"],
    ["Bellows material · SS 321", "§4.3", "Accepted"],
    ["Hydro test · 1.5× DP", "§4.4", "Edited → 15 barg"],
  ];
  return (
    <div className="w-full max-w-[34rem]">
      <div className="mb-4 flex justify-between">
        <p className="label text-paper">Engineering review</p>
        <Sample />
      </div>
      {rows.map(([k, s, st]) => (
        <div
          key={k}
          className="grid grid-cols-[1fr_3rem_8rem] items-center border-b border-line-dark py-3 text-sm"
        >
          <span className="text-paper">{k}</span>
          <span className="label text-xs text-muted-foreground">{s}</span>
          <span
            className={`label text-right text-xs ${st === "Accepted" ? "text-muted-foreground" : "text-copper"}`}
          >
            {st}
          </span>
        </div>
      ))}
      <p className="label mt-6 text-xs text-muted-foreground">
        Reviewer: engineering · nothing proceeds without human approval
      </p>
    </div>
  );
}

function Quote() {
  return (
    <div className="w-full max-w-[34rem] bg-graphite p-8">
      <div className="flex items-baseline justify-between border-b border-line-dark pb-4">
        <p className="display text-2xl text-paper">
          Quotation <span className="text-steel">Q-SAMPLE-031</span>
        </p>
        <Sample />
      </div>
      {[
        ["Expansion joint DN500, SS321 bellows", "6"],
        ["Hydrostatic testing & DPT", "1 lot"],
        ["Documentation & MTCs", "1 lot"],
      ].map(([k, q]) => (
        <div
          key={k}
          className="grid grid-cols-[1fr_4rem_6rem] border-b border-line-dark py-3 text-sm"
        >
          <span className="text-paper">{k}</span>
          <span className="font-mono text-muted-foreground">{q}</span>
          <span className="text-right font-mono text-muted-foreground">₹ ——</span>
        </div>
      ))}
      <div className="mt-6 flex items-center justify-between">
        <span className="label text-xs text-muted-foreground">
          Status · Draft — awaiting commercial approval
        </span>
        <span className="label border-b border-copper pb-1 text-xs text-copper">
          Approval step · concept only
        </span>
      </div>
    </div>
  );
}

const PANELS = [TenderDoc, Structured, Review, Quote];

export function Tender() {
  const p = bySlug("tender-to-quotation");
  const [active, setActive] = useState(0);
  const Panel = PANELS[active]!;
  return (
    <article
      id={`${p.slug}-demo`}
      className="tender-section dark section-space"
      aria-labelledby="tender-title"
    >
      <div className="shell">
        <Meta p={p} />
        <div className="tender-heading">
          <p className="eyebrow">A workflow concept</p>
          <h3 id="tender-title">
            From a tender.
            <br />
            To a <span>clearer next step.</span>
          </h3>
          <p>{p.summary}</p>
        </div>
        <ol className="tender-flow">
          {STEPS.map((step, i) => (
            <li key={step}>
              <span className="label">0{i + 1}</span>
              <h4>{step}</h4>
              <p>
                {
                  [
                    "Locate the requirements in the source document.",
                    "Organize specifications into consistent fields.",
                    "Keep engineering judgment in the process.",
                    "Prepare a structured commercial output.",
                  ][i]
                }
              </p>
            </li>
          ))}
        </ol>
        <details className="scope-details tender-demo">
          <summary>Inspect the illustrative tender workflow</summary>
          <div className="sample-step-controls" role="group" aria-label="Tender workflow stages">
            {STEPS.map((step, i) => (
              <button
                key={step}
                type="button"
                aria-pressed={active === i}
                aria-controls="tender-panel"
                onClick={() => setActive(i)}
              >
                {step}
              </button>
            ))}
          </div>
          <div id="tender-panel">
            <Panel />
          </div>
        </details>
        <div className="project-bottom">
          <p className="caption">{p.statusNote}</p>
          <Ctas p={p} />
        </div>
        <details className="scope-details">
          <summary>Planned scope & verification notes</summary>
          <Capabilities p={p} />
        </details>
      </div>
    </article>
  );
}
