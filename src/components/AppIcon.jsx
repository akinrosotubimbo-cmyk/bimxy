const tints = ["#3547F5", "#FF6B4A", "#12A594", "#8E4EC6", "#E5484D", "#0090FF"];

function tintFor(name) {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return tints[h % tints.length];
}

// Shows the project icon, or a coloured letter tile if none is set.
export default function AppIcon({ project, size = 64, className = "" }) {
  const style = { width: size, height: size, borderRadius: size * 0.225 };

  if (project.icon) {
    return (
      <img
        src={project.icon}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        style={style}
        className={`shrink-0 object-cover ${className}`}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      style={{ ...style, background: tintFor(project.name) }}
      className={`grid shrink-0 place-items-center font-display font-extrabold text-white ${className}`}
    >
      <span style={{ fontSize: size * 0.42 }}>{project.name[0]}</span>
    </div>
  );
}