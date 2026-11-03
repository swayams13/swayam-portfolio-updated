import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Contact } from "@/components/site/Contact";
import { Container, Section } from "@/components/design-system";
import { SolutionsAdvisor } from "@/components/site/advisor/SolutionsAdvisor";
export const Route = createFileRoute("/advisor")({
  head: () => ({
    meta: [
      { title: "AI Solutions Advisor — Swayam Singh" },
      {
        name: "description",
        content:
          "Find relevant public project capabilities, understand development limits and choose whether to discuss your workflow.",
      },
      { property: "og:title", content: "AI Solutions Advisor — Swayam Singh" },
      {
        property: "og:description",
        content:
          "Find relevant public project capabilities, understand development limits and choose whether to discuss your workflow.",
      },
      { property: "og:url", content: "https://swayam-singh.vercel.app/advisor" },
    ],
    links: [{ rel: "canonical", href: "https://swayam-singh.vercel.app/advisor" }],
  }),
  component: Advisor,
});
function Advisor() {
  return (
    <div id="top">
      <Nav />
      <main id="main-content">
        <Section>
          <Container>
            <SolutionsAdvisor />
          </Container>
        </Section>
        <Contact />
      </main>
    </div>
  );
}
