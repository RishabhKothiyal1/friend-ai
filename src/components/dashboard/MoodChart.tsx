import React from 'react';

export function MoodChart() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const data = [60, 45, 80, 55, 90, 75, 85]; // 0-100 scale

  return (
    <div className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
      
      <div className="flex items-center justify-between mb-8 relative">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">Mood Tracking</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Your emotional wellness over the past week</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-[#0a0a0a] px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            Positive
          </span>
        </div>
      </div>

      <div className="h-64 flex items-end justify-between gap-2 relative mt-4">
        {/* Background grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="w-full border-t border-dashed border-slate-200 dark:border-white/10 h-0"></div>
          ))}
        </div>

        {/* Bars */}
        {data.map((value, idx) => (
          <div key={idx} className="relative flex flex-col items-center flex-1 group/bar z-10">
            {/* Tooltip */}
            <div className="opacity-0 group-hover/bar:opacity-100 transition-opacity absolute -top-10 bg-[#0a0a0a] text-white text-xs py-1 px-2 rounded font-bold whitespace-nowrap shadow-xl">
              Score: {value}
            </div>
            
            {/* Bar Track */}
            <div className="w-full max-w-[40px] bg-slate-100 dark:bg-[#0a0a0a] rounded-t-xl h-full flex flex-col justify-end overflow-hidden">
              {/* Actual Bar Fill */}
              <div 
                className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-xl transition-all duration-1000 ease-out group-hover:from-indigo-500 group-hover:to-indigo-300"
                style={{ height: `${value}%` }}
              >
                {/* Micro animation overlay */}
                <div className="w-full h-full bg-white/10 opacity-0 group-hover/bar:opacity-100 transition-opacity animate-pulse"></div>
              </div>
            </div>
            
            <span className="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">{days[idx]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
