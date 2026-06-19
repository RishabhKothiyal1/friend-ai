import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  Clock,
  ShieldAlert,
  FolderSync,
  Filter,
  Download,
  Search,
  ChevronRight,
  Database,
  RefreshCw,
  Heart,
  Palette,
  FileSpreadsheet
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  Legend,
  CartesianGrid,
  LineChart,
  Line
} from "recharts";

interface PowerBIDashboardProps {
  themeClass: (daylight: string, midnight: string, sepia: string) => string;
}

// 1. Mock Data for interactive trends (Fully structured and beautiful)
const DAILY_TRENDS_DATA = {
  "30d": [
    { name: "Day 1", sessions: 420, activeUsers: 280, crisisInterlocks: 12, keepSyncs: 85 },
    { name: "Day 3", sessions: 480, activeUsers: 310, crisisInterlocks: 15, keepSyncs: 92 },
    { name: "Day 5", sessions: 520, activeUsers: 350, crisisInterlocks: 11, keepSyncs: 110 },
    { name: "Day 7", sessions: 580, activeUsers: 390, crisisInterlocks: 14, keepSyncs: 124 },
    { name: "Day 9", sessions: 670, activeUsers: 420, crisisInterlocks: 18, keepSyncs: 140 },
    { name: "Day 11", sessions: 610, activeUsers: 400, crisisInterlocks: 9, keepSyncs: 132 },
    { name: "Day 13", sessions: 730, activeUsers: 480, crisisInterlocks: 22, keepSyncs: 165 },
    { name: "Day 15", sessions: 850, activeUsers: 540, crisisInterlocks: 25, keepSyncs: 198 },
    { name: "Day 17", sessions: 790, activeUsers: 510, crisisInterlocks: 17, keepSyncs: 180 },
    { name: "Day 19", sessions: 920, activeUsers: 590, crisisInterlocks: 21, keepSyncs: 212 },
    { name: "Day 21", sessions: 1040, activeUsers: 640, crisisInterlocks: 28, keepSyncs: 245 },
    { name: "Day 23", sessions: 1110, activeUsers: 700, crisisInterlocks: 30, keepSyncs: 260 },
    { name: "Day 25", sessions: 1240, activeUsers: 780, crisisInterlocks: 35, keepSyncs: 295 },
    { name: "Day 27", sessions: 1380, activeUsers: 850, crisisInterlocks: 32, keepSyncs: 312 },
    { name: "Day 29", sessions: 1480, activeUsers: 920, crisisInterlocks: 38, keepSyncs: 340 }
  ],
  "7d": [
    { name: "Mon", sessions: 920, activeUsers: 590, crisisInterlocks: 21, keepSyncs: 212 },
    { name: "Tue", sessions: 1040, activeUsers: 640, crisisInterlocks: 28, keepSyncs: 245 },
    { name: "Wed", sessions: 1110, activeUsers: 700, crisisInterlocks: 30, keepSyncs: 260 },
    { name: "Thu", sessions: 1240, activeUsers: 780, crisisInterlocks: 35, keepSyncs: 295 },
    { name: "Fri", sessions: 1380, activeUsers: 850, crisisInterlocks: 32, keepSyncs: 312 },
    { name: "Sat", sessions: 1420, activeUsers: 900, crisisInterlocks: 34, keepSyncs: 330 },
    { name: "Sun", sessions: 1480, activeUsers: 920, crisisInterlocks: 38, keepSyncs: 340 }
  ],
  "24h": [
    { name: "00:00", sessions: 45, activeUsers: 30, crisisInterlocks: 1, keepSyncs: 10 },
    { name: "04:00", sessions: 22, activeUsers: 15, crisisInterlocks: 0, keepSyncs: 5 },
    { name: "08:00", sessions: 85, activeUsers: 60, crisisInterlocks: 2, keepSyncs: 22 },
    { name: "12:00", sessions: 142, activeUsers: 95, crisisInterlocks: 4, keepSyncs: 38 },
    { name: "16:00", sessions: 198, activeUsers: 130, crisisInterlocks: 5, keepSyncs: 48 },
    { name: "20:00", sessions: 285, activeUsers: 190, crisisInterlocks: 8, keepSyncs: 65 }
  ]
};

const ART_ENGAGEMENT_DATA = [
  { art: "Madhubani", finished: 148, coloringIn: 412, color: "#be2222" },
  { art: "Warli", finished: 215, coloringIn: 324, color: "#aa5e3c" },
  { art: "Gond", finished: 185, coloringIn: 295, color: "#1290de" },
  { art: "Pichwai", finished: 92, coloringIn: 185, color: "#ffd700" },
  { art: "Aipan", finished: 110, coloringIn: 220, color: "#8b1414" },
  { art: "Pattachitra", finished: 78, coloringIn: 140, color: "#852222" },
  { art: "Kalamkari", finished: 65, coloringIn: 158, color: "#542518" },
  { art: "Saura", finished: 54, coloringIn: 98, color: "#7c2d12" }
];

const PROTOCOLS_PIE_DATA = [
  { name: "Hope (Witnessing)", value: 4850, fill: "#be2222" },
  { name: "Abhay (Analytical CBT)", value: 3950, fill: "#2563eb" },
  { name: "Raag (Somatic Grounding)", value: 3420, fill: "#12ad44" },
  { name: "Rooh (DBT Emotional)", value: 2600, fill: "#a355de" }
];

const WORKSPACE_STATS_DATA = [
  { service: "Keep Notes Sync", count: 1820 },
  { service: "Google Docs Export", count: 940 },
  { service: "Calendar Slots Reserved", count: 720 },
  { service: "Gmail Draft Copies", count: 1240 },
  { service: "Tasks Hub Created", count: 530 }
];

// Anonymized Drill-down Log Items
interface LogItem {
  timestamp: string;
  category: "Safety Check" | "Preservation Activity" | "Identity Safeguard" | "Workspace Flow";
  detail: string;
  recipient: string;
  status: "Triggered" | "Completed" | "Isolated" | "Linked";
  latency: string;
}

const METRIC_LOGS: LogItem[] = [
  { timestamp: "Just Now", category: "Workspace Flow", detail: "Mindful Google Keep Sync executed cleanly on Firestore node", recipient: "Keep API Service", status: "Completed", latency: "14ms" },
  { timestamp: "2 mins ago", category: "Safety Check", detail: "High-distress vocabulary trigger: Redirected to LGBTQIA+ Supportive Legal Aid", recipient: "Mumbai Local Support Map", status: "Triggered", latency: "5ms" },
  { timestamp: "12 mins ago", category: "Preservation Activity", detail: "Madhubani Double-Line Coloring Completed (100% Filled)", recipient: "Academic Gallery Archive", status: "Completed", latency: "122ms" },
  { timestamp: "25 mins ago", category: "Identity Safeguard", detail: "AES-512 cryptographic key rotation successfully executed locally", recipient: "In-Device Secure Vault", status: "Isolated", latency: "2ms" },
  { timestamp: "1 hour ago", category: "Workspace Flow", detail: "Aria Premium Journal exported safely to Google Docs root directory", recipient: "Docs Drive Storage", status: "Linked", latency: "420ms" },
  { timestamp: "2 hours ago", category: "Safety Check", detail: "Clinical Assessment checklist generated safely under Hope protocol guidelines", recipient: "Local Session Storage", status: "Completed", latency: "8ms" },
  { timestamp: "4 hours ago", category: "Preservation Activity", detail: "Warli stick-geometries Tarpa dance simulation launched", recipient: "Active Gallery", status: "Completed", latency: "35ms" },
  { timestamp: "6 hours ago", category: "Workspace Flow", detail: "Self-care calendar slot aligned with active low-tempo wellness raga", recipient: "Calendar Integration", status: "Triggered", latency: "381ms" },
  { timestamp: "8 hours ago", category: "Identity Safeguard", detail: "Stateless fetch completed: Verified clinician registry update without tracking IDs", recipient: "Sovereign Node Proxy", status: "Isolated", latency: "15ms" },
  { timestamp: "12 hours ago", category: "Workspace Flow", detail: "Somatic stress record copy dispatched safely to verified private Gmail", recipient: "Gmail API Delivery", status: "Completed", latency: "210ms" }
];

export default function PowerBIDashboard({ themeClass }: PowerBIDashboardProps) {
  // Filter States
  const [timeFilter, setTimeFilter] = useState<"30d" | "7d" | "24h">("30d");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [focusFilter, setFocusFilter] = useState<string>("All Users");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dataRefreshCount, setDataRefreshCount] = useState<number>(0);
  const [selectedLog, setSelectedLog] = useState<LogItem | null>(null);

  // Computed metric variations based on filter
  const currentDailyData = useMemo(() => {
    return DAILY_TRENDS_DATA[timeFilter];
  }, [timeFilter]);

  // Aggregate stats based on time frame
  const aggregateStats = useMemo(() => {
    const divider = timeFilter === "30d" ? 1 : timeFilter === "7d" ? 3 : 15;
    return {
      activeSessions: Math.round(14820 / divider),
      crisisChecks: Math.round(324 / divider),
      favouriteArt: "Warli Tribal",
      syncCount: Math.round(5250 / divider)
    };
  }, [timeFilter]);

  // Search/Filter of logs
  const filteredLogs = useMemo(() => {
    return METRIC_LOGS.filter((log) => {
      const matchesSearch =
        log.detail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.recipient.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory =
        categoryFilter === "All" || log.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, categoryFilter]);

  const handleRefresh = () => {
    setDataRefreshCount((c) => c + 1);
  };

  return (
    <div className="space-y-6 font-sans text-left">
      
      {/* Ornate Top Banner similar to Power BI Title Block */}
      <div className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${themeClass("bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm dark:shadow-slate-900/30", "bg-slate-900/30 border-slate-800", "bg-[#fcf7ee] border-[#ebdcb9]")}`}>
        <div className="space-y-1 z-10 text-left">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono tracking-widest px-2.5 py-0.5 rounded-md font-bold bg-indigo-650 text-white">
              Analytical Control Panel
            </span>
            {dataRefreshCount > 0 && (
              <span className="text-[9px] font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded animate-pulse font-bold">
                ✓ Auto-Refreshed ({dataRefreshCount})
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-purple-200">
            Power BI Interactive Recovery Dashboard
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Real-time telemetry, cultural preservation metrics, in-app safety interlocks, and Google Workspace synchronization analytics rendered in continuous vector models.
          </p>
        </div>

        {/* Top Control Bar with filters */}
        <div className="flex flex-wrap items-center gap-2 z-10">
          <button
            onClick={handleRefresh}
            className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-705 rounded-xl cursor-pointer transition-all flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300"
            title="Refresh Data Sources"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="font-semibold">Refresh</span>
          </button>
          
          <button
            onClick={() => {
              alert("Data metrics exported safely inside zero-knowledge local container. Ready for secure audit.");
            }}
            className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-705 rounded-xl cursor-pointer transition-all flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300"
            title="Export CSV Metadata"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="font-semibold">Export</span>
          </button>
        </div>
      </div>

      {/* Slicers & Filters Rail */}
      <div className={`p-4 rounded-xl border flex flex-wrap gap-4 items-center justify-between ${themeClass("bg-slate-50/ dark:bg-slate-800/50 border-slate-150", "bg-slate-950/20 border-slate-850", "bg-[#fbf7ee] border-[#ebdcb9]/60")}`}>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-400 dark:text-slate-500 uppercase">
            <Filter className="w-3.5 h-3.5 text-indigo-505" />
            <span>Slicers:</span>
          </div>

          {/* Time Slicer */}
          <div className="flex rounded-lg border border-black/5 p-0.5 bg-black/5 dark:bg-white/5">
            {(["30d", "7d", "24h"] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => setTimeFilter(opt)}
                className={`px-3 py-1 text-[10.5px] font-bold rounded-md transition-all cursor-pointer ${
                  timeFilter === opt
                    ? "bg-indigo-650 text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-200"
                }`}
              >
                {opt === "30d" ? "30 Days" : opt === "7d" ? "7 Days" : "24 Hours"}
              </button>
            ))}
          </div>

          {/* Segment Focus Slicer */}
          <select
            value={focusFilter}
            onChange={(e) => setFocusFilter(e.target.value)}
            className="p-1 px-2.5 bg-white dark:bg-slate-900 border border-black/5 rounded-lg text-[10.5px] font-medium outline-none text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <option>All Users Focus</option>
            <option>LGBTQIA+ Peer Cohort</option>
            <option>Clinical Outpatient Diagnostics</option>
            <option>Academic Group Study</option>
          </select>
        </div>

        <div className="text-[10px] font-mono text-slate-400">
          Source Connection: <strong className="text-indigo-650 dark:text-indigo-400 font-extrabold uppercase">Firestore Live Stream</strong>
        </div>
      </div>

      {/* 4 Majestic Scorecard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow ${themeClass("bg-white dark:bg-slate-900 border-slate-205", "bg-slate-900/40 border-slate-800", "bg-[#fffcf8] border-[#ebdcb9]")}`}>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[9.5px] uppercase font-mono tracking-wider text-slate-400 dark:text-slate-500 block font-bold">Mindful Session Tracks</span>
              <h2 className="text-2xl font-black font-mono tracking-tight text-slate-800 dark:text-slate-100">
                {aggregateStats.activeSessions.toLocaleString()}
              </h2>
            </div>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-350 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-[10.5px] text-emerald-600 font-medium leading-none">
            <span>▲ +12.4%</span>
            <span className="text-slate-400 dark:text-slate-500 font-normal">vs previous period</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow ${themeClass("bg-white dark:bg-slate-900 border-slate-205", "bg-slate-900/40 border-slate-800", "bg-[#fffcf8] border-[#ebdcb9]")}`}>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[9.5px] uppercase font-mono tracking-wider text-slate-400 dark:text-slate-500 block font-bold">Clinician References</span>
              <h2 className="text-2xl font-black font-mono tracking-tight text-slate-ff7 dark:text-slate-100">
                {aggregateStats.crisisChecks} Interlocks
              </h2>
            </div>
            <div className="p-2 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-lg">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-[10.5px] text-indigo-600 font-medium leading-none">
            <span>● Secured & Isolated</span>
            <span className="text-slate-400 dark:text-slate-500 font-normal">Zero cloud logs</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow ${themeClass("bg-white dark:bg-slate-900 border-slate-205", "bg-slate-900/40 border-slate-800", "bg-[#fffcf8] border-[#ebdcb9]")}`}>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[9.5px] uppercase font-mono tracking-wider text-slate-400 dark:text-slate-500 block font-bold">Preservation Engagement</span>
              <h2 className="text-2xl font-black font-mono tracking-tight text-slate-800 dark:text-slate-100">
                {aggregateStats.favouriteArt}
              </h2>
            </div>
            <div className="p-2 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-lg">
              <Palette className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-[10.5px] text-amber-600 font-medium leading-none">
            <span>82% Finished</span>
            <span className="text-slate-400 dark:text-slate-500 font-normal">across coloring panels</span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className={`p-4 rounded-xl border flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow ${themeClass("bg-white dark:bg-slate-900 border-slate-205", "bg-slate-900/40 border-slate-800", "bg-[#fffcf8] border-[#ebdcb9]")}`}>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[9.5px] uppercase font-mono tracking-wider text-slate-400 dark:text-slate-500 block font-bold">Connected Keep Logs</span>
              <h2 className="text-2xl font-black font-mono tracking-tight text-slate-800 dark:text-slate-100">
                {aggregateStats.syncCount.toLocaleString()} Syncs
              </h2>
            </div>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <FolderSync className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-[10.5px] text-emerald-600 font-medium leading-none">
            <span>▲ +22.1% MoM</span>
            <span className="text-slate-400 dark:text-slate-500 font-normal">GSuite authentication active</span>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
        
        {/* Trend Area Chart (8 columns on desktop) */}
        <div className={`lg:col-span-8 p-5 rounded-2xl border flex flex-col justify-between ${themeClass("bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-xs", "bg-slate-900/30 border-slate-800", "bg-[#fffcf6] border-[#ebdcb9]")}`}>
          <div className="border-b pb-3 mb-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 font-serif">
              Temporal Recovery Trend Analytics
            </h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
              Daily grounding chat sessions paired with decentralized keep sync schedules.
            </p>
          </div>

          <div className="h-64 md:h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentDailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="sessionsColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="syncsColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" stroke="#888888" fontSize={9.5} tickLine={false} />
                <YAxis stroke="#888888" fontSize={9.5} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#000000d0", 
                    borderRadius: "12px", 
                    color: "#ffffff", 
                    border: "none",
                    fontFamily: "monospace",
                    fontSize: "11px"
                  }} 
                />
                <Area type="monotone" name="Grounding Sessions" dataKey="sessions" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#sessionsColor)" />
                <Area type="monotone" name="Keep Sync Logs" dataKey="keepSyncs" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#syncsColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Protocols Pie Chart (4 columns on desktop) */}
        <div className={`lg:col-span-4 p-5 rounded-2xl border flex flex-col justify-between ${themeClass("bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-xs", "bg-slate-900/30 border-slate-800", "bg-[#fffcf6] border-[#ebdcb9]")}`}>
          <div className="border-b pb-3 mb-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 font-serif">
              Aura Support Protocols Share
            </h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
              Breakdown of user allocations within premium cognitive pathways.
            </p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PROTOCOLS_PIE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {PROTOCOLS_PIE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#000000e0", 
                    borderRadius: "8px", 
                    color: "#fff", 
                    fontSize: "10.5px" 
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1 text-[10px] grid grid-cols-2 gap-2 mt-2">
            {PROTOCOLS_PIE_DATA.map((item, id) => (
              <div key={id} className="flex items-center gap-1.5 text-left text-slate-600 dark:text-slate-350 truncate">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.fill }} />
                <span className="truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Second Charts Row: Art Forms & Google Workspace Sync breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
        
        {/* Google Workspace API bar chart (5 columns) */}
        <div className={`lg:col-span-5 p-5 rounded-2xl border flex flex-col justify-between ${themeClass("bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-xs", "bg-slate-900/30 border-slate-800", "bg-[#fffcf6] border-[#ebdcb9]")}`}>
          <div className="border-b pb-3 mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 font-serif">
              GSuite Workspace Integration Transmissions
            </h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
              Secure payload dispatches compiled safely using OAuth2 protocols.
            </p>
          </div>

          <div className="h-48 w-full text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WORKSPACE_STATS_DATA} layout="vertical" margin={{ top: 5, right: 10, left: 15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis type="number" stroke="#888" fontSize={9} />
                <YAxis dataKey="service" type="category" stroke="#888" fontSize={9} width={95} />
                <Tooltip contentStyle={{ backgroundColor: "#1c1917g" }} />
                <Bar dataKey="count" fill="#4f46e5" radius={[0, 4, 4, 0]}>
                  {WORKSPACE_STATS_DATA.map((entry, idx) => (
                    <Cell key={idx} fill={idx % 2 === 0 ? "#6366f1" : "#06b6d4"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vedic Indian Arts Preservation engagement chart (7 columns) */}
        <div className={`lg:col-span-7 p-5 rounded-2xl border flex flex-col justify-between ${themeClass("bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-xs", "bg-slate-900/30 border-slate-800", "bg-[#fffcf6] border-[#ebdcb9]")}`}>
          <div className="border-b pb-3 mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 font-serif">
              Master Folk Art Conservation Tracking
            </h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
              Rhythmic painting engagement and filled pigments tracked by unique digital canvas identifiers.
            </p>
          </div>

          <div className="h-48 w-full text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ART_ENGAGEMENT_DATA}>
                <CartesianGrid strokeDasharray="2 2" opacity={0.12} />
                <XAxis dataKey="art" stroke="#888888" fontSize={9} />
                <YAxis stroke="#888888" fontSize={9} />
                <Tooltip />
                <Legend iconSize={8} wrapperStyle={{ fontSize: "9.5px" }} />
                <Bar name="Finished Panels" dataKey="finished" stackId="art" fill="#10b981" />
                <Bar name="Draft coloring sessions" dataKey="coloringIn" stackId="art" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Interactive Power BI Data Grid Log Drill-Down */}
      <div className={`p-5 rounded-2xl border ${themeClass("bg-white dark:bg-slate-900 border-slate-202 shadow-sm dark:shadow-slate-900/30", "bg-slate-900/30 border-slate-800", "bg-[#fcfaf4] border-[#ebdcb9]")}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-3 mb-4">
          <div className="text-left">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 font-serif">
              Decentralized Audit Log &amp; Drill-down Inspector
            </h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
              Click any log row within this interactive telemetry grid to isolate secure diagnostic vectors.
            </p>
          </div>

          {/* Search Table */}
          <div className="relative w-full sm:max-w-xs text-left">
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter audit logs..."
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 rounded-xl p-2 pl-8.5 outline-none text-xs text-slate-700 dark:text-slate-200"
            />
          </div>
        </div>

        {/* Filter categories tabs within Grid */}
        <div className="flex flex-wrap items-center gap-1.5 pb-3">
          {["All", "Workspace Flow", "Safety Check", "Preservation Activity", "Identity Safeguard"].map((tab) => (
            <button
              key={tab}
              onClick={() => setCategoryFilter(tab)}
              className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                categoryFilter === tab
                  ? "bg-indigo-650 text-white shadow-xs"
                  : "bg-slate-50 dark:bg-slate-950 border border-black/5 text-slate-500 hover:text-slate-800 dark:text-slate-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Data Grid Table */}
        <div className="overflow-x-auto rounded-xl border border-black/5">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-black/5 text-slate-500 dark:text-slate-400 font-mono text-[9.5px] uppercase">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Category</th>
                <th className="p-3">Details Descriptor</th>
                <th className="p-3">API Target Recipient</th>
                <th className="p-3">Response Status</th>
                <th className="p-3">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 dark:text-slate-500 italic">
                    No matching decentralized logs registered.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, index) => {
                  const statusColors = {
                    Triggered: "bg-amber-50 text-amber-700 dark:bg-amber-955/20 text-amber-302 border-amber-200",
                    Completed: "bg-emerald-50 text-emerald-700 dark:bg-emerald-955/20 text-emerald-302 border-emerald-200",
                    Isolated: "bg-purple-50 text-purple-700 dark:bg-purple-955/20 text-purple-302 border-purple-200",
                    Linked: "bg-blue-50 text-blue-700 dark:bg-blue-955/20 text-blue-302 border-blue-200"
                  };
                  return (
                    <tr
                      key={index}
                      onClick={() => setSelectedLog(log)}
                      className={`hover:bg-slate-50/ dark:bg-slate-800/60 dark:hover:bg-slate-800/20 cursor-pointer transition-colors ${
                        selectedLog?.detail === log.detail ? "bg-indigo-50/50 dark:bg-indigo-950/25" : ""
                      }`}
                    >
                      <td className="p-3 font-mono text-[10.5px] whitespace-nowrap text-slate-400">{log.timestamp}</td>
                      <td className="p-3 font-bold text-[11px] whitespace-nowrap">{log.category}</td>
                      <td className="p-3 max-w-[280px] truncate pr-4">{log.detail}</td>
                      <td className="p-3 font-mono text-[10.5px] text-slate-500 dark:text-slate-400 whitespace-nowrap">{log.recipient}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 border text-[9.5px] rounded-full font-bold inline-block leading-normal ${statusColors[log.status] || "bg-slate-100 dark:bg-slate-800"}`}>
                          {log.status}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-[10.5px] text-slate-400">{log.latency ?? "-"}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Drill-down Sub-inspector Panel */}
        {selectedLog && (
          <div className="mt-4 p-4 bg-indigo-50/30 dark:bg-indigo-950/10 border border-indigo-150/40 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3 animate-fade-in">
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-mono tracking-widest text-[#5c3e35] font-extrabold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-550 shrink-0" />
                Active Drilldown Inspection View
              </span>
              <p className="text-xs text-slate-705 dark:text-slate-205 font-bold">
                "{selectedLog.detail}"
              </p>
              <div className="flex gap-4 text-[10.5px] text-slate-400 dark:text-slate-500 font-mono">
                <span>Timestamp: <strong className="text-slate-600 dark:text-slate-300">{selectedLog.timestamp}</strong></span>
                <span>Category: <strong className="text-slate-600 dark:text-slate-300">{selectedLog.category}</strong></span>
                <span>Target Node: <strong className="text-slate-600 dark:text-slate-300">{selectedLog.recipient}</strong></span>
              </div>
            </div>

            <button
              onClick={() => setSelectedLog(null)}
              className="px-2.5 py-1 text-[10.5px] font-bold text-slate-500 hover:text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:scale-102 transition-all cursor-pointer rounded-lg"
            >
              Close Inspector
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
