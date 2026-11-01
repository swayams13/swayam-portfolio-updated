import { inquirySchema, inquiryText, type InquiryResult } from "@/lib/inquiry";

export type DeliveryConfig = {
  apiKey?: string | undefined;
  from?: string | undefined;
  to?: string | undefined;
  bookingUrl?: string | undefined;
};
type Dependencies = { config: DeliveryConfig; fetcher?: typeof fetch; now?: () => number };
const MAX_BODY = 12000;
const WINDOW = 15 * 60 * 1000;
const TIMEOUT = 10000;
const emailPattern = /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/;
export function deliveryReady(config: DeliveryConfig) {
  const from = config.from?.trim();
  const address = from?.match(/<([^<>]+)>$/)?.[1] ?? from;
  return Boolean(
    config.apiKey &&
    from &&
    from.length <= 300 &&
    !/[\r\n]/.test(from) &&
    address &&
    emailPattern.test(address) &&
    config.to &&
    emailPattern.test(config.to),
  );
}
export function publicConfig(config: DeliveryConfig) {
  let bookingUrl: string | null = null;
  try {
    const url = new URL(config.bookingUrl ?? "");
    if (url.protocol === "https:" && !url.username && !url.password) bookingUrl = url.href;
  } catch {
    /* Optional booking link not configured. */
  }
  return { deliveryAvailable: deliveryReady(config), bookingUrl };
}
function json(body: unknown, status = 200, extra: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", ...extra } });
}
async function readBounded(request: Request) {
  if (Number(request.headers.get("content-length")) > MAX_BODY) throw new Error("size");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("body");
  let size = 0;
  const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      size += part.value.byteLength;
      if (size > MAX_BODY) {
        await reader.cancel();
        throw new Error("size");
      }
      chunks.push(part.value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder().decode(bytes)) as unknown;
}
async function digest(value: string) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Small per-instance protections; host-level distributed limits are still required. */
export function createInquiryHandler({ config, fetcher = fetch, now = Date.now }: Dependencies) {
  const limits = new Map<string, { count: number; expires: number }>();
  const accepted = new Map<string, { reference: string; expires: number }>();
  const inFlight = new Map<string, Promise<{ body: InquiryResult; status: number }>>();
  function allowance(key: string, max: number, ttl: number) {
    const stamp = now();
    let entry = limits.get(key);
    if (!entry || entry.expires <= stamp) {
      entry = { count: 0, expires: stamp + ttl };
      limits.set(key, entry);
    }
    if (entry.count >= max) return false;
    entry.count++;
    return true;
  }
  return async (request: Request): Promise<Response> => {
    if (request.method === "GET") return json(publicConfig(config));
    if (request.method !== "POST")
      return json({ ok: false, message: "Method not allowed." }, 405, { Allow: "GET, POST" });
    if (request.headers.get("origin") !== new URL(request.url).origin)
      return json(
        {
          ok: false,
          message: "This request could not be accepted. Reload the page and try again.",
        },
        403,
      );
    if (request.headers.get("content-type")?.split(";")[0]?.trim() !== "application/json")
      return json({ ok: false, message: "Use the project inquiry form." }, 415);
    for (const [key, value] of limits) if (value.expires <= now()) limits.delete(key);
    for (const [key, value] of accepted) if (value.expires <= now()) accepted.delete(key);
    // Global instance budget bounds parsing/hash/provider work even when emails change.
    if (!allowance("global", 100, 60000))
      return json(
        { ok: false, message: "Too many requests. Please wait a minute and try again." },
        429,
        { "Retry-After": "60" },
      );
    let raw: unknown;
    try {
      raw = await readBounded(request);
    } catch {
      return json(
        {
          ok: false,
          message: "The inquiry is invalid or too large. Review the fields and try again.",
        },
        400,
      );
    }
    const parsed = inquirySchema.safeParse(raw);
    if (!parsed.success) {
      const fields: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !fields[key]) fields[key] = issue.message;
      }
      return json({ ok: false, message: "Please review the inquiry fields.", fields }, 400);
    }
    if (!deliveryReady(config))
      return json(
        {
          ok: false,
          message:
            "Online delivery is not configured yet. Please use the email option; your inquiry has not been sent.",
        },
        503,
      );
    const input = parsed.data;
    const payload = {
      from: config.from!,
      to: [config.to!],
      reply_to: input.email,
      subject: `Portfolio inquiry — ${input.industry}`,
      text: inquiryText(input),
    };
    const hash = await digest(JSON.stringify(payload));
    const key = `inquiry/${input.requestId}/${hash}`;
    const emailKey = await digest(input.email.toLowerCase());
    const prior = accepted.get(key);
    if (prior) return json({ ok: true, reference: prior.reference });
    const pending = inFlight.get(key);
    if (pending) {
      const result = await pending;
      return json(result.body, result.status);
    }
    if (
      inFlight.size >= 30 ||
      limits.size > 2000 ||
      accepted.size > 2000 ||
      !allowance(emailKey, 3, WINDOW)
    )
      return json(
        {
          ok: false,
          message: "Too many inquiries. Please wait 15 minutes or contact me by email.",
        },
        429,
        { "Retry-After": "900" },
      );
    const operation = (async (): Promise<{ body: InquiryResult; status: number }> => {
      try {
        const response = await fetcher("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${config.apiKey!}`,
            "Content-Type": "application/json",
            "Idempotency-Key": key,
          },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(TIMEOUT),
        });
        if (!response.ok)
          return {
            body: {
              ok: false,
              message:
                "Email delivery could not be confirmed. Your details are preserved; try again or use email.",
            },
            status: 502,
          };
        const data = (await response.json()) as { id?: unknown };
        if (typeof data.id !== "string" || !data.id)
          return {
            body: {
              ok: false,
              message: "Delivery could not be confirmed. Retry with the same details or use email.",
            },
            status: 502,
          };
        accepted.set(key, { reference: input.requestId, expires: now() + WINDOW });
        return { body: { ok: true, reference: input.requestId }, status: 200 };
      } catch {
        return {
          body: {
            ok: false,
            message:
              "Delivery could not be confirmed. Your details are preserved; retry or use email.",
          },
          status: 502,
        };
      }
    })();
    inFlight.set(key, operation);
    try {
      const result = await operation;
      return json(result.body, result.status);
    } finally {
      inFlight.delete(key);
    }
  };
}
