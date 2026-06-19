import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  Clock, 
  Plus, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle,
  MapPin,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CalendarHubProps {
  token: string | null;
  themeClass: (daylight: string, midnight: string, sepia: string) => string;
}

export default function CalendarHub({ token, themeClass }: CalendarHubProps) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Event schedule input states
  const [title, setTitle] = useState("✨ Guided Self-Care Break");
  const [eventDate, setEventDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [eventTime, setEventTime] = useState("14:00");
  const [duration, setDuration] = useState("15");
  const [description, setDescription] = useState("Project Friend guided box-breathing and cognitive de-escalation break. Relax, place your feet flat on the floor, and take 4 slow breaths.");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Fetch events
  const fetchUpcomingEvents = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const now = new Date().toISOString();
      const res = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=10&orderBy=startTime&singleEvents=true&timeMin=${now}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!res.ok) {
        throw new Error(`Calendar fetch failed: Status code ${res.status}`);
      }

      const data = await res.json();
      setEvents(data.items || []);
    } catch (err: any) {
      console.error("Error reading Calendar events:", err);
      setError(err?.message || "Failed to load upcoming events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingEvents();
  }, [token]);

  // Handle Event Creation (requires explicit user confirmation code)
  const scheduleEvent = async () => {
    if (!token) return;
    setIsSubmitting(true);
    setSuccessMessage(null);
    try {
      // Parse ISO date-time details
      const startDateTime = new Date(`${eventDate}T${eventTime}:00`);
      const endDateTime = new Date(startDateTime.getTime() + parseInt(duration) * 60000);

      const payload = {
        summary: title,
        description: description,
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

      const res = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      if (!res.ok) {
        throw new Error(`Failed to insert calendar event: Status code ${res.status}`);
      }

      setSuccessMessage(`"${title}" has been added to your Google Calendar!`);
      setShowConfirmModal(false);
      fetchUpcomingEvents();
    } catch (err: any) {
      console.error("Error scheduling event:", err);
      alert(`Scheduling failed: ${err?.message || "Please verify your permission."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-sans">
      
      {/* Schedule Form */}
      <div className="lg:col-span-5 bg-white dark:bg-slate-950 p-5 rounded-2xl border border-black/5 space-y-4 text-left">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-rose-50 dark:bg-rose-950/30 rounded-lg text-rose-500">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wide">
            Plan a Mindfulness Break
          </h2>
        </div>

        <div className="space-y-3.5 text-xs">
          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-400">Event Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-black/10 p-2 rounded-lg mt-1 outline-none font-bold text-slate-800 dark:text-slate-200"
              placeholder="e.g. Self-Care Walk"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-400">Date</label>
              <input 
                type="date" 
                value={eventDate} 
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-black/10 p-2 rounded-lg mt-1 outline-none text-slate-800 dark:text-slate-200"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase text-slate-400">Time</label>
              <input 
                type="time" 
                value={eventTime} 
                onChange={(e) => setEventTime(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-black/10 p-2 rounded-lg mt-1 outline-none text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-400">Duration (Minutes)</label>
            <select 
              value={duration} 
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-black/10 p-2 rounded-lg mt-1 outline-none text-slate-800 dark:text-slate-200"
            >
              <option value="5">5 Minutes (Quick Rest)</option>
              <option value="15">15 Minutes (Standard Grounding)</option>
              <option value="30">30 Minutes (Deep Healing)</option>
              <option value="60">1 Hour (Complete Reset)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-slate-400">Somatic Instructions</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-black/10 p-2.5 rounded-lg mt-1 outline-none leading-relaxed text-slate-700 dark:text-slate-300"
              placeholder="Grounding techniques to include in event description..."
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
              onClick={() => setShowConfirmModal(true)}
              disabled={!title}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl cursor-pointer flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50 text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Schedule Wellness Break
            </button>
          </div>

        </div>
      </div>

      {/* Events List */}
      <div className="lg:col-span-7 space-y-3">
        <div className="flex items-center justify-between border-b border-black/5 pb-2.5">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wide">
              Upcoming Synced Events
            </h3>
          </div>
          <button
            onClick={fetchUpcomingEvents}
            disabled={loading}
            className="p-1 px-2.5 text-[10px] font-mono font-bold text-indigo-650 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg cursor-pointer hover:bg-indigo-100/70 flex items-center gap-1.5 border border-indigo-150"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
            Sync Now
          </button>
        </div>

        <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl max-h-[460px] overflow-y-auto divide-y divide-black/5 text-left">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-2 text-xs text-slate-405 font-mono">
              <RefreshCw className="w-5 h-5 animate-spin text-rose-500" />
              <span>SYNCHRONIZING CALENDAR...</span>
            </div>
          ) : error ? (
            <div className="py-12 px-4 text-center">
              <p className="text-red-500 text-xs font-bold font-mono">⚠️ SYNC_FAILED</p>
              <p className="text-slate-500 text-xs mt-1 leading-normal">{error}</p>
            </div>
          ) : events.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400 italic">
              No upcoming events located on your Google Calendar.
            </div>
          ) : (
            events.map((event) => {
              const startDateTime = event.start?.dateTime || event.start?.date;
              const formattedDate = startDateTime ? new Date(startDateTime).toLocaleString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : "All-day Event";

              return (
                <div key={event.id} className="p-4 space-y-1.5 hover:bg-slate-50/50 transition-all">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-205">
                      {event.summary || "(No Title)"}
                    </h4>
                    {event.htmlLink && (
                      <a 
                        href={event.htmlLink} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[10px] text-indigo-600 hover:underline font-mono shrink-0"
                      >
                        Web app
                      </a>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10.5px] text-slate-450 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-rose-400" />
                      {formattedDate}
                    </span>
                    {event.location && (
                      <span className="flex items-center gap-1 text-slate-400 truncate max-w-[200px]">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </span>
                    )}
                  </div>

                  {event.description && (
                    <p className="text-[10.5px] leading-relaxed text-slate-500 dark:text-slate-400 border-t border-dashed border-black/5 pt-1.5 mt-1 italic">
                      {event.description.length > 150 ? `${event.description.substring(0, 150)}...` : event.description}
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* SECURITY MODAL CONFIRMATION (MANDATORY FOR MUTATING OPERATIONS) */}
      <AnimatePresence>
        {showConfirmModal && (
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
                    Consent to Schedule Google Calendar Event
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1">
                    You are granting Project Friend AI permission to write and schedule this self-care break directly on your primary Google Calendar.
                  </p>
                </div>
              </div>

              {/* Event Summary Detail */}
              <div className="p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl space-y-1 text-xs font-mono">
                <p><span className="text-slate-400">Title:</span> <span className="text-slate-800 font-bold">{title}</span></p>
                <p><span className="text-slate-400">Date/Time:</span> <span className="text-slate-700 font-medium">{eventDate} @ {eventTime}</span></p>
                <p><span className="text-slate-400">Length:</span> <span className="text-slate-700 font-medium">{duration} minutes</span></p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={scheduleEvent}
                  className="px-5 py-2 text-xs font-bold text-white bg-indigo-650 hover:bg-indigo-750 rounded-xl cursor-pointer shadow flex items-center gap-1"
                >
                  {isSubmitting ? "Inserting..." : "Yes, Schedule It"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
