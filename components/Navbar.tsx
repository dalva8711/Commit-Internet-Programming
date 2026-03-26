import Link from "next/link";
import { logout } from "@/app/actions/auth";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4">
      <Link
        href="/home"
        className="text-2xl font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
      >
        Commit
      </Link>

      <div className="flex items-center gap-4">
        <Link
          href="/profile"
          className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors text-sm"
        >
          Profile
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="text-slate-400 hover:text-slate-200 text-sm transition-colors"
          >
            Sign Out
          </button>
        </form>
      </div>
    </nav>
  );
}
