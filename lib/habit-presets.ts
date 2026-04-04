export const HABIT_PRESET_COLORS = [
  "#22d3ee", // cyan
  "#4ade80", // green
  "#f97316", // orange
  "#a855f7", // purple
  "#f43f5e", // rose
  "#facc15", // yellow
  "#3b82f6", // blue
  "#ec4899", // pink
] as const;

export type HabitPresetColor = (typeof HABIT_PRESET_COLORS)[number];

const presetSet = new Set<string>(HABIT_PRESET_COLORS);

export function isHabitPresetColor(value: unknown): boolean {
  if (typeof value !== "string") return false;
  return presetSet.has(value.trim().toLowerCase());
}
