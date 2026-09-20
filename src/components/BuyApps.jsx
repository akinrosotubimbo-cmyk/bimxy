import { Link } from "react-router-dom";
import { profile } from "../data/profile.js";
import { TYPES } from "../data/types.js";
import AppIcon from "./AppIcon.jsx";
import Shots from "./Shots.jsx";
import { useProjects } from "../hooks/useProjects.js";

// Edit these four to match what you really include with a sale.
const included = [
  {
    title: "Full source code",
    text: "The complete codebase, yours to keep and change.",
  },
  {
    title: "Hosted for you",
    text: "We run the backend, so there is nothing to set up.",
  },
  {
    title: "100% of revenue",
    text: "Everything it earns goes straight to your account.",
  },
  {
    title: "Your own branding",
    text: "New name, logo, colours and listing or domain.",
  },
];

export default function BuyApps() {
  const { projects, loading } = useProjects();

  if (loading) return null;

  const forSale = projects.filter((p) => p.forSale);

  if (forSale.length === 0) return null;

  return (
    <section id="buy" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="max-w-3xl font-display text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
          Buy an App, Game or Website That Already Sells
        </h2>

        <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
          Buy a project that is already live and earning, rebranded for you.
          Setup is on us, and the revenue is yours.
        </p>

        <div className="mt-12 flex flex-col gap-8">
          {forSale.map((p) => {
            const label = TYPES[p.type]?.label ?? "Project";

            const isWebsite = p.type === "website";
            const isApp = p.type === "app" || p.type === "game";

            const destination = isWebsite
              ? p.links?.live
              : isApp
                ? p.links?.appStore
                : null;

            return (
              <article
                key={p.slug}
                className="grid items-center gap-8 rounded-3xl border border-line bg-card p-6 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-12 md:p-8"
              >
                <div>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-accent">
                      For sale
                    </span>

                    <span className="rounded-full border border-line px-3 py-1 text-xs font-semibold text-muted">
                      {label}
                    </span>
                  </div>

                  <div className="mt-5 flex items-center gap-4">
                    <AppIcon project={p} size={64} />

                    <div className="min-w-0">
                      <h3 className="font-display text-2xl font-bold leading-tight">
                        {p.name}
                      </h3>

                      <p className="text-sm text-muted">
                        {p.category}
                      </p>
                    </div>
                  </div>

                  <p className="mt-5 text-lg leading-relaxed">
                    {p.tagline}
                  </p>

                  <p className="mt-2 leading-relaxed text-muted">
                    {p.description}
                  </p>

                  {p.tech?.length > 0 && (
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {p.tech.map((t) => (
                        <li
                          key={t}
                          className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-accent"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-7 border-t border-line pt-6">
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                      {destination ? (
                        <a
                          href={destination}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-paper"
                        >
                          {isWebsite
                            ? "Visit website"
                            : `Get this ${label.toLowerCase()}`}
                        </a>
                      ) : (
                        <Link
                          to="/#contact"
                          className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-paper"
                        >
                          Get in touch
                        </Link>
                      )}

                      <Link
                        to={`/projects/${p.slug}`}
                        className="text-sm font-semibold hover:text-accent"
                      >
                        View details
                      </Link>
                    </div>
                  </div>
                </div>

                <Shots project={p} />
              </article>
            );
          })}
        </div>

        <h3 className="mt-20 font-display text-2xl font-bold">
          What is included with every purchase
        </h3>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {included.map((item) => (
            <li
              key={item.title}
              className="rounded-2xl border border-line bg-card p-5"
            >
              <p className="font-display text-lg font-bold">
                {item.title}
              </p>

              <p className="mt-2 text-sm leading-relaxed text-muted">
                {item.text}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-col items-start gap-4 rounded-3xl border border-line bg-brand-soft p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display text-2xl font-bold">
              Want a project that already earns?
            </p>

            <p className="mt-1 text-muted">
              Tell me which one, and I will have it rebranded and transferred.
            </p>
          </div>

          <Link
            to="/#contact"
            className="shrink-0 rounded-full bg-white px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-accent"
          >
            Start the conversation
          </Link>
        </div>
      </div>
    </section>
  );
}