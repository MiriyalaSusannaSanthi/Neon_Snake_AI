/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Gamepad2, 
  Trophy,
  Zap,
  Terminal,
  Activity
} from 'lucide-react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import BackgroundEffect from './components/BackgroundEffect';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('snake-high-score');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const handleScoreUpdate = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
      localStorage.setItem('snake-high-score', newScore.toString());
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-hidden selection:bg-[#00ffff]/30">
      <BackgroundEffect />
      
      {/* Header Overlay */}
      <header className="fixed top-0 left-0 right-0 z-50 p-4 flex justify-between items-start pointer-events-none">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col gap-1 pointer-events-auto"
        >
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#00ffff] animate-pulse" />
            <h1 className="text-2xl font-mono font-bold tracking-tighter text-[#00ffff] text-glitch">NEON_SYNTH_SNAKE</h1>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-mono text-white/40">
             <span className="flex items-center gap-1"><Activity className="w-3 h-3" /> LINK_ESTABLISHED</span>
             <span>ID: 0x884319160469</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex gap-8 pointer-events-auto bg-black/80 p-4 crt-border"
        >
          <div className="flex flex-col">
            <span className="text-[10px] font-mono uppercase text-[#ff00ff]">HIGH_PARAM</span>
            <span className="text-3xl font-mono font-bold text-[#00ffff] leading-none tracking-tighter">
              {highScore.toString().padStart(6, '0')}
            </span>
          </div>
          <div className="w-px bg-white/10 h-8 self-center" />
          <div className="flex flex-col">
            <span className="text-[10px] font-mono uppercase text-[#00ffff]">CURR_DATA</span>
            <span className="text-3xl font-mono font-bold text-[#ff00ff] leading-none tracking-tighter">
              {score.toString().padStart(6, '0')}
            </span>
          </div>
        </motion.div>
      </header>

      {/* Main Grid Interface */}
      <main className="container mx-auto h-screen pt-24 pb-8 flex flex-col lg:grid lg:grid-cols-12 gap-4 px-4">
        
        {/* Left: Terminal Sidebar */}
        <aside className="hidden lg:flex lg:col-span-3 flex-col gap-4">
          <div className="p-4 bg-black/60 crt-border border-white/20">
            <h3 className="text-xs font-mono text-[#00ffff] uppercase mb-4 flex items-center gap-2">
              <Terminal className="w-3 h-3" /> CMD_INPUT
            </h3>
            <div className="space-y-4 font-mono text-[11px]">
              <div className="flex justify-between border-b border-white/5 pb-1">
                 <span className="text-white/40">TRANS_X:</span>
                 <span className="text-[#00ffff]">WASD_KEYS</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-1">
                 <span className="text-white/40">INTERRUPT:</span>
                 <span className="text-[#00ffff]">SPACE_BAR</span>
              </div>
              <div className="flex justify-between">
                 <span className="text-white/40">SYS_RESET:</span>
                 <span className="text-[#ff00ff]">R_CMD</span>
              </div>
            </div>
          </div>

          <div className="flex-1 p-4 bg-black/60 crt-border border-white/20 flex flex-col relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-20"><Trophy className="w-12 h-12" /></div>
            <h3 className="text-xs font-mono text-[#ff00ff] uppercase mb-4 flex items-center gap-2">
              <Activity className="w-3 h-3" /> ANALYTICS
            </h3>
            <div className="space-y-3 flex-1 overflow-y-auto no-scrollbar">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-2 border border-white/5 bg-white/5 font-mono text-[9px] leading-tight opacity-40 hover:opacity-100 transition-opacity">
                   <p className="text-[#00ffff]">LOG_{i}: SECTOR_{Math.floor(Math.random()*100)}</p>
                   <p className="text-white/40">STABLE_FLOW @ {Date.now() + i}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Center: Main Viewport */}
        <section className="lg:col-span-6 flex flex-col h-full overflow-hidden relative">
           {/* Perspective Borders */}
           <div className="absolute -top-10 -left-10 w-20 h-20 border-t-2 border-l-2 border-[#00ffff] opacity-50" />
           <div className="absolute -top-10 -right-10 w-20 h-20 border-t-2 border-r-2 border-[#ff00ff] opacity-50" />
           <div className="absolute -bottom-10 -left-10 w-20 h-20 border-b-2 border-l-2 border-[#ff00ff] opacity-50" />
           <div className="absolute -bottom-10 -right-10 w-20 h-20 border-b-2 border-r-2 border-[#00ffff] opacity-50" />
           
           <SnakeGame onScoreUpdate={handleScoreUpdate} />
        </section>

        {/* Right: Multimedia Engine */}
        <aside className="lg:col-span-3 flex flex-col h-full gap-4">
           {/* Static/Noise decoration */}
           <div className="h-12 bg-[#ff00ff]/10 border-2 border-[#ff00ff]/30 flex items-center px-4 overflow-hidden mask-glitch">
              <div className="flex gap-2 animate-noise text-[#ff00ff] font-mono text-[10px] tracking-tighter italic">
                 SIGNAL_WAVEFORM_STABLE // 99.4% QUALITY // NEURAL_FEED_ACTIVE
              </div>
           </div>
           <MusicPlayer />
        </aside>
      </main>

      {/* Bottom Data Bar */}
      <footer className="fixed bottom-0 left-0 right-0 h-8 bg-[#00ffff]/5 border-t border-[#00ffff]/20 flex items-center px-4 justify-between font-mono text-[9px] text-[#00ffff]/60">
         <div className="flex gap-6">
            <span className="flex items-center gap-1"><Gamepad2 className="w-3 h-3" /> INPUTMAP: 0x0182</span>
            <span>OS: GLITCH_CORE.v4</span>
         </div>
         <div className="flex gap-4">
            <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.5, repeat: Infinity }}>• LIVE_SYNC</motion.span>
            <span>TEMP: 42°C</span>
         </div>
      </footer>
    </div>
  );
}
