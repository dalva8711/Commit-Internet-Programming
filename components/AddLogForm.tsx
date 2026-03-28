"use client";

import { useState, useEffect, useTransition } from "react";
import { createLog } from "@/app/actions/logs";
import type { Habit } from "@/lib/types";

interface Props {
  habits: Habit[];
}

export default function AddLogForm({ habits }: Props) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const [habitId, setHabitId] = useState(habits[0]?.id ?? "");

  useEffect(() => {
    if (habits.length > 0 && !habits.some((h) => h.id === habitId)) {
      setHabitId(habits[0].id);
    }
  }, [habits, habitId]);

  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append("habitId", habitId);
    formData.append("notes", notes);

    startTransition(async () => {
      const result = await createLog(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setNotes("");
        setTimeout(() => setSuccess(false), 3000);
      }
    });
  }

  if (habits.length === 0) {
    return (
      <div
        className="rounded-2xl p-5 text-center"
        style={{ background: "#1e2a3a", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <p className="text-slate-400 text-sm">
          Add a habit first to start logging!
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "#1e2a3a", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-bold text-lg">Add Log</h2>
        <span className="text-slate-400 text-xs">{today}</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <select
          value={habitId}
          onChange={(e) => setHabitId(e.target.value)}
          required
          className="w-full rounded-lg px-3 py-2.5 text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500"
          style={{ background: "#243044", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          {habits.map((h) => (
            <option key={h.id} value={h.id}>
              {h.name}
            </option>
          ))}
        </select>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notes (optional)"
          rows={2}
          className="w-full rounded-lg px-3 py-2.5 text-slate-300 placeholder-slate-500 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none"
          style={{ background: "#243044", border: "1px solid rgba(255,255,255,0.1)" }}
        />

        {error && <p className="text-red-400 text-xs">{error}</p>}
        {success && (
          <p className="text-green-400 text-xs">Log added successfully!</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2.5 rounded-lg text-white font-semibold text-sm disabled:opacity-50 transition-opacity bg-cyan-500"
        >
          {isPending ? "Adding…" : "Add Log"}
        </button>
      </form>
    </div>
  );
}
