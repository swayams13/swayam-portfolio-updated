import { attributionSchema } from "./analytics";
import { z } from "zod";

export const inquiryIndustries = [
  "Manufacturing",
  "Construction",
  "Real Estate",
  "EPC & Engineering",
  "Other",
] as const;
export const contactMethods = ["Email", "Arrange a discovery call by email"] as const;
export const inquirySchema = z
  .object({
    requestId: z.string().uuid(),
    name: z.string().trim().min(1, "Enter your name.").max(200),
    company: z.string().trim().min(1, "Enter your company.").max(200),
    email: z.string().trim().email("Enter a valid email address.").max(200),
    industry: z.enum(inquiryIndustries),
    challenge: z.string().trim().min(1, "Describe the problem you want to solve.").max(2000),
    workflow: z.string().trim().max(1000).default(""),
    budget: z.string().trim().max(150).default(""),
    method: z.enum(contactMethods),
    phone: z
      .string()
      .trim()
      .max(40)
      .refine(
        (value) => value === "" || /^[+0-9 () .-]{6,40}$/.test(value),
        "Enter a valid phone number or leave it blank.",
      )
      .default(""),
    privacyConsent: z.literal(true, {
      error: "Please consent to inquiry processing.",
    }),
    attribution: attributionSchema.optional(),
    issuedAt: z.number().int().positive().default(Date.now),
    website: z.string().max(0, "Unable to accept this inquiry.").default(""),
  })
  .strict();
export type Inquiry = z.infer<typeof inquirySchema>;
export type InquiryResult =
  | { ok: true; reference: string; testMode?: boolean }
  | { ok: false; message: string; fields?: Record<string, string> };
export function inquiryText(input: Omit<Inquiry, "requestId" | "website" | "issuedAt">) {
  return [
    `Name: ${input.name}`,
    `Company: ${input.company}`,
    `Email: ${input.email}`,
    `Industry: ${input.industry}`,
    `Phone (optional): ${input.phone || "Not specified"}`,
    "Privacy consent: explicitly provided",
    `Source (optional): ${input.attribution ? input.attribution.source + (input.attribution.campaign ? " / " + input.attribution.campaign : "") : "Not collected"}`,
    `Preferred contact: ${input.method}`,
    `Current workflow: ${input.workflow || "Not specified"}`,
    `Budget (optional): ${input.budget || "Not specified"}`,
    "",
    "Business problem / project",
    input.challenge,
  ].join("\n");
}
