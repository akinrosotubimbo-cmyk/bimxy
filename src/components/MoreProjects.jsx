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
          className="shrink-0 text-sm font-semibold text-accent hover:text-ink"
        >
          See all
        </Link>
      </div>

      <ul className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {others.map((p) => (
          <li key={p.slug}>
            <Link
              to={`/projects/${p.slug}`}
              className="flex h-full flex-col gap-3 rounded-3xl border border-line bg-card p-4 transition-colors hover:border-brand"
            >
              <AppIcon project={p} size={64} />

              <div className="min-w-0">
                <h3 className="truncate font-display text-base font-bold">
                  {p.name}
                </h3>

                <p className="truncate text-sm text-muted">
                  {p.category}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}