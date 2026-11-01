import type { Project } from "@/lib/content";
import { projectEvidence } from "@/lib/content";
import { IntelligenceUI } from "./IntelligenceUI";

function EvidenceTable({
  headers,
  rows,
  caption,
}: {
  headers: string[];
  rows: string[][];
  caption: string;
}) {
  return (
    <div className="data-scroll evidence-table" role="region" aria-label={caption} tabIndex={0}>
      <table>
        <caption>{caption}</caption>
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((value, j) =>
                j === 0 ? (
                  <th key={j} scope="row">
                    {value}
                  </th>
                ) : (
                  <td key={j}>{value}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ProjectEvidencePanel({ project }: { project: Project }) {
  const evidence = projectEvidence[project.slug];
  if (!evidence) return null;
  return (
    <figure className="project-evidence-panel" aria-labelledby={`evidence-title-${project.slug}`}>
      <div className="evidence-heading">
        <span className="label">Illustrative portfolio artifact</span>
        <span className="sample-label">
          {evidence.kind === "department-map" ? "Conceptual diagram" : "Sample data"}
        </span>
      </div>
      <h3 id={`evidence-title-${project.slug}`}>{evidence.title}</h3>
      {evidence.kind === "department-map" && (
        <div className="department-evidence">
          <p className="label">Shared project / job record</p>
          <ol>
            {[
              ["Engineering", "Drawing & BOM", "Planned document workflow"],
              ["Procurement", "Material context", "Planned"],
              ["Production", "Job stages", "In development"],
              ["Quality", "Inspection context", "Planned"],
            ].map(([name, record, state], i) => (
              <li key={name}>
                <span className="label">0{i + 1}</span>
                <h4>{name}</h4>
                <p>{record}</p>
                <span className="caption">{state}</span>
              </li>
            ))}
          </ol>
          <p className="caption">Proposed information handoffs; not a live integration diagram.</p>
        </div>
      )}
      {evidence.kind === "production-view" && <IntelligenceUI />}
      {evidence.kind === "engineering-bom" && (
        <EvidenceTable
          caption="Illustrative BOM — sample expansion joint assembly"
          headers={["Component", "Material", "Quantity"]}
          rows={[
            ["Bellows element", "SS 321", "1"],
            ["Weld-end pipe DN500", "CS A106", "2"],
            ["Flange DN500 PN16", "CS A105", "2"],
            ["Tie rod M24", "CS B7", "4"],
          ]}
        />
      )}
      {evidence.kind === "tender-review" && (
        <div className="tender-evidence">
          <blockquote>
            Sample requirement: six metallic bellows expansion joints, DN 500, design pressure 10
            barg, bellows material SS 321.
          </blockquote>
          <EvidenceTable
            caption="Predefined specification fields from the sample requirement"
            headers={["Field", "Sample value", "Review"]}
            rows={[
              ["Quantity", "6", "Confirm scope"],
              ["Nominal size", "DN 500", "Confirm connection details"],
              ["Design pressure", "10 barg", "Engineering review required"],
              ["Bellows material", "SS 321", "Confirm material requirements"],
            ]}
          />
        </div>
      )}
      {evidence.kind === "boq-review" && (
        <EvidenceTable
          caption="Predefined BOQ sample checks — no extraction service runs here"
          headers={["Item", "Sample information", "Review flag"]}
          rows={[
            ["2.04", "RCC M30 slab / quantity absent", "Missing quantity"],
            ["2.11", "Similar slab description to 2.04", "Possible duplicate — review required"],
            ["3.02", "230 mm brick masonry / sqm", "Review unit consistency"],
          ]}
        />
      )}
      <figcaption>
        <p>{evidence.demonstrates}</p>
        <p className="caption">{evidence.limitation}</p>
      </figcaption>
    </figure>
  );
}

export function EvidenceLabel({ slug }: { slug: string }) {
  const evidence = projectEvidence[slug];
  return evidence ? (
    <p className="brief-evidence-label">
      <span aria-hidden="true">◧</span>{" "}
      {evidence.kind === "department-map"
        ? "Conceptual handoff diagram"
        : "Illustrative sample available"}{" "}
      <span>· Product capture not yet supplied</span>
    </p>
  ) : null;
}
