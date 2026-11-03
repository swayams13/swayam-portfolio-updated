// @vitest-environment node
import { describe, it, expect } from "vitest";
import { boundedJson } from "@/server/advisor/protection.server";
describe("Request parsing time budget", () => {
  it("rejects a stalled body even if its received prefix is valid JSON", async () => {
    let cancelled = false;
    const body = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode('{"ok":true}'));
      },
      cancel() {
        cancelled = true;
      },
    });
    const request = new Request("https://site.example/api/advisor", {
      method: "POST",
      body,
      duplex: "half",
    } as RequestInit);
    await expect(boundedJson(request, 100, 10)).rejects.toThrow("body timeout");
    expect(cancelled).toBe(true);
  });
  it("rejects oversized streamed chunks without trusting content-length", async () => {
    let cancelled = false;
    const body = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode("x".repeat(101)));
      },
      cancel() {
        cancelled = true;
      },
    });
    await expect(
      boundedJson(
        new Request("https://site.example/api/inquiry", {
          method: "POST",
          body,
          duplex: "half",
        } as RequestInit),
        100,
      ),
    ).rejects.toThrow("body");
    expect(cancelled).toBe(true);
  });
});
