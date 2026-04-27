import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RefreshCcw, Play } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 2;
const MIN_SPEED = 60;

type Point = { x: number; y: number };

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  
  // Game state refs for the loop
  const snakeRef = useRef<Point[]>([{ x: 10, y: 10 }]);
  const foodRef = useRef<Point>({ x: 5, y: 5 });
  const directionRef = useRef<Point>({ x: 1, y: 0 });
  const nextDirectionRef = useRef<Point>({ x: 1, y: 0 });
  const speedRef = useRef(INITIAL_SPEED);
  const lastUpdateRef = useRef(0);
  const animationFrameRef = useRef<number>(0);

  const generateFood = useCallback((snake: Point[]): Point => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food is on snake
      const onSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    snakeRef.current = [{ x: 10, y: 10 }];
    directionRef.current = { x: 1, y: 0 };
    nextDirectionRef.current = { x: 1, y: 0 };
    foodRef.current = generateFood(snakeRef.current);
    speedRef.current = INITIAL_SPEED;
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
  };

  const gameLoop = (timestamp: number) => {
    if (isPaused || isGameOver) return;

    if (timestamp - lastUpdateRef.current > speedRef.current) {
      lastUpdateRef.current = timestamp;
      
      const snake = [...snakeRef.current];
      const direction = nextDirectionRef.current;
      directionRef.current = direction;

      const newHead = {
        x: (snake[0].x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (snake[0].y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Collision check (self)
      if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        if (score > highScore) setHighScore(score);
        return;
      }

      snake.unshift(newHead);

      // Food check
      if (newHead.x === foodRef.current.x && newHead.y === foodRef.current.y) {
        setScore(prev => prev + 10);
        foodRef.current = generateFood(snake);
        speedRef.current = Math.max(MIN_SPEED, INITIAL_SPEED - (score / 10) * SPEED_INCREMENT);
      } else {
        snake.pop();
      }

      snakeRef.current = snake;
    }

    draw();
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear board
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines (subtle)
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

    // Draw snake
    snakeRef.current.forEach((segment, index) => {
      const isHead = index === 0;
      ctx.fillStyle = isHead ? '#39ff14' : 'rgba(57, 255, 20, 0.6)';
      ctx.shadowBlur = isHead ? 15 : 5;
      ctx.shadowColor = '#39ff14';
      
      // Draw rounded rectangle for snake
      const x = segment.x * cellSize + 2;
      const y = segment.y * cellSize + 2;
      const size = cellSize - 4;
      
      ctx.beginPath();
      ctx.roundRect(x, y, size, size, 4);
      ctx.fill();
    });

    // Draw food
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#ff00ff';
    const fx = foodRef.current.x * cellSize + cellSize / 2;
    const fy = foodRef.current.y * cellSize + cellSize / 2;
    ctx.beginPath();
    ctx.arc(fx, fy, (cellSize / 2) - 4, 0, Math.PI * 2);
    ctx.fill();

    // Reset shadow
    ctx.shadowBlur = 0;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
          if (currentDir.y === 0) nextDirectionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
          if (currentDir.y === 0) nextDirectionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
          if (currentDir.x === 0) nextDirectionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
          if (currentDir.x === 0) nextDirectionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPaused, isGameOver, score]);

  return (
    <div className="flex flex-col items-center justify-center p-4 h-full relative">
      <div className="flex justify-between w-full max-w-[500px] mb-4 font-mono">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-widest opacity-50">Score</span>
          <span className="text-2xl font-bold text-neon-green neon-glow-green">{score}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-xs uppercase tracking-widest opacity-50">High Score</span>
          <span className="text-2xl font-bold text-neon-cyan neon-glow-cyan">{highScore}</span>
        </div>
      </div>

      <div className="relative group border-2 border-white/5 rounded-xl overflow-hidden neon-border-cyan shadow-2xl">
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="max-w-full aspect-square bg-black shadow-[0_0_50px_-12px_rgba(0,255,255,0.3)]"
        />

        <AnimatePresence>
          {isPaused && !isGameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center"
            >
              <h2 className="text-4xl font-bold mb-8 uppercase tracking-widest text-neon-cyan neon-glow-cyan">Neon Snake</h2>
              <button
                onClick={() => setIsPaused(false)}
                className="group flex items-center gap-3 px-8 py-3 rounded-full bg-neon-cyan text-black font-bold uppercase tracking-widest hover:scale-105 transition-transform"
              >
                <Play className="w-6 h-6 fill-black" />
                Start Protocol
              </button>
              <p className="mt-8 text-xs opacity-50 font-mono">Use Arrow Keys to Navigate</p>
            </motion.div>
          )}

          {isGameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center"
            >
              <h2 className="text-4xl font-bold mb-2 uppercase tracking-widest text-red-500 neon-glow-pink">System Failure</h2>
              <p className="text-xl font-mono text-white/50 mb-8 tracking-widest">Final Score: {score}</p>
              <button
                onClick={resetGame}
                className="group flex items-center gap-3 px-8 py-3 rounded-full border-2 border-neon-pink text-neon-pink font-bold uppercase tracking-widest hover:bg-neon-pink hover:text-black transition-all"
              >
                <RefreshCcw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" />
                Reboot System
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 flex gap-4">
        <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse shadow-[0_0_8px_#00ffff]" />
        <div className="w-2 h-2 rounded-full bg-neon-pink animate-pulse delay-75 shadow-[0_0_8px_#ff00ff]" />
        <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse delay-150 shadow-[0_0_8px_#39ff14]" />
      </div>
    </div>
  );
}
