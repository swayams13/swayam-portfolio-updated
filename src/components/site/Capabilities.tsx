import { Link } from "@tanstack/react-router";
import { capabilities, engagementSteps } from "@/lib/content";
export function CapabilitiesSection() {
  return (
    <section
      id="services"
      className="section-space capabilities-section"
      aria-labelledby="services-title"
    >
      <div className="shell">
        <div className="section-heading">
          <p className="eyebrow">01 / How I can help</p>
          <h2 id="services-title">
            Your bottleneck.
            <br />
            <span className="muted">A practical way forward.</span>
          </h2>
          <p>
            Operational software, engineering automation and intelligent business systems—built
            around the way your team works.
          </p>
        </div>
        <ol className="capability-list">
          {capabilities.map((c, i) => (
            <li key={c.title}>
              <span className="label">0{i + 1}</span>
              <div>
                <h3>{c.title}</h3>
                <p className="capability-problem">{c.problem}</p>
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
          <p className="eyebrow">04 / Working together</p>
          <h2 id="approach-title">
            Start with the workflow.
            <br />
            <span className="muted">Build with a clear purpose.</span>
          </h2>
          <p>
            Direct collaboration from the first conversation through implementation, validation and
            deployment.
          </p>
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
          <p>
            No fixed package or one-size-fits-all timeline. Scope, dependencies and support are
            agreed around your requirements.
          </p>
          <a className="button button-light" href="#contact">
            Discuss Your Project ↗
          </a>
        </div>
      </div>
    </section>
  );
}
