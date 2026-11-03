import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ProjectGallery, ProjectMedia } from "@/components/site/gallery/ProjectGallery";
import { consultingIndustries, projects, caseStudies } from "@/lib/content";
import { gallerySearch } from "@/lib/gallery";
vi.mock("@tanstack/react-router", () => ({
  Link: ({
    to,
    params,
    search: _search,
    children,
    ...rest
  }: {
    to: string;
    params?: { slug: string };
    search?: unknown;
    children: React.ReactNode;
  }) => (
    <a href={params ? to.replace("$slug", params.slug) : to} {...rest}>
      {children}
    </a>
  ),
}));
afterEach(cleanup);
function pointer(element: Element, type: string, x: number, y: number) {
  const event = new Event(type, { bubbles: true });
  Object.assign(event, {
    clientX: x,
    clientY: y,
    pointerId: 1,
    pointerType: "touch",
    isPrimary: true,
  });
  fireEvent(element, event);
}
describe("Perspective project gallery", () => {
  it("only exposes the active case study and keeps inactive cards inert", () => {
    render(<ProjectGallery industry={consultingIndustries[0]} />);
    const gallery = screen.getByRole("region");
    expect(within(gallery).getAllByRole("link")).toHaveLength(1);
    expect(document.querySelectorAll(".exhibit-card[inert]")).toHaveLength(3);
    fireEvent.click(screen.getByRole("button", { name: /Show Engineering Automation Suite/ }));
    expect(
      within(gallery).getByRole("heading", { name: "Engineering Automation Suite" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Show Engineering Automation Suite/ }),
    ).toHaveAttribute("aria-current", "true");
    expect(within(gallery).getByRole("link", { name: "View Case Study" })).toHaveAttribute(
      "href",
      "/work/engineering-automation",
    );
  });
  it("recognizes deliberate horizontal touch swipes but ignores vertical movement and cancellation", () => {
    render(<ProjectGallery industry={consultingIndustries[0]} />);
    const stage = document.querySelector(".exhibit-stage")!;
    pointer(stage, "pointerdown", 240, 100);
    pointer(stage, "pointerup", 100, 110);
    expect(
      screen.getByRole("heading", { name: "Manufacturing Operating System" }),
    ).toBeInTheDocument();
    pointer(stage, "pointerdown", 240, 100);
    pointer(stage, "pointerup", 160, 240);
    expect(
      screen.getByRole("heading", { name: "Manufacturing Operating System" }),
    ).toBeInTheDocument();
    pointer(stage, "pointerdown", 240, 100);
    pointer(stage, "pointercancel", 100, 110);
    pointer(stage, "pointerup", 100, 110);
    fireEvent.wheel(stage, { deltaY: 600, deltaX: 50 });
    expect(
      screen.getByRole("heading", { name: "Manufacturing Operating System" }),
    ).toBeInTheDocument();
  });
  it("restores controlled project selection and reports deliberate changes", () => {
    const change = vi.fn();
    render(
      <ProjectGallery
        industry={consultingIndustries[1]}
        selectedSlug="tender-to-quotation"
        onProjectChange={change}
      />,
    );
    expect(
      screen.getByRole("heading", { name: "Tender-to-Quotation Intelligence" }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Next project" }));
    expect(change).toHaveBeenCalledWith("manufacturing-operating-system");
  });
  it("keeps unknown or cross-sector URL values within the known relevance mapping", () => {
    expect(gallerySearch({ industry: "unknown", project: "bogus" })).toEqual({
      industry: "manufacturing",
      project: "production-intelligence",
    });
    expect(gallerySearch({ industry: "real-estate", project: "engineering-automation" })).toEqual({
      industry: "real-estate",
      project: "boq-intelligence",
    });
    expect(gallerySearch({ industry: "epc", project: "tender-to-quotation" }).project).toBe(
      "tender-to-quotation",
    );
  });
  it("uses approved media slots without loading video automatically and pauses inactive video", () => {
    const pause = vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
    const project = { ...projects[0]!, media: { video: "/test-walkthrough.mp4" } };
    const evidence = caseStudies.find((item) => item.slug === project.slug)!;
    evidence.videoPoster = "/test-poster.webp";
    const { container, rerender } = render(<ProjectMedia project={project} active />);
    expect(container.querySelector("video")).toHaveAttribute("preload", "none");
    expect(container.querySelector("video")).toHaveAttribute("controls");
    rerender(<ProjectMedia project={project} active={false} />);
    expect(pause).toHaveBeenCalled();
    pause.mockRestore();
    evidence.videoPoster = null;
    rerender(
      <ProjectMedia
        project={{ ...project, media: { screenshots: ["/test-capture.webp"] } }}
        active
      />,
    );
    expect(screen.getByRole("img")).toHaveAttribute("loading", "lazy");
    expect(screen.getByRole("img")).toHaveAttribute("width", "1200");
  });
});
