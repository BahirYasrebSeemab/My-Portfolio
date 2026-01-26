import React, { useState } from "react";
import "./App.css";
import AnimatedBackground from "./shared/components/AnimatedBackground";
import TopBar from "./shared/components/TopBar";
import HelloSection from "./features/hello/HelloSection";
import AboutSection from "./features/about/AboutSection";
import ProjectsSection from "./features/projects/ProjectsSection";
import ContactSection from "./features/contact/ContactSection";

function App() {
  const [activeSection, setActiveSection] = useState("hello");

  return (
    <div className="app-container">
      <AnimatedBackground />
      <TopBar activeSection={activeSection} setActiveSection={setActiveSection} />
      
      {activeSection === "hello" && <HelloSection />}
      {activeSection === "about-me" && <AboutSection />}
      {activeSection === "projects" && <ProjectsSection />}
      {activeSection === "contact-me" && <ContactSection />}
    </div>
  );
}

export default App;
