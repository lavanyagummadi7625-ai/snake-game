import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center relative overflow-hidden font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-cyan/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-pink/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_4px,3px_100%] z-50 opacity-20" />

      <header className="absolute top-8 left-0 right-0 px-8 flex justify-between items-center z-10">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-neon-pink shadow-[0_0_15px_#ff00ff]" />
          <h1 className="text-xl font-bold tracking-[0.3em] uppercase italic">
            Neon <span className="text-neon-cyan">Synth</span>
          </h1>
        </div>
        <nav className="flex gap-8 text-[11px] uppercase tracking-widest font-bold opacity-40 hover:opacity-100 transition-opacity">
          <a href="#" className="hover:text-neon-cyan transition-colors">Arcade</a>
          <a href="#" className="hover:text-neon-pink transition-colors">Broadcast</a>
          <a href="#" className="opacity-50">v1.0.4</a>
        </nav>
      </header>

      <main className="w-full max-w-7xl px-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 items-center z-10">
        <motion.section
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-neon-cyan via-neon-pink to-neon-green rounded-2xl blur opacity-10" />
          <SnakeGame />
        </motion.section>

        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex justify-center"
        >
          <MusicPlayer />
        </motion.aside>
      </main>

      <footer className="absolute bottom-8 w-full px-8 flex justify-between items-center z-10">
        <div className="text-[10px] font-mono tracking-widest opacity-30">
          SYS_STATUS: OPTIMAL // ENCRYPTED_TRANSMISSION
        </div>
        <div className="flex gap-6 items-center">
          <div className="flex flex-col items-end">
            <span className="text-[9px] uppercase tracking-tighter opacity-30">Current Grid</span>
            <span className="text-xs font-mono font-bold text-neon-green">20x20_OS</span>
          </div>
          <div className="w-[1px] h-6 bg-white/10" />
          <div className="flex flex-col items-end">
            <span className="text-[9px] uppercase tracking-tighter opacity-30">Signal</span>
            <div className="flex gap-0.5 mt-1">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`w-0.5 h-2 ${i < 4 ? 'bg-neon-cyan' : 'bg-white/10'}`} />
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
