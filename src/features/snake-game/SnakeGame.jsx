import React, { useState, useRef, useEffect } from "react";
import "./styles/SnakeGame.css";

const SnakeGame = () => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState("ready");
  const [score, setScore] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const CANVAS_WIDTH = 300;
  const CANVAS_HEIGHT = 320;
  const GRID_SIZE = 20;

  const snakeRef = useRef([{ x: 6, y: 6 }]);
  const directionRef = useRef({ x: 1, y: 0 });
  const nextDirectionRef = useRef({ x: 1, y: 0 });
  const foodRef = useRef({ x: 10, y: 10 });
  const touchStartRef = useRef({ x: 0, y: 0 });

  const generateFood = () => {
    const maxX = Math.floor(CANVAS_WIDTH / GRID_SIZE);
    const maxY = Math.floor(CANVAS_HEIGHT / GRID_SIZE);

    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * maxX),
        y: Math.floor(Math.random() * maxY),
      };
    } while (
      snakeRef.current.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y,
      )
    );

    return newFood;
  };

  const drawGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "rgba(10, 22, 40, 0.95)";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    snakeRef.current.forEach((segment, index) => {
      if (index === 0) {
        ctx.fillStyle = "#8ecbef";
      } else {
        ctx.fillStyle = "#4a6fa5";
      }
      ctx.fillRect(
        segment.x * GRID_SIZE,
        segment.y * GRID_SIZE,
        GRID_SIZE - 2,
        GRID_SIZE - 2,
      );
    });

    ctx.fillStyle = "#f2f8ff";
    ctx.fillRect(
      foodRef.current.x * GRID_SIZE,
      foodRef.current.y * GRID_SIZE,
      GRID_SIZE - 2,
      GRID_SIZE - 2,
    );
  };

  const checkCollision = (head) => {
    if (
      head.x < 0 ||
      head.x >= CANVAS_WIDTH / GRID_SIZE ||
      head.y < 0 ||
      head.y >= CANVAS_HEIGHT / GRID_SIZE
    ) {
      return true;
    }

    for (let i = 1; i < snakeRef.current.length; i++) {
      if (
        snakeRef.current[i].x === head.x &&
        snakeRef.current[i].y === head.y
      ) {
        return true;
      }
    }

    return false;
  };

  const updateGame = () => {
    directionRef.current = nextDirectionRef.current;

    const head = {
      x: snakeRef.current[0].x + directionRef.current.x,
      y: snakeRef.current[0].y + directionRef.current.y,
    };

    if (checkCollision(head)) {
      setGameState("gameOver");
      return;
    }

    const newSnake = [head, ...snakeRef.current];

    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
      setScore((prev) => prev + 10);
      foodRef.current = generateFood();
    } else {
      newSnake.pop();
    }

    snakeRef.current = newSnake;
    drawGame();
  };

  const resetGame = () => {
    snakeRef.current = [{ x: 6, y: 6 }];
    directionRef.current = { x: 1, y: 0 };
    nextDirectionRef.current = { x: 1, y: 0 };
    foodRef.current = generateFood();
    setScore(0);
    setGameState("ready");
    drawGame();
  };

  const handleKeyPress = (e) => {
    if (gameState === "ready" && e.code === "Space") {
      e.preventDefault();
      setGameState("playing");
      return;
    }

    if (gameState === "gameOver" && e.code === "Space") {
      e.preventDefault();
      resetGame();
      return;
    }

    if (gameState !== "playing") return;

    const { x, y } = directionRef.current;

    switch (e.code) {
      case "ArrowUp":
        e.preventDefault();
        if (y !== 1) nextDirectionRef.current = { x: 0, y: -1 };
        break;
      case "ArrowDown":
        e.preventDefault();
        if (y !== -1) nextDirectionRef.current = { x: 0, y: 1 };
        break;
      case "ArrowLeft":
        e.preventDefault();
        if (x !== 1) nextDirectionRef.current = { x: -1, y: 0 };
        break;
      case "ArrowRight":
        e.preventDefault();
        if (x !== -1) nextDirectionRef.current = { x: 1, y: 0 };
        break;
      default:
        break;
    }
  };

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 768;
      setIsMobile(isTouchDevice || isSmallScreen);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Touch controls for mobile
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e) => {
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    
    if (Math.max(absX, absY) > 30) { // Minimum swipe distance
      if (absX > absY) {
        // Horizontal swipe
        handleDirection(deltaX > 0 ? 'right' : 'left');
      } else {
        // Vertical swipe
        handleDirection(deltaY > 0 ? 'down' : 'up');
      }
    }
  };

  const handleDirection = (direction) => {
    if (gameState !== "playing") return;

    const { x, y } = directionRef.current;

    switch (direction) {
      case "up":
        if (y !== 1) nextDirectionRef.current = { x: 0, y: -1 };
        break;
      case "down":
        if (y !== -1) nextDirectionRef.current = { x: 0, y: 1 };
        break;
      case "left":
        if (x !== 1) nextDirectionRef.current = { x: -1, y: 0 };
        break;
      case "right":
        if (x !== -1) nextDirectionRef.current = { x: 1, y: 0 };
        break;
      default:
        break;
    }
  };

  const handleStartGame = () => {
    if (gameState === "ready") {
      setGameState("playing");
    } else if (gameState === "gameOver") {
      resetGame();
    }
  };

  useEffect(() => {
    drawGame();
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  useEffect(() => {
    if (gameState !== "playing") return;

    const interval = setInterval(() => {
      updateGame();
    }, 150);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState]);

  return (
    <div className="snake-game-container">
      <div className="snake-game-header">
        <div className="snake-game-score">Score: {score}</div>
        <div className="snake-game-status">
          {gameState === "ready" && (isMobile ? "Tap Start" : "Press SPACE")}
          {gameState === "playing" && "Playing..."}
          {gameState === "gameOver" && "Game Over!"}
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="snake-game-canvas"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      />
      
      {/* Mobile Controls */}
      {isMobile && (
        <div className="snake-mobile-controls">
          <button 
            className="snake-start-button"
            onClick={handleStartGame}
          >
            {gameState === "ready" ? "START" : gameState === "gameOver" ? "RESTART" : "PLAYING"}
          </button>
          <div className="snake-dpad">
            <button 
              className="snake-btn snake-btn-up" 
              onClick={() => handleDirection('up')}
            >
              ▲
            </button>
            <div className="snake-dpad-middle">
              <button 
                className="snake-btn snake-btn-left" 
                onClick={() => handleDirection('left')}
              >
                ◀
              </button>
              <button 
                className="snake-btn snake-btn-right" 
                onClick={() => handleDirection('right')}
              >
                ▶
              </button>
            </div>
            <button 
              className="snake-btn snake-btn-down" 
              onClick={() => handleDirection('down')}
            >
              ▼
            </button>
          </div>
        </div>
      )}
      
      <div className="snake-game-controls">
        {isMobile ? (
          <div>Swipe on canvas or use buttons below</div>
        ) : (
          <div>↑ ↓ ← → arrows | SPACE start</div>
        )}
      </div>
    </div>
  );
};

export default SnakeGame;
