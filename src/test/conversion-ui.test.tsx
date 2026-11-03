import { cleanup, fireEvent, render, screen, act } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useRef } from "react";
import {
  analyticsAllowed,
  referralAttribution,
  setAnalyticsChoice,
  trackConversion,
} from "@/lib/analytics";
import { usePageConversion, useProjectImpression, useVideoConversion } from "@/lib/use-conversion";
import { AnalyticsConsent } from "@/components/site/AnalyticsConsent";
afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});
function Demo() {
  const ref = useRef<HTMLDivElement>(null);
  useProjectImpression(ref, "production-intelligence");
  usePageConversion("case_study_opened", "production-intelligence");
  const handlers = useVideoConversion("production-intelligence");
  return (
    <div ref={ref}>
      <video aria-label="Sample video" {...handlers} />
    </div>
  );
}
describe("Consent and event semantics", () => {
  it("defaults off and honors consent withdrawal, DNT and GPC", () => {
    const fetcher = vi.fn().mockResolvedValue(Response.json({ ok: true }));
    vi.stubGlobal("fetch", fetcher);
    expect(analyticsAllowed()).toBe(false);
    trackConversion("chat_started");
    expect(fetcher).not.toHaveBeenCalled();
    setAnalyticsChoice(true);
    trackConversion("chat_started");
    expect(fetcher).toHaveBeenCalledTimes(1);
    setAnalyticsChoice(false);
    trackConversion("chat_started");
    expect(fetcher).toHaveBeenCalledTimes(1);
    setAnalyticsChoice(true);
    Object.defineProperty(navigator, "doNotTrack", { value: "1", configurable: true });
    expect(analyticsAllowed()).toBe(false);
    delete (navigator as unknown as { doNotTrack?: string }).doNotTrack;
  });
  it("honors Global Privacy Control even after opt-in", () => {
    setAnalyticsChoice(true);
    Object.defineProperty(navigator, "globalPrivacyControl", { value: true, configurable: true });
    expect(analyticsAllowed()).toBe(false);
    delete (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl;
  });
  it("offers an accessible preference checkbox", () => {
    render(<AnalyticsConsent />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    expect(analyticsAllowed()).toBe(true);
    fireEvent.click(checkbox);
    expect(analyticsAllowed()).toBe(false);
  });
  it("never emits a full referrer or arbitrary campaign", () => {
    expect(referralAttribution()).toBeUndefined();
    setAnalyticsChoice(true);
    Object.defineProperty(document, "referrer", {
      configurable: true,
      value: "https://private.example/customer?email=secret",
    });
    expect(referralAttribution()).toEqual({ source: "referral" });
  });
  it("emits case visits once, visible cards only at 50%, and native video lifecycle only", () => {
    const fetcher = vi.fn().mockResolvedValue(Response.json({ ok: true }));
    vi.stubGlobal("fetch", fetcher);
    setAnalyticsChoice(true);
    let notify!: IntersectionObserverCallback;
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(cb: IntersectionObserverCallback) {
          notify = cb;
        }
        observe() {}
        disconnect() {}
      },
    );
    const view = render(<Demo />);
    const events = () => fetcher.mock.calls.map((c) => JSON.parse(c[1].body).event);
    expect(events()).toEqual(["case_study_opened"]);
    act(() =>
      notify(
        [{ isIntersecting: true, intersectionRatio: 0.2 }] as IntersectionObserverEntry[],
        {} as IntersectionObserver,
      ),
    );
    expect(events()).not.toContain("project_card_viewed");
    act(() =>
      notify(
        [{ isIntersecting: true, intersectionRatio: 0.6 }] as IntersectionObserverEntry[],
        {} as IntersectionObserver,
      ),
    );
    const video = screen.getByLabelText("Sample video");
    fireEvent.ended(video);
    expect(events()).not.toContain("video_completed");
    fireEvent.play(video);
    fireEvent.play(video);
    fireEvent.ended(video);
    fireEvent.ended(video);
    view.rerender(<Demo />);
    expect(events()).toEqual([
      "case_study_opened",
      "project_card_viewed",
      "video_started",
      "video_completed",
    ]);
  });
});
