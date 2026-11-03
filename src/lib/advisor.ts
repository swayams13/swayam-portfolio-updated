import { z } from "zod";
export const advisorIndustries = ["manufacturing", "epc", "construction", "real-estate"] as const;
export const advisorRequest = z
  .object({
    question: z.string().trim().min(3).max(1200),
    industry: z.enum(advisorIndustries).nullable().default(null),
    allowAI: z.boolean().default(false),
    contextProject: z.string().max(100).nullable().default(null),
  })
  .strict();
export type AdvisorInput = z.infer<typeof advisorRequest>;
export type AdvisorFact = {
  id: string;
  projectSlug: string;
  text: string;
  state: "verified" | "reported" | "development" | "planned" | "unverified" | "limitation";
};
export const qualificationQuestions = {
  workflow: "Which step in your current workflow creates the most repeated manual work?",
  information: "Where does your team currently record and share this information?",
  scope: "Which one workflow would you want to improve first?",
};
export type AdvisorReply = {
  mode: "lookup" | "ai" | "fallback" | "boundary";
  message: string;
  facts: AdvisorFact[];
  projects: { slug: string; title: string; href: string; maturity: string }[];
  question: string | null;
};
export const advisorMetric = z
  .object({
    event: z.enum(["question_started", "project_opened", "handoff_started"]),
    project: z.string().max(100).optional(),
  })
  .strict();
export const advisorHandoff = z
  .object({
    consent: z.literal(true),
    challenge: z.string().trim().min(3).max(2000),
    industry: z.enum([
      "Manufacturing",
      "EPC & Engineering",
      "Construction",
      "Real Estate",
      "Other",
    ]),
  })
  .strict();
export const HANDOFF_EVENT = "advisor-approved-inquiry";

export const advisorReplySchema = z
  .object({
    mode: z.enum(["lookup", "ai", "fallback", "boundary"]),
    message: z.string().max(1800),
    facts: z
      .array(
        z
          .object({
            id: z.string().max(180),
            projectSlug: z.string().max(100),
            text: z.string().max(1000),
            state: z.enum([
              "verified",
              "reported",
              "development",
              "planned",
              "unverified",
              "limitation",
            ]),
          })
          .strict(),
      )
      .max(24),
    projects: z
      .array(
        z
          .object({
            slug: z.string().regex(/^[a-z0-9-]+$/),
            title: z.string().max(180),
            href: z.string().regex(/^\/work\/[a-z0-9-]+$/),
            maturity: z.string().max(180),
          })
          .strict(),
      )
      .max(2),
    question: z.string().max(240).nullable(),
  })
  .strict();
