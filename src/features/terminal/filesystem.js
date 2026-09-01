import daisySource from "./daisyRenderer.js?raw";

// Kept in sync by hand with the real project cards in ProjectsSection.jsx —
// this is intentionally decoupled from that component rather than importing
// it, since a page component and a virtual filesystem entry aren't the same
// thing.
const projects = [
  {
    name: "Karevan",
    description:
      "A full-stack fintech web application built with React and Supabase, featuring user authentication, real-time chats with optimistic UI updates, and a sleek, responsive design.",
    stack: ["React", "Supabase", "TypeScript", "TanStack Query", "Tailwind CSS"],
    demo: "https://roaming-karevan.vercel.app/",
    github: "https://github.com/Fa1tinthesky/Karevan",
  },
  {
    name: "Spotlight",
    description:
      "A mobile-first platform bridging physical and digital fashion — brands publish drops, buyers get a digital twin of their purchase to tag, display, and share. Built with React Native and Expo.",
    stack: ["React Native", "TypeScript", "Expo", "Supabase", "Redux Toolkit", "TanStack Query"],
    demo: null,
    github: "https://github.com/yourusername/Spotlight",
  },
  {
    name: "WorkStill",
    description:
      "AI-assisted workflow builder demo that converts natural-language intents into editable automation steps, with real-time validation and JSON output.",
    stack: ["React", "JavaScript", "Tailwind CSS"],
    demo: "https://work-still.vercel.app",
    github: "https://github.com/BAHIR22447/WorkStill.git",
  },
];

function projectReadme(project) {
  return [
    `# ${project.name}`,
    "",
    project.description,
    "",
    `stack: ${project.stack.join(", ")}`,
    project.demo ? `demo: ${project.demo}` : "demo: coming soon",
    `github: ${project.github}`,
  ].join("\n");
}

function buildProjectsChildren() {
  const children = {};
  projects.forEach((project) => {
    children[project.name] = {
      type: "dir",
      children: {
        "README.md": { type: "file", content: projectReadme(project) },
      },
    };
  });
  return children;
}

export const filesystem = {
  type: "dir",
  children: {
    "about-me": {
      type: "dir",
      navigateTo: "about-me",
      children: {},
    },
    projects: {
      type: "dir",
      navigateTo: "projects",
      children: buildProjectsChildren(),
    },
    hobbies: {
      type: "dir",
      navigateTo: "hobbies",
      children: {},
    },
    "contact-me": {
      type: "dir",
      navigateTo: "contact-me",
      children: {},
    },
    flower: {
      type: "dir",
      children: {
        "flower.js": { type: "file", content: daisySource },
      },
    },
  },
};
