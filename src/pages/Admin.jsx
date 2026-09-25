import { useEffect, useMemo, useState } from "react";
import { signOut } from "firebase/auth";
import {
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { auth, storage } from "../firebase.js";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from "../services/projects.js";

const emptyForm = {
  name: "",
  slug: "",
  type: "app",
  category: "",
  tagline: "",
  description: "",
  icon: "",
  screenshots: "",
  tech: "",
  appStore: "",
  playStore: "",
  live: "",
  github: "",
  featured: false,
  published: true,
  forSale: false,
};

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formFromProject(project) {
  return {
    name: project.name ?? "",
    slug: project.slug ?? "",
    type: project.type ?? "app",
    category: project.category ?? "",
    tagline: project.tagline ?? "",
    description: project.description ?? "",
    icon: project.icon ?? "",
    screenshots: (project.screenshots ?? []).join("\n"),
    tech: (project.tech ?? []).join(", "),
    appStore: project.links?.appStore ?? "",
    playStore: project.links?.playStore ?? "",
    live: project.links?.live ?? "",
    github: project.links?.github ?? "",
    featured: Boolean(project.featured),
    published: project.published !== false,
    forSale: Boolean(project.forSale),
  };
}

function projectFromForm(form) {
  const links = {};

  if (form.appStore.trim()) {
    links.appStore = form.appStore.trim();
  }

  if (form.playStore.trim()) {
    links.playStore = form.playStore.trim();
  }

  if (form.live.trim()) {
    links.live = form.live.trim();
  }

  if (form.github.trim()) {
    links.github = form.github.trim();
  }

  return {
    name: form.name.trim(),
    slug: form.slug.trim() || slugify(form.name),
    type: form.type,
    category: form.category.trim(),
    tagline: form.tagline.trim(),
    description: form.description.trim(),
    icon: form.icon.trim(),
    screenshots: form.screenshots
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean),
    tech: form.tech
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    links,
    featured: form.featured,
    published: form.published,
    forSale: form.forSale,
  };
}

async function uploadProjectImage(file, projectSlug, type) {
  if (!file) return null;

  const safeName = file.name.replace(
    /[^a-zA-Z0-9.-]/g,
    "-"
  );

  const path = `projects/${projectSlug}/${type}/${Date.now()}-${safeName}`;

  const storageRef = ref(storage, path);

  await uploadBytes(storageRef, file);

  return getDownloadURL(storageRef);
}

export default function Admin() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [screenshotFiles, setScreenshotFiles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isEditing = Boolean(editingId);

  async function loadProjects() {
    try {
      setLoading(true);
      setError("");

      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      console.error(err);
      setError("Could not load projects.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      const aName = a.name?.toLowerCase() ?? "";
      const bName = b.name?.toLowerCase() ?? "";

      return aName.localeCompare(bName);
    });
  }, [projects]);

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleNameChange(value) {
    setForm((current) => ({
      ...current,
      name: value,
      slug: editingId
        ? current.slug
        : slugify(value),
    }));
  }

  function startAdding() {
    setEditingId(null);
    setForm(emptyForm);
    setScreenshotFiles([]);
    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function startEditing(project) {
    setEditingId(project.id);
    setForm(formFromProject(project));
    setScreenshotFiles([]);
    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function cancelEditing() {
    setEditingId(null);
    setForm(emptyForm);
    setScreenshotFiles([]);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const project = projectFromForm(form);

    if (!project.name) {
      setError("Project name is required.");
      return;
    }

    if (!project.slug) {
      setError("Project slug is required.");
      return;
    }

    if (!project.category) {
      setError("Category is required.");
      return;
    }

    try {
        console.log("AUTH USER:", auth.currentUser);
console.log("AUTH EMAIL:", auth.currentUser?.email);
console.log("AUTH UID:", auth.currentUser?.uid);
      setSaving(true);

      let screenshotUrls = form.screenshots
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);

      /*
       * Upload new screenshots and append them to the
       * screenshots already saved on the project.
       */
      if (screenshotFiles.length > 0) {
        const uploadedScreenshotUrls = await Promise.all(
          screenshotFiles.map((file) =>
            uploadProjectImage(
              file,
              project.slug,
              "screenshots"
            )
          )
        );

        screenshotUrls = [
          ...screenshotUrls,
          ...uploadedScreenshotUrls,
        ];
      }

      const projectToSave = {
        ...project,
        screenshots: screenshotUrls,
      };

      if (editingId) {
        await updateProject(
          editingId,
          projectToSave
        );

        setSuccess(
          "Project updated successfully."
        );
      } else {
        await createProject(projectToSave);

        setSuccess(
          "Project added successfully."
        );
      }

      setEditingId(null);
      setForm(emptyForm);
        setScreenshotFiles([]);

      await loadProjects();
   } catch (err) {
  console.error("SAVE PROJECT ERROR:", err);

  setError(
    err?.message ||
      "Could not save the project."
  );
} finally {
      setSaving(false);
    }
  }

  async function handleDelete(project) {
    const confirmed = window.confirm(
      `Delete "${project.name}"? This cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await deleteProject(project.id);

      if (editingId === project.id) {
        setEditingId(null);
        setForm(emptyForm);
            setScreenshotFiles([]);
      }

      setProjects((current) =>
        current.filter(
          (item) => item.id !== project.id
        )
      );

      setSuccess(
        `"${project.name}" was deleted.`
      );
    } catch (err) {
      console.error(err);
      setError("Could not delete the project.");
    }
  }

  async function handleLogout() {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
      setError("Could not sign out.");
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      {/* HEADER */}
      <div className="flex flex-col gap-6 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold text-accent">
            Bimxy Admin
          </p>

          <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight md:text-5xl">
            Portfolio Dashboard
          </h1>

          <p className="mt-3 max-w-xl text-muted">
            Add and manage the projects displayed on
            your portfolio.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold transition-colors hover:border-brand hover:text-accent"
        >
          Sign out
        </button>
      </div>

      {/* STATUS */}
      {(error || success) && (
        <div className="mt-6">
          {error && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-500">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-2xl border border-green-500/20 bg-green-500/10 px-5 py-4 text-sm text-green-600">
              {success}
            </div>
          )}
        </div>
      )}

      {/* PROJECT FORM */}
      <div className="mt-10 rounded-3xl border border-line bg-card p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">
              {isEditing
                ? "Edit project"
                : "Add project"}
            </h2>

            <p className="mt-1 text-sm text-muted">
              {isEditing
                ? "Update the project information below."
                : "Create a new project for your portfolio."}
            </p>
          </div>

          {isEditing && (
            <button
              type="button"
              onClick={cancelEditing}
              className="rounded-full border border-line px-4 py-2 text-sm font-semibold"
            >
              Cancel editing
            </button>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-8"
        >
          {/* BASIC INFO */}
          <div>
            <h3 className="font-display text-lg font-bold">
              Basic information
            </h3>

            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <Field label="Project name">
                <input
                  value={form.name}
                  onChange={(e) =>
                    handleNameChange(e.target.value)
                  }
                  required
                  className="admin-input"
                  placeholder="Real Ludo"
                />
              </Field>

              <Field label="Slug">
                <input
                  value={form.slug}
                  onChange={(e) =>
                    updateField(
                      "slug",
                      slugify(e.target.value)
                    )
                  }
                  required
                  className="admin-input"
                  placeholder="real-ludo"
                />
              </Field>

              <Field label="Type">
                <select
                  value={form.type}
                  onChange={(e) =>
                    updateField(
                      "type",
                      e.target.value
                    )
                  }
                  className="admin-input admin-select"
                >
                  <option value="app">
                    App
                  </option>

                  <option value="website">
                    Website
                  </option>

                  <option value="game">
                    Game
                  </option>
                </select>
              </Field>

              <Field label="Category">
                <select
                  value={form.category}
                  onChange={(e) =>
                    updateField(
                      "category",
                      e.target.value
                    )
                  }
                  required
                  className="admin-input admin-select"
                >
                  <option value="">
                    Select category
                  </option>

                  <option value="Websites">
                    Websites
                  </option>

                  <option value="App">
                    App
                  </option>

                  <option value="Gaming">
                    Gaming
                  </option>

                  <option value="Web app">
                    Web app
                  </option>

                  <option value="SaaS">
                    SaaS
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </Field>

              <div className="md:col-span-2">
                <Field label="Tagline">
                  <input
                    value={form.tagline}
                    onChange={(e) =>
                      updateField(
                        "tagline",
                        e.target.value
                      )
                    }
                    className="admin-input"
                    placeholder="A multiplayer Ludo game built for..."
                  />
                </Field>
              </div>

              <div className="md:col-span-2">
                <Field label="Description">
                  <textarea
                    value={form.description}
                    onChange={(e) =>
                      updateField(
                        "description",
                        e.target.value
                      )
                    }
                    rows={5}
                    className="admin-input resize-y"
                    placeholder="Explain what the project does..."
                  />
                </Field>
              </div>
            </div>
          </div>

          {/* MEDIA */}
          <div>
            <h3 className="font-display text-lg font-bold">
              Media
            </h3>

            <div className="mt-4 grid gap-6">
             

              {/* ICON */}
              <Field label="Icon URL">
                <input
                  type="url"
                  value={form.icon}
                  onChange={(e) =>
                    updateField("icon", e.target.value)
                  }
                  className="admin-input"
                  placeholder="https://example.com/app-icon.png"
                />

                <p className="mt-2 text-xs text-muted">
                  Paste the direct URL of the app or game icon.
                  Leave this empty for websites if you want the generated letter icon.
                </p>

                {form.icon && (
                  <div className="mt-4 flex items-center gap-4">
                    <img
                      src={form.icon}
                      alt=""
                      className="h-16 w-16 rounded-2xl object-cover"
                    />

                    <p className="min-w-0 break-all text-xs text-muted">
                      {form.icon}
                    </p>
                  </div>
                )}
              </Field>

              {/* SCREENSHOTS */}
              <Field label="Screenshots">
                <div className="rounded-2xl border border-dashed border-line bg-paper p-5">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    multiple
                    onChange={(e) => {
                      const newFiles = Array.from(
                        e.target.files ?? []
                      );

                      setScreenshotFiles((current) => [
                        ...current,
                        ...newFiles,
                      ]);

                      e.target.value = "";
                    }}
                    className="block w-full text-sm text-muted file:mr-4 file:rounded-full file:border-0 file:bg-brand file:px-5 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-ink"
                  />

                  <p className="mt-3 text-xs text-muted">
                    Select multiple screenshots at once.
                    You can also add more screenshots later.
                  </p>

                {screenshotFiles.length > 0 && (
  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
    {screenshotFiles.map((file, index) => (
      <div
        key={`${file.name}-${file.lastModified}-${index}`}
        className="relative overflow-hidden rounded-xl border border-line bg-card"
      >
        <img
          src={URL.createObjectURL(file)}
          alt=""
          className="aspect-[9/16] w-full object-cover"
        />

        <button
          type="button"
          onClick={() => {
            setScreenshotFiles((current) =>
              current.filter((_, i) => i !== index)
            );
          }}
          className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/70 text-lg font-bold text-white transition-colors hover:bg-red-500"
          aria-label={`Remove ${file.name}`}
        >
          ×
        </button>

        <p className="truncate px-3 py-2 text-xs text-muted">
          {file.name}
        </p>
      </div>
    ))}
  </div>
)}

                  {screenshotFiles.length ===
                    0 &&
                    form.screenshots && (
                      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
{form.screenshots && (
  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
    {form.screenshots
      .split("\n")
      .filter(Boolean)
      .map((url, index) => (
        <div
          key={`${url}-${index}`}
          className="relative overflow-hidden rounded-xl border border-line bg-card"
        >
          <img
            src={url}
            alt=""
            className="aspect-[9/16] w-full object-cover"
          />

          <button
            type="button"
            onClick={() => {
              const updatedScreenshots = form.screenshots
                .split("\n")
                .filter(Boolean)
                .filter((_, i) => i !== index)
                .join("\n");

              updateField("screenshots", updatedScreenshots);
            }}
            className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/70 text-lg font-bold text-white transition-colors hover:bg-red-500"
            aria-label={`Remove screenshot ${index + 1}`}
          >
            ×
          </button>
        </div>
      ))}
  </div>
)}
                      </div>
                    )}
                </div>
              </Field>
            </div>
          </div>

          {/* TECH */}
          <div>
            <h3 className="font-display text-lg font-bold">
              Technology
            </h3>

            <div className="mt-4">
              <Field label="Tech stack">
                <input
                  value={form.tech}
                  onChange={(e) =>
                    updateField(
                      "tech",
                      e.target.value
                    )
                  }
                  className="admin-input"
                  placeholder="React, Firebase, Capacitor"
                />

                <p className="mt-2 text-xs text-muted">
                  Separate technologies with commas.
                </p>
              </Field>
            </div>
          </div>

          {/* LINKS */}
          <div>
            <h3 className="font-display text-lg font-bold">
              Links
            </h3>

            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <Field label="App Store">
                <input
                  type="url"
                  value={form.appStore}
                  onChange={(e) =>
                    updateField(
                      "appStore",
                      e.target.value
                    )
                  }
                  className="admin-input"
                  placeholder="https://apps.apple.com/..."
                />
              </Field>

              <Field label="Google Play">
                <input
                  type="url"
                  value={form.playStore}
                  onChange={(e) =>
                    updateField(
                      "playStore",
                      e.target.value
                    )
                  }
                  className="admin-input"
                  placeholder="https://play.google.com/..."
                />
              </Field>

              <Field label="Live website">
                <input
                  type="url"
                  value={form.live}
                  onChange={(e) =>
                    updateField(
                      "live",
                      e.target.value
                    )
                  }
                  className="admin-input"
                  placeholder="https://..."
                />
              </Field>

              <Field label="GitHub">
                <input
                  type="url"
                  value={form.github}
                  onChange={(e) =>
                    updateField(
                      "github",
                      e.target.value
                    )
                  }
                  className="admin-input"
                  placeholder="https://github.com/..."
                />
              </Field>
            </div>
          </div>

          {/* SETTINGS */}
          <div>
            <h3 className="font-display text-lg font-bold">
              Visibility
            </h3>

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <Toggle
                label="Published"
                checked={form.published}
                onChange={(value) =>
                  updateField(
                    "published",
                    value
                  )
                }
              />

              <Toggle
                label="Featured"
                checked={form.featured}
                onChange={(value) =>
                  updateField(
                    "featured",
                    value
                  )
                }
              />

              <Toggle
                label="For Sale"
                checked={form.forSale}
                onChange={(value) =>
                  updateField(
                    "forSale",
                    value
                  )
                }
              />
            </div>
          </div>

          {/* SAVE */}
          <div className="flex flex-wrap gap-3 border-t border-line pt-6">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-brand px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : isEditing
                  ? "Save changes"
                  : "Add project"}
            </button>

            {isEditing && (
              <button
                type="button"
                onClick={cancelEditing}
                className="rounded-full border border-line px-7 py-3 text-sm font-semibold"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* PROJECT LIST */}
      <div className="mt-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold">
              Your projects
            </h2>

            <p className="mt-1 text-sm text-muted">
              {projects.length} project
              {projects.length === 1
                ? ""
                : "s"}{" "}
              in Firestore
            </p>
          </div>

          <button
            type="button"
            onClick={startAdding}
            className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white"
          >
            + Add project
          </button>
        </div>

        {loading ? (
          <div className="mt-6 rounded-2xl border border-line bg-card p-8 text-center text-muted">
            Loading projects...
          </div>
        ) : sortedProjects.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-line bg-card p-10 text-center">
            <p className="font-display text-xl font-bold">
              No projects yet
            </p>

            <p className="mt-2 text-sm text-muted">
              Add your first real project using the
              form above.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {sortedProjects.map((project) => (
              <article
                key={project.id}
                className="rounded-2xl border border-line bg-card p-5"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-xl font-bold">
                        {project.name}
                      </h3>

                      <StatusBadge
                        active={
                          project.published !==
                          false
                        }
                        label={
                          project.published !==
                          false
                            ? "Published"
                            : "Draft"
                        }
                      />

                      {project.featured && (
                        <StatusBadge
                          active
                          label="Featured"
                        />
                      )}

                      {project.forSale && (
                        <StatusBadge
                          active
                          label="For sale"
                        />
                      )}
                    </div>

                    <p className="mt-1 text-sm text-muted">
                      {project.type} ·{" "}
                      {project.category}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        startEditing(project)
                      }
                      className="rounded-full border border-line px-4 py-2 text-sm font-semibold hover:border-brand hover:text-accent"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(project)
                      }
                      className="rounded-full border border-red-500/20 px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-500/10"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">
        {label}
      </span>

      <div className="mt-2">
        {children}
      </div>
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-line bg-card p-4">
      <span className="text-sm font-semibold">
        {label}
      </span>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 rounded-full transition-colors ${
          checked
            ? "bg-brand"
            : "bg-ink/20"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${
            checked
              ? "translate-x-6"
              : "translate-x-1"
          }`}
        />
      </button>
    </label>
  );
}

function StatusBadge({ active, label }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
        active
          ? "bg-brand-soft text-accent"
          : "border border-line text-muted"
      }`}
    >
      {label}
    </span>
  );
}