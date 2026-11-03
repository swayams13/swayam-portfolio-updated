import { createFileRoute } from "@tanstack/react-router";
import { analyticsHandler } from "@/server/analytics.server";
export const Route = createFileRoute("/api/analytics")({
  server: { handlers: { POST: ({ request }) => analyticsHandler(request) } },
});
