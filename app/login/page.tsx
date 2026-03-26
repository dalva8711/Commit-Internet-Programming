"use client";

import { useState } from "react";
import Link from "next/link";
import { login } from "@/app/actions/auth";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div
        className="w-full max-w-sm rounded-2xl p-8"
        style={{ background: "rgba(30, 42, 58, 0.9)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <h1 className="text-3xl font-bold text-center text-cyan-400 mb-1">
          Commit
        </h1>
        <p className="text-center text-slate-400 mb-6 text-sm">Welcome Back</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="identifier"
            type="text"
            placeholder="Email"
            required
            className="w-full bg-transparent border border-slate-600 rounded-lg px-4 py-3 text-slate-300 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="w-full bg-transparent border border-slate-600 rounded-lg px-4 py-3 text-slate-300 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm"
          />

          {error && (
            <p className="text-red-400 text-xs text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full font-semibold text-white text-sm transition-opacity disabled:opacity-60"
            style={{ background: "linear-gradient(90deg, #06b6d4, #7c3aed)" }}
          >
            {loading ? "Logging in…" : "Log In"}
          </button>
        </form>

        <p className="text-center text-slate-400 text-xs mt-5">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-cyan-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
