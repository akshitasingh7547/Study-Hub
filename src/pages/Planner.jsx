import React from "react";
import PlannerSidebar from "../components/PlannerSidebar";
import PlannerBoard from "../components/PlannerBoard";

const Planner = () => {
  const resetWeek = () => {
    const existing = JSON.parse(localStorage.getItem("studyHub.planner") || "{}");
    localStorage.setItem("studyHub.planner", JSON.stringify({ ...existing, weeklyBoard: undefined }));
    window.dispatchEvent(new Event("studyHubPlannerReset"));
    window.dispatchEvent(new Event("studyHubPlannerUpdated"));
  };

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Header */}

      <div className="bg-gradient-to-r from-slytherin-700 via-slytherin-800 to-slytherin-900 text-white shadow-lg">

        <div className="max-w-[1800px] mx-auto px-8 py-6 flex flex-col lg:flex-row justify-between lg:items-center gap-6">

          <div>

            <h1 className="text-4xl font-bold">
              📅 Weekly Planner
            </h1>

            <p className="text-slytherin-100 mt-2">
              Drag and drop subjects, JEE preparation, skills and sleep blocks
              anywhere across the week.
            </p>

          </div>

          <div className="flex gap-3 flex-wrap">

            <button className="bg-white/10 hover:bg-white/20 px-5 py-2 rounded-xl transition">
              ◀ Previous Week
            </button>

            <button className="bg-green-600 px-5 py-2 rounded-xl transition cursor-default">
              Auto-saved
            </button>

            <button
              onClick={resetWeek}
              className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-xl transition"
            >
              Reset Week
            </button>

            <button className="bg-white/10 hover:bg-white/20 px-5 py-2 rounded-xl transition">
              Next Week ▶
            </button>

          </div>

        </div>

      </div>

      {/* Main Layout */}

      <div className="max-w-[1800px] mx-auto p-6">

        <div className="grid grid-cols-12 gap-6">

          {/* Left Sidebar */}

          <div className="col-span-12 lg:col-span-3">

            <PlannerSidebar />

          </div>

          {/* Planner */}

          <div className="col-span-12 lg:col-span-9">

            <PlannerBoard />

          </div>

        </div>

      </div>

    </div>
  );
};

export default Planner;
