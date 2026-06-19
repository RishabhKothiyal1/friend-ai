import React from 'react';
import { Activity, Heart, Shield, Zap } from 'lucide-react';

export function Metrics() {
  const stats = [
    { name: 'Wellness Score', value: '92', change: '+4.5%', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { name: 'Sessions', value: '24', change: '+12%', icon: Activity, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { name: 'Privacy Index', value: '100%', change: 'Secure', icon: Shield, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { name: 'Energy Level', value: 'High', change: 'Stable', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' },
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
            
            <div className="mt-4 flex items-center text-sm">
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                {stat.change}
              </span>
              <span className="ml-2 text-slate-500 dark:text-slate-400">vs last week</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
