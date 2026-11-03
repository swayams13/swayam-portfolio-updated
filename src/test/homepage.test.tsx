import { useState } from "react";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  ConsultingHero,
  ConsultingOutcomes,
  IndustryWork,
} from "@/components/site/home/ConsultingHomepage";
import {
  type ConsultingIndustryId,
  consultingIndustries,
  homepageProjectPreviews,
  projects,
} from "@/lib/content";
vi.mock("@tanstack/react-router", () => ({
  Link: ({
    to,
    params,
    children,
    ...rest
  }: {
    to: string;
    params?: { slug: string };
    children: React.ReactNode;
  }) => (
    <a href={params ? to.replace("$slug", params.slug) : to} {...rest}>
      {children}
    </a>
  ),
}));
afterEach(cleanup);
describe("Consulting homepage", () => {
  it("connects the industry selector to the controlled gallery", () => {
    function Page() {
      const [active, setActive] = useState<
        "manufacturing" | "epc" | "construction" | "real-estate"
      >("manufacturing");
      return (
        <>
          <ConsultingHero />
          <IndustryWork active={active} onIndustryChange={setActive} />
        </>
      );
    }
    render(<Page />);
    fireEvent.click(screen.getByRole("button", { name: "EPC & Engineering" }));
    expect(screen.getByRole("button", { name: "EPC & Engineering" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(
      screen.getByRole("region", { name: "EPC & Engineering selected work" }),
    ).toHaveTextContent("Engineering Automation Suite");
  });
  it("keeps industry mappings valid and supports shared project relevance", () => {
    for (const sector of consultingIndustries)
      for (const slug of sector.projectSlugs) {
        expect(projects.find((p) => p.slug === slug)).toBeDefined();
        expect(homepageProjectPreviews[slug]).toBeDefined();
      }
    expect(consultingIndustries[2].projectSlugs).toContain("boq-intelligence");
    expect(consultingIndustries[3].projectSlugs).toContain("boq-intelligence");
  });
  it("starts with manufacturing and keeps carousel state on an unchanged filter", () => {
    render(<IndustryWork />);
    const gallery = screen.getByRole("region", { name: "Manufacturing selected work" });
    expect(
      within(gallery).getByRole("heading", { name: "Production Intelligence Platform" }),
    ).toBeInTheDocument();
    expect(within(gallery).getByText("Active Pilot / In Development")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Next project" }));
    fireEvent.click(screen.getByRole("button", { name: "Manufacturing" }));
    expect(
      within(gallery).getByRole("heading", { name: "Manufacturing Operating System" }),
    ).toBeInTheDocument();
    expect(within(gallery).getByRole("link", { name: /View Case Study/ })).toHaveAttribute(
      "href",
      "/work/manufacturing-operating-system",
    );
  });
  it("updates sector, use cases and project together and resets to a valid first slide", () => {
    render(<IndustryWork />);
    fireEvent.click(screen.getByRole("button", { name: "Next project" }));
    fireEvent.click(screen.getByRole("button", { name: "Construction" }));
    const gallery = screen.getByRole("region", { name: "Construction selected work" });
    expect(screen.getByText("Quantity clarification")).toBeInTheDocument();
    expect(
      within(gallery).getByRole("heading", { name: "BOQ Intelligence Platform" }),
    ).toBeInTheDocument();
    expect(within(gallery).getByText("Prototype / In Development")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Previous project" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next project" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "EPC & Engineering" }));
    expect(
      screen.getByRole("region", { name: "EPC & Engineering selected work" }),
    ).toHaveTextContent("Engineering Automation Suite");
  });
  it("supports selector arrows and carousel boundaries without moving page focus", () => {
    render(<IndustryWork />);
    const manufacture = screen.getByRole("button", { name: "Manufacturing" });
    manufacture.focus();
    fireEvent.keyDown(manufacture, { key: "ArrowRight" });
    const epc = screen.getByRole("button", { name: "EPC & Engineering" });
    expect(epc).toHaveFocus();
    expect(epc).toHaveAttribute("aria-pressed", "true");
    const gallery = screen.getByRole("region", { name: "EPC & Engineering selected work" });
    gallery.focus();
    fireEvent.keyDown(gallery, { key: "End" });
    expect(screen.getByRole("button", { name: "Next project" })).toBeDisabled();
    expect(gallery).toHaveFocus();
    fireEvent.keyDown(gallery, { key: "Home" });
    expect(screen.getByRole("button", { name: "Previous project" })).toBeDisabled();
    expect(
      within(gallery).getByRole("heading", { name: "Engineering Automation Suite" }),
    ).toBeInTheDocument();
  });
  it("presents illustrative previews and target benefits without shipped metric claims", () => {
    render(
      <>
        <IndustryWork />
        <ConsultingOutcomes />
      </>,
    );
    expect(screen.getByRole("figure", { name: /not a product screenshot/ })).toBeInTheDocument();
    expect(screen.getByText(/intended benefits, not measured results/)).toBeInTheDocument();
    expect(screen.getByText(/Sector relevance does not imply a deployment/)).toBeInTheDocument();
    expect(screen.queryByText("Capability scope")).toBeNull();
  });
  it("renders the requested offer and native CTA destinations", () => {
    render(<ConsultingHero />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Complex operations.Simpler systems.",
    );
    expect(screen.getByRole("link", { name: "Explore Selected Work" })).toHaveAttribute(
      "href",
      "#work",
    );
    expect(screen.getByRole("link", { name: "Discuss a Project" })).toHaveAttribute(
      "href",
      "#contact",
    );
    expect(screen.queryByRole("navigation", { name: "Consulting industries" })).toBeNull();
  });
});
