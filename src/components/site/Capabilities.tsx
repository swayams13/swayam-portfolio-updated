import { Link } from "@tanstack/react-router";
import { capabilities, engagementSteps, homepageCopy, heroDirection } from "@/lib/content";
export function CapabilitiesSection() {
  return (
    <section
      id="services"
      className="section-space capabilities-section"
      aria-labelledby="services-title"
    >
      <div className="shell">
        <div className="section-heading">
          <h2 id="services-title">
            Your bottleneck.
            <br />
            <span className="muted">A practical way forward.</span>
          </h2>
          <p>{heroDirection.intro}</p>
        </div>
        <ol className="capability-list">
          {capabilities.map((c, i) => (
            <li key={c.title}>
              <span className="label">0{i + 1}</span>
              <div>
                <h3>{c.title}</h3>
              </div>
              <div>
                <p>{c.description}</p>
                <p className="caption">{c.examples}</p>
                <Link to="/work/$slug" params={{ slug: c.project }} className="text-link">
                  Explore a relevant system ↗
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
export function Engagement() {
  return (
    <section
      id="approach"
      className="section-space engagement-section dark"
      aria-labelledby="approach-title"
    >
      <div className="shell">
        <div className="section-heading">
          <h2 id="approach-title">
            Start with the workflow.
            <br />
            <span className="muted">Build with a clear purpose.</span>
          </h2>
        </div>
        <ol className="engagement-steps">
          {engagementSteps.map((s, i) => (
            <li key={s.title}>
              <span className="label">0{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.description}</p>
            </li>
          ))}
        </ol>
        <div className="engagement-footer">
          <p>{homepageCopy.engagementNote}</p>
          <a className="button button-light" href="#contact">
            Discuss Your Project ↗
          </a>
        </div>
      </div>
    </section>
  );
}
