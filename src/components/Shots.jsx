// Screenshot strip. Phone-shaped for apps, browser-shaped for websites.
export default function Shots({ project }) {
  const isApp = project.type === "app";
  const list = project.screenshots?.length ? project.screenshots : [null, null, null];
  const shape = isApp ? "aspect-[9/19.5] w-44 md:w-52" : "aspect-[16/10] w-72 md:w-96";

  return (
    <div className="-mx-5 flex gap-4 overflow-x-auto px-5 pb-3">
      {list.map((src, i) => (
        <div
          key={i}
          className={`shrink-0 overflow-hidden rounded-2xl border border-line bg-brand-soft ${shape}`}
        >
          {src && (
            <img
              src={src}
              alt={`${project.name} screenshot ${i + 1}`}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          )}
        </div>
      ))}
    </div>
  );
}