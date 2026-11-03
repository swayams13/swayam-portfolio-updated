import { advisorRequest, advisorMetric } from "@/lib/advisor";
import { caseStudies } from "@/lib/content";
import { lookup, compose, retrieve } from "./knowledge.server";
import { groundedSelection } from "./provider.server";
import {
  boundedJson,
  clientKey,
  localLimiter,
  metric,
  reply,
  validPost,
  type Budget,
  type OperationalEvent,
} from "./protection.server";
export type AdvisorConfig = {
  enabled?: boolean;
  apiKey?: string | undefined;
  rateSecret?: string | undefined;
  budget?: Budget | undefined;
};
export function createAdvisorHandler(
  config: AdvisorConfig,
  options: {
    fetcher?: typeof fetch;
    now?: () => number;
    emit?: (event: OperationalEvent, project?: string, durationMs?: number) => void;
  } = {},
) {
  const allow = localLimiter(options.now);
  const ephemeralSecret = crypto.randomUUID();
  const emit = options.emit ?? metric;
  let inFlight = 0;
  const aiAvailable = Boolean(
    config.enabled &&
    config.apiKey?.trim() &&
    config.rateSecret &&
    config.rateSecret.length >= 32 &&
    config.budget,
  );
  return async (request: Request, metricsOnly = false): Promise<Response> => {
    if (request.method === "GET" && !metricsOnly) return reply({ aiAvailable });
    if (request.method !== "POST") return reply({ message: "Method not allowed." }, 405);
    if (!validPost(request)) return reply({ message: "Use the advisor on this website." }, 403);
    const client = await clientKey(
      request,
      config.rateSecret && config.rateSecret.length >= 32 ? config.rateSecret : ephemeralSecret,
    );
    if (
      !allow("global", 120) ||
      !allow(`${metricsOnly ? "metrics" : "advisor"}:${client}`, metricsOnly ? 40 : 12)
    ) {
      emit("rate_limited");
      return reply({ message: "Please wait a minute before trying again." }, 429);
    }
    let raw: unknown;
    try {
      raw = await boundedJson(request, metricsOnly ? 400 : 6500);
    } catch {
      return reply({ message: "The request is invalid or too large." }, 400);
    }
    if (metricsOnly) {
      const parsed = advisorMetric.safeParse(raw);
      if (
        !parsed.success ||
        (parsed.data.project && !caseStudies.some((p) => p.slug === parsed.data.project))
      )
        return reply({ message: "Invalid event." }, 400);
      emit(parsed.data.event, parsed.data.project);
      return reply({ ok: true });
    }
    const parsed = advisorRequest.safeParse(raw);
    if (!parsed.success)
      return reply(
        { message: "Ask a question between 3 and 1,200 characters without extra fields." },
        400,
      );
    const input = parsed.data;
    if (input.contextProject && !caseStudies.some((p) => p.slug === input.contextProject))
      return reply({ message: "Invalid project context." }, 400);
    const answer = lookup(input);
    if (!input.allowAI || !aiAvailable || answer.mode === "boundary" || !answer.projects.length) {
      emit("lookup");
      return reply(answer);
    }
    if (inFlight >= 3)
      return reply({
        ...answer,
        mode: "fallback",
        message: `${answer.message} AI matching is busy; public lookup is still available.`,
      });
    inFlight++;
    const started = Date.now();
    let stage: "budget" | "provider" = "budget";
    try {
      if (!(await config.budget!.reserve(client))) {
        emit("budget_blocked");
        return reply({
          ...answer,
          mode: "fallback",
          message: `${answer.message} AI matching has reached its current budget; public lookup remains available.`,
        });
      }
      stage = "provider";
      const facts = retrieve(input);
      const selection = await groundedSelection(
        input.question,
        facts,
        config.apiKey!,
        options.fetcher,
      );
      emit("provider_ok", undefined, Date.now() - started);
      return reply({
        ...compose(facts, "ai", selection.factIds, selection.questionKey),
        message: answer.message,
      });
    } catch {
      emit(stage === "budget" ? "budget_error" : "provider_error", undefined, Date.now() - started);
      return reply({
        ...answer,
        mode: "fallback",
        message: `${answer.message} AI matching is unavailable; these facts come from public project lookup.`,
      });
    } finally {
      inFlight--;
    }
  };
}
