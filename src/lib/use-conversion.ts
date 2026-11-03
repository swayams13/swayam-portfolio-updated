import { useEffect, useRef, type RefObject } from "react";
import { analyticsAllowed, trackConversion } from "./analytics";
export function usePageConversion(event: "case_study_opened", project: string) {
  const seen = useRef(new Set<string>());
  useEffect(() => {
    const emit = () => {
      if (analyticsAllowed() && !seen.current.has(project)) {
        seen.current.add(project);
        trackConversion(event, { project });
      }
    };
    emit();
    window.addEventListener("analytics-choice", emit);
    return () => window.removeEventListener("analytics-choice", emit);
  }, [event, project]);
}
export function useProjectImpression(ref: RefObject<HTMLDivElement | null>, project: string) {
  const seen = useRef(new Set<string>());
  useEffect(() => {
    let observer: IntersectionObserver | undefined;
    const setup = () => {
      observer?.disconnect();
      if (
        !analyticsAllowed() ||
        !ref.current ||
        !("IntersectionObserver" in window) ||
        seen.current.has(project)
      )
        return;
      observer = new IntersectionObserver(
        (entries) => {
          if (
            entries.some((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.5) &&
            analyticsAllowed() &&
            !seen.current.has(project)
          ) {
            seen.current.add(project);
            trackConversion("project_card_viewed", { project });
            observer?.disconnect();
          }
        },
        { threshold: 0.5 },
      );
      observer.observe(ref.current);
    };
    setup();
    window.addEventListener("analytics-choice", setup);
    return () => {
      observer?.disconnect();
      window.removeEventListener("analytics-choice", setup);
    };
  }, [ref, project]);
}
export function useVideoConversion(project: string) {
  const state = useRef({ started: false, completed: false });
  useEffect(() => {
    state.current = { started: false, completed: false };
  }, [project]);
  return {
    onPlay: () => {
      if (analyticsAllowed() && !state.current.started) {
        state.current.started = true;
        trackConversion("video_started", { project });
      }
    },
    onEnded: () => {
      if (analyticsAllowed() && state.current.started && !state.current.completed) {
        state.current.completed = true;
        trackConversion("video_completed", { project });
      }
    },
  };
}
