import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { flagships, projectEvidence } from "@/lib/content";
import { ProjectEvidencePanel } from "@/components/site/ProjectEvidence";
afterEach(cleanup);
describe("Project evidence provenance", () => {
  it.each(flagships)(
    "classifies the sample for $title without a client-product screenshot",
    (project) => {
      const evidence = projectEvidence[project.slug];
      expect(evidence).toBeDefined();
      render(<ProjectEvidencePanel project={project} />);
      expect(screen.getByRole("figure")).toHaveAccessibleName(evidence!.title);
      expect(screen.getByText("Illustrative portfolio artifact")).toBeInTheDocument();
      expect(screen.getByText(evidence!.limitation)).toBeInTheDocument();
      expect(document.querySelector("img")).toBeNull();
      expect(evidence!.nextArtifact.length).toBeGreaterThan(0);
    },
  );
  it("preserves planned scope on the MOS conceptual diagram", () => {
    render(<ProjectEvidencePanel project={flagships[0]!} />);
    expect(screen.getByText("Planned document workflow")).toBeInTheDocument();
    expect(screen.getAllByText("Planned")).toHaveLength(2);
    expect(screen.getByText("In development")).toBeInTheDocument();
  });
});
