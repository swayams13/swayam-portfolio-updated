import { research } from "@/lib/content";
import { Ctas, StatusTag } from "./shared";

function MethodFigure() {
  const nodes = [
    ["Handwriting samples", "input"],
    ["Handwriting-related features", "extraction"],
    ["Other modalities", "input"],
    ["Multimodal fusion model", "model"],
    ["Research signal", "output"],
  ];
  return (
    <figure>
      <svg
        viewBox="0 0 640 260"
        className="h-auto w-full text-charcoal"
        role="img"
        aria-label="Research method diagram"
      >
        <g fill="none" stroke="currentColor" strokeWidth={1}>
          <rect x={10} y={30} width={150} height={56} />
          <rect x={10} y={170} width={150} height={56} />
          <rect x={220} y={30} width={150} height={56} />
          <rect x={430} y={100} width={150} height={56} />
          <path d="M160,58 H220 M370,58 C400,58 400,128 430,128 M160,198 C300,198 400,198 400,150 L430,140" />
        </g>
        <path d="M580,128 H630" stroke="var(--copper)" strokeWidth={1.4} />
        <g fontFamily="var(--font-mono)" fontSize={10} letterSpacing="0.08em" fill="currentColor">
          <text x={20} y={62}>
            HANDWRITING
          </text>
          <text x={20} y={202}>
            OTHER MODALITIES
          </text>
          <text x={230} y={62}>
            FEATURE EXTRACTION
          </text>
          <text x={440} y={132}>
            MULTIMODAL FUSION
          </text>
          <text x={590} y={120} fill="var(--copper)">
            SIGNAL
          </text>
        </g>
      </svg>
      <figcaption className="label mt-4 text-[0.6rem] text-muted-foreground">
        Fig. 1 — Simplified research method. {nodes.length} stages; schematic only.
      </figcaption>
    </figure>
  );
}

export function Research() {
  const p = research[0]!;
  return (
    <section
      id="research"
      className="research-section section-space"
      aria-labelledby="research-title"
    >
      <div className="shell">
        <div className="research-layout">
          <div>
            <p className="eyebrow">04 / Research & innovation</p>
            <StatusTag status={p.status} />
            <h2 id="research-title">
              A different lens
              <br />
              on applied AI.
            </h2>
            <p className="project-subtitle">MedPulse</p>
            <p>{p.summary}</p>
            <Ctas p={p} />
          </div>
          <div className="research-figure">
            <p className="label">Method / Multimodal research</p>
            <MethodFigure />
            <p className="caption">
              Research only. Not a clinical tool; no validated diagnostic effectiveness is claimed.
            </p>
            <p className="caption">
              Application reference supplied: {p.patent}. Publication and attribution require
              verification.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
