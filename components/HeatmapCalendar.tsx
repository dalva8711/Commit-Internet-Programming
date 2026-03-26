"use client";

import CalendarHeatmap from "react-calendar-heatmap";
import { Tooltip } from "react-tooltip";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyAttrs = any;
import type { HeatmapValue } from "@/lib/types";

interface Props {
  values: HeatmapValue[];
}

function getClassForCount(count: number): string {
  if (count === 0) return "color-empty";
  if (count === 1) return "color-scale-1";
  if (count === 2) return "color-scale-2";
  if (count === 3) return "color-scale-3";
  return "color-scale-4";
}

export default function HeatmapCalendar({ values }: Props) {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setFullYear(today.getFullYear() - 1);

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "#1e2a3a", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <h2 className="text-white font-bold text-lg mb-4">Your Logs</h2>
      <div className="overflow-x-auto">
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
          showWeekdayLabels
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
                className={cls}
              />
            </svg>
          )
        )}
        <span className="text-slate-500 text-xs ml-1">More</span>
      </div>

      <Tooltip id="heatmap-tooltip" />
    </div>
  );
}
