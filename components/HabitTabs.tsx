"use client";

import { useState } from "react";
import type { Habit } from "@/lib/types";
import HabitManager from "./HabitManager";

interface Props {
  habits: Habit[];
  selectedHabitId: string | null;
  onSelect: (id: string | null) => void;
}

export default function HabitTabs({ habits, selectedHabitId, onSelect }: Props) {
  const [showManager, setShowManager] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {/* All Logs tab */}
        <button
          onClick={() => onSelect(null)}
          className="flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
          style={{
            background: selectedHabitId === null ? "#22d3ee" : "rgba(34,211,238,0.15)",
            color: selectedHabitId === null ? "#0f172a" : "#22d3ee",
            border: "1px solid #22d3ee",
          }}
        >
          All Logs
        </button>

        {/* Individual habit tabs */}
        {habits.map((h) => (
          <button
            key={h.id}
            onClick={() => onSelect(h.id)}
            className="flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
            style={{
              background:
                selectedHabitId === h.id
                  ? h.color
                  : `${h.color}26`,
              color: selectedHabitId === h.id ? "#0f172a" : h.color,
              border: `1px solid ${h.color}`,
            }}
          >
            {h.name}
          </button>
        ))}

        {/* Add / manage button */}
        <button
          onClick={() => setShowManager(true)}
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors text-xl leading-none"
          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}
          title="Manage habits"
        >
          +
        </button>
      </div>

      {showManager && (
        <HabitManager habits={habits} onClose={() => setShowManager(false)} />
      )}
    </>
  );
}
