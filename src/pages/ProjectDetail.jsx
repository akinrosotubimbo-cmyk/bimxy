import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { profile } from "../data/profile.js";
import { TYPES } from "../data/types.js";
import { useProject } from "../hooks/useProject.js";
import AppIcon from "../components/AppIcon.jsx";
import StoreButtons from "../components/StoreButtons.jsx";
import MoreProjects from "../components/MoreProjects.jsx";
import NotFound from "./NotFound.jsx";

function ProjectVisual({ project }) {
  const screenshots = project.screenshots ?? [];
  const isWebsite = project.type === "website";

  if (screenshots.length === 0) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-[2rem] border border-line bg-card">
        <AppIcon project={project} size={120} />
      </div>
    );
  }

  if (isWebsite) {
    return (
      <div className="relative mx-auto w-full max-w-2xl">
        <div className="absolute -inset-6 rounded-[3rem] bg-brand/10 blur-3xl" />

        <div className="relative overflow-hidden rounded-[2rem] border border-line bg-card p-2 shadow-2xl">
          <div className="overflow-hidden rounded-[1.5rem] bg-black">
            <img
              src={screenshots[0]}
              alt={`${project.name} website`}
              className="h-auto w-full object-cover"
            />
          </div>
        </div>
      </div>
    );
  }

  const visibleShots = screenshots.slice(0, 3);

  return (
    <div className="relative mx-auto flex h-[480px] w-full max-w-2xl items-center justify-center md:h-[600px]">
      <div className="absolute inset-10 rounded-full bg-brand/10 blur-3xl" />

      {visibleShots.map((src, index) => {
        const positions = [
          "left-[4%] top-[14%] rotate-[-9deg] md:left-[7%]",
          "left-1/2 top-[3%] -translate-x-1/2 rotate-0",
          "right-[4%] top-[14%] rotate-[9deg] md:right-[7%]",
        ];

        return (
          <div
            key={`${src}-${index}`}
            className={`absolute ${positions[index]} z-${index + 1} w-[42%] max-w-[250px] overflow-hidden rounded-[2rem] border-[5px] border-[#252525] bg-black shadow-2xl md:w-[38%]`}
          >
            <img
              src={src}
              alt={`${project.name} screenshot ${index + 1}`}
              className="h-auto w-full object-cover"
            />
          </div>
        );
      })}
    </div>
  );
}

export default function ProjectDetail() {
  const { slug } = useParams();
  const { project, loading, error } = useProject(slug);

  useEffect(() => {
    if (project) {
      document.title = `${project.name} | ${profile.name}`;
    }

    return () => {
      document.title = `${profile.name} | Apps & Websites`;
    };
  }, [project]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-5">
        <p className="text-muted">Loading project...</p>
      </div>
    );
  }

  if (error || !project) {
    return <NotFound />;
  }

  return (
    <article className="overflow-hidden">
      {/* HERO */}
      <section className="mx-auto max-w-7xl px-5 pb-20 pt-10 md:px-8 md:pb-32 md:pt-16">
        {/* BACK */}
        <Link
          to="/#work"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-ink"
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
            aria-hidden="true"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>

          Back to BimxyTech
        </Link>

        {/* HERO GRID */}
        <div className="mt-14 grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          {/* LEFT */}
          <div className="relative z-10">
            <div className="flex items-center gap-4">
              <AppIcon project={project} size={76} />

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                  {TYPES[project.type]?.long ?? "Project"}
                </p>

                <p className="mt-1 text-sm text-muted">
                  {project.category}
                </p>
              </div>
            </div>

            <h1 className="mt-8 max-w-3xl font-display text-6xl font-extrabold leading-[0.9] tracking-[-0.045em] md:text-7xl lg:text-8xl">
              {project.name}
            </h1>

            <p className="mt-8 max-w-xl text-xl leading-relaxed text-muted md:text-2xl">
              {project.tagline}
            </p>

            <div className="mt-8">
              <StoreButtons links={project.links} />
            </div>
          </div>

          {/* RIGHT VISUAL */}
          <div className="relative">
            <ProjectVisual project={project} />
          </div>
        </div>
      </section>

      {/* PROJECT INFO */}
      <section className="border-t border-line">
        <div className="mx-auto grid max-w-7xl gap-16 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              About the project
            </p>

            <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight md:text-5xl">
              Built to make an impact.
            </h2>
          </div>

          <div>
            <p className="max-w-3xl text-lg leading-relaxed text-muted md:text-xl">
              {project.description}
            </p>

            {project.tech?.length > 0 && (
              <div className="mt-10">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
                  Built with
                </p>

                <ul className="mt-4 flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-full border border-line bg-card px-4 py-2 text-sm font-semibold"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* MORE PROJECTS */}
      <section className="mx-auto max-w-7xl px-5 pb-24 md:px-8 md:pb-32">
        <MoreProjects current={project} />
      </section>
    </article>
  );
}