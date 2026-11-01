import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Contact } from "@/components/site/AboutContact";
import { IndustryJourney } from "@/components/site/IndustryJourney";
import { MOS } from "@/components/site/work/MOS";
import { BOQ } from "@/components/site/work/BOQ";
import { WorkflowExplorer } from "@/components/site/WorkflowExplorer";
import { WorkflowDiagnostic } from "@/components/site/WorkflowDiagnostic";

// Isolate interaction tests from router navigation; route matching is tested separately.
vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    to,
    params,
    hash,
    ...rest
  }: {
    children: React.ReactNode;
    to: string;
    params?: { slug: string };
    hash?: string;
  }) => (
    <a
      href={`${params ? to.replace("$slug", params.slug) : to}${hash ? `#${hash}` : ""}`}
      {...rest}
    >
      {children}
    </a>
  ),
}));
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
describe("Portfolio foundation interactions", () => {
  it("connects a selected workflow to its actual project and status", () => {
    render(<WorkflowExplorer />);
    expect(screen.getByText("Separate workflows")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /03 Documents/ }));
    expect(screen.getByRole("button", { name: /03 Documents/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("link", { name: /Explore this workflow/ })).toHaveAttribute(
      "href",
      "/work/boq-intelligence",
    );
    expect(screen.getByText("Prototype / In Development")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Reset view" }));
    expect(screen.getByText("Separate workflows")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Explore this workflow/ })).not.toBeInTheDocument();
  });
  it("offers a whole-system view without retaining a stale workflow selection", () => {
    render(<WorkflowExplorer />);
    fireEvent.click(screen.getByRole("button", { name: /04 Commercial/ }));
    expect(screen.getByRole("link", { name: /Explore this workflow/ })).toHaveAttribute(
      "href",
      "/work/tender-to-quotation",
    );
    fireEvent.click(screen.getByRole("button", { name: "Connect all workflows" }));
    expect(screen.getByRole("button", { name: /04 Commercial/ })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(screen.getByRole("link", { name: /Explore the platform concept/ })).toHaveAttribute(
      "href",
      "/work/manufacturing-operating-system",
    );
    expect(screen.getByRole("button", { name: "Connect all workflows" })).toBeDisabled();
  });
  it("changes the industry explanation and destination together", () => {
    render(<IndustryJourney />);
    fireEvent.click(screen.getByRole("button", { name: /02 Construction/ }));
    expect(screen.getByRole("button", { name: /02 Construction/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("link", { name: /Explore the BOQ prototype/ })).toHaveAttribute(
      "href",
      "#boq-intelligence",
    );
  });
  it("keeps MOS planned capabilities explicit when selecting departments", () => {
    render(<MOS />);
    fireEvent.click(screen.getByRole("button", { name: /04 Quality/ }));
    const detail = document.getElementById("module-detail")!;
    expect(within(detail).getByRole("heading", { name: "Quality" })).toBeInTheDocument();
    expect(within(detail).getByText("Planned")).toBeInTheDocument();
  });
  it("supports BOQ review decisions and clears them on reset", () => {
    render(<BOQ />);
    fireEvent.click(screen.getByRole("button", { name: /05 Review/ }));
    fireEvent.click(screen.getByRole("button", { name: "Accept item 2.04" }));
    expect(screen.getByRole("button", { name: "Accept item 2.04" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    fireEvent.click(screen.getByRole("button", { name: "Reset sample" }));
    expect(screen.getByRole("button", { name: "← Previous" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: /05 Review/ }));
    expect(screen.getByRole("button", { name: "Accept item 2.04" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });
  it("recommends the relevant case study without collecting contact data", () => {
    render(<WorkflowDiagnostic />);
    fireEvent.change(screen.getByLabelText("Which challenge sounds familiar?"), {
      target: { value: "documents" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Find a relevant system/ }));
    expect(screen.getByRole("link", { name: /Explore this system/ })).toHaveAttribute(
      "href",
      "/work/boq-intelligence",
    );
    fireEvent.change(screen.getByLabelText("Which challenge sounds familiar?"), {
      target: { value: "engineering" },
    });
    expect(screen.queryByRole("link", { name: /Explore this system/ })).not.toBeInTheDocument();
  });
  it("prepares an email draft when online delivery is unavailable", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(Response.json({ deliveryAvailable: false, bookingUrl: null })),
    );
    render(<Contact />);
    await screen.findByRole("button", { name: /Prepare email draft/ });
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: "Sample Reviewer" } });
    fireEvent.change(screen.getByLabelText("Company"), { target: { value: "Example Works" } });
    fireEvent.change(screen.getByLabelText("Work email"), {
      target: { value: "review@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Industry"), { target: { value: "Manufacturing" } });
    fireEvent.change(screen.getByLabelText("Business problem or proposed project"), {
      target: { value: "A sample production workflow." },
    });
    fireEvent.submit(screen.getByRole("form", { name: "Project inquiry" }));
    expect(
      screen.getByText("Your email draft is ready. It has not been sent."),
    ).toBeInTheDocument();
    expect((screen.getByLabelText("Inquiry draft") as HTMLTextAreaElement).value).toContain(
      "A sample production workflow.",
    );
    expect(screen.getByRole("link", { name: /Open email app/ })).toHaveAttribute(
      "href",
      expect.stringContaining("mailto:sswayam506@gmail.com"),
    );
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
