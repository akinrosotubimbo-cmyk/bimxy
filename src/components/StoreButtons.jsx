const defs = [
  { key: "appStore", label: "App Store" },
  { key: "playStore", label: "Google Play" },
  { key: "live", label: "Visit site" },
  { key: "github", label: "Source code" },
];

export default function StoreButtons({ links = {} }) {
  const shown = defs.filter((d) => links[d.key]);
  if (!shown.length) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {shown.map((d, i) => (
        <a
          key={d.key}
          href={links[d.key]}
          target="_blank"
          rel="noreferrer"
          className={
            i === 0
              ? "rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand"
              : "rounded-full border border-ink/20 px-5 py-2.5 text-sm font-semibold transition-colors hover:border-brand hover:text-accent"
          }
        >
          {d.label}
        </a>
      ))}
    </div>
  );
}