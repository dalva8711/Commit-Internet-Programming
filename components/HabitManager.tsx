"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { createHabit, deleteHabit } from "@/app/actions/habits";
import type { Habit } from "@/lib/types";

const PRESET_COLORS = [
  "#22d3ee", // cyan
  "#4ade80", // green
  "#f97316", // orange
  "#a855f7", // purple
  "#f43f5e", // rose
  "#facc15", // yellow
  "#3b82f6", // blue
  "#ec4899", // pink
];

const FOCUSABLE =
  'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';

interface Props {
  habits: Habit[];
  onClose: () => void;
  openerRef?: React.RefObject<HTMLButtonElement | null>;
}

export default function HabitManager({ habits, onClose, openerRef }: Props) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, startAddTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus the first focusable element when the modal opens.
  useEffect(() => {
    const first = modalRef.current?.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus();
  }, []);

  // Restore focus to the opener button when the modal unmounts.
  useEffect(() => {
    return () => {
      openerRef?.current?.focus();
    };
  }, [openerRef]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Escape") {
      onClose();
      return;
    }
    if (e.key !== "Tab") return;

    const focusable = Array.from(
      modalRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []
    );
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("color", color);

    startAddTransition(async () => {
      const result = await createHabit(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        setName("");
      }
    });
  }

  function handleDelete(id: string) {
    startDeleteTransition(async () => {
      await deleteHabit(id);
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="habit-manager-title"
        className="w-full max-w-md rounded-2xl p-6"
        style={{ background: "#1e2a3a", border: "1px solid rgba(255,255,255,0.1)" }}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 id="habit-manager-title" className="text-lg font-bold text-slate-100">Manage Habits</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Add new habit */}
        <form onSubmit={handleAdd} className="mb-5">
          <p className="text-slate-400 text-xs mb-2 uppercase tracking-wide">
            New Habit
          </p>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Running, LeetCode…"
            className="w-full bg-transparent border border-slate-600 rounded-lg px-3 py-2 text-slate-300 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm mb-3"
          />
          <div className="flex gap-2 mb-3 flex-wrap">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className="w-7 h-7 rounded-full transition-transform"
                style={{
                  background: c,
                  outline: color === c ? `2px solid white` : "none",
                  outlineOffset: "2px",
                  transform: color === c ? "scale(1.2)" : "scale(1)",
                }}
              />
            ))}
          </div>
          {error && <p className="text-red-400 text-xs mb-2">{error}</p>}
          <button
            type="submit"
            disabled={isAdding || !name.trim()}
            className="w-full py-2 rounded-lg text-white text-sm font-semibold disabled:opacity-50 transition-opacity bg-cyan-500"
          >
            {isAdding ? "Adding…" : "Add Habit"}
          </button>
        </form>

        {/* Existing habits */}
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {habits.map((h) => (
            <div
              key={h.id}
              className="flex items-center justify-between rounded-lg px-3 py-2"
              style={{ background: "#243044" }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ background: h.color }}
                />
                <span className="text-slate-200 text-sm">{h.name}</span>
              </div>
              <button
                onClick={() => handleDelete(h.id)}
                disabled={isDeleting}
                className="text-red-400 hover:text-red-300 text-xs disabled:opacity-50"
              >
                Remove
              </button>
            </div>
          ))}
          {habits.length === 0 && (
            <p className="text-slate-500 text-sm text-center py-4">
              No habits yet. Add one above!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
