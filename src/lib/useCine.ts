import { useEffect, type RefObject } from "react";

export const CINE_QUERY = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";

type Gsap = typeof import("gsap").gsap;
type ST = typeof import("gsap/ScrollTrigger").ScrollTrigger;
export type CineCtx = {
  gsap: Gsap;
  ScrollTrigger: ST;
  q: (s: string) => Element[];
  root: HTMLElement;
};

/**
 * Loads GSAP after hydration and runs `build` only on desktop with motion allowed.
 * Everything built inside is reverted automatically (gsap.matchMedia).
 */
export function useCine(ref: RefObject<HTMLElement | null>, build: (ctx: CineCtx) => void) {
  useEffect(() => {
    let cancelled = false;
    let revert: (() => void) | undefined;
    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const root = ref.current;
      if (cancelled || !root) return;
      gsap.registerPlugin(ScrollTrigger);
      const mm = gsap.matchMedia();
      mm.add(CINE_QUERY, () => build({ gsap, ScrollTrigger, q: gsap.utils.selector(root), root }));
      revert = () => mm.revert();
      requestAnimationFrame(() => ScrollTrigger.refresh());
    })();
    return () => {
      cancelled = true;
      revert?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
