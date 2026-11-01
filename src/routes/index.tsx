import { useRef } from "react";
import { useSectionReveals } from "@/lib/useSectionReveals";
import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Cinematic } from "@/components/site/Cinematic";
import { IndustryJourney } from "@/components/site/IndustryJourney";
import { CapabilitiesSection, Engagement } from "@/components/site/Capabilities";
import { Specialized } from "@/components/site/work/Specialized";
import { Research } from "@/components/site/work/Research";
import { Work } from "@/components/site/Work";
import { About, Contact } from "@/components/site/AboutContact";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Swayam Singh — AI & Solutions Consultant" },
      {
        name: "description",
        content:
          "Intelligent software systems for manufacturing, EPC, construction, and real estate businesses.",
      },
      { property: "og:title", content: "Swayam Singh — Industry → Intelligence" },
      {
        property: "og:description",
        content: "AI, automation, and custom software for complex industrial operations.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const root = useRef<HTMLDivElement>(null);
  useSectionReveals(root);
  return (
    <div id="top" ref={root}>
      <Nav />
      <main id="main-content">
        <Cinematic />
        <CapabilitiesSection />
        <IndustryJourney />
        <Work />
        <Engagement />
        <details className="shell supporting-work">
          <summary>
            Specialized engineering & research <span>Explore additional work ↗</span>
          </summary>
          <Specialized />
          <Research />
        </details>
        <About />

        <Contact />
      </main>
    </div>
  );
}
