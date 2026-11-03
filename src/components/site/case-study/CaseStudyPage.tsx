import { usePageConversion } from "@/lib/use-conversion";
import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  Container,
  EditorialHeading,
  Footer,
  ProjectStatusBadge,
  Section,
} from "@/components/design-system";
import { Nav } from "@/components/site/Nav";
import { caseStudies, contactDetails, type ConsultingIndustryId } from "@/lib/content";
import type { CaseStudyProject } from "@/lib/case-study";
import { gallerySearch } from "@/lib/gallery";
import { CaseStudyVideo, ProductPreview, ScreenshotGallery } from "./CaseStudyMedia";
function StorySection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="story-section" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`}>{title}</h2>
      <div>{children}</div>
    </section>
  );
}
function CapabilityList({
  title,
  items,
  empty,
}: {
  title: string;
  items: string[];
  empty?: string;
}) {
  return (
    <div className="story-capability-group">
      <h3>{title}</h3>
      {items.length ? (
        <ul>
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="caption">{empty ?? "None recorded in the current brief."}</p>
      )}
    </div>
  );
}
export function CaseStudyPage({
  project: p,
  galleryIndustry,
}: {
  project: CaseStudyProject;
  galleryIndustry?: ConsultingIndustryId | undefined;
}) {
  usePageConversion("case_study_opened", p.slug);
  const related = p.relatedProjects
    .map((slug) => caseStudies.find((item) => item.slug === slug))
    .filter((item): item is CaseStudyProject => Boolean(item));
  return (
    <div id="top">
      <Nav />
      <main id="main-content">
        <header className="story-hero">
          <Container>
            <Link
              to="/"
              hash="work"
              search={gallerySearch({ industry: galleryIndustry, project: p.slug })}
              className="text-link"
            >
              ← Selected systems
            </Link>
            <div className="story-meta">
              <span className="ds-eyebrow">
                {p.kind === "research" ? "Research story" : "Project brief"} /{" "}
                {p.industries.join(" · ")}
              </span>
              <ProjectStatusBadge status={p.maturityStatus.labels} />
            </div>
            <EditorialHeading as="h1">{p.title}</EditorialHeading>
            <p className="story-deck">{p.shortDescription}</p>
            <p className="caption story-maturity">{p.maturityStatus.summary}</p>
            <ProductPreview project={p} />
          </Container>
        </header>
        <Container>
          <nav className="story-nav" aria-label="On this project page">
            <a href="#challenge">Challenge</a>
            <a href="#workflow">Solution</a>
            <a href="#demo">Media</a>
            <a href="#capabilities">Capability scope</a>
            <a href="#architecture">Architecture</a>
            <a href="#outcomes">Evidence & limitations</a>
          </nav>
          <StorySection
            id="challenge"
            title={p.kind === "research" ? "The research question" : "The business problem"}
          >
            <p className="story-lead">{p.businessProblem}</p>
          </StorySection>
          <StorySection
            id="workflow"
            title={p.kind === "research" ? "Method & approach" : "The solution approach"}
          >
            <p className="story-lead">{p.solutionSummary}</p>
            <ol className="story-workflow">
              {p.workflow.map((step, i) => (
                <li key={step}>
                  <span>0{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </StorySection>
          {p.caseStudySections.map((section) => (
            <StorySection key={section.id} id={section.id} title={section.title}>
              {section.paragraphs.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </StorySection>
          ))}
          <StorySection id="demo" title="Inspect the work">
            <CaseStudyVideo project={p} />
            <h3 className="story-media-heading">Screenshots</h3>
            <ScreenshotGallery screenshots={p.screenshots} />
            {p.sampleUrl && (
              <aside className="story-sample">
                <p>
                  Separate from product evidence: an interactive portfolio sample uses illustrative
                  data.
                </p>
                <a href={p.sampleUrl} className="text-link">
                  Open the interactive portfolio sample ↗
                </a>
              </aside>
            )}
          </StorySection>
          <StorySection id="capabilities" title="Capability scope">
            <p className="caption">
              Verified evidence and authored implementation states are kept separate.
            </p>
            <div className="story-capabilities">
              <CapabilityList
                title="Verified capabilities"
                items={p.verifiedCapabilities.map((item) => item.name)}
                empty="No product capabilities have been independently verified from supplied artifacts."
              />
              <CapabilityList
                title="Reported implemented · evidence pending"
                items={p.reportedImplementedCapabilities}
              />
              <CapabilityList title="In development" items={p.inDevelopmentCapabilities} />
              <CapabilityList title="Planned" items={p.plannedCapabilities} />
              <CapabilityList title="Scope to confirm" items={p.unverifiedCapabilities} />
            </div>
            {p.verifiedCapabilities.length > 0 && (
              <ul className="caption">
                {p.verifiedCapabilities.map((item) => (
                  <li key={item.name}>
                    {item.name}: {item.evidence} · {item.verifiedAt}
                  </li>
                ))}
              </ul>
            )}
          </StorySection>
          <StorySection id="architecture" title="Architecture & technology">
            <p>{p.architectureSummary.description}</p>
            <details className="story-disclosure">
              <summary>
                Explore the {p.architectureSummary.conceptual ? "conceptual " : ""}architecture
              </summary>
              <ol className="story-workflow">
                {p.architectureSummary.layers.map((layer) => (
                  <li key={layer}>{layer}</li>
                ))}
              </ol>
            </details>
            <h3 className="story-media-heading">Technology stack</h3>
            {p.technologyStack.length ? (
              <ul>
                {p.technologyStack.map((tech) => (
                  <li key={tech.name}>
                    {tech.name} — {tech.evidence}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="caption">
                The project’s technology stack has not been verified. The portfolio’s own framework
                is not evidence of this project’s implementation.
              </p>
            )}
          </StorySection>
          <StorySection id="outcomes" title="Outcomes & honest limitations">
            {p.verifiedOutcomes.length ? (
              <ul>
                {p.verifiedOutcomes.map((outcome) => (
                  <li key={outcome.name}>
                    <strong>{outcome.name}</strong>
                    <p>
                      {outcome.evidence} · {outcome.verifiedAt}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="story-lead">
                No independently verified business outcomes have been supplied. No savings, accuracy
                or ROI figures are asserted.
              </p>
            )}
            <h3 className="story-media-heading">Limitations</h3>
            <ul className="story-limitations">
              {p.limitations.map((limitation) => (
                <li key={limitation}>{limitation}</li>
              ))}
            </ul>
            <p className="caption">
              {p.lastVerifiedDate
                ? `Last evidence verification: ${p.lastVerifiedDate}`
                : "Last evidence verification: pending. No verification date is asserted."}
            </p>
          </StorySection>
          {related.length > 0 && (
            <StorySection
              id="related"
              title={p.kind === "research" ? "Related research" : "Related project briefs"}
            >
              <div className="story-related">
                {related.map((item) => (
                  <Link
                    key={item.slug}
                    to="/work/$slug"
                    params={{ slug: item.slug }}
                    search={{ galleryIndustry }}
                  >
                    <ProjectStatusBadge status={item.maturityStatus.labels} />
                    <h3>{item.title} ↗</h3>
                    <p>{item.shortDescription}</p>
                  </Link>
                ))}
              </div>
            </StorySection>
          )}
          <Section className="story-cta">
            <p className="ds-eyebrow">
              {p.kind === "research"
                ? "Discuss this research"
                : `Similar workflow / ${p.industries[0]}`}
            </p>
            <EditorialHeading>
              {p.kind === "research"
                ? "Start a research conversation."
                : "Bring your workflow into focus."}
            </EditorialHeading>
            <p>
              {p.kind === "research"
                ? "Ask about the research scope and available evidence."
                : `Discuss a challenge related to ${p.title.toLowerCase()}. Begin with a complimentary discovery call.`}
            </p>
            <a
              href={`mailto:${contactDetails.email}?subject=${encodeURIComponent(`Inquiry about ${p.title}`)}`}
              className="ds-button ds-button-primary"
            >
              {p.kind === "research" ? "Discuss the research" : "Discuss a similar workflow"} ↗
            </a>
            <a href="/#contact" className="text-link">
              Use the project inquiry form ↗
            </a>
          </Section>
          <Footer />
        </Container>
      </main>
    </div>
  );
}
