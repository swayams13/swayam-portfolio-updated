import { CrossfadeImage } from "./CrossfadeImage";
import { useState } from "react";
import { scenes, homepageIndustries } from "@/lib/content";
export function IndustryJourney() {
  const [active, setActive] = useState(0);
  const industry = homepageIndustries[active]!;
  const scene = scenes[industry.scene]!;
  return (
    <section id="industries" className="industry-section" aria-labelledby="industry-title">
      <div className="shell">
        <div className="section-heading">
          <p className="eyebrow">02 / Industry context</p>
          <h2 id="industry-title">
            Different operations.
            <br />
            <span className="muted">The same need for clarity.</span>
          </h2>
          <p>
            For owners, directors, plant heads and engineering teams navigating complex operational
            work.
          </p>
        </div>
        <div
          className="chapter-controls industry-four"
          role="group"
          aria-label="Choose an industry"
        >
          {homepageIndustries.map((s, i) => (
            <button
              type="button"
              key={s.label}
              aria-pressed={active === i}
              aria-controls="industry-panel"
              onClick={() => setActive(i)}
            >
              <span className="label">0{i + 1}</span>
              <span>{s.label}</span>
              <span aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
        <div id="industry-panel" className="industry-panel">
          <CrossfadeImage src={scene.image} />
          <div
            key={industry.label}
            className="industry-copy panel-enter"
            aria-live="polite"
            aria-atomic="true"
          >
            <p className="eyebrow">{industry.label}</p>
            <h3>{industry.focus}</h3>
            <p>{industry.body}</p>
            <a className="text-link" href={`#${industry.destination}`}>
              {industry.action} ↗
            </a>
            <p className="caption">
              Illustrative environment. Project status is stated with each system.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
