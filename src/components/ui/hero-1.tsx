"use client";

import * as React from "react";
import { Brain } from "lucide-react";
import { DiaTextReveal } from "./dia-text-reveal";
import MotionButton from "./motion-button";
import { BeamsBackground } from "./beams-background";

interface Hero1Props {
  onGetStarted?: () => void;
}

const Hero1 = ({ onGetStarted }: Hero1Props) => {
  return (
    <div className="h-full min-h-screen bg-black text-white flex flex-col relative overflow-hidden w-full font-sans">
      <BeamsBackground className="absolute inset-0 w-full h-full pointer-events-none z-0" children={<div />} />
      
      {/* Subtle Grain Overlay for Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay z-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

      {/* Minimal Header */}
      <header className="flex justify-between items-center px-8 py-8 z-20 relative">
        <div className="flex items-center gap-3 opacity-90">
          {/* Logo removed per request */}
        </div>
        <button
          type="submit"
          onClick={onGetStarted}
          className="flex justify-center gap-2 items-center mx-auto shadow-xl text-lg bg-gray-50 backdrop-blur-md lg:font-semibold isolation-auto border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-indigo-600 hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-2 overflow-hidden border-2 rounded-full group"
        >
          SIGN IN
          <svg
            className="w-8 h-8 justify-end group-hover:rotate-90 group-hover:bg-gray-50 text-gray-50 ease-linear duration-300 rounded-full border border-gray-700 group-hover:border-none p-2 rotate-45"
            viewBox="0 0 16 19"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
              className="fill-gray-800 group-hover:fill-gray-800"
            ></path>
          </svg>
        </button>
      </header>

      {/* Main Content - Strong & Minimal */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center z-10 relative pb-32">
        <div className="max-w-3xl mx-auto space-y-8 w-full flex flex-col items-center">
          
          <div className="flex flex-col items-center gap-6 mb-4">
            <img 
              src="/friend_ai_mascot.jpg" 
              alt="friend ai logo" 
              className="w-32 h-32 md:w-40 md:h-40 rounded-3xl object-cover border-2 border-white/20 shrink-0 shadow-2xl animate-fade-in"
            />
            <h1 className="text-6xl md:text-8xl font-black leading-none tracking-tighter text-white drop-shadow-sm">
              <DiaTextReveal
                className="text-6xl md:text-8xl font-black tracking-tighter"
                text="friend ai"
                colors={["#A97CF8", "#F38CB8", "#FDCC92"]}
              />
            </h1>
          </div>

          <p className="text-lg md:text-xl text-gray-400 max-w-xl mx-auto font-medium leading-relaxed tracking-wide">
            A quiet, fully private space to ground your mind and explore your thoughts without judgment.
          </p>

          <div className="pt-8">
            <MotionButton 
              label="Get Started" 
              onClick={onGetStarted}
            />
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
