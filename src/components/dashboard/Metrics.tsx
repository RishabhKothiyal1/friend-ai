import React, { useState, useEffect } from 'react';
import { Activity, Heart, Shield, PenTool } from 'lucide-react';

interface MoodEntry {
  id: string;
  mood: string;
  intensity: number;
  timestamp: string;
  note?: string;
  tags?: string[];
}

export function Metrics() {
  const [sessionsCount, setSessionsCount] = useState(0);
  const [journalsCount, setJournalsCount] = useState(0);
  const [wellnessScore, setWellnessScore] = useState<string>("N/A");

  useEffect(() => {
    // 1. Load Sessions
    try {
      const sessions = localStorage.getItem("pfai_chat_sessions");
      if (sessions) {
        setSessionsCount(JSON.parse(sessions).length);
      }
    } catch (e) {
      console.error("Error reading sessions for metrics:", e);
    }

    // 2. Load Journal Entries
    try {
      const journals = localStorage.getItem("pfai_journal_entries");
      if (journals) {
        setJournalsCount(JSON.parse(journals).length);
      }
    } catch (e) {
      console.error("Error reading journals for metrics:", e);
    }

    // 3. Load Moods from IndexedDB to compute average wellness score
    const loadWellnessScore = () => {
      const request = indexedDB.open("friend_ai_db", 1);
      request.onsuccess = (e) => {
        const db = (e.target as any).result;
        try {
          if (!db.objectStoreNames.contains("mood_logs")) {
            setWellnessScore("N/A");
            return;
          }
          const tx = db.transaction("mood_logs", "readonly");
          const store = tx.objectStore("mood_logs");
          const getAll = store.getAll();
          getAll.onsuccess = () => {
            const list = getAll.result as MoodEntry[];
            if (list && list.length > 0) {
              // Map intensity (1-10 where 1 is best, 10 is high distress) to a score
              // e.g. Score = 100 - (average intensity * 8)
              const sum = list.reduce((acc, curr) => acc + (curr.intensity || 5), 0);
              const avg = sum / list.length;
              const score = Math.round(Math.max(10, Math.min(100, 100 - (avg * 8))));
              setWellnessScore(`${score}%`);
            } else {
              setWellnessScore("N/A");
            }
          };
        } catch (err) {
          console.error("Error reading IndexedDB in Metrics:", err);
          setWellnessScore("N/A");
        }
      };
      request.onerror = () => {
        setWellnessScore("N/A");
      };
    };

    loadWellnessScore();
  }, []);

  const stats = [
    { name: 'Wellness Score', value: wellnessScore, change: wellnessScore !== 'N/A' ? 'Based on logs' : 'No logs yet', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { name: 'Active Sessions', value: sessionsCount.toString(), change: 'Local Chats', icon: Activity, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { name: 'Privacy Index', value: '100%', change: 'Zero Trackers', icon: Shield, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { name: 'Journal Reflections', value: journalsCount.toString(), change: 'Unguided notes', icon: PenTool, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.name}
            className="group relative overflow-hidden rounded-2xl bg-white dark:bg-black border border-slate-200 dark:border-white/10 p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
          >
            {/* Background Glow */}
            <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full ${stat.bg} blur-2xl transition-all group-hover:scale-150 opacity-50`}></div>
            
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {stat.name}
                </p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div className={`rounded-xl p-3 ${stat.bg}`}>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
            
            <div className="mt-4 flex items-center text-xs">
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                {stat.change}
              </span>
              <span className="ml-2 text-slate-400 dark:text-slate-500">fully local storage</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

