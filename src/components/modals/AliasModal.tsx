import React, { useState, useEffect } from "react";
import { ShieldAlert, Lock, Check, Mail, ArrowRight, Loader2, Globe } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";

export interface LoginData {
  alias: string;
  passcode: string;
  location: string;
  medicalConditions: string[];
  customMedicalHistory: string;
  consentPsychology: boolean;
  consentAnonymity: boolean;
}

interface AliasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (data: LoginData) => void;
  error?: string | null;
}

export function AliasModal({ isOpen, onClose, onLogin, error: externalError }: AliasModalProps) {
  const { user, profile, signInWithGoogle, signInWithEmail, signUpWithEmail, loading: authLoading } = useAuth();
  
  // Tabs: "sync" (Google/Email choice) or "local" (Anonymous Local Mode)
  const [mode, setMode] = useState<"sync" | "local">("sync");
  const [emailTab, setEmailTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");

  const [alias, setAlias] = useState("");
  const [passcode, setPasscode] = useState("");
  const [location, setLocation] = useState("India");
  const [medicalConditions, setMedicalConditions] = useState<string[]>([]);
  const [customMedicalHistory, setCustomMedicalHistory] = useState("");
  const [consentPsychology, setConsentPsychology] = useState(false);
  const [consentAnonymity, setConsentAnonymity] = useState(false);
  
  const [submitting, setSubmitting] = useState(false);
  const [errorState, setErrorState] = useState<string | null>(null);

  // Sync state with incoming user auth
  useEffect(() => {
    if (user && profile) {
      if (profile.clinicalIntakeCompleted) {
        onLogin({
          alias: profile.displayName || user.displayName || "Anonymous",
          passcode: "",
          location: profile.location || "India",
          medicalConditions: (profile as any).medicalConditions || [],
          customMedicalHistory: (profile as any).customMedicalHistory || "",
          consentPsychology: true,
          consentAnonymity: true
        });
        onClose();
      } else {
        // Pre-fill display name as alias
        if (!alias) {
          setAlias(profile.displayName || user.displayName || "");
        }
      }
    }
  }, [user, profile]);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setErrorState(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setErrorState(err.message || "Failed to sign in with Google.");
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorState(null);
    setSubmitting(true);
    try {
      if (emailTab === "signup") {
        if (!displayName.trim() || !username.trim()) {
          throw new Error("Display name and username are required");
        }
        await signUpWithEmail(email, password, displayName, username);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err: any) {
      setErrorState(err.message || "Email authentication failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alias.trim()) {
      setErrorState("Please enter an anonymous alias to establish your node connection.");
      return;
    }
    if (mode === "local" && passcode && passcode.length < 4) {
      setErrorState("Your secure client PIN must be at least 4 digits to properly seed local storage salt.");
      return;
    }
    if (!consentPsychology || !consentAnonymity) {
      setErrorState("You must acknowledge both clinical boundary and local data privacy covenants to proceed.");
      return;
    }

    setErrorState(null);
    setSubmitting(true);

    try {
      if (user && db) {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          displayName: alias.trim(),
          location,
          medicalConditions,
          customMedicalHistory,
          consentPsychology,
          consentAnonymity,
          clinicalIntakeCompleted: true
        });
        onLogin({
          alias: alias.trim(),
          passcode: "",
          location,
          medicalConditions,
          customMedicalHistory,
          consentPsychology,
          consentAnonymity
        });
      } else {
        // Local-only mode
        onLogin({
          alias: alias.trim(),
          passcode,
          location,
          medicalConditions,
          customMedicalHistory,
          consentPsychology,
          consentAnonymity
        });
      }
      onClose();
    } catch (err: any) {
      setErrorState(err.message || "Failed to update profile configuration.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const activeError = errorState || externalError;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 md:pt-20 bg-black/80 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl p-6 md:p-8 my-8 overflow-hidden font-sans">
        
        {/* Subtle Grain Overlay */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

        {/* Header */}
        <div className="flex flex-col mb-6 relative z-10">
          <h2 className="text-3xl font-black tracking-tight text-white mb-2 drop-shadow-sm">Verification</h2>
          <div className="h-px w-12 bg-indigo-500 mb-4"></div>
          <p className="text-sm text-gray-400 max-w-md font-medium leading-relaxed">
            Establish your identity and clinical parameters before entering friend ai.
          </p>
        </div>

        {/* 1. Account Choice Block (only visible if not logged in to Firebase) */}
        {!user && (
          <div className="mb-6 border-b border-white/10 pb-6 flex flex-col gap-4 relative z-10">
            <div className="flex bg-white/5 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setMode("sync")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${mode === "sync" ? "bg-white text-black" : "text-slate-400 hover:text-white"}`}
              >
                Cloud Sync (Google/Email)
              </button>
              <button
                type="button"
                onClick={() => setMode("local")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${mode === "local" ? "bg-white text-black" : "text-slate-400 hover:text-white"}`}
              >
                Local-Only Mode
              </button>
            </div>

            {mode === "sync" && (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={authLoading}
                  className="w-full py-3.5 bg-[#1a73e8] hover:bg-[#155cb0] disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all uppercase tracking-wider"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.555 0-6.44-2.885-6.44-6.44s2.885-6.44 6.44-6.44c1.633 0 3.129.61 4.27 1.621l3.03-3.03C19.07 2.38 15.82 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.236 0 11.265-5.029 11.265-11.24 0-.78-.069-1.536-.205-2.255H12.24z"/>
                  </svg>
                  Continue with Google
                </button>

                <div className="flex items-center my-4">
                  <div className="flex-1 h-px bg-white/10"></div>
                  <span className="px-3 text-[10px] uppercase font-mono tracking-widest text-slate-500">or use email</span>
                  <div className="flex-1 h-px bg-white/10"></div>
                </div>

                <form onSubmit={handleEmailAuth} className="space-y-3">
                  <div className="flex gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => setEmailTab("login")}
                      className={`px-3 py-1 rounded-lg text-[10px] font-bold ${emailTab === "login" ? "bg-white/10 text-white" : "text-slate-500"}`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => setEmailTab("signup")}
                      className={`px-3 py-1 rounded-lg text-[10px] font-bold ${emailTab === "signup" ? "bg-white/10 text-white" : "text-slate-500"}`}
                    >
                      Create Account
                    </button>
                  </div>

                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-[#111] border border-white/10 rounded-lg text-xs p-3 text-white outline-none focus:border-white transition-all"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-[#111] border border-white/10 rounded-lg text-xs p-3 text-white outline-none focus:border-white transition-all"
                  />

                  {emailTab === "signup" && (
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Display Name"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        required
                        className="bg-[#111] border border-white/10 rounded-lg text-xs p-3 text-white outline-none focus:border-white transition-all"
                      />
                      <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="bg-[#111] border border-white/10 rounded-lg text-xs p-3 text-white outline-none focus:border-white transition-all"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>{emailTab === "signup" ? "Register" : "Sign In"}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* 2. Clinical Parameters Intake Section */}
        {/* Only show if Mode is Local-Only OR Firebase User is authenticated but clinical intake is pending */}
        {(mode === "local" || user) && (
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10 animate-in fade-in slide-in-from-bottom duration-300">
            
            {user && (
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs text-indigo-300 flex items-center gap-2">
                <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Authenticated as <strong>{user.email}</strong>. Complete your intake below to sync.</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Enter Anonymous Alias */}
              <div className="space-y-3 group">
                <label className="text-[10px] text-gray-500 uppercase tracking-[0.15em] font-bold block transition-colors group-focus-within:text-white">
                  Anonymous Alias <span className="text-white/40">*</span>
                </label>
                <input
                  type="text"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  placeholder="e.g. Phoenix, Seeker"
                  className="w-full bg-transparent border-b border-white/10 text-sm py-2 text-white placeholder-gray-700 outline-none focus:border-white transition-all"
                  required
                />
              </div>

              {/* Secure Local PIN (only for Local mode) */}
              {mode === "local" && (
                <div className="space-y-3 group">
                  <div className="flex items-end justify-between">
                    <label className="text-[10px] text-gray-500 uppercase tracking-[0.15em] font-bold block transition-colors group-focus-within:text-white">
                      Passcode <span className="text-gray-600 font-normal normal-case tracking-normal">(Optional)</span>
                    </label>
                  </div>
                  <input
                    type="password"
                    pattern="[0-9]*"
                    maxLength={8}
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="4-8 digit AES seed"
                    className="w-full bg-transparent border-b border-white/10 text-sm py-2 text-white placeholder-gray-700 outline-none focus:border-white transition-all font-mono tracking-widest"
                  />
                </div>
              )}
            </div>

            <div className="h-px w-full bg-white/5"></div>

            {/* Clinical Intake & Medical History Survey */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Clinical Intake History
                </h3>
                <span className="text-[9px] uppercase tracking-widest text-gray-500 flex items-center gap-1.5">
                  <Lock className="w-3 h-3" />
                  {mode === "local" ? "Securely Sandboxed" : "Private Cloud Sync"}
                </span>
              </div>
              
              {/* Location Select */}
              <div className="space-y-3 group">
                <label className="text-[10px] text-gray-500 uppercase tracking-[0.15em] font-bold block">
                  Region <span className="text-white/40">*</span>
                </label>
                <div className="relative">
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-[#111] border border-white/10 hover:border-white/20 rounded-lg text-sm p-3 text-white outline-none focus:border-white transition-all cursor-pointer appearance-none"
                    required
                  >
                    <option value="India">India</option>
                    <option value="USA">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Singapore">Singapore</option>
                    <option value="International">International</option>
                  </select>
                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-xs">▼</div>
                </div>
              </div>

              {/* Checkboxes for Medical Background */}
              <div className="space-y-4 pt-2">
                <span className="text-[10px] text-gray-500 uppercase tracking-[0.15em] font-bold block">History & Conditions</span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { id: "MEDS_CHRONIC", label: "Prescribed Psychiatric Medication" },
                    { id: "DIAGNOSED_SEVERE", label: "Severe Diagnosed History" },
                    { id: "CLINICAL_SYMPTOMS", label: "Persistent Clinical Distress" },
                    { id: "TRAUMA_GRIEF", label: "Trauma, Grief, or Domestic Issues" }
                  ].map(condition => (
                    <button 
                      type="button"
                      key={condition.id} 
                      onClick={() => {
                        if (medicalConditions.includes(condition.id)) {
                          setMedicalConditions(prev => prev.filter(c => c !== condition.id));
                        } else {
                          setMedicalConditions(prev => [...prev, condition.id]);
                        }
                      }}
                      className="w-full text-left flex items-center gap-3 p-3 rounded-lg border border-white/5 hover:border-white/20 bg-white/[0.02] cursor-pointer transition-all group"
                    >
                      <div className={`w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 transition-colors ${medicalConditions.includes(condition.id) ? 'bg-white border-white' : 'border-gray-600 group-hover:border-gray-400'}`}>
                        {medicalConditions.includes(condition.id) && <Check className="w-3 h-3 text-black stroke-[3]" />}
                      </div>
                      <span className={`text-xs transition-colors ${medicalConditions.includes(condition.id) ? 'text-white font-medium' : 'text-gray-400 group-hover:text-gray-200'}`}>
                        {condition.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Medical Text */}
              <div className="space-y-3 group pt-2">
                <label className="text-[10px] text-gray-500 uppercase tracking-[0.15em] font-bold block">
                  Specify Diagnosis / Symptoms <span className="text-gray-600 font-normal normal-case tracking-normal">(Optional)</span>
                </label>
                <textarea
                  value={customMedicalHistory}
                  onChange={(e) => setCustomMedicalHistory(e.target.value)}
                  placeholder="e.g. Diagnosed OCD, currently taking Prozac 40mg."
                  rows={2}
                  className="w-full bg-[#111] border border-white/10 hover:border-white/20 rounded-lg text-sm p-4 text-white placeholder-gray-700 outline-none focus:border-white transition-all resize-none"
                />
              </div>
            </div>

            <div className="h-px w-full bg-white/5"></div>

            {/* Consent Checkboxes */}
            <div className="space-y-4">
              <span className="text-[10px] text-gray-500 uppercase tracking-[0.15em] font-bold block">Safety Agreements</span>
              
              <div className="space-y-3">
                <button 
                  type="button"
                  onClick={() => setConsentPsychology(!consentPsychology)}
                  className="w-full text-left flex items-start gap-4 cursor-pointer group"
                >
                  <div className={`mt-0.5 w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 transition-colors ${consentPsychology ? 'bg-white border-white' : 'border-gray-600 group-hover:border-gray-400'}`}>
                    {consentPsychology && <Check className="w-3 h-3 text-black stroke-[3]" />}
                  </div>
                  <span className={`text-xs leading-relaxed transition-colors ${consentPsychology ? 'text-gray-200' : 'text-gray-400 group-hover:text-gray-300'}`}>
                    I understand that this is an automated program and <strong className="text-white">NOT</strong> a human therapist. I will seek human care for clinical treatment.
                  </span>
                </button>

                <button 
                  type="button"
                  onClick={() => setConsentAnonymity(!consentAnonymity)}
                  className="w-full text-left flex items-start gap-4 cursor-pointer group"
                >
                  <div className={`mt-0.5 w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 transition-colors ${consentAnonymity ? 'bg-white border-white' : 'border-gray-600 group-hover:border-gray-400'}`}>
                    {consentAnonymity && <Check className="w-3 h-3 text-black stroke-[3]" />}
                  </div>
                  <span className={`text-xs leading-relaxed transition-colors ${consentAnonymity ? 'text-gray-200' : 'text-gray-400 group-hover:text-gray-300'}`}>
                    {mode === "local" ? (
                      <span>I agree that my logs are locked on this local browser node. If I clear browser data, my history is deleted forever.</span>
                    ) : (
                      <span>I agree to sync my logs to my private cloud node. They are protected and locked under my personal Google/Email account.</span>
                    )}
                  </span>
                </button>
              </div>
            </div>

            {activeError && (
              <div className="p-4 bg-red-950/40 border border-red-900/50 rounded-lg text-xs text-red-400 flex items-start gap-3">
                <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{activeError}</span>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting || !alias || !consentPsychology || !consentAnonymity}
                className="w-full py-4 bg-white hover:bg-gray-200 text-black font-bold text-xs cursor-pointer transition-all uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>friend ai</span>
              </button>
              <div className="mt-4 flex items-center justify-center gap-4 text-[10px] text-gray-600 font-mono tracking-widest uppercase">
                <span>{mode === "local" ? "Local Only" : "Cloud Sync Mode"}</span>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
