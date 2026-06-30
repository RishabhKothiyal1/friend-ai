import React from 'react';

interface LetterCardProps {
  sender: string;
  avatar: string;
  excerpt: string;
  stamp: string;
  date: string;
  onClick: () => void;
}

const LetterCard: React.FC<LetterCardProps> = ({ sender, avatar, excerpt, stamp, date, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex-shrink-0 w-64 bg-white dark:bg-gray-900 border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-sm cursor-pointer relative font-[family-name:var(--font-letters-serif)] select-none flex flex-col justify-between hover:-translate-y-1 hover:shadow-md transition-all"
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <span className="text-[#F4B400] text-xs">✓✓</span>
          <div className="w-12 h-14 bg-[#FAFAF7] dark:bg-gray-950 rounded border-2 border-[#E8E6E1] dark:border-gray-700 border-dashed flex items-center justify-center text-2xl filter drop-shadow-sm rotate-2">
            {stamp}
          </div>
        </div>
        <p className="text-[#13294B]/80 dark:text-gray-300 text-sm leading-relaxed line-clamp-4 mb-4">
          {excerpt}
        </p>
      </div>

      <div className="border-t border-[#E8E6E1] dark:border-gray-700 pt-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#FAFAF7] dark:bg-gray-950 flex items-center justify-center text-sm border border-[#E5E7EB] dark:border-gray-800">
          {avatar}
        </div>
        <div className="flex flex-col min-w-0">
          <h4 className="font-bold text-xs text-[#13294B] dark:text-gray-100 truncate">{sender}</h4>
          <span className="text-[10px] text-[#13294B]/50 dark:text-gray-400">{date}</span>
        </div>
      </div>
    </div>
  );
};

export const Dashboard: React.FC<{
  onNavigateToWrite: () => void;
  onNavigateToInbox: () => void;
  onOpenDemoLetter: () => void;
}> = ({ onNavigateToWrite, onNavigateToInbox, onOpenDemoLetter }) => {

  return (
    <div className="bg-[#FAFAF7] dark:bg-gray-950 pb-24">

      {/* Visual Header */}
      <div className="bg-[#13294B] dark:bg-gray-800 text-white py-12 px-6 relative overflow-hidden rounded-b-[40px] shadow-sm">
        <div className="max-w-4xl mx-auto relative z-10 space-y-2">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#F4B400]/20 dark:bg-amber-500/20 border border-[#F4B400]/30 dark:border-amber-500/30 flex items-center justify-center text-3xl">
              ✉️
            </div>
            <div>
              <h1 className="text-3xl font-[family-name:var(--font-letters-serif)] font-bold">Friend AI Letters</h1>
              <p className="text-white/60 text-xs tracking-wider uppercase font-semibold">Connections that take time</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#F4B400]/10 dark:bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/3" />
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8 space-y-8">

        {/* Recently Received Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-baseline">
            <h2 className="text-xl font-[family-name:var(--font-letters-serif)] font-bold text-[#13294B] dark:text-gray-100 flex items-center gap-2">
              <span>Recently Received</span>
            </h2>
            <button
              onClick={onNavigateToInbox}
              className="text-[#F4B400] dark:text-amber-400 text-xs font-bold hover:underline"
            >
              See All
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x scroll-smooth">
            <LetterCard
              sender="Jens"
              avatar="🧑‍💻"
              excerpt="Hej! (This is hello in Danish!) I'm Jens from Copenhagen, Denmark. I'm 24 and I work as a designer. I really love writing physical letters..."
              stamp="🧜‍♀️"
              date="Mar 2, 2026"
              onClick={onOpenDemoLetter}
            />
            <LetterCard
              sender="Little penpal"
              avatar="🤠"
              excerpt="Hi there in Hong Kong! – it's my first time writing a letter here. I'm a 17 year old student from Stockholm. Can't believe that we..."
              stamp="🗽"
              date="Mar 1, 2026"
              onClick={onOpenDemoLetter}
            />
            <div className="flex-shrink-0 w-64 bg-white/50 dark:bg-gray-900/50 border-2 border-dashed border-[#E8E6E1] dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center p-5 text-center text-[#13294B]/60 dark:text-gray-400">
              <span className="text-3xl mb-2">🖋</span>
              <p className="text-xs font-bold">Write a letter to find more matching friends!</p>
              <button
                onClick={onNavigateToWrite}
                className="mt-3 text-xs bg-[#13294B] dark:bg-gray-800 text-white px-4 py-1.5 rounded-full hover:bg-[#13294B]/95 dark:hover:bg-gray-700 transition font-semibold"
              >
                Draft New
              </button>
            </div>
          </div>
        </div>

        {/* Incoming Letter Status Card */}
        <div className="space-y-4">
          <h3 className="text-lg font-[family-name:var(--font-letters-serif)] font-bold text-[#13294B] dark:text-gray-100">Incoming Deliveries</h3>
          <div className="bg-white dark:bg-gray-900 border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#F4B400]/15 dark:bg-amber-500/15 flex items-center justify-center text-lg animate-pulse">
                🛬
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#13294B] dark:text-gray-100">Letter travelling from Stockholm</h4>
                <p className="text-[#13294B]/60 dark:text-gray-400 text-xs mt-0.5">Estimated arrival: 4 hours remaining</p>
              </div>
            </div>
            <div className="flex-1 max-w-[200px] h-2 bg-[#E8E6E1] dark:bg-gray-800 rounded-full overflow-hidden relative hidden md:block">
              <div
                className="h-full bg-[#F4B400] dark:bg-amber-400 rounded-full"
                style={{ width: "80%" }}
              />
            </div>
          </div>
        </div>

        {/* Friend Requests and quick metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-900 border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-sm flex items-center justify-between hover:bg-[#E8E6E1]/30 dark:hover:bg-gray-800 transition cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="text-2xl">👥</span>
              <div>
                <h4 className="font-bold text-sm text-[#13294B] dark:text-gray-100">Friend Requests</h4>
                <p className="text-[#13294B]/60 dark:text-gray-400 text-xs">No pending requests</p>
              </div>
            </div>
            <span className="text-[#13294B]/40 dark:text-gray-500 text-lg">➔</span>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-[#E5E7EB] dark:border-gray-800 rounded-2xl p-5 shadow-sm flex items-center justify-between hover:bg-[#E8E6E1]/30 dark:hover:bg-gray-800 transition cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏆</span>
              <div>
                <h4 className="font-bold text-sm text-[#13294B] dark:text-gray-100">Collectibles unlocked</h4>
                <p className="text-[#13294B]/60 dark:text-gray-400 text-xs">3 stamps unlocked in Album</p>
              </div>
            </div>
            <span className="text-[#13294B]/40 dark:text-gray-500 text-lg">➔</span>
          </div>
        </div>

      </div>
    </div>
  );
};
