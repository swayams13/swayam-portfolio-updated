import { createFileRoute, notFound, type SearchSchemaInput } from "@tanstack/react-router";
import { gallerySearch } from "@/lib/gallery";
import { caseStudies } from "@/lib/content";
import { caseStudyStructuredData, caseStudyUrl, SITE_ORIGIN } from "@/lib/case-study";
import { CaseStudyPage } from "@/components/site/case-study/CaseStudyPage";

export const Route = createFileRoute("/work/$slug")({
  validateSearch: (input: { galleryIndustry?: unknown } & SearchSchemaInput) => ({
    galleryIndustry:
      input.galleryIndustry === undefined
        ? undefined
        : gallerySearch({ industry: input.galleryIndustry }).industry,
  }),
  loader: ({ params }) => {
    const project = caseStudies.find((p) => p.slug === params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return { meta: [{ title: "Project not found" }, { name: "robots", content: "noindex" }] };
    const project = loaderData.project;
    const url = caseStudyUrl(project);
    const image = project.screenshots[0];
    return {
      meta: [
        {
          title: `${project.title}${project.kind === "research" ? " — Research" : " — Project Brief"} | Swayam Singh`,
        },
        { name: "description", content: project.shortDescription },
        { property: "og:title", content: project.title },
        { property: "og:description", content: project.shortDescription },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: image ? "summary_large_image" : "summary" },
        ...(image
          ? [
              { property: "og:image", content: new URL(image.src, SITE_ORIGIN).href },
              { property: "og:image:alt", content: image.alt },
            ]
          : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(caseStudyStructuredData(project)).replace(/</g, "\\u003c"),
        },
      ],
    };
  },
  component: CaseStudy,
});
function CaseStudy() {
  const { project } = Route.useLoaderData();
  const { galleryIndustry } = Route.useSearch();
  return <CaseStudyPage project={project} galleryIndustry={galleryIndustry} />;
}
