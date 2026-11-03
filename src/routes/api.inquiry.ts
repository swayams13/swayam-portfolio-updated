import { createInquiryGate } from "@/server/inquiry-abuse.server";
import { createFileRoute } from "@tanstack/react-router";
import { createInquiryHandler } from "@/server/inquiry.server";

let gate;
try {
  if (process.env["UPSTASH_REDIS_REST_URL"] && process.env["UPSTASH_REDIS_REST_TOKEN"])
    gate = createInquiryGate(
      process.env["UPSTASH_REDIS_REST_URL"]!,
      process.env["UPSTASH_REDIS_REST_TOKEN"]!,
    );
} catch {
  /* Online delivery stays disabled. */
}
const testMode =
  process.env["NODE_ENV"] !== "production" && process.env["CONTACT_TEST_MODE"] === "true";
const handler = createInquiryHandler({
  config: {
    testMode,
    requireShared: process.env["NODE_ENV"] === "production",
    gate,
    rateSecret: process.env["INQUIRY_RATE_SECRET"],
    apiKey: process.env["RESEND_API_KEY"],
    from: process.env["CONTACT_FROM"] || (testMode ? "Test <test@example.com>" : undefined),
    to: process.env["CONTACT_TO"] || (testMode ? "test@example.com" : undefined),
    bookingUrl: process.env["BOOKING_URL"],
  },
});
export const Route = createFileRoute("/api/inquiry")({
  server: {
    handlers: { GET: ({ request }) => handler(request), POST: ({ request }) => handler(request) },
  },
});
