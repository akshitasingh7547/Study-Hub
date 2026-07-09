import React from "react";
import { plannerItems } from "../data/studyHubData";

const PlannerSidebar = () => {
  const categories = [
    "College",
    "Subject",
    "JEE",
    "Skill",
    "Sleep",
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <h2 className="text-2xl font-bold text-slytherin-800 mb-2">
        📚 Planner Library
      </h2>

      <p className="text-slate-500 text-sm mb-6">
        Drag these cards into your weekly planner.
      </p>

      {categories.map((category) => (

        <div key={category} className="mb-8">

          <h3 className="text-lg font-bold text-slytherin-700 border-b pb-2 mb-4">

            {category === "College" && "🏫 College"}

            {category === "Subject" && "📖 Subjects"}

            {category === "JEE" && "🎯 JEE"}

            {category === "Skill" && "💻 Skills"}

            {category === "Sleep" && "🌙 Sleep"}

          </h3>

          <div className="space-y-3">

            {plannerItems
              .filter((item) => item.category === category)
              .map((item) => (

                <div
                  key={item.id}
                  draggable
                  onDragStart={(event) => {
                    event.dataTransfer.setData("application/json", JSON.stringify(item));
                    event.dataTransfer.effectAllowed = "copy";
                  }}
                  className={`${item.color} text-white rounded-xl px-4 py-3 cursor-pointer hover:scale-105 transition-all duration-200 shadow-md flex items-center justify-between`}
                >

                  <div className="flex items-center gap-3">

                    <span className="text-xl">
                      {item.icon}
                    </span>

                    <span className="font-semibold">
                      {item.title}
                    </span>

                  </div>

                  <span className="text-sm opacity-80">
                    Drag
                  </span>

                </div>

              ))}

          </div>

        </div>

      ))}

    </div>
  );
};

export default PlannerSidebar;
