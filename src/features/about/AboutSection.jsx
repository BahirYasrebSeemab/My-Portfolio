import React, { useState } from "react";
import "./styles/AboutSection.css";

const AboutSection = () => {
  const [expandedItems, setExpandedItems] = useState(["personal-info"]);
  const [activeFile, setActiveFile] = useState("bio");

  const toggleExpanded = (item) => {
    setExpandedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  };

  const fileContents = {
    bio: `/**
 * About me
 * I have 5 years of experience in web development,
 * specializing in React, Node.js, and modern web technologies.
 */

const bio = {
  name: "Bahir Yasreb Seemab",
  role: "Full-stack Engineer",
  location: "Dushanbe, Tajikistan",
  experience: "5+ years",
  languages: ["JavaScript", "TypeScript", "Python"],
  frameworks: ["React", "Next.js", "FastAPI"],
  databases: ["PostgreSQL", "Redis"],
  tools: ["Git", "Docker", "Supabase", "Firebase", "Figma"]
};

export default bio;`,
    interests: `/**
 * My interests and hobbies
 */

const interests = [
  "Project Based Learning",
  "Machine Learning",
  "Flute",
  "Chess",
  "Photography",
  "Gaming",
  "Traveling"
];

// Always learning new technologies
const currentlyLearning = [
  "FastAPI",
  "GraphQL",
  "WebSockets"
];

export { interests, currentlyLearning };`,
    email: `const contactInfo = {
  email: "bahiryasreb@gmail.com",
  linkedin: "linkedin.com/in/johndoe",
  github: "github.com/BahirYasrebSeemab"
};`,
    phone: `const phoneNumber = "+992 930 550 664";

// Available for calls:
// Monday - Friday: 9 AM - 6 PM PST`,
  };

  const codeSnippets = [
    {
      title: "Petal Placement (terminal flower)",
      code: `function petalPoint(index, u, v) {
  const width = PETAL_MAX_WIDTH * Math.sin(Math.PI * u);
  let x = CENTER_RADIUS + u * PETAL_LENGTH;
  const y = v * width * 0.5;
  let z = -PETAL_BOWL * v * v + 0.15 * Math.sin(Math.PI * u);

  const tiltedX = x * Math.cos(PETAL_TILT) + z * Math.sin(PETAL_TILT);
  const tiltedZ = -x * Math.sin(PETAL_TILT) + z * Math.cos(PETAL_TILT);
  x = tiltedX;
  z = tiltedZ;

  const angle = (index / PETAL_COUNT) * Math.PI * 2;
  return {
    x: x * Math.cos(angle) - y * Math.sin(angle),
    y: x * Math.sin(angle) + y * Math.cos(angle),
    z,
    part: "petal",
  };
}`,
    },
    {
      title: "Spin & Perspective Projection",
      code: `const z = CAMERA_DISTANCE + sp.z;
if (z <= 0.1) return;
const invZ = 1 / z;

const screenX = Math.round(
  cols / 2 + PROJECTION_SCALE * cols * 0.5 * sp.x * invZ
);
const screenY = Math.round(
  rows * VERTICAL_ANCHOR - PROJECTION_SCALE * rows * 0.6 * sp.y * invZ
);

const index = screenY * cols + screenX;
if (invZ <= depth[index]) return;`,
    },
  ];

  return (
    <div className="about-section">
      <div className="about-sidebar">
        <div className="about-sidebar-title">_personal-info</div>
        {[
          {
            id: "personal-info",
            label: "personal-info",
            children: [
              { id: "bio", label: "bio" },
              { id: "interests", label: "interests" },
            ],
          },
          {
            id: "contacts",
            label: "contacts",
            children: [
              { id: "email", label: "email" },
              { id: "phone", label: "phone" },
            ],
          },
        ].map((folder) => (
          <div key={folder.id} className="about-folder">
            <div
              onClick={() => toggleExpanded(folder.id)}
              className="about-folder-header"
            >
              <span
                className="about-folder-arrow"
                style={{
                  transform: expandedItems.includes(folder.id)
                    ? "rotate(90deg)"
                    : "rotate(0)",
                }}
              >
                ▶
              </span>
              <span>📁</span>
              <span>{folder.label}</span>
            </div>
            {expandedItems.includes(folder.id) && (
              <div className="about-folder-children">
                {folder.children.map((child) => (
                  <div
                    key={child.id}
                    onClick={() => setActiveFile(child.id)}
                    className={`about-file ${activeFile === child.id ? "active" : ""}`}
                  >
                    <span>📄</span>
                    <span>{child.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="about-content">
        <div className="about-editor">
          <div className="about-editor-tab">{activeFile}.js</div>
          <pre className="about-editor-code">{fileContents[activeFile]}</pre>
        </div>
        <div className="about-snippets">
          <div className="about-snippets-title">// Code Snippets</div>
          {codeSnippets.map((snippet, index) => (
            <div key={index} className="about-snippet">
              <h4 className="about-snippet-title">{snippet.title}</h4>
              <pre className="about-snippet-code">{snippet.code}</pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
