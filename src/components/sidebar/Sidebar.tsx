import React, { useState } from "react";
import { 
  MessageSquare, 
  BarChart2, 
  Book, 
  Wind, 
  Settings, 
  ShieldCheck, 
  FileText, 
  Palette, 
  Briefcase, 
  Mail, 
  Users,
  Moon,
  Sun,
  Brain,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
  Trash2
} from "lucide-react";

interface SidebarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenClinicalDirectory: () => void;
  zenMode: boolean;
  onToggleZenMode: () => void;
  themeMode: string;
  onThemeChange: (theme: string) => void;
  alias: string;
  onLogout?: () => void;
  onNewChat?: () => void;
  onSearchClick?: () => void;
  sessions?: any[];
  onSelectSession?: (id: string) => void;
  onDeleteSession?: (id: string) => void;
}

export function Sidebar({
  isSidebarOpen,
  onToggleSidebar,
  activeTab,
  onTabChange,
  onOpenClinicalDirectory,
  zenMode,
  onToggleZenMode,
  themeMode,
  onThemeChange,
  alias,
  onLogout,
  onNewChat,
  onSearchClick,
  sessions = [],
  onSelectSession,
  onDeleteSession
}: SidebarProps) {
  const [historySearchQuery, setHistorySearchQuery] = useState("");
  const navItems = [
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'letters', label: 'Letters', icon: Mail },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'journal', label: 'Journal', icon: Book },
    { id: 'wellness', label: 'Wellness', icon: Wind },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const toolsItems = [
    { id: 'blogs', label: 'Curated Blogs', icon: FileText },
    { id: 'doodle', label: 'Do Doodle', icon: Palette, externalUrl: 'https://do-doodle.netlify.app/' },
    { id: 'mood', label: 'Mood Analytics', icon: Briefcase },
    { id: 'community', label: 'Community Center', icon: Users },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          onClick={onToggleSidebar}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] md:hidden cursor-pointer animate-fade-in"
        />
      )}
      
      <div className={`
        ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full md:translate-x-0'} 
        transition-all duration-300 h-screen 
        fixed md:sticky inset-y-0 left-0 z-[9999] md:z-auto
        bg-slate-50 dark:bg-black border-r border-slate-200 dark:border-white/10 
        flex flex-col shrink-0 overflow-y-auto overflow-x-hidden 
        ${!isSidebarOpen && 'hidden md:flex'}
      `}>
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
          <div className={`flex items-center gap-3 ${!isSidebarOpen && 'hidden'}`}>
            <img 
              src="/friend_ai_logo.png" 
              alt="friend ai logo" 
              className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-white/10 shrink-0 shadow-sm"
            />
            <div>
              <h1 className="font-bold text-xl tracking-tight whitespace-nowrap text-slate-900 dark:text-white">friend <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">ai</span></h1>
              <p className="text-xs text-slate-400 font-mono truncate w-24">{alias}</p>
            </div>
          </div>
          <button 
            onClick={onToggleSidebar}
            className={`p-2 text-slate-400 hover:text-white hover:bg-slate-200 dark:hover:bg-[#0a0a0a] rounded-lg transition-colors cursor-pointer ${!isSidebarOpen && 'mx-auto'}`}
            title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
          >
            {isSidebarOpen ? (
              <PanelLeftClose className="w-5 h-5" />
            ) : (
              <img 
                src="/friend_ai_logo.png" 
                alt="Mascot Logo" 
                className="w-8 h-8 rounded-full border border-slate-200 dark:border-white/20 object-cover hover:scale-105 active:scale-95 transition-all shadow"
              />
            )}
          </button>
        </div>

      {isSidebarOpen ? (
        <>
          {/* Main Navigation */}
          <div className="p-4 space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3">Main</p>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium cursor-pointer ${
                    isActive 
                      ? "bg-indigo-500/10 text-indigo-400" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#0a0a0a]/50 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tools & Integrations */}
          <div className="p-4 space-y-1 border-t border-slate-200 dark:border-white/10/50">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-3">Integrations</p>
            {toolsItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.externalUrl) {
                      window.location.href = item.externalUrl;
                    } else {
                      onTabChange(item.id);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium cursor-pointer ${
                    isActive 
                      ? "bg-indigo-500/10 text-indigo-400" 
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#0a0a0a]/50 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">{item.label}</span>
                </button>
              );
            })}
            
            <button
              onClick={onOpenClinicalDirectory}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium text-emerald-400 hover:bg-emerald-500/10 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">Clinical Directory</span>
            </button>
          </div>


          <div className="mt-auto p-4 border-t border-slate-200 dark:border-white/10">
          </div>
        </>
      ) : (
        /* Closed state navigation options: only New Chat, Search, and Settings */
        <div className="flex-1 flex flex-col items-center gap-6 py-6 w-full">
          {/* New Chat */}
          <button
            onClick={() => {
              if (onNewChat) onNewChat();
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-all cursor-pointer shadow active:scale-95"
            title="New Chat"
          >
            <Plus className="w-5 h-5 stroke-[2.2]" />
          </button>

          {/* Search */}
          <button
            onClick={() => {
              if (onSearchClick) onSearchClick();
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/[0.05] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer active:scale-95"
            title="Search guides/specializations"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Settings */}
          <button
            onClick={() => onTabChange('settings')}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
              activeTab === 'settings'
                ? "bg-indigo-500/10 text-indigo-400"
                : "hover:bg-slate-200 dark:hover:bg-white/[0.05] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
    </>
  );
}
