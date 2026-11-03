import { trackConversion } from "@/lib/analytics";
import { gallerySearch } from "@/lib/gallery";
import { createFileRoute, stripSearchParams, type SearchSchemaInput } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { useEffect } from "react";
import { useLocation, useNavigate, Link } from "@tanstack/react-router";
import { flagships, type ConsultingIndustryId } from "@/lib/content";
import { Contact } from "@/components/site/Contact";
import {
  ConsultingHero,
  IndustryWork,
  ConsultingOutcomes,
  ConsultingProcess,
  ConsultingAbout,
} from "@/components/site/home/ConsultingHomepage";

export const Route = createFileRoute("/")({
  search: {
    middlewares: [
      stripSearchParams({ industry: "manufacturing", project: "production-intelligence" }),
    ],
  },
  validateSearch: (input: { industry?: unknown; project?: unknown } & SearchSchemaInput) =>
    gallerySearch(input),
  head: () => ({
    meta: [
      { title: "Swayam Singh — AI & Solutions Consultant" },
      {
        name: "description",
        content:
          "AI, automation and custom software for manufacturing, EPC and engineering, construction and real estate.",
      },
      { property: "og:title", content: "Swayam Singh — AI & Solutions Consultant" },
      {
        property: "og:description",
        content:
          "AI, automation and custom software for manufacturing, EPC and engineering, construction and real estate.",
      },
      { property: "og:url", content: "https://swayam-singh.vercel.app/" },
    ],
    links: [{ rel: "canonical", href: "https://swayam-singh.vercel.app/" }],
  }),
  component: Index,
});

function Index() {
  const { industry, project } = Route.useSearch();
  const hash = useLocation({ select: (location) => location.hash });
  const navigate = useNavigate();
  const setIndustry = (id: ConsultingIndustryId) => {
    if (id !== industry) trackConversion("industry_selected", { industry: id });
    void navigate({
      to: "/",
      search: gallerySearch({ industry: id }),
      hash,
      replace: true,
      resetScroll: false,
      hashScrollIntoView: false,
    });
  };
  const setProject = (slug: string) => {
    void navigate({
      to: "/",
      search: { industry, project: slug },
      hash,
      replace: true,
      resetScroll: false,
      hashScrollIntoView: false,
    });
  };
  useEffect(() => {
    // Preserve explicit legacy sample links without intercepting ordinary page scroll.
    if (flagships.some((p) => hash === p.slug || hash === `${p.slug}-demo`))
      void navigate({ to: "/samples", hash, replace: true });
  }, [hash, navigate]);
  return (
    <div id="top">
      <Nav />
      <main id="main-content">
        <ConsultingHero />
        <IndustryWork
          active={industry}
          onIndustryChange={setIndustry}
          selectedSlug={project}
          onProjectChange={setProject}
        >
          <Link className="text-link sample-library-link" to="/samples">
            Explore all interactive portfolio samples ↗
          </Link>
          <Link className="text-link sample-library-link all-projects-link" to="/projects">
            Browse all projects ↗
          </Link>
          <Link className="text-link sample-library-link all-projects-link" to="/advisor">
            Ask the Solutions Advisor ↗
          </Link>
        </IndustryWork>
        <ConsultingOutcomes />
        <ConsultingProcess />
        <ConsultingAbout />
        <Contact />
      </main>
    </div>
  );
}
