import { Link } from "@tanstack/react-router";
import { specialized } from "@/lib/content";
import { StatusTag } from "./shared";
export function Specialized() {
  return (
    <section
      id="expertise"
      className="specialized-section section-space"
      aria-labelledby="specialized-title"
    >
      <div className="shell">
        <div className="section-heading">
          <p className="eyebrow">03 / Focused expertise</p>
          <h2 id="specialized-title">
            Specific challenges.
            <br />
            <span className="muted">Purpose-built tools.</span>
          </h2>
          <p>
            Engineering calculations, technical documents and operational workflows. Smaller systems
            with a clearly defined purpose.
          </p>
        </div>
        <ol className="specialized-list">
          {specialized.map((p) => (
            <li key={p.slug}>
              <Link to="/work/$slug" params={{ slug: p.slug }}>
                <span className="label">{p.number}</span>
                <div>
                  <h3>{p.title}</h3>
                  <p>{p.summary}</p>
                </div>
                <StatusTag status={p.status} />
                <span className="list-arrow" aria-hidden="true">
                  ↗
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
