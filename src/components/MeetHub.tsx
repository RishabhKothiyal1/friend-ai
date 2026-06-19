import React, { useState, useEffect } from "react";
import { 
  Video, 
  Plus, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle,
  Sparkles,
  ExternalLink,
  Copy,
  Clock,
  Laptop
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface MeetHubProps {
  token: string | null;
  themeClass: (daylight: string, midnight: string, sepia: string) => string;
}

export default function MeetHub({ token, themeClass }: MeetHubProps) {
  const [spaces, setSpaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Custom meeting configuration
  const [spaceTitle, setSpaceTitle] = useState("✨ Mindful Grounding & Breathing Space");
  const [accessType, setAccessType] = useState("OPEN");
  
  const [createdUri, setCreatedUri] = useState<string | null>(null);
  const [showConfirmCreate, setShowConfirmCreate] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Generate Google Meet space
  const handleCreateMeetSpace = async () => {
    if (!token) return;
    setIsCreating(true);
    setError(null);
    setCreatedUri(null);
    try {
      // Meet API configuration
      const res = await fetch("https://meet.googleapis.com/v1/spaces", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          config: {
            accessType: accessType
          }
        })
      });

      if (!res.ok) {
        throw new Error(`Google Meet Space creation failed: Status code ${res.status}`);
      }

      const data = await res.json();
      const meetUri = data.meetingUri;
      setCreatedUri(meetUri);
      
      const newSpaceItem = {
        name: data.name, // spaces/asdasf12
        meetingCode: data.meetingCode,
        meetingUri: meetUri,
        title: spaceTitle,
        createdAt: new Date().toISOString()
      };

      setSpaces(prev => [newSpaceItem, ...prev]);
      setShowConfirmCreate(false);
    } catch (err: any) {
      console.error("Error creating Google Meet space:", err);
      // Fallback in case Google Meet API needs explicit enterprise enablement or G Suite domain
      alert(`Meeting Space creation failed: ${err?.message || "Verify your workspace credentials."}`);
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-sans">
      
      {/* Left Column: Meet Config */}
      <div className="lg:col-span-5 bg-white dark:bg-slate-950 p-5 rounded-2xl border border-black/5 space-y-4 text-left">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-rose-50 dark:bg-rose-950/30 rounded-lg text-rose-500">
            <Video className="w-4 h-4 bg-emerald-500/0 rounded text-emerald-500 shrink-0" />
          </div>
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide">
            Design Google Meet Lounge
          </h2>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-400">Meeting Topic / Intent</label>
            <input 
              type="text" 
              value={spaceTitle} 
              onChange={(e) => setSpaceTitle(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-black/10 p-2.5 rounded-lg mt-1 outline-none font-bold text-slate-850 dark:text-slate-105"
              placeholder="e.g. 1-on-1 Somatic Grounding Therapy"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-400">Security / Access Level</label>
            <select
              value={accessType}
              onChange={(e) => setAccessType(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-black/10 p-2 rounded-lg mt-1 outline-none text-slate-800 dark:text-slate-200"
            >
              <option value="OPEN">Open (Anyone with the link can join)</option>
              <option value="TRUSTED">Trusted (Members of organization or invited contacts)</option>
              <option value="RESTRICTED">Restricted (Explicit host admit required)</option>
            </select>
          </div>

          <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl space-y-1.5 text-[11px] text-indigo-805 dark:text-indigo-205 leading-relaxed">
            <p className="font-bold flex items-center gap-1">
              <Laptop className="w-3.5 h-3.5 text-indigo-505" />
              Somatic Meet Guidelines:
            </p>
            <ul className="list-disc pl-3.5 space-y-1 text-slate-500">
              <li>Turn on camera for posture assessment check-ins.</li>
              <li>Recommend headset to hear low-frequency audio synth loops clearly.</li>
              <li>Toggle "DND / Silent" on Workspace profile during active coaching.</li>
            </ul>
          </div>

          <button
            onClick={() => setShowConfirmCreate(true)}
            disabled={isCreating}
            className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-750 text-white font-bold rounded-xl cursor-pointer flex items-center justify-center gap-2 shadow-sm transition-all text-xs"
          >
            <Video className="w-4 h-4 shrink-0" />
            Provision Google Meet Lounge
          </button>
        </div>
      </div>

      {/* Right Column: Active meetings list */}
      <div className="lg:col-span-7 space-y-3">
        <h3 className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wide border-b border-black/5 pb-2.5 text-left">
          Active Meeting Lounges ({spaces.length})
        </h3>

        {createdUri && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-150 rounded-2xl text-left space-y-3">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">Meeting Room Prepared!</h4>
                <p className="text-[11px] text-slate-505 leading-normal">Your custom secure somatic grounding room is ready for distribution: <span className="font-mono text-indigo-605">{createdUri}</span></p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <a 
                href={createdUri} 
                target="_blank" 
                rel="noreferrer"
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer flex items-center gap-1.5 text-[11px]"
              >
                Join Live Meet <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button 
                onClick={() => copyToClipboard(createdUri)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 dark:text-slate-300 font-bold rounded-lg cursor-pointer flex items-center gap-1.5 text-[11px]"
              >
                <Copy className="w-3.5 h-3.5" />
                {copiedLink ? "Copied!" : "Copy Link"}
              </button>
            </div>
          </div>
        )}

        <div className="space-y-2 text-left">
          {spaces.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400 italic bg-white dark:bg-slate-950 border border-dashed rounded-2xl p-6">
              No live meeting lounges provisioned. Instantly schedule a somatic session using the planner panel.
            </div>
          ) : (
            <div className="space-y-2">
              {spaces.map((s, idx) => (
                <div key={idx} className="p-4 bg-white dark:bg-slate-950 border border-black/5 rounded-xl flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-indigo-205 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {s.title}
                    </h4>
                    <p className="text-[10px] font-mono text-slate-400">Code: {s.meetingCode} | {new Date(s.createdAt).toLocaleTimeString()}</p>
                  </div>
                  <a 
                    href={s.meetingUri} 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-1 px-3 text-[10px] font-mono font-bold text-indigo-650 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg cursor-pointer hover:bg-indigo-100/70 border border-indigo-150 flex items-center gap-1"
                  >
                    Launch <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SECURITY MODAL CONFIRMATION */}
      <AnimatePresence>
        {showConfirmCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-black/10 shadow-2xl space-y-4 text-left"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-xl text-amber-600 border border-amber-200">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    Consent to Create Google Meet Space
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1">
                    You are authorizing Project Friend AI to provision a fresh Google Meet lounge link directly under your authenticated Google account:
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl space-y-1 text-xs">
                <p><span className="text-slate-400">Room Topic:</span> <span className="text-slate-800 dark:text-slate-200 font-bold">{spaceTitle}</span></p>
                <p><span className="text-slate-400">Access Tier:</span> <span className="text-slate-700 dark:text-slate-350 font-medium font-mono">{accessType}</span></p>
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
                  disabled={isCreating}
                  onClick={handleCreateMeetSpace}
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-750 rounded-xl cursor-pointer shadow flex items-center gap-1"
                >
                  {isCreating ? "Provisioning..." : "Confirm & Create"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
