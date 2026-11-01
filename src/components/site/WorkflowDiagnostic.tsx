import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { bySlug } from "@/lib/content";

const challenges = [
  {
    value: "production",
    label: "Understanding job and production status",
    slug: "production-intelligence",
  },
  {
    value: "engineering",
    label: "Repeating engineering calculations and BOM work",
    slug: "engineering-automation",
  },
  {
    value: "documents",
    label: "Reviewing construction quantities and documents",
    slug: "boq-intelligence",
  },
  {
    value: "departments",
    label: "Connecting information across departments",
    slug: "manufacturing-operating-system",
  },
  {
    value: "tenders",
    label: "Moving from tender documents to quotations",
    slug: "tender-to-quotation",
  },
] as const;
export function WorkflowDiagnostic() {
  const [choice, setChoice] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const project = result ? bySlug(result) : null;
  return (
    <section
      id="diagnostic"
      className="diagnostic-section dark section-space"
      aria-labelledby="diagnostic-title"
    >
      <div className="shell diagnostic-layout">
        <div>
          <p className="eyebrow">06 / Start with the workflow</p>
          <h2 id="diagnostic-title">
            Where does
            <br />
            the work slow down?
          </h2>
          <p>
            A useful system starts with a clear problem. Find a relevant example before we talk.
          </p>
          <p className="caption">
            A simple guide, not an automated audit. No answers are stored or sent.
          </p>
        </div>
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const found = challenges.find((c) => c.value === choice);
              if (found) setResult(found.slug);
            }}
          >
            <label htmlFor="workflow-challenge">Which challenge sounds familiar?</label>
            <select
              id="workflow-challenge"
              required
              value={choice}
              onChange={(e) => {
                setChoice(e.target.value);
                setResult(null);
              }}
            >
              <option value="">Choose a workflow challenge</option>
              {challenges.map((c) => (
                <option value={c.value} key={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <button className="button button-light" type="submit">
              Find a relevant system <span aria-hidden="true">↗</span>
            </button>
          </form>
          <div className="diagnostic-result" aria-live="polite">
            {project && (
              <>
                <p className="eyebrow">A useful starting point</p>
                <h3>{project.title}</h3>
                <p>{project.statusLabel ?? project.status.join(" / ")}</p>
                <Link className="text-link" to="/work/$slug" params={{ slug: project.slug }}>
                  Explore this system ↗
                </Link>
                <a href="#contact" className="text-link">
                  Describe your own workflow ↗
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
