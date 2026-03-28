import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/actions/auth";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const [{ data: profile }, { count: totalLogs }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("logs")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);

  const joinDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4">
        <Link
          href="/home"
          className="text-2xl font-bold text-cyan-400 hover:text-cyan-300 transition-colors cursor-default"
        >
          Commit
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="text-slate-400 hover:text-slate-200 text-sm transition-colors cursor-default"
          >
            Sign Out
          </button>
        </form>
      </nav>
      <div className="px-6 -mt-2 mb-2">
        <Link
          href="/home"
          className="text-slate-400 hover:text-slate-200 text-sm transition-colors cursor-default"
        >
          &lt; Back
        </Link>
      </div>

      <main className="max-w-lg mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-slate-100 mb-6">Profile</h1>

        <div
          className="rounded-2xl p-6 space-y-5"
          style={{ background: "#1e2a3a", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          {/* Avatar placeholder */}
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-slate-900 bg-cyan-500"
            >
              {(profile?.username ?? user.email ?? "?")[0].toUpperCase()}
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-100">
                {profile?.username ?? "—"}
              </p>
              <p className="text-slate-400 text-sm">{profile?.email ?? user.email}</p>
            </div>
          </div>

          <div
            className="border-t"
            style={{ borderColor: "rgba(255,255,255,0.07)" }}
          />

          <div className="space-y-3">
            <ProfileRow label="Username" value={profile?.username ?? "—"} />
            <ProfileRow label="Email" value={profile?.email ?? user.email ?? "—"} />
            <ProfileRow label="Member Since" value={joinDate} />
            <ProfileRow
              label="Total Logs"
              value={
                <span className="text-green-400 font-bold">
                  {(totalLogs ?? 0).toLocaleString()}
                </span>
              }
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function ProfileRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-slate-400 text-sm">{label}</span>
      <span className="text-slate-200 text-sm font-medium">{value}</span>
    </div>
  );
}
