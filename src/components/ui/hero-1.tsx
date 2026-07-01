"use client";

import * as React from "react";
import { Brain } from "lucide-react";
import { DiaTextReveal } from "./dia-text-reveal";
import MotionButton from "./motion-button";
import { BeamsBackground } from "./beams-background";

interface Hero1Props {
  onSignIn?: () => void;
  onGetStarted?: () => void;
}

const Hero1 = ({ onSignIn, onGetStarted }: Hero1Props) => {
  return (
    <div className="h-full min-h-screen bg-[#FAF8F5] text-[#2B2B2B] flex flex-col relative overflow-hidden w-full font-sans">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay z-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

      <header className="flex justify-between items-center px-8 py-8 z-20 relative">
        <div className="flex items-center gap-3 opacity-90">
        </div>
        <MotionButton label="SIGN IN" onClick={onSignIn} />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center z-10 relative pb-32">
        <div className="max-w-3xl mx-auto space-y-8 w-full flex flex-col items-center">
          
          <div className="flex items-center justify-center gap-4 mb-4">
            <img 
              src="/hero-logo.png" 
              alt="friend ai logo" 
              className="h-20 w-20 md:h-24 md:w-24 object-contain shrink-0"
            />
            <h1 className="text-6xl md:text-8xl font-black leading-none tracking-tighter text-[#2B2B2B] drop-shadow-sm">
              <DiaTextReveal
                className="text-6xl md:text-8xl font-black tracking-tighter"
                text="friend ai"
                colors={["#7A9E85", "#6B9080", "#5D7E68"]}
              />
            </h1>
          </div>

          <p className="text-lg md:text-xl text-[#6B6B6B] max-w-xl mx-auto font-medium leading-relaxed tracking-wide">
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
        <p className="text-[10px] tracking-[0.2em] uppercase font-mono text-[#6B6B6B]">100% Local Encryption • Zero Telemetry</p>
      </div>
    </div>
  );
};

export { Hero1 };