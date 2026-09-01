import AsciiDaisy from "./AsciiDaisy";
import Terminal from "./Terminal";
import "./styles/TerminalSection.css";

const TerminalSection = ({ setActiveSection }) => (
  <div className="terminal-section">
    <div className="terminal-window glass-panel">
      <div className="terminal-window-header">
        <span className="terminal-dot terminal-dot-1" />
        <span className="terminal-dot terminal-dot-2" />
        <span className="terminal-dot terminal-dot-3" />
        <span className="terminal-window-title">guest@bahir — terminal</span>
      </div>
      <div className="terminal-banner">
        <p>booting profile shell...</p>
        <p>something is growing below — type 'help' or '--help' to look around.</p>
      </div>
      <AsciiDaisy />
      <Terminal onNavigate={setActiveSection} />
    </div>
  </div>
);

export default TerminalSection;
