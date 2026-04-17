import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Gamepad2, Volume2, Info } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#000] text-white font-sans selection:bg-[#f0f]/50 cursor-crosshair">
      <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center mb-16 border-b-4 border-[#0ff] pb-8">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 bg-[#f0f] flex items-center justify-center shadow-[8px_8px_0_#0ff]">
              <Gamepad2 className="text-black" size={32} />
            </div>
            <div>
              <h1 
                className="text-6xl font-digital font-black uppercase tracking-widest glitch-text"
                data-text="NEURAL_OS_v9"
              >
                NEURAL_OS_v9
              </h1>
              <p className="text-xs font-mono text-[#0ff] mt-2 opacity-80 uppercase tracking-[0.5em] animate-pulse">
                KERNEL_SESSION: ACTIVE // AUTH_STATE: BYPASSED
              </p>
            </div>
          </div>

          <div className="hidden xl:flex border-4 border-[#0ff] px-8 py-4 bg-[#000] shadow-[8px_8px_0_#f0f] items-center gap-6">
            <div className="w-2 h-8 bg-[#0ff] animate-bounce" />
            <span className="text-2xl font-digital text-[#0ff] uppercase">
              "INPUT_REPLICATION_IN_PROGRESS"
            </span>
          </div>

          <div className="hidden md:flex flex-col items-end gap-2 font-digital text-sm text-[#39ff14] uppercase">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#39ff14]" />
              <span>LINK_ESTABLISHED</span>
            </div>
            <div className="flex items-center gap-2 text-[#f0f]">
              <Volume2 size={16} />
              <span>SONIC_DECRYPTION_ON</span>
            </div>
          </div>
        </header>

        {/* Main Interface */}
        <main className="flex-1 flex flex-col lg:flex-row gap-16 items-center lg:items-start justify-center">
          {/* Game Window - Centered */}
          <motion.section 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex justify-center w-full"
          >
            <div className="machine-panel w-full max-w-[500px]">
              <SnakeGame />
            </div>
          </motion.section>

          {/* Side Panel - Components */}
          <motion.section 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-auto flex flex-col gap-12"
          >
            <div className="flex flex-col gap-12">
              <div className="machine-panel">
                <MusicPlayer />
              </div>

              {/* Info Widget */}
              <div className="machine-panel border-[#f0f] outline-[#0ff]">
                <div className="flex items-center gap-2 mb-4 text-[#f0f]">
                  <Info size={20} />
                  <span className="text-lg font-digital uppercase tracking-[0.3em] font-bold">MANUAL_OVERRIDE</span>
                </div>
                <div className="text-sm font-digital text-gray-300 space-y-4">
                  <p>1. CONSUME_DATA_FRAGMENTS_TO_PREVENT_BUFFER_OVERFLOW.</p>
                  <p>2. AVOID_COLLISION_WITH_SYSTEM_FIREWALLS.</p>
                  <p>3. AUDIO_STIMULATION_MANDATORY_FOR_SYNAPTIC_LINK.</p>
                </div>
              </div>
            </div>
          </motion.section>
        </main>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t-4 border-[#0ff] flex flex-col md:flex-row justify-between items-center gap-6 text-sm font-digital text-gray-400 uppercase tracking-widest">
          <div className="glitch-text text-[#f0f]" data-text="PROPERTY_OF_NEURAL_RECORDS">PROPERTY_OF_NEURAL_RECORDS</div>
          <div className="flex gap-10">
            <span className="text-[#0ff] border-b-2 border-[#0ff]">DGNSTCS_042</span>
            <span>PING: 0.0001ms</span>
            <span className="text-[#39ff14] animate-pulse">CORE_STABLE</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
