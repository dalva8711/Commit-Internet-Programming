"use client";

import { useState } from "react";
import Link from "next/link";
import { signup } from "@/app/actions/auth";

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await signup(formData);

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
        <p className="text-center text-slate-400 mb-6 text-sm">
          Create an Account
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="username"
            type="text"
            placeholder="Username"
            required
            className="w-full bg-transparent border border-slate-600 rounded-lg px-4 py-3 text-slate-300 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full bg-transparent border border-slate-600 rounded-lg px-4 py-3 text-slate-300 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            minLength={8}
            className="w-full bg-transparent border border-slate-600 rounded-lg px-4 py-3 text-slate-300 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm"
          />
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            required
            className="w-full bg-transparent border border-slate-600 rounded-lg px-4 py-3 text-slate-300 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-sm"
          />
          <p className="text-slate-500 text-xs">At least 8 characters</p>

          {error && (
            <p className="text-red-400 text-xs text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full font-semibold text-white text-sm transition-opacity disabled:opacity-60 bg-cyan-500"
          >
            {loading ? "Creating account…" : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-slate-400 text-xs mt-5">
          Already have an account?{" "}
          <Link href="/login" className="text-cyan-400 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
