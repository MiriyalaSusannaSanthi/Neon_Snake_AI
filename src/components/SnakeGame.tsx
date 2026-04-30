import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RotateCcw, Zap } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

interface SnakeGameProps {
  onScoreUpdate: (score: number) => void;
}

const GRID_SIZE = 20;
const INITIAL_SPEED = 140;
const MIN_SPEED = 50;
const SPEED_STEP = 3;

export default function SnakeGame({ onScoreUpdate }: SnakeGameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [gameState, setGameState] = useState<'IDLE' | 'PLAYING' | 'GAMEOVER'>('IDLE');
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>({ x: 0, y: -1 });
  const [nextDirection, setNextDirection] = useState<Point>({ x: 0, y: -1 });
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const requestRef = useRef<number>(null);
  const lastTimeRef = useRef<number>(0);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      if (!currentSnake.some(s => s.x === newFood.x && s.y === newFood.y)) break;
    }
    return newFood;
  }, []);

  const startGame = () => {
    setSnake([{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }]);
    setDirection({ x: 0, y: -1 });
    setNextDirection({ x: 0, y: -1 });
    const initialSnake = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
    setFood(generateFood(initialSnake));
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setGameState('PLAYING');
    onScoreUpdate(0);
  };

  const gameOver = () => {
    setGameState('GAMEOVER');
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState === 'IDLE' || gameState === 'GAMEOVER') {
        if (e.key === ' ' || e.key === 'Enter') startGame();
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
          if (direction.y !== 1) setNextDirection({ x: 0, y: -1 });
          break;
        case 'arrowdown':
        case 's':
          if (direction.y !== -1) setNextDirection({ x: 0, y: 1 });
          break;
        case 'arrowleft':
        case 'a':
          if (direction.x !== 1) setNextDirection({ x: -1, y: 0 });
          break;
        case 'arrowright':
        case 'd':
          if (direction.x !== -1) setNextDirection({ x: 1, y: 0 });
          break;
        case 'r':
          startGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameState]);

  const moveSnake = useCallback(() => {
    setSnake(prev => {
      const head = { x: prev[0].x + nextDirection.x, y: prev[0].y + nextDirection.y };
      setDirection(nextDirection);

      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        gameOver();
        return prev;
      }

      if (prev.some(s => s.x === head.x && s.y === head.y)) {
        gameOver();
        return prev;
      }

      const newSnake = [head, ...prev];

      if (head.x === food.x && head.y === food.y) {
        setScore(s => {
          const ns = s + 10;
          onScoreUpdate(ns);
          return ns;
        });
        setFood(generateFood(newSnake));
        setSpeed(sp => Math.max(MIN_SPEED, sp - SPEED_STEP));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [nextDirection, food, onScoreUpdate, generateFood]);

  const animate = useCallback((time: number) => {
    if (gameState === 'PLAYING') {
      const deltaTime = time - lastTimeRef.current;
      if (deltaTime > speed) {
        moveSnake();
        lastTimeRef.current = time;
      }
    }
    requestRef.current = requestAnimationFrame(animate);
  }, [gameState, moveSnake, speed]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [animate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        const size = Math.min(width, height) - 40;
        canvas.width = size;
        canvas.height = size;
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    resize();

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Raw Grid
      ctx.strokeStyle = 'rgba(255, 0, 255, 0.1)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0); ctx.lineTo(i * cellSize, canvas.height); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize); ctx.lineTo(canvas.width, i * cellSize); ctx.stroke();
      }

      // Pixelated Food (Magenta)
      ctx.fillStyle = '#ff00ff';
      ctx.fillRect(
        food.x * cellSize + 2, 
        food.y * cellSize + 2, 
        cellSize - 4, 
        cellSize - 4
      );

      // Pixelated Snake (Cyan)
      snake.forEach((segment, index) => {
        const isHead = index === 0;
        ctx.fillStyle = isHead ? '#00ffff' : 'rgba(0, 255, 255, 0.6)';
        ctx.fillRect(
          segment.x * cellSize + 1, 
          segment.y * cellSize + 1, 
          cellSize - 2, 
          cellSize - 2
        );
        
        // Glitch tail effect
        if (Math.random() > 0.98) {
          ctx.fillStyle = '#ff00ff';
          ctx.fillRect(segment.x * cellSize - 10, segment.y * cellSize, 5, 2);
        }
      });
    };

    draw();
  }, [snake, food]);

  return (
    <div ref={containerRef} className="flex-1 w-full h-full flex flex-col items-center justify-center p-4 relative bg-black overflow-hidden">
      <div className="relative crt-border p-2 bg-black/40">
        <canvas ref={canvasRef} className="image-pixelated" style={{ imageRendering: 'pixelated' }} />
        
        <AnimatePresence>
          {(gameState === 'IDLE' || gameState === 'GAMEOVER') && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/90 z-20 backdrop-blur-md"
            >
              <div className="text-center w-full px-12">
                {gameState === 'GAMEOVER' ? (
                  <div className="animate-noise">
                    <h2 className="text-6xl font-mono text-[#ff00ff] mb-4 text-glitch leading-none">SYSTEM_FAILURE</h2>
                    <div className="border-y border-[#ff00ff] py-4 mb-8">
                       <p className="text-[#00ffff] font-mono text-4xl mb-2">SCORE: {score}</p>
                       <p className="text-white/40 text-[10px] uppercase font-mono tracking-widest italic">Memory leak detected. Reboot required.</p>
                    </div>
                    <button 
                      onClick={startGame}
                      className="w-full py-4 border-2 border-[#ff00ff] text-[#ff00ff] hover:bg-[#ff00ff] hover:text-black transition-colors font-mono text-2xl uppercase tracking-tighter"
                    >
                      [ REBOOT_PROCESS ]
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="mb-12">
                      <h2 className="text-5xl font-mono text-[#00ffff] text-glitch leading-none mb-2 underline underline-offset-8 decoration-wavy">ACCESS_REQUEST</h2>
                      <p className="text-white/30 text-[10px] font-mono tracking-[0.5em] uppercase">Auth Token: GX-992-ALPHA</p>
                    </div>
                    
                    <button 
                      onClick={startGame}
                      className="w-full py-6 border-2 border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-all font-mono text-3xl uppercase tracking-tighter group relative overflow-hidden"
                    >
                      <span className="relative z-10 font-bold">INITIALIZE_CORE</span>
                      <motion.div 
                        animate={{ left: ['-100%', '200%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute top-0 bottom-0 w-24 bg-white/20 skew-x-12"
                      />
                    </button>
                    
                    <div className="mt-12 grid grid-cols-2 gap-4">
                       <div className="text-left border-l border-white/10 pl-3">
                          <p className="text-[10px] text-white/20 uppercase font-mono">STATUS</p>
                          <p className="text-[#00ffff] text-xs font-mono">READY</p>
                       </div>
                       <div className="text-left border-l border-white/10 pl-3">
                          <p className="text-[10px] text-white/20 uppercase font-mono">ENCRYPTION</p>
                          <p className="text-[#ff00ff] text-xs font-mono">AES-256</p>
                       </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cryptic Data Feed */}
      <div className="mt-8 w-full max-w-lg font-mono text-[10px] text-white/20 flex flex-col gap-1 overflow-hidden h-12">
        <div className="flex justify-between">
           <span className="text-[#00ffff]/40">BUFFER: {Math.random().toString(16).substring(2, 10).toUpperCase()}</span>
           <span className="text-[#ff00ff]/40">LATENCY: {Math.floor(Math.random() * 20)}MS</span>
        </div>
        <div className="flex justify-between">
           <span>HEX_DEBUG: 0x{score.toString(16).padStart(4, '0')}</span>
           <span>VELOCITY: {Math.round((INITIAL_SPEED / speed) * 100)}%</span>
        </div>
      </div>
    </div>
  );
}
