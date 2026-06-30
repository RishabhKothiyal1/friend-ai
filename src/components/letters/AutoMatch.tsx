import React, { useState, useEffect } from 'react';

export const AutoMatch: React.FC<{ onMatched: (friendName: string) => void }> = ({ onMatched }) => {
  const [matchingState, setMatchingState] = useState<'idle' | 'searching' | 'found'>('idle');
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (matchingState !== 'searching') return;
    const interval = setInterval(() => {
      setDots(d => (d.length >= 3 ? '' : d + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, [matchingState]);

  const startMatching = () => {
    setMatchingState('searching');
    setTimeout(() => {
      setMatchingState('found');
    }, 4500);
  };

  return (
    <div className="bg-[#FAFAF7] min-h-[500px] flex flex-col items-center justify-center p-6 text-center">
      {matchingState === 'idle' && (
        <div className="max-w-md w-full space-y-6">
          <div className="w-48 h-48 mx-auto bg-[#F4B400]/10 rounded-full flex items-center justify-center border border-[#F4B400]/20">
            <svg viewBox="0 0 100 100" className="w-32 h-32 text-[#13294B]">
              <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="2.5" />
              <path d="M20 50C20 50 35 30 50 30C65 30 80 50 80 50C80 50 65 70 50 70C35 70 20 50 20 50Z" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M50 20V80" stroke="currentColor" strokeWidth="2.5" />
              <path d="M20 50H80" stroke="currentColor" strokeWidth="2.5" />
            </svg>
          </div>

          <h2 className="text-2xl font-[family-name:var(--font-letters-serif)] font-bold text-[#13294B]">Ready to meet a new pen-pal?</h2>
          <p className="text-[#13294B]/70 text-sm">
            Press Auto-Match, and our delivery engine will pair you with a compatible friend somewhere around the world based on your shared interests and language.
          </p>

          <button
            onClick={startMatching}
            className="w-full bg-[#F4B400] hover:bg-yellow-500 text-[#13294B] font-bold py-3.5 px-6 rounded-full shadow-md transition-colors"
          >
            Start Auto-Match
          </button>
        </div>
      )}

      {matchingState === 'searching' && (
        <div className="flex flex-col items-center space-y-6">
          <div className="relative w-56 h-56 flex items-center justify-center">
            <svg
              viewBox="0 0 100 100"
              className="w-40 h-40 text-[#13294B]/80"
              style={{ animation: 'spin 15s linear infinite' }}
            >
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
              <path d="M50 5A45 45 0 0 0 50 95" fill="none" stroke="currentColor" strokeWidth="1" />
              <path d="M5 50A45 45 0 0 0 95 50" fill="none" stroke="currentColor" strokeWidth="1" />
              <ellipse cx="50" cy="50" rx="25" ry="45" fill="none" stroke="currentColor" strokeWidth="1" />
              <ellipse cx="50" cy="50" rx="45" ry="15" fill="none" stroke="currentColor" strokeWidth="1" />
            </svg>

            <div
              className="absolute text-2xl"
              style={{ animation: 'orbit1 3s ease-in-out infinite' }}
            >
              ✉️
            </div>
            <div
              className="absolute text-xl"
              style={{ animation: 'orbit2 4s ease-in-out infinite' }}
            >
              ✈️
            </div>
          </div>

          <h3 className="text-xl font-[family-name:var(--font-letters-serif)] font-bold text-[#13294B] animate-pulse">
            Searching around the world{dots}
          </h3>
          <p className="text-[#13294B]/60 text-xs max-w-xs">
            Calculating relationship values, location matrices, and letter frequencies...
          </p>
        </div>
      )}

      {matchingState === 'found' && (
        <div className="max-w-md w-full bg-white border border-[#E5E7EB] rounded-2xl p-8 shadow-lg space-y-6">
          <div className="w-24 h-24 mx-auto bg-[#F4B400]/20 rounded-full flex items-center justify-center text-4xl">
            🧑‍💻
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#F4B400] font-bold">New Connection Found!</span>
            <h2 className="text-2xl font-[family-name:var(--font-letters-serif)] font-bold text-[#13294B]">Jens from Copenhagen</h2>
            <p className="text-[#13294B]/70 text-sm">
              Denmark &bull; Danish, English &bull; Loves Board Games, Travel & Reading
            </p>
          </div>

          <div className="border-t border-[#E8E6E1] pt-6 flex gap-4">
            <button
              onClick={() => setMatchingState('idle')}
              className="flex-1 border border-[#E5E7EB] text-[#13294B] font-bold py-2.5 rounded-full hover:bg-[#FAFAF7] transition text-sm"
            >
              Skip
            </button>
            <button
              onClick={() => onMatched("Jens")}
              className="flex-1 bg-[#13294B] text-white font-bold py-2.5 rounded-full hover:bg-[#13294B]/95 transition text-sm"
            >
              Send First Letter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
