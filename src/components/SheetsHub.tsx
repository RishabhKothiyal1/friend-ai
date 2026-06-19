import React, { useState, useEffect } from "react";
import { 
  FileSpreadsheet, 
  RefreshCw, 
  Plus, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle,
  History,
  Activity,
  Heart
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SheetsHubProps {
  token: string | null;
  themeClass: (daylight: string, midnight: string, sepia: string) => string;
}

export default function SheetsHub({ token, themeClass }: SheetsHubProps) {
  const [spreadsheets, setSpreadsheets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Somatic tracking log states
  const [targetSpreadsheetId, setTargetSpreadsheetId] = useState<string>("");
  const [somaticState, setSomaticState] = useState("Calm & Grounded");
  const [breathingPace, setBreathingPace] = useState("6 breaths/min (Box breathing)");
  const [userNotes, setUserNotes] = useState("My nervous system feels a wave of restorative recovery.");

  const [activeTabMode, setActiveTabMode] = useState<"view" | "create_log">("create_log");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [newSheetTitle, setNewSheetTitle] = useState("Project Friend - Somatic Stress Tracker");

  // Security modals
  const [showConfirmCreate, setShowConfirmCreate] = useState(false);
  const [showConfirmLog, setShowConfirmLog] = useState(false);

  // Fetch Spreadsheets in Drive
  const fetchSpreadsheets = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      // Find files of spreadsheet mimeType
      const res = await fetch(
        "https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.spreadsheet'&fields=files(id,name,mimeType,modifiedTime,webViewLink)&orderBy=modifiedTime desc",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!res.ok) {
        throw new Error(`Drive Spreadsheet query failed: Status code ${res.status}`);
      }

      const data = await res.json();
      const list = data.files || [];
      setSpreadsheets(list);
      
      // Auto-select latest spreadsheet if none selected yet
      if (list.length > 0 && !targetSpreadsheetId) {
        setTargetSpreadsheetId(list[0].id);
      }
    } catch (err: any) {
      console.error("Sheets Listing Error:", err);
      setError(err?.message || "Failed to search spreadsheets in your Google Drive.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpreadsheets();
  }, [token]);

  // Create Spreadsheet
  const handleCreateSpreadsheet = async () => {
    if (!token) return;
    setIsSubmitting(true);
    setSuccessMessage(null);
    try {
      // Step 1: Create a brand new spreadsheet
      const createRes = await fetch("https://sheets.googleapis.com/v4/spreadsheets", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          properties: { title: newSheetTitle }
        })
      });

      if (!createRes.ok) {
        throw new Error(`Create spreadsheet failed: Status code ${createRes.status}`);
      }

      const sheetData = await createRes.json();
      const spreadsheetId = sheetData.spreadsheetId;

      // Step 2: Initialize headers
      const appendRes = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:D1:append?valueInputOption=USER_ENTERED`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            values: [["Timestamp (ISO)", "Somatic State", "Breathing Metric", "Grounding Log Notes"]]
          })
        }
      );

      if (!appendRes.ok) {
        console.warn("Failed to write table sheet headers, but spreadsheet was created.");
      }

      setSuccessMessage(`New spreadsheet "${newSheetTitle}" created with proper headers!`);
      setShowConfirmCreate(false);
      setTargetSpreadsheetId(spreadsheetId);
      fetchSpreadsheets();
    } catch (err: any) {
      console.error("Error creating tracker sheet:", err);
      alert(`Sheets creation failed: ${err?.message || "Check your integration scopes."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add Somatic Row line
  const handleAddSomaticLog = async () => {
    if (!token || !targetSpreadsheetId) {
      alert("Please select or create a stress-tracker spreadsheet first.");
      return;
    }
    setIsSubmitting(true);
    setSuccessMessage(null);
    try {
      const timestamp = new Date().toLocaleString();
      const rowData = [timestamp, somaticState, breathingPace, userNotes];

      const res = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${targetSpreadsheetId}/values/A:D:append?valueInputOption=USER_ENTERED`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            values: [rowData]
          })
        }
      );

      if (!res.ok) {
        throw new Error(`Sheets log append action failed: Status code ${res.status}`);
      }

      setSuccessMessage("Somatic calming log metrics successfully synced to Google Sheets row!");
      setShowConfirmLog(false);
      setUserNotes("");
    } catch (err: any) {
      console.error("Error writing sheets cell row:", err);
      alert(`Logging failed: ${err?.message || "Check if spreadsheet is writeable."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedSpreadsheetName = spreadsheets.find(s => s.id === targetSpreadsheetId)?.name || "N/A";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-sans">
      
      {/* Left Column: Logging Form */}
      <div className="lg:col-span-6 bg-white dark:bg-slate-950 p-5 rounded-2xl border border-black/5 space-y-4 text-left">
        <div className="flex items-center justify-between border-b border-black/5 pb-2">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide">
              Secure Breathing Log Hub
            </h2>
          </div>
          <div className="flex items-center border border-black/5 rounded-lg p-0.5 text-[10px] font-bold">
            <button
              onClick={() => setActiveTabMode("create_log")}
              className={`px-2 py-0.5 rounded ${activeTabMode === "create_log" ? "bg-emerald-50 text-emerald-700" : "text-slate-400"}`}
            >
              Add Log Entry
            </button>
            <button
              onClick={() => setActiveTabMode("create_sheet")}
              className={`px-2 py-0.5 rounded ${activeTabMode === "create_sheet" ? "bg-emerald-50 text-emerald-700" : "text-slate-400"}`}
            >
              Setup New Sheet
            </button>
          </div>
        </div>

        {activeTabMode === "create_log" ? (
          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-400">Target Tracker Spreadsheet</label>
              {spreadsheets.length === 0 ? (
                <p className="text-[11px] text-amber-600 mt-1 italic">
                  No spreadsheets found. Please click "Setup New Sheet" above first to start tracking.
                </p>
              ) : (
                <select 
                  value={targetSpreadsheetId} 
                  onChange={(e) => setTargetSpreadsheetId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-black border border-black/10 p-2 rounded-lg mt-1 outline-none text-slate-800 dark:text-slate-200"
                >
                  {spreadsheets.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400">Somatic Mind State</label>
                <select 
                  value={somaticState} 
                  onChange={(e) => setSomaticState(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-black border border-black/10 p-2 rounded-lg mt-1 outline-none text-slate-850 dark:text-slate-200"
                >
                  <option value="Calm & Grounded">Calm & Grounded</option>
                  <option value="Anxious / Restless">Anxious / Restless</option>
                  <option value="Tired / Fatigued">Tired / Fatigued</option>
                  <option value="Centred & Focused">Centred & Focused</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase text-slate-400">Breathing Pace Metric</label>
                <input 
                  type="text" 
                  value={breathingPace} 
                  onChange={(e) => setBreathingPace(e.target.value)}
                  placeholder="e.g. 5 breaths/min"
                  className="w-full bg-slate-50 dark:bg-black border border-black/10 p-2 rounded-lg mt-1 outline-none text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-400">Grounding Log Notes</label>
              <textarea
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                rows={3}
                className="w-full bg-slate-50 dark:bg-black border border-black/10 p-2 text-slate-705 dark:text-slate-300 rounded-lg mt-1 outline-none leading-relaxed"
                placeholder="How does your breathing make you feel under distress?"
              />
            </div>

            {successMessage && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-150 rounded-xl text-emerald-800 dark:text-emerald-300 text-[11px] font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={() => setShowConfirmLog(true)}
                disabled={spreadsheets.length === 0 || isSubmitting}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl cursor-pointer flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 text-xs"
              >
                <Activity className="w-4 h-4 shrink-0" />
                Append Somatic Log Line
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-400">New Spreadsheet Name</label>
              <input 
                type="text" 
                value={newSheetTitle} 
                onChange={(e) => setNewSheetTitle(e.target.value)}
                className="w-full bg-slate-50 dark:bg-black border border-black/10 p-2 rounded-lg mt-1 outline-none font-bold text-slate-800 dark:text-slate-200"
              />
              <p className="text-[10px] text-slate-400 mt-1.5 leading-normal">
                This creates a blank tracking log spreadsheet table with secure structure headers, formatted automatically for peer-session reference.
              </p>
            </div>

            {successMessage && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-150 rounded-xl text-emerald-800 dark:text-emerald-300 text-[11px] font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={() => setShowConfirmCreate(true)}
                disabled={isSubmitting || !newSheetTitle}
                className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-750 text-white font-bold rounded-xl cursor-pointer flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 text-xs"
              >
                <Plus className="w-4 h-4 shrink-0" />
                Provision Tracking Sheet
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Files List */}
      <div className="lg:col-span-6 space-y-3">
        <div className="flex items-center justify-between border-b border-black/5 pb-2.5">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wide">
              Spreadsheets in Google Drive
            </h3>
          </div>
          <button
            onClick={fetchSpreadsheets}
            disabled={loading}
            className="p-1 px-2.5 text-[10px] font-mono font-bold text-indigo-650 bg-indigo-50 dark:bg-white/[0.02]/40 rounded-lg cursor-pointer hover:bg-indigo-100/70 flex items-center gap-1.5 border border-indigo-150"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
            Sync List
          </button>
        </div>

        <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl max-h-[460px] overflow-y-auto divide-y divide-black/5 text-left">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-2 text-xs text-slate-405 font-mono">
              <RefreshCw className="w-5 h-5 animate-spin text-emerald-500" />
              <span>SCANNING STRESS TRACKERS...</span>
            </div>
          ) : error ? (
            <div className="py-12 px-4 text-center">
              <p className="text-red-500 text-xs font-bold font-mono">⚠️ SYNC_FAILED</p>
              <p className="text-slate-500 text-xs mt-1 leading-normal">{error}</p>
            </div>
          ) : spreadsheets.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400 italic">
              No spreadsheets located on your Google Drive.
            </div>
          ) : (
            spreadsheets.map((sheet) => {
              const isSelected = targetSpreadsheetId === sheet.id;
              return (
                <div key={sheet.id} className={`p-4 flex flex-col gap-1 hover:bg-slate-50/50 transition-all ${isSelected ? "bg-emerald-50/15 border-l-4 border-emerald-500" : ""}`}>
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-205">
                      {sheet.name || "(Unnamed Spreadsheet)"}
                    </h4>
                    {sheet.webViewLink && (
                      <a 
                        href={sheet.webViewLink} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[10px] text-emerald-600 hover:underline font-mono shrink-0 flex items-center gap-0.5"
                      >
                        Open <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[10px] text-slate-450 font-mono">
                    <span>Mod: {new Date(sheet.modifiedTime).toLocaleDateString()}</span>
                    <button
                      onClick={() => setTargetSpreadsheetId(sheet.id)}
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${isSelected ? "bg-emerald-100 text-emerald-800" : "bg-slate-105 hover:bg-slate-200 text-slate-600"}`}
                    >
                      {isSelected ? "Active Logger Target" : "Select Target"}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* SECURITY MODAL CONFIRMATION (MANDATORY FOR SHEET CREATION) */}
      <AnimatePresence>
        {showConfirmCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-black rounded-2xl max-w-md w-full p-6 border border-black/10 shadow-2xl space-y-4 text-left"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-xl text-amber-600 border border-amber-200">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    Consent to Initialize Spreadsheet
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1">
                    This will create a new Google Sheets file under your Drive account called **"{newSheetTitle}"** to serve as a tracker file.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmCreate(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleCreateSpreadsheet}
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-750 rounded-xl cursor-pointer shadow flex items-center gap-1"
                >
                  {isSubmitting ? "Creating..." : "Confirm & Setup"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SECURITY MODAL CONFIRMATION (MANDATORY FOR ADDING LOG ROW) */}
      <AnimatePresence>
        {showConfirmLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-black rounded-2xl max-w-md w-full p-6 border border-black/10 shadow-2xl space-y-4 text-left"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-xl text-amber-600 border border-amber-200">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    Consent to Log breathing Metric
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1">
                    You are transmitting somatic stress telemetry to append a new cell row into your Google Sheet: **"{selectedSpreadsheetName}"**. This is stored directly inside your Drive file.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl space-y-1 text-xs font-mono">
                <p><span className="text-slate-400">Spreadsheet:</span> <span className="text-slate-800 font-bold max-w-xs truncate inline-block">{selectedSpreadsheetName}</span></p>
                <p><span className="text-slate-400">State:</span> <span className="text-slate-700 font-medium">{somaticState}</span></p>
                <p><span className="text-slate-400">Metric:</span> <span className="text-slate-700 font-medium">{breathingPace}</span></p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmLog(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleAddSomaticLog}
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-750 rounded-xl cursor-pointer shadow"
                >
                  {isSubmitting ? "Syncing row..." : "Confirm & Commit"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
