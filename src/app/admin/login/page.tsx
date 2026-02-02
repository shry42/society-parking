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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Please enter admin email and password.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
        credentials: "include",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Invalid email or password.");
        return;
      }
      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 sm:gap-6">
      <div className="flex flex-col gap-3">
        <div className="mb-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Link href="/admin" className="hover:text-slate-700 dark:hover:text-slate-300">
            Admin Portal
          </Link>
          <span>/</span>
          <span className="text-slate-700 dark:text-slate-300">Login</span>
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
            Admin Login
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Only authorized society officials can access the lottery controls.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-5 p-6 sm:p-8">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
          >
            <svg className="h-4 w-4 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
            </svg>
            Admin email <span className="text-rose-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="admin@society.com"
            className="w-full rounded-lg border-2 border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none ring-primary-500/40 transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
          >
            <svg className="h-4 w-4 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Password <span className="text-rose-500">*</span>
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter admin password"
            className="w-full rounded-lg border-2 border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none ring-primary-500/40 transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <div className="rounded-lg border-2 border-rose-500/50 bg-rose-50 p-4 dark:border-rose-500/30 dark:bg-rose-900/20">
            <div className="flex gap-3">
              <svg className="h-5 w-5 flex-shrink-0 text-rose-600 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-rose-800 dark:text-rose-200">{error}</p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex w-full items-center justify-center gap-2 text-base disabled:cursor-not-allowed disabled:opacity-70 px-6 py-3"
        >
          {loading ? (
            <>
              <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Verifying…
            </>
          ) : (
            <>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Log in
            </>
          )}
        </button>

        <p className="pt-2 text-xs text-slate-500 dark:text-slate-400">
          Credentials are verified against the admincred collection in Firestore.
        </p>
      </form>
    </div>
  );
}


