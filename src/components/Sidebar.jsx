import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Clock,
  Calendar,
  Brain,
  Library,
  GraduationCap,
  Briefcase,
  Award,
  Trophy,
  BarChart3,
  Target,
  Moon,
  ChevronLeft,
  ClipboardList,
  ChevronRight,
  Search,
} from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [studyProgress, setStudyProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const saved = localStorage.getItem("studyHub.studyHall");
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
      title: "MAIN",
      items: [
        { icon: LayoutDashboard, label: "Dashboard", path: "/" },
        { icon: Calendar, label: "Calendar", path: "/calendar" },
        { icon: Calendar, label: "Weekly Planner", path: "/planner" },
      ],
    },

    {
      title: "STUDY",
      items: [
        { icon: BookOpen, label: "Subject Index", path: "/subjects" },
        { icon: Clock, label: "Study Hall", path: "/study-hall" },
        { icon: ClipboardList, label: "Assignment Studio", path: "/assignment-studio" },
        { icon: Target, label: "JEE Prep", path: "/jee-prep" },
        { icon: Trophy, label: "Exam Hall", path: "/exam-hall" },
      ],
    },

    {
      title: "GROWTH",
      items: [
        { icon: Award, label: "Skills", path: "/skills" },
        { icon: BookOpen, label: "NotebookLM", path: "/notebooklm" },
        { icon: Library, label: "Library", path: "/library" },
        { icon: GraduationCap, label: "Free Courses", path: "/free-courses" },
        { icon: Briefcase, label: "Career Vault", path: "/career" },
      ],
    },

    {
      title: "PROGRESS",
      items: [
        { icon: Trophy, label: "Achievements", path: "/achievements" },
        { icon: BarChart3, label: "Analytics", path: "/analytics" },
        { icon: Moon, label: "Zodiac Vault", path: "/zodiac" },
      ],
    },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-slate-900 text-white transition-all duration-300 shadow-xl z-50 ${
        isOpen ? "w-72" : "w-20"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-700 p-5">
        {isOpen && (
          <div>
            <h1 className="text-xl font-bold text-emerald-400">
              Study Hub 2
            </h1>
            <p className="text-xs text-slate-400">
              Learning Operating System
            </p>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-slate-700 transition"
        >
          {isOpen ? <ChevronLeft /> : <ChevronRight />}
        </button>
      </div>

      {/* Search */}
      {isOpen && (
        <div className="p-4">
          <div className="flex items-center bg-slate-800 rounded-lg px-3 py-2">
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="ml-2 bg-transparent outline-none text-sm flex-1 placeholder:text-slate-500"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="overflow-y-auto h-[calc(100vh-240px)] px-3">

        {sections.map((section) => (
          <div key={section.title} className="mb-6">

            {isOpen && (
              <h3 className="text-xs uppercase tracking-wider text-slate-500 mb-2 px-3">
                {section.title}
              </h3>
            )}

            {section.items.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3 rounded-xl mb-2 transition-all ${
                    isActive
                      ? "bg-emerald-600 text-white"
                      : "hover:bg-slate-800 text-slate-300"
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

      {/* Footer */}
      <div className="absolute bottom-0 left-0 w-full border-t border-slate-700 p-4">

        {isOpen && (
          <>
            <div className="mb-4">
              <p className="text-xs text-slate-400 mb-1">
                Today's Progress
              </p>

              <div className="w-full h-2 bg-slate-700 rounded-full">
                <div
                  className="h-2 rounded-full bg-emerald-400"
                  style={{ width: `${studyProgress}%` }}
                ></div>
              </div>

              <p className="text-xs mt-2 text-slate-400">
                {studyProgress}% Study Hall progress
              </p>
            </div>

            <div className="text-center text-xs text-slate-500">
              <p className="font-semibold">Study Hub 2</p>
              <p>Version 2.1</p>
              <p>Made by Akshita Singh</p>
            </div>
          </>
        )}

      </div>
    </aside>
  );
};

export default Sidebar;
