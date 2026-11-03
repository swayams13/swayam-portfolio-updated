export type InquiryGate = { reserve: (client: string, email: string) => Promise<boolean> };
export function createInquiryGate(url: string, token: string, fetcher = fetch): InquiryGate {
  const host = new URL(url);
  if (
    host.protocol !== "https:" ||
    !host.hostname.endsWith(".upstash.io") ||
    host.username ||
    host.password ||
    host.pathname !== "/" ||
    host.search
  )
    throw new Error("Invalid limit host");
  const script = `local g=tonumber(redis.call('GET',KEYS[1]) or '0'); local c=tonumber(redis.call('GET',KEYS[2]) or '0'); local e=tonumber(redis.call('GET',KEYS[3]) or '0'); if g>=30 or c>=5 or e>=3 then return 0 end; for i=1,3 do redis.call('INCR',KEYS[i]); redis.call('EXPIRE',KEYS[i], i==1 and 120 or 1800); end; return 1`;
  return {
    reserve: async (client, email) => {
      const now = Date.now();
      const response = await fetcher(host.href, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify([
          "EVAL",
          script,
          3,
          `inquiry:{limits}:global:${Math.floor(now / 60000)}`,
          `inquiry:{limits}:client:${Math.floor(now / 900000)}:${client}`,
          `inquiry:{limits}:email:${Math.floor(now / 900000)}:${email}`,
        ]),
        signal: AbortSignal.timeout(3000),
      });
      if (!response.ok) throw new Error("Limits unavailable");
      const data = (await response.json()) as { result?: unknown };
      return data.result === 1;
    },
  };
}
