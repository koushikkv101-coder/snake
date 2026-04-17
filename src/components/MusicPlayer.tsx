import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Track {
  id: number;
  title: string;
  artist: string;
  url: string;
  duration: string;
  cover: string;
}

const DUMMY_TRACKS: Track[] = [
  {
    id: 1,
    title: "Neon Horizon",
    artist: "Synth-AI Gen 1",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    duration: "6:12",
    cover: "https://picsum.photos/seed/neon1/400/400"
  },
  {
    id: 2,
    title: "Cyber Rush",
    artist: "Neural Melodies",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    duration: "7:05",
    cover: "https://picsum.photos/seed/cyber/400/400"
  },
  {
    id: 3,
    title: "Digital Ghost",
    artist: "Recursive Beats",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    duration: "5:30",
    cover: "https://picsum.photos/seed/ghost/400/400"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Audio play blocked", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const skipTrack = (direction: 'next' | 'prev') => {
    let nextIndex = direction === 'next' ? currentTrackIndex + 1 : currentTrackIndex - 1;
    if (nextIndex >= DUMMY_TRACKS.length) nextIndex = 0;
    if (nextIndex < 0) nextIndex = DUMMY_TRACKS.length - 1;
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(true);
    setProgress(0);
  };

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Audio play blocked", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentTrackIndex]);

  const onTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = x / rect.width;
      audioRef.current.currentTime = pct * audioRef.current.duration;
    }
  };

  return (
    <div className="w-full max-w-[400px] relative group border-t-4 border-l-4 border-[#ff00ff] p-6 bg-black">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={onTimeUpdate}
        onEnded={() => skipTrack('next')}
      />
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none text-[#00ffff]">
        <span className="font-digital text-8xl">01</span>
      </div>

      <div className="flex gap-6 items-start mb-10 relative z-10">
        <div className="relative w-32 h-32 flex-shrink-0 border-4 border-[#00ffff]">
          <motion.img
            key={currentTrack.cover}
            initial={{ filter: 'grayscale(100%) brightness(0.5)' }}
            animate={{ filter: isPlaying ? 'grayscale(0%) brightness(1)' : 'grayscale(100%) brightness(0.5)' }}
            src={currentTrack.cover}
            referrerPolicy="no-referrer"
            alt="DATA_STREAM_ART"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-[#00ffff]/20 to-transparent pointer-events-none" />
        </div>
        
        <div className="flex-1 overflow-hidden pt-2">
          <motion.h3 
            key={currentTrack.title}
            className="text-3xl font-digital font-black truncate text-[#00ffff] glitch-text"
            data-text={currentTrack.title}
          >
            {currentTrack.title}
          </motion.h3>
          <motion.p 
            key={currentTrack.artist}
            className="text-sm font-digital text-[#ff00ff] uppercase tracking-widest mt-2"
          >
            S_SOURCE: {currentTrack.artist}
          </motion.p>
          <div className="mt-4 flex gap-2">
            <span className="h-1 flex-1 bg-[#00ffff]/20" />
            <span className="h-1 flex-1 bg-[#ff00ff]/50" />
            <span className="h-1 flex-1 bg-[#00ffff]/20" />
          </div>
        </div>
      </div>

      <div className="space-y-6 relative z-10">
        <div 
          className="h-4 w-full bg-[#111] border-2 border-[#00ffff]/30 cursor-crosshair relative"
          onClick={handleProgressBarClick}
        >
          <div 
            className="h-full bg-[#00ffff] relative shadow-[0_0_15px_#00ffff]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between items-center bg-[#111] border-2 border-[#ff00ff]/30 p-4">
          <button 
            onClick={() => skipTrack('prev')}
            className="text-[#00ffff] hover:text-white transition-colors"
          >
            <SkipBack size={28} />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-16 h-16 bg-[#ff00ff] text-black border-4 border-white flex items-center justify-center hover:scale-110 active:scale-90 transition-transform shadow-[5px_5px_0_#00ffff]"
          >
            {isPlaying ? <Pause fill="currentColor" size={32} /> : <Play fill="currentColor" size={32} className="translate-x-1" />}
          </button>

          <button 
            onClick={() => skipTrack('next')}
            className="text-[#00ffff] hover:text-white transition-colors"
          >
            <SkipForward size={28} />
          </button>
        </div>

        <div className="flex justify-between items-center text-[10px] font-digital text-gray-500 uppercase tracking-widest mt-4">
          <div className="flex items-center gap-2 text-[#00ffff]">
            <Volume2 size={12} />
            <span>BITRATE_MAX</span>
          </div>
          <div className="bg-[#ff00ff] text-black px-2 py-1 font-bold">
            TRACK_ID_{currentTrackIndex + 1}_OF_{DUMMY_TRACKS.length}
          </div>
        </div>
      </div>
    </div>
  );
}
