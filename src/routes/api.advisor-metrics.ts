import { createFileRoute } from "@tanstack/react-router";
import { advisorHandler } from "@/server/advisor/config.server";
export const Route = createFileRoute("/api/advisor-metrics")({
  server: { handlers: { POST: ({ request }) => advisorHandler(request, true) } },
});
