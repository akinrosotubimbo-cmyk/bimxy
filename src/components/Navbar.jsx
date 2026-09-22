import { useState } from "react";
import { Link } from "react-router-dom";
import bimxyLogo from "../assets/bimxy-logo.svg";

const links = [
  { label: "Apps", to: "/#work" },
  { label: "Services", to: "/#services" },
  { label: "Buy an App", to: "/#buy" },
  { label: "Contact", to: "/#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur">
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5"
        aria-label="Main"
      >
        {/* Logo */}
        <Link to="/" onClick={close} className="flex items-center">
          <img
  src={bimxyLogo}
  alt="Bimxy"
  className="h-10 w-auto"
/>
        </Link>

        <ul className="hidden items-center gap-8 text-sm font-medium md:flex">
          {links.map((l) => (
            <li key={l.label}>
              <Link
                to={l.to}
                className="text-muted transition-colors hover:text-ink"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Link
            to="/#contact"
            className="hidden rounded-full bg-ink px-5 py-2 text-sm font-semibold transition-colors hover:bg-brand md:inline-block"
          >
            Get in touch
          </Link>

          <button
            type="button"
            className="rounded-full border border-line px-4 py-1.5 text-sm font-medium md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </nav>

      {open && (
        <ul
          id="mobile-menu"
          className="border-t border-line bg-paper px-5 py-3 md:hidden"
        >
          {links.map((l) => (
            <li key={l.label}>
              <Link
                to={l.to}
                onClick={close}
                className="block py-3 text-base font-medium"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}