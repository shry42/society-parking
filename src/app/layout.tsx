import "./globals.css";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ThemeToggle } from "@/components/ThemeToggle";

export const metadata = {
  title: "Society Parking Lottery",
  description:
    "Fair, transparent one-time parking lottery system for residential societies."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 text-slate-900 antialiased transition-colors dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
        <ThemeProvider>
          <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-10 pt-4 sm:pt-6 md:px-8 md:pt-10">
            <header className="mb-6 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-600 text-lg font-bold text-white shadow-lg shadow-primary-600/50">
                  P
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600 dark:text-primary-300 sm:text-sm">
                    Society Parking
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
                    Fair, transparent one-time lottery
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <span className="badge hidden text-[10px] sm:inline-flex sm:text-xs">
                  Total Slots: <strong className="ml-1 font-semibold">205</strong>
                  <span className="mx-1 text-slate-400 dark:text-slate-500">•</span>
                  Applicants:{" "}
                  <strong className="ml-1 font-semibold">~350 tenants</strong>
                </span>
                <ThemeToggle />
              </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="mt-8 border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
              One-time lottery system. Results are locked once the draw is
              complete.
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}


