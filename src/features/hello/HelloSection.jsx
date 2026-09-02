import React from "react";
import ChessGame from "../chess/ChessGame";
import "./styles/HelloSection.css";

const HelloSection = () => (
  <div className="hello-section">
    <div className="hello-content">
      <div className="hello-text">
        <h1 className="hello-title">
          Hi all. I'm{" "}
          <span className="hello-name">Bahir Yasreb Seemab</span>
        </h1>
        <h2 className="hello-role">&gt; Full-stack Engineer</h2>
        <div className="hello-info">
          <p>// Beat me at chess if you're curious</p>
          <p>// Find my profile on Github:</p>
          <p>
            <span className="hello-const">const</span>{" "}
            <span className="hello-var">githubLink</span>
            <span className="hello-equals"> = </span>
            <a
              href="https://github.com/BahirYasrebSeemab"
              className="hello-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              "https://github.com/BahirYasrebSeemab"
            </a>
          </p>
        </div>
      </div>
      <div className="hello-game">
        <ChessGame />
      </div>
    </div>
  </div>
);

export default HelloSection;
