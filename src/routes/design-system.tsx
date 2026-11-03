import { MediaReviewExamples } from "@/components/site/case-study/MediaReviewExamples";
import { useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Container,
  Section,
  SectionHeading,
  EditorialHeading,
  PrimaryButton,
  SecondaryButton,
  IndustryBadge,
  ProjectStatusBadge,
  ProjectCardShell,
  CopperDivider,
  LightDarkSectionTransition,
  AccessibleModal,
  Footer,
} from "@/components/design-system";
import { Navigation } from "@/components/site/Nav";
export const Route = createFileRoute("/design-system")({
  head: () => ({
    meta: [
      { title: "Editorial Contrast — Component system" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: DesignSystem,
});
function DesignSystem() {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  return (
    <div id="top">
      <Navigation />
      <main id="main-content">
        <Section>
          <Container>
            <SectionHeading
              as="h1"
              eyebrow="Theme C / Design foundations"
              title={
                <>
                  Editorial
                  <br />
                  <em>contrast.</em>
                </>
              }
            >
              <p>
                A restrained system for complex industries. Black reading surfaces, cream typography, precise technical
                typography and copper at the edges.
              </p>
            </SectionHeading>
            <CopperDivider />
            <div className="ds-example-actions">
              <PrimaryButton href="/#contact">Discuss your project ↗</PrimaryButton>
              <SecondaryButton href="/#work">Explore selected work ↗</SecondaryButton>
              <PrimaryButton disabled>Unavailable</PrimaryButton>
            </div>
            <IndustryBadge>Manufacturing</IndustryBadge>{" "}
            <ProjectStatusBadge status={["In Development"]} />
            <div className="ds-example-actions">
              <button
                ref={trigger}
                className="ds-button ds-button-secondary"
                onClick={() => dialog.current?.showModal()}
              >
                Inspect accessible modal
              </button>
            </div>
            <AccessibleModal
              ref={dialog}
              aria-labelledby="example-dialog-title"
              onClose={() => trigger.current?.focus()}
            >
              <h2 id="example-dialog-title">A focused conversation.</h2>
              <p>Native modal focus containment, Escape dismissal and focus restoration.</p>
              <PrimaryButton autoFocus onClick={() => dialog.current?.close()}>
                Close preview
              </PrimaryButton>
            </AccessibleModal>
          </Container>
        </Section>
        <Section tone="warm">
          <Container>
            <SectionHeading eyebrow="01 / Palette & material" title="Warmth, with precision." />
            <div className="ds-example-grid">
              {[
                ["Cream accent", "var(--color-cream)"],
                ["Copper", "var(--gradient-copper)"],
                ["Industrial depth", "var(--gradient-industrial)"],
              ].map(([label, background]) => (
                <div key={label}>
                  <div className="ds-swatch" style={{ background }} />
                  <p>{label}</p>
                </div>
              ))}
            </div>
          </Container>
        </Section>
        <LightDarkSectionTransition />
        <Section tone="dark">
          <Container>
            <SectionHeading
              eyebrow="02 / Product gallery"
              title={
                <>
                  Systems with
                  <br />
                  <em>visible scope.</em>
                </>
              }
            >
              <p>
                Example shells use real project names and existing development states. These are
                component examples, not new delivery evidence.
              </p>
            </SectionHeading>
            <div className="ds-example-grid">
              {[
                "Manufacturing Operating System",
                "Production Intelligence Platform",
                "BOQ Intelligence Platform",
              ].map((title) => (
                <ProjectCardShell key={title}>
                  <ProjectStatusBadge status={["In Development"]} />
                  <h3 style={{ fontSize: "1.5rem", marginBlock: "2rem" }}>{title}</h3>
                  <CopperDivider />
                  <p>
                    Reusable editorial shell. Product evidence remains in the existing case study.
                  </p>
                </ProjectCardShell>
              ))}
            </div>
            <div className="ds-example-actions">
              <PrimaryButton href="/#work">Inspect the existing work ↗</PrimaryButton>
              <SecondaryButton href="/#contact">Start a conversation ↗</SecondaryButton>
            </div>
          </Container>
        </Section>
        <LightDarkSectionTransition direction="to-light" />
        <Section>
          <Container>
            <p className="ds-eyebrow">03 / Type & hierarchy</p>
            <EditorialHeading>Engineering clarity.</EditorialHeading>
            <h3 style={{ font: "500 2rem var(--font-display)", marginBlock: "2rem" }}>
              Space Grotesk / Technical heading
            </h3>
            <p style={{ maxWidth: "60ch" }}>
              Manrope / Body and interface. Clear inputs, useful scope and a practical path from
              industrial workflows to connected software.
            </p>
            <CopperDivider />
            {import.meta.env.DEV && <MediaReviewExamples />}
            <Footer />
          </Container>
        </Section>
      </main>
    </div>
  );
}
