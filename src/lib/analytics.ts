import { z } from "zod";
export const conversionEvents = [
  "industry_selected",
  "project_card_viewed",
  "case_study_opened",
  "video_started",
  "video_completed",
  "chat_started",
  "chat_lead_handoff",
  "inquiry_submitted",
  "booking_clicked",
] as const;
export const conversionSchema = z
  .object({
    event: z.enum(conversionEvents),
    project: z
      .string()
      .regex(/^[a-z0-9-]{1,100}$/)
      .optional(),
    industry: z.enum(["manufacturing", "epc", "construction", "real-estate"]).optional(),
  })
  .strict();
export const attributionSchema = z
  .object({
    source: z.enum(["search", "social", "referral", "campaign", "direct"]),
    campaign: z
      .enum(["consulting", "manufacturing", "engineering", "construction", "real-estate"])
      .optional(),
  })
  .strict();
export type Attribution = z.infer<typeof attributionSchema>;
const CONSENT = "portfolio-analytics-choice";
export function analyticsAllowed() {
  try {
    return (
      typeof window !== "undefined" &&
      navigator.doNotTrack !== "1" &&
      !(navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl &&
      localStorage.getItem(CONSENT) === "allowed"
    );
  } catch {
    return false;
  }
}
export function setAnalyticsChoice(allowed: boolean) {
  try {
    localStorage.setItem(CONSENT, allowed ? "allowed" : "declined");
  } catch {
    /* No persistence means no analytics. */
  }
  window.dispatchEvent(new Event("analytics-choice"));
}
export function trackConversion(
  event: (typeof conversionEvents)[number],
  metadata: {
    project?: string;
    industry?: "manufacturing" | "epc" | "construction" | "real-estate";
  } = {},
) {
  if (!analyticsAllowed()) return;
  const parsed = conversionSchema.safeParse({ event, ...metadata });
  if (!parsed.success) return;
  void fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
    keepalive: true,
    referrerPolicy: "no-referrer",
  }).catch(() => {});
}
export function referralAttribution(): Attribution | undefined {
  if (!analyticsAllowed()) return undefined;
  const url = new URL(location.href);
  const campaign = attributionSchema.shape.campaign.safeParse(
    url.searchParams.get("utm_campaign") ?? undefined,
  );
  if (campaign.success && campaign.data) return { source: "campaign", campaign: campaign.data };
  try {
    const ref = new URL(document.referrer);
    if (ref.origin === url.origin) return { source: "direct" };
    if (/(^|\.)(google\.[a-z.]+|bing\.com|duckduckgo\.com)$/.test(ref.hostname))
      return { source: "search" };
    if (/(^|\.)(linkedin\.com|facebook\.com|instagram\.com|x\.com|t\.co)$/.test(ref.hostname))
      return { source: "social" };
    return { source: "referral" };
  } catch {
    return { source: "direct" };
  }
}
