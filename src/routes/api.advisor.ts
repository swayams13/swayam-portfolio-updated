import { createFileRoute } from "@tanstack/react-router";
import { advisorHandler } from "@/server/advisor/config.server";
export const Route = createFileRoute("/api/advisor")({
  server: {
    handlers: {
      GET: ({ request }) => advisorHandler(request),
      POST: ({ request }) => advisorHandler(request),
    },
  },
});
