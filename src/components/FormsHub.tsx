import React, { useState, useEffect } from "react";
import { 
  FileSpreadsheet, 
  Plus, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle,
  Sparkles,
  ClipboardList,
  ExternalLink,
  Users
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FormsHubProps {
  token: string | null;
  themeClass: (daylight: string, midnight: string, sepia: string) => string;
}

export default function FormsHub({ token, themeClass }: FormsHubProps) {
  const [formsList, setFormsList] = useState<any[]>([]);
  const [selectedFormId, setSelectedFormId] = useState<string>("");
  const [loadingForms, setLoadingForms] = useState(false);
  const [responses, setResponses] = useState<any[]>([]);
  const [loadingResponses, setLoadingResponses] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New form states
  const [formTitle, setFormTitle] = useState("✨ Personal Somatic Daily Coping Log");
  const [documentTitle, setDocumentTitle] = useState("Coping Log");
  const [isCreating, setIsCreating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showConfirmCreate, setShowConfirmCreate] = useState(false);

  // Fetch responses if form is selected
  const fetchFormResponses = async (formId: string) => {
    if (!token || !formId) return;
    setLoadingResponses(true);
    setError(null);
    try {
      const res = await fetch(`https://forms.googleapis.com/v1/forms/${formId}/responses`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        if (res.status === 404) {
          setResponses([]);
          return;
        }
        throw new Error(`Google Forms responses load failed: Status code ${res.status}`);
      }

      const data = await res.json();
      setResponses(data.responses || []);
    } catch (err: any) {
      console.error("Error fetching form responses:", err);
      // We gracefully handle cases where no responses are available or setup needs permission
      setResponses([]);
    } finally {
      setLoadingResponses(false);
    }
  };

  useEffect(() => {
    if (selectedFormId) {
      fetchFormResponses(selectedFormId);
    }
  }, [selectedFormId]);

  const handleCreateForm = async () => {
    if (!token || !formTitle) return;
    setIsCreating(true);
    setSuccessMessage(null);
    try {
      const res = await fetch("https://forms.googleapis.com/v1/forms", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          info: {
            title: formTitle,
            documentTitle: documentTitle
          }
        })
      });

      if (!res.ok) {
        throw new Error(`Failed to create Google Form: Status code ${res.status}`);
      }

      const createdForm = await res.json();
      setSuccessMessage(`Form "${formTitle}" successfully created!`);
      
      const newFormItem = {
        formId: createdForm.formId,
        title: createdForm.info?.title || formTitle,
        responderUri: createdForm.responderUri
      };

      setFormsList(prev => [newFormItem, ...prev]);
      setSelectedFormId(createdForm.formId);
      setShowConfirmCreate(false);
    } catch (err: any) {
      console.error("Error creating Google Form:", err);
      alert(`Forms creation failed: ${err?.message || "Make sure Forms API is enabled."}`);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-sans">
      
      {/* Left Column: Form drafting options */}
      <div className="lg:col-span-5 bg-white dark:bg-slate-950 p-5 rounded-2xl border border-black/5 space-y-4 text-left">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-rose-50 dark:bg-rose-950/30 rounded-lg text-rose-500">
            <ClipboardList className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide">
            Draft Feedback Google Form
          </h2>
        </div>

        <div className="space-y-3.5 text-xs">
          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-400">Document File Name</label>
            <input 
              type="text" 
              value={documentTitle} 
              onChange={(e) => setDocumentTitle(e.target.value)}
              className="w-full bg-slate-50 dark:bg-black border border-black/10 p-2 rounded-lg mt-1 outline-none font-bold"
              placeholder="e.g. Coping Log"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-400">Form Title Headers</label>
            <input 
              type="text" 
              value={formTitle} 
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full bg-slate-50 dark:bg-black border border-black/10 p-2 rounded-lg mt-1 outline-none font-medium text-slate-800 dark:text-zinc-100"
              placeholder="e.g. Daily Somatic Stress Inventory"
            />
          </div>

          <div className="bg-slate-50 dark:bg-zinc-900/60 p-3 rounded-xl border border-black/5 text-[10.5px] text-slate-500 space-y-1">
            <span className="font-bold text-slate-600 dark:text-slate-350 block">Include somatic inputs:</span>
            <ul className="list-disc plist-inside pl-1 space-y-0.5">
              <li>Current heart rate & muscle release comfort rating</li>
              <li>Anxiety peaks log times & panic triggers</li>
              <li>Somatic grounding feedback rating</li>
            </ul>
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
              disabled={isCreating || !formTitle}
              className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-750 text-white font-bold rounded-xl cursor-pointer flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 text-xs"
            >
              <Plus className="w-4 h-4 shrink-0" />
              Initialize Live Form
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: List of customized Forms and response summaries */}
      <div className="lg:col-span-7 space-y-4">
        <div className="flex items-center justify-between border-b border-black/5 pb-2.5">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wide">
              Your Somatic Coping Forms
            </h3>
          </div>
          {selectedFormId && (
            <button
              onClick={() => fetchFormResponses(selectedFormId)}
              disabled={loadingResponses}
              className="p-1 px-2.5 text-[10px] font-mono font-bold text-indigo-650 bg-indigo-50 dark:bg-white/[0.02]/40 rounded-lg cursor-pointer hover:bg-indigo-100 flex items-center gap-1.5 border border-indigo-150 animate-pulse hover:animate-none"
            >
              <RefreshCw className={`w-3 h-3 ${loadingResponses ? "animate-spin" : ""}`} />
              Sync Answers
            </button>
          )}
        </div>

        <div className="space-y-3 font-sans text-left">
          {formsList.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400 italic bg-white dark:bg-slate-950 border rounded-2xl p-6">
              No somatic assessment forms active. Create your first live Google Form dynamically using the builder panel.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {formsList.map((f) => {
                  const isSel = f.formId === selectedFormId;
                  return (
                    <div 
                      key={f.formId} 
                      onClick={() => setSelectedFormId(f.formId)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSel 
                          ? "bg-indigo-50/20 dark:bg-white/[0.02]/15 border-indigo-250 ring-1 ring-indigo-200" 
                          : "bg-white dark:bg-slate-950 border-black/5 hover:border-indigo-100"
                      }`}
                    >
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-1">{f.title}</h4>
                      <p className="text-[9px] font-mono text-slate-400 mt-1">ID: {f.formId}</p>
                      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-black/5">
                        <a 
                          href={f.responderUri} 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-[10px] font-mono text-indigo-600 hover:underline flex items-center gap-1 font-bold"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Fill Form <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                        <span className="text-[9px] font-mono text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded font-bold">
                          ACTIVE
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Responses card */}
              <div className="bg-white dark:bg-slate-950 border border-slate-100 rounded-2xl p-5 space-y-3.5">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 border-b pb-2">
                  <Users className="w-4 h-4 text-indigo-500" />
                  Somatic Form Responses ({responses.length})
                </h4>

                {loadingResponses ? (
                  <div className="py-12 text-center text-xs text-slate-400 font-mono flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-indigo-500" />
                    Fetching submissions...
                  </div>
                ) : responses.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400 italic">
                    Waiting for initial responses on Google Forms. Distribute the "Fill Form" link above to gather coping metrics.
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[220px] overflow-y-auto">
                    {responses.map((r, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 dark:bg-black border border-black/5 rounded-xl space-y-1">
                        <p className="text-[10px] font-mono font-bold text-slate-500">Submission #{idx + 1} - {new Date(r.lastSubmittedTime).toLocaleDateString()}</p>
                        <p className="text-[11px] text-slate-650 leading-relaxed italic">Submitted responses are synchronized directly on your primary Google Drive sheets.</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

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
              className="bg-white dark:bg-black rounded-2xl max-w-md w-full p-6 border border-black/10 shadow-2xl space-y-4 text-left"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-xl text-amber-600 border border-amber-200">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    Consent to Initialize Google Form
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1">
                    You are authorizing Project Friend AI to generate this customized Somatic Feedback form in your Google Forms drive space:
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl space-y-1 text-xs">
                <p className="font-mono"><span className="text-slate-400">Document Title:</span> <span className="text-slate-800 dark:text-slate-200 font-bold">{documentTitle}</span></p>
                <p className="font-mono"><span className="text-slate-400">Header Text:</span> <span className="text-slate-700 dark:text-slate-350 font-medium">{formTitle}</span></p>
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
                  onClick={handleCreateForm}
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-750 rounded-xl cursor-pointer shadow flex items-center gap-1"
                >
                  {isCreating ? "Creating Form..." : "Confirm & Create"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
