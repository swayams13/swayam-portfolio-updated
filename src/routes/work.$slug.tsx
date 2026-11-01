import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ProjectEvidencePanel } from "@/components/site/ProjectEvidence";
import { projects, projectEvidence } from "@/lib/content";
import { Nav } from "@/components/site/Nav";
import { StatusTag } from "@/components/site/work/shared";

export const Route = createFileRoute("/work/$slug")({
  loader: ({ params }) => {
    const project = projects.find((p) => p.slug === params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.project.title} — Swayam Singh` },
          { name: "description", content: loaderData.project.summary },
          { property: "og:title", content: loaderData.project.title },
          { property: "og:description", content: loaderData.project.summary },
          { property: "og:type", content: "article" },
          { name: "twitter:card", content: "summary_large_image" },
        ]
      : [{ title: "Project not found" }, { name: "robots", content: "noindex" }],
  }),
  component: CaseStudy,
});

function Block({
  n,
  title,
  id,
  children,
}: {
  n: string;
  title: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 grid grid-cols-12 gap-6 border-t border-border py-16">
      <h2 className="label col-span-12 text-copper md:col-span-3">
        {n} — {title}
      </h2>
      <div className="col-span-12 md:col-span-8">{children}</div>
    </section>
  );
}

function CaseStudy() {
  const { project: p } = Route.useLoaderData();
  const related = projects.filter((x) => x.slug !== p.slug && x.tier === p.tier).slice(0, 2);
  return (
    <div id="top">
      <Nav />
      <main id="main-content">
        <header className="case-hero dark">
          <div className="shell">
            <Link to="/" hash="work" className="text-link">
              ← Selected systems
            </Link>
            <div className="flex flex-wrap items-center gap-4">
              <span className="label text-muted-foreground">{p.industry}</span>
              <StatusTag status={p.status} label={p.statusLabel} />
            </div>
            <h1>{p.title}</h1>
            <p className="lead">{p.summary}</p>
          </div>
        </header>
        <div className="shell case-body">
          <Block n="01" title="Project context">
            <p className="text-lg leading-relaxed">{p.statusNote}</p>
            <p className="caption mt-4">
              Public project brief. Client identities and confidential operating information are
              omitted. No quantified outcomes are asserted here.
            </p>
          </Block>
          <Block n="02" title="Business problem">
            <p className="text-lg leading-relaxed">{p.problem}</p>
          </Block>
          <Block n="03" title="Solution approach" id="workflow">
            <p className="text-lg leading-relaxed">{p.approach}</p>
            <ol className="mt-8 flex flex-wrap gap-3">
              {p.flow.map((s, i) => (
                <li key={s} className="label border border-border px-3 py-2">
                  {i + 1}. {s}
                </li>
              ))}
            </ol>
          </Block>
          <Block n="04" title="What you can inspect" id="demo">
            {p.media.video ? (
              <video
                src={p.media.video}
                controls
                preload="none"
                aria-label={`${p.title} walkthrough`}
              />
            ) : p.media.screenshots?.length ? (
              <div>
                {p.media.screenshots.map((src, i) => (
                  <img
                    key={src}
                    src={src}
                    alt={`${p.title} product view ${i + 1}`}
                    loading="lazy"
                    width={1600}
                    height={1000}
                  />
                ))}
              </div>
            ) : projectEvidence[p.slug] ? (
              <ProjectEvidencePanel project={p} />
            ) : (
              <div className="case-evidence">
                <p>{p.statusNote}</p>
                <p className="caption">
                  Product screenshots and recordings have not been supplied. Any sample interface
                  shown in this portfolio is illustrative.
                </p>
                {p.tier === "flagship" && (
                  <Link to="/" hash={p.slug} className="text-link">
                    Explore the illustrative workflow ↗
                  </Link>
                )}
              </div>
            )}
          </Block>
          {p.tier === "flagship" && (
            <div className="case-demo-link">
              <Link to="/" hash={`${p.slug}-demo`} className="text-link">
                Open the interactive portfolio sample ↗
              </Link>
              <p className="caption">
                Uses illustrative data and stays separate from product implementation claims.
              </p>
            </div>
          )}
          <Block n="05" title="Capability scope">
            <ul className="divide-y divide-border border-y border-border">
              {p.features.map((f) => (
                <li
                  key={f.name}
                  className="grid grid-cols-1 gap-2 py-4 sm:grid-cols-[1fr_auto] sm:gap-6"
                >
                  <span>{f.name}</span>
                  <span className="label text-muted-foreground">{f.state}</span>
                </li>
              ))}
            </ul>
          </Block>
          <Block n="06" title="Architecture outline" id="architecture">
            <p className="caption">
              Conceptual layers from the project brief. This outline is not a verified inventory of
              deployed services or implemented integrations.
            </p>
            <div>
              <ol className="mt-6 flex flex-wrap items-center gap-3">
                {p.architecture.map((a, i) => (
                  <li key={a} className="flex items-center gap-3 font-mono text-sm">
                    <span className="border border-border px-3 py-2">{a}</span>
                    {i < p.architecture.length - 1 && <span className="text-copper">→</span>}
                  </li>
                ))}
              </ol>
            </div>
          </Block>
          <Block n="07" title="Status">
            <p className="display text-4xl">{p.statusLabel ?? p.status.join(" / ")}</p>
            <p className="mt-3 text-muted-foreground">
              {p.statusNote} No outcome metrics are shown until verified.
            </p>
          </Block>
          <Block n="08" title="Related">
            <div className="grid gap-6 sm:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to="/work/$slug"
                  params={{ slug: r.slug }}
                  className="border-t border-foreground pt-4 hover:text-copper"
                >
                  <span className="label text-muted-foreground">
                    {r.number} · {r.industry}
                  </span>
                  <p className="display mt-2 text-3xl">{r.title}</p>
                </Link>
              ))}
            </div>
          </Block>
          <section className="border-t border-border py-16 text-center">
            <h2 className="display text-4xl sm:text-6xl">Have a similar challenge?</h2>
            <a href="/#contact" className="button mt-8">
              Discuss Your Project ↗
            </a>
          </section>
        </div>
      </main>
    </div>
  );
}
