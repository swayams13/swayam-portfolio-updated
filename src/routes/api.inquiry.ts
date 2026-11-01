import { createFileRoute } from "@tanstack/react-router";
import { createInquiryHandler } from "@/server/inquiry.server";

const handler = createInquiryHandler({
  config: {
    apiKey: process.env["RESEND_API_KEY"],
    from: process.env["CONTACT_FROM"],
    to: process.env["CONTACT_TO"],
    bookingUrl: process.env["BOOKING_URL"],
  },
});
export const Route = createFileRoute("/api/inquiry")({
  server: {
    handlers: { GET: ({ request }) => handler(request), POST: ({ request }) => handler(request) },
  },
});
