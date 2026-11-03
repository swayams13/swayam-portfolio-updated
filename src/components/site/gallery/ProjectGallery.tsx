import { useProjectImpression, useVideoConversion } from "@/lib/use-conversion";
import { memo, useRef, useState, useEffect, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { IndustryBadge, ProjectStatusBadge } from "@/components/design-system";
import {
  projects,
  caseStudies,
  homepageProjectPreviews,
  type Project,
  type ConsultingIndustry,
  type ConsultingIndustryId,
} from "@/lib/content";

/** Real media when supplied; an explicit typographic poster when it is missing. */
export const ProjectMedia = memo(function ProjectMedia({
  project,
  active,
}: {
  project: Project;
  active: boolean;
}) {
  const videoEvents = useVideoConversion(project.slug);
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!active) videoRef.current?.pause();
  }, [active]);
  const evidence = caseStudies.find((item) => item.slug === project.slug);
  const capture = evidence?.screenshots[0];
  const videoSource = evidence?.videoSource ?? project.media.video;
  const image = evidence?.videoPoster ?? project.media.screenshots?.[0] ?? project.media.image;
  // media.image currently contains illustrative industrial plates, not product captures.
  if (capture || project.media.screenshots?.[0])
    return (
      <figure className="exhibit-media">
        <img
          src={capture?.src ?? project.media.screenshots![0]}
          alt={capture?.alt ?? `${project.title} product screenshot`}
          srcSet={capture?.srcSet}
          sizes={capture?.sizes ?? "(max-width: 767px) 90vw, 50vw"}
          width={capture?.width ?? 1200}
          height={capture?.height ?? 800}
          loading="lazy"
          decoding="async"
        />
        <figcaption>{capture?.caption ?? "Product view"}</figcaption>
      </figure>
    );
  if (videoSource && evidence?.videoPoster)
    return (
      <figure className="exhibit-media">
        <video
          ref={videoRef}
          key={videoSource}
          {...videoEvents}
          controls={active}
          crossOrigin="anonymous"
          preload="none"
          poster={image}
          aria-label={`${project.title} walkthrough`}
          width={1200}
          height={800}
        >
          <source src={videoSource} />
          {evidence.videoCaptions.map((caption, index) => (
            <track
              key={caption.src}
              kind="captions"
              src={caption.src}
              srcLang={caption.language}
              label={caption.label}
              default={index === 0}
            />
          ))}
        </video>
        <figcaption>Project walkthrough · play on demand</figcaption>
      </figure>
    );
  return (
    <figure
      className="exhibit-media exhibit-poster"
      aria-label={`${project.title}: labeled placeholder poster, not a product screenshot`}
    >
      <div className="poster-rule" />
      <span className="poster-number">{project.number.padStart(2, "0")}</span>
      <p>{project.short ?? project.title}</p>
      <span className="poster-kind">
        {homepageProjectPreviews[project.slug]?.kind ?? "system"} / study
      </span>
      <figcaption>Product capture not supplied · concept poster</figcaption>
    </figure>
  );
});

const ExhibitionCard = memo(function ExhibitionCard({
  project,
  industry,
  industryId,
  active,
  position,
  count,
}: {
  project: Project;
  industry: string;
  industryId: ConsultingIndustryId;
  active: boolean;
  position: number;
  count: number;
}) {
  const preview = homepageProjectPreviews[project.slug];
  return (
    <div
      className="exhibit-card"
      role="group"
      aria-roledescription="slide"
      aria-label={`${position} of ${count}: ${project.title}`}
      aria-hidden={!active}
      inert={!active}
    >
      <ProjectMedia project={project} active={active} />
      <div className="exhibit-copy">
        <IndustryBadge>{industry}</IndustryBadge>
        <ProjectStatusBadge status={project.status} label={project.status.join(" / ")} />
        <h3>{project.title}</h3>
        <p>{preview?.solution ?? project.summary}</p>
        <div className="exhibit-actions">
          <Link
            to="/work/$slug"
            params={{ slug: project.slug }}
            search={{ galleryIndustry: industryId }}
            className="ds-button ds-button-secondary"
          >
            View Case Study <span aria-hidden="true">↗</span>
          </Link>
          {(caseStudies.find((item) => item.slug === project.slug)?.videoSource ??
            project.media.video) && (
            <Link
              className="text-link"
              to="/work/$slug"
              params={{ slug: project.slug }}
              search={{ galleryIndustry: industryId }}
              hash="demo"
            >
              Watch Demo ↗
            </Link>
          )}
        </div>
      </div>
    </div>
  );
});

export function ProjectGallery({
  industry,
  selectedSlug,
  onProjectChange,
}: {
  industry: ConsultingIndustry;
  selectedSlug?: string | undefined;
  onProjectChange?: ((slug: string) => void) | undefined;
}) {
  const [localIndex, setLocalIndex] = useState(0);
  const controlledIndex = industry.projectSlugs.findIndex((s) => s === selectedSlug);
  const index =
    controlledIndex >= 0 ? controlledIndex : Math.min(localIndex, industry.projectSlugs.length - 1);
  const items = industry.projectSlugs.map((slug) => projects.find((p) => p.slug === slug)!);
  const stage = useRef<HTMLDivElement>(null);
  const count = items.length;
  const project = items[index]!;
  useProjectImpression(stage, project.slug);
  const gesture = useRef<{ x: number; y: number; id: number } | null>(null);
  const move = (next: number) => {
    const value = Math.max(0, Math.min(count - 1, next));
    if (value === index) return;
    setLocalIndex(value);
    onProjectChange?.(items[value]!.slug);
  };
  return (
    <div
      id="selected-projects"
      className="project-gallery exhibition"
      role="region"
      aria-roledescription="carousel"
      aria-label={`${industry.label} selected work`}
      data-gallery-renderer="css-perspective"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
          event.preventDefault();
          move(
            event.key === "Home"
              ? 0
              : event.key === "End"
                ? count - 1
                : index + (event.key === "ArrowRight" ? 1 : -1),
          );
        }
      }}
    >
      <div className="gallery-controls">
        <p role="status" aria-live="polite" aria-atomic="true">
          {industry.label} · {index + 1} / {count} · {project.title}
        </p>
        <div>
          <button
            type="button"
            aria-label="Previous project"
            disabled={index === 0}
            onClick={() => move(index - 1)}
          >
            ←
          </button>
          <button
            type="button"
            aria-label="Next project"
            disabled={index === count - 1}
            onClick={() => move(index + 1)}
          >
            →
          </button>
        </div>
      </div>
      <div
        ref={stage}
        className="exhibit-stage"
        onPointerDown={(event) => {
          if (
            !event.isPrimary ||
            event.pointerType === "mouse" ||
            (event.target as HTMLElement).closest("a,button,video,input")
          )
            return;
          gesture.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
        }}
        onPointerCancel={() => {
          gesture.current = null;
        }}
        onPointerUp={(event) => {
          const start = gesture.current;
          gesture.current = null;
          if (!start || start.id !== event.pointerId) return;
          const dx = event.clientX - start.x;
          const dy = event.clientY - start.y;
          if (Math.abs(dx) >= 48 && Math.abs(dx) > Math.abs(dy) * 1.4)
            move(index + (dx < 0 ? 1 : -1));
        }}
      >
        {items.map((item, i) => {
          const offset = i - index;
          return (
            <div
              key={item.slug}
              className="exhibit-position"
              data-active={offset === 0}
              data-distance={Math.min(Math.abs(offset), 2)}
              style={
                {
                  "--offset": offset,
                  "--depth": Math.abs(offset),
                  "--turn": offset > 0 ? -1 : 1,
                  zIndex: count - Math.abs(offset),
                } as CSSProperties
              }
            >
              <ExhibitionCard
                project={item}
                industry={industry.label}
                industryId={industry.id}
                active={offset === 0}
                position={i + 1}
                count={count}
              />
              {Math.abs(offset) === 1 && (
                <button
                  type="button"
                  className="exhibit-neighbor"
                  tabIndex={-1}
                  aria-hidden="true"
                  onClick={() => move(i)}
                  title={`Show ${item.title}`}
                />
              )}
            </div>
          );
        })}
      </div>
      <nav className="exhibit-indicators" aria-label="Choose a project">
        {items.map((item, i) => (
          <button
            key={item.slug}
            type="button"
            aria-label={`${String(i + 1).padStart(2, "0")}: Show ${item.title}`}
            aria-current={i === index ? "true" : undefined}
            onClick={() => move(i)}
          >
            <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
            <span className="sr-only">{item.title}</span>
          </button>
        ))}
      </nav>
      <p className="gallery-honesty">
        Project briefs include development and concept work. Sector relevance does not imply a
        deployment in that industry.
      </p>
    </div>
  );
}
