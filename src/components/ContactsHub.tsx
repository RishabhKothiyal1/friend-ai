import React, { useState, useEffect } from "react";
import { 
  Users, 
  Plus, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle,
  Sparkles,
  Search,
  Phone,
  Mail,
  UserCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ContactsHubProps {
  token: string | null;
  themeClass: (daylight: string, midnight: string, sepia: string) => string;
}

export default function ContactsHub({ token, themeClass }: ContactsHubProps) {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // New Contact states
  const [givenName, setGivenName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [phoneValue, setPhoneValue] = useState("");
  const [contactRole, setContactRole] = useState("Somatic Client");

  const [isCreating, setIsCreating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showConfirmCreate, setShowConfirmCreate] = useState(false);

  // Fetch Google Contacts (People API)
  const fetchContacts = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        "https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses,phoneNumbers,photos&pageSize=50",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!res.ok) {
        throw new Error(`Google Contacts list failed: Status code ${res.status}`);
      }

      const data = await res.json();
      setContacts(data.connections || []);
    } catch (err: any) {
      console.error("Error loading contacts API:", err);
      // Fallback with custom sample contacts if Contacts is empty or fresh account
      setError(err?.message || "Failed to load Google Contacts. Make sure People API is active.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [token]);

  // Create Google Contact (People API)
  const handleCreateContact = async () => {
    if (!token || !givenName) return;
    setIsCreating(true);
    setSuccessMessage(null);
    try {
      const payload: any = {
        names: [
          {
            givenName: givenName,
            familyName: familyName
          }
        ]
      };

      if (emailValue) {
        payload.emailAddresses = [{ value: emailValue }];
      }

      if (phoneValue) {
        payload.phoneNumbers = [{ value: phoneValue }];
      }

      const res = await fetch("https://people.googleapis.com/v1/people:createContact", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`Google Contact creation failed: Status code ${res.status}`);
      }

      setSuccessMessage(`Contact "${givenName} ${familyName}" successfully added to Google Contacts!`);
      setShowConfirmCreate(false);
      
      // Clear inputs
      setGivenName("");
      setFamilyName("");
      setEmailValue("");
      setPhoneValue("");
      
      fetchContacts();
    } catch (err: any) {
      console.error("Error creating Google contact:", err);
      alert(`Contact creation failed: ${err?.message}`);
    } finally {
      setIsCreating(false);
    }
  };

  const filteredContacts = contacts.filter((c) => {
    const primaryName = c.names?.[0]?.displayName || "";
    return primaryName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-sans">
      
      {/* Left Column: Form to create somatic client */}
      <div className="lg:col-span-5 bg-white dark:bg-slate-950 p-5 rounded-2xl border border-black/5 space-y-4 text-left">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-rose-50 dark:bg-rose-950/30 rounded-lg text-rose-500">
            <UserCheck className="w-4 h-4 text-indigo-500 shrink-0" />
          </div>
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide">
            Add Somatic Coaching Contact
          </h2>
        </div>

        <div className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-400">First Name</label>
              <input 
                type="text" 
                value={givenName} 
                onChange={(e) => setGivenName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-black border border-black/10 p-2 rounded-lg mt-1 outline-none font-bold text-slate-850 dark:text-slate-100"
                placeholder="e.g. Rooh"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-400">Last Name</label>
              <input 
                type="text" 
                value={familyName} 
                onChange={(e) => setFamilyName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-black border border-black/10 p-2 rounded-lg mt-1 outline-none text-slate-800 dark:text-slate-205"
                placeholder="e.g. Gupta"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-400">Email Address</label>
            <input 
              type="email" 
              value={emailValue} 
              onChange={(e) => setEmailValue(e.target.value)}
              className="w-full bg-slate-50 dark:bg-black border border-black/10 p-2 rounded-lg mt-1 outline-none text-slate-800 dark:text-slate-200"
              placeholder="e.g. uarvashi@example.com"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-400">Phone Number</label>
            <input 
              type="tel" 
              value={phoneValue} 
              onChange={(e) => setPhoneValue(e.target.value)}
              className="w-full bg-slate-50 dark:bg-black border border-black/10 p-2 rounded-lg mt-1 outline-none text-slate-850 dark:text-slate-200"
              placeholder="e.g. +91 99999 88888"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-400">Intervention Role</label>
            <select
              value={contactRole}
              onChange={(e) => setContactRole(e.target.value)}
              className="w-full bg-slate-50 dark:bg-black border border-black/10 p-2 rounded-lg mt-1 outline-none text-slate-800 dark:text-slate-200 font-medium"
            >
              <option value="Somatic Client">Somatic Client (Tracking Stress)</option>
              <option value="Clinical Guardian">Clinical Critical Guardian (Crisis Alert Target)</option>
              <option value="Associate Adv Counsel">Associate Advocacy Counsel (Legal / Medical rights)</option>
            </select>
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
              disabled={isCreating || !givenName}
              className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-750 text-white font-bold rounded-xl cursor-pointer flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 text-xs"
            >
              <Plus className="w-4 h-4 shrink-0" />
              Create Google Contact
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Google Contacts Display with search */}
      <div className="lg:col-span-7 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/5 pb-2.5">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wide">
              Logged Somatic Contacts
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchContacts}
              disabled={loading}
              className="p-1 px-2 text-[10px] font-mono font-bold text-indigo-650 bg-indigo-50 dark:bg-white/[0.02]/40 rounded-lg cursor-pointer hover:bg-indigo-100/70 border border-indigo-150 flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
              Sync Contacts
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative text-left">
          <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search contacts..."
            className="w-full bg-white dark:bg-slate-950 border border-black/5 rounded-xl p-2 pl-8.5 outline-none text-xs text-slate-800 dark:text-slate-205"
          />
        </div>

        <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl max-h-[420px] overflow-y-auto divide-y divide-black/5 text-left">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-2 text-xs text-slate-405 font-mono">
              <RefreshCw className="w-5 h-5 animate-spin text-indigo-500" />
              <span>SYNCHRONIZING SECURE CONTACTS...</span>
            </div>
          ) : error ? (
            <div className="py-12 px-4 text-center">
              <p className="text-red-500 text-xs font-bold font-mono">⚠️ SYNC_FAILED</p>
              <p className="text-slate-505 text-xs mt-1 leading-normal">{error}</p>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400 italic">
              No matching contact files discovered. Create standard client roles to begin monitoring stress histories.
            </div>
          ) : (
            filteredContacts.map((contact, idx) => {
              const name = contact.names?.[0]?.displayName || "Unknown User";
              const email = contact.emailAddresses?.[0]?.value || null;
              const phone = contact.phoneNumbers?.[0]?.value || null;
              const photo = contact.photos?.[0]?.url || null;

              return (
                <div key={idx} className="p-4 flex items-center gap-3.5 hover:bg-slate-50/50 transition-all">
                  {photo ? (
                    <img 
                      src={photo} 
                      alt={name} 
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-full object-cover border border-black/5" 
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-indigo-50 dark:bg-white/[0.02]/20 text-indigo-500 flex items-center justify-center font-bold text-xs border border-indigo-150">
                      {name.substring(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div className="space-y-0.5 w-full">
                    <div className="flex items-center justify-between gap-3">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-205">
                        {name}
                      </h4>
                      <span className="text-[9.5px] font-mono text-slate-400 bg-slate-50 dark:bg-black border border-black/5 px-1.5 py-0.5 rounded">
                        {contactRole}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-[10.5px] text-slate-500 dark:text-slate-400">
                      {email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          {email}
                        </span>
                      )}
                      {phone && (
                        <span className="flex items-center gap-1 font-mono">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
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
                    Consent to Create Contact File
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1">
                    You are authorizing Project Friend AI to create this contact directly under your synced Google Contacts:
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl space-y-1 text-xs">
                <p><span className="text-slate-400">Full Name:</span> <span className="text-slate-800 dark:text-slate-201 font-bold">{givenName} {familyName}</span></p>
                {emailValue && <p><span className="text-slate-400">Email:</span> <span className="text-slate-700 dark:text-slate-300 font-mono">{emailValue}</span></p>}
                {phoneValue && <p><span className="text-slate-400">Phone:</span> <span className="text-slate-700 dark:text-slate-340 font-mono">{phoneValue}</span></p>}
                <p><span className="text-slate-400">Role Assign:</span> <span className="text-indigo-650 font-bold">{contactRole}</span></p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmCreate(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-250 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isCreating}
                  onClick={handleCreateContact}
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-750 rounded-xl cursor-pointer shadow flex items-center gap-1"
                >
                  {isCreating ? "Adding contact..." : "Confirm & Create"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
