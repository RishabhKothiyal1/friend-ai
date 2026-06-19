import React, { useState, useEffect } from "react";
import { 
  CheckSquare, 
  Square,
  Plus, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle,
  History,
  ListTodo,
  Sparkles,
  Calendar,
  CheckCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface TasksHubProps {
  token: string | null;
  themeClass: (daylight: string, midnight: string, sepia: string) => string;
}

export default function TasksHub({ token, themeClass }: TasksHubProps) {
  const [taskLists, setTaskLists] = useState<any[]>([]);
  const [selectedListId, setSelectedListId] = useState<string>("");
  const [tasks, setTasks] = useState<any[]>([]);
  const [loadingLists, setLoadingLists] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New task states
  const [taskTitle, setTaskTitle] = useState("✨ Daily 5-minute Box Breathing");
  const [taskNotes, setTaskNotes] = useState("Rest is action. Relax your shoulders, place your hands on your lap, and slow down your inhale/exhale cycles.");
  const [dueDate, setDueDate] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Security & consent states
  const [showConfirmCreate, setShowConfirmCreate] = useState(false);
  const [pendingToggleTask, setPendingToggleTask] = useState<any | null>(null);

  // Fetch Task Lists
  const fetchTaskLists = async () => {
    if (!token) return;
    setLoadingLists(true);
    setError(null);
    try {
      const res = await fetch("https://tasks.googleapis.com/tasks/v1/users/@me/lists", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        throw new Error(`Tasks Lists fetch failed: Status code ${res.status}`);
      }

      const data = await res.json();
      const lists = data.items || [];
      setTaskLists(lists);

      if (lists.length > 0 && !selectedListId) {
        setSelectedListId(lists[0].id);
      }
    } catch (err: any) {
      console.error("Error fetching task lists:", err);
      setError(err?.message || "Failed to load Google Task Lists.");
    } finally {
      setLoadingLists(false);
    }
  };

  // Fetch Tasks for Selected List
  const fetchTasks = async (listId: string) => {
    if (!token || !listId) return;
    setLoadingTasks(true);
    setError(null);
    try {
      const res = await fetch(
        `https://tasks.googleapis.com/tasks/v1/lists/${listId}/tasks?showCompleted=true&showHidden=true&maxResults=50`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!res.ok) {
        throw new Error(`Tasks fetch failed: Status code ${res.status}`);
      }

      const data = await res.json();
      setTasks(data.items || []);
    } catch (err: any) {
      console.error("Error fetching tasks for list:", err);
      setError(err?.message || "Failed to load tasks from Google Tasks.");
    } finally {
      setLoadingTasks(false);
    }
  };

  useEffect(() => {
    fetchTaskLists();
  }, [token]);

  useEffect(() => {
    if (selectedListId) {
      fetchTasks(selectedListId);
    }
  }, [selectedListId]);

  // Create Task
  const handleCreateTask = async () => {
    if (!token || !selectedListId) return;
    setIsSubmitting(true);
    setSuccessMessage(null);
    try {
      const payload: any = {
        title: taskTitle,
        notes: taskNotes,
      };

      if (dueDate) {
        // Due dates must be RFC 3339 formatted timestamps (e.g., yyyy-mm-ddT00:00:00.000Z)
        payload.due = new Date(dueDate).toISOString();
      }

      const res = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${selectedListId}/tasks`, {
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

      setSuccessMessage(`"${taskTitle}" has been added to your Google Tasks list!`);
      setShowConfirmCreate(false);
      setTaskTitle("");
      setTaskNotes("");
      setDueDate("");
      fetchTasks(selectedListId);
    } catch (err: any) {
      console.error("Error creating Google task:", err);
      alert(`Task creation failed: ${err?.message || "Verify your Workspace scopes."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Task Completed Status
  const handleToggleTaskStatus = async (task: any) => {
    if (!token || !selectedListId) return;
    
    const newStatus = task.status === "completed" ? "needsAction" : "completed";
    
    // Optimistic UI update
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus } : t));

    try {
      const res = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${selectedListId}/tasks/${task.id}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: task.id,
          status: newStatus
        })
      });

      if (!res.ok) {
        throw new Error(`Failed to update task status: Status code ${res.status}`);
      }

      // Sync updated list
      fetchTasks(selectedListId);
    } catch (err: any) {
      console.error("Error toggling task status:", err);
      // Revert optimistic UI update
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: task.status } : t));
      alert(`Failed to update task status: ${err?.message || "Sync issues."}`);
    } finally {
      setPendingToggleTask(null);
    }
  };

  const selectedListName = taskLists.find(l => l.id === selectedListId)?.title || "N/A";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-sans">
      
      {/* Left Column: Form to Plan Task */}
      <div className="lg:col-span-5 bg-white dark:bg-slate-950 p-5 rounded-2xl border border-black/5 space-y-4 text-left">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-rose-50 dark:bg-rose-950/30 rounded-lg text-rose-500">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide">
            Plan a Mindful Task
          </h2>
        </div>

        <div className="space-y-3.5 text-xs">
          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-400">Target Task List</label>
            {loadingLists ? (
              <span className="text-[10px] font-mono text-slate-400">Loading lists...</span>
            ) : taskLists.length === 0 ? (
              <p className="text-[11px] text-amber-600 mt-1 italic">
                No Google Task Lists found.
              </p>
            ) : (
              <select 
                value={selectedListId} 
                onChange={(e) => setSelectedListId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-black/10 p-2 rounded-lg mt-1 outline-none text-slate-800 dark:text-slate-200 font-medium"
              >
                {taskLists.map(list => (
                  <option key={list.id} value={list.id}>{list.title}</option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-400">Task Title</label>
            <input 
              type="text" 
              value={taskTitle} 
              onChange={(e) => setTaskTitle(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-black/10 p-2 rounded-lg mt-1 outline-none font-bold text-slate-850 dark:text-slate-200"
              placeholder="e.g. Meditate for 10 minutes"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-400">Task Notes / Grounding Context</label>
            <textarea
              value={taskNotes}
              onChange={(e) => setTaskNotes(e.target.value)}
              rows={3}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-black/10 p-2 text-slate-705 dark:text-slate-300 rounded-lg mt-1 outline-none leading-relaxed"
              placeholder="Why is this helpful and what are the focus steps?"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-400">Due Date (Optional)</label>
            <input 
              type="date" 
              value={dueDate} 
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-black/10 p-2 rounded-lg mt-1 outline-none text-slate-800 dark:text-slate-200"
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
              onClick={() => setShowConfirmCreate(true)}
              disabled={isSubmitting || !taskTitle || !selectedListId}
              className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-750 text-white font-bold rounded-xl cursor-pointer flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 text-xs"
            >
              <Plus className="w-4 h-4 shrink-0" />
              Add Task to Google
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Google Tasks Display & Management */}
      <div className="lg:col-span-7 space-y-3">
        <div className="flex items-center justify-between border-b border-black/5 pb-2.5">
          <div className="flex items-center gap-2">
            <ListTodo className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wide">
              Logged tasks in "{selectedListName}"
            </h3>
          </div>
          <button
            onClick={() => fetchTasks(selectedListId)}
            disabled={loadingTasks || !selectedListId}
            className="p-1 px-2.5 text-[10px] font-mono font-bold text-indigo-650 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg cursor-pointer hover:bg-indigo-100/70 flex items-center gap-1.5 border border-indigo-150"
          >
            <RefreshCw className={`w-3 h-3 ${loadingTasks ? "animate-spin" : ""}`} />
            Sync Tasks
          </button>
        </div>

        <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl max-h-[460px] overflow-y-auto divide-y divide-black/5 text-left">
          {loadingTasks ? (
            <div className="py-16 flex flex-col items-center justify-center gap-2 text-xs text-slate-405 font-mono">
              <RefreshCw className="w-5 h-5 animate-spin text-indigo-500" />
              <span>SYNCHRONIZING GOOGLE TASKS...</span>
            </div>
          ) : error ? (
            <div className="py-12 px-4 text-center">
              <p className="text-red-500 text-xs font-bold font-mono">⚠️ SYNC_FAILED</p>
              <p className="text-slate-500 text-xs mt-1 leading-normal">{error}</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400 italic">
              No tasks in this list. Create one to begin your somatic journey.
            </div>
          ) : (
            tasks.map((task) => {
              const isCompleted = task.status === "completed";
              
              return (
                <div key={task.id} className={`p-4 flex gap-3.5 hover:bg-slate-50/50 transition-all ${isCompleted ? "opacity-60" : ""}`}>
                  {/* Task Checkbox */}
                  <button
                    onClick={() => handleToggleTaskStatus(task)}
                    className="mt-0.5 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer shrink-0"
                    title={isCompleted ? "Mark as Incomplete" : "Mark as Completed"}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-slate-300 dark:border-slate-700 rounded-md hover:border-indigo-500 transition-colors" />
                    )}
                  </button>

                  <div className="space-y-1 w-full">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className={`text-xs font-bold ${isCompleted ? "line-through text-slate-400" : "text-slate-800 dark:text-slate-205"}`}>
                        {task.summary || task.title || "(Untitled Task)"}
                      </h4>
                      {task.due && (
                        <span className="text-[9.5px] font-mono text-rose-500 bg-rose-50 dark:bg-rose-950/20 px-1.5 py-0.5 rounded flex items-center gap-1 shrink-0">
                          <Calendar className="w-2.5 h-2.5" />
                          {new Date(task.due).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    {task.notes && (
                      <p className={`text-[11px] leading-relaxed ${isCompleted ? "text-slate-400" : "text-slate-500 dark:text-slate-400"}`}>
                        {task.notes}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* SECURITY MODAL CONFIRMATION (MANDATORY FOR MUTATING WORKSPACE OPERATIONS) */}
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
                    Consent to Add Google Task
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1">
                    You are granting Project Friend AI permission to write and create this mindful task directly under your primary Google Tasks list: **"{selectedListName}"**.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl space-y-1 text-xs font-mono">
                <p><span className="text-slate-400">Target List:</span> <span className="text-slate-800 font-bold">{selectedListName}</span></p>
                <p><span className="text-slate-400">Task Title:</span> <span className="text-slate-700 font-medium">{taskTitle}</span></p>
                {dueDate && <p><span className="text-slate-400">Due:</span> <span className="text-slate-700 font-medium">{dueDate}</span></p>}
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
                  onClick={handleCreateTask}
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-750 rounded-xl cursor-pointer shadow flex items-center gap-1"
                >
                  {isSubmitting ? "Adding task..." : "Confirm & Create"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
