"use client";

import * as React from "react";
import { Brain } from "lucide-react";
import { Text3DFlip } from "./text-3d-flip";

interface Hero1Props {
  onGetStarted?: () => void;
}

const Hero1 = ({ onGetStarted }: Hero1Props) => {
  return (
    <div className="h-full min-h-screen bg-[#050505] text-white flex flex-col relative overflow-hidden w-full font-sans">
      
      {/* Subtle Grain Overlay for Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

      {/* Minimal Header */}
      <header className="flex justify-between items-center px-8 py-8 z-10 relative">
        <div className="flex items-center gap-3 opacity-90">
          {/* Logo removed per request */}
        </div>
        <button 
          onClick={onGetStarted}
          className="text-white hover:text-gray-300 text-sm font-semibold tracking-wider transition-colors uppercase"
        >
          Sign In
        </button>
      </header>

      {/* Main Content - Strong & Minimal */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center z-10 relative pb-32">
        <div className="max-w-3xl mx-auto space-y-8 w-full flex flex-col items-center">
          
          <div className="flex flex-col items-center gap-6 mb-4">
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-32 h-32 md:w-40 md:h-40 shrink-0 drop-shadow-2xl">
              <circle cx="35" cy="25" r="12" fill="#3b82f6" />
              <path d="M 50 45 C 30 35 15 45 15 65 C 15 85 25 90 35 90 C 45 90 45 75 50 75 Z" fill="#3b82f6" />
              <circle cx="65" cy="25" r="12" fill="#a855f7" />
              <path d="M 50 45 C 70 35 85 45 85 65 C 85 85 75 90 65 90 C 55 90 55 75 50 75 Z" fill="#a855f7" />
              <circle cx="50" cy="55" r="24" fill="#ffffff" />
              <circle cx="41" cy="50" r="3.5" fill="#0f172a" />
              <circle cx="59" cy="50" r="3.5" fill="#0f172a" />
              <path d="M43 59 Q 50 67 57 59" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" fill="none" />
            </svg>
            <h1 className="text-6xl md:text-8xl font-black leading-none tracking-tighter text-white drop-shadow-sm">
              <Text3DFlip
                className="font-black text-6xl md:text-8xl tracking-tighter"
                textClassName="text-white"
                flipTextClassName="text-white"
                rotateDirection="top"
                staggerDuration={0.03}
                staggerFrom="first"
                transition={{ type: "spring", damping: 25, stiffness: 160 }}
              >
                friend
              </Text3DFlip>
              {" "}
              <Text3DFlip
                className="font-black text-6xl md:text-8xl tracking-tighter"
                textClassName="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500"
                flipTextClassName="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500"
                rotateDirection="top"
                staggerDuration={0.03}
                staggerFrom="first"
                transition={{ type: "spring", damping: 25, stiffness: 160 }}
              >
                ai
              </Text3DFlip>
            </h1>
          </div>

          <p className="text-lg md:text-xl text-gray-400 max-w-xl mx-auto font-medium leading-relaxed tracking-wide">
            A quiet, fully private space to ground your mind and explore your thoughts without judgment.
          </p>

          <div className="pt-8">
            <button 
              onClick={onGetStarted}
              className="group relative px-8 py-4 bg-white text-black text-sm font-bold tracking-widest uppercase overflow-hidden cursor-pointer rounded-full transition-transform hover:scale-105 active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-2">
                Begin Journey
              </span>
            </button>
          </div>
          
        </div>
      </main>
      
      <div className="absolute bottom-8 left-0 right-0 text-center z-10 opacity-40">
        <p className="text-[10px] tracking-[0.2em] uppercase font-mono">100% Local Encryption • Zero Telemetry</p>
      </div>
    </div>
  );
};

export { Hero1 };
