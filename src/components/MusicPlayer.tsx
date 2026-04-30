import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Music, 
  ListMusic, 
  Activity,
  Box
} from 'lucide-react';

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
  cover: string;
  duration: string;
}

const TRACKS: Track[] = [
  {
    id: 1,
    title: "NEON_PULSE_v1",
    artist: "CORE_UNIT_01",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "bg-[#00ffff]/20",
    duration: "4:12"
  },
  {
    id: 2,
    title: "CYBER_RAIN_x64",
    artist: "NEURAL_BOT",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "bg-[#ff00ff]/20",
    duration: "3:45"
  },
  {
    id: 3,
    title: "GLITCH_DREAM_SYS",
    artist: "GLITCH_OS",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "bg-white/10",
    duration: "5:20"
  }
];

export default function MusicPlayer({ isMini }: { isMini?: boolean }) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showList, setShowList] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
      if (p >= 100) nextTrack();
    }
  };

  if (isMini) {
    return (
      <div className="flex items-center gap-4 w-full font-mono">
        <audio ref={audioRef} src={currentTrack.url} onTimeUpdate={handleTimeUpdate} />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-[#00ffff] truncate uppercase brightness-150 tracking-tighter">{currentTrack.title}</p>
          <div className="h-0.5 bg-white/10 mt-1 w-full relative">
             <div className="absolute inset-y-0 left-0 bg-[#00ffff]" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <button onClick={togglePlay} className="p-1 border border-white/20 text-white">
          {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-4 font-mono">
      <audio ref={audioRef} src={currentTrack.url} onTimeUpdate={handleTimeUpdate} />
      
      {/* Player Frame */}
      <div className="flex-1 p-4 bg-black/80 crt-border border-white/20 flex flex-col relative overflow-hidden">
        
        {/* Header Data */}
        <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
           <span className="text-[9px] text-white/30 tracking-widest uppercase">AUDIO_DRIVE_01</span>
           <Activity className="w-3 h-3 text-[#00ffff] animate-pulse" />
        </div>

        {/* Visual Matrix */}
        <div className="flex-1 flex flex-col items-center justify-center relative my-6">
           <div className={`w-32 h-32 border-2 border-dashed border-white/10 flex items-center justify-center relative overflow-hidden ${isPlaying ? 'animate-noise' : ''}`}>
              <div className="absolute inset-0 bg-[#00ffff]/5" />
              <Box className={`w-12 h-12 text-[#00ffff] transition-transform duration-500 ${isPlaying ? 'rotate-45 scale-110' : ''}`} />
              
              {/* Dynamic Binary Stream */}
              {isPlaying && (
                <div className="absolute inset-0 grid grid-cols-4 opacity-20 text-[6px] text-[#00ffff] p-1 select-none pointer-events-none">
                   {Array.from({length: 16}).map((_, i) => (
                     <motion.span key={i} animate={{ opacity: [1, 0, 1] }} transition={{ duration: Math.random() + 0.1, repeat: Infinity }}>
                        {Math.round(Math.random())}
                     </motion.span>
                   ))}
                </div>
              )}
           </div>

           <div className="mt-6 text-center">
              <h4 className="text-[#00ffff] text-lg font-bold tracking-tighter uppercase text-glitch">{currentTrack.title}</h4>
              <p className="text-[10px] text-white/30 uppercase mt-1 tracking-[0.4em]">{currentTrack.artist}</p>
           </div>
        </div>

        {/* Controls Block */}
        <div className="space-y-6 mt-auto">
          {/* Progress Wave */}
          <div className="relative h-6 bg-white/5 border border-white/10 flex items-end overflow-hidden group cursor-pointer">
             {Array.from({length: 40}).map((_, i) => (
               <motion.div 
                 key={i}
                 animate={{ height: isPlaying ? [10, Math.random()*24, 5] : '20%' }}
                 transition={{ duration: 0.3, repeat: Infinity }}
                 className={`flex-1 ${i/40 * 100 < progress ? 'bg-[#00ffff]' : 'bg-white/20'}`}
                 style={{ width: '2px', borderRight: '1px solid black' }}
               />
             ))}
          </div>

          <div className="grid grid-cols-5 gap-2">
            <button onClick={() => setShowList(!showList)} className="p-3 border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors">
              <ListMusic className="w-4 h-4 text-[#ff00ff]" />
            </button>
            <button onClick={prevTrack} className="p-3 border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors">
              <SkipBack className="w-4 h-4" />
            </button>
            <button onClick={togglePlay} className="col-span-1 p-3 bg-white text-black flex items-center justify-center hover:bg-[#00ffff] transition-colors group">
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
            <button onClick={nextTrack} className="p-3 border border-white/10 flex items-center justify-center hover:bg-white/5 transition-colors">
              <SkipForward className="w-4 h-4" />
            </button>
            <div className="flex items-center justify-center text-[10px] border border-white/10 text-white/40">
               {currentTrack.duration}
            </div>
          </div>
        </div>

        {/* List Overlay */}
        <AnimatePresence>
          {showList && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute inset-0 bg-black z-30 p-4 border border-white/20 flex flex-col"
            >
              <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                 <span className="text-[10px] text-[#ff00ff] uppercase font-bold tracking-widest">DRIVE_FILES.LST</span>
                 <button onClick={() => setShowList(false)} className="text-[10px] text-white/40 hover:text-white">[X]</button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-1 pr-2 no-scrollbar">
                {TRACKS.map((track, idx) => (
                  <button 
                    key={track.id}
                    onClick={() => { setCurrentTrackIndex(idx); setIsPlaying(true); }}
                    className={`w-full text-left p-2 border border-transparent flex justify-between items-center group transition-all ${currentTrackIndex === idx ? 'bg-[#00ffff]/10 border-[#00ffff]/30' : 'hover:border-white/10'}`}
                  >
                    <span className={`text-[10px] uppercase truncate ${currentTrackIndex === idx ? 'text-[#00ffff]' : 'text-white/40'}`}>
                       {idx.toString().padStart(2, '0')}. {track.title}
                    </span>
                    <span className="text-[8px] text-white/20 opacity-0 group-hover:opacity-100 transition-opacity">ENTRY_POINT</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
