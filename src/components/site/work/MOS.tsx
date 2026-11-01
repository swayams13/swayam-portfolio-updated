import { useState } from "react";
import { bySlug } from "@/lib/content";
import { Capabilities, Ctas, Meta } from "./shared";

const departments = [
  {
    name: "Engineering",
    step: "01",
    state: "Planned",
    detail: "A released drawing and its BOM become the shared reference for the next department.",
    record: "Drawing revision → material requirements",
  },
  {
    name: "Procurement",
    step: "02",
    state: "Planned",
    detail:
      "Material requirements connect to purchasing and receipt records in the proposed workflow.",
    record: "Material requirements → procurement visibility",
  },
  {
    name: "Production",
    step: "03",
    state: "In development",
    detail:
      "A project moves through its production stages, with departmental context kept together.",
    record: "Project record → production stages",
  },
  {
    name: "Quality",
    step: "04",
    state: "Planned",
    detail:
      "Inspection information would sit alongside the job it belongs to, rather than in a separate register.",
    record: "Inspection record → review",
  },
  {
    name: "Management",
    step: "05",
    state: "Planned",
    detail:
      "A consolidated view is planned to bring departmental information into management reporting.",
    record: "Department records → management view",
  },
] as const;
export function MOS() {
  const p = bySlug("manufacturing-operating-system");
  const [active, setActive] = useState(0);
  const selected = departments[active]!;
  return (
    <article id={`${p.slug}-demo`} className="mos-section dark" aria-labelledby="mos-title">
      <div className="shell">
        <Meta p={p} />
        <div className="mos-layout">
          <div className="mos-intro">
            <h3 id="mos-title">
              MOS<span>.</span>
            </h3>
            <p className="project-subtitle">
              Manufacturing
              <br />
              Operating System
            </p>
            <p>{p.summary}</p>
            <Ctas p={p} />
          </div>
          <div className="module-explorer">
            <div className="interface-header">
              <span className="label">A connected operating environment</span>
              <span className="sample-label">Illustrative concept</span>
            </div>
            <p className="module-question">
              One project.
              <br />
              <span className="muted">Every department.</span>
            </p>
            <div className="module-buttons" role="group" aria-label="Explore MOS departments">
              {departments.map((d, i) => (
                <button
                  type="button"
                  key={d.name}
                  aria-pressed={active === i}
                  aria-controls="module-detail"
                  onClick={() => setActive(i)}
                >
                  <span className="label">{d.step}</span>
                  {d.name}
                  <span aria-hidden="true">↗</span>
                </button>
              ))}
            </div>
            <div id="module-detail" className="module-detail">
              <div className="module-detail-heading">
                <h4>{selected.name}</h4>
                <span className="sample-label">{selected.state}</span>
              </div>
              <p>{selected.detail}</p>
              <p className="module-record">{selected.record}</p>
            </div>
          </div>
        </div>
        <details className="scope-details">
          <summary>Explore capabilities & current scope</summary>
          <p className="scope-note">{p.statusNote}</p>
          <Capabilities p={p} />
        </details>
      </div>
    </article>
  );
}
