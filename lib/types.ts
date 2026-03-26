export interface Profile {
  id: string;
  username: string;
  email: string;
  created_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
}

export interface Log {
  id: string;
  user_id: string;
  habit_id: string;
  logged_date: string;
  notes: string | null;
  created_at: string;
  habits?: { name: string; color: string };
}

export interface HeatmapValue {
  date: string;
  count: number;
}
