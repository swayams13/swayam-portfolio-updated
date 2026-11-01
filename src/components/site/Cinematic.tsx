import { WorkflowExplorer } from "./WorkflowExplorer";
import { heroDirection } from "@/lib/content";

/** Original typographic and schematic study; no reference-site code or assets. */
export function Cinematic() {
  return (
    <section className="hero studio-hero" aria-labelledby="hero-title">
      <div className="shell studio-hero-top">
        <p className="eyebrow">{heroDirection.eyebrow}</p>
        <p className="label">Independent thinking. Practical systems.</p>
      </div>
      <div className="shell studio-hero-center">
        <p className="hero-overline">Physical complexity. Digital clarity.</p>
        <h1 id="hero-title">
          Industry
          <span className="hero-bridge">
            <span aria-hidden="true">↘</span>
            <em>into</em>
          </span>
          <span className="hero-intelligence">intelligence.</span>
        </h1>
      </div>
      <div className="shell studio-hero-bottom">
        <p>{heroDirection.intro}</p>
        <a href="#contact" className="button">
          Discuss Your Project ↗
        </a>
        <a href="#work" className="text-link">
          Explore My Work <span aria-hidden="true">↗</span>
        </a>
        <a href="#industries" className="hero-scroll" aria-label="Discover the industries below">
          Scroll to explore <span aria-hidden="true">↓</span>
        </a>
      </div>
      <div className="shell">
        <WorkflowExplorer />
      </div>
    </section>
  );
}
