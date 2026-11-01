import { useEffect, type RefObject } from "react";

/** Progressive enhancement: content is visible without JS, observers or motion permission. */
export function useSectionReveals(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root || !("IntersectionObserver" in window)) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    const elements = [
      ...root.querySelectorAll<HTMLElement>("main > section h2, .brief-body"),
    ].filter(
      (element) =>
        !element.closest("details:not([open])") && !element.classList.contains("sr-only"),
    );
    const clear = () => {
      observer?.disconnect();
      elements.forEach((element) => element.classList.remove("motion-reveal", "motion-visible"));
    };
    const setup = () => {
      clear();
      if (media.matches) return;
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("motion-visible");
              observer?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08 },
      );
      elements.forEach((element) => {
        // Never hide content already visible, including a deep-link destination.
        if (element.getBoundingClientRect().top < window.innerHeight) return;
        element.classList.add("motion-reveal");
        observer?.observe(element);
      });
    };
    setup();
    media.addEventListener("change", setup);
    return () => {
      clear();
      media.removeEventListener("change", setup);
    };
  }, [ref]);
}
