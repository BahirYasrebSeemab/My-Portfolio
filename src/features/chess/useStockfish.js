import { useCallback, useRef } from "react";

// Served as a static asset (not bundled) so Vite never needs to know about
// it — see public/stockfish/. The "lite single-threaded" build specifically
// needs no COOP/COEP cross-origin-isolation headers, unlike the
// multi-threaded builds, so it works on any static host.
const ENGINE_PATH = "/stockfish/stockfish-18-lite-single.js";

// UCI_Elo's own supported floor — capped this low on purpose so the engine
// is genuinely beatable, not just shallow-searched (which tends to play
// erratically rather than convincingly "weak").
const ENGINE_ELO = 1320;
const MOVE_TIME_MS = 800;

function parseUciMove(uci) {
  if (!uci || uci === "(none)") return null;
  return {
    from: uci.slice(0, 2),
    to: uci.slice(2, 4),
    promotion: uci.length > 4 ? uci.slice(4, 5) : undefined,
  };
}

export function useStockfish() {
  const workerRef = useRef(null);
  const readyRef = useRef(null);

  const ensureEngine = useCallback(() => {
    if (readyRef.current) return readyRef.current;

    readyRef.current = new Promise((resolve, reject) => {
      const worker = new Worker(ENGINE_PATH);
      workerRef.current = worker;

      let stage = "uci";

      worker.onerror = (err) => {
        reject(err);
      };

      worker.onmessage = (event) => {
        const line = typeof event.data === "string" ? event.data : "";
        if (stage === "uci" && line === "uciok") {
          worker.postMessage("setoption name UCI_LimitStrength value true");
          worker.postMessage(`setoption name UCI_Elo value ${ENGINE_ELO}`);
          worker.postMessage("isready");
          stage = "isready";
        } else if (stage === "isready" && line === "readyok") {
          stage = "ready";
          resolve(worker);
        }
      };

      worker.postMessage("uci");
    });

    return readyRef.current;
  }, []);

  // Only ever called once per turn, awaited before the next call, so a
  // single ad-hoc "message" listener per call is safe — no need for a
  // request queue.
  const getBestMove = useCallback(
    async (fen) => {
      const worker = await ensureEngine();

      return new Promise((resolve) => {
        const handleMessage = (event) => {
          const line = typeof event.data === "string" ? event.data : "";
          if (line.startsWith("bestmove")) {
            worker.removeEventListener("message", handleMessage);
            resolve(parseUciMove(line.split(" ")[1]));
          }
        };
        worker.addEventListener("message", handleMessage);
        worker.postMessage(`position fen ${fen}`);
        worker.postMessage(`go movetime ${MOVE_TIME_MS}`);
      });
    },
    [ensureEngine],
  );

  const terminate = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
    readyRef.current = null;
  }, []);

  return { getBestMove, terminate };
}
