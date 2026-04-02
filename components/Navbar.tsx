import Link from "next/link";
import { logout } from "@/app/actions/auth";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 backdrop-blur-md">
      <Link
        href="/home"
        className="text-2xl font-bold text-cyan-400 hover:text-cyan-300 transition-colors cursor-default"
      >
        Commit
      </Link>

      <div className="flex items-center gap-4">
        <Link
          href="/profile"
          className="text-slate-400 hover:text-slate-200 text-sm transition-colors cursor-default pt-[1px]"
        >
          Profile
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="text-slate-400 hover:text-slate-200 text-sm transition-colors cursor-default"
          >
            Sign Out
          </button>
        </form>
      </div>
    </nav>
  );
}
