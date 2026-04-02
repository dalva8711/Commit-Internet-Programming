import { redirect } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import BibleVerse from "@/components/BibleVerse";
import HomeClient from "@/components/HomeClient";
import type { Habit, Log } from "@/lib/types";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: habits }, { data: logs }] = await Promise.all([
    supabase
      .from("habits")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true }),
    supabase
      .from("logs")
      .select("*, habits(name, color)")
      .eq("user_id", user.id)
      .order("logged_date", { ascending: false }),
  ]);

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-12 space-y-5">
        <Suspense
          fallback={
            <p className="text-center text-cyan-400 text-sm animate-pulse">
              Loading verse…
            </p>
          }
        >
          <BibleVerse />
        </Suspense>

        <HomeClient
          habits={(habits as Habit[]) ?? []}
          logs={(logs as Log[]) ?? []}
        />
      </main>
    </div>
  );
}
