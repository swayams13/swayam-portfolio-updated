import { useEffect, useRef } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { EvidenceLabel } from "./ProjectEvidence";
import { flagships, homepageCopy } from "@/lib/content";
import { StatusTag } from "./work/shared";
import { MOS } from "./work/MOS";
import { Production } from "./work/Production";
import { Engineering } from "./work/Engineering";
import { Tender } from "./work/Tender";
import { BOQ } from "./work/BOQ";
const demos = [MOS, Production, Engineering, Tender, BOQ];
export function Work() {
  const hash = useLocation({ select: (location) => location.hash });
  const briefs = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!hash) return;
    const target = document.getElementById(hash);
    if (!target || !briefs.current?.contains(target)) return;
    const disclosure = target.closest("details");
    if (!disclosure) return;
    disclosure.open = true;
    const frame = requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
    return () => cancelAnimationFrame(frame);
  }, [hash]);
  return (
    <section id="work" aria-labelledby="work-title">
      <div className="shell work-heading">
        <div>
          <h2 id="work-title">
            Practical ideas.
            <br />
            <span className="muted">Visible scope.</span>
          </h2>
        </div>
        <div>
          <p className="lead">{homepageCopy.workIntro}</p>
        </div>
      </div>
      <div ref={briefs} className="shell work-briefs">
        {flagships.map((p, i) => {
          const Demo = demos[i]!;
          return (
            <article
              key={p.slug}
              id={p.slug}
              className={`work-brief work-brief-${i + 1}`}
              aria-labelledby={`brief-${p.slug}`}
            >
              <div className="brief-meta">
                <span className="label">
                  {p.number} / {p.industry}
                </span>
                <StatusTag status={p.status} label={p.statusLabel} />
              </div>
              <div className="brief-body">
                <h3 id={`brief-${p.slug}`}>{p.title}</h3>
                <div>
                  <p>{p.summary}</p>
                  <p className="caption">{p.statusNote}</p>
                  <EvidenceLabel slug={p.slug} />
                  <div className="brief-links">
                    <Link to="/work/$slug" params={{ slug: p.slug }} className="text-link">
                      Read the project brief ↗
                    </Link>
                    <a href="#contact" className="text-link">
                      Discuss a similar workflow ↗
                    </a>
                  </div>
                </div>
              </div>
              <details className="brief-demo">
                <summary>
                  Explore the illustrative {i === 2 ? "engineering process" : "workflow"}{" "}
                  <span className="caption">Sample data · expand to explore</span>
                </summary>
                <Demo />
              </details>
            </article>
          );
        })}
      </div>
    </section>
  );
}
