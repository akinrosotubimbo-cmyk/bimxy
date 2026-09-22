import { Link } from "react-router-dom";
import { profile } from "../data/profile.js";
import { TYPES } from "../data/types.js";
import AppIcon from "./AppIcon.jsx";
import { useProjects } from "../hooks/useProject.js";

export default function MoreProjects({ current }) {
  const { projects, loading } = useProjects();

  if (loading) {
    return null;
  }

  const others = projects
    .filter((p) => p.slug !== current.slug)
    .filter((p) => p.published !== false)
    .slice(0, 8);

  if (others.length === 0) {
    return null;
  }

  const plural = (
    TYPES[current.type]?.plural ??
    "Projects"
  ).toLowerCase();

  return (
    <section className="mt-20 border-t border-line pt-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold md:text-3xl">
            More from {profile.studio}
          </h2>

          <p className="mt-1 text-muted">
            Other {plural} we build
          </p>
        </div>

        <Link
          to="/#work"
          className="shrink-0 text-sm font-semibold text-accent transition-colors hover:text-ink"
        >
          See all
        </Link>
      </div>

      <ul className="mt-8 grid gap-5 md:grid-cols-2">
        {others.map((p) => {
          const screenshots = p.screenshots ?? [];

          return (
            <li key={p.slug}>
              <Link
                to={`/projects/${p.slug}`}
                className="group block overflow-hidden rounded-3xl border border-line bg-card transition-colors hover:border-brand"
              >
                {/* Header */}
                <div className="flex items-center gap-4 p-5 pb-4">
                  <AppIcon project={p} size={56} />

                  <div className="min-w-0">
                    <h3 className="truncate font-display text-lg font-bold leading-tight">
                      {p.name}
                    </h3>

                    <p className="mt-1 truncate text-sm text-muted">
                      {p.category}
                    </p>
                  </div>

                  <span className="ml-auto shrink-0 rounded-full bg-brand-soft px-3 py-1.5 text-xs font-bold text-accent">
                    {TYPES[p.type]?.label ?? "Project"}
                  </span>
                </div>

                {/* Screenshots + description */}
                <div className="grid gap-4 px-5 pb-5 sm:grid-cols-[1.35fr_1fr]">
                  {screenshots.length > 0 ? (
                    <div className="flex gap-2 overflow-hidden">
                      {screenshots.slice(0, 2).map((src, index) => (
                        <div
                          key={`${src}-${index}`}
                          className="min-w-0 flex-1 overflow-hidden rounded-2xl bg-black"
                        >
                          <img
                            src={src}
                            alt={`${p.name} screenshot ${index + 1}`}
                            loading="lazy"
                            className="aspect-[9/16] h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-brand-soft">
                      <AppIcon project={p} size={64} />
                    </div>
                  )}

                  <div>
                    <p className="text-sm leading-6 text-muted">
                      {p.description || p.tagline}
                    </p>
                  </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-line px-5 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="truncate text-sm font-semibold text-ink">
                      {p.tagline}
                    </p>

                    <span className="shrink-0 text-sm font-bold text-accent transition-transform duration-300 group-hover:translate-x-1">
                      View →
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}