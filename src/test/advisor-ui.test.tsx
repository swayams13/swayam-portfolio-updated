import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SolutionsAdvisor } from "@/components/site/advisor/SolutionsAdvisor";
import { Contact } from "@/components/site/Contact";
import { HANDOFF_EVENT, type AdvisorReply } from "@/lib/advisor";
const answer: AdvisorReply = {
  mode: "lookup",
  message: "I don't have verified information about that. Here is the public scope.",
  facts: [
    {
      id: "production-intelligence:evidence",
      projectSlug: "production-intelligence",
      state: "unverified",
      text: "No product capability has been independently verified.",
    },
  ],
  projects: [
    {
      slug: "production-intelligence",
      title: "Production Intelligence Platform",
      href: "/work/production-intelligence",
      maturity: "Active Pilot / In Development",
    },
  ],
  question: "Where does your team record this information?",
};
function setup(post?: (body: Record<string, unknown>) => Promise<Response>, aiAvailable = false) {
  const fetcher = vi.fn((url: string, options?: RequestInit) => {
    if (url === "/api/inquiry")
      return Promise.resolve(Response.json({ deliveryAvailable: false, bookingUrl: null }));
    if (url === "/api/advisor-metrics") return Promise.resolve(Response.json({ ok: true }));
    if (options?.method === "POST")
      return post?.(JSON.parse(String(options.body))) ?? Promise.resolve(Response.json(answer));
    return Promise.resolve(Response.json({ aiAvailable }));
  });
  vi.stubGlobal("fetch", fetcher);
  Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
    configurable: true,
    writable: true,
    value: vi.fn(),
  });
  return fetcher;
}
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
describe("Advisor visitor controls", () => {
  it("starts in public lookup and sends only the current question and bounded public context", async () => {
    const fetcher = setup();
    render(<SolutionsAdvisor />);
    fireEvent.change(screen.getByLabelText("Your workflow question"), {
      target: { value: "How can I track production jobs?" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Ask the advisor/ }));
    await screen.findByRole("heading", { name: "Production Intelligence Platform" });
    const sent = fetcher.mock.calls.find(
      (call) => call[0] === "/api/advisor" && call[1]?.method === "POST",
    )!;
    const data = JSON.parse(String(sent[1]!.body));
    expect(data.allowAI).toBe(false);
    expect(data.question).toBe("How can I track production jobs?");
    expect(data.history).toBeUndefined();
    expect(data.transcript).toBeUndefined();
    const metricCalls = fetcher.mock.calls.filter((call) => call[0] === "/api/advisor-metrics");
    expect(JSON.stringify(metricCalls)).not.toContain("How can I track");
  });
  it("requires unchecked-by-default consent before transferring an edited summary and never auto-sends a lead", async () => {
    const fetcher = setup();
    render(
      <>
        <SolutionsAdvisor />
        <Contact />
      </>,
    );
    await screen.findByRole("button", { name: /Prepare email draft/ });
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Visitor Name" } });
    fireEvent.change(screen.getByLabelText("Your workflow question"), {
      target: { value: "Track production jobs" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Ask the advisor/ }));
    await screen.findByRole("heading", { name: "Production Intelligence Platform" });
    expect(screen.getByLabelText("Business problem or proposed project")).toHaveValue("");
    fireEvent.click(screen.getByRole("button", { name: /Discuss this workflow/ }));
    const copy = screen.getByRole("button", { name: /Copy to inquiry form/ });
    expect(copy).toBeDisabled();
    fireEvent.change(screen.getByLabelText("Summary to copy to the inquiry form"), {
      target: { value: "Only this reviewed summary." },
    });
    fireEvent.click(screen.getByLabelText(/I consent to copying this reviewed summary/));
    fireEvent.click(copy);
    expect(screen.getByLabelText("Business problem or proposed project")).toHaveValue(
      "Only this reviewed summary.",
    );
    expect(screen.getByLabelText("Name")).toHaveValue("Visitor Name");
    expect(
      fetcher.mock.calls.some((call) => call[0] === "/api/inquiry" && call[1]?.method === "POST"),
    ).toBe(false);
    expect(screen.getByText(/Nothing has been sent by the advisor/)).toBeInTheDocument();
  });
  it("ignores unconsented handoff events", async () => {
    setup();
    render(<Contact />);
    await screen.findByRole("button", { name: /Prepare email draft/ });
    window.dispatchEvent(
      new CustomEvent(HANDOFF_EVENT, {
        detail: { consent: false, challenge: "Do not copy", industry: "Manufacturing" },
      }),
    );
    expect(screen.getByLabelText("Business problem or proposed project")).toHaveValue("");
  });
  it("preserves input on failed or rate-limited requests", async () => {
    setup(async () => new Response("", { status: 429 }));
    render(<SolutionsAdvisor />);
    fireEvent.change(screen.getByLabelText("Your workflow question"), {
      target: { value: "Track production jobs" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Ask the advisor/ }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Please wait a minute");
    expect(screen.getByLabelText("Your workflow question")).toHaveValue("Track production jobs");
  });
  it("only sends AI opt-in after explicit selection and rejects unsafe response URLs", async () => {
    const fetcher = setup(
      async () =>
        Response.json({
          ...answer,
          projects: [{ ...answer.projects[0], href: "javascript:alert(1)" }],
        }),
      true,
    );
    render(<SolutionsAdvisor />);
    const enable = await screen.findByLabelText(/Enable AI fact matching/);
    expect(enable).not.toBeChecked();
    fireEvent.click(enable);
    fireEvent.change(screen.getByLabelText("Your workflow question"), {
      target: { value: "Track production jobs" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Ask the advisor/ }));
    expect(await screen.findByRole("alert")).toHaveTextContent("unavailable");
    const sent = fetcher.mock.calls.find(
      (call) => call[0] === "/api/advisor" && call[1]?.method === "POST",
    )!;
    expect(JSON.parse(String(sent[1]!.body)).allowAI).toBe(true);
    expect(screen.queryByRole("link", { name: /Open case study/ })).toBeNull();
  });
  it("clears memory and ignores an answer arriving after clear", async () => {
    let finish!: (response: Response) => void;
    setup(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
    render(<SolutionsAdvisor />);
    fireEvent.change(screen.getByLabelText("Your workflow question"), {
      target: { value: "Track production jobs" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Ask the advisor/ }));
    fireEvent.click(screen.getByRole("button", { name: /Clear conversation/ }));
    finish(Response.json(answer));
    await waitFor(() =>
      expect(
        screen.queryByRole("heading", { name: "Production Intelligence Platform" }),
      ).toBeNull(),
    );
    expect(screen.getByLabelText("Your workflow question")).toHaveValue("");
  });
});
