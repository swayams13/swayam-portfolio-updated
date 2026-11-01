import { useState } from "react";
import { bySlug } from "@/lib/content";
import { Capabilities, Ctas, Meta, Sample } from "./shared";

type Line = { no: string; desc: string; unit: string; qty: string; flag?: string };
const LINES: Line[] = [
  { no: "2.01", desc: "Excavation in ordinary soil up to 1.5 m depth", unit: "cum", qty: "1,240" },
  { no: "2.02", desc: "PCC 1:4:8 below footings, 100 mm thick", unit: "m³", qty: "86.5" },
  {
    no: "2.04",
    desc: "RCC M30 in slabs, 150 mm thick incl. shuttering",
    unit: "m³",
    qty: "",
    flag: "Missing quantity",
  },
  {
    no: "2.07",
    desc: "TMT reinforcement Fe500D, cutting, bending & placing",
    unit: "MT",
    qty: "48.2",
  },
  {
    no: "2.11",
    desc: "RCC M30 in slabs 150mm thk including shuttering",
    unit: "cum",
    qty: "312",
    flag: "Possible duplicate of 2.04",
  },
  {
    no: "3.02",
    desc: "Brick masonry 230 mm in CM 1:6",
    unit: "sqm",
    qty: "640",
    flag: "Unit inconsistent with item type",
  },
];

const STAGES = [
  "Original document",
  "Extracted fields",
  "Structured table",
  "Validation",
  "Review",
];

function Original({ marks }: { marks: boolean }) {
  const m = (t: string) => (marks ? <mark className="bg-copper/25 text-inherit">{t}</mark> : t);
  return (
    <div className="boq-source">
      <p className="text-center font-sans text-xs font-semibold tracking-widest uppercase">
        Bill of Quantities — Part B, Civil Works
      </p>
      <p className="mt-1 text-center font-sans text-[0.7rem] text-muted-foreground">
        Sample residential block · illustrative document
      </p>
      <div className="mt-6 space-y-3">
        {LINES.map((l) => (
          <p
            key={l.no}
            className="grid grid-cols-[2.5rem_1fr] sm:grid-cols-[3rem_1fr_auto] gap-3 border-b border-dotted border-border pb-2"
          >
            <span>{m(l.no)}</span>
            <span>{m(l.desc)}</span>
            <span className="whitespace-nowrap">
              {m(l.unit)} {l.qty ? m(l.qty) : "____"}
            </span>
          </p>
        ))}
      </div>
    </div>
  );
}

type Decision = "Accepted" | "Rejected";
function Table({
  validate,
  review,
  decisions,
  onDecision,
}: {
  validate: boolean;
  review: boolean;
  decisions: Record<string, Decision>;
  onDecision: (id: string, decision: Decision) => void;
}) {
  return (
    <div className="data-scroll" role="region" aria-label="Sample BOQ line items" tabIndex={0}>
      <table className="boq-table">
        <caption className="sr-only">
          Illustrative bill of quantities. Validation flags are predefined sample data.
        </caption>
        <thead>
          <tr>
            <th scope="col">Item</th>
            <th scope="col">Description</th>
            <th scope="col">Unit</th>
            <th scope="col">Qty</th>
            {(validate || review) && <th scope="col">Review</th>}
          </tr>
        </thead>
        <tbody>
          {LINES.map((l) => (
            <tr key={l.no}>
              <th scope="row">{l.no}</th>
              <td>{l.desc}</td>
              <td>{l.unit}</td>
              <td>{l.qty || "—"}</td>
              {(validate || review) && (
                <td>
                  {l.flag ? (
                    <>
                      <span className="review-flag">{l.flag}</span>
                      {review && (
                        <div className="review-actions">
                          <button
                            type="button"
                            aria-label={`Accept item ${l.no}`}
                            aria-pressed={decisions[l.no] === "Accepted"}
                            onClick={() => onDecision(l.no, "Accepted")}
                          >
                            Accept
                          </button>
                          <button
                            type="button"
                            aria-label={`Reject item ${l.no}`}
                            aria-pressed={decisions[l.no] === "Rejected"}
                            onClick={() => onDecision(l.no, "Rejected")}
                          >
                            Reject
                          </button>
                          <span role="status">{decisions[l.no] || "Awaiting review"}</span>
                        </div>
                      )}
                    </>
                  ) : (
                    "No sample flag"
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function BOQ() {
  const p = bySlug("boq-intelligence");
  const [stage, setStage] = useState(0);
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});
  return (
    <article
      id={`${p.slug}-demo`}
      className="boq-section section-space"
      aria-labelledby="boq-title"
    >
      <div className="shell">
        <Meta p={p} />
        <div className="editorial-heading">
          <h3 id="boq-title">
            A document.
            <br />
            <span className="muted">A workable dataset.</span>
          </h3>
          <div>
            <p className="project-subtitle">{p.title}</p>
            <p>{p.summary}</p>
          </div>
        </div>
        <div className="boq-layout">
          <div>
            <p className="eyebrow">Explore the document workflow</p>
            <ol className="view-selector" aria-label="BOQ stages">
              {STAGES.map((name, i) => (
                <li key={name}>
                  <button
                    type="button"
                    aria-pressed={stage === i}
                    aria-controls="boq-panel"
                    onClick={() => setStage(i)}
                  >
                    <span className="label">0{i + 1}</span>
                    {name}
                    <span aria-hidden="true">↗</span>
                  </button>
                </li>
              ))}
            </ol>
            <p className="caption">
              A deterministic sample. No document is uploaded and no live AI extraction takes place.
            </p>
          </div>
          <div className="boq-document">
            <div className="interface-header">
              <span className="label">BOQ / Civil works</span>
              <Sample>Illustrative sample</Sample>
            </div>
            <div id="boq-panel">
              <h4 className="boq-stage-title">{STAGES[stage]}</h4>
              {stage < 2 ? (
                <Original marks={stage === 1} />
              ) : (
                <Table
                  validate={stage === 3}
                  review={stage === 4}
                  decisions={decisions}
                  onDecision={(id, decision) => setDecisions((d) => ({ ...d, [id]: decision }))}
                />
              )}
            </div>
            <div className="step-footer">
              <button type="button" disabled={stage === 0} onClick={() => setStage((s) => s - 1)}>
                ← Previous
              </button>
              <span className="label">{stage + 1} / 5</span>
              <button type="button" disabled={stage === 4} onClick={() => setStage((s) => s + 1)}>
                Next →
              </button>
            </div>
            <button
              type="button"
              className="reset-link"
              onClick={() => {
                setDecisions({});
                setStage(0);
              }}
            >
              Reset sample
            </button>
          </div>
        </div>
        <div className="project-bottom">
          <p className="caption">{p.statusNote}</p>
          <Ctas p={p} />
        </div>
        <details className="scope-details">
          <summary>Prototype capabilities & planned scope</summary>
          <Capabilities p={p} />
        </details>
      </div>
    </article>
  );
}
