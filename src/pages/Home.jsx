import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { profile } from "../data/profile.js";
import { useProjects } from "../hooks/useProjects.js";
import IconMarquee from "../components/IconMarquee.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import AppIcon from "../components/AppIcon.jsx";
import StoreButtons from "../components/StoreButtons.jsx";
import BuyApps from "../components/BuyApps.jsx";
import HeroShowcase from "../components/HeroShowcase.jsx";

const filters = [
  { id: "all", label: "All" },
  { id: "app", label: "Apps" },
  { id: "website", label: "Websites" },
  { id: "game", label: "Games" },
];

function ProjectCarousel({ projects }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (projects.length <= 1) return;

    const timer = setInterval(() => {
      setDirection(1);

      setIndex((current) => (current + 1) % projects.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [projects.length]);

  useEffect(() => {
    if (index >= projects.length) {
      setIndex(0);
    }
  }, [projects.length, index]);

  if (projects.length === 0) {
    return null;
  }

  const project = projects[index];
  const screenshots = project.screenshots ?? [];
  const visibleScreenshots = screenshots.slice(0, 3);

  function nextProject() {
    setDirection(1);
    setIndex((current) => (current + 1) % projects.length);
  }

  function previousProject() {
    setDirection(-1);
    setIndex(
      (current) => (current - 1 + projects.length) % projects.length
    );
  }

  return (
    <section className="bg-black py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        {/* SECTION HEADER */}
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">
              Flagship products
            </p>
          </div>

          {/* ARROWS */}
          {projects.length > 1 && (
            <div className="hidden gap-3 sm:flex">
              <button
                type="button"
                onClick={previousProject}
                aria-label="Previous project"
                className="grid h-12 w-12 place-items-center rounded-full border border-white/15 text-white transition-colors hover:border-white/40 hover:bg-white/10"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>

              <button
                type="button"
                onClick={nextProject}
                aria-label="Next project"
                className="grid h-12 w-12 place-items-center rounded-full border border-white/15 text-white transition-colors hover:border-white/40 hover:bg-white/10"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* CAROUSEL */}
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#171717]">
          <AnimatePresence
            initial={false}
            custom={direction}
            mode="wait"
          >
            <motion.div
              key={project.slug}
              initial={{
                opacity: 0,
                x: direction > 0 ? 100 : -100,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                x: direction > 0 ? -100 : 100,
              }}
              transition={{
                duration: 0.7,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="grid min-h-[620px] items-center gap-10 px-7 py-12 md:px-14 md:py-16 lg:min-h-[650px] lg:grid-cols-[0.95fr_1.05fr] lg:gap-8"
            >
              {/* LEFT CONTENT */}
              <div className="relative z-10">
                <div className="flex items-center gap-4">
                  <AppIcon project={project} size={68} />

                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
                      {project.category}
                    </p>

                    <p className="mt-1 text-sm text-white/40">
                      {project.type === "app"
                        ? "App"
                        : project.type === "game"
                          ? "Game"
                          : "Website"}
                    </p>
                  </div>
                </div>

                <h3 className="mt-8 max-w-2xl font-display text-5xl font-extrabold leading-[0.92] tracking-[-0.04em] text-white md:text-6xl lg:text-7xl">
                  {project.name}
                </h3>

                <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/55 md:text-xl">
                  {project.description || project.tagline}
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <StoreButtons links={project.links} />

                  <Link
                    to={`/projects/${project.slug}`}
                    className="rounded-full border border-white/15 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/40 hover:bg-white/5"
                  >
                    Learn more
                  </Link>
                </div>

                {/* MOBILE ARROWS */}
                {projects.length > 1 && (
                  <div className="mt-8 flex gap-3 sm:hidden">
                    <button
                      type="button"
                      onClick={previousProject}
                      aria-label="Previous project"
                      className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white"
                    >
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={nextProject}
                      aria-label="Next project"
                      className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-white"
                    >
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* RIGHT SCREENSHOTS */}
              <div className="relative flex min-h-[360px] items-center justify-center lg:min-h-[500px]">
                {visibleScreenshots.length === 0 ? (
                  <div className="flex h-72 w-72 items-center justify-center rounded-[2rem] border border-white/10 bg-black">
                    <AppIcon project={project} size={120} />
                  </div>
                ) : project.type === "website" ? (
                  <div className="relative w-full max-w-2xl">
                    <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-black shadow-2xl">
                      <img
                        src={visibleScreenshots[0]}
                        alt={`${project.name} screenshot`}
                        className="h-auto w-full object-cover"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="relative h-[400px] w-full max-w-xl md:h-[500px]">
                    {visibleScreenshots.map((src, shotIndex) => {
                      const layouts = [
                        {
                          left: "2%",
                          top: "18%",
                          rotate: -9,
                          zIndex: 1,
                        },
                        {
                          left: "50%",
                          top: "2%",
                          rotate: 0,
                          zIndex: 3,
                        },
                        {
                          right: "2%",
                          top: "18%",
                          rotate: 9,
                          zIndex: 1,
                        },
                      ];

                      const layout = layouts[shotIndex];

                      return (
                        <motion.div
                          key={`${src}-${shotIndex}`}
                          className="absolute w-[42%] max-w-[230px] overflow-hidden rounded-[2rem] border-[5px] border-[#292929] bg-black shadow-2xl"
                          style={{
                            left: layout.left,
                            right: layout.right,
                            top: layout.top,
                            zIndex: layout.zIndex,
                          }}
                          animate={{
                            rotate: layout.rotate,
                          }}
                        >
                          <img
                            src={src}
                            alt={`${project.name} screenshot ${
                              shotIndex + 1
                            }`}
                            className="block h-auto w-full object-cover"
                            loading="lazy"
                          />
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* PROGRESS */}
          {projects.length > 1 && (
            <div className="absolute bottom-5 left-7 right-7 flex items-center gap-3 md:left-14 md:right-14">
              <div className="h-px flex-1 bg-white/10">
                <motion.div
                  key={`${project.slug}-progress`}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    duration: 6,
                    ease: "linear",
                  }}
                  className="h-full bg-white"
                />
              </div>

              <span className="text-xs font-semibold text-white/35">
                {String(index + 1).padStart(2, "0")} /{" "}
                {String(projects.length).padStart(2, "0")}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [filter, setFilter] = useState("all");

  const { projects, loading } = useProjects();

  const shown = projects.filter(
    (p) => filter === "all" || p.type === filter
  );

  const count = (type) =>
    projects.filter((p) => p.type === type).length;

  return (
    <>
      {/* HERO */}
      <section className="mx-auto max-w-6xl px-5 pb-10 pt-16 md:pt-24">
        <div className="grid items-center gap-12 md:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)] md:gap-16">
          <div>
            <p className="mb-5 text-sm font-medium text-accent">
              {profile.role}
            </p>

            <h1 className="max-w-4xl font-display text-5xl font-extrabold leading-[1.02] tracking-tight md:text-7xl">
              {profile.headline}
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              {profile.intro}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/#work"
                className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink"
              >
                Explore Apps
              </Link>

              <Link
                to="/#contact"
                className="rounded-full border border-ink/20 px-6 py-3 text-sm font-semibold transition-colors hover:border-brand hover:text-accent"
              >
                Get in touch
              </Link>
            </div>

            <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-6">
              {[
                [projects.length, "Projects"],
                [count("app"), "Apps"],
                [count("website"), "Websites"],
                [count("game"), "Games"],
              ].map(([n, label]) => (
                <div key={label}>
                  <dd className="font-display text-4xl font-extrabold text-accent">
                    {n}
                  </dd>

                  <dt className="text-sm text-muted">
                    {label}
                  </dt>
                </div>
              ))}
            </dl>
          </div>

          <HeroShowcase projects={projects} />
        </div>
      </section>

      <IconMarquee />

      {/* FLAGSHIP PROJECT CAROUSEL */}
      {!loading && projects.length > 0 && (
        <ProjectCarousel projects={projects} />
      )}

      {/* ALL WORK */}
      <section
        id="work"
        className="mx-auto max-w-6xl px-5 py-20"
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">
            Portfolio Library
          </h2>

          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label="Filter projects"
          >
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={filter === f.id}
                onClick={() => setFilter(f.id)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                  filter === f.id
                    ? "border-ink bg-ink text-white"
                    : "border-line bg-card text-muted hover:border-brand hover:text-accent"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="mt-10">
            <p className="text-muted">Loading projects...</p>
          </div>
        ) : (
          <>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((p) => (
                <ProjectCard
                  key={p.slug}
                  project={p}
                />
              ))}
            </div>

            {shown.length === 0 && (
              <p className="mt-10 text-muted">
                Nothing here yet.
              </p>
            )}
          </>
        )}
      </section>

      {/* SERVICES */}
      <section
        id="services"
        className="border-y border-line bg-card"
      >
        <div className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">
            What I build
          </h2>

          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {profile.services.map((s) => (
              <div key={s.title}>
                <h3 className="font-display text-xl font-bold">
                  {s.title}
                </h3>

                <p className="mt-2 leading-relaxed text-muted">
                  {s.text}
                </p>

                <ul className="mt-4 flex flex-wrap gap-2">
                  {s.tags.map((t) => (
                    <li
                      key={t}
                      className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-accent"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <BuyApps />

      {/* CONTACT */}
      <section
        id="contact"
        className="mx-auto max-w-6xl px-5 py-24"
      >
        <h2 className="max-w-3xl font-display text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
          Have a project in mind?
        </h2>

        <p className="mt-5 max-w-lg text-lg text-muted">
          Send me a short note about what you want to build and when you need it.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="mailto:bimxyp@gmail.com"
            className="inline-block break-all rounded-full bg-brand px-7 py-3.5 text-base font-semibold text-white transition-colors hover:bg-ink"
          >
            bimxyp@gmail.com
          </a>

          <a
            href="tel:+2348143563255"
            className="inline-block rounded-full border border-line px-7 py-3.5 text-base font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
          >
            +234 814 356 3255
          </a>
        </div>
      </section>
    </>
  );
}