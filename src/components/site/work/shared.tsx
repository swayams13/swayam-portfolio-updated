import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import type { CapState, Project, Status } from "@/lib/content";

export function StatusTag({
  status,
  className = "",
  label,
}: {
  status: Status[];
  className?: string;
  label?: string | undefined;
}) {
  return (
    <span className={`label inline-flex items-center gap-2 ${className}`}>
      <span aria-hidden className="size-1.5 shrink-0 bg-copper" />
      {label ?? status.join(" / ")}
    </span>
  );
}

/** Number · industry · status, the one metadata line every showcase opens with. */
export function Meta({ p, className = "" }: { p: Project; className?: string }) {
  return (
    <div className={`label flex flex-wrap items-center gap-x-6 gap-y-2 ${className}`}>
      <span className="text-copper">{p.number}</span>
      <span className="text-muted-foreground">{p.industry}</span>
      <StatusTag status={p.status} label={p.statusLabel} />
    </div>
  );
}

const GROUPS: { state: CapState; title: string }[] = [
  { state: "Implemented", title: "Implemented" },
  { state: "In development", title: "In development" },
  { state: "To verify", title: "To be verified" },
  { state: "Planned", title: "Planned" },
];

/** Capabilities split by honesty state so planned work never reads as shipped. */
export function Capabilities({ p, cols = 4 }: { p: Project; cols?: 2 | 4 }) {
  const groups = GROUPS.map((g) => ({
    ...g,
    items: p.features.filter((f) => f.state === g.state),
  })).filter((g) => g.items.length);
  return (
    <div className={`grid gap-x-10 gap-y-8 sm:grid-cols-2 ${cols === 4 ? "lg:grid-cols-4" : ""}`}>
      {groups.map((g) => (
        <div key={g.state}>
          <p
            className={`label pb-3 ${g.state === "Implemented" ? "text-copper" : "text-muted-foreground"}`}
          >
            {g.title} · {g.items.length}
          </p>
          <ul className="border-t border-current/15">
            {g.items.map((f) => (
              <li
                key={f.name}
                className={`border-b border-current/15 py-2.5 text-sm ${g.state === "Implemented" ? "" : "text-muted-foreground"}`}
              >
                {f.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function Ctas({ p, className = "" }: { p: Project; className?: string }) {
  const [a, b] = p.ctas;
  return (
    <div className={`flex flex-wrap gap-x-10 gap-y-4 ${className}`}>
      <Link
        to="/work/$slug"
        params={{ slug: p.slug }}
        {...(a.hash ? { hash: a.hash } : {})}
        className="label border-b border-current pb-1.5 transition-colors hover:text-copper"
      >
        {a.label} ↗
      </Link>
      <Link
        to="/work/$slug"
        params={{ slug: p.slug }}
        {...(b.hash ? { hash: b.hash } : {})}
        className="label border-b border-current/30 pb-1.5 text-muted-foreground transition hover:border-current hover:opacity-100"
      >
        {b.label} ↗
      </Link>
    </div>
  );
}

export function Sample({
  children = "Illustrative sample data",
  className = "",
}: {
  children?: ReactNode;
  className?: string;
}) {
  return <span className={`label text-xs text-copper ${className}`}>{children}</span>;
}

/** Restrained application frame: a path line, not fake browser dots. */
export function Frame({
  path,
  children,
  className = "",
  tone = "dark",
}: {
  path: string;
  children: ReactNode;
  className?: string;
  tone?: "dark" | "light";
}) {
  const dark = tone === "dark";
  return (
    <div
      className={`overflow-hidden ${dark ? "dark bg-charcoal text-foreground" : "bg-card text-foreground"} shadow-[0_40px_80px_-40px_color-mix(in_oklab,var(--charcoal)_55%,transparent)] ${className}`}
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <span className="label text-xs text-muted-foreground">{path}</span>
        <Sample />
      </div>
      {children}
    </div>
  );
}

/** Thin horizontal stage bar used across sample UIs. */
export function Bar({ v, accent = false }: { v: number; accent?: boolean }) {
  return (
    <span className="relative block h-[3px] w-full bg-current/10">
      <span
        className={`absolute inset-y-0 left-0 ${accent ? "bg-copper" : "bg-steel"}`}
        style={{ width: `${v}%` }}
      />
    </span>
  );
}
