import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Contact } from "@/components/site/Contact";
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
function complete() {
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
});
