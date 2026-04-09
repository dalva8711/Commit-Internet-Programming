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

  // Use the client's local date so the stored date matches what the user sees.
  // Falls back to the DB's CURRENT_DATE default if the value is absent or malformed.
  const rawDate = formData.get("logged_date") as string | null;
  const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(rawDate ?? "");

  const { error } = await supabase.from("logs").insert({
    user_id: user.id,
    habit_id: habitId,
    ...(isValidDate && { logged_date: rawDate }),
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
