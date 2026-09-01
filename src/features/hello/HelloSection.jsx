import React from "react";
import SnakeGame from "../snake-game/SnakeGame";
import "./styles/HelloSection.css";

const HelloSection = () => (
  <div className="hello-section">
    <div className="hello-content">
      <div className="hello-text">
        <h1 className="hello-title">
          Hi all. I'm{" "}
          <span className="hello-name">Bahir Yasreb Seemab</span>
        </h1>
        <h2 className="hello-role">&gt; Cross-platform Full-stack developer</h2>
        <div className="hello-info">
          <p>// Complete the game to continue</p>
          <p>// Find my profile on Github:</p>
          <p>
            <span className="hello-const">const</span>{" "}
            <span className="hello-var">githubLink</span>
            <span className="hello-equals"> = </span>
            <a
              href="https://github.com/bahir22447"
              className="hello-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              "https://github.com/bahir22447"
            </a>
          </p>
        </div>
      </div>
      <div className="hello-game">
        <SnakeGame />
      </div>
    </div>
  </div>
);

export default HelloSection;
