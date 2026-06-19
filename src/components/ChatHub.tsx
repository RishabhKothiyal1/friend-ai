import React, { useState, useEffect } from "react";
import { 
  MessageSquare, 
  Send, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle,
  Sparkles,
  Users,
  CheckCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ChatHubProps {
  token: string | null;
  themeClass: (daylight: string, midnight: string, sepia: string) => string;
}

export default function ChatHub({ token, themeClass }: ChatHubProps) {
  const [spaces, setSpaces] = useState<any[]>([]);
  const [selectedSpaceId, setSelectedSpaceId] = useState<string>("");
  const [loadingSpaces, setLoadingSpaces] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Message draft state
  const [messageText, setMessageText] = useState("🌟 Breathing Check-in: If you are reading this, let's stop, relax our shoulders, and take three restorative deep breaths together. I'm here if you want to talk.");
  const [isSending, setIsSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showConfirmSend, setShowConfirmSend] = useState(false);

  const fetchSpaces = async () => {
    if (!token) return;
    setLoadingSpaces(true);
    setError(null);
    try {
      // Fetch Google Chat Spaces
      const res = await fetch("https://chat.googleapis.com/v1/spaces", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        throw new Error(`Google Chat Spaces fetch failed: Status code ${res.status}`);
      }

      const data = await res.json();
      const items = data.spaces || [];
      setSpaces(items);

      if (items.length > 0 && !selectedSpaceId) {
        setSelectedSpaceId(items[0].name); // e.g. "spaces/AXCXasf12"
      }
    } catch (err: any) {
      console.error("Error fetching chat spaces:", err);
      setError(err?.message || "Failed to load Google Chat spaces. Make sure Chat API is enabled and scopes are granted.");
    } finally {
      setLoadingSpaces(false);
    }
  };

  useEffect(() => {
    fetchSpaces();
  }, [token]);

  const handlePostMessage = async () => {
    if (!token || !selectedSpaceId) return;
    setIsSending(true);
    setSuccessMessage(null);
    try {
      const res = await fetch(`https://chat.googleapis.com/v1/${selectedSpaceId}/messages`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: messageText
        })
      });

      if (!res.ok) {
        throw new Error(`Failed to post Chat message: Status code ${res.status}`);
      }

      setSuccessMessage("Your peaceful check-in has been sent to Google Chat!");
      setShowConfirmSend(false);
    } catch (err: any) {
      console.error("Error posting Google Chat message:", err);
      alert(`Message post failed: ${err?.message}`);
    } finally {
      setIsSending(false);
    }
  };

  const selectedSpaceName = spaces.find(s => s.name === selectedSpaceId)?.displayName || "Primary Space";

  const presetMessages = [
    "🌟 Breathing Check-in: If you are reading this, let's stop, relax our shoulders, and take three restorative deep breaths together. I'm here if you want to talk.",
    "🍵 Quick reminder: Rest is productive. Place your hands flat on your lap, draw a slow inhale for 4 seconds, hold for 4, and let the stress dissolve.",
    "🌈 Let's ground ourselves: Name 5 things you can see, 4 things you can feel, 3 things you can hear, 2 things you can smell, and 1 thing you can taste."
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-sans">
      
      {/* Left Column: Draft Message */}
      <div className="lg:col-span-5 bg-white dark:bg-slate-950 p-5 rounded-2xl border border-black/5 space-y-4 text-left">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-rose-50 dark:bg-rose-950/30 rounded-lg text-rose-500">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide">
            Draft Peaceful Grounding Alert
          </h2>
        </div>

        <div className="space-y-3.5 text-xs">
          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-400">Target Chat Space</label>
            {loadingSpaces ? (
              <span className="text-[10px] font-mono text-slate-400">Syncing Spaces...</span>
            ) : spaces.length === 0 ? (
              <p className="text-[11px] text-amber-600 mt-1 italic">
                No active spaces found. Ensure Google Chat is configured.
              </p>
            ) : (
              <select 
                value={selectedSpaceId} 
                onChange={(e) => setSelectedSpaceId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-black border border-black/10 p-2 rounded-lg mt-1 outline-none text-slate-800 dark:text-slate-200 font-medium"
              >
                {spaces.map(space => (
                  <option key={space.name} value={space.name}>{space.displayName || space.name}</option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-400">Message Content</label>
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              rows={4}
              className="w-full bg-slate-50 dark:bg-black border border-black/10 p-2.5 text-slate-700 dark:text-slate-200 rounded-lg mt-1 outline-none leading-relaxed font-medium"
              placeholder="Type your comforting message..."
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-400 mb-1.5">Preset Mindful templates</label>
            <div className="space-y-1.5">
              {presetMessages.map((text, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setMessageText(text)}
                  className="w-full text-left p-2.5 bg-slate-50 dark:bg-black hover:bg-rose-50/20 dark:hover:bg-rose-950/10 border border-black/5 rounded-xl text-[10.5px] text-slate-500 hover:text-rose-600 transition-colors"
                >
                  {text}
                </button>
              ))}
            </div>
          </div>

          {successMessage && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-150 rounded-xl text-emerald-800 dark:text-emerald-300 text-[11px] font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={() => setShowConfirmSend(true)}
              disabled={isSending || !messageText || !selectedSpaceId}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl cursor-pointer flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 text-xs"
            >
              <Send className="w-4 h-4 shrink-0" />
              Broadcast Chat Alert
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Google Chat Workspace Details */}
      <div className="lg:col-span-7 space-y-3">
        <div className="flex items-center justify-between border-b border-black/5 pb-2.5">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wide">
              Active Enterprise Chat Spaces
            </h3>
          </div>
          <button
            onClick={fetchSpaces}
            disabled={loadingSpaces}
            className="p-1 px-2.5 text-[10px] font-mono font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/40 rounded-lg cursor-pointer hover:bg-rose-100/70 flex items-center gap-1.5 border border-rose-150"
          >
            <RefreshCw className={`w-3 h-3 ${loadingSpaces ? "animate-spin" : ""}`} />
            Refresh Spaces
          </button>
        </div>

        <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl max-h-[460px] overflow-y-auto divide-y divide-black/5 text-left p-4 space-y-4">
          {loadingSpaces ? (
            <div className="py-16 flex flex-col items-center justify-center gap-2 text-xs text-slate-405 font-mono">
              <RefreshCw className="w-5 h-5 animate-spin text-rose-500" />
              <span>SYNCHRONIZING GOOGLE CHAT...</span>
            </div>
          ) : error ? (
            <div className="py-12 px-4 text-center">
              <p className="text-rose-500 text-xs font-bold font-mono">⚠️ GOOGLE_CHAT_SYNC_UNRESOLVED</p>
              <p className="text-slate-500 text-xs mt-1 leading-normal">{error}</p>
            </div>
          ) : spaces.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 space-y-2">
              <Users className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="italic">No spaces discovered. Enterprise Google Chat services require space membership permissions.</p>
              <p className="text-[10px] text-slate-400 font-mono">Chat scopes successfully enabled in your app.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {spaces.map((space) => {
                const isSelected = space.name === selectedSpaceId;
                return (
                  <button
                    key={space.name}
                    onClick={() => setSelectedSpaceId(space.name)}
                    className={`w-full text-left p-4 rounded-xl border flex items-center justify-between transition-all ${
                      isSelected 
                        ? "bg-rose-50/40 dark:bg-rose-950/15 border-rose-200" 
                        : "bg-transparent border-black/5 hover:bg-slate-50 dark:hover:bg-black"
                    }`}
                  >
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-205 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-rose-500" />
                        {space.displayName || space.name}
                      </h4>
                      <p className="text-[10px] font-mono text-slate-400">{space.name}</p>
                    </div>
                    {isSelected && (
                      <span className="text-[10px] font-mono text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded">
                        SELECTED
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* SECURITY MODAL CONFIRMATION */}
      <AnimatePresence>
        {showConfirmSend && (
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
                    Consent to Broadcast Chat Message
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1">
                    You are granting permission to post this supportive message on Google Chat channels on your behalf:
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl space-y-1.5 text-xs">
                <p className="font-mono"><span className="text-slate-400">Destination channel:</span> <span className="text-slate-800 dark:text-slate-200 font-bold">{selectedSpaceName}</span></p>
                <p className="text-slate-600 dark:text-slate-350 italic font-medium">"{messageText}"</p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmSend(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSending}
                  onClick={handlePostMessage}
                  className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl cursor-pointer shadow flex items-center gap-1"
                >
                  {isSending ? "Broadcasting..." : "Confirm & Send"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
