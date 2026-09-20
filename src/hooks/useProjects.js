import { useEffect, useState } from "react";
import { getPublishedProjects } from "../services/projects.js";

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadProjects() {
      try {
        const data = await getPublishedProjects();

        if (mounted) {
          setProjects(data);
        }
      } catch (error) {
        console.error("Failed to load projects:", error);

        if (mounted) {
          setProjects([]);
        }
      } finally {
        if (mounted) {
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