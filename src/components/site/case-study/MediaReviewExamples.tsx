import { ScreenshotGallery } from "./CaseStudyMedia";
import manufacturing from "@/assets/scene-01-manufacturing.jpg";
import engineering from "@/assets/scene-02-engineering.jpg";
/** Development-only layout fixtures, never registered as project screenshots. */
export function MediaReviewExamples() {
  return (
    <section id="media-review" className="ds-section">
      <h2>Screenshot viewer QA fixtures</h2>
      <p>
        Existing industrial illustrations test layout and focus behavior only. These are not product
        screenshots or delivery evidence.
      </p>
      <ScreenshotGallery
        screenshots={[
          {
            id: "qa-manufacturing",
            src: manufacturing,
            alt: "QA fixture: manufacturing illustration",
            width: 1920,
            height: 1088,
            caption: "Layout fixture 1 — illustration, not product evidence.",
          },
          {
            id: "qa-engineering",
            src: engineering,
            alt: "QA fixture: engineering illustration",
            width: 1920,
            height: 1088,
            caption: "Layout fixture 2 — illustration, not product evidence.",
          },
        ]}
      />
    </section>
  );
}
