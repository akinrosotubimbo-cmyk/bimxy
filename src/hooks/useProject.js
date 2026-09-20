import { useEffect, useState } from "react";
import {
  getPublishedProjectBySlug,
  getPublishedProjects,
} from "../services/projects.js";

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

export function useProject(slug) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadProject() {
      try {
        setLoading(true);
        setError("");

        const data = await getPublishedProjectBySlug(slug);

        if (mounted) {
          setProject(data);
        }
      } catch (error) {
        console.error("Failed to load project:", error);

        if (mounted) {
          setProject(null);
          setError("Could not load this project.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProject();

    return () => {
      mounted = false;
    };
  }, [slug]);

  return {
    project,
    loading,
    error,
  };
}