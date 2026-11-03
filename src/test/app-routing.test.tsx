import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";
import { routeTree } from "@/routeTree.gen";
import { projects } from "@/lib/content";

describe("App routing", () => {
  const router = createRouter({ routeTree });
  it("matches a page for / instead of falling back to not found", () => {
    expect(router.matchRoutes("/").at(-1)?.routeId).not.toBe(rootRouteId);
  });
  it.each(projects.map((p) => p.slug))(
    "preserves the dedicated case-study route for %s",
    (slug) => {
      const match = router.matchRoutes(`/work/${slug}`).at(-1);
      expect(match?.routeId).toBe("/work/$slug");
      expect(match?.params).toEqual({ slug });
    },
  );
  it("keeps project slugs unique", () => {
    expect(new Set(projects.map((p) => p.slug)).size).toBe(projects.length);
  });
});
