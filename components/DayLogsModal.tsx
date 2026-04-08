"use client";

import { useEffect, useRef } from "react";
import type { Log } from "@/lib/types";

const FOCUSABLE =
  'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';

interface Props {
  date: string;
  logs: Log[];
  onClose: () => void;
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function DayLogsModal({ date, logs, onClose }: Props) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const first = modalRef.current?.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus();
  }, []);

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
        aria-labelledby="day-logs-title"
        className="w-full max-w-md rounded-2xl flex flex-col"
        style={{
          background: "#1e2a3a",
          border: "1px solid rgba(255,255,255,0.1)",
          maxHeight: "80vh",
        }}
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 pb-4 flex-shrink-0">
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-wide mb-0.5">
              Logs for
            </p>
            <h2 id="day-logs-title" className="text-slate-100 font-bold text-base leading-snug">
              {formatDate(date)}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-xl leading-none ml-4 flex-shrink-0 mt-0.5"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />

        {/* Scrollable log list */}
        <div className="overflow-y-auto p-5 pt-4 space-y-3">
          {logs.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-6">
              No logs for this day.
            </p>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="rounded-xl px-4 py-3"
                style={{ background: "#243044" }}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ background: log.habits?.color ?? "#64748b" }}
                  />
                  <span className="text-slate-200 text-sm font-medium">
                    {log.habits?.name ?? "Unknown habit"}
                  </span>
                </div>
                {log.notes && log.notes.trim() !== "" && (
                  <p className="text-slate-400 text-sm mt-1.5 ml-5 leading-relaxed">
                    {log.notes}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
