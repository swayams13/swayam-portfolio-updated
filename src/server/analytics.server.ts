import { conversionSchema } from "@/lib/analytics";
import { caseStudies } from "@/lib/content";
import {
  boundedJson,
  clientKey,
  localLimiter,
  reply,
  validPost,
} from "@/server/advisor/protection.server";
const allow = localLimiter();
const secret = crypto.randomUUID();
export async function analyticsHandler(request: Request) {
  if (request.method !== "POST") return reply({ message: "Method not allowed." }, 405);
  if (!validPost(request)) return reply({ message: "Use this website." }, 403);
  const client = await clientKey(request, secret);
  if (!allow("global", 200) || !allow(client, 60)) return reply({ message: "Please wait." }, 429);
  try {
    const value = conversionSchema.safeParse(await boundedJson(request, 400));
    if (
      !value.success ||
      (value.data.project && !caseStudies.some((p) => p.slug === value.data.project))
    )
      return reply({ message: "Invalid event." }, 400);
    console.info(JSON.stringify({ service: "portfolio-conversion", ...value.data }));
    return reply({ ok: true });
  } catch {
    return reply({ message: "Invalid event." }, 400);
  }
}
