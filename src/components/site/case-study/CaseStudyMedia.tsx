import { useVideoConversion } from "@/lib/use-conversion";
import { useRef, useState } from "react";
import { AccessibleModal } from "@/components/design-system";
import type { CaseStudyProject, ProjectScreenshot } from "@/lib/case-study";

export function ProductPreview({ project }: { project: CaseStudyProject }) {
  const image = project.screenshots[0];
  if (image)
    return (
      <figure className="story-product">
        <img
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          srcSet={image.srcSet}
          sizes={image.sizes ?? "(max-width: 767px) 90vw, 85vw"}
          decoding="async"
          fetchPriority="high"
        />
        <figcaption>{image.caption}</figcaption>
      </figure>
    );
  return (
    <figure
      className="story-product story-preview-empty"
      aria-label={`${project.title}: authentic product preview not supplied`}
    >
      <span className="ds-eyebrow">
        {project.kind === "research" ? "Research evidence" : "Product evidence"}
      </span>
      <p>{project.title}</p>
      <figcaption>
        Authentic {project.kind === "research" ? "research artifact" : "product capture"} not
        supplied.
        <br />
        This project brief describes scope; this panel is not a product screenshot.
      </figcaption>
    </figure>
  );
}
export function CaseStudyVideo({ project }: { project: CaseStudyProject }) {
  const videoEvents = useVideoConversion(project.slug);
  return (
    <div className="story-recording">
      {project.videoSource && project.videoPoster ? (
        <video
          {...videoEvents}
          controls
          crossOrigin="anonymous"
          playsInline
          preload="none"
          poster={project.videoPoster}
          aria-label={`${project.title} walkthrough`}
          width={1600}
          height={900}
        >
          <source src={project.videoSource} />
          {project.videoCaptions.map((caption, index) => (
            <track
              key={caption.src}
              kind="captions"
              src={caption.src}
              srcLang={caption.language}
              label={caption.label}
              default={index === 0}
            />
          ))}
          Your browser does not support this video.{" "}
          <a href={project.videoSource}>Open the recording</a>.
        </video>
      ) : (
        <div className="story-empty">
          <h3>
            {project.videoSource ? "Recording awaiting a real poster" : "Walkthrough not supplied"}
          </h3>
          <p>
            {project.videoSource
              ? "A real poster is required before embedding this recording."
              : "No product recording is available for this brief. The written scope and limitations remain available below."}
          </p>
          {project.videoSource && (
            <a href={project.videoSource} className="text-link">
              Open supplied recording ↗
            </a>
          )}
        </div>
      )}
      {project.videoSource && project.videoPoster && !project.videoCaptions.length && (
        <p className="caption">Captions have not been supplied for this recording.</p>
      )}
      {project.videoTranscript && (
        <details className="story-disclosure">
          <summary>Read transcript ({project.videoTranscript.language})</summary>
          <div lang={project.videoTranscript.language}>
            {project.videoTranscript.paragraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
function Screenshot({ image, full = false }: { image: ProjectScreenshot; full?: boolean }) {
  return (
    <img
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      srcSet={image.srcSet}
      sizes={full ? "95vw" : (image.sizes ?? "(max-width: 767px) 90vw, 42vw")}
      loading="lazy"
      decoding="async"
    />
  );
}
export function ScreenshotGallery({ screenshots }: { screenshots: ProjectScreenshot[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const modal = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const current = index === null ? null : screenshots[index];
  const move = (delta: number) =>
    setIndex((previous) =>
      previous === null ? null : Math.max(0, Math.min(screenshots.length - 1, previous + delta)),
    );
  if (!screenshots.length)
    return (
      <div className="story-empty">
        <h3>Product captures not supplied</h3>
        <p>No illustrative industrial image is being presented as a product screenshot.</p>
      </div>
    );
  return (
    <>
      <div className="story-screenshots">
        {screenshots.map((image, i) => (
          <figure key={image.id}>
            <button
              type="button"
              onClick={(event) => {
                trigger.current = event.currentTarget;
                setIndex(i);
                modal.current?.showModal();
              }}
              aria-label={`Enlarge screenshot ${i + 1}: ${image.alt}`}
            >
              <Screenshot image={image} />
              <span>Enlarge ↗</span>
            </button>
            <figcaption>{image.caption}</figcaption>
          </figure>
        ))}
      </div>
      <AccessibleModal
        ref={modal}
        className="story-lightbox"
        aria-labelledby="screenshot-viewer-title"
        onClose={() => {
          setIndex(null);
          trigger.current?.focus();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            move(event.key === "ArrowRight" ? 1 : -1);
          }
        }}
      >
        <div className="story-lightbox-controls">
          <h3 id="screenshot-viewer-title">Screenshot viewer</h3>
          <button autoFocus type="button" onClick={() => modal.current?.close()}>
            Close ×
          </button>
        </div>
        {current && (
          <figure>
            <Screenshot image={current} full />
            <figcaption aria-live="polite">
              {index! + 1} / {screenshots.length} · {current.caption}
            </figcaption>
          </figure>
        )}
        <div className="story-lightbox-controls">
          <button type="button" disabled={index === 0} onClick={() => move(-1)}>
            ← Previous screenshot
          </button>
          <button type="button" disabled={index === screenshots.length - 1} onClick={() => move(1)}>
            Next screenshot →
          </button>
        </div>
      </AccessibleModal>
    </>
  );
}
