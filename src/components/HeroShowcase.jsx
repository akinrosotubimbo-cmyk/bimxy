import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function HeroShowcase({ projects }) {
  const screenshots = useMemo(() => {
    return projects.flatMap((project) =>
      (project.screenshots ?? []).map((src) => ({
        src,
        name: project.name,
      }))
    );
  }, [projects]);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (screenshots.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % screenshots.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [screenshots.length]);

  useEffect(() => {
    if (index >= screenshots.length) {
      setIndex(0);
    }
  }, [index, screenshots.length]);

  if (screenshots.length === 0) {
    return null;
  }

  const current = screenshots[index];

  return (
    <div className="relative mx-auto mt-12 h-[420px] w-full max-w-sm md:mt-0 md:h-[520px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${current.src}-${index}`}
          initial={{
            opacity: 0,
            y: 35,
            scale: 0.9,
            rotate: index % 2 === 0 ? -5 : 5,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            rotate: 0,
          }}
          exit={{
            opacity: 0,
            y: -30,
            scale: 0.94,
            rotate: index % 2 === 0 ? 4 : -4,
          }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="relative max-h-full overflow-hidden rounded-[2rem] border border-line bg-card p-2 shadow-2xl">
            <img
              src={current.src}
              alt={`${current.name} screenshot`}
              className="max-h-[480px] w-auto max-w-full rounded-[1.5rem] object-contain"
              loading="eager"
            />

            <div className="absolute bottom-5 left-5 rounded-full border border-white/10 bg-black/70 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md">
              {current.name}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}