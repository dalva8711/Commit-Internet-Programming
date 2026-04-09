"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import type CalendarHeatmapNS from "react-calendar-heatmap";
import { Tooltip } from "react-tooltip";
import type { HeatmapValue, Log } from "@/lib/types";
import DayLogsModal from "./DayLogsModal";

// Extend the library's TooltipDataAttrs to explicitly cover data-* attributes,
// which are valid DOM pass-throughs but absent from SVGAttributes<SVGSVGElement>.
type TooltipAttrs = CalendarHeatmapNS.TooltipDataAttrs & {
  [key: `data-${string}`]: string | undefined;
};


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

  // The library places each weekday label's baseline at the BOTTOM edge of its row.
  // Re-center the Mon/Wed/Fri labels by deriving the square size from the library's
  // own rendered y values and repositioning each label at the row's vertical midpoint.
  useEffect(() => {
    const group = wrapperRef.current?.querySelector(
      ".react-calendar-heatmap-weekday-labels"
    );
    if (!group) return;

    const texts = Array.from(
      group.querySelectorAll<SVGTextElement>("text")
    );
    if (texts.length < 2) return;

    const yMon = parseFloat(texts[0].getAttribute("y") ?? "21");
    const yWed = parseFloat(texts[1].getAttribute("y") ?? "43");
    // Mon = dayIndex 1, Wed = dayIndex 3  →  difference spans 2 rows
    const squareSizeWithGutter = (yWed - yMon) / 2;

    [1, 3, 5].forEach((dayIndex, i) => {
      texts[i]?.setAttribute("y", String((dayIndex + 0.5) * squareSizeWithGutter));
    });
  }, [values]);

  // "YYYY-MM-DD" strings are parsed as UTC midnight by the library (JS spec).
  // Appending T00:00:00 (no Z) forces local-midnight parsing, which matches
  // the library's own start/end date arithmetic and keeps squares on the correct day.
  const localValues = useMemo(
    () => values.map((v) => ({ ...v, date: `${v.date}T00:00:00` })),
    [values]
  );

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
          values={localValues}
          classForValue={(value) => {
            if (!value) return "color-empty";
            return getClassForCount(value.count);
          }}
          tooltipDataAttrs={(
            value: CalendarHeatmapNS.ReactCalendarHeatmapValue<string> | undefined
          ): TooltipAttrs => {
            if (!value?.date) {
              return { "data-tooltip-id": "heatmap-tooltip" };
            }
            const date = value.date.slice(0, 10);
            const count = (value.count as number | undefined) ?? 0;
            return {
              "data-tooltip-id": "heatmap-tooltip",
              "data-tooltip-content": `${date}: ${count} log${count !== 1 ? "s" : ""}`,
            };
          }}
          showWeekdayLabels={true}
          onClick={(value) => {
            if (value?.date) setSelectedDate(value.date.slice(0, 10));
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
