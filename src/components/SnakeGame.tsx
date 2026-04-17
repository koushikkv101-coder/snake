import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);

  // Random food position
  const generateFood = useCallback((currentSnake: { x: number; y: number }[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food spawned on snake
      const onSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setScore(0);
    setFood(generateFood(INITIAL_SNAKE));
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          if (!gameOver) setIsPaused(prev => !prev);
          else resetGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameOver]);

  // Game Loop
  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const newHead = {
          x: prevSnake[0].x + direction.x,
          y: prevSnake[0].y + direction.y,
        };

        // Check Wall Collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check Self Collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check Food Collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, 150);
    return () => clearInterval(intervalId);
  }, [direction, food, gameOver, isPaused, generateFood]);

  // Draw Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear Canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Grid (Subtle)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw Food
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 0;
    ctx.fillRect(
      food.x * cellSize + 2,
      food.y * cellSize + 2,
      cellSize - 4,
      cellSize - 4
    );

    // Draw Snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#00ffff' : '#009999';
      ctx.fillRect(
        segment.x * cellSize + 1,
        segment.y * cellSize + 1,
        cellSize - 2,
        cellSize - 2
      );
    });
  }, [snake, food]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  return (
    <div className="flex flex-col items-center gap-10">
      <div className="flex justify-between w-full border-b-4 border-[#ff00ff] pb-6">
        <div className="flex flex-col">
          <span className="text-[#00ffff] uppercase tracking-[0.5em] text-[10px] font-digital">DATA_GATHERED</span>
          <span 
            className="text-8xl font-digital text-[#00ffff] glitch-text"
            data-text={score.toString().padStart(4, '0')}
          >
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-gray-500 uppercase tracking-[0.5em] text-[10px] font-digital">MAX_LOAD</span>
          <span className="text-4xl font-digital text-[#ff00ff] opacity-40">{highScore.toString().padStart(4, '0')}</span>
        </div>
      </div>

      <div className="relative border-4 border-[#00ffff] p-1 bg-[#000]">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="bg-black block"
        />

        <AnimatePresence>
          {(gameOver || isPaused) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/90"
            >
              <div className="text-center p-8 border-4 border-[#ff00ff] bg-black">
                {gameOver ? (
                  <>
                    <h2 
                      className="text-6xl font-digital font-black text-white mb-4 uppercase glitch-text"
                      data-text="SYSTEM_CRASH"
                    >
                      SYSTEM_CRASH
                    </h2>
                    <p className="text-[#ff00ff] font-digital text-sm mb-8 uppercase tracking-widest leading-loose">
                      BUFFER_OVERRUN_DETECTED.<br/>
                      NEURAL_SYNC_TERMINATED.<br/>
                      FINAL_LOAD: {score}
                    </p>
                    <button
                      onClick={resetGame}
                      className="neon-btn font-bold text-xl"
                    >
                      INIT_REBOOT
                    </button>
                  </>
                ) : (
                  <>
                    <h2 
                      className="text-6xl font-digital font-black text-white mb-8 uppercase glitch-text"
                      data-text="STASIS_INTERRUPT"
                    >
                      STASIS_INTERRUPT
                    </h2>
                    <button
                      onClick={() => setIsPaused(false)}
                      className="neon-btn font-bold text-xl"
                    >
                      RESUME_EXECUTION
                    </button>
                    <p className="mt-6 text-[10px] text-gray-500 font-digital uppercase tracking-[0.4em]">
                      // PRESS_SPACE_FOR_OVERRIDE
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-2 gap-12 text-xs font-digital text-[#00ffff] uppercase tracking-[0.5em]">
        <div className="flex flex-col gap-2">
          <span className="text-gray-600 font-mono text-[8px]">COMMANDS</span>
          <div className="flex items-center gap-3">
            <span className="bg-[#00ffff] text-black px-1 font-bold">DIR</span>
            <span>ARROW_ARRAY</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-gray-600 font-mono text-[8px]">INTERRUPTS</span>
          <div className="flex items-center gap-3">
            <span className="bg-[#ff00ff] text-black px-1 font-bold">SPC</span>
            <span>OS_HALT</span>
          </div>
        </div>
      </div>
    </div>
  );
}
