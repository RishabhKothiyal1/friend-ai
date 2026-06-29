import React, { useState, useEffect } from 'react';
import { PenLine, Clock } from 'lucide-react';

interface JournalEntryProps { 
  onNewEntry?: () => void; 
}

interface EntryItem {
  id: string;
  title: string;
  content: string;
  date: string;
}

export function JournalEntry({ onNewEntry }: JournalEntryProps) {
  const [entries, setEntries] = useState<EntryItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("pfai_journal_entries");
      if (saved) {
        setEntries(JSON.parse(saved).slice(0, 3)); // Display top 3 recent entries
      }
    } catch (e) {
      console.error("Error loading journal entries for dashboard:", e);
    }
  }, []);

  return (
    <div className="bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-sm h-full flex flex-col relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -ml-10 -mt-10 pointer-events-none transition-all group-hover:scale-110"></div>
      
      <div className="flex items-center justify-between mb-6 relative">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
          <PenLine className="w-5 h-5 text-emerald-500" />
          Recent Journal Entries
        </h3>
      </div>

      <div className="flex-1 space-y-4 relative overflow-y-auto">
        {entries.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 border border-dashed border-slate-200 dark:border-white/5 rounded-xl">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">No entries recorded</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Start reflective unguided writing to see your notes here.</p>
          </div>
        ) : (
          entries.map((entry) => (
            <div 
              key={entry.id} 
              className="p-4 rounded-xl border border-slate-100 dark:border-white/10 hover:border-indigo-200 dark:hover:border-indigo-800/50 hover:bg-slate-50 dark:hover:bg-[#0a0a0a]/50 transition-all cursor-pointer group/item"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-slate-800 dark:text-slate-200 group-hover/item:text-indigo-600 dark:group-hover/item:text-indigo-400 transition-colors">
                  {entry.title || "Untitled Reflection"}
                </h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {entry.content}
              </p>
              <div className="flex items-center gap-1 mt-3 text-[10px] text-slate-400 font-medium font-mono uppercase tracking-wider">
                <Clock className="w-3 h-3" />
                {entry.date}
              </div>
            </div>
          ))
        )}
      </div>

      <button onClick={onNewEntry} className="w-full mt-6 py-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold rounded-xl border border-indigo-100 dark:border-indigo-500/20 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer">
        <PenLine className="w-4 h-4" />
        New Entry
      </button>
    </div>
  );
}

