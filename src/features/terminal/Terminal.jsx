import { useEffect, useRef, useState } from "react";
import { runCommand, formatPath } from "./commands";

const PROMPT_USER = "guest@bahir";

const TOKEN_REGEX =
  /(\/\/.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b\d+(?:\.\d+)?\b)|(\b(?:const|let|var|function|return|if|else|for|while|new|class|import|from|export|default|of|in|typeof|null|undefined|true|false|this)\b)/gm;

function highlightLine(line) {
  const tokens = [];
  let lastIndex = 0;

  for (const match of line.matchAll(TOKEN_REGEX)) {
    if (match.index > lastIndex) {
      tokens.push({ text: line.slice(lastIndex, match.index), type: "plain" });
    }
    const [full, comment, string, number, keyword] = match;
    let type = "plain";
    if (comment) type = "comment";
    else if (string) type = "string";
    else if (number) type = "number";
    else if (keyword) type = "keyword";
    tokens.push({ text: full, type });
    lastIndex = match.index + full.length;
  }
  if (lastIndex < line.length) {
    tokens.push({ text: line.slice(lastIndex), type: "plain" });
  }
  return tokens.length ? tokens : [{ text: line, type: "plain" }];
}

const Terminal = ({ onNavigate }) => {
  const [cwd, setCwd] = useState([]);
  const [log, setLog] = useState([
    { type: "output", lines: ["type 'help' or '--help' to see what you can do here."] },
  ]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [log]);

  const submit = (raw) => {
    const command = raw.trim();
    const promptLine = `${PROMPT_USER}:${formatPath(cwd)}$ ${raw}`;

    if (!command) {
      setLog((prev) => [...prev, { type: "input", lines: [promptLine] }]);
      return;
    }

    const result = runCommand(command, { cwd, setCwd });
    setHistory((prev) => [...prev, command]);
    setHistoryIndex(null);

    if (result.clear) {
      setLog([]);
      return;
    }

    setLog((prev) => [
      ...prev,
      { type: "input", lines: [promptLine] },
      { type: result.error ? "error" : "output", lines: result.output || [], isCode: result.isCode },
    ]);

    if (result.navigateAfter) {
      setTimeout(() => onNavigate?.(result.navigateAfter), 500);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      submit(value);
      setValue("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!history.length) return;
      const nextIndex = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setValue(history[nextIndex]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === null) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= history.length) {
        setHistoryIndex(null);
        setValue("");
      } else {
        setHistoryIndex(nextIndex);
        setValue(history[nextIndex]);
      }
    }
  };

  return (
    <div className="terminal-shell" onClick={() => inputRef.current?.focus()}>
      <div className="terminal-output" ref={scrollRef}>
        {log.map((entry, i) => (
          <div key={i} className={`terminal-line terminal-line-${entry.type}`}>
            {entry.lines.map((line, j) =>
              entry.isCode ? (
                <div key={j} className="terminal-code-line">
                  {highlightLine(line).map((token, k) => (
                    <span key={k} className={`code-token code-token-${token.type}`}>
                      {token.text}
                    </span>
                  ))}
                </div>
              ) : (
                <div key={j}>{line}</div>
              ),
            )}
          </div>
        ))}
      </div>
      <div className="terminal-input-row">
        <span className="terminal-prompt">
          {PROMPT_USER}:{formatPath(cwd)}$
        </span>
        <input
          ref={inputRef}
          className="terminal-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
      </div>
    </div>
  );
};

export default Terminal;
