"use client";

import { useState, useMemo } from "react";
import HabitTabs from "./HabitTabs";
import HeatmapCalendar from "./HeatmapCalendar";
import StatsCards from "./StatsCards";
import AddLogForm from "./AddLogForm";
import type { Habit, Log, HeatmapValue } from "@/lib/types";

interface Props {
  habits: Habit[];
  logs: Log[];
}

function buildHeatmapValues(logs: Log[]): HeatmapValue[] {
  const counts: Record<string, number> = {};
  logs.forEach((l) => {
    counts[l.logged_date] = (counts[l.logged_date] ?? 0) + 1;
  });
  return Object.entries(counts).map(([date, count]) => ({ date, count }));
}

export default function HomeClient({ habits, logs }: Props) {
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);

  const selectedHabitName = useMemo(
    () => habits.find((h) => h.id === selectedHabitId)?.name ?? null,
    [habits, selectedHabitId]
  );

  const filteredLogs = useMemo(() => {
    if (selectedHabitId === null) return logs;
    return logs.filter((l) => l.habit_id === selectedHabitId);
  }, [logs, selectedHabitId]);

  const heatmapValues = useMemo(
    () => buildHeatmapValues(filteredLogs),
    [filteredLogs]
  );

  return (
    <div className="space-y-5">
      <HabitTabs
        habits={habits}
        selectedHabitId={selectedHabitId}
        onSelect={setSelectedHabitId}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <HeatmapCalendar values={heatmapValues} />
        </div>
        <div>
          <AddLogForm habits={habits} />
        </div>
      </div>

      <StatsCards
        logs={filteredLogs}
        allLogs={logs}
        habits={habits}
        selectedHabitName={selectedHabitName}
      />
    </div>
  );
}
