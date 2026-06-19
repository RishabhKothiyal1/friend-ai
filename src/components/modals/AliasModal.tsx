import React, { useState } from "react";
import { ShieldAlert, Lock, Check } from "lucide-react";

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

export function AliasModal({ isOpen, onClose, onLogin, error }: AliasModalProps) {
  const [alias, setAlias] = useState("");
  const [passcode, setPasscode] = useState("");
  const [location, setLocation] = useState("India");
  const [medicalConditions, setMedicalConditions] = useState<string[]>([]);
  const [customMedicalHistory, setCustomMedicalHistory] = useState("");
  const [consentPsychology, setConsentPsychology] = useState(false);
  const [consentAnonymity, setConsentAnonymity] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      alias,
      passcode,
      location,
      medicalConditions,
      customMedicalHistory,
      consentPsychology,
      consentAnonymity
    });
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 md:pt-20 bg-black/80 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl p-6 md:p-8 my-8 overflow-hidden font-sans">
        
        {/* Subtle Grain Overlay for Texture */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

        {/* Minimal Header */}
        <div className="flex flex-col mb-6 relative z-10">
          <h2 className="text-3xl font-black tracking-tight text-white mb-2 drop-shadow-sm">Verification</h2>
          <div className="h-px w-12 bg-white/20 mb-4"></div>
          <p className="text-sm text-gray-400 max-w-md font-medium leading-relaxed">
            Establish your encrypted identity and clinical parameters before entering friend ai.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          
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

            {/* Secure Local PIN */}
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
                End-to-End Private
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
                    <div className={`w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 transition-colors \${medicalConditions.includes(condition.id) ? 'bg-white border-white' : 'border-gray-600 group-hover:border-gray-400'}`}>
                      {medicalConditions.includes(condition.id) && <Check className="w-3 h-3 text-black stroke-[3]" />}
                    </div>
                    <span className={`text-xs transition-colors \${medicalConditions.includes(condition.id) ? 'text-white font-medium' : 'text-gray-400 group-hover:text-gray-200'}`}>
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
                <div className={`mt-0.5 w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 transition-colors \${consentPsychology ? 'bg-white border-white' : 'border-gray-600 group-hover:border-gray-400'}`}>
                  {consentPsychology && <Check className="w-3 h-3 text-black stroke-[3]" />}
                </div>
                <span className={`text-xs leading-relaxed transition-colors \${consentPsychology ? 'text-gray-200' : 'text-gray-400 group-hover:text-gray-300'}`}>
                  I understand that this is an automated program and <strong className="text-white">NOT</strong> a human therapist. I will seek human care for clinical treatment.
                </span>
              </button>

              <button 
                type="button"
                onClick={() => setConsentAnonymity(!consentAnonymity)}
                className="w-full text-left flex items-start gap-4 cursor-pointer group"
              >
                <div className={`mt-0.5 w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 transition-colors \${consentAnonymity ? 'bg-white border-white' : 'border-gray-600 group-hover:border-gray-400'}`}>
                  {consentAnonymity && <Check className="w-3 h-3 text-black stroke-[3]" />}
                </div>
                <span className={`text-xs leading-relaxed transition-colors \${consentAnonymity ? 'text-gray-200' : 'text-gray-400 group-hover:text-gray-300'}`}>
                  I agree that my logs are locked on this local browser node. If I clear browser data, my history is deleted forever.
                </span>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-950/40 border border-red-900/50 rounded-lg text-xs text-red-400 flex items-start gap-3">
              <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={!alias || !consentPsychology || !consentAnonymity}
              className="w-full py-4 bg-white hover:bg-gray-200 text-black font-bold text-xs cursor-pointer transition-all uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
            >
              <span>friend ai</span>
            </button>
            <div className="mt-4 flex items-center justify-center gap-4 text-[10px] text-gray-600 font-mono tracking-widest uppercase">
              <span>Local Only</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
