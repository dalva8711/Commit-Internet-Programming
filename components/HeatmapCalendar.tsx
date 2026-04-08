"use client";

import { useEffect, useRef, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import { Tooltip } from "react-tooltip";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyAttrs = any;
import type { HeatmapValue, Log } from "@/lib/types";
import DayLogsModal from "./DayLogsModal";

// The library hardcodes `dayIndex & 1`, so only Mon/Wed/Fri are ever rendered.
// We inject the 4 missing labels (Sun/Tue/Thu/Sat) directly into the SVG after mount.
const MISSING_WEEKDAY_LABELS = [
  { dayIndex: 0, label: "Sun" },
  { dayIndex: 2, label: "Tue" },
  { dayIndex: 4, label: "Thu" },
  { dayIndex: 6, label: "Sat" },
] as const;

interface Props {
  values: HeatmapValue[];
  logs: Log[];
}

function getClassForCount(count: number): string {
  if (count === 0) return "color-empty";
  if (count === 1) return "color-scale-1";
  if (count === 2) return "color-scale-2";
  if (count === 3) return "color-scale-3";
  return "color-scale-4";
}

const LEGEND_COLORS: Record<string, string> = {
  "color-empty":   "#2d3f55",
  "color-scale-1": "#166534",
  "color-scale-2": "#16a34a",
  "color-scale-3": "#22c55e",
  "color-scale-4": "#4ade80",
};

export default function HeatmapCalendar({ values, logs }: Props) {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setFullYear(today.getFullYear() - 1);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const logsForDay = selectedDate
    ? logs.filter((l) => l.logged_date === selectedDate)
    : [];

  useEffect(() => {
    const group = wrapperRef.current?.querySelector(
      ".react-calendar-heatmap-weekday-labels"
    );
    if (!group) return;

    // Remove any labels we injected in a previous render before re-injecting.
    group.querySelectorAll("[data-injected]").forEach((el) => el.remove());

    MISSING_WEEKDAY_LABELS.forEach(({ dayIndex, label }) => {
      // Formula matches the library: (dayIndex + 1) * SQUARE_SIZE + dayIndex * gutterSize
      const y = (dayIndex + 1) * 10 + dayIndex * 1;
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", "0");
      text.setAttribute("y", String(y));
      text.setAttribute("class", "react-calendar-heatmap-weekday-label");
      text.setAttribute("data-injected", "true");
      text.textContent = label;
      group.appendChild(text);
    });
  }, [values]);

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "#1e2a3a", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <h2 className="text-white font-bold text-lg mb-4">Your Logs</h2>
      <div className="overflow-x-auto" ref={wrapperRef}>
        <CalendarHeatmap
          startDate={startDate}
          endDate={today}
          values={values}
          classForValue={(value) => {
            if (!value) return "color-empty";
            return getClassForCount(value.count);
          }}
          tooltipDataAttrs={((value: HeatmapValue | undefined) => {
            if (!value || !value.date) {
              return { "data-tooltip-id": "heatmap-tooltip" } as AnyAttrs;
            }
            return {
              "data-tooltip-id": "heatmap-tooltip",
              "data-tooltip-content": `${value.date}: ${value.count} log${value.count !== 1 ? "s" : ""}`,
            } as AnyAttrs;
          }) as AnyAttrs}
          showWeekdayLabels={true}
          weekdayLabels={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]}
          onClick={(value) => {
            if (value?.date) setSelectedDate(value.date);
          }}
        />
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-3 justify-end">
        <span className="text-slate-500 text-xs mr-1">Less</span>
        {["color-empty", "color-scale-1", "color-scale-2", "color-scale-3", "color-scale-4"].map(
          (cls) => (
            <svg key={cls} width="11" height="11">
              <rect
                width="11"
                height="11"
                rx="2"
                fill={LEGEND_COLORS[cls]}
              />
            </svg>
          )
        )}
        <span className="text-slate-500 text-xs ml-1">More</span>
      </div>

      <Tooltip id="heatmap-tooltip" />

      {selectedDate && (
        <DayLogsModal
          date={selectedDate}
          logs={logsForDay}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
}
