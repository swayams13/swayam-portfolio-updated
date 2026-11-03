import { ProjectGallery } from "@/components/site/gallery/ProjectGallery";
import { useState, type ReactNode, type KeyboardEvent } from "react";
import { Link } from "@tanstack/react-router";
import {
  Container,
  Section,
  EditorialHeading,
  PrimaryButton,
  SecondaryButton,
} from "@/components/design-system";
import {
  consultingHomepage as copy,
  consultingIndustries,
  type ConsultingIndustryId,
} from "@/lib/content";

function SectorIcon({ kind }: { kind: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
      <path
        d={
          kind === "factory"
            ? "M5 33V19l10-6v7l10-6v19H5ZM28 33V8h6v25M10 26h3m5 0h3"
            : kind === "engineering"
              ? "M6 31 20 6l14 25H6ZM12 26h16M20 16v15M5 35h30"
              : kind === "construction"
                ? "M6 34V7h28M20 7v27M7 14h27M30 14v12M27 26h6M14 34h12"
                : "M8 34V12l12-6 12 6v22H8ZM15 14h3m4 0h3m-10 7h3m4 0h3m-10 7h3m4 0h3"
        }
      />
    </svg>
  );
}
export function ConsultingHero() {
  return (
    <Section className="consulting-hero">
      <Container>
        <p className="ds-eyebrow">{copy.eyebrow}</p>
        <div className="consulting-hero-grid">
          <div>
            <EditorialHeading as="h1">
              {copy.headline[0]}
              <br />
              <em>{copy.headline[1]}</em>
            </EditorialHeading>
            <p className="consulting-intro">{copy.intro}</p>
            <div className="ds-example-actions">
              <PrimaryButton href="#work">
                Explore Selected Work <span aria-hidden="true">↗</span>
              </PrimaryButton>
              <SecondaryButton href="#contact">
                Discuss a Project <span aria-hidden="true">↗</span>
              </SecondaryButton>
            </div>
          </div>
          <div className="architectural-study" aria-hidden="true">
            <div className="study-grid" />
            <div className="study-block study-block-one" />
            <div className="study-block study-block-two" />
            <div className="study-block study-block-three" />
            <span className="study-caption">Workflow / Structure / Clarity</span>
          </div>
        </div>
      </Container>
    </Section>
  );
}

/** Native buttons keep Tab/Enter/Space; arrows/Home/End also select and retain focus. */
export function IndustrySelector({
  active,
  onChange,
}: {
  active: ConsultingIndustryId;
  onChange: (id: ConsultingIndustryId) => void;
}) {
  const industry = consultingIndustries.find((s) => s.id === active)!;
  const keyboard = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % consultingIndustries.length;
    else if (event.key === "ArrowLeft")
      next = (index + consultingIndustries.length - 1) % consultingIndustries.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = consultingIndustries.length - 1;
    else return;
    event.preventDefault();
    onChange(consultingIndustries[next]!.id);
    (event.currentTarget.parentElement?.children[next] as HTMLButtonElement)?.focus();
  };
  return (
    <Section id="industries" className="consulting-industries" aria-labelledby="industry-heading">
      <Container>
        <div className="consulting-section-top">
          <p className="ds-eyebrow">01 / Your industry</p>
          <h2 id="industry-heading">Built around how you work.</h2>
        </div>
        <div className="sector-selector" role="group" aria-label="Choose your industry">
          {consultingIndustries.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-pressed={active === s.id}
              aria-controls="sector-context selected-projects"
              onClick={() => onChange(s.id)}
              onKeyDown={(event) => keyboard(event, i)}
            >
              <SectorIcon kind={s.icon} />
              <span>{s.label}</span>
              <span aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
        <div id="sector-context" className="sector-context" aria-live="polite" aria-atomic="true">
          <div>
            <h3>{industry.title}</h3>
            <p>{industry.copy}</p>
          </div>
          <div>
            <p className="ds-eyebrow">Prospective use cases</p>
            <ul>
              {industry.useCases.map((use) => (
                <li key={use}>{use}</li>
              ))}
            </ul>
          </div>
        </div>
        <a
          href="#contact"
          className="text-link"
          onClick={() =>
            window.dispatchEvent(
              new CustomEvent("inquiry-industry-choice", { detail: industry.label }),
            )
          }
        >
          Discuss a {industry.label} workflow ↗
        </a>
      </Container>
    </Section>
  );
}

export function ConsultingOutcomes() {
  return (
    <Section id="services" aria-labelledby="outcomes-title">
      <Container>
        <p className="ds-eyebrow">03 / Intended benefits</p>
        <div className="outcome-layout">
          <div>
            <EditorialHeading id="outcomes-title">
              Less friction.
              <br />
              <em>More clarity.</em>
            </EditorialHeading>
            <p>
              What a useful system can support. These are intended benefits, not measured results
              from past projects.
            </p>
          </div>
          <ol>
            {copy.outcomes.map((outcome, i) => (
              <li key={outcome}>
                <span>0{i + 1}</span>
                <h3>{outcome}</h3>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
export function ConsultingProcess() {
  return (
    <Section id="approach" className="consulting-process" aria-labelledby="process-title">
      <Container>
        <p className="ds-eyebrow">04 / How I work</p>
        <h2 id="process-title">A clear scope. A practical next step.</h2>
        <ol>
          {copy.steps.map((step, i) => (
            <li key={step.title}>
              <span className="ds-eyebrow">0{i + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
export function ConsultingAbout() {
  return (
    <Section id="about" aria-labelledby="consultant-title">
      <Container>
        <div className="consulting-about">
          <div>
            <p className="ds-eyebrow">05 / Your consultant</p>
            <EditorialHeading id="consultant-title">
              An engineering
              <br />
              <em>mindset.</em>
            </EditorialHeading>
          </div>
          <div>
            <p className="lead">{copy.about}</p>
            <p>{copy.approach}</p>
            <nav aria-label="Supporting work">
              <Link
                to="/work/$slug"
                params={{ slug: "expansion-joint-automation" }}
                className="text-link"
              >
                Specialized engineering ↗
              </Link>
              <Link
                to="/work/$slug"
                params={{ slug: "pressure-vessel-tools" }}
                className="text-link"
              >
                Pressure vessel tools ↗
              </Link>
              <Link to="/work/$slug" params={{ slug: "vendor-registration" }} className="text-link">
                Vendor workflow concept ↗
              </Link>
              <Link
                to="/work/$slug"
                params={{ slug: "workforce-resource-management" }}
                className="text-link"
              >
                Workforce systems ↗
              </Link>
              <Link to="/work/$slug" params={{ slug: "medpulse" }} className="text-link">
                MedPulse research brief ↗
              </Link>
            </nav>
          </div>
        </div>
      </Container>
    </Section>
  );
}
export function IndustryWork({
  children,
  active: controlledActive,
  onIndustryChange,
  selectedSlug,
  onProjectChange,
}: {
  selectedSlug?: string;
  onProjectChange?: (slug: string) => void;
  children?: ReactNode;
  active?: ConsultingIndustryId;
  onIndustryChange?: (id: ConsultingIndustryId) => void;
}) {
  const [localActive, setActive] = useState<ConsultingIndustryId>("manufacturing");
  const active = controlledActive ?? localActive;
  const industry = consultingIndustries.find((s) => s.id === active)!;
  return (
    <>
      <IndustrySelector active={active} onChange={onIndustryChange ?? setActive} />
      <Section
        id="work"
        tone="dark"
        className="consulting-work"
        aria-labelledby="selected-work-title"
      >
        <Container>
          <div className="consulting-section-top">
            <p className="ds-eyebrow">02 / Selected work</p>
            <h2 id="selected-work-title">Practical systems. Visible scope.</h2>
          </div>
          <ProjectGallery
            key={active}
            industry={industry}
            selectedSlug={selectedSlug}
            onProjectChange={onProjectChange}
          />
          {children}
        </Container>
      </Section>
    </>
  );
}
