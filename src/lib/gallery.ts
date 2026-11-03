import { consultingIndustries, type ConsultingIndustryId } from "./content";

/** Only allow known sector/project pairs in shareable navigation state. */
export function gallerySearch(input: { industry?: unknown; project?: unknown }): {
  industry: ConsultingIndustryId;
  project: string;
} {
  const sector =
    consultingIndustries.find((s) => s.id === input.industry) ?? consultingIndustries[0];
  const project =
    sector.projectSlugs.find((slug) => slug === input.project) ?? sector.projectSlugs[0];
  return { industry: sector.id, project };
}
