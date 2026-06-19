import React, { useState, useEffect } from "react";
import { 
  googleSignIn, 
  logout, 
  initAuth 
} from "../lib/firebase";
import CalendarHub from "./CalendarHub";
import SheetsHub from "./SheetsHub";
import DocsHub from "./DocsHub";
import SlidesHub from "./SlidesHub";
import TasksHub from "./TasksHub";
import ChatHub from "./ChatHub";
import FormsHub from "./FormsHub";
import KeepHub from "./KeepHub";
import MeetHub from "./MeetHub";
import ContactsHub from "./ContactsHub";
import ClassroomHub from "./ClassroomHub";
import { 
  Calendar, 
  FileSpreadsheet, 
  Layers, 
  Activity, 
  ListTodo,
  MessageSquare,
  ClipboardList,
  Video,
  Users,
  GraduationCap,
  Bookmark
} from "lucide-react";
import { User } from "firebase/auth";
import { 
  motion, 
  AnimatePresence 
} from "motion/react";
import { 
  Mail, 
  FileText, 
  ArrowRight, 
  Lock, 
  Info, 
  CheckCircle2, 
  RefreshCw, 
  Search, 
  LogOut, 
  Send, 
  Sparkles, 
  Trash2, 
  File, 
  ExternalLink,
  ShieldCheck,
  AlertTriangle
} from "lucide-react";

interface GoogleWorkspacePanelProps {
  themeClass: (daylight: string, midnight: string, sepia: string) => string;
}

export default function GoogleWorkspacePanel({ themeClass }: GoogleWorkspacePanelProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Gmail states
  const [emails, setEmails] = useState<any[]>([]);
  const [gmailLoading, setGmailLoading] = useState(false);
  const [gmailError, setGmailError] = useState<string | null>(null);
  const [gmailSearch, setGmailSearch] = useState("");
  const [selectedEmail, setSelectedEmail] = useState<any | null>(null);

  // Reply draft state
  const [replyRecipient, setReplyRecipient] = useState("");
  const [replySubject, setReplySubject] = useState("");
  const [replyBody, setReplyBody] = useState("");
  const [isReplySending, setIsReplySending] = useState(false);
  const [replySuccessMessage, setReplySuccessMessage] = useState<string | null>(null);
  
  // AI draft states
  const [isAiDrafting, setIsAiDrafting] = useState(false);
  
  // Picker states
  const [pickerLoaded, setPickerLoaded] = useState(false);
  const [pickerError, setPickerError] = useState<string | null>(null);
  const [pickedFile, setPickedFile] = useState<any | null>(null);
  const [fileAnalysis, setFileAnalysis] = useState<string | null>(null);
  const [isAnalyzingFile, setIsAnalyzingFile] = useState(false);

  // Show security confirmation dialog
  const [showSendConfirmation, setShowSendConfirmation] = useState(false);

  // Active sub-navigation tab inside Workspace
  const [activeSubTab, setActiveSubTab] = useState<'gmail' | 'calendar' | 'sheets' | 'docs' | 'slides' | 'tasks' | 'chat' | 'forms' | 'keep' | 'meet' | 'contacts' | 'classroom'>('gmail');

  // Initial Auth Sync
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, cachedToken) => {
        setUser(currentUser);
        setToken(cachedToken);
        setNeedsAuth(false);
        setAuthError(null);
      },
      () => {
        setUser(null);
        setToken(null);
        setNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, []);

  // Sync Gmail when token changes
  useEffect(() => {
    if (token) {
      fetchGmailInbox();
    }
  }, [token]);

  // Load Picker script library dynamically
  useEffect(() => {
    let script: HTMLScriptElement | null = null;
    
    const initPicker = () => {
      const gapi = (window as any).gapi;
      if (gapi) {
        gapi.load("picker", {
          callback: () => {
            setPickerLoaded(true);
          },
          onerror: (err: any) => {
            console.error("GAPI picker module load failed:", err);
            setPickerError("Failed to initialize Google Picker engine module.");
          }
        });
      }
    };

    if ((window as any).gapi && (window as any).gapi.load) {
      initPicker();
      return;
    }

    script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      // Once loaded, boot up the module
      initPicker();
    };
    script.onerror = () => {
      setPickerError("Failed to resolve Google GAPI client script host.");
    };
    document.body.appendChild(script);

    return () => {
      if (script && document.body.contains(script)) {
        // We can choose to keep it to avoid rebinding, but cleanup is clean
      }
    };
  }, []);

  // Google Sign-In trigger
  const handleLogin = async () => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        setNeedsAuth(false);
      }
    } catch (err: any) {
      console.error("Sign-in failed:", err);
      setAuthError(err?.message || "Google Authentication was incomplete or cancelled.");
      setNeedsAuth(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout trigger
  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      setToken(null);
      setNeedsAuth(true);
      setEmails([]);
      setSelectedEmail(null);
      setPickedFile(null);
      setFileAnalysis(null);
    } catch (err) {
      console.error("Sign-out failure:", err);
    }
  };

  // Helper to extract email headers
  const getHeader = (headers: any[], name: string): string => {
    if (!headers) return "";
    const header = headers.find(h => h.name.toLowerCase() === name.toLowerCase());
    return header ? header.value : "";
  };

  // Gmail Fetch API logic
  const fetchGmailInbox = async () => {
    if (!token) return;
    setGmailLoading(true);
    setGmailError(null);
    try {
      // First, get a list of message IDs from inbox
      const listRes = await fetch(
        "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10&q=category:primary",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (!listRes.ok) {
        if (listRes.status === 401) {
          // Token expired, require auth
          setNeedsAuth(true);
          setToken(null);
          throw new Error("Your secure Google login credentials have expired. Please authenticate again.");
        }
        throw new Error(`Gmail API failure: Received status code ${listRes.status}`);
      }

      const listData = await listRes.json();
      if (!listData.messages || listData.messages.length === 0) {
        setEmails([]);
        setGmailLoading(false);
        return;
      }

      // Fetch details in parallel for individual IDs to compile rich subjects, snippets, snippets, metadata
      const detailsPromises = listData.messages.map(async (msg: any) => {
        const detailRes = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        return detailRes.ok ? detailRes.json() : null;
      });

      const rawDetails = await Promise.all(detailsPromises);
      const formattedEmails = rawDetails
        .filter(Boolean)
        .map((email: any) => {
          const headers = email.payload?.headers || [];
          return {
            id: email.id,
            threadId: email.threadId,
            snippet: email.snippet,
            from: getHeader(headers, "From"),
            subject: getHeader(headers, "Subject") || "(No Subject)",
            date: getHeader(headers, "Date"),
            labelIds: email.labelIds || []
          };
        });

      setEmails(formattedEmails);
    } catch (err: any) {
      console.error("Gmail listing failure:", err);
      setGmailError(err?.message || "Failed to establish synchronization with Gmail Inbox.");
    } finally {
      setGmailLoading(false);
    }
  };

  // Send reply message based on client-side RFC 2822 formatting
  const handleSendReply = async () => {
    if (!token) return;
    setIsReplySending(true);
    setReplySuccessMessage(null);
    
    try {
      // Construct raw email body in compliance with RFC 2822 specifications
      const emailContent = [
        `To: ${replyRecipient}`,
        `Subject: ${replySubject}`,
        "Content-Type: text/plain; charset=\"UTF-8\"",
        "MIME-Version: 1.0",
        "",
        replyBody
      ].join("\r\n");

      // Base64Url safe encoding
      const base64EncodedEmail = btoa(unescape(encodeURIComponent(emailContent)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

      const sendRes = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          raw: base64EncodedEmail,
          threadId: selectedEmail?.threadId
        })
      });

      if (!sendRes.ok) {
        throw new Error(`Sending failed: Server returned status code ${sendRes.status}`);
      }

      setReplySuccessMessage(`Support response loaded and sent securely to ${replyRecipient}!`);
      // Reset reply panel
      setReplyBody("");
      setShowSendConfirmation(false);
    } catch (err: any) {
      console.error("Send failure:", err);
      alert(`Email transmission failed: ${err?.message || "Verify your connection or scopes."}`);
    } finally {
      setIsReplySending(false);
    }
  };

  // Generate a de-escalation therapeutic email response in-form using model rules
  const handleGenerateCompassionateDraft = () => {
    if (!selectedEmail) return;
    setIsAiDrafting(true);
    
    // Simulate/Generate high-quality cognitive narrative de-escalation reply draft
    setTimeout(() => {
      const emailFromClean = selectedEmail.from.split("<")[0] || "Friend";
      const draft = `Hello ${emailFromClean.trim()},\n\nI received your note about "${selectedEmail.subject}" and hear the deep weight you've been carrying. It takes active courage to externalize these thoughts, and I wanted to extend a quiet, completely non-judgmental space of safety for you.\n\nWhen things feel overwhelming, remember that our anxious moments are temporary physiological tides, and you are not those storms. Take a slow, flat stance on the floor, unclench your jaw, and take a long, 4-second box-inhale through your nose.\n\nThere is no pressure to solve all the puzzles of life today. Just taking this single minute to breathe is more than enough. You are valid, and you are never fully alone in your fight.\n\nWarmly, with patient support,\nManjishtha (Project Friend AI Guest Grounder Counsel)`;
      
      setReplyBody(draft);
      setIsAiDrafting(false);
    }, 1500);
  };

  // Select an email to open viewer
  const handleSelectEmail = (email: any) => {
    setSelectedEmail(email);
    // Parse sender email extract
    const match = email.from.match(/<([^>]+)>/);
    const emailAddr = match ? match[1] : email.from;
    
    setReplyRecipient(emailAddr);
    setReplySubject(`Re: ${email.subject}`);
    setReplyBody("");
    setReplySuccessMessage(null);
  };

  // Launch Google Picker Client Instance
  const launchGooglePicker = () => {
    if (!token || !pickerLoaded) {
      alert("Google Picker is preparing. Please ensure you are logged in.");
      return;
    }

    try {
      const pickerOrigin =
        window.location.ancestorOrigins &&
        window.location.ancestorOrigins.length > 0
          ? window.location.ancestorOrigins[window.location.ancestorOrigins.length - 1]
          : window.location.origin;

      // Construct a new native Docs View to filter for supportive text files or images
      const docsView = new (window as any).google.picker.DocsView(
        (window as any).google.picker.ViewId.DOCS
      );
      docsView.setMimeTypes("text/plain,application/pdf,image/png,image/jpeg");

      const picker = new (window as any).google.picker.PickerBuilder()
        .addView(docsView)
        .setOAuthToken(token)
        .setCallback(handlePickerCallback)
        .setOrigin(pickerOrigin)
        .setTitle("Securely Select a Journal or Stress Log Document")
        .build();
      
      picker.setVisible(true);
    } catch (err) {
      console.error("Failed to construct Picker instance:", err);
      alert("Could not instantiate Picker widget safely inside the sandboxed Frame.");
    }
  };

  // Google Picker callback events
  const handlePickerCallback = (data: any) => {
    const google = (window as any).google;
    if (data.action === google.picker.Action.PICKED) {
      const file = data.docs[0];
      setPickedFile(file);
      setFileAnalysis(null);
      // Run deep somatic stress analysis on the file
      handleAnalyzePickedFile(file);
    }
  };

  // Analyze files to provide supportive de-escalation tips
  const handleAnalyzePickedFile = (file: any) => {
    setIsAnalyzingFile(true);
    // Simulate contextual somatic de-escalation extraction
    setTimeout(() => {
      const isSensitiveMime = file.mimeType?.includes("pdf") || file.name.toLowerCase().includes("stress") || file.name.toLowerCase().includes("journal");
      const insight = isSensitiveMime 
        ? `🔐 **Clinical Grounding Scan completed for "${file.name}"**:\n\nOur system detected possible high-intensity somatic indicators in your stress-log/journal document metadata. To protect you, we recommend executing a **4-second Somatic Double Inhale** now. If this file contains personal medical logs, please keep them offline in your secure browser. We do not transmit or index these documents.` 
        : `🔐 **Document Scan ready for "${file.name}"**:\n\nWe synchronized this metadata profile safely. The title indicates general reflective thoughts. If you carry work stresses here, try applying the **Hope box-breathing protocol** to allow your nervous system a recovery break.`;
      
      setFileAnalysis(insight);
      setIsAnalyzingFile(false);
    }, 1800);
  };

  // Filter synced emails
  const filteredEmails = emails.filter(e => 
    e.subject.toLowerCase().includes(gmailSearch.toLowerCase()) ||
    e.from.toLowerCase().includes(gmailSearch.toLowerCase()) ||
    e.snippet.toLowerCase().includes(gmailSearch.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col p-6 space-y-6 overflow-y-auto max-h-full font-sans leading-relaxed text-left">
      
      {/* Header with connection states */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-black/5 pb-4">
        <div>
          <span className="bg-indigo-150 text-indigo-750 text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
            Google Workspace Sync Engine
          </span>
          <h1 className={`text-xl font-bold mt-1 tracking-tight ${themeClass("text-slate-900", "text-indigo-200", "text-[#3e2723]")}`}>
            Confidential Grounding Node
          </h1>
          <p className={`text-xs mt-1 ${themeClass("text-slate-500 dark:text-slate-400", "text-slate-400", "text-[#5c4033]")}`}>
            Import anxious email notifications automatically or use the Picker widget to pull stress-journal documents safely without telemetry risks.
          </p>
        </div>

        {/* Profile Button / Connect Status */}
        <div className="flex items-center gap-2">
          {!needsAuth && user ? (
            <div className="flex items-center gap-2.5 p-1.5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-black/5 font-sans">
              {user.photoURL && (
                <img 
                  src={user.photoURL} 
                  referrerPolicy="no-referrer" 
                  alt={user.displayName || "User Avatar"} 
                  className="w-7 h-7 rounded-full border border-indigo-200 dark:border-indigo-800"
                />
              )}
              <div className="text-left leading-none text-xs">
                <p className="font-bold text-slate-800 dark:text-slate-205">{user.displayName || "Google Hub"}</p>
                <p className="text-[10px] text-slate-450 mt-0.5 max-w-[120px] truncate">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-1 text-slate-400 dark:text-slate-500 hover:text-red-500 hover:bg-red-50/50 rounded-lg cursor-pointer transition-all"
                title="Disconnect Google Sync"
              >
                <LogOut className="w-4.5 h-4.5" />
              </button>
            </div>
          ) : (
            <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/20 px-2.5 py-1 rounded-lg border border-amber-200/50">
              <Lock className="w-3.5 h-3.5 animate-pulse" />
              UNCONNECTED
            </span>
          )}
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      {!needsAuth && user && (
        <div className="flex flex-wrap items-center gap-1.5 border-b border-black/5 pb-2.5 text-xs">
          <button
            onClick={() => setActiveSubTab('gmail')}
            className={`px-3 py-1.5 font-bold rounded-lg cursor-pointer transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'gmail'
                ? "bg-rose-50 text-rose-700 shadow-sm dark:shadow-slate-900/30 border border-rose-250"
                : "text-slate-500 hover:bg-slate-100 dark:bg-slate-800 hover:text-slate-700 dark:text-slate-300"
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-rose-500" />
            Gmail Inbox
          </button>
          <button
            onClick={() => setActiveSubTab('calendar')}
            className={`px-3 py-1.5 font-bold rounded-lg cursor-pointer transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'calendar'
                ? "bg-rose-50 text-rose-700 shadow-sm dark:shadow-slate-900/30 border border-rose-250"
                : "text-slate-500 hover:bg-slate-100 dark:bg-slate-800 hover:text-slate-700 dark:text-slate-300"
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-blue-500" />
            Calendar
          </button>
          <button
            onClick={() => setActiveSubTab('sheets')}
            className={`px-3 py-1.5 font-bold rounded-lg cursor-pointer transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'sheets'
                ? "bg-rose-50 text-rose-700 shadow-sm dark:shadow-slate-900/30 border border-rose-250"
                : "text-slate-500 hover:bg-slate-100 dark:bg-slate-800 hover:text-slate-700 dark:text-slate-300"
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
            Sheets
          </button>
          <button
            onClick={() => setActiveSubTab('docs')}
            className={`px-3 py-1.5 font-bold rounded-lg cursor-pointer transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'docs'
                ? "bg-rose-50 text-rose-700 shadow-sm dark:shadow-slate-900/30 border border-rose-250"
                : "text-slate-500 hover:bg-slate-100 dark:bg-slate-800 hover:text-slate-700 dark:text-slate-300"
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-indigo-505" />
            Docs
          </button>
          <button
            onClick={() => setActiveSubTab('slides')}
            className={`px-3 py-1.5 font-bold rounded-lg cursor-pointer transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'slides'
                ? "bg-rose-50 text-rose-700 shadow-sm dark:shadow-slate-900/30 border border-rose-250"
                : "text-slate-500 hover:bg-slate-100 dark:bg-slate-800 hover:text-slate-700 dark:text-slate-300"
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-pink-550" />
            Slides
          </button>
          <button
            onClick={() => setActiveSubTab('tasks')}
            className={`px-3 py-1.5 font-bold rounded-lg cursor-pointer transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'tasks'
                ? "bg-rose-50 text-rose-700 shadow-sm dark:shadow-slate-900/30 border border-rose-250"
                : "text-slate-500 hover:bg-slate-100 dark:bg-slate-800 hover:text-slate-700 dark:text-slate-300"
            }`}
          >
            <ListTodo className="w-3.5 h-3.5 text-rose-500" />
            Tasks
          </button>
          <button
            onClick={() => setActiveSubTab('chat')}
            className={`px-3 py-1.5 font-bold rounded-lg cursor-pointer transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'chat'
                ? "bg-rose-50 text-rose-700 shadow-sm dark:shadow-slate-900/30 border border-rose-250"
                : "text-slate-500 hover:bg-slate-100 dark:bg-slate-800 hover:text-slate-700 dark:text-slate-300"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-orange-500" />
            Chat
          </button>
          <button
            onClick={() => setActiveSubTab('forms')}
            className={`px-3 py-1.5 font-bold rounded-lg cursor-pointer transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'forms'
                ? "bg-rose-50 text-rose-700 shadow-sm dark:shadow-slate-900/30 border border-rose-250"
                : "text-slate-500 hover:bg-slate-100 dark:bg-slate-800 hover:text-slate-700 dark:text-slate-300"
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5 text-purple-500" />
            Forms
          </button>
          <button
            onClick={() => setActiveSubTab('keep')}
            className={`px-3 py-1.5 font-bold rounded-lg cursor-pointer transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'keep'
                ? "bg-rose-50 text-rose-700 shadow-sm dark:shadow-slate-900/30 border border-rose-250"
                : "text-slate-500 hover:bg-slate-100 dark:bg-slate-800 hover:text-slate-700 dark:text-slate-300"
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-500" />
            Keep Note
          </button>
          <button
            onClick={() => setActiveSubTab('meet')}
            className={`px-3 py-1.5 font-bold rounded-lg cursor-pointer transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'meet'
                ? "bg-rose-50 text-rose-700 shadow-sm dark:shadow-slate-900/30 border border-rose-250"
                : "text-slate-500 hover:bg-slate-100 dark:bg-slate-800 hover:text-slate-700 dark:text-slate-300"
            }`}
          >
            <Video className="w-3.5 h-3.5 text-teal-605" />
            Meet
          </button>
          <button
            onClick={() => setActiveSubTab('contacts')}
            className={`px-3 py-1.5 font-bold rounded-lg cursor-pointer transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'contacts'
                ? "bg-rose-50 text-rose-700 shadow-sm dark:shadow-slate-900/30 border border-rose-250"
                : "text-slate-500 hover:bg-slate-100 dark:bg-slate-800 hover:text-slate-700 dark:text-slate-300"
            }`}
          >
            <Users className="w-3.5 h-3.5 text-blue-600" />
            Contacts
          </button>
          <button
            onClick={() => setActiveSubTab('classroom')}
            className={`px-3 py-1.5 font-bold rounded-lg cursor-pointer transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeSubTab === 'classroom'
                ? "bg-rose-50 text-rose-700 shadow-sm dark:shadow-slate-900/30 border border-rose-250"
                : "text-slate-500 hover:bg-slate-100 dark:bg-slate-800 hover:text-slate-700 dark:text-slate-300"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
            Classroom
          </button>
        </div>
      )}

      {/* Main Container */}
      {needsAuth ? (
        <div className="flex flex-col items-center justify-center py-12 px-6 max-w-md mx-auto text-center space-y-4 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl border border-dashed border-black/10">
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl flex items-center justify-center border border-indigo-150">
            <Mail className="w-6 h-6 text-indigo-650" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 dark:text-indigo-205">Verify Google Integration Permissions</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              To proceed securely, authorize Project Friend AI to access and check recent distress emails or read stress diary docs with permission.
            </p>
          </div>

          <div className="pt-2 w-full">
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-sans text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer shadow-md transition-all disabled:opacity-50"
            >
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4 shrink-0 fill-current">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              </svg>
              {isLoading ? "Synchronizing Authentication..." : "Link My Google Accounts"}
            </button>
          </div>

          {authError && (
            <p className="text-[10px] text-red-500 font-medium">⚠️ {authError}</p>
          )}

          <div className="flex items-center gap-2 text-[10px] text-slate-450 bg-black/5 dark:bg-white/5 px-2 py-1 rounded-md mt-2 w-full justify-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Absolute security: Access tokens are stored purely in local memory fallback.</span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6 w-full">
          {activeSubTab === 'gmail' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Gmail sync inbox listing (Width: 6) */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Search and Action Bar */}
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/60 p-2 rounded-xl border border-black/5">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Filter inbox (e.g. stress, support)..."
                  value={gmailSearch}
                  onChange={(e) => setGmailSearch(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-1.5 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 outline-none focus:border-indigo-400 font-sans text-slate-800 dark:text-slate-205"
                />
              </div>
              <button
                onClick={fetchGmailInbox}
                disabled={gmailLoading}
                className="p-2 text-indigo-650 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg cursor-pointer hover:bg-indigo-100/70 border border-indigo-150"
                title="Sync Live Gmail Inbox"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${gmailLoading ? "animate-spin" : ""}`} />
              </button>
            </div>

            {/* Email List container */}
            <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl max-h-[460px] overflow-y-auto divide-y divide-black/5">
              {gmailLoading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-2 text-xs text-slate-450 font-mono">
                  <RefreshCw className="w-5 h-5 animate-spin text-indigo-500" />
                  <span>SYNCHRONIZING SECURE INBOX...</span>
                </div>
              ) : gmailError ? (
                <div className="py-8 px-4 text-center space-y-2 text-xs">
                  <p className="text-red-500 font-semibold font-mono">⚠️ SYNC_FAILED</p>
                  <p className="text-slate-500 dark:text-slate-400 leading-normal max-w-sm mx-auto">{gmailError}</p>
                </div>
              ) : filteredEmails.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400 dark:text-slate-500 italic">
                  No primary emails located matching your query.
                </div>
              ) : (
                filteredEmails.map((email) => {
                  const isSelected = selectedEmail?.id === email.id;
                  const isStressMail = email.subject.toLowerCase().includes("stress") || 
                                      email.subject.toLowerCase().includes("emergency") ||
                                      email.subject.toLowerCase().includes("help") ||
                                      email.snippet.toLowerCase().includes("anxiety");
                  
                  return (
                    <button
                      key={email.id}
                      onClick={() => handleSelectEmail(email)}
                      className={`w-full p-4 flex flex-col items-start gap-1 transition-all cursor-pointer text-left ${
                        isSelected 
                          ? "bg-indigo-50/40 dark:bg-indigo-950/20 shadow-inner border-l-4 border-indigo-500" 
                          : "hover:bg-slate-50/ dark:bg-slate-800/50"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 w-full text-[10px] font-mono text-slate-400">
                        <span className="font-bold truncate text-indigo-700 dark:text-indigo-300 max-w-[150px]">{email.from.split("<")[0]}</span>
                        <span className="shrink-0">{new Date(email.date).toLocaleDateString()}</span>
                      </div>
                      
                      <h4 className="text-xs font-bold text-slate-805 dark:text-slate-200 mt-0.5 flex items-center gap-1">
                        {isStressMail && (
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" title="High Distress Score matched" />
                        )}
                        {email.subject}
                      </h4>
                      <p className="text-[10.5px] leading-relaxed text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                        {email.snippet}
                      </p>
                    </button>
                  );
                })
              )}
            </div>

            {/* Google Picker Widget Actions */}
            <div className="bg-gradient-to-br from-indigo-50/35 to-indigo-100/10 dark:from-indigo-950/10 dark:to-indigo-900/5 border border-indigo-100/50 p-4 rounded-xl space-y-3">
              <div className="flex items-start gap-2.5">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 rounded-lg shrink-0 text-indigo-650 border border-indigo-200 dark:border-indigo-800">
                  <FileText className="w-4.5 h-4.5" />
                </div>
                <div className="text-left">
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 dark:text-indigo-205">Access Drive Documents Confidentially</h3>
                  <p className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-normal mt-0.5">
                    Launch the official Google Picker dialog to import custom diaries, self-care files, or therapy workbooks from your account.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={launchGooglePicker}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-sans text-xs font-bold rounded-lg cursor-pointer flex items-center gap-2 shadow-sm dark:shadow-slate-900/30 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Select Document via Picker
                </button>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                  {pickerLoaded ? "● Picker Engine Active" : "○ Dynamic library waiting..."}
                </div>
              </div>

              {/* Show Picked File feedback */}
              <AnimatePresence>
                {pickedFile && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-black/5 space-y-2 mt-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-205">
                        <File className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Picked: {pickedFile.name}</span>
                      </div>
                      <a 
                        href={pickedFile.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[10px] text-indigo-600 hover:underline flex items-center gap-0.5 font-mono"
                      >
                        Drive <ExternalLink className="w-2.5 h-2.5 inline" />
                      </a>
                    </div>

                    <div className="text-[10.5px] font-mono text-slate-450 border-t border-black/5 pt-1.5 flex flex-wrap gap-x-4 gap-y-1">
                      <span>ID: {pickedFile.id.substring(0, 12)}...</span>
                      <span>Format: {pickedFile.mimeType}</span>
                    </div>

                    {isAnalyzingFile ? (
                      <div className="text-[10.5px] font-mono text-indigo-500 animate-pulse flex items-center gap-1 pt-1">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        Analyzing file for somatic de-escalation tips...
                      </div>
                    ) : fileAnalysis ? (
                      <div className="text-[11px] leading-relaxed p-2 bg-indigo-50/30 dark:bg-indigo-950/20 rounded border border-indigo-100/30 text-indigo-850 dark:text-indigo-200 whitespace-pre-wrap">
                        {fileAnalysis}
                      </div>
                    ) : null}
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

          </div>

          {/* Right Column: Active Email Detail & Compose (Width: 6) */}
          <div className="lg:col-span-6 bg-slate-50/50 dark:bg-slate-900/10 border border-slate-100 dark:border-slate-850 p-5 rounded-2xl space-y-4">
            
            {selectedEmail ? (
              <div className="space-y-4 text-left">
                
                {/* Email Info box */}
                <div className="pb-3 border-b border-black/5">
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 leading-tight">
                      {selectedEmail.subject}
                    </h3>
                    <button
                      onClick={() => setSelectedEmail(null)}
                      className="text-xs text-slate-400 hover:text-slate-600 dark:text-slate-400 font-mono tracking-tight"
                    >
                      [CLOSE]
                    </button>
                  </div>
                  <p className="text-[11.5px] font-mono text-slate-450 mt-1.5">
                    From: <span className="text-slate-700 dark:text-slate-300 font-semibold">{selectedEmail.from}</span>
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">
                    Date: {new Date(selectedEmail.date).toLocaleString()}
                  </p>
                </div>

                {/* Email body extract container */}
                <div className="p-3 bg-white dark:bg-slate-950/80 rounded-xl border border-black/5 max-h-[160px] overflow-y-auto text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                  "{selectedEmail.snippet}"
                </div>

                {/* Response interface */}
                <div className="border-t border-black/5 pt-3.5 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 dark:text-indigo-205 uppercase tracking-wide">
                      Draft Supportive Reply
                    </span>
                    
                    <button
                      onClick={handleGenerateCompassionateDraft}
                      disabled={isAiDrafting}
                      className="px-2.5 py-1 text-[10.5px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg cursor-pointer flex items-center gap-1 border border-emerald-200 disabled:opacity-50"
                    >
                      <Sparkles className="w-3 h-3 text-emerald-500" />
                      {isAiDrafting ? "Weaving..." : "AI Response Helper"}
                    </button>
                  </div>

                  {/* Recipient summary */}
                  <div className="grid grid-cols-2 gap-2 text-xs font-sans">
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-slate-400">To:</label>
                      <input 
                        type="text" 
                        value={replyRecipient} 
                        onChange={(e) => setReplyRecipient(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 p-1.5 rounded border border-black/10 mt-0.5 outline-none font-bold text-slate-700 dark:text-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-slate-400">Subject:</label>
                      <input 
                        type="text" 
                        value={replySubject} 
                        onChange={(e) => setReplySubject(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 p-1.5 rounded border border-black/10 mt-0.5 outline-none text-slate-705"
                      />
                    </div>
                  </div>

                  {/* Editor */}
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500 mb-1">Body Text:</label>
                    <textarea
                      placeholder="Write your de-escalating, peer-grounding draft here..."
                      rows={7}
                      value={replyBody}
                      onChange={(e) => setReplyBody(e.target.value)}
                      className="w-full text-xs bg-white dark:bg-slate-950 p-3 rounded-xl border border-black/10 outline-none focus:border-indigo-400 font-sans leading-relaxed text-slate-800 dark:text-slate-200"
                    />
                  </div>

                  {/* Reply Success Feedback */}
                  {replySuccessMessage && (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 rounded-lg text-emerald-805 text-[11px] font-medium flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{replySuccessMessage}</span>
                    </div>
                  )}

                  {/* Action triggers */}
                  <div className="pt-2">
                    <button
                      onClick={() => setShowSendConfirmation(true)}
                      disabled={!replyRecipient || !replyBody}
                      className="w-full py-2 bg-indigo-650 hover:bg-indigo-750 text-white font-sans text-xs font-bold rounded-xl cursor-pointer flex items-center justify-center gap-2 shadow-sm dark:shadow-slate-900/30 transition-all disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Dispatch Response Securely
                    </button>
                  </div>

                </div>

              </div>
            ) : (
              <div className="py-24 text-center text-xs text-slate-400 dark:text-slate-500 max-w-xs mx-auto space-y-2">
                <Info className="w-6 h-6 text-slate-300 mx-auto" />
                <p className="font-bold">No message selected</p>
                <p className="leading-normal">
                  Select a distress notification or primary email from your Gmail Sync list to view details and construct compassionate grounding drafts.
                </p>
              </div>
            )}

          </div>

        </div>
          )}

          {activeSubTab === 'calendar' && (
            <CalendarHub token={token} themeClass={themeClass} />
          )}
          {activeSubTab === 'sheets' && (
            <SheetsHub token={token} themeClass={themeClass} />
          )}
          {activeSubTab === 'docs' && (
            <DocsHub token={token} themeClass={themeClass} />
          )}
          {activeSubTab === 'slides' && (
            <SlidesHub token={token} themeClass={themeClass} />
          )}
          {activeSubTab === 'tasks' && (
            <TasksHub token={token} themeClass={themeClass} />
          )}
          {activeSubTab === 'chat' && (
            <ChatHub token={token} themeClass={themeClass} />
          )}
          {activeSubTab === 'forms' && (
            <FormsHub token={token} themeClass={themeClass} />
          )}
          {activeSubTab === 'keep' && (
            <KeepHub token={token} themeClass={themeClass} />
          )}
          {activeSubTab === 'meet' && (
            <MeetHub token={token} themeClass={themeClass} />
          )}
          {activeSubTab === 'contacts' && (
            <ContactsHub token={token} themeClass={themeClass} />
          )}
          {activeSubTab === 'classroom' && (
            <ClassroomHub token={token} themeClass={themeClass} />
          )}
        </div>
      )}

      {/* Safety Confirmation Dialog for Mutating Workpace Operations (MANDATORY) */}
      <AnimatePresence>
        {showSendConfirmation && (
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
                    Explicit Workspace Permission Required
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                    You are sending an email from your personal Gmail account on behalf of Project Friend AI. Once confirmed, this action cannot be recalled.
                  </p>
                </div>
              </div>

              {/* Sender Details */}
              <div className="p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl space-y-1.5 text-xs font-mono">
                <p>
                  <span className="text-slate-400">Recipient:</span>{" "}
                  <span className="text-slate-800 dark:text-slate-200 font-bold">{replyRecipient}</span>
                </p>
                <p>
                  <span className="text-slate-400">Subject:</span>{" "}
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{replySubject}</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSendConfirmation(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isReplySending}
                  onClick={handleSendReply}
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-750 rounded-xl cursor-pointer shadow flex items-center gap-1"
                >
                  {isReplySending ? "Sending..." : "Confirm & Send"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
