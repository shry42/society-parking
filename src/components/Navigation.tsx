"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navigation() {
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isTenant = pathname?.startsWith("/tenant");
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <nav className="mb-6 rounded-xl border border-slate-200 bg-white/80 p-2 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80 sm:mb-8">
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href="/"
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
            isHome
              ? "bg-primary-600 text-white shadow-md"
              : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          }`}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="hidden sm:inline">Home</span>
        </Link>

        <Link
          href="/tenant"
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
            isTenant
              ? "bg-primary-600 text-white shadow-md"
              : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          }`}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>Tenant</span>
        </Link>

        <Link
          href="/admin"
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
            isAdmin
              ? "bg-primary-600 text-white shadow-md"
              : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          }`}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Admin</span>
        </Link>
      </div>
    </nav>
  );
}

