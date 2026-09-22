import { useEffect, useState } from "react";
import { getPublishedProjects } from "../services/projects.js";

let cachedProjects = null;
let projectsPromise = null;

export function useProjects() {
  const [projects, setProjects] = useState(cachedProjects ?? []);
  const [loading, setLoading] = useState(cachedProjects === null);

  useEffect(() => {
    let mounted = true;

    async function loadProjects() {
      try {
        if (!projectsPromise) {
          projectsPromise = getPublishedProjects();
        }

        const data = await projectsPromise;

        cachedProjects = data;

        if (mounted) {
          setProjects(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to load projects:", error);

        projectsPromise = null;

        if (mounted) {
          setProjects([]);
          setLoading(false);
        }
      }
    }

    loadProjects();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    projects,
    loading,
  };
}