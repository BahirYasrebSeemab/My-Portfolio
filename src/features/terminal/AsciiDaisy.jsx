import { useEffect, useRef } from "react";
import { renderDaisyFrame } from "./daisyRenderer";

const FRAME_INTERVAL = 1000 / 18;

// Characters come only from the fixed, known-safe LUMINANCE_CHARS set in
// daisyRenderer.js — never user input — so building this string directly
// (rather than via React elements) is safe and much cheaper to update ~18x/sec.
function rowToHtml(row) {
  let html = "";
  let i = 0;
  while (i < row.length) {
    const part = row[i].part;
    let j = i;
    let chars = "";
    while (j < row.length && row[j].part === part) {
      chars += row[j].char;
      j++;
    }
    const className = part ? `daisy-${part}` : "daisy-space";
    html += `<span class="${className}">${chars}</span>`;
    i = j;
  }
  return html;
}

const AsciiDaisy = () => {
  const preRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    let raf;
    let lastFrame = 0;
    const startTime = performance.now();
    let cols = 56;
    let rows = 26;

    const measure = () => {
      const width = containerRef.current?.clientWidth || 400;
      const isSmall = width < 420;
      cols = isSmall ? 40 : 56;
      rows = isSmall ? 20 : 26;
    };
    measure();
    window.addEventListener("resize", measure);

    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      if (now - lastFrame < FRAME_INTERVAL) return;
      lastFrame = now;
      const time = (now - startTime) / 1000;
      const frame = renderDaisyFrame({ cols, rows, time });
      if (preRef.current) {
        preRef.current.innerHTML = frame.map(rowToHtml).join("\n");
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div className="ascii-daisy" ref={containerRef}>
      <pre className="ascii-daisy-pre" ref={preRef} />
    </div>
  );
};

export default AsciiDaisy;
