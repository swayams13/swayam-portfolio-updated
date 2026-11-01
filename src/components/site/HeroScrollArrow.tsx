import type { RefObject } from "react";
import { useCine } from "@/lib/useCine";

/** One decorative arrow links the headline to the operating model; never captures input. */
export function HeroScrollArrow({ rootRef }: { rootRef: RefObject<HTMLElement | null> }) {
  useCine(rootRef, ({ gsap, ScrollTrigger, root }) => {
    const origin = root.querySelector<HTMLElement>(".hero-arrow-origin");
    const dock = root.querySelector<HTMLElement>(".hero-arrow-dock");
    const svg = root.querySelector<SVGSVGElement>(".hero-arrow-overlay");
    const route = root.querySelector<SVGPathElement>(".hero-arrow-route");
    const trail = root.querySelector<SVGPathElement>(".hero-arrow-trail");
    const head = root.querySelector<SVGGElement>(".hero-arrow-position");
    if (!origin || !dock || !svg || !route || !trail || !head) return;

    const state = { progress: 0 };
    let length = 0;
    let initialScale = 1;
    let disposed = false;
    let resizeFrame = 0;

    const draw = () => {
      if (!length) return;
      const distance = state.progress * length;
      const point = route.getPointAtLength(distance);
      const before = route.getPointAtLength(Math.max(0, distance - 1));
      const after = route.getPointAtLength(Math.min(length, distance + 1));
      const angle = (Math.atan2(after.y - before.y, after.x - before.x) * 180) / Math.PI;
      const scale = initialScale + (0.7 - initialScale) * state.progress;
      head.setAttribute(
        "transform",
        `translate(${point.x} ${point.y}) rotate(${angle}) scale(${scale})`,
      );
      // Only the last stretch follows the head: no permanent line across the copy.
      const tail = Math.min(distance, 420) * Math.sin(Math.PI * state.progress);
      trail.setAttribute("stroke-dasharray", `${tail} ${length + 1}`);
      trail.setAttribute("stroke-dashoffset", `${-(distance - tail)}`);
      root.classList.toggle("hero-arrow-travelling", state.progress > 0.005);
    };

    const measure = () => {
      const bounds = root.getBoundingClientRect();
      const from = origin.getBoundingClientRect();
      const to = dock.getBoundingClientRect();
      const x = from.left + from.width / 2 - bounds.left;
      const y = from.top + from.height / 2 - bounds.top;
      const endX = to.left + to.width / 2 - bounds.left;
      const endY = to.top + to.height / 2 - bounds.top;
      const right = bounds.width - 22;
      const left = Math.max(18, endX - 45);
      // Leave at 45°, sweep down the right margin, then curl into a right-facing dock.
      const d = `M${x} ${y} C${x + 55} ${y + 55},${right} ${y + 20},${right} ${y + 110}
        C${right} ${endY - 95},${left} ${endY - 140},${left} ${endY - 48}
        C${left} ${endY},${endX - 25} ${endY},${endX} ${endY}`;
      svg.setAttribute("viewBox", `0 0 ${bounds.width} ${bounds.height}`);
      route.setAttribute("d", d);
      trail.setAttribute("d", d);
      length = route.getTotalLength();
      initialScale = Math.min(1.6, Math.max(0.9, from.height / 65));
      draw();
    };

    measure();
    root.classList.add("hero-arrow-ready");
    gsap.to(state, {
      progress: 1,
      ease: "none",
      onUpdate: draw,
      scrollTrigger: {
        trigger: root,
        start: "top top+=88",
        endTrigger: dock,
        end: "center 38%",
        scrub: 0.45,
        invalidateOnRefresh: true,
        onRefresh: measure,
      },
    });
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        if (!disposed) ScrollTrigger.refresh();
      });
    });
    observer.observe(root);
    void document.fonts.ready.then(() => {
      if (!disposed) ScrollTrigger.refresh();
    });
    return () => {
      disposed = true;
      observer.disconnect();
      cancelAnimationFrame(resizeFrame);
      root.classList.remove("hero-arrow-ready", "hero-arrow-travelling");
    };
  });

  return (
    <svg className="hero-arrow-overlay" aria-hidden="true" focusable="false">
      <path className="hero-arrow-route" fill="none" stroke="none" />
      <path className="hero-arrow-trail" fill="none" stroke="currentColor" strokeWidth="2" />
      <g className="hero-arrow-position">
        <g className="hero-arrow-head">
          <path d="M-28 0H15M0-15L15 0L0 15" fill="none" stroke="currentColor" strokeWidth="3" />
        </g>
      </g>
    </svg>
  );
}
