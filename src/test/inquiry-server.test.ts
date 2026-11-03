// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { createInquiryHandler, publicConfig } from "@/server/inquiry.server";
const config = {
  apiKey: "test-secret",
  from: "Portfolio <inquiries@example.com>",
  to: "owner@example.com",
};
const input = (issuedAt = Date.now()) => ({
  issuedAt,
  privacyConsent: true,
  requestId: crypto.randomUUID(),
  name: "Sample Reviewer",
  company: "Example Works",
  email: "review@example.com",
  industry: "Manufacturing",
  challenge: "Track a sample production workflow.",
  workflow: "Spreadsheets",
  budget: "",
  method: "Email",
  website: "",
});
const request = (data: unknown, origin = "https://portfolio.example") =>
  new Request("https://portfolio.example/api/inquiry", {
    method: "POST",
    headers: { Origin: origin, "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
const provider = () =>
  vi.fn<typeof fetch>().mockResolvedValue(Response.json({ id: "test-provider-id" }));
describe("Inquiry server boundary", () => {
  it("exposes only readiness and a valid public booking URL", async () => {
    const handler = createInquiryHandler({
      config: { ...config, bookingUrl: "javascript:alert(1)" },
      fetcher: provider(),
    });
    const result = await handler(new Request("https://portfolio.example/api/inquiry"));
    expect(await result.json()).toEqual({ deliveryAvailable: true, bookingUrl: null });
    expect(
      publicConfig({ ...config, bookingUrl: "https://calendar.example/20-min" }).bookingUrl,
    ).toBe("https://calendar.example/20-min");
  });
  it("fails honestly when delivery is not configured", async () => {
    const fetcher = provider();
    const handler = createInquiryHandler({ config: {}, fetcher });
    expect((await handler(request(input()))).status).toBe(503);
    expect(fetcher).not.toHaveBeenCalled();
  });
  it("rejects cross-origin requests before provider work", async () => {
    const fetcher = provider();
    const handler = createInquiryHandler({ config, fetcher });
    expect((await handler(request(input(), "https://another.example"))).status).toBe(403);
    expect(fetcher).not.toHaveBeenCalled();
  });
  it.each([
    { email: "bad-address" },
    { company: "" },
    { challenge: "" },
    { budget: "x".repeat(151) },
    { industry: "Unknown" },
    { website: "https://spam.example" },
    { method: "Phone" },
  ])("rejects invalid fields %j", async (change) => {
    const fetcher = provider();
    const handler = createInquiryHandler({ config, fetcher });
    expect((await handler(request({ ...input(), ...change }))).status).toBe(400);
    expect(fetcher).not.toHaveBeenCalled();
  });
  it("rejects oversized and malformed bodies", async () => {
    const handler = createInquiryHandler({ config, fetcher: provider() });
    expect((await handler(request({ anything: "x".repeat(13000) }))).status).toBe(400);
    expect(
      (
        await handler(
          new Request("https://portfolio.example/api/inquiry", {
            method: "POST",
            headers: { Origin: "https://portfolio.example", "Content-Type": "application/json" },
            body: "{",
          }),
        )
      ).status,
    ).toBe(400);
  });
  it("accepts blank budget and uses fixed recipient, safe subject and reply-to", async () => {
    const fetcher = provider();
    const handler = createInquiryHandler({ config, fetcher });
    const data = input();
    const response = await handler(request(data));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, reference: data.requestId });
    const call = fetcher.mock.calls[0]!;
    expect(call[0]).toBe("https://api.resend.com/emails");
    const body = JSON.parse(String(call[1]!.body));
    expect(body.to).toEqual([config.to]);
    expect(body.reply_to).toBe(data.email);
    expect(body.text).toContain("Budget (optional): Not specified");
  });
  it("deduplicates accepted retries and changes key for edited content", async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockImplementation(async () => Response.json({ id: "id" }));
    const handler = createInquiryHandler({ config, fetcher });
    const data = input();
    await handler(request(data));
    await handler(request(data));
    expect(fetcher).toHaveBeenCalledTimes(1);
    await handler(request({ ...data, challenge: "An edited workflow." }));
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(
      (fetcher.mock.calls[0]![1]!.headers as Record<string, string>)["Idempotency-Key"],
    ).not.toBe((fetcher.mock.calls[1]![1]!.headers as Record<string, string>)["Idempotency-Key"]);
  });
  it("coalesces concurrent duplicates", async () => {
    const fetcher = vi.fn<typeof fetch>().mockImplementation(async () => {
      await new Promise((r) => setTimeout(r, 10));
      return Response.json({ id: "id" });
    });
    const handler = createInquiryHandler({ config, fetcher });
    const data = input();
    const results = await Promise.all([handler(request(data)), handler(request(data))]);
    expect(results.map((r) => r.status)).toEqual([200, 200]);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it.each(["http-error", "invalid-ack", "network-error"])(
    "never reports success for %s",
    async (mode) => {
      const fetcher = vi.fn<typeof fetch>().mockImplementation(async () => {
        if (mode === "network-error") throw new Error("private provider detail");
        return Response.json(mode === "invalid-ack" ? {} : { message: "private provider detail" }, {
          status: mode === "http-error" ? 500 : 200,
        });
      });
      const handler = createInquiryHandler({ config, fetcher });
      const response = await handler(request(input()));
      expect(response.status).toBe(502);
      const body = await response.text();
      expect(body).not.toContain("private provider detail");
      expect(JSON.parse(body).ok).toBe(false);
    },
  );
  it("limits repeated distinct requests and releases the window", async () => {
    let stamp = 1000;
    const handler = createInquiryHandler({
      config,
      now: () => stamp,
      fetcher: vi.fn<typeof fetch>().mockImplementation(async () => Response.json({ id: "id" })),
    });
    for (let i = 0; i < 3; i++) expect((await handler(request(input(stamp)))).status).toBe(200);
    const blocked = await handler(request(input(stamp)));
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get("Retry-After")).toBe("900");
    stamp += 15 * 60 * 1000 + 1;
    expect((await handler(request(input(stamp)))).status).toBe(200);
  });
});
