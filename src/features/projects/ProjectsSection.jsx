import React, { useState } from "react";
import "./styles/ProjectsSection.css";

const ProjectsSection = () => {
  const [selectedFilters, setSelectedFilters] = useState([]);

  const filters = [
    { id: "react", label: "React", color: "#61dafb" },
    { id: "node", label: "Node.js", color: "#68a063" },
    { id: "javascript", label: "JavaScript", color: "#f7df1e" },
    { id: "typescript", label: "TypeScript", color: "#5666fdff" },
    { id: "tailwind", label: "Tailwind CSS", color: "#38bdf8" },
    { id: "supabase", label: "Supabase", color: "#3ecf8e" },
    { id: "react-native", label: "React Native", color: "#61dafb" },
    { id: "expo", label: "Expo", color: "#000020" },
    { id: "redux-toolkit", label: "Redux Toolkit", color: "#764abc" },
    { id: "tanstack-query", label: "TanStack Query", color: "#ff6347" },
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
              <span style={{ color: filter.color }}>{filter.label}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="projects-content">
        <h2 className="projects-header">// my-projects</h2>
        <p className="projects-description">
          Here are some of my featured projects
        </p>
        <div className="projects-grid">
          {projects
            .filter(
              (p) =>
                selectedFilters.length === 0 ||
                selectedFilters.some((f) => p.technologies.includes(f)),
            )
            .map((project) => (
              <div key={project.id} className="project-card">
                <div className="project-icon">📱</div>
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <div className="project-tags">
                  {project.technologies.map((tech) => {
                    const filter = filters.find((f) => f.id === tech);
                    return (
                      <span
                        key={tech}
                        className="project-tag"
                        style={{
                          border: `1px solid ${filter?.color}`,
                          color: filter?.color,
                        }}
                      >
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
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsSection;
