import { useRef } from "react";
import { HeroScrollArrow } from "./HeroScrollArrow";
import { WorkflowExplorer } from "./WorkflowExplorer";

/** Original typographic and schematic study; no reference-site code or assets. */
export function Cinematic() {
  const root = useRef<HTMLElement>(null);
  return (
    <section ref={root} className="hero studio-hero" aria-labelledby="hero-title">
      <HeroScrollArrow rootRef={root} />
      <div className="shell studio-hero-center">
        <h1 id="hero-title">
          Industry
          <span className="hero-bridge">
            <span className="hero-arrow-origin" aria-hidden="true">
              ↘
            </span>
            <em>into</em>
          </span>
          <span className="hero-intelligence">intelligence.</span>
        </h1>
      </div>
      <div className="shell">
        <WorkflowExplorer />
      </div>
    </section>
  );
}
