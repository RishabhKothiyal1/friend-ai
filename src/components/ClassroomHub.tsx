import React, { useState, useEffect } from "react";
import { 
  GraduationCap, 
  RefreshCw, 
  Sparkles, 
  Search,
  BookOpen,
  Users,
  Calendar,
  ExternalLink
} from "lucide-react";

interface ClassroomHubProps {
  token: string | null;
  themeClass: (daylight: string, midnight: string, sepia: string) => string;
}

export default function ClassroomHub({ token, themeClass }: ClassroomHubProps) {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [roster, setRoster] = useState<any[]>([]);
  const [loadingRoster, setLoadingRoster] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch Google Classroom Courses
  const fetchCourses = async () => {
    if (!token) return;
    setLoadingCourses(true);
    setError(null);
    try {
      const res = await fetch("https://classroom.googleapis.com/v1/courses", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        throw new Error(`Google Classroom Course fetch failed: Status code ${res.status}`);
      }

      const data = await res.json();
      const items = data.courses || [];
      setCourses(items);

      if (items.length > 0 && !selectedCourseId) {
        setSelectedCourseId(items[0].id);
      }
    } catch (err: any) {
      console.error("Error loading Classroom courses:", err);
      setError(err?.message || "Failed to load Google Classroom records. Make sure Classroom API is enabled.");
    } finally {
      setLoadingCourses(false);
    }
  };

  // Fetch students/roster for selected course
  const fetchCourseRoster = async (courseId: string) => {
    if (!token || !courseId) return;
    setLoadingRoster(true);
    setRoster([]);
    try {
      const res = await fetch(`https://classroom.googleapis.com/v1/courses/${courseId}/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        if (res.status === 404 || res.status === 403) {
          // If roster is private or empty
          setRoster([]);
          return;
        }
        throw new Error(`Roster load failed: Status code ${res.status}`);
      }

      const data = await res.json();
      setRoster(data.students || []);
    } catch (err: any) {
      console.error("Error fetching classroom students:", err);
      setRoster([]);
    } finally {
      setLoadingRoster(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [token]);

  useEffect(() => {
    if (selectedCourseId) {
      fetchCourseRoster(selectedCourseId);
    }
  }, [selectedCourseId]);

  const filteredCourses = courses.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCourse = courses.find(c => c.id === selectedCourseId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start font-sans text-left">
      
      {/* Left Column: Course list */}
      <div className="lg:col-span-5 space-y-3">
        <div className="flex items-center justify-between border-b border-black/5 pb-2">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-bold font-mono text-slate-500 uppercase tracking-wide">
              Active classroom groups
            </h3>
          </div>
          <button
            onClick={fetchCourses}
            disabled={loadingCourses}
            className="p-1 px-2 text-[10px] font-mono font-bold text-indigo-650 bg-indigo-50 dark:bg-white/[0.02]/40 rounded-lg cursor-pointer hover:bg-indigo-100/70 border border-indigo-150 flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3 h-3 ${loadingCourses ? "animate-spin" : ""}`} />
            Sync Classes
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search classes..."
            className="w-full bg-white dark:bg-slate-950 border border-black/5 rounded-xl p-2 pl-8.5 outline-none text-xs text-slate-800 dark:text-slate-205"
          />
        </div>

        <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl max-h-[420px] overflow-y-auto divide-y divide-black/5 text-left p-1">
          {loadingCourses ? (
            <div className="py-16 flex flex-col items-center justify-center gap-2 text-xs text-slate-405 font-mono">
              <RefreshCw className="w-5 h-5 animate-spin text-indigo-500" />
              <span>SYNCING GOOGLE CLASSROOM...</span>
            </div>
          ) : error ? (
            <div className="py-12 px-4 text-center">
              <p className="text-red-500 text-xs font-bold font-mono">⚠️ CLASSROOM_SYNC_FAILED</p>
              <p className="text-slate-500 text-xs mt-1 leading-normal">{error}</p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 italic font-medium p-4">
              No active classes registered on Google Classroom. Set up a Somatic/Coaching cohort group via classroom.google.com first.
            </div>
          ) : (
            filteredCourses.map((c) => {
              const isSel = c.id === selectedCourseId;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCourseId(c.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                    isSel 
                      ? "bg-indigo-50/25 dark:bg-white/[0.02]/15 border-indigo-200 outline-none" 
                      : "bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-black"
                  }`}
                >
                  <div className="p-2 bg-indigo-50 dark:bg-white/[0.02]/20 rounded-lg text-indigo-500 shrink-0 border border-indigo-150">
                    <BookOpen className="w-4 h-4 text-indigo-550" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-100 line-clamp-1">
                      {c.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-mono">Section: {c.section || "General"}</p>
                    {c.alternateLink && (
                      <a 
                        href={c.alternateLink} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[9px] font-mono text-indigo-600 hover:underline flex items-center gap-0.5 mt-1 font-bold"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Web Classroom <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right Column: Enrollment cohort and materials details */}
      <div className="lg:col-span-7 bg-white dark:bg-slate-950 p-5 rounded-2xl border border-black/5 space-y-4">
        {selectedCourse ? (
          <div className="space-y-4">
            <div className="border-b border-black/5 pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-indigo-650 bg-indigo-50 px-2 py-0.5 rounded">
                    ENROLLED COHORT
                  </span>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">{selectedCourse.name}</h3>
                </div>
                <BookOpen className="w-5 h-5 text-indigo-400 shrink-0" />
              </div>
              {selectedCourse.description && (
                <p className="text-xs text-slate-500 leading-relaxed mt-2.5">{selectedCourse.description}</p>
              )}
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-500" />
                Somatic Group Cohort Roster ({roster.length})
              </h4>

              {loadingRoster ? (
                <div className="py-8 text-center text-xs text-slate-400 font-mono flex items-center justify-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                  Drawing student roster files...
                </div>
              ) : roster.length === 0 ? (
                <p className="text-xs text-slate-400 italic bg-slate-50 dark:bg-black border border-dashed rounded-xl p-4 text-center">
                  Roster files are empty or restricted. Standard consumer G Suite policies apply. Invite classmates to your Somatic study cohort.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto">
                  {roster.map((student, idx) => {
                    const studentName = student.profile?.name?.fullName || "Study Guest";
                    const studentPhoto = student.profile?.photoUrl || null;

                    return (
                      <div key={idx} className="p-2.5 bg-slate-50 dark:bg-black border border-black/5 rounded-xl flex items-center gap-2.5">
                        {studentPhoto ? (
                          <img 
                            src={studentPhoto} 
                            alt={studentName} 
                            referrerPolicy="no-referrer"
                            className="w-6.5 h-6.5 rounded-full object-cover" 
                          />
                        ) : (
                          <div className="w-6.5 h-6.5 rounded-full bg-indigo-50 dark:bg-white/[0.02]/20 text-indigo-500 border border-indigo-150 flex items-center justify-center font-bold text-[10px]">
                            {studentName.substring(0,2).toUpperCase()}
                          </div>
                        )}
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-205">{studentName}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Schedule details */}
            <div className="p-3 bg-indigo-50/20 dark:bg-white/[0.02]/10 border border-indigo-150 rounded-xl space-y-1 text-slate-500 flex items-center gap-3">
              <Calendar className="w-5 h-5 text-indigo-500 shrink-0" />
              <div className="text-[11px] leading-relaxed">
                <span className="font-bold text-slate-700 dark:text-indigo-200 block">Classroom Syllabi & Materials:</span>
                Students are synchronized. Materials will be published dynamically as soon as somatic syllabus files are verified.
              </div>
            </div>

          </div>
        ) : (
          <div className="py-24 text-center text-xs text-slate-400 italic">
            Select an active Classroom course on the sidebar to check classroom rosters and cohort stats.
          </div>
        )}
      </div>

    </div>
  );
}
