import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { setAnalyticsChoice } from "@/lib/analytics";
import { Contact } from "@/components/site/Contact";
afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.unstubAllGlobals();
});
function complete() {
  fireEvent.click(screen.getByRole("checkbox", { name: /I consent to using/ }));
  for (const [label, value] of [
    ["Name", "Sample Reviewer"],
    ["Company", "Example Works"],
    ["Work email", "review@example.com"],
    ["Industry", "Manufacturing"],
    ["Business problem or proposed project", "A sample production workflow."],
  ])
    fireEvent.change(screen.getByLabelText(label!), { target: { value } });
}
describe("Configured inquiry UI", () => {
  it("preserves values after failure and reuses the retry identifier", async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(Response.json({ deliveryAvailable: true, bookingUrl: null }))
      .mockResolvedValueOnce(
        Response.json({ ok: false, message: "Delivery could not be confirmed." }, { status: 502 }),
      )
      .mockResolvedValueOnce(Response.json({ ok: true, reference: "test-reference" }));
    vi.stubGlobal("fetch", fetcher);
    render(<Contact />);
    await screen.findByRole("button", { name: /Send project inquiry/ });
    complete();
    fireEvent.submit(screen.getByRole("form", { name: "Project inquiry" }));
    await screen.findByRole("alert");
    expect(screen.getByLabelText("Business problem or proposed project")).toHaveValue(
      "A sample production workflow.",
    );
    expect(
      screen.queryByText("Your inquiry was accepted for email delivery."),
    ).not.toBeInTheDocument();
    fireEvent.submit(screen.getByRole("form", { name: "Project inquiry" }));
    await screen.findByText("Your inquiry was accepted for email delivery.");
    expect(JSON.parse(fetcher.mock.calls[1]![1].body).requestId).toBe(
      JSON.parse(fetcher.mock.calls[2]![1].body).requestId,
    );
    expect(screen.getByLabelText(/Budget range/)).not.toBeRequired();
  });
  it("blocks repeated submits while provider response is pending", async () => {
    let finish!: (response: Response) => void;
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(Response.json({ deliveryAvailable: true, bookingUrl: null }))
      .mockImplementationOnce(
        () =>
          new Promise<Response>((resolve) => {
            finish = resolve;
          }),
      );
    vi.stubGlobal("fetch", fetcher);
    render(<Contact />);
    await screen.findByRole("button", { name: /Send project inquiry/ });
    complete();
    fireEvent.submit(screen.getByRole("form", { name: "Project inquiry" }));
    fireEvent.submit(screen.getByRole("form", { name: "Project inquiry" }));
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(screen.getByRole("button", { name: /Sending inquiry/ })).toBeDisabled();
    finish(Response.json({ ok: true, reference: "test-reference" }));
    await screen.findByText("Your inquiry was accepted for email delivery.");
  });
  it("uses configured HTTPS booking and rejects unsafe booking URLs", async () => {
    const fetcher = vi.fn().mockResolvedValue(
      Response.json({
        deliveryAvailable: false,
        bookingUrl: "https://calendar.example/discovery",
      }),
    );
    vi.stubGlobal("fetch", fetcher);
    const view = render(<Contact />);
    expect(await screen.findByRole("link", { name: /Book a 20-minute/ })).toHaveAttribute(
      "href",
      "https://calendar.example/discovery",
    );
    view.unmount();
    fetcher.mockResolvedValue(
      Response.json({ deliveryAvailable: false, bookingUrl: "javascript:alert(1)" }),
    );
    render(<Contact />);
    await waitFor(() =>
      expect(screen.getByRole("link", { name: /Request a 20-minute/ })).toHaveAttribute(
        "href",
        expect.stringContaining("mailto:"),
      ),
    );
  });
  it("keeps local test success distinct and never counts it as a submitted lead", async () => {
    const fetcher = vi.fn().mockImplementation(async (url: string, options?: RequestInit) => {
      if (url === "/api/analytics") return Response.json({ ok: true });
      return Response.json(
        options?.method === "POST"
          ? { ok: true, reference: "local-reference", testMode: true }
          : { deliveryAvailable: true, bookingUrl: null, testMode: true },
      );
    });
    vi.stubGlobal("fetch", fetcher);
    setAnalyticsChoice(true);
    render(<Contact />);
    await screen.findByRole("button", { name: /Run local delivery test/ });
    complete();
    fireEvent.submit(screen.getByRole("form", { name: "Project inquiry" }));
    await screen.findByText("Local test completed. No email was sent.");
    expect(
      screen.getByText("Local test completed. No email was sent.").closest("[role=status]"),
    ).toHaveFocus();
    expect(fetcher.mock.calls.filter((call) => call[0] === "/api/analytics")).toHaveLength(0);
  });
  it("counts provider acceptance once and never includes inquiry content in analytics", async () => {
    const fetcher = vi.fn().mockImplementation(async (url: string, options?: RequestInit) => {
      if (url === "/api/analytics") return Response.json({ ok: true });
      return Response.json(
        options?.method === "POST"
          ? { ok: true, reference: "same-reference" }
          : { deliveryAvailable: true, bookingUrl: "https://calendar.example/real" },
      );
    });
    vi.stubGlobal("fetch", fetcher);
    setAnalyticsChoice(true);
    render(<Contact />);
    await screen.findByRole("button", { name: /Send project inquiry/ });
    complete();
    for (let i = 0; i < 2; i++) {
      fireEvent.submit(screen.getByRole("form", { name: "Project inquiry" }));
      await screen.findByText("Your inquiry was accepted for email delivery.");
    }
    fireEvent.click(screen.getByRole("link", { name: /Book a 20-minute/ }));
    const events = fetcher.mock.calls
      .filter((call) => call[0] === "/api/analytics")
      .map((call) => JSON.parse(String(call[1]?.body)));
    expect(events).toEqual([{ event: "inquiry_submitted" }, { event: "booking_clicked" }]);
    expect(screen.getByLabelText(/Phone number/)).not.toBeRequired();
    expect(screen.getByLabelText(/Current workflow or system/)).not.toBeRequired();
  });
  it("refocuses the error summary when the same client error is submitted again", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(Response.json({ deliveryAvailable: false, bookingUrl: null })),
    );
    render(<Contact />);
    await screen.findByRole("button", { name: /Prepare email draft/ });
    complete();
    fireEvent.change(screen.getByLabelText(/Phone number/), { target: { value: "abcdef" } });
    const form = screen.getByRole("form", { name: "Project inquiry" });
    fireEvent.submit(form);
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveFocus();
    screen.getByRole("button", { name: /Prepare email draft/ }).focus();
    fireEvent.submit(form);
    await waitFor(() => expect(alert).toHaveFocus());
    expect(screen.getByLabelText(/Phone number/)).toHaveAttribute(
      "aria-describedby",
      "error-phone",
    );
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
