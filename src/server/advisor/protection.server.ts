export async function boundedJson(
  request: Request,
  maxBytes = 6500,
  maxReadMs = 5000,
): Promise<unknown> {
  if (Number(request.headers.get("content-length")) > maxBytes) throw new Error("body");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("body");
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    void reader.cancel().catch(() => {});
  }, maxReadMs);
  let size = 0;
  const chunks: Uint8Array[] = [];
  try {
    while (true) {
      const part = await reader.read();
      if (part.done) break;
      size += part.value.byteLength;
      if (size > maxBytes) {
        await reader.cancel();
        throw new Error("body");
      }
      chunks.push(part.value);
    }
  } finally {
    clearTimeout(timer);
    reader.releaseLock();
  }
  if (timedOut) throw new Error("body timeout");
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder().decode(bytes)) as unknown;
}
export function validPost(request: Request) {
  return (
    request.headers.get("origin") === new URL(request.url).origin &&
    request.headers.get("content-type")?.split(";")[0]?.trim() === "application/json"
  );
}
export function reply(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      ...(status === 429 ? { "Retry-After": "60" } : {}),
    },
  });
}
export function localLimiter(now = Date.now) {
  const entries = new Map<string, { count: number; expires: number }>();
  return (key: string, max: number, window = 60000) => {
    for (const [id, entry] of entries) if (entry.expires <= now()) entries.delete(id);
    if (entries.size > 2000) return false;
    const current = entries.get(key) ?? { count: 0, expires: now() + window };
    current.count++;
    entries.set(key, current);
    return current.count <= max;
  };
}
export async function clientKey(request: Request, secret: string) {
  const address =
    request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim().slice(0, 128) ?? "unknown";
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${Math.floor(Date.now() / 900000)}:${address}`),
  );
  return [...new Uint8Array(signature)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
export type Budget = { reserve: (client: string) => Promise<boolean> };
/** Atomic daily monetary reservation plus global/client minute ceilings. No transcript/PII stored. */
export function redisBudget(url: string, token: string, dailyCents = 100, fetcher = fetch): Budget {
  const parsed = new URL(url);
  if (
    parsed.protocol !== "https:" ||
    parsed.username ||
    parsed.password ||
    !parsed.hostname.endsWith(".upstash.io") ||
    parsed.pathname !== "/" ||
    parsed.search
  )
    throw new Error("Invalid budget host");
  const daily = Math.max(
    2,
    Math.min(1000, Number.isFinite(dailyCents) ? Math.floor(dailyCents) : 100),
  );
  const script = `local day=tonumber(redis.call('GET',KEYS[1]) or '0'); local global=tonumber(redis.call('GET',KEYS[2]) or '0'); local client=tonumber(redis.call('GET',KEYS[3]) or '0'); if day+2>tonumber(ARGV[1]) or global>=10 or client>=4 then return 0 end; redis.call('INCRBY',KEYS[1],2); redis.call('EXPIRE',KEYS[1],172800); redis.call('INCR',KEYS[2]); redis.call('EXPIRE',KEYS[2],120); redis.call('INCR',KEYS[3]); redis.call('EXPIRE',KEYS[3],120); return 1`;
  return {
    reserve: async (client) => {
      const stamp = Date.now();
      const day = Math.floor(stamp / 86400000);
      const minute = Math.floor(stamp / 60000);
      const response = await fetcher(parsed.href, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify([
          "EVAL",
          script,
          3,
          `advisor:{budget}:cost:${day}`,
          `advisor:{budget}:global:${minute}`,
          `advisor:{budget}:client:${minute}:${client}`,
          daily,
        ]),
        signal: AbortSignal.timeout(3000),
      });
      if (!response.ok) throw new Error("budget");
      const data = (await response.json()) as { result?: unknown };
      return data.result === 1;
    },
  };
}
export type OperationalEvent =
  | "question_started"
  | "project_opened"
  | "handoff_started"
  | "lookup"
  | "provider_ok"
  | "provider_error"
  | "budget_error"
  | "budget_blocked"
  | "rate_limited";
export function metric(event: OperationalEvent, project?: string, durationMs?: number) {
  console.info(
    JSON.stringify({
      service: "solutions-advisor",
      event,
      ...(project ? { project } : {}),
      ...(durationMs === undefined
        ? {}
        : {
            durationBucket:
              durationMs < 500 ? "under_500ms" : durationMs < 3000 ? "under_3s" : "over_3s",
          }),
    }),
  );
}
