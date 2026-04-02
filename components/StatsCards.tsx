import type { Log, Habit } from "@/lib/types";

interface Props {
  logs: Log[];
  habits: Habit[];
}

function getLogsPerWeek(logs: Log[]): number {
  if (logs.length === 0) return 0;
  const today = new Date();
  const oneWeekAgo = new Date(today);
  oneWeekAgo.setDate(today.getDate() - 7);
  const weekLogs = logs.filter(
    (l) => new Date(l.logged_date) >= oneWeekAgo
  );
  return weekLogs.length;
}

function getMostLeastLogged(
  logs: Log[],
  habits: Habit[]
): { most: string | null; least: string | null } {
  if (habits.length === 0) return { most: null, least: null };

  const counts: Record<string, number> = {};
  habits.forEach((h) => (counts[h.id] = 0));
  logs.forEach((l) => {
    if (counts[l.habit_id] !== undefined) counts[l.habit_id]++;
  });

  const sorted = habits.slice().sort((a, b) => counts[b.id] - counts[a.id]);
  return {
    most: sorted[0]?.name ?? null,
    least: sorted[sorted.length - 1]?.name ?? null,
  };
}

interface StatCardProps {
  label: string;
  value: React.ReactNode;
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-2"
      style={{ background: "#1e2a3a", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <span className="text-slate-300 font-semibold text-sm">{label}</span>
      <span className="text-2xl font-bold">{value}</span>
    </div>
  );
}

export default function StatsCards({ logs, habits }: Props) {
  const totalLogs = logs.length;
  const logsPerWeek = getLogsPerWeek(logs);
  const { most, least } = getMostLeastLogged(logs, habits);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <StatCard
        label="Total Logs"
        value={
          <span className="text-green-400">
            {totalLogs.toLocaleString()}
          </span>
        }
      />
      <StatCard
        label="Logs Per Week"
        value={<span className="text-slate-100">{logsPerWeek}</span>}
      />
      <StatCard
        label="Most Logged Activity"
        value={
          <span className="text-yellow-400">{most ?? "—"}</span>
        }
      />
      <StatCard
        label="Least Logged Activity"
        value={<span className="text-red-400">{least ?? "—"}</span>}
      />
    </div>
  );
}
