import { createFileRoute, Link } from "@tanstack/react-router";
import { projects } from "@/lib/content";
import {
  Container,
  Section,
  EditorialHeading,
  ProjectStatusBadge,
  Footer,
} from "@/components/design-system";
import { Nav } from "@/components/site/Nav";
export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "All projects — Swayam Singh" },
      {
        name: "description",
        content:
          "Explore industrial platforms, engineering tools, document workflow prototypes and applied AI research with explicit maturity states.",
      },
      { property: "og:title", content: "All projects — Swayam Singh" },
      {
        property: "og:description",
        content:
          "Explore industrial platforms, engineering tools, document workflow prototypes and applied AI research with explicit maturity states.",
      },
      { property: "og:url", content: "https://swayam-singh.vercel.app/projects" },
    ],
    links: [{ rel: "canonical", href: "https://swayam-singh.vercel.app/projects" }],
  }),
  component: AllProjects,
});
function AllProjects() {
  return (
    <div id="top">
      <Nav />
      <main id="main-content">
        <Section>
          <Container>
            <p className="ds-eyebrow">Project index / All work</p>
            <EditorialHeading as="h1">
              Systems, tools
              <br />
              <em>and research.</em>
            </EditorialHeading>
            <p className="lead">
              Project briefs include delivered-component claims, development, prototypes and
              proposed workflows. Status is not independent delivery verification.
            </p>
            <div className="project-index">
              {projects.map((p) => (
                <article key={p.slug}>
                  <ProjectStatusBadge status={p.status} />
                  <h2>{p.title}</h2>
                  <p className="ds-eyebrow">{p.industry}</p>
                  <p>{p.summary}</p>
                  <Link to="/work/$slug" params={{ slug: p.slug }} className="text-link">
                    View Case Study ↗
                  </Link>
                </article>
              ))}
            </div>
          </Container>
        </Section>
      </main>
      <Container>
        <Footer />
      </Container>
    </div>
  );
}
