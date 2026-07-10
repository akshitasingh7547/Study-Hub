import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const sessions = [
  { id: "morning", title: "Morning" },
  { id: "afternoon", title: "Afternoon" },
  { id: "evening", title: "Evening" },
  { id: "night", title: "Night" },
];

const storageKey = "studyHub.planner";

const createEmptyBoard = () => {
  const board = {};
  days.forEach((day) => {
    board[day] = {};
    sessions.forEach((session) => {
      board[day][session.id] = [];
    });
  });
  return board;
};

const PlannerBoard = () => {
  const [board, setBoard] = useState(createEmptyBoard);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      setBoard(parsed.weeklyBoard || parsed.board || createEmptyBoard());
    }
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    const resetBoard = () => setBoard(createEmptyBoard());
    window.addEventListener("studyHubPlannerReset", resetBoard);
    return () => window.removeEventListener("studyHubPlannerReset", resetBoard);
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;
    const existing = JSON.parse(localStorage.getItem(storageKey) || "{}");
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        ...existing,
        weeklyBoard: board,
      })
    );
    window.dispatchEvent(new Event("studyHubPlannerUpdated"));
  }, [board, hasLoaded]);

  const addItem = (day, sessionId, item) => {
    const newCard = {
      ...item,
      cardId: `${item.id}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    };

    setBoard((current) => ({
      ...current,
      [day]: {
        ...current[day],
        [sessionId]: [...(current[day]?.[sessionId] || []), newCard],
      },
    }));
  };

  const removeItem = (day, sessionId, cardId) => {
    setBoard((current) => ({
      ...current,
      [day]: {
        ...current[day],
        [sessionId]: (current[day]?.[sessionId] || []).filter((item) => item.cardId !== cardId),
      },
    }));
  };

  const handleDrop = (event, day, sessionId) => {
    event.preventDefault();
    const raw = event.dataTransfer.getData("application/json");
    if (!raw) return;
    addItem(day, sessionId, JSON.parse(raw));
  };

  return (
    <div className="overflow-x-auto">
      <div className="overflow-y-auto">
      <div className="grid grid-cols-7 gap-5 min-w-[1700px]">
        {days.map((day) => (
          <div key={day} className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-slytherin-700 text-white py-4 text-center">
              <h2 className="text-xl font-bold">{day}</h2>
            </div>
            <div className="p-4 space-y-5">
              {sessions.map((session) => {
                const cards = board[day]?.[session.id] || [];

                return (
                  <div
                    key={session.id}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => handleDrop(event, day, session.id)}
                    className="border-2 border-dashed border-slate-300 rounded-xl p-3 min-h-[170px] bg-slate-50"
                  >
                    <div className="font-bold text-slytherin-700 mb-3">{session.title}</div>

                    <div className="rounded-lg border border-slate-200 bg-white min-h-[110px] p-2 space-y-2">
                      {cards.length === 0 ? (
                        <div className="h-[92px] flex items-center justify-center text-slate-400 text-sm">
                          Drop Here
                        </div>
                      ) : (
                        cards.map((card) => (
                          <div
                            key={card.cardId}
                            className={`${card.color} text-white rounded-lg px-3 py-2 shadow flex items-center justify-between gap-2`}
                          >
                            <div>
                              <p className="font-bold text-sm">{card.title}</p>
                              <p className="text-xs opacity-80">{card.category}</p>
                            </div>
                            <button
                              onClick={() => removeItem(day, session.id, card.cardId)}
                              className="text-white/80 hover:text-white"
                              aria-label={`Remove ${card.title}`}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
      </div>
  );
};

export default PlannerBoard;
