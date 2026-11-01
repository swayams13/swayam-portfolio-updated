import { Link } from "@tanstack/react-router";
import { useRef } from "react";

const items = [
  ["work", "Selected work"],
  ["industries", "Industries"],
  ["services", "Capabilities"],
  ["about", "About"],
  ["approach", "Approach"],
] as const;

export function Nav() {
  const menu = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const close = () => menu.current?.close();
  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <nav className="shell nav-inner" aria-label="Primary">
        <Link to="/" className="wordmark" aria-label="Swayam Singh — home">
          <span className="monogram" aria-hidden="true">
            S<span>.</span>
          </span>
          <span>
            Swayam Singh<span className="wordmark-sub">Independent consultant</span>
          </span>
        </Link>
        <ul className="desktop-nav">
          {items.map(([id, label]) => (
            <li key={id}>
              <a href={`/#${id}`}>{label}</a>
            </li>
          ))}
        </ul>
        <div className="nav-actions">
          <a href="/#contact" className="nav-contact">
            Discuss Your Project <span aria-hidden="true">↗</span>
          </a>
          <button
            ref={trigger}
            className="menu-trigger"
            type="button"
            aria-haspopup="dialog"
            aria-controls="mobile-menu"
            onClick={() => menu.current?.showModal()}
          >
            Menu <span aria-hidden="true">＋</span>
          </button>
        </div>
      </nav>
      <dialog
        ref={menu}
        id="mobile-menu"
        className="mobile-menu"
        aria-labelledby="menu-title"
        onClose={() => trigger.current?.focus()}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <div className="menu-heading">
          <p id="menu-title" className="label">
            Explore the portfolio
          </p>
          <button type="button" onClick={close} autoFocus aria-label="Close navigation">
            Close ×
          </button>
        </div>
        <nav aria-label="Mobile">
          <ul>
            {items.map(([id, label], i) => (
              <li key={id}>
                <a href={`/#${id}`} onClick={close}>
                  <span className="label">0{i + 1}</span>
                  {label}
                  <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
          <a className="button button-light" href="/#contact" onClick={close}>
            Discuss Your Project ↗
          </a>
        </nav>
      </dialog>
    </header>
  );
}
