import { useState } from "react";
import { bySlug } from "@/lib/content";
import { Bar, Capabilities, Ctas, Frame, Meta } from "./shared";

const JOBS = [
  "J-2401 Heat exchanger",
  "J-2402 Pressure vessel",
  "J-2403 Expansion joint ×6",
  "J-2404 Piping skid",
];
const STAGES = ["Engineering", "Procurement", "Fabrication", "Quality", "Dispatch"];
const cell = "border-b border-border py-3";

function Overview() {
  return (
    <div className="p-6">
      <div className="label grid grid-cols-[1fr_6rem_6rem] pb-3 text-muted-foreground">
        <span>Job</span>
        <span>Stage</span>
        <span>Owner</span>
      </div>
      {JOBS.map((j, i) => (
        <div key={j} className={`grid grid-cols-[1fr_6rem_6rem] items-center ${cell}`}>
          <span className="text-sm text-paper">{j}</span>
          <span className="label text-xs">{STAGES[[2, 3, 1, 4][i]!]}</span>
          <span className="label text-xs text-muted-foreground">
            {["Fab-A", "QC", "Purch.", "Stores"][i]}
          </span>
        </div>
      ))}
    </div>
  );
}
function Timeline() {
  return (
    <div className="p-6">
      <div className="label grid grid-cols-[7rem_repeat(5,1fr)] pb-3 text-xs text-muted-foreground">
        <span />
        {STAGES.map((s) => (
          <span key={s}>{s}</span>
        ))}
      </div>
      {JOBS.map((j, i) => (
        <div key={j} className="grid grid-cols-[7rem_repeat(5,1fr)] items-center py-3">
          <span className="truncate text-sm text-paper">{j.split(" ")[0]}</span>
          {STAGES.map((_, k) => {
            const at = [2, 3, 1, 4][i]!;
            return (
              <span
                key={k}
                className={`mx-0.5 h-2 ${k < at ? "bg-steel/70" : k === at ? "bg-copper" : "bg-paper/5"}`}
              />
            );
          })}
        </div>
      ))}
      <p className="label mt-6 text-xs text-muted-foreground">Copper = current stage</p>
    </div>
  );
}
function Department() {
  return (
    <div className="grid grid-cols-3 gap-px bg-border">
      {[
        ["Queued", ["J-2403 Shell rolling", "J-2405 Nozzle prep"]],
        ["In progress", ["J-2401 Tube bundle", "J-2402 Long seam weld"]],
        ["Ready for QC", ["J-2402 Shell fit-up"]],
      ].map(([h, items]) => (
        <div key={h as string} className="min-h-72 bg-charcoal p-5">
          <p className="label text-xs text-muted-foreground">Fabrication · {h as string}</p>
          <ul className="mt-4 space-y-2">
            {(items as string[]).map((t) => (
              <li key={t} className="border-l border-copper/70 py-1 pl-3 text-sm text-paper">
                {t}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
function Quality() {
  return (
    <div className="p-6">
      <p className="label text-xs text-muted-foreground">J-2402 · Inspection & test plan</p>
      {[
        ["Material certificate review", "Accepted"],
        ["Fit-up dimensional check", "Accepted"],
        ["Long seam weld — visual / DPT", "Hold point"],
        ["Hydrostatic test", "Scheduled"],
        ["Final documentation", "Pending"],
      ].map(([k, v]) => (
        <div key={k} className={`flex items-center justify-between ${cell}`}>
          <span className="text-sm text-paper">{k}</span>
          <span
            className={`label text-xs ${v === "Hold point" ? "text-copper" : "text-muted-foreground"}`}
          >
            {v}
          </span>
        </div>
      ))}
    </div>
  );
}
function Management() {
  return (
    <div className="grid grid-cols-5 gap-px bg-border">
      {STAGES.map((s, i) => (
        <div key={s} className="bg-charcoal p-5">
          <p className="label text-xs text-muted-foreground">{s}</p>
          <p className="display mt-6 text-5xl text-paper">{[1, 1, 2, 1, 0][i]}</p>
          <div className="mt-4">
            <Bar v={[20, 20, 40, 20, 0][i]!} accent={i === 2} />
          </div>
        </div>
      ))}
      <p className="label col-span-5 bg-charcoal p-5 text-xs text-muted-foreground">
        Jobs per stage · sample plant
      </p>
    </div>
  );
}

const VIEWS = [
  {
    t: "Project overview",
    path: "pip / jobs",
    body: "Every job, its current stage, and who owns the next step — on one screen.",
    C: Overview,
  },
  {
    t: "Production timeline",
    path: "pip / timeline",
    body: "Stage-by-stage progress shows where work is moving and where it is waiting.",
    C: Timeline,
  },
  {
    t: "Department dashboard",
    path: "pip / fabrication",
    body: "Each department works from its own queue, fed by the same project record.",
    C: Department,
  },
  {
    t: "Quality workflow",
    path: "pip / quality / J-2402",
    body: "Inspection points are tracked inside the job instead of in a separate register.",
    C: Quality,
  },
  {
    t: "Management overview",
    path: "pip / overview",
    body: "A combined view assembled from departmental updates, not separate reports.",
    C: Management,
  },
];

export function Production() {
  const p = bySlug("production-intelligence");
  const [active, setActive] = useState(0);
  const view = VIEWS[active]!;
  return (
    <article
      id={`${p.slug}-demo`}
      className="production-section section-space"
      aria-labelledby="production-title"
    >
      <div className="shell">
        <Meta p={p} />
        <div className="editorial-heading">
          <h3 id="production-title">
            Production,
            <br />
            <span className="muted">in perspective.</span>
          </h3>
          <div>
            <p className="project-subtitle">{p.title}</p>
            <p>{p.summary}</p>
          </div>
        </div>
        <div className="production-layout">
          <div className="view-selector" role="group" aria-label="Production views">
            {VIEWS.map((v, i) => (
              <button
                key={v.t}
                type="button"
                aria-pressed={active === i}
                aria-controls="production-view"
                onClick={() => setActive(i)}
              >
                <span className="label">0{i + 1}</span>
                <span>{v.t}</span>
                <span aria-hidden="true">↗</span>
              </button>
            ))}
            <p className="caption">Select a view to explore the sample workflow.</p>
          </div>
          <div id="production-view">
            <Frame path={view.path}>
              <div
                className="data-scroll"
                tabIndex={0}
                role="region"
                aria-label={`${view.t} sample preview`}
              >
                <div className="production-preview">
                  {p.media.screenshots?.[active] ? (
                    <img
                      src={p.media.screenshots[active]}
                      alt={view.t}
                      width={1600}
                      height={1000}
                      loading="lazy"
                    />
                  ) : (
                    <view.C />
                  )}
                </div>
              </div>
            </Frame>
            <p className="preview-caption">{view.body}</p>
          </div>
        </div>
        {p.media.video && (
          <video
            src={p.media.video}
            controls
            preload="none"
            aria-label="Production product walkthrough"
            className="product-video"
          />
        )}
        <div className="project-bottom">
          <p className="caption">{p.statusNote}</p>
          <Ctas p={p} />
        </div>
        <details className="scope-details">
          <summary>Capabilities & implementation status</summary>
          <Capabilities p={p} />
        </details>
      </div>
    </article>
  );
}
