import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { caseStudies, projects } from "@/lib/content";
import {
  caseStudyStructuredData,
  caseStudyUrl,
  type CaseStudyProject,
  type ProjectScreenshot,
} from "@/lib/case-study";
import { CaseStudyPage } from "@/components/site/case-study/CaseStudyPage";
import {
  CaseStudyVideo,
  ProductPreview,
  ScreenshotGallery,
} from "@/components/site/case-study/CaseStudyMedia";
vi.mock("@tanstack/react-router", () => ({
  Link: ({
    to,
    params,
    search: _search,
    hash,
    children,
    ...rest
  }: {
    to: string;
    params?: { slug: string };
    search?: unknown;
    hash?: string;
    children: React.ReactNode;
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
  vi.restoreAllMocks();
});
const base = caseStudies.find((p) => p.slug === "engineering-automation")!;
const screenshot: ProjectScreenshot = {
  id: "test",
  src: "/test-capture.webp",
  alt: "Test fixture capture",
  width: 1280,
  height: 800,
  caption: "Test fixture only",
};
describe("Evidence-led case studies", () => {
  it("preserves every project and original capability while keeping unverified claims out of verified fields", () => {
    expect(caseStudies.map((p) => p.slug)).toEqual(projects.map((p) => p.slug));
    for (const story of caseStudies) {
      const original = projects.find((p) => p.slug === story.slug)!;
      expect(story.verifiedCapabilities).toEqual([]);
      expect(story.verifiedOutcomes).toEqual([]);
      expect(story.lastVerifiedDate).toBeNull();
      expect(story.technologyStack).toEqual([]);
      expect(story.screenshots).toEqual([]);
      expect(
        story.reportedImplementedCapabilities.length +
          story.unverifiedCapabilities.length +
          story.inDevelopmentCapabilities.length +
          story.plannedCapabilities.length,
      ).toBe(original.features.length);
      expect(
        story.relatedProjects.every(
          (slug) => slug !== story.slug && caseStudies.some((p) => p.slug === slug),
        ),
      ).toBe(true);
    }
  });
  it("renders reported delivery, planned CAD and unknown stack without promoting them to verified capabilities", () => {
    render(<CaseStudyPage project={base} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(base.title);
    expect(
      screen.getByText(/No product capabilities have been independently verified/),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Reported implemented · evidence pending" }),
    ).toBeInTheDocument();
    expect(screen.getByText("CAD integration workflows")).toBeInTheDocument();
    expect(screen.getByText(/technology stack has not been verified/)).toBeInTheDocument();
    expect(screen.getByText(/No independently verified business outcomes/)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Open the interactive portfolio sample/ }),
    ).toHaveAttribute("href", "/samples#engineering-automation-demo");
  });
  it("renders a labeled hero fallback without a fake play control", () => {
    render(
      <>
        <ProductPreview project={base} />
        <CaseStudyVideo project={base} />
      </>,
    );
    expect(
      screen.getByRole("figure", { name: /authentic product preview not supplied/ }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getByText("Walkthrough not supplied")).toBeInTheDocument();
  });
  it("renders native video, a real poster slot, caption tracks and transcript without autoplay", () => {
    const fixture: CaseStudyProject = {
      ...base,
      videoSource: "/test.mp4",
      videoPoster: "/test-poster.webp",
      videoCaptions: [{ src: "/test.vtt", language: "en", label: "English" }],
      videoTranscript: { language: "en", paragraphs: ["Fixture transcript."] },
    };
    const { container, rerender } = render(<CaseStudyVideo project={fixture} />);
    const video = container.querySelector("video")!;
    expect(video).toHaveAttribute("controls");
    expect(video).toHaveAttribute("preload", "none");
    expect(video).not.toHaveAttribute("autoplay");
    expect(video.querySelector("track")).toHaveAttribute("src", "/test.vtt");
    expect(video).toHaveAttribute("poster", "/test-poster.webp");
    fireEvent.click(screen.getByText(/Read transcript/));
    expect(screen.getByText("Fixture transcript.")).toBeVisible();
    rerender(<CaseStudyVideo project={{ ...fixture, videoPoster: null }} />);
    expect(container.querySelector("video")).toBeNull();
    expect(screen.getByRole("link", { name: /Open supplied recording/ })).toHaveAttribute(
      "href",
      "/test.mp4",
    );
  });
  it("opens the screenshot viewer, navigates by keyboard, closes and restores focus", () => {
    if (!HTMLDialogElement.prototype.showModal)
      Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
        configurable: true,
        writable: true,
        value: function (this: HTMLDialogElement) {
          this.setAttribute("open", "");
        },
      });
    if (!HTMLDialogElement.prototype.close)
      Object.defineProperty(HTMLDialogElement.prototype, "close", {
        configurable: true,
        writable: true,
        value: function (this: HTMLDialogElement) {
          this.removeAttribute("open");
          this.dispatchEvent(new Event("close"));
        },
      });
    vi.spyOn(HTMLDialogElement.prototype, "showModal").mockImplementation(function (
      this: HTMLDialogElement,
    ) {
      this.setAttribute("open", "");
    });
    vi.spyOn(HTMLDialogElement.prototype, "close").mockImplementation(function (
      this: HTMLDialogElement,
    ) {
      this.removeAttribute("open");
      this.dispatchEvent(new Event("close"));
    });
    render(
      <ScreenshotGallery
        screenshots={[
          screenshot,
          {
            ...screenshot,
            id: "second",
            src: "/second.webp",
            caption: "Second fixture",
            alt: "Second test capture",
          },
        ]}
      />,
    );
    const trigger = screen.getByRole("button", { name: /Enlarge screenshot 1/ });
    trigger.focus();
    fireEvent.click(trigger);
    const dialog = screen.getByRole("dialog", { name: "Screenshot viewer" });
    expect(within(dialog).getByRole("img")).toHaveAttribute("width", "1280");
    fireEvent.keyDown(dialog, { key: "ArrowRight" });
    expect(within(dialog).getByRole("img")).toHaveAttribute("src", "/second.webp");
    expect(within(dialog).getByRole("button", { name: /Next screenshot/ })).toBeDisabled();
    fireEvent.click(within(dialog).getByRole("button", { name: /Close/ }));
    expect(trigger).toHaveFocus();
    expect(screen.queryByRole("dialog")).toBeNull();
  });
  it("keeps MedPulse a research story and avoids publication or clinical-success metadata", () => {
    const research = caseStudies.find((p) => p.slug === "medpulse")!;
    render(<CaseStudyPage project={research} />);
    expect(
      screen.getByText(/Publication, attribution and methodology have not been verified/),
    ).toBeInTheDocument();
    expect(research.kind).toBe("research");
    expect(research.relatedProjects).toEqual([]);
    const data = caseStudyStructuredData(research);
    expect(data["@type"]).toBe("CreativeWork");
    expect(data).not.toHaveProperty("datePublished");
    expect(data).not.toHaveProperty("aggregateRating");
    expect(caseStudyUrl(base)).toBe("https://swayam-singh.vercel.app/work/engineering-automation");
  });
});
