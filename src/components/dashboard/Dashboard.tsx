import React from 'react';
import { Metrics } from './Metrics';
import { MoodChart } from './MoodChart';
import { JournalEntry } from './JournalEntry';

interface DashboardProps {
  alias?: string;
  onStartChat?: () => void;
  onNewEntry?: () => void;
}

export function Dashboard({ alias = "Friend", onStartChat, onNewEntry }: DashboardProps) {
  // Determine greeting based on time of day
  const hour = new Date().getHours();
  let greeting = 'Good evening';
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 18) greeting = 'Good afternoon';

  return (
    <div className="w-full max-w-7xl mx-auto h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* Dashboard Header */}
      <div className="mb-8 relative overflow-hidden rounded-3xl bg-black border border-white/10 p-8 shadow-sm group">
        {/* Dynamic Abstract Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 via-slate-900 to-purple-900/30 opacity-60"></div>
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl mix-blend-screen transition-transform duration-1000 group-hover:scale-150"></div>
        <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl mix-blend-screen transition-transform duration-1000 group-hover:scale-150 delay-75"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight font-display mb-2">
              {greeting}, {alias} <span className="inline-block animate-bounce ml-2">👋</span>
            </h1>
            <p className="text-slate-300 text-sm md:text-base max-w-xl leading-relaxed">
              Welcome back to your sanctuary. We've gathered some insights on your recent interactions and wellness trends.
            </p>
          </div>
          <button 
            onClick={onStartChat}
            className="px-6 py-3 bg-white text-slate-900 font-bold rounded-xl shadow-lg shadow-white/10 hover:shadow-white/20 transition-all hover:-translate-y-0.5"
          >
            Start New Chat
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <Metrics />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        
        {/* Mood Chart (Wide) */}
        <div className="lg:col-span-8 flex flex-col h-full">
          <MoodChart />
        </div>
        
        {/* Journal Entries (Narrow) */}
        <div className="lg:col-span-4 flex flex-col h-full">
          <JournalEntry onNewEntry={onNewEntry} />
        </div>
        
      </div>
    </div>
  );
}
