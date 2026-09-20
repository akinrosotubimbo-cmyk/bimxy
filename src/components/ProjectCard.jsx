import { Link } from "react-router-dom";
import { TYPES } from "../data/types.js";
import AppIcon from "./AppIcon.jsx";

export default function ProjectCard({ project }) {
  const badge = TYPES[project.type]?.label ?? "Project";

  return (
    <Link
      to={`/projects/${project.slug}`}
      className="group flex flex-col gap-4 rounded-3xl border border-line bg-card p-5 transition-colors hover:border-brand"
    >
      <div className="flex items-center gap-4">
        <AppIcon project={project} size={56} />
        <div className="min-w-0">
          <h3 className="truncate font-display text-lg font-bold leading-tight">{project.name}</h3>
          <p className="text-sm text-muted">{project.category}</p>
        </div>
        <span className="ml-auto rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-accent">
          {badge}
        </span>
      </div>
      <p className="text-sm leading-relaxed text-muted">{project.tagline}</p>
      <p className="mt-auto text-sm font-semibold text-ink group-hover:text-accent">View project</p>
    </Link>
  );
}