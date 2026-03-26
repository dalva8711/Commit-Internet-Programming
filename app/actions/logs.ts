"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createLog(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const habitId = formData.get("habitId") as string;
  const notes = (formData.get("notes") as string) || null;

  if (!habitId) return { error: "Please select a habit" };

  // logged_date is set to CURRENT_DATE by the DB default + constraint
  const { error } = await supabase.from("logs").insert({
    user_id: user.id,
    habit_id: habitId,
    notes,
  });

  if (error) {
    if (error.code === "23514") {
      return { error: "Logs can only be added for today." };
    }
    return { error: error.message };
  }

  revalidatePath("/home");
  return { success: true };
}

export async function deleteLog(logId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("logs")
    .delete()
    .eq("id", logId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/home");
  return { success: true };
}
