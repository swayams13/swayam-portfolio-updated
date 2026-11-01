import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Production } from "@/components/site/work/Production";
import { Engineering } from "@/components/site/work/Engineering";
import { Tender } from "@/components/site/work/Tender";
import { BOQ } from "@/components/site/work/BOQ";
import { CrossfadeImage } from "@/components/site/CrossfadeImage";
vi.mock("@tanstack/react-router", () => ({
  Link: ({
    children,
    to,
    params,
    ...rest
  }: {
    children: React.ReactNode;
    to: string;
    params?: { slug: string };
  }) => (
    <a href={params ? to.replace("$slug", params.slug) : to} {...rest}>
      {children}
    </a>
  ),
}));
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
describe("Illustrative project exploration", () => {
  it("selects a production job and exposes its own stage and owner", () => {
    render(<Production />);
    fireEvent.click(screen.getByRole("button", { name: /J-2402 Pressure vessel/ }));
    const detail = within(document.getElementById("sample-job-detail")!);
    expect(detail.getByText(/current owner: QC/)).toBeInTheDocument();
    expect(detail.getByText("Current").closest("li")).toHaveTextContent("Quality");
    expect(screen.getByRole("button", { name: /J-2402 Pressure vessel/ })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
  it("updates the illustrative BOM and rejects invalid assembly counts", () => {
    render(<Engineering />);
    const input = screen.getByLabelText("Try a sample BOM quantity");
    fireEvent.change(input, { target: { value: "6" } });
    expect(screen.getByText("24", { selector: "output" })).toBeInTheDocument();
    fireEvent.change(input, { target: { value: "0" } });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Enter a whole number between 1 and 20.")).toBeInTheDocument();
    expect(screen.queryByText("24", { selector: "output" })).toBeNull();
  });
  it("traces a tender excerpt to its predefined mapped field", () => {
    render(<Tender />);
    fireEvent.click(screen.getByText("Inspect the illustrative tender workflow"));
    fireEvent.click(screen.getByRole("button", { name: /4.3 Materials/ }));
    const result = within(document.getElementById("mapped-requirement")!);
    expect(result.getByText("SS 321")).toBeInTheDocument();
    expect(result.getByText(/Predefined mapping, not live extraction/)).toBeInTheDocument();
  });
  it("opens a BOQ flag explanation without changing source quantities", () => {
    render(<BOQ />);
    fireEvent.click(screen.getByRole("button", { name: /04 Validation/ }));
    const flag = screen.getByRole("button", { name: /Missing quantity/ });
    fireEvent.click(flag);
    expect(flag).toHaveAttribute("aria-expanded", "true");
    const note = screen.getByText(/The sample source has no quantity/);
    expect(note).toBeVisible();
    fireEvent.click(flag);
    expect(note).not.toBeVisible();
  });
  it("ignores a stale scene decode when visitors switch industries quickly", async () => {
    const resolves: Array<() => void> = [];
    vi.stubGlobal(
      "Image",
      class {
        src = "";
        onload = null;
        onerror = null;
        decode() {
          return new Promise<void>((resolve) => resolves.push(resolve));
        }
      },
    );
    const { container, rerender } = render(<CrossfadeImage src="/first.jpg" />);
    rerender(<CrossfadeImage src="/second.jpg" />);
    rerender(<CrossfadeImage src="/third.jpg" />);
    await act(async () => resolves[0]!());
    expect(container.querySelector('img[src="/second.jpg"]')).toBeNull();
    await act(async () => resolves[1]!());
    expect(container.querySelector('img[src="/third.jpg"]')).toBeInTheDocument();
    expect(container.querySelector('img[src="/first.jpg"]')).toBeInTheDocument();
  });
});
