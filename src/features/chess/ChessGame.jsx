import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { useStockfish } from "./useStockfish";
import "./styles/ChessGame.css";

const STORAGE_KEY = "chess-game-fen";
const CHESS_COM_USERNAME = "Y4sreb";

const START_FEN = new Chess().fen();

// Deliberately higher-contrast than a literal two-tone navy pairing would
// give — a checkerboard needs clear value separation to read at a glance,
// especially at the preview card's small size.
const DARK_SQUARE_STYLE = { backgroundColor: "#0c1729" };
const LIGHT_SQUARE_STYLE = { backgroundColor: "#3a5a85" };

function loadSavedFen() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function saveFen(fen) {
  try {
    localStorage.setItem(STORAGE_KEY, fen);
  } catch {
    // Private browsing / storage disabled — the game just won't persist.
  }
}

function clearSavedFen() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore — nothing to clean up if storage isn't available.
  }
}

const ChessGame = () => {
  const [hasSavedGame, setHasSavedGame] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [fen, setFen] = useState(START_FEN);
  const [status, setStatus] = useState("idle"); // idle | loading | playing | thinking | ended
  const [result, setResult] = useState(null); // "win" | "loss" | "draw" | null

  const chessRef = useRef(null);
  const engineLoadedRef = useRef(false);
  const { getBestMove, terminate } = useStockfish();

  useEffect(() => {
    const saved = loadSavedFen();
    if (!saved) return;
    const probe = new Chess();
    try {
      probe.load(saved);
      if (!probe.isGameOver()) {
        setHasSavedGame(true);
      } else {
        clearSavedFen();
      }
    } catch {
      clearSavedFen();
    }
  }, []);

  useEffect(() => terminate, [terminate]);

  const finishGame = useCallback((outcome) => {
    setResult(outcome);
    setStatus("ended");
    clearSavedFen();
    setHasSavedGame(false);
  }, []);

  const checkGameOver = useCallback(
    (chess) => {
      if (!chess.isGameOver()) return false;
      if (chess.isCheckmate()) {
        // Whoever is "to move" is the side that just got mated. Human is
        // always white, so black-to-move-and-mated means the human won.
        finishGame(chess.turn() === "b" ? "win" : "loss");
      } else {
        finishGame("draw");
      }
      return true;
    },
    [finishGame],
  );

  const requestEngineMove = useCallback(
    async (chess) => {
      setStatus(engineLoadedRef.current ? "thinking" : "loading");
      const move = await getBestMove(chess.fen());
      engineLoadedRef.current = true;
      if (!move) return;
      try {
        chess.move(move);
      } catch {
        return;
      }
      const nextFen = chess.fen();
      setFen(nextFen);
      saveFen(nextFen);
      if (!checkGameOver(chess)) {
        setStatus("playing");
      }
    },
    [getBestMove, checkGameOver],
  );

  const onPieceDrop = useCallback(
    ({ sourceSquare, targetSquare }) => {
      if (status !== "playing" || !targetSquare || !chessRef.current) return false;
      const chess = chessRef.current;
      try {
        chess.move({ from: sourceSquare, to: targetSquare, promotion: "q" });
      } catch {
        return false;
      }
      const nextFen = chess.fen();
      setFen(nextFen);
      saveFen(nextFen);
      if (!checkGameOver(chess)) {
        requestEngineMove(chess);
      }
      return true;
    },
    [status, checkGameOver, requestEngineMove],
  );

  const startFreshGame = useCallback(() => {
    const chess = new Chess();
    const saved = loadSavedFen();
    if (saved) {
      try {
        chess.load(saved);
      } catch {
        chess.reset();
      }
    }
    chessRef.current = chess;
    setFen(chess.fen());
    setResult(null);
    setStatus("playing");
    setIsOpen(true);
  }, []);

  const playAgain = useCallback(() => {
    const chess = new Chess();
    chessRef.current = chess;
    setFen(chess.fen());
    setResult(null);
    setStatus("playing");
    clearSavedFen();
    setHasSavedGame(false);
  }, []);

  const closeGame = useCallback(() => {
    const chess = chessRef.current;
    if (chess && !chess.isGameOver()) {
      setHasSavedGame(true);
    }
    setIsOpen(false);
    setStatus("idle");
    terminate();
    engineLoadedRef.current = false;
  }, [terminate]);

  const resign = useCallback(() => {
    finishGame("loss");
  }, [finishGame]);

  const boardOptions = useMemo(
    () => ({
      position: fen,
      onPieceDrop,
      boardOrientation: "white",
      darkSquareStyle: DARK_SQUARE_STYLE,
      lightSquareStyle: LIGHT_SQUARE_STYLE,
      showNotation: true,
      allowDragging: status === "playing",
    }),
    [fen, onPieceDrop, status],
  );

  if (!isOpen) {
    return (
      <div className="chess-preview">
        <div className="chess-preview-board">
          <Chessboard
            options={{
              position: START_FEN,
              allowDragging: false,
              showNotation: false,
              darkSquareStyle: DARK_SQUARE_STYLE,
              lightSquareStyle: LIGHT_SQUARE_STYLE,
            }}
          />
        </div>
        <p className="chess-preview-text">beat me and I'll hand over my real chess.com handle</p>
        <button className="chess-play-button" onClick={startFreshGame}>
          {hasSavedGame ? "RESUME" : "PLAY"}
        </button>
      </div>
    );
  }

  // Rendered via a portal straight onto <body> — .hello-game's backdrop-filter
  // would otherwise create a containing block for position:fixed and trap
  // this overlay inside the small preview panel instead of the viewport.
  return createPortal(
    <div className="chess-fullscreen">
      <div className="chess-fullscreen-header">
        <span className="chess-fullscreen-title">guest@bahir — chess</span>
        <button className="chess-close-button" onClick={closeGame}>
          ✕ close
        </button>
      </div>
      <div className="chess-fullscreen-body">
        <div className="chess-board-wrap">
          <Chessboard options={boardOptions} />
        </div>

        {status === "loading" && <p className="chess-status-text">loading engine...</p>}
        {status === "thinking" && <p className="chess-status-text">thinking...</p>}
        {status === "playing" && (
          <button className="chess-resign-button" onClick={resign}>
            resign
          </button>
        )}

        {status === "ended" && (
          <div className="chess-result-panel glass-panel">
            {result === "win" ? (
              <>
                <h3 className="chess-result-title chess-result-win">you actually won.</h3>
                <p className="chess-result-message">
                  here's the real one — go ahead and add me:
                  <br />
                  <span className="chess-username">{CHESS_COM_USERNAME}</span>
                </p>
              </>
            ) : (
              <>
                <h3 className="chess-result-title">not today.</h3>
                <p className="chess-result-message">the engine holds — run it back?</p>
              </>
            )}
            <div className="chess-result-actions">
              <button className="chess-play-button" onClick={playAgain}>
                play again
              </button>
              <button className="chess-close-button" onClick={closeGame}>
                close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default ChessGame;
