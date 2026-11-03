// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { createInquiryHandler, publicConfig } from "@/server/inquiry.server";
import { createInquiryGate } from "@/server/inquiry-abuse.server";
import { analyticsHandler } from "@/server/analytics.server";
const config = {
  apiKey: "fixture-key",
  from: "Site <site@example.com>",
  to: "owner@example.com",
  rateSecret: "a".repeat(32),
};
const input = () => ({
  requestId: crypto.randomUUID(),
  issuedAt: Date.now(),
  name: "Test",
  company: "Example",
  email: "visitor@example.com",
  industry: "Manufacturing",
  challenge: "Private sample challenge",
  method: "Email",
  privacyConsent: true,
});
const request = (body: unknown, path = "inquiry") =>
  new Request(`https://site.example/api/${path}`, {
    method: "POST",
    headers: { Origin: "https://site.example", "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
afterEach(() => vi.restoreAllMocks());
describe("Phase 6 delivery safeguards", () => {
  it("requires consent and validates optional phone and attribution", async () => {
    const fetcher = vi.fn<typeof fetch>();
    const handler = createInquiryHandler({ config, fetcher });
    for (const change of [
      { privacyConsent: false },
      { phone: "<script>" },
      { attribution: { source: "referral", url: "https://private.example" } },
    ])
      expect((await handler(request({ ...input(), ...change }))).status).toBe(400);
    expect(fetcher).not.toHaveBeenCalled();
  });
  it("makes local simulations explicit, including duplicate retries, with no provider call", async () => {
    const fetcher = vi.fn<typeof fetch>();
    const handler = createInquiryHandler({
      config: { ...config, apiKey: undefined, testMode: true },
      fetcher,
    });
    const data = input();
    for (let i = 0; i < 2; i++)
      expect(await (await handler(request(data))).json()).toEqual({
        ok: true,
        reference: data.requestId,
        testMode: true,
      });
    expect(fetcher).not.toHaveBeenCalled();
  });
  it("fails closed when production shared limits are missing", () => {
    expect(publicConfig({ ...config, requireShared: true }).deliveryAvailable).toBe(false);
    expect(
      publicConfig({ ...config, requireShared: true, gate: { reserve: async () => true } })
        .deliveryAvailable,
    ).toBe(true);
  });
  it.each([false, "error"])("does not send when shared protection returns %s", async (mode) => {
    const fetcher = vi.fn<typeof fetch>();
    const handler = createInquiryHandler({
      config: {
        ...config,
        gate: {
          reserve: async () => {
            if (mode === "error") throw Error("private token");
            return false;
          },
        },
      },
      fetcher,
    });
    const result = await handler(request(input()));
    expect(result.status).toBe(mode === false ? 429 : 503);
    expect(await result.text()).not.toContain("private token");
    expect(fetcher).not.toHaveBeenCalled();
  });
  it("coalesces concurrent retries while shared protection is pending", async () => {
    const reserve = vi.fn(async () => {
      await new Promise((r) => setTimeout(r, 10));
      return true;
    });
    const fetcher = vi
      .fn<typeof fetch>()
      .mockImplementation(async () => Response.json({ id: "ack" }));
    const handler = createInquiryHandler({ config: { ...config, gate: { reserve } }, fetcher });
    const data = input();
    expect(
      (await Promise.all([handler(request(data)), handler(request(data))])).map((r) => r.status),
    ).toEqual([200, 200]);
    expect(reserve).toHaveBeenCalledTimes(1);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it("retains a provider idempotency key across separate server instances", async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockImplementation(async () => Response.json({ id: "ack" }));
    const data = input();
    await createInquiryHandler({ config, fetcher })(request(data));
    await createInquiryHandler({ config, fetcher })(request(data));
    expect((fetcher.mock.calls[0]![1]!.headers as Record<string, string>)["Idempotency-Key"]).toBe(
      (fetcher.mock.calls[1]![1]!.headers as Record<string, string>)["Idempotency-Key"],
    );
  });
  it("rejects stale and future attempts", async () => {
    const fetcher = vi.fn<typeof fetch>();
    const handler = createInquiryHandler({ config, fetcher });
    for (const issuedAt of [Date.now() - 21 * 3600000, Date.now() + 120000])
      expect((await handler(request({ ...input(), issuedAt }))).status).toBe(400);
    expect(fetcher).not.toHaveBeenCalled();
  });
  it("uses atomic short-lived Redis counters with opaque keys and fixed destination", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(Response.json({ result: 1 }));
    const gate = createInquiryGate("https://example.upstash.io", "fixture-token", fetcher);
    expect(await gate.reserve("opaque-client", "opaque-email")).toBe(true);
    const body = JSON.parse(String(fetcher.mock.calls[0]![1]!.body));
    expect(body[0]).toBe("EVAL");
    expect(body[2]).toBe(3);
    expect(body.slice(3).join()).not.toContain("@");
    expect(() => createInquiryGate("http://attacker.example", "token")).toThrow();
  });
});
describe("Strict analytics boundary", () => {
  it("logs only allowlisted public event fields and rejects PII/unknown projects", async () => {
    const log = vi.spyOn(console, "info").mockImplementation(() => {});
    expect(
      (
        await analyticsHandler(
          request({ event: "case_study_opened", project: "production-intelligence" }, "analytics"),
        )
      ).status,
    ).toBe(200);
    expect(JSON.parse(log.mock.calls[0]![0])).toEqual({
      service: "portfolio-conversion",
      event: "case_study_opened",
      project: "production-intelligence",
    });
    for (const body of [
      { event: "inquiry_submitted", email: "private@example.com" },
      { event: "video_started", project: "unknown" },
      { event: "arbitrary" },
    ])
      expect((await analyticsHandler(request(body, "analytics"))).status).toBe(400);
    expect(log).toHaveBeenCalledTimes(1);
  });
  it("rejects cross-origin events", async () => {
    expect(
      (
        await analyticsHandler(
          new Request("https://site.example/api/analytics", {
            method: "POST",
            headers: { Origin: "https://external.example", "Content-Type": "application/json" },
            body: '{"event":"chat_started"}',
          }),
        )
      ).status,
    ).toBe(403);
  });
});
