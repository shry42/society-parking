"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    // Placeholder: will be replaced with Firebase Auth / custom admin auth
    setTimeout(() => {
      setLoading(false);
      if (!email || !password) {
        setError("Please enter admin email and password.");
        return;
      }
      router.push("/admin/dashboard");
    }, 800);
  };

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 sm:gap-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-2xl">
            Admin Login
          </h1>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Only authorized society officials can access the lottery controls.
          </p>
        </div>
        <Link
          href="/admin"
          className="text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
        >
          ← Admin portal
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4 p-4 sm:p-6">
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="text-xs font-medium text-slate-700 dark:text-slate-200"
          >
            Admin email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="office@society.org"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-primary-500/40 transition focus:border-primary-500 focus:ring-1 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="text-xs font-medium text-slate-700 dark:text-slate-200"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter admin password"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-primary-500/40 transition focus:border-primary-500 focus:ring-1 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <p className="rounded-md border border-rose-500/40 bg-rose-50 px-3 py-2 text-xs text-rose-800 dark:bg-rose-900/20 dark:text-rose-100">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center text-sm disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Verifying…" : "Log in"}
        </button>

        <p className="pt-1 text-[11px] text-slate-500 dark:text-slate-400">
          In the final version, this login will be backed by Firebase or a
          secure admin authentication mechanism.
        </p>
      </form>
    </div>
  );
}


