import React, { useLayoutEffect, useRef, useState } from "react";
import "./styles/ProjectsSection.css";

const GAP = 20;
const MOBILE_BREAKPOINT = 700;

const filters = [
  { id: "react", label: "React" },
  { id: "node", label: "Node.js" },
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
  { id: "tailwind", label: "Tailwind CSS" },
  { id: "supabase", label: "Supabase" },
  { id: "react-native", label: "React Native" },
  { id: "expo", label: "Expo" },
  { id: "redux-toolkit", label: "Redux Toolkit" },
  { id: "tanstack-query", label: "TanStack Query" },
];

const projects = [
  {
    id: 1,
    title: "Karevan",
    description:
      "A full-stack fintech web application built with React, and Supabase, featuring user authentication, real-time chats, with optimistic UI updates, and a sleek, responsive design.",
    technologies: ["react", "supabase", "typescript", "tanstack-query", "tailwind"],
    github:
      "https://github.com/Fa1tinthesky/Karevan/commit/13c34bbbc39e2c78af62f711ad7a07ce849f01c9",
    demo: "https://roaming-karevan.vercel.app/",
  },
  {
    id: 2,
    title: "Spotlight",
    description:
      "A mobile-first platform bridging physical and digital fashion — brands publish drops, buyers receive a digital twin of their purchase to tag, display, and share across their profile and posts. Built with React Native and Expo, featuring real-time sync, offline support, and a content feed architecture inspired by modern streaming platforms.",
    technologies: [
      "react-native",
      "typescript",
      "expo",
      "supabase",
      "redux-toolkit",
      "tanstack-query",
    ],
    github: "https://github.com/yourusername/Spotlight",
    demo: null, // Coming soon
  },
  {
    id: 3,
    title: "WorkStill",
    description:
      "AI-assisted workflow builder demo that converts natural-language intents into editable automation steps, with real-time validation, JSON output, and responsive design.",
    technologies: ["react", "javascript", "tailwind"],
    github: "https://github.com/BAHIR22447/WorkStill.git",
    demo: "https://work-still.vercel.app",
  },
];

function ProjectCard({ project }) {
  return (
    <>
      <h3 className="project-title">{project.title}</h3>
      <p className="project-description">{project.description}</p>
      <div className="project-tags">
        {project.technologies.map((tech) => {
          const filter = filters.find((f) => f.id === tech);
          return (
            <span key={tech} className="project-tag">
              {filter?.label}
            </span>
          );
        })}
      </div>
      <div className="project-actions">
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="project-btn project-btn-secondary"
        >
          View Code
        </a>
        <a
          href={project.demo}
          target="_blank"
          rel="noopener noreferrer"
          className="project-btn project-btn-primary"
        >
          Live Demo
        </a>
      </div>
    </>
  );
}

const ProjectsSection = () => {
  const [selectedFilters, setSelectedFilters] = useState([]);
  const containerRef = useRef(null);
  const measureRefs = useRef({});
  const [columns, setColumns] = useState([]);
  const [containerWidth, setContainerWidth] = useState(0);

  const visibleProjects = projects.filter(
    (p) => selectedFilters.length === 0 || selectedFilters.some((f) => p.technologies.includes(f)),
  );

  // Track the container's real width first, separately from measuring
  // cards — the measuring pass below needs to render at the *correct*
  // target column width before it reads heights, otherwise the very first
  // measurement (before any width is known) would happen at the wrong
  // width and misjudge every wrap.
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const update = () => setContainerWidth(container.clientWidth);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const columnCount = containerWidth && containerWidth < MOBILE_BREAKPOINT ? 1 : 2;
  const columnWidth = containerWidth
    ? (containerWidth - GAP * (columnCount - 1)) / columnCount
    : undefined;

  // True masonry needs real rendered heights (description length and tag
  // count both affect wrapping), so this measures every visible card once
  // it's rendered at its real column width, then greedily assigns each one
  // to whichever column is currently shortest — the same packing Pinterest
  // uses. Runs only once containerWidth is known, so the measuring pass
  // above has already re-rendered at the right width by the time this reads it.
  useLayoutEffect(() => {
    if (!containerWidth) return;

    const columnHeights = new Array(columnCount).fill(0);
    const buckets = Array.from({ length: columnCount }, () => []);

    visibleProjects.forEach((project) => {
      const el = measureRefs.current[project.id];
      const height = el ? el.offsetHeight : 0;
      let shortest = 0;
      for (let i = 1; i < columnCount; i++) {
        if (columnHeights[i] < columnHeights[shortest]) shortest = i;
      }
      buckets[shortest].push(project);
      columnHeights[shortest] += height + GAP;
    });

    setColumns(buckets);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerWidth, columnCount, selectedFilters, visibleProjects.length]);

  return (
    <div className="projects-section">
      <div className="projects-sidebar">
        <div className="projects-sidebar-title">_projects</div>
        <div className="projects-folder-header">
          <span className="projects-folder-arrow">▶</span>
          <span>📁</span>
          <span>technologies</span>
        </div>
        <div className="projects-filters">
          {filters.map((filter) => (
            <label key={filter.id} className="projects-filter">
              <input
                type="checkbox"
                checked={selectedFilters.includes(filter.id)}
                onChange={() =>
                  setSelectedFilters((prev) =>
                    prev.includes(filter.id)
                      ? prev.filter((id) => id !== filter.id)
                      : [...prev, filter.id],
                  )
                }
              />
              <span>{filter.label}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="projects-content">
        <h2 className="projects-header">// my-projects</h2>
        <p className="projects-description">Here are some of my featured projects</p>

        <div className="projects-masonry" ref={containerRef}>
          {/* Hidden measuring pass: same width a real column will have, so
              text wraps identically before we know the final placement. */}
          <div className="projects-measure" aria-hidden="true">
            {visibleProjects.map((project) => (
              <div
                key={project.id}
                ref={(el) => {
                  measureRefs.current[project.id] = el;
                }}
                className="project-card"
                style={columnWidth ? { width: `${columnWidth}px` } : undefined}
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>

          <div className="projects-columns">
            {columns.map((column, index) => (
              <div key={index} className="projects-column">
                {column.map((project) => (
                  <div key={project.id} className="project-card">
                    <ProjectCard project={project} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsSection;
