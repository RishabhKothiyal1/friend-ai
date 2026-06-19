import React, { useState, useEffect } from "react";
import { 
  Presentation, 
  RefreshCw, 
  Plus, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle,
  History,
  Sparkles,
  Layers
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SlidesHubProps {
  token: string | null;
  themeClass: (daylight: string, midnight: string, sepia: string) => string;
}

export default function SlidesHub({ token, themeClass }: SlidesHubProps) {
  const [presentations, setPresentations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Slides configuration states
  const [deckTitle, setDeckTitle] = useState("✨ Daily Affirmation Deck");
  const [activeTabMode, setActiveTabMode] = useState<"view" | "create_deck">("create_deck");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Security modals
  const [showConfirmCreate, setShowConfirmCreate] = useState(false);

  // Fetch Presentations in Drive
  const fetchPresentations = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        "https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.presentation'&fields=files(id,name,mimeType,modifiedTime,webViewLink)&orderBy=modifiedTime desc",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!res.ok) {
        throw new Error(`Drive Presentations scan failed: Status code ${res.status}`);
      }

      const data = await res.json();
      setPresentations(data.files || []);
    } catch (err: any) {
      console.error("Slides query failure:", err);
      setError(err?.message || "Failed to search slides deck files on your Drive.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPresentations();
  }, [token]);

  // Create Google Presentation
  const handleCreatePresentation = async () => {
    if (!token) return;
    setIsSubmitting(true);
    setSuccessMessage(null);
    try {
      const createRes = await fetch("https://slides.googleapis.com/v1/presentations", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: deckTitle
        })
      });

      if (!createRes.ok) {
        throw new Error(`Slides creation failed: Status code ${createRes.status}`);
      }

      setSuccessMessage(`New presentation deck "${deckTitle}" has been set up successfully on Drive!`);
      setShowConfirmCreate(false);
      fetchPresentations();
    } catch (err: any) {
      console.error("Error creating slides:", err);
      alert(`Slides creation failed: ${err?.message || "Verify your permission settings."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-sans">
      
      {/* Left Column: Create slides */}
      <div className="lg:col-span-6 bg-white dark:bg-slate-950 p-5 rounded-2xl border border-black/5 space-y-4 text-left">
        <div className="flex items-center justify-between border-b border-black/5 pb-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-rose-500" />
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide">
              Affirmation Deck Builder
            </h2>
          </div>
          <div className="flex items-center border border-black/5 rounded-lg p-0.5 text-[10px] font-bold">
            <button
              onClick={() => setActiveTabMode("create_deck")}
              className={`px-2.5 py-0.5 rounded ${activeTabMode === "create_deck" ? "bg-rose-50 text-rose-750" : "text-slate-400"}`}
            >
              Configure Deck
            </button>
          </div>
        </div>

        <div className="space-y-3.5 text-xs font-sans">
          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-400">Presentation Deck Title</label>
            <input 
              type="text" 
              value={deckTitle} 
              onChange={(e) => setDeckTitle(e.target.value)}
              className="w-full bg-slate-50 dark:bg-black border border-black/10 p-2 rounded-lg mt-1 outline-none font-bold text-slate-800 dark:text-slate-200"
              placeholder="e.g. Guided Focus Deck"
            />
          </div>

          <div className="text-[10.5px] leading-relaxed text-slate-500 p-3 bg-rose-50/10 rounded-xl border border-rose-100/30">
            🌿 Perfect for organizing positive mental states and box-breathing step-by-step slides. This will create a fresh presentation deck within your workspace so you can keep track of custom grounding materials visually.
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
              disabled={isSubmitting || !deckTitle}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl cursor-pointer flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 text-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Scaffold Presentation on Drive
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Presentations List */}
      <div className="lg:col-span-6 space-y-3">
        <div className="flex items-center justify-between border-b border-black/5 pb-2.5">
          <div className="flex items-center gap-2">
            <Presentation className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wide">
              Synced Deck Files on Drive
            </h3>
          </div>
          <button
            onClick={fetchPresentations}
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
              <RefreshCw className="w-5 h-5 animate-spin text-rose-500" />
              <span>SCANNING PRESENTATIONS...</span>
            </div>
          ) : error ? (
            <div className="py-12 px-4 text-center">
              <p className="text-red-500 text-xs font-bold font-mono">⚠️ SYNC_FAILED</p>
              <p className="text-slate-500 text-xs mt-1 leading-normal">{error}</p>
            </div>
          ) : presentations.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400 italic">
              No Slides decks located on your Google Drive.
            </div>
          ) : (
            presentations.map((deck) => {
              return (
                <div key={deck.id} className="p-4 flex flex-col gap-1 hover:bg-slate-50/50 transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-xs font-bold text-slate-850 dark:text-slate-205">
                      {deck.name || "(Unnamed Slideshow)"}
                    </h4>
                    {deck.webViewLink && (
                      <a 
                        href={deck.webViewLink} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[10px] text-indigo-600 hover:underline font-mono shrink-0 flex items-center gap-0.5"
                      >
                        Open <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[10px] text-slate-450 font-mono">
                    <span>Mod: {new Date(deck.modifiedTime).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* SECURITY MODAL CONFIRMATION (MANDATORY FOR ACTION) */}
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
                    Consent to Create Slides Presentation
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1">
                    You are granting Project Friend AI permission to create a new, blank slideshow in Google Drive called **"{deckTitle}"** to visualize physical recovery rhythms.
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
                  onClick={handleCreatePresentation}
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-750 rounded-xl cursor-pointer shadow flex items-center gap-1"
                >
                  {isSubmitting ? "Creating..." : "Confirm & Setup"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
