"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createHabit(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const name = (formData.get("name") as string)?.trim();
  const color = formData.get("color") as string;

  if (!name) return { error: "Habit name is required" };

  const { error } = await supabase
    .from("habits")
    .insert({ user_id: user.id, name, color });

  if (error) return { error: error.message };

  revalidatePath("/home");
  return { success: true };
}

export async function deleteHabit(habitId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("habits")
    .delete()
    .eq("id", habitId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/home");
  return { success: true };
}
