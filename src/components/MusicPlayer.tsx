import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music as MusicIcon, Disc } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "NEON DRIFT",
    artist: "CYBER CORE AI",
    duration: "3:42",
    cover: "https://picsum.photos/seed/synth1/400/400",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 2,
    title: "SYNTH RADIANCE",
    artist: "DATA STREAM",
    duration: "4:15",
    cover: "https://picsum.photos/seed/synth2/400/400",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
  },
  {
    id: 3,
    title: "VOID RUNNER",
    artist: "NIGHTHAWK",
    duration: "2:58",
    cover: "https://picsum.photos/seed/synth3/400/400",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
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

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const p = (audio.currentTime / audio.duration) * 100;
      setProgress(p || 0);
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleNext);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleNext);
    };
  }, [currentTrackIndex]);

  const handleTogglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setProgress(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (audio) {
      const newTime = (parseFloat(e.target.value) / 100) * audio.duration;
      audio.currentTime = newTime;
      setProgress(parseFloat(e.target.value));
    }
  };

  return (
    <div className="glass w-80 h-fit rounded-[32px] p-6 flex flex-col gap-6 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-neon-cyan/10 blur-[60px] pointer-events-none group-hover:bg-neon-pink/10 transition-colors" />
      
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Disc className={`w-5 h-5 text-neon-cyan ${isPlaying ? 'animate-spin' : ''}`} />
          <span className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-50">Now Playing</span>
        </div>
        <Volume2 className="w-4 h-4 opacity-30" />
      </div>

      <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentTrack.id}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            src={currentTrack.cover}
            alt={currentTrack.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      <div className="flex flex-col gap-1">
        <AnimatePresence mode="wait">
          <motion.h3
            key={currentTrack.id}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            className="text-xl font-bold tracking-tight text-white leading-tight"
          >
            {currentTrack.title}
          </motion.h3>
        </AnimatePresence>
        <span className="text-xs font-mono uppercase tracking-widest text-neon-cyan opacity-70">
          {currentTrack.artist}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleSeek}
          className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-neon-pink hover:accent-neon-cyan transition-colors"
        />
        <div className="flex justify-between text-[10px] font-mono opacity-50">
          <span>0:00</span>
          <span>{currentTrack.duration}</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 mt-2">
        <button
          onClick={handlePrev}
          className="p-2 rounded-full hover:bg-white/5 text-white transition-colors"
        >
          <SkipBack className="w-6 h-6" />
        </button>
        
        <button
          onClick={handleTogglePlay}
          className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl neon-border-cyan"
        >
          {isPlaying ? <Pause className="w-6 h-6 fill-black" /> : <Play className="w-6 h-6 fill-black translate-x-0.5" />}
        </button>

        <button
          onClick={handleNext}
          className="p-2 rounded-full hover:bg-white/5 text-white transition-colors"
        >
          <SkipForward className="w-6 h-6" />
        </button>
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={handleNext}
      />

      <div className="flex flex-col gap-3 mt-4 border-t border-white/5 pt-6">
        <div className="flex items-center gap-3 opacity-30 hover:opacity-100 transition-opacity cursor-pointer group/track">
          <MusicIcon className="w-4 h-4 group-hover/track:text-neon-pink" />
          <span className="text-[10px] flex-1 font-bold">NEXT: SYNTH RADIANCE</span>
        </div>
      </div>
    </div>
  );
}
