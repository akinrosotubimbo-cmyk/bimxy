import { Link } from "react-router-dom";
import { TYPES } from "../data/types.js";
import AppIcon from "./AppIcon.jsx";

export default function ProjectCard({ project }) {
  const badge = TYPES[project.type]?.label ?? "Project";
  const screenshots = project.screenshots ?? [];

  return (
    <Link
      to={`/projects/${project.slug}`}
      className="group block overflow-hidden rounded-3xl border border-line bg-card transition-colors hover:border-brand"
    >
      {/* Header */}
      <div className="flex items-center gap-4 p-5 pb-4">
        <AppIcon project={project} size={56} />

        <div className="min-w-0">
          <h3 className="truncate font-display text-lg font-bold leading-tight">
            {project.name}
          </h3>

          <p className="mt-1 truncate text-sm font-medium uppercase tracking-[0.12em] text-muted">
            {project.category}
          </p>
        </div>

        <span className="ml-auto shrink-0 rounded-full bg-brand-soft px-4 py-2 text-xs font-bold text-accent">
          {badge}
        </span>
      </div>

      {/* Screenshots + description */}
      <div className="grid gap-5 px-5 pb-5 md:grid-cols-[minmax(0,1.55fr)_minmax(170px,0.8fr)] md:items-start">
        {/* Screenshots */}
        {screenshots.length > 0 ? (
          <div className="flex gap-3 overflow-hidden">
            {screenshots.slice(0, 2).map((src, index) => (
              <div
                key={`${src}-${index}`}
                className="min-w-0 flex-1 overflow-hidden rounded-2xl bg-black"
              >
                <img
                  src={src}
                  alt={`${project.name} screenshot ${index + 1}`}
                  loading="lazy"
                  className="aspect-[9/16] h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex aspect-[16/9] items-center justify-center rounded-2xl bg-brand-soft">
            <AppIcon project={project} size={72} />
          </div>
        )}

        {/* Description */}
        <div className="flex min-h-full flex-col">
          <p className="text-sm leading-7 text-muted">
            {project.description || project.tagline}
          </p>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-line px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">
              {project.tagline}
            </p>
          </div>

          <span className="shrink-0 text-sm font-bold text-accent transition-transform duration-300 group-hover:translate-x-1">
            View project →
          </span>
        </div>
      </div>
    </Link>
  );
}