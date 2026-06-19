import React, { useState, useEffect } from "react";
import { 
  Pin, 
  Trash2, 
  Plus, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  AlertTriangle,
  FolderOpen,
  CheckSquare,
  Square,
  X,
  Calendar,
  Mail,
  ListTodo,
  CheckCircle,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { db, auth } from "../lib/firebase";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  onSnapshot,
  where
} from "firebase/firestore";

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface KeepHubProps {
  token: string | null;
  themeClass: (daylight: string, midnight: string, sepia: string) => string;
}

interface ChecklistItem {
  text: string;
  completed: boolean;
}

interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  pinned: boolean;
  tags: string[];
  updatedAt: string;
  type: "text" | "checklist";
  listItems?: ChecklistItem[];
}

type ExportType = "docs" | "tasks" | "calendar" | "gmail";

const PASTEL_COLORS = [
  { name: "Slate", class: "bg-white dark:bg-black border-black/10 text-slate-800 dark:text-slate-100" },
  { name: "Rose", class: "bg-rose-50/55 dark:bg-rose-955/20 border-rose-200/60 text-slate-800 dark:text-slate-100" },
  { name: "Mint", class: "bg-emerald-50/50 dark:bg-emerald-955/20 border-emerald-200/60 text-slate-800 dark:text-slate-100" },
  { name: "Ocean", class: "bg-sky-50/50 dark:bg-sky-955/20 border-sky-200/60 text-slate-800 dark:text-slate-100" },
  { name: "Amber", class: "bg-amber-50/50 dark:bg-amber-955/20 border-amber-200/60 text-slate-800 dark:text-slate-100" },
  { name: "Sand", class: "bg-orange-50/50 dark:bg-orange-955/20 border-orange-200/60 text-slate-800 dark:text-slate-100" }
];

export default function KeepHub({ token, themeClass }: KeepHubProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("All");

  // Real Google Keep API states
  const [keepApiNotes, setKeepApiNotes] = useState<any[]>([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [viewSource, setViewSource] = useState<"firestore" | "google_keep">("firestore");

  // Type of Note being created (text / checklist)
  const [noteType, setNoteType] = useState<"text" | "checklist">("text");

  // New Note state
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteColor, setNoteColor] = useState("bg-white dark:bg-black border-black/10 text-slate-800 dark:text-slate-100");
  const [noteTags, setNoteTags] = useState("");

  // Checklist specific draft states
  const [draftItems, setDraftItems] = useState<ChecklistItem[]>([]);
  const [newItemText, setNewItemText] = useState("");

  // Export & sync animation triggers
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [exportMessage, setExportMessage] = useState<string | null>(null);

  // Security confirmation variables (MANDATORY FOR MUTATING OPERATIONS)
  const [pendingExport, setPendingExport] = useState<{ type: ExportType; note: Note } | null>(null);

  // Calendar configuration inputs (used in the calendar export consensus form)
  const [calDate, setCalDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [calTime, setCalTime] = useState("12:00");
  const [calDuration, setCalDuration] = useState("15");

  // Tasks configuration inputs
  const [taskDue, setTaskDue] = useState("");

  // Firestore synchronization
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const unbindAuth = auth.onAuthStateChanged((currentUser) => {
      if (unsubscribe) unsubscribe();

      if (!currentUser) {
        setNotes([]);
        setLoading(false);
        return;
      }

      const path = "keep_notes";
      const q = query(
        collection(db, path),
        where("userId", "==", currentUser.uid)
      );

      unsubscribe = onSnapshot(q, (snapshot) => {
        const items: Note[] = [];
        snapshot.forEach((d) => {
          const data = d.data();
          items.push({
            id: d.id,
            title: data.title || "",
            content: data.content || "",
            color: data.color || "bg-white dark:bg-black border-black/10 text-slate-800 dark:text-slate-100",
            pinned: !!data.pinned,
            tags: data.tags || [],
            updatedAt: data.updatedAt || new Date().toISOString(),
            type: data.type || "text",
            listItems: data.listItems || []
          });
        });
        // Sort pinned first, then newest update
        items.sort((a, b) => {
          if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });
        setNotes(items);
        setLoading(false);
      }, (err) => {
        handleFirestoreError(err, OperationType.GET, path);
        setLoading(false);
      });
    });

    return () => {
      unbindAuth();
      if (unsubscribe) unsubscribe();
    };
  }, [token]);

  // Fetch real notes from Google Keep REST API
  const fetchGoogleKeepNotes = async () => {
    if (!token) {
      setApiError("Authentication token is missing. Please sign in with Google.");
      return;
    }
    setApiLoading(true);
    setApiError(null);
    try {
      const res = await fetch("https://keep.googleapis.com/v1/notes", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        if (res.status === 403 || res.status === 401) {
          throw new Error("403_ENTERPRISE_RESTRICTION");
        }
        throw new Error(`Google Keep API Error: HTTP Status ${res.status}`);
      }
      const data = await res.json();
      setKeepApiNotes(data.notes || []);
    } catch (err: any) {
      console.error("Keep API fetch failure:", err);
      if (err?.message === "403_ENTERPRISE_RESTRICTION") {
        setApiError("enterprise_restricted");
      } else {
        setApiError(err?.message || "Failed to establish a network connection with the Google Keep API service.");
      }
    } finally {
      setApiLoading(false);
    }
  };

  // Trigger Google Keep fetch when switching source tab and token is loaded
  useEffect(() => {
    if (viewSource === "google_keep" && token) {
      fetchGoogleKeepNotes();
    }
  }, [viewSource, token]);

  // Quick helper to add item to list draft
  const handleAddDraftItem = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newItemText.trim()) return;
    setDraftItems([...draftItems, { text: newItemText.trim(), completed: false }]);
    setNewItemText("");
  };

  // Quick helper to remove item from list draft
  const handleRemoveDraftItem = (idx: number) => {
    setDraftItems(draftItems.filter((_, i) => i !== idx));
  };

  // Create Note
  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (noteType === "text" && !noteTitle && !noteContent) return;
    if (noteType === "checklist" && !noteTitle && draftItems.length === 0) return;

    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const tagsArray = noteTags
      .split(",")
      .map(t => t.trim())
      .filter(t => t.length > 0)
      .map(t => t.startsWith("#") ? t : `#${t}`);

    const path = "keep_notes";
    try {
      await addDoc(collection(db, path), {
        title: noteTitle || (noteType === "text" ? "Untitled Note" : "Untitled List"),
        content: noteType === "text" ? noteContent : "",
        color: noteColor,
        pinned: false,
        tags: tagsArray.length > 0 ? tagsArray : ["#General"],
        type: noteType,
        listItems: noteType === "checklist" ? draftItems : [],
        updatedAt: new Date().toISOString(),
        userId: currentUser.uid
      });

      // Clear input fields
      setNoteTitle("");
      setNoteContent("");
      setNoteTags("");
      setDraftItems([]);
      setNewItemText("");
      setNoteColor("bg-white dark:bg-black border-black/10 text-slate-800 dark:text-slate-100");
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  // Toggle Pinned status
  const handleTogglePin = async (note: Note) => {
    const path = `keep_notes/${note.id}`;
    try {
      const noteRef = doc(db, "keep_notes", note.id);
      await updateDoc(noteRef, {
        pinned: !note.pinned,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  // Toggle a checklist item completed state directly within a note card
  const handleToggleChecklistItem = async (note: Note, index: number) => {
    if (!note.listItems) return;
    const updatedItems = [...note.listItems];
    updatedItems[index] = {
      ...updatedItems[index],
      completed: !updatedItems[index].completed
    };
    const path = `keep_notes/${note.id}`;
    try {
      const noteRef = doc(db, "keep_notes", note.id);
      await updateDoc(noteRef, {
        listItems: updatedItems,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, path);
    }
  };

  // Delete Note with user confirmation
  const handleDeleteNote = async (id: string) => {
    if (!window.confirm("Move this Keep note to trash? This will remove it from your synchronized workspace.")) return;
    const path = `keep_notes/${id}`;
    try {
      await deleteDoc(doc(db, "keep_notes", id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  };

  // EXPORT PROCESS DISPATCHER AFTER CONSENT IS ACQUIRED
  const executeExport = async () => {
    if (!pendingExport || !token) return;
    const { type, note } = pendingExport;
    setPendingExport(null); // Close modal 

    if (type === "docs") {
      await executeDocsExport(note);
    } else if (type === "tasks") {
      await executeTasksExport(note);
    } else if (type === "calendar") {
      await executeCalendarExport(note);
    } else if (type === "gmail") {
      await executeGmailExport(note);
    }
  };

  // 1. Export Note to Google Docs
  const executeDocsExport = async (note: Note) => {
    setIsExporting(note.id);
    setExportMessage(null);
    try {
      // 1. Create a blank Google Doc
      const createRes = await fetch("https://docs.googleapis.com/v1/documents", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: `📝 Keep Export: ${note.title}`
        })
      });

      if (!createRes.ok) {
        throw new Error(`Google Docs creation failed: Status code ${createRes.status}`);
      }

      const docData = await createRes.json();
      const documentId = docData.documentId;

      // 2. format content
      let noteBody = "";
      if (note.type === "checklist" && note.listItems) {
        noteBody = note.listItems.map(item => `${item.completed ? "☑" : "☐"} ${item.text}`).join("\n");
      } else {
        noteBody = note.content;
      }

      const fullText = `${note.title}\n\n${noteBody}\n\nTags: ${note.tags.join(", ")}\nExported: ${new Date().toLocaleString()}\n`;

      const updateRes = await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          requests: [
            {
              insertText: {
                location: { index: 1 },
                text: fullText
              }
            }
          ]
        })
      });

      if (!updateRes.ok) {
        throw new Error(`Google Docs append text failed: Status code ${updateRes.status}`);
      }

      setExportMessage(`Successfully exported to a secure Google Doc: "Keep Export: ${note.title}"!`);
    } catch (err: any) {
      console.error("Docs export error:", err);
      alert(`Export failed: ${err?.message}`);
    } finally {
      setIsExporting(null);
    }
  };

  // 2. Clear & Add task to default list
  const executeTasksExport = async (note: Note) => {
    setIsExporting(note.id);
    setExportMessage(null);
    try {
      let noteBody = "";
      if (note.type === "checklist" && note.listItems) {
        noteBody = note.listItems.map(item => `${item.completed ? "☑" : "☐"} ${item.text}`).join("\r\n");
      } else {
        noteBody = note.content;
      }

      const payload: any = {
        title: `📝 Keep: ${note.title}`,
        notes: `${noteBody}\r\n\r\nTags: ${note.tags.join(", ")}`
      };

      if (taskDue) {
        payload.due = new Date(taskDue).toISOString();
      }

      const res = await fetch("https://tasks.googleapis.com/tasks/v1/lists/@default/tasks", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`Failed to create Google task: Status code ${res.status}`);
      }

      setExportMessage(`Added "${note.title}" to your primary Google Tasks list securely!`);
    } catch (err: any) {
      console.error("Google task export error:", err);
      alert(`Failed to add Google Task: ${err?.message}`);
    } finally {
      setIsExporting(null);
    }
  };

  // 3. Add to Calendar
  const executeCalendarExport = async (note: Note) => {
    setIsExporting(note.id);
    setExportMessage(null);
    try {
      const startDateTime = new Date(`${calDate}T${calTime}:00`);
      const endDateTime = new Date(startDateTime.getTime() + parseInt(calDuration) * 60000);

      let noteBody = "";
      if (note.type === "checklist" && note.listItems) {
        noteBody = note.listItems.map(item => `${item.completed ? "[x]" : "[ ]"} ${item.text}`).join("\n");
      } else {
        noteBody = note.content;
      }

      const payload = {
        summary: `✨ Mindful Review: ${note.title}`,
        description: `${noteBody}\n\nTags: ${note.tags.join(", ")}\nCreated via Keep Companion`,
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
        },
        reminders: {
          useDefault: true
        }
      };

      const res = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`Failed to schedule calendar event: Status code ${res.status}`);
      }

      setExportMessage(`Mindfulness block for "${note.title}" was placed on your Google Calendar!`);
    } catch (err: any) {
      console.error("Calendar export error:", err);
      alert(`Failed to schedule Calendar Event: ${err?.message}`);
    } finally {
      setIsExporting(null);
    }
  };

  // 4. Send Email Copy
  const executeGmailExport = async (note: Note) => {
    setIsExporting(note.id);
    setExportMessage(null);
    try {
      let noteBody = "";
      if (note.type === "checklist" && note.listItems) {
        noteBody = note.listItems.map(item => `${item.completed ? "☑" : "☐"} ${item.text}`).join("\r\n");
      } else {
        noteBody = note.content;
      }

      const emailParts = [
        "To: me",
        `Subject: Keep Note: ${note.title}`,
        "MIME-Version: 1.0",
        "Content-Type: text/plain; charset=UTF-8",
        "",
        `${noteBody}\r\n\r\nTags: ${note.tags.join(", ")}\r\n\r\nSent safely from your Project Friend Keep workspace.`
      ];
      const emailContent = emailParts.join("\r\n");
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
          raw: base64EncodedEmail
        })
      });

      if (!sendRes.ok) {
        throw new Error(`Sending failed: Server returned status code ${sendRes.status}`);
      }

      setExportMessage(`A beautiful copy of "${note.title}" was safely emailed to your Gmail inbox!`);
    } catch (err: any) {
      console.error("Gmail transmission failure:", err);
      alert(`Email transmission failed: ${err?.message}`);
    } finally {
      setIsExporting(null);
    }
  };

  // Filter notes based on category toggle & search text
  const filteredNotes = notes.filter((n) => {
    const matchesSearch = 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.listItems && n.listItems.some(item => item.text.toLowerCase().includes(searchQuery.toLowerCase())));
    
    const matchesTag = 
      selectedTag === "All" ||
      n.tags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase());

    return matchesSearch && matchesTag;
  });

  // Extract all distinct hashtags used as selectors
  const allTagsSet = new Set<string>();
  notes.forEach(n => n.tags.forEach(t => allTagsSet.add(t)));
  const uniqueTags = Array.from(allTagsSet);

  return (
    <div className="space-y-6 font-sans">
      
      {/* Informative connection status notice */}
      <div className="p-4 bg-indigo-50/60 dark:bg-black border border-indigo-150 rounded-2xl text-[11px] text-indigo-900 dark:text-indigo-200 text-left space-y-1">
        <div className="flex items-center gap-1.5 font-bold">
          <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
          <span>Interactive Keep Syncing & Workspace Workspace</span>
        </div>
        <p className="leading-relaxed opacity-90">
          This panel is backed by dynamic Firestore cloud persistence so your notes stay synchronized across any device. 
          Use the quick-action icons below on any note to safely push them directly into your real **Google Docs**, **Google Tasks**, **Google Calendar**, or broadcast a draft to **Gmail**!
        </p>
      </div>

      {/* Tab Switcher - Local Companion Firestore vs Google Keep REST API */}
      <div className="flex flex-col sm:flex-row gap-3 border-b border-black/5 justify-between items-start sm:items-center pb-2">
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setViewSource("firestore")}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              viewSource === "firestore"
                ? "bg-indigo-650 text-white shadow-sm"
                : "bg-slate-100 dark:bg-[#0a0a0a] text-slate-600 dark:text-slate-350 hover:bg-slate-200"
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Companion Hub (Secure Firestore Cloud)</span>
          </button>
          <button
            onClick={() => setViewSource("google_keep")}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
              viewSource === "google_keep"
                ? "bg-indigo-650 text-white shadow-sm"
                : "bg-slate-100 dark:bg-[#0a0a0a] text-slate-600 dark:text-slate-350 hover:bg-slate-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Real Keep REST API (Enterprise Sync)</span>
          </button>
        </div>
        {viewSource === "google_keep" && (
          <button
            type="button"
            onClick={fetchGoogleKeepNotes}
            disabled={apiLoading}
            className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-indigo-600 font-mono cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${apiLoading ? "animate-spin" : ""}`} />
            <span>{apiLoading ? "STRETCHING API..." : "REFRESH API"}</span>
          </button>
        )}
      </div>

      {viewSource === "firestore" ? (
        <>
          {/* Create note builder bar */}
          <div className="max-w-xl mx-auto">
            <form onSubmit={handleCreateNote} className={`p-4 rounded-2xl border transition-all shadow-sm ${noteColor} space-y-3.5 text-left`}>
              <div className="flex items-center justify-between border-b border-black/5 pb-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setNoteType("text")}
                    className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                      noteType === "text" 
                        ? "bg-black text-white dark:bg-slate-100 dark:text-slate-900" 
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    Text Note
                  </button>
                  <button
                    type="button"
                    onClick={() => setNoteType("checklist")}
                    className={`px-3 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                      noteType === "checklist" 
                        ? "bg-black text-white dark:bg-slate-100 dark:text-slate-900" 
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    Checklist
                  </button>
                </div>
                <Sparkles className="w-3.5 h-3.5 text-slate-300" />
              </div>

              <div className="space-y-2">
                <input 
                  type="text"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="Note Title"
                  className="bg-transparent text-xs font-bold outline-none border-none placeholder-slate-400 w-full text-slate-805 dark:text-slate-100 font-sans"
                />

                {noteType === "text" ? (
                  <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    rows={2}
                    placeholder="Take a mindful note or record stress diaries..."
                    className="bg-transparent text-xs outline-none border-none placeholder-slate-400 w-full text-slate-600 dark:text-slate-200 resize-none leading-relaxed font-sans"
                  />
                ) : (
                  <div className="space-y-2.5 pt-1">
                    {/* Render draft items */}
                    {draftItems.length > 0 && (
                      <div className="space-y-1.5 max-h-28 overflow-y-auto pl-1">
                        {draftItems.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-200 bg-black/5 dark:bg-white/5 py-1 px-2.5 rounded-lg">
                            <span className="flex items-center gap-1.5">
                              <Square className="w-3 h-3 text-slate-300" />
                              {item.text}
                            </span>
                            <button 
                              type="button" 
                              onClick={() => handleRemoveDraftItem(idx)}
                              className="text-slate-400 hover:text-red-500 cursor-pointer"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Draft item input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newItemText}
                        onChange={(e) => setNewItemText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddDraftItem();
                          }
                        }}
                        placeholder="Add checklist item..."
                        className="bg-transparent text-xs border-b border-black/10 dark:border-white/10 pb-1 outline-none text-slate-605 dark:text-slate-200 placeholder-slate-400 w-full font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddDraftItem()}
                        className="p-1 px-2 bg-slate-100 dark:bg-[#0a0a0a] text-[10px] rounded hover:bg-slate-200 transition-colors cursor-pointer"
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-1 font-sans">
                <input 
                  type="text"
                  value={noteTags}
                  onChange={(e) => setNoteTags(e.target.value)}
                  placeholder="Tags (comma-separated, e.g. Somatic, Reflection)"
                  className="bg-transparent text-[10px] outline-none border-none placeholder-slate-400 w-full font-mono text-slate-500"
                />
              </div>

              {/* Color Palletes and Submit */}
              <div className="flex items-center justify-between pt-2.5 border-t border-black/5 font-sans">
                <div className="flex items-center gap-1.5">
                  {PASTEL_COLORS.map((col) => (
                    <button
                      key={col.name}
                      type="button"
                      onClick={() => setNoteColor(col.class)}
                      title={col.name}
                      className={`w-4 h-4 rounded-full border transition-all ${col.class} hover:scale-115 cursor-pointer ${
                        noteColor === col.class ? "ring-2 ring-indigo-400 scale-110" : ""
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={
                    noteType === "text" 
                      ? (!noteTitle && !noteContent) 
                      : (!noteTitle && draftItems.length === 0)
                  }
                  className="p-1.5 px-3 bg-black dark:bg-slate-100 dark:text-slate-900 text-white font-bold rounded-lg hover:bg-slate-850 transition-all cursor-pointer text-[11px] disabled:opacity-40"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>

          {exportMessage && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 max-w-xl mx-auto border border-emerald-150 rounded-xl text-emerald-800 dark:text-emerald-300 text-[11px] font-medium flex items-center gap-2 text-left">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{exportMessage}</span>
            </div>
          )}

          {/* Filter and Search rail */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-black/5 pb-4">
            {/* Search */}
            <div className="relative w-full sm:max-w-xs text-left">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                className="w-full bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-xl p-2 pl-8 outline-none text-xs text-slate-700 dark:text-slate-200"
              />
            </div>

            {/* Tags toggles */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
              <button
                onClick={() => setSelectedTag("All")}
                className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-lg transition-all shrink-0 cursor-pointer ${
                  selectedTag === "All"
                    ? "bg-indigo-650 text-white"
                    : "bg-white dark:bg-slate-950 border border-black/5 text-slate-500 hover:text-slate-850"
                }`}
              >
                All
              </button>
              {uniqueTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-lg transition-all shrink-0 cursor-pointer ${
                    selectedTag.toLowerCase() === tag.toLowerCase()
                      ? "bg-indigo-650 text-white"
                      : "bg-white dark:bg-slate-950 border border-black/5 text-slate-500 hover:text-slate-850"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Keep Tiles grid layout */}
          {loading ? (
            <div className="py-16 text-center text-xs text-slate-405 font-mono flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              SYNCING LOCAL STORAGE DIARIES...
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400 italic bg-white dark:bg-slate-950 border border-black/5 rounded-2xl p-6">
              No Keep notes stored. Launch a new entry using the console above.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
              {filteredNotes.map((note) => {
                return (
                  <div 
                    key={note.id} 
                    className={`p-4 rounded-xl border flex flex-col justify-between transition-all group scale-100 hover:shadow-md ${note.color}`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="text-xs font-bold">{note.title}</h4>
                        <button 
                          onClick={() => handleTogglePin(note)}
                          className={`p-1 rounded-lg hover:bg-black/5 transition-colors cursor-pointer ${
                            note.pinned ? "text-indigo-600 scale-105" : "text-slate-300"
                          }`}
                        >
                          <Pin className="w-3.5 h-3.5 fill-current" />
                        </button>
                      </div>

                      {note.type === "text" ? (
                        <p className="text-[11px] leading-relaxed whitespace-pre-wrap opacity-95">
                          {note.content}
                        </p>
                      ) : (
                        <div className="space-y-1.5 pt-1">
                          {note.listItems?.map((item, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleToggleChecklistItem(note, idx)}
                              className="flex items-center gap-1.5 w-full text-left text-[11px] focus:outline-none cursor-pointer"
                            >
                              {item.completed ? (
                                <>
                                  <CheckSquare className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                  <span className="line-through text-slate-400 dark:text-slate-450">{item.text}</span>
                                </>
                              ) : (
                                <>
                                  <Square className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                                  <span>{item.text}</span>
                                </>
                              )}
                            </button>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1 pt-1.5">
                        {note.tags.map((t) => (
                          <span key={t} className="text-[9px] font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/55 dark:bg-white/[0.02]/25 px-1.5 py-0.5 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-2.5 border-t border-black/5">
                      <span className="text-[9px] font-mono text-slate-400">
                        {new Date(note.updatedAt).toLocaleDateString()}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {token && (
                          <div className="flex items-center gap-1">
                            {/* Doc Export */}
                            <button 
                              onClick={() => setPendingExport({ type: "docs", note })}
                              disabled={isExporting === note.id}
                              title="Create Google Doc"
                              className="p-1 bg-white dark:bg-[#0a0a0a] hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-400 hover:text-indigo-600 rounded cursor-pointer transition-colors border border-black/5"
                            >
                              <FileText className="w-3 h-3" />
                            </button>

                            {/* Task Export */}
                            <button 
                              onClick={() => setPendingExport({ type: "tasks", note })}
                              disabled={isExporting === note.id}
                              title="Convert to Google Task"
                              className="p-1 bg-white dark:bg-[#0a0a0a] hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-400 hover:text-indigo-600 rounded cursor-pointer transition-colors border border-black/5"
                            >
                              <ListTodo className="w-3 h-3" />
                            </button>

                            {/* Calendar Slot */}
                            <button 
                              onClick={() => setPendingExport({ type: "calendar", note })}
                              disabled={isExporting === note.id}
                              title="Schedule self-care break"
                              className="p-1 bg-white dark:bg-[#0a0a0a] hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-400 hover:text-indigo-600 rounded cursor-pointer transition-colors border border-black/5"
                            >
                              <Calendar className="w-3 h-3" />
                            </button>

                            {/* Gmail copy */}
                            <button 
                              onClick={() => setPendingExport({ type: "gmail", note })}
                              disabled={isExporting === note.id}
                              title="Send copy to my Gmail"
                              className="p-1 bg-white dark:bg-[#0a0a0a] hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-400 hover:text-indigo-600 rounded cursor-pointer transition-colors border border-black/5"
                            >
                              <Mail className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        <button 
                          onClick={() => handleDeleteNote(note.id)}
                          title="Delete note"
                          className="p-1 text-slate-400 hover:text-red-500 rounded cursor-pointer hover:scale-105 transition-all"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <div className="space-y-6">
          {apiLoading ? (
            <div className="py-16 text-center text-xs text-slate-405 font-mono flex items-center justify-center gap-2 bg-slate-50 dark:bg-black border border-slate-100 dark:border-white/10 rounded-2xl p-6">
              <span className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <span>ESTABLISHING SECURE REST HANDSHAKE WITH GOOGLE KEEP SERVICE...</span>
            </div>
          ) : apiError === "enterprise_restricted" ? (
            <div className="p-6 bg-slate-50 dark:bg-black border border-slate-150 rounded-2xl text-left space-y-4 max-w-xl mx-auto font-sans">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-amber-100 dark:bg-amber-955/20 text-amber-600 rounded-xl shrink-0">
                  <AlertTriangle className="w-5.5 h-5.5" />
                </div>
                <div className="space-y-1.5 text-xs">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">Google Keep REST API Restriction Detected</h4>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                    Google restricts third-party REST API integration for Google Keep strictly to **Google Workspace Enterprise accounts with domain-wide delegation enabled**.
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                    Standard consumer `@gmail.com` accounts cannot register third-party OAuth access scopes for direct Keep API calls. This is a secure boundary enforced globally by Google.
                  </p>
                </div>
              </div>
              <div className="p-4 bg-indigo-50/50 dark:bg-white/[0.02]/20 rounded-xl space-y-2.5 text-xs text-left border border-indigo-100/60">
                <div className="flex items-center gap-1.5 font-bold text-indigo-900 dark:text-indigo-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Beautiful Alternative Active: Project Friend Companion Database</span>
                </div>
                <p className="text-slate-600 dark:text-slate-350 leading-relaxed text-[11px]">
                  No worries! We have automatically enabled our high-fidelity, secure **Firestore Cloud Companion Database** for you. It replicates all Keep actions (creation, editing, pinning, checkboxes, tag filtering) and synchronizes them persistently across all your sessions.
                </p>
                <p className="text-slate-600 dark:text-slate-350 leading-relaxed text-[11px]">
                  Plus, on any note in your companion deck, you can use our instant dispatch buttons at the bottom to convert them directly into real Google Doc logs, Gmail messages, or Calendar reminders where personal account APIs are fully supported!
                </p>
                <button
                  type="button"
                  onClick={() => setViewSource("firestore")}
                  className="mt-1 px-4.5 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 cursor-pointer transition-colors"
                >
                  Continue back to Firestore Notes Deck
                </button>
              </div>
            </div>
          ) : apiError ? (
            <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-150 rounded-xl text-red-800 dark:text-red-300 text-xs font-medium space-y-1 max-w-md mx-auto text-left">
              <p className="font-bold">Keeps API Fetch Error:</p>
              <p className="opacity-95 text-[11px] font-mono leading-relaxed">{apiError}</p>
            </div>
          ) : keepApiNotes.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400 italic bg-white dark:bg-slate-950 border border-black/5 rounded-2xl p-6">
              No live notes found in your Google Keep Workspace account. Try adding notes in Keep first!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
              {keepApiNotes.map((note: any) => (
                <div key={note.name} className="p-4 rounded-xl border flex flex-col justify-between bg-white dark:bg-black border-black/10 text-slate-800 dark:text-slate-100 transition-all hover:shadow-md">
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold">{note.title || "Untitled Keep Note"}</h4>
                    {note.body?.text?.text && (
                      <p className="text-[11px] leading-relaxed whitespace-pre-wrap opacity-95">
                        {note.body.text.text}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* INTEGRATIONS AND CONSENT MODALS (MANDATORY SECURITY REGULATION CODES) */}
      <AnimatePresence>
        {pendingExport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-black rounded-2xl max-w-md w-full p-6 border border-black/10 shadow-2xl space-y-4 text-left"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-50 dark:bg-amber-950/30 rounded-xl text-amber-600 border border-amber-200">
                  <AlertTriangle className="w-5.5 h-5.5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    {pendingExport.type === "docs" && "Consent to Create Google Doc"}
                    {pendingExport.type === "tasks" && "Consent to Create Google Task"}
                    {pendingExport.type === "calendar" && "Consent to Schedule Calendar Block"}
                    {pendingExport.type === "gmail" && "Consent to Transmit Gmail Message"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-405 leading-relaxed mt-1">
                    {pendingExport.type === "docs" && `You are granting permission to auto-build and write a new, fully detailed document titled "Keep Export: ${pendingExport.note.title}" directly onto your secure Google Drive.`}
                    {pendingExport.type === "tasks" && `You are exporting this Keep list or note as a brand new action tracker inside your main primary Google Tasks list.`}
                    {pendingExport.type === "calendar" && `You are setting up a private 1-on-1 mindfulness slots and reserving space on your primary Google Calendar with instructions loaded from this card.`}
                    {pendingExport.type === "gmail" && `You are sending a complete plain-text clone of this note straight to your own personal Google inbox for safe keeping.`}
                  </p>
                </div>
              </div>

              {/* Extra input panels parsed per-integration type */}
              {pendingExport.type === "calendar" && (
                <div className="bg-slate-55 dark:bg-slate-950/60 p-3 rounded-xl space-y-2.5 text-xs text-slate-700 dark:text-slate-200 border border-black/5">
                  <p className="font-bold font-mono text-[9px] uppercase text-slate-400">Configure Event Details</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">Date</label>
                      <input 
                        type="date"
                        value={calDate}
                        onChange={(e) => setCalDate(e.target.value)}
                        className="w-full bg-white dark:bg-black border border-black/10 p-1.5 rounded outline-none font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1">Time</label>
                      <input 
                        type="time"
                        value={calTime}
                        onChange={(e) => setCalTime(e.target.value)}
                        className="w-full bg-white dark:bg-black border border-black/10 p-1.5 rounded outline-none font-bold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Duration</label>
                    <select
                      value={calDuration}
                      onChange={(e) => setCalDuration(e.target.value)}
                      className="w-full bg-white dark:bg-black border border-black/10 p-1.5 rounded outline-none"
                    >
                      <option value="15">15 Minutes (Breathing Break)</option>
                      <option value="30">30 Minutes (Deep Grounding)</option>
                      <option value="60">60 Minutes (Mind Reset)</option>
                    </select>
                  </div>
                </div>
              )}

              {pendingExport.type === "tasks" && (
                <div className="bg-slate-55 dark:bg-slate-950/60 p-3 rounded-xl text-xs text-slate-700 dark:text-slate-200 border border-black/5">
                  <label className="block text-[10px] text-slate-400 mb-1">Add Due Date to Task (Optional)</label>
                  <input 
                    type="date"
                    value={taskDue}
                    onChange={(e) => setTaskDue(e.target.value)}
                    className="w-full bg-white dark:bg-black border border-black/10 p-1.5 rounded outline-none font-medium"
                  />
                </div>
              )}

              <div className="p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl space-y-1 text-xs font-mono">
                <p><span className="text-slate-400">Selected Note:</span> <span className="text-slate-800 dark:text-slate-200 font-bold">{pendingExport.note.title}</span></p>
                <p><span className="text-slate-400">Tags Included:</span> <span className="text-slate-650 dark:text-slate-350">{pendingExport.note.tags.join(", ") || "(None)"}</span></p>
              </div>

              {/* Modal controls */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPendingExport(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={executeExport}
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-750 rounded-xl cursor-pointer shadow flex items-center gap-1"
                >
                  Confirm & Sync
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
