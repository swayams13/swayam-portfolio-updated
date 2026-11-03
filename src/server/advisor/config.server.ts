import { createAdvisorHandler } from "./handler.server";
import { redisBudget } from "./protection.server";
let budget;
try {
  if (process.env["UPSTASH_REDIS_REST_URL"] && process.env["UPSTASH_REDIS_REST_TOKEN"])
    budget = redisBudget(
      process.env["UPSTASH_REDIS_REST_URL"]!,
      process.env["UPSTASH_REDIS_REST_TOKEN"]!,
      Number(process.env["ADVISOR_DAILY_BUDGET_CENTS"] ?? 100),
    );
} catch {
  /* Invalid config disables paid matching. */
}
export const advisorHandler = createAdvisorHandler({
  enabled: process.env["ADVISOR_LLM_ENABLED"] === "true",
  apiKey: process.env["OPENAI_API_KEY"],
  rateSecret: process.env["ADVISOR_RATE_SECRET"],
  budget,
});
