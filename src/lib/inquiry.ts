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
    website: z.string().max(0, "Unable to accept this inquiry.").default(""),
  })
  .strict();
export type Inquiry = z.infer<typeof inquirySchema>;
export type InquiryResult =
  { ok: true; reference: string } | { ok: false; message: string; fields?: Record<string, string> };
export function inquiryText(input: Omit<Inquiry, "requestId" | "website">) {
  return [
    `Name: ${input.name}`,
    `Company: ${input.company}`,
    `Email: ${input.email}`,
    `Industry: ${input.industry}`,
    `Preferred contact: ${input.method}`,
    `Current workflow: ${input.workflow || "Not specified"}`,
    `Budget (optional): ${input.budget || "Not specified"}`,
    "",
    "Business problem / project",
    input.challenge,
  ].join("\n");
}
