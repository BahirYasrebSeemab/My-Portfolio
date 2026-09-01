import React from "react";
import "../styles/TopBar.css";

const TopBar = ({ activeSection, setActiveSection }) => {
  return (
    <div className="top-bar">
      <div className="top-bar-left">
        <div className="top-bar-logo">bahir-yasreb</div>
        {["hello", "about-me", "projects", "hobbies", "terminal"].map((tab) => (
          <div
            key={tab}
            className={`top-bar-tab ${activeSection === tab ? "active" : ""}`}
            onClick={() => setActiveSection(tab)}
          >
            _{tab}
          </div>
        ))}
      </div>
      <div
        className={`top-bar-tab top-bar-contact ${activeSection === "contact-me" ? "active" : ""}`}
        onClick={() => setActiveSection("contact-me")}
      >
        _contact-me
      </div>
    </div>
  );
};

export default TopBar;
