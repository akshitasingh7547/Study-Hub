import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Clock,
  Calendar,
  Library,
  GraduationCap,
  Briefcase,
  Award,
  Trophy,
  BarChart3,
  Target,
  ChevronLeft,
  ClipboardList,
  ChevronRight,
  Search,
  FlaskConical,
  WandSparkles,
  PenLine,
  Video,
  Keyboard,
} from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [studyProgress, setStudyProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const saved = localStorage.getItem("studyHub.studyHallV2") || localStorage.getItem("studyHub.studyHall");
      if (!saved) return;

      const parsed = JSON.parse(saved);
      const todos = parsed.todos || [];
      const completed = todos.filter((todo) => todo.completed).length;
      setStudyProgress(todos.length ? Math.round((completed / todos.length) * 100) : 0);
    };

    updateProgress();
    window.addEventListener("studyHubProgressUpdated", updateProgress);
    return () => window.removeEventListener("studyHubProgressUpdated", updateProgress);
  }, []);

  const sections = [
    {
      title: "CASTLE",
      items: [
        { icon: LayoutDashboard, label: "Command Chamber", path: "/" },
        { icon: Calendar, label: "Timekeeper Clock", path: "/calendar" },
        { icon: Calendar, label: "Weekly Spellbook", path: "/planner" },
      ],
    },

    {
      title: "IIT QUEST",
      items: [
        { icon: Target, label: "IIT Bombay Mission", path: "/jee-prep" },
        { icon: BookOpen, label: "Subject Grimoire", path: "/subjects" },
        { icon: Clock, label: "Silent Library", path: "/study-hall" },
        { icon: Trophy, label: "Trial Chamber", path: "/exam-hall" },
        { icon: ClipboardList, label: "Assignment Studio", path: "/assignment-studio" },
      ],
    },

    {
      title: "FUTURE PATHS",
      items: [
        { icon: FlaskConical, label: "AI Workshop", path: "/coding" },
        { icon: Keyboard, label: "Writing Studio", path: "/writing-skills" },
        { icon: PenLine, label: "Vocabulary Studio", path: "/english-fluency" },
        { icon: Video, label: "YouTube Workflow", path: "/youtube" },
        { icon: BarChart3, label: "Quant Ledger", path: "/stock-market" },
        { icon: Briefcase, label: "Hall of Paths", path: "/career" },
        { icon: Award, label: "Skills", path: "/skills" },
      ],
    },

    {
      title: "ARCHIVES",
      items: [
        { icon: Library, label: "Grand Library", path: "/library" },
        { icon: GraduationCap, label: "Academy Archives", path: "/free-courses" },
        { icon: BookOpen, label: "Notebook Oracle", path: "/notebooklm" },
        { icon: Trophy, label: "Hall of Legends", path: "/achievements" },
        { icon: BarChart3, label: "Progress Observatory", path: "/analytics" },
      ],
    },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 z-50 h-screen border-r border-amber-300/15 bg-[#080908]/95 text-[#f7ead0] shadow-2xl shadow-black/50 transition-all duration-300 ${
        isOpen ? "w-72" : "w-20"
      }`}
    >
      <div className="flex items-center justify-between border-b border-amber-300/15 p-5">
        {isOpen && (
          <div>
            <div className="flex items-center gap-2 text-amber-300">
              <WandSparkles size={18} />
              <h1 className="text-xl font-bold tracking-wide">Study Castle</h1>
            </div>
            <p className="mt-1 text-xs text-[#c8b88f]">
              IIT Bombay CSE quest
            </p>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg border border-amber-300/10 p-2 text-amber-200 hover:bg-amber-300/10"
        >
          {isOpen ? <ChevronLeft /> : <ChevronRight />}
        </button>
      </div>

      {isOpen && (
        <div className="p-4">
          <div className="flex items-center rounded-lg border border-amber-300/10 bg-black/25 px-3 py-2">
            <Search size={16} className="text-amber-300" />
            <input
              type="text"
              placeholder="Search the archives..."
              className="ml-2 flex-1 bg-transparent text-sm text-[#f7ead0] outline-none placeholder:text-[#9a8b69]"
            />
          </div>
        </div>
      )}

      <div className="h-[calc(100vh-240px)] overflow-y-auto px-3">
        {sections.map((section) => (
          <div key={section.title} className="mb-6">
            {isOpen && (
              <h3 className="mb-2 px-3 text-xs uppercase tracking-wider text-[#8e7b55]">
                {section.title}
              </h3>
            )}

            {section.items.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  `mb-2 flex items-center gap-4 rounded-lg px-4 py-3 transition-all ${
                    isActive
                      ? "border border-amber-300/30 bg-amber-300/15 text-amber-100 shadow-lg shadow-amber-950/30"
                      : "text-[#d5c6a4] hover:bg-white/5 hover:text-amber-100"
                  }`
                }
              >
                <item.icon size={20} />

                {isOpen && (
                  <span className="text-sm font-medium">
                    {item.label}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 w-full border-t border-amber-300/15 p-4">
        {isOpen && (
          <>
            <div className="mb-4">
              <p className="mb-1 text-xs text-[#c8b88f]">
                Today's Quest Progress
              </p>

              <div className="h-2 w-full rounded-full bg-black/40">
                <div
                  className="h-2 rounded-full bg-amber-300"
                  style={{ width: `${studyProgress}%` }}
                ></div>
              </div>

              <p className="mt-2 text-xs text-[#9a8b69]">
                {studyProgress}% Silent Library progress
              </p>
            </div>

            <div className="text-center text-xs text-[#8e7b55]">
              <p className="font-semibold text-[#c8b88f]">Study Castle</p>
              <p>JEE Main + Advanced</p>
              <p>IIT Bombay CSE path</p>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
