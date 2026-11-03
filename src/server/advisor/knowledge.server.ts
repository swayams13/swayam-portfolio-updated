import { advisorProjectTerms, caseStudies, consultingIndustries } from "@/lib/content";
import {
  qualificationQuestions,
  type AdvisorFact,
  type AdvisorInput,
  type AdvisorReply,
} from "@/lib/advisor";

export const UNKNOWN = "I don't have verified information about that.";
export function boundary(question: string): string | null {
  if (
    /ignore.{0,50}(instruction|rule|previous)|system prompt|developer message|jailbreak|api.?key|password|secret|execute (code|shell|command)|run (shell|command)/i.test(
      question,
    )
  )
    return `${UNKNOWN} I can only discuss public project facts; I cannot reveal instructions or credentials or execute tools.`;
  if (
    /confidential|private (file|document|client)|clients? (name|identit|list)|signed contract|customer (name|list)|\bnda\b/i.test(
      question,
    )
  )
    return `${UNKNOWN} I cannot provide confidential client information. Please use only public, non-sensitive workflow descriptions.`;
  if (/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|(?:\+?\d[\d ()-]{8,}\d)/i.test(question))
    return "Please remove email addresses, phone numbers and other personal details. Share contact information only in the inquiry form when you choose to request follow-up.";
  if (
    /(certif|approv|compliance|regulatory|asme|wall thickness|design pressure)/i.test(question) &&
    /(give|provide|calculate|confirm|approve|certif|guarantee|required)/i.test(question)
  )
    return "I cannot provide authoritative engineering design approval or regulatory compliance certification. A qualified engineer must review the specific design and applicable requirements.";
  if (
    /\b(fabricate|fabricated|invent|invented|pretend|guarantee|guaranteed|testimonials?|roi|savings|accuracy|deployed)\b|success metric|customer result|production.ready|deployment milestone/i.test(
      question,
    )
  )
    return `${UNKNOWN} I cannot infer business results, deployment readiness or guaranteed outcomes from a project brief. Consult the evidence and limitations in the linked project stories.`;
  if (/\b(recipe|poem|joke|song|weather|politics)\b/i.test(question))
    return "I can help with public industrial project briefs, not general-purpose requests. Choose an industry or describe an operational workflow.";
  return null;
}
export function retrieve(input: AdvisorInput): AdvisorFact[] {
  const query = input.question.toLowerCase().normalize("NFKC");
  const sector = consultingIndustries.find((s) => s.id === input.industry);
  const generic =
    /what (public )?projects|show.*work|how.*help|explore|what can|similar solution/.test(query);
  const candidates = caseStudies
    .map((project) => {
      const terms = advisorProjectTerms[project.slug] ?? [];
      let score = terms.reduce(
        (total, term) =>
          total +
          (query.includes(term) &&
          !["not ", "no ", "exclude "].some((prefix) => query.includes(prefix + term))
            ? term.includes(" ")
              ? 4
              : 2
            : 0),
        0,
      );
      if (
        input.contextProject === project.slug &&
        (!sector || sector.projectSlugs.some((slug) => slug === project.slug)) &&
        /spreadsheet|excel|email|manual|erp|sheets/.test(query)
      )
        score += 4;
      if (query.includes(project.title.toLowerCase()) || query.includes(project.slug)) score += 20;
      if (sector?.projectSlugs.some((slug) => slug === project.slug) && (score > 0 || generic))
        score += 1;
      return { project, score };
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => {
      const order = (slug: string) => {
        const rank = sector?.projectSlugs.findIndex((item) => item === slug) ?? -1;
        return rank < 0 ? 999 : rank;
      };
      return b.score - a.score || order(a.project.slug) - order(b.project.slug);
    })
    .slice(0, 2);
  return candidates
    .flatMap(({ project: p }) => {
      const facts: AdvisorFact[] = [];
      const add = (key: string, state: AdvisorFact["state"], text: string) =>
        facts.push({
          id: `${p.slug}:${key}`,
          projectSlug: p.slug,
          state,
          text: text.slice(0, 700),
        });
      add("status", "reported", `${p.title}: ${p.maturityStatus.summary}`);
      if (p.caseStudySections.length)
        add(
          "scope",
          "unverified",
          p.caseStudySections.flatMap((section) => section.paragraphs).join(" "),
        );
      if (p.verifiedCapabilities.length)
        add(
          "verified",
          "verified",
          p.verifiedCapabilities.map((cap) => `${cap.name}. Evidence: ${cap.evidence}`).join(" "),
        );
      else
        add(
          "evidence",
          "unverified",
          "No product capabilities have been independently verified from supplied artifacts in the public evidence register.",
        );
      if (p.reportedImplementedCapabilities.length)
        add(
          "reported",
          "reported",
          `Reported implemented, evidence pending: ${p.reportedImplementedCapabilities.join("; ")}.`,
        );
      if (p.inDevelopmentCapabilities.length)
        add(
          "development",
          "development",
          `In development, as authored: ${p.inDevelopmentCapabilities.join("; ")}.`,
        );
      if (p.plannedCapabilities.length)
        add("planned", "planned", `Planned, not shipped: ${p.plannedCapabilities.join("; ")}.`);
      if (p.unverifiedCapabilities.length)
        add(
          "unconfirmed",
          "unverified",
          `Scope to confirm: ${p.unverifiedCapabilities.join("; ")}.`,
        );
      if (p.verifiedOutcomes.length)
        add(
          "outcomes",
          "verified",
          p.verifiedOutcomes
            .map((outcome) => `${outcome.name}. Evidence: ${outcome.evidence}`)
            .join(" "),
        );
      add("limitation", "limitation", p.limitations.join(" "));
      return facts;
    })
    .slice(0, 24);
}
export function compose(
  facts: AdvisorFact[],
  mode: AdvisorReply["mode"],
  selection?: string[],
  questionKey: keyof typeof qualificationQuestions = "workflow",
  missingEvidence = false,
): AdvisorReply {
  const slugs = [...new Set(facts.map((f) => f.projectSlug))];
  // Status and evidence boundaries are mandatory even if a model omits them.
  const chosen = selection
    ? [...facts].sort((a, b) => Number(selection.includes(b.id)) - Number(selection.includes(a.id)))
    : facts;
  return {
    mode,
    message: facts.length
      ? `${missingEvidence ? UNKNOWN + " " : ""}These public briefs distinguish authored implementation states from verified evidence. Relevance suggests a discussion starting point, not a promised solution or deployment.`
      : `${UNKNOWN} I can help with public industrial software project briefs. Choose an industry or describe a production, engineering, tender or BOQ workflow.`,
    facts: chosen,
    projects: slugs.map((slug) => {
      const p = caseStudies.find((item) => item.slug === slug)!;
      return {
        slug,
        title: p.title,
        href: `/work/${slug}`,
        maturity: p.maturityStatus.labels.join(" / "),
      };
    }),
    question: facts.length ? qualificationQuestions[questionKey] : null,
  };
}
export function lookup(input: AdvisorInput): AdvisorReply {
  const refusal = boundary(input.question);
  return refusal
    ? { mode: "boundary", message: refusal, facts: [], projects: [], question: null }
    : compose(
        retrieve(input),
        "lookup",
        undefined,
        /spreadsheet|excel|email|manual/.test(input.question.toLowerCase()) ? "scope" : "workflow",
        /verified|implemented|delivered|shipped|working|integration|integrate|available|support|can you|can it|does it/i.test(
          input.question,
        ),
      );
}
