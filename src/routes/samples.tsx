import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { WorkflowExplorer } from "@/components/site/WorkflowExplorer";
import { Work } from "@/components/site/Work";
import { Footer, Container, Section, EditorialHeading } from "@/components/design-system";
export const Route = createFileRoute("/samples")({
  head: () => ({
    meta: [
      { title: "Interactive workflow samples — Swayam Singh" },
      {
        name: "description",
        content:
          "Explore five illustrative software workflows using sample data. These demonstrations are not client deployment evidence.",
      },
      { property: "og:title", content: "Interactive workflow samples — Swayam Singh" },
      {
        property: "og:description",
        content:
          "Explore five illustrative software workflows using sample data. These demonstrations are not client deployment evidence.",
      },
      { property: "og:url", content: "https://swayam-singh.vercel.app/samples" },
    ],
    links: [{ rel: "canonical", href: "https://swayam-singh.vercel.app/samples" }],
  }),
  component: Samples,
});
function Samples() {
  return (
    <div id="top">
      <Nav />
      <main id="main-content">
        <Section>
          <Container>
            <EditorialHeading as="h1">Interactive workflow samples.</EditorialHeading>
            <p className="lead">
              Illustrative interfaces and sample data. Explore the controls without implying a live
              client system.
            </p>
            <WorkflowExplorer />
          </Container>
        </Section>
        <Work />
      </main>
      <div className="ds-section ds-tone-light">
        <Container>
          <Footer />
        </Container>
      </div>
    </div>
  );
}
