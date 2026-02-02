import "./globals.css";
import type { ReactNode } from "react";
import Link from "next/link";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Navigation } from "@/components/Navigation";

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
            <header className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600 text-xl font-bold text-white shadow-lg shadow-primary-600/50 transition group-hover:scale-105">
                  P
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-600 dark:text-primary-300 sm:text-base">
                    Society Parking
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
                    Fair, transparent one-time lottery
                  </p>
                </div>
              </Link>
              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <ThemeToggle />
              </div>
            </header>
            <Navigation />
            <main className="flex-1">{children}</main>
            <footer className="mt-8 border-t border-slate-200 pt-4 text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p>One-time lottery system. Results are locked once the draw is complete.</p>
                <p className="text-slate-400 dark:text-slate-500">
                  Need help? Contact your society office.
                </p>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}


