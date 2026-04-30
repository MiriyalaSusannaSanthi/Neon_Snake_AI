import React from 'react';
import { motion } from 'motion/react';

export default function BackgroundEffect() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-black">
      {/* Static Noise Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-screen"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Grid Pattern with Glow */}
      <div 
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,0,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Extreme Rhythmic Flickers */}
      <motion.div
        animate={{
          opacity: [0.1, 0.3, 0.1, 0.2, 0.1],
          backgroundColor: ['#00ffff', '#ff00ff', '#00ffff'],
        }}
        transition={{
          duration: 0.1,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute inset-0 mix-blend-overlay pointer-events-none opacity-10"
      />

      {/* Scanning Laser */}
      <motion.div
        animate={{
          top: ['-10%', '110%'],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute inset-x-0 h-px bg-cyan-400 shadow-[0_0_10px_#00ffff] z-10"
      />

      {/* Scanline Overlay */}
      <div className="absolute inset-0 bg-scanlines opacity-[0.1]" />
    </div>
  );
}
