import type { Status } from "./content";

export type EvidenceStatement = { name: string; evidence: string; verifiedAt: string };
export type ProjectScreenshot = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
  srcSet?: string;
  sizes?: string;
};
export type VideoCaption = { src: string; language: string; label: string };
export type CaseStudySection = { id: string; title: string; paragraphs: string[] };
export type CaseStudyProject = {
  id: string;
  slug: string;
  title: string;
  kind: "industrial" | "research";
  industries: string[];
  shortDescription: string;
  businessProblem: string;
  solutionSummary: string;
  maturityStatus: { labels: Status[]; summary: string };
  verifiedCapabilities: EvidenceStatement[];
  reportedImplementedCapabilities: string[];
  unverifiedCapabilities: string[];
  inDevelopmentCapabilities: string[];
  plannedCapabilities: string[];
  technologyStack: { name: string; evidence: string }[];
  architectureSummary: { description: string; layers: string[]; conceptual: boolean };
  screenshots: ProjectScreenshot[];
  videoPoster: string | null;
  videoSource: string | null;
  videoCaptions: VideoCaption[];
  videoTranscript: { language: string; paragraphs: string[] } | null;
  verifiedOutcomes: EvidenceStatement[];
  limitations: string[];
  caseStudySections: CaseStudySection[];
  relatedProjects: string[];
  lastVerifiedDate: string | null;
  workflow: string[];
  sampleUrl: string | null;
  assetRequirements: string[];
};

export const SITE_ORIGIN = "https://swayam-singh.vercel.app";
export const caseStudyUrl = (project: Pick<CaseStudyProject, "slug">) =>
  `${SITE_ORIGIN}/work/${encodeURIComponent(project.slug)}`;
export function caseStudyStructuredData(project: CaseStudyProject) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${caseStudyUrl(project)}#story`,
    name: project.title,
    description: project.shortDescription,
    url: caseStudyUrl(project),
    author: { "@type": "Person", name: "Swayam Singh" },
    genre:
      project.kind === "research" ? "Research project brief" : "Industrial software project brief",
    about: project.industries.map((name) => ({ "@type": "Thing", name })),
    ...(project.screenshots[0]
      ? { image: new URL(project.screenshots[0].src, SITE_ORIGIN).href }
      : {}),
  };
}
