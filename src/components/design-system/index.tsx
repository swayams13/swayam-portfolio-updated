import { forwardRef, type ComponentProps, type ReactNode } from "react";
import type { Status } from "@/lib/content";

const cx = (...values: (string | undefined)[]) => values.filter(Boolean).join(" ");
export function Container({ className, ...props }: ComponentProps<"div">) {
  return <div className={cx("ds-container", className)} {...props} />;
}
export function Section({
  tone = "light",
  className,
  ...props
}: ComponentProps<"section"> & { tone?: "light" | "dark" | "warm" }) {
  return (
    <section
      className={cx(`ds-section ds-tone-${tone}`, tone === "dark" ? "dark" : undefined, className)}
      {...props}
    />
  );
}
export function EditorialHeading({
  as: Tag = "h2",
  className,
  ...props
}: ComponentProps<"h2"> & { as?: "h1" | "h2" | "h3" }) {
  return <Tag className={cx("ds-editorial", className)} {...props} />;
}
export function SectionHeading({
  eyebrow,
  title,
  children,
  as = "h2",
}: {
  as?: "h1" | "h2" | "h3";
  eyebrow?: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="ds-section-heading">
      <div>
        {eyebrow && <p className="ds-eyebrow">{eyebrow}</p>}
        <EditorialHeading as={as}>{title}</EditorialHeading>
      </div>
      {children && <div className="ds-heading-description">{children}</div>}
    </div>
  );
}
type ActionProps =
  (ComponentProps<"button"> & { href?: undefined }) | (ComponentProps<"a"> & { href: string });
function Action(props: ActionProps & { variant: "primary" | "secondary" }) {
  const { variant, className, ...rest } = props;
  const classes = cx(`ds-button ds-button-${variant}`, className);
  if ("href" in rest && rest.href !== undefined)
    return <a {...(rest as ComponentProps<"a">)} className={classes} />;
  return <button type="button" {...(rest as ComponentProps<"button">)} className={classes} />;
}
export function PrimaryButton(props: ActionProps) {
  return <Action {...props} variant="primary" />;
}
export function SecondaryButton(props: ActionProps) {
  return <Action {...props} variant="secondary" />;
}
export function IndustryBadge({ children }: { children: ReactNode }) {
  return <span className="ds-badge">{children}</span>;
}
export function ProjectStatusBadge({
  status,
  label,
  className,
}: {
  status: Status[];
  label?: string | undefined;
  className?: string;
}) {
  return (
    <span className={cx("ds-badge ds-status", className)}>
      <span aria-hidden="true" />
      {label ?? status.join(" / ")}
    </span>
  );
}
export function ProjectCardShell({ className, ...props }: ComponentProps<"article">) {
  return <article className={cx("ds-project-card", className)} {...props} />;
}
export function CopperDivider() {
  return <hr className="ds-copper-divider" />;
}
export function LightDarkSectionTransition({
  direction = "to-dark",
}: {
  direction?: "to-dark" | "to-light";
}) {
  return <div aria-hidden="true" className={`ds-transition ds-transition-${direction}`} />;
}
/** Native showModal() supplies focus containment, Escape and inert background. */
export const AccessibleModal = forwardRef<HTMLDialogElement, ComponentProps<"dialog">>(
  function AccessibleModal({ className, onClick, ...props }, ref) {
    return (
      <dialog
        ref={ref}
        className={cx("ds-modal", className)}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented && event.target === event.currentTarget)
            event.currentTarget.close();
        }}
        {...props}
      />
    );
  },
);
export function Footer() {
  return (
    <footer className="site-footer ds-footer">
      <a className="wordmark" href="/#top">
        Swayam Singh<span className="accent">.</span>
      </a>
      <p className="label">Industry → Intelligence</p>
      <a className="text-link" href="#top">
        Back to top ↑
      </a>
    </footer>
  );
}
