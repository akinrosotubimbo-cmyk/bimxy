/*
  ADD A PROJECT = ADD AN OBJECT HERE.

  type:        "app" | "website"
  icon:        URL or /public path (e.g. "/icons/notely.png"). Leave null for a letter tile.
  screenshots: array of image URLs or /public paths. Leave [] for placeholders.
  links:       any of appStore, playStore, live, github. Missing ones are hidden.
  featured:    true = shown in the "Featured" section on the home page.
*/
export const projects = [
  {
    slug: "notely",
    name: "Notely",
    type: "app",
    category: "Productivity",
    tagline: "Fast notes that sync across your devices.",
    description:
      "Notely is a note-taking app with offline support, tags and instant search. Replace this text with what the app does, who it is for, and one thing you are proud of.",
    icon: null,
    screenshots: [],
    tech: ["React Native", "Firebase", "RevenueCat"],
    links: { appStore: "https://apps.apple.com/", playStore: "https://play.google.com/store" },
    featured: true,

  },
  {
    slug: "fitpulse",
    name: "FitPulse",
    type: "app",
    category: "Health & Fitness",
    tagline: "Interval timers for workouts that need to be exact.",
    description:
      "FitPulse runs HIIT and Tabata timers with audio cues and workout history. Replace this with your own description.",
    icon: null,
    screenshots: [],
    tech: ["Swift", "SwiftUI", "StoreKit 2"],
    links: { appStore: "https://apps.apple.com/" },
    featured: true,
  },
  {
    slug: "brightside-studio",
    name: "Brightside Studio",
    type: "website",
    category: "Client website",
    tagline: "Marketing site for a photography studio.",
    description:
      "A fast, responsive site with a portfolio gallery and a booking form. Replace this with what you built and what result it had for the client.",
    icon: null,
    screenshots: [],
    tech: ["React", "Tailwind CSS", "Vercel"],
    links: { live: "https://example.com", github: "https://github.com/" },
    featured: true,
  },
  {
    slug: "budgetly",
    name: "Budgetly",
    type: "app",
    category: "Finance",
    tagline: "Track spending without connecting a bank account.",
    description: "Replace this with your own description.",
    icon: null,
    screenshots: [],
    tech: ["Flutter", "SQLite"],
    links: { playStore: "https://play.google.com/store" },
    featured: false,
  },
  {
    slug: "devlinks",
    name: "DevLinks",
    type: "website",
    category: "Web app",
    tagline: "One page for all of a developer's links.",
    description: "Replace this with your own description.",
    icon: null,
    screenshots: [],
    tech: ["React", "Node.js", "PostgreSQL"],
    links: { live: "https://example.com", github: "https://github.com/" },
    featured: false,
  },
  {
    slug: "quickconvert",
    name: "QuickConvert",
    type: "app",
    category: "Utilities",
    tagline: "Unit and currency converter that works offline.",
    description: "Replace this with your own description.",
    icon: null,
    screenshots: [],
    tech: ["React Native"],
    links: { appStore: "https://apps.apple.com/", playStore: "https://play.google.com/store" },
    featured: false,
  },
    {
    slug: "block-rush",
    name: "Block Rush",
    type: "game",
    category: "Arcade",
    tagline: "A fast one-thumb puzzle game.",
    description: "Replace this with your own description.",
    icon: null,
    screenshots: [],
    tech: ["Unity"],
    links: { appStore: "https://apps.apple.com/" },
    featured: false,
  },
];

export const getProject = (slug) => projects.find((p) => p.slug === slug);