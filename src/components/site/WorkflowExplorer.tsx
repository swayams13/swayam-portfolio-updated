import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { bySlug, workflowExplorer } from "@/lib/content";
import { StatusTag } from "./work/shared";

/** An isometric SVG prototype: no continuous render loop or GPU dependency. */
function OperatingModel({
  connected,
  selected,
}: {
  connected: boolean;
  selected: string | undefined;
}) {
  return (
    <svg
      className={`operating-model ${connected ? "model-connected" : ""}`}
      viewBox="0 0 1000 460"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern id="workflow-ground" width="40" height="24" patternUnits="userSpaceOnUse">
          <path d="M0 12L20 0L40 12L20 24Z" fill="none" stroke="currentColor" strokeWidth=".4" />
        </pattern>
      </defs>
      <path
        className="model-ground"
        d="M35 260L500 10L965 260L500 450Z"
        fill="url(#workflow-ground)"
      />
      <g className="model-links">
        {workflowExplorer.workflows.map((w) => (
          <path
            key={w.id}
            className={selected === w.id ? "link-selected" : ""}
            d={`M${w.x} ${w.y + 35} V${w.y + 65} L500 250`}
          />
        ))}
        <circle cx="500" cy="250" r="7" />
        <path d="M500 250L750 390" />
      </g>
      {workflowExplorer.workflows.map((w, i) => (
        <g
          key={w.id}
          transform={`translate(${w.x} ${w.y})`}
          className={`model-island ${selected === w.id ? "island-selected" : ""} ${selected && selected !== w.id ? "island-secondary" : ""}`}
        >
          <path className="island-base" d="M-95 5L0 -45L95 5L0 55Z" />
          <path className="island-side" d="M-95 5V18L0 68L95 18V5M0 55V68" />
          {i === 0 ? (
            <g className="model-object">
              <path d="M-58 -8L0 -39L58 -8L0 23ZM-58 -8V-72L0 -103L58 -72V-8M-58 -72L0 -41L58 -72M0 -41V23" />
              {[-50, -30, -10].map((y) => (
                <path key={y} d={`M-58 ${y}L0 ${y + 31}L58 ${y}`} />
              ))}
              <path d="M75 -5V-125M-25 -105L75 -145L105 -130M35 -129V-70" />
            </g>
          ) : i === 1 ? (
            <g className="model-object">
              <path d="M-65 -4V-50L-25 -71L-25 -37L15 -58L15 -24L60 -48V-4L0 28ZM-65 -4L0 28L60 -4M0 28V-18L60 -48M-65 -50L0 -18" />
              <path d="M35 -64V-107L48 -114L60 -107V-48M35 -107L48 -100L60 -107M48 -100V-57" />
              {[-38, -18, 2].map((x) => (
                <path key={x} d={`M${x} -17V-3L${x + 10} 2V-12Z`} />
              ))}
            </g>
          ) : i === 2 ? (
            <g className="model-object">
              {[0, 16, 32].map((v) => (
                <path
                  key={v}
                  d={`M-50 ${-66 + v}L5 ${-95 + v}L60 ${-66 + v}L5 ${-37 + v}ZM-50 ${-66 + v}V${-56 + v}L5 ${-27 + v}L60 ${-56 + v}V${-66 + v}`}
                />
              ))}
              <path d="M-24 -64L5 -79L31 -65M-10 -51L21 -67" />
            </g>
          ) : (
            <g className="model-object">
              <path d="M-40 -8V-82L24 -115L65 -91V-17L0 17ZM-40 -82L0 -58L65 -91M0 -58V17M-25 -92V-104L39 -137L79 -113V-39" />
              <path d="M15 -47L48 -64M15 -28L48 -45M15 -9L37 -20" />
            </g>
          )}
          <circle className="model-node" cx="0" cy="55" r="4" />
          <text className="model-number" x="-92" y="48">
            0{i + 1}
          </text>
          <text className="model-name" x="0" y="96" textAnchor="middle">
            {w.label}
          </text>
        </g>
      ))}
      <g className="model-core">
        <path d="M690 390L750 358L810 390L750 422Z" />
        <text x="750" y="445" textAnchor="middle">
          SHARED PROJECT RECORD
        </text>
      </g>
    </svg>
  );
}

export function WorkflowExplorer() {
  const [connected, setConnected] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const workflow = active === null ? undefined : workflowExplorer.workflows[active];
  const project = bySlug(workflow?.project ?? "manufacturing-operating-system");
  const reset = () => {
    setConnected(false);
    setActive(null);
  };
  return (
    <section className="workflow-explorer" aria-labelledby="explorer-title">
      <div className="explorer-heading">
        <p className="label">Interactive operating model</p>
        <span className="explorer-state">
          <span aria-hidden="true" />
          {connected ? "Connected view" : "Separate workflows"}
        </span>
      </div>
      <h2 id="explorer-title" className="sr-only">
        {workflowExplorer.title}
      </h2>
      <div className="explorer-layout">
        <div className="explorer-model">
          <OperatingModel connected={connected} selected={workflow?.id} />
          <p className="caption">Conceptual geometry · illustrative workflow</p>
        </div>
        <div className="explorer-controls">
          <p className="explorer-instruction">
            Choose a workflow.
            <br />
            <span className="muted">Follow the handoff.</span>
          </p>
          <div className="workflow-choices" role="group" aria-label="Explore connected workflows">
            {workflowExplorer.workflows.map((w, i) => (
              <button
                type="button"
                key={w.id}
                aria-pressed={active === i}
                aria-controls="workflow-explanation"
                onClick={() => {
                  setActive(i);
                  setConnected(true);
                }}
              >
                <span className="label">0{i + 1}</span>
                <span>
                  {w.label}
                  <small>{w.artifact}</small>
                </span>
                <span aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
          <div className="explorer-mode">
            <button
              type="button"
              disabled={connected && active === null}
              onClick={() => {
                setActive(null);
                setConnected(true);
              }}
            >
              Connect all workflows
            </button>
            <button type="button" disabled={!connected} onClick={reset}>
              Reset view
            </button>
          </div>
        </div>
      </div>
      <div id="workflow-explanation" className="workflow-explanation">
        <div aria-live="polite" aria-atomic="true">
          <p className="label">
            {workflow
              ? `${workflow.label} / illustrative handoff`
              : connected
                ? "Connected operations"
                : "The starting point"}
          </p>
          <h3>
            {workflow?.title ??
              (connected ? workflowExplorer.title : "Separate tools. Disconnected context.")}
          </h3>
          <p>
            {workflow?.description ??
              (connected ? workflowExplorer.connected : workflowExplorer.disconnected)}
          </p>
          {workflow && <p className="workflow-handoff">{workflow.handoff}</p>}
        </div>
        {connected && (
          <div className="explorer-project">
            <p className="label">Related system</p>
            <p className="explorer-project-name">{project.title}</p>
            <StatusTag status={project.status} label={project.statusLabel} />
            <Link to="/work/$slug" params={{ slug: project.slug }} className="text-link">
              Explore {workflow ? "this workflow" : "the platform concept"} ↗
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
