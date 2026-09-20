import AppIcon from "./AppIcon.jsx";
import { useProjects } from "../hooks/useProjects.js";

// Decorative scrolling project icon strips.
export default function IconMarquee() {
  const { projects, loading } = useProjects();

  if (loading || projects.length === 0) {
    return null;
  }

  const repeats = Math.max(1, Math.ceil(12 / projects.length));
  const items = Array.from({ length: repeats }, () => projects).flat();

  const row = (suffix) => (
    <div className="flex gap-4 pr-4">
      {items.map((p, i) => (
        <AppIcon
          key={`${suffix}-${p.slug}-${i}`}
          project={p}
          size={72}
        />
      ))}
    </div>
  );

  return (
    <div
      aria-hidden="true"
      className="overflow-hidden space-y-4 py-2"
    >
      {/* Moving left */}
      <div className="animate-marquee flex w-max">
        {row("left-a")}
        {row("left-b")}
      </div>

      {/* Moving right */}
      <div className="animate-marquee-reverse flex w-max">
        {row("right-a")}
        {row("right-b")}
      </div>
    </div>
  );
}