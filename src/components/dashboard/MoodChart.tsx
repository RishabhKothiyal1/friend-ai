import React, { useState, useEffect } from 'react';

interface MoodEntry {
  id: string;
  mood: string;
  intensity: number;
  timestamp: string;
  note?: string;
  tags?: string[];
}

export function MoodChart() {
  const [moodData, setMoodData] = useState<{ label: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMoods = () => {
      const request = indexedDB.open("friend_ai_db", 1);
      request.onsuccess = (e) => {
        const db = (e.target as any).result;
        try {
          if (!db.objectStoreNames.contains("mood_logs")) {
            setMoodData([]);
            setLoading(false);
            return;
          }
          const tx = db.transaction("mood_logs", "readonly");
          const store = tx.objectStore("mood_logs");
          const getAll = store.getAll();
          getAll.onsuccess = () => {
            const list = getAll.result as MoodEntry[];
            if (list && list.length > 0) {
              // Get the last 7 entries, sort by id so oldest is first (reads left-to-right chronologically)
              const sorted = [...list].sort((a, b) => a.id.localeCompare(b.id));
              const last7 = sorted.slice(-7);
              
              // Map to label (mood name + truncated note or just mood name) and value (intensity * 10 for 0-100 scale)
              const formatted = last7.map(item => ({
                label: item.mood,
                value: (item.intensity || 5) * 10
              }));
              setMoodData(formatted);
            } else {
              setMoodData([]);
            }
            setLoading(false);
          };
          getAll.onerror = () => {
            setMoodData([]);
            setLoading(false);
          };
        } catch (err) {
          console.error("Error reading IndexedDB in MoodChart:", err);
          setMoodData([]);
          setLoading(false);
        }
      };
      request.onerror = () => {
        setMoodData([]);
        setLoading(false);
      };
    };

    fetchMoods();
  }, []);

  return (
    <div className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm relative overflow-hidden group h-full flex flex-col justify-between">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
      
      <div className="flex items-center justify-between mb-6 relative">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">Mood Tracking</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Your real emotional wellness trends based on logged moods</p>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center text-xs text-slate-400">
          Loading logs...
        </div>
      ) : moodData.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-200 dark:border-white/5 rounded-xl bg-slate-50/50 dark:bg-[#0a0a0a]/30">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">No emotional logs recorded</p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Tap 'Open Mood Log' in the top right to record your first mood state.</p>
        </div>
      ) : (
        <div className="h-64 flex items-end justify-between gap-2 relative mt-4">
          {/* Background grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="w-full border-t border-dashed border-slate-200 dark:border-white/10 h-0"></div>
            ))}
          </div>

          {/* Bars */}
          {moodData.map((item, idx) => (
            <div key={idx} className="relative flex flex-col items-center flex-1 group/bar z-10">
              {/* Tooltip */}
              <div className="opacity-0 group-hover/bar:opacity-100 transition-opacity absolute -top-10 bg-[#0a0a0a] text-white text-[10px] py-1 px-2 rounded font-bold whitespace-nowrap shadow-xl">
                Intensity: {item.value / 10}/10
              </div>
              
              {/* Bar Track */}
              <div className="w-full max-w-[36px] bg-slate-100 dark:bg-[#0a0a0a]/50 rounded-t-xl h-full flex flex-col justify-end overflow-hidden">
                {/* Actual Bar Fill */}
                <div 
                  className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-xl transition-all duration-1000 ease-out group-hover:from-indigo-500 group-hover:to-indigo-300"
                  style={{ height: `${item.value}%` }}
                >
                  <div className="w-full h-full bg-white/10 opacity-0 group-hover/bar:opacity-100 transition-opacity animate-pulse"></div>
                </div>
              </div>
              
              <span className="mt-4 text-[9px] font-semibold tracking-tight text-slate-500 dark:text-slate-400 text-center truncate max-w-[50px]">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

