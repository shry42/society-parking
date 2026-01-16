"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type DrawStatus = "not-started" | "running" | "paused" | "completed";

type DrawItem = {
  id: string;
  flatNumber: string;
  isFixed?: boolean;
  displayName: string;
  result?: "ALLOTTED" | "NOT_ALLOTTED";
  slotNumber?: string;
};

const demoFlats: DrawItem[] = [
  {
    id: "1",
    flatNumber: "A-302",
    isFixed: true,
    displayName: "Shah Family",
    result: "ALLOTTED",
    slotNumber: "F-01"
  },
  {
    id: "2",
    flatNumber: "B-204",
    displayName: "Patel Family"
  },
  {
    id: "3",
    flatNumber: "C-501",
    displayName: "Mehta Family"
  },
  {
    id: "4",
    flatNumber: "A-105",
    displayName: "Kumar Family"
  },
  {
    id: "5",
    flatNumber: "D-307",
    displayName: "Singh Family"
  },
  {
    id: "6",
    flatNumber: "B-412",
    displayName: "Gupta Family"
  },
  {
    id: "7",
    flatNumber: "E-208",
    displayName: "Sharma Family"
  },
  {
    id: "8",
    flatNumber: "C-603",
    displayName: "Joshi Family"
  },
  {
    id: "9",
    flatNumber: "A-401",
    displayName: "Desai Family"
  },
  {
    id: "10",
    flatNumber: "F-205",
    displayName: "Reddy Family"
  }
];

export default function AdminLotteryPage() {
  const [status, setStatus] = useState<DrawStatus>("not-started");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState<DrawItem[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const items = useMemo(() => demoFlats, []);

  useEffect(() => {
    if (status !== "running") return;
    if (currentIndex >= items.length) {
      setStatus("completed");
      return;
    }

    const timer = setTimeout(() => {
      const current = items[currentIndex];
      const isFixed = current.isFixed;
      const allottedCount = history.filter((h) => h.result === "ALLOTTED").length;
      const remainingSlots = 205 - allottedCount;
      let result: DrawItem;

      if (isFixed && current.slotNumber) {
        // Fixed slot - use the pre-assigned slot
        result = { ...current, result: "ALLOTTED", slotNumber: current.slotNumber };
      } else if (remainingSlots > 0) {
        // Random allocation for normal flats (70% chance for demo)
        const willAllot = Math.random() > 0.3;
        if (willAllot) {
          const nextSlotNumber = allottedCount + 1;
          result = {
            ...current,
            result: "ALLOTTED",
            slotNumber: `P-${String(nextSlotNumber).padStart(3, "0")}`
          };
        } else {
          result = { ...current, result: "NOT_ALLOTTED" };
        }
      } else {
        // No slots remaining
        result = { ...current, result: "NOT_ALLOTTED" };
      }

      setHistory((prev) => [...prev, result]);
      setCurrentIndex((prev) => prev + 1);
    }, 5000);

    return () => clearTimeout(timer);
  }, [status, currentIndex, items, history]);

  const current = history[history.length - 1];

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {!isFullscreen && (
        <div className="flex flex-col gap-3 lg:hidden">
          <div className="mb-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Link href="/admin/dashboard" className="hover:text-slate-700 dark:hover:text-slate-300">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-slate-700 dark:text-slate-300">Live Lottery</span>
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
              Live Lottery Screen
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Display this page on a big screen during the society meeting. Flats
              appear one-by-one in random order with their parking result.
            </p>
          </div>
        </div>
      )}

      <section className={`grid gap-4 ${isFullscreen ? "" : "lg:grid-cols-[1fr,350px] xl:grid-cols-[1fr,400px]"}`}>
        <div className={`card flex ${isFullscreen ? "fixed inset-0 z-50 min-h-screen" : "min-h-[70vh] lg:min-h-[80vh]"} flex-col items-center justify-center gap-6 p-8 text-center sm:gap-8 sm:p-12 lg:p-16 xl:gap-12 xl:p-20`}>
          {isFullscreen && (
            <button
              type="button"
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 z-50 rounded-full bg-slate-900/80 p-3 text-white hover:bg-slate-900 dark:bg-slate-100/80 dark:text-slate-900 dark:hover:bg-slate-100"
              title="Exit fullscreen"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          <p className="badge mb-4 text-sm font-semibold uppercase tracking-[0.26em] text-primary-600 dark:text-primary-200 sm:text-base lg:text-lg">
            Society Parking Lottery
          </p>

          {current ? (
            <>
              <p className="text-lg font-medium text-slate-600 dark:text-slate-300 sm:text-xl lg:text-2xl xl:text-3xl">
                Flat appearing in draw
              </p>
              <p className="text-6xl font-extrabold tracking-[0.18em] text-primary-600 dark:text-primary-200 sm:text-7xl lg:text-8xl xl:text-9xl">
                {current.flatNumber}
              </p>
              <p className="mt-2 text-lg text-slate-600 dark:text-slate-300 sm:text-xl lg:text-2xl xl:text-3xl">
                {current.displayName}
              </p>

              <div className="mt-8 flex flex-col items-center gap-4 sm:mt-10 lg:mt-12 xl:mt-16">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 sm:text-base lg:text-lg xl:text-xl">
                  Result
                </p>
                {current.result === "ALLOTTED" ? (
                  <>
                    <p className="rounded-full bg-emerald-500/10 px-8 py-4 text-base font-semibold uppercase tracking-[0.24em] text-emerald-600 ring-4 ring-emerald-500/60 dark:text-emerald-300 sm:px-10 sm:py-5 sm:text-lg lg:px-12 lg:py-6 lg:text-xl xl:px-16 xl:py-8 xl:text-2xl">
                      Parking Allotted
                    </p>
                    {current.slotNumber && (
                      <p className="text-lg text-emerald-700 dark:text-emerald-200 sm:text-xl lg:text-2xl xl:text-3xl">
                        Slot number:{" "}
                        <span className="font-bold text-2xl sm:text-3xl lg:text-4xl xl:text-5xl">
                          {current.slotNumber}
                        </span>
                      </p>
                    )}
                  </>
                ) : (
                  <p className="rounded-full bg-rose-500/10 px-8 py-4 text-base font-semibold uppercase tracking-[0.24em] text-rose-600 ring-4 ring-rose-500/60 dark:text-rose-200 sm:px-10 sm:py-5 sm:text-lg lg:px-12 lg:py-6 lg:text-xl xl:px-16 xl:py-8 xl:text-2xl">
                    Not Allotted
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              <p className="text-xl font-medium text-slate-600 dark:text-slate-300 sm:text-2xl lg:text-3xl">
                Lottery not started yet
              </p>
              <p className="mt-4 text-base text-slate-500 dark:text-slate-400 sm:text-lg lg:text-xl">
                When you start, the system will automatically cycle through all
                flats exactly once in random order.
              </p>
            </>
          )}
        </div>

        {!isFullscreen && (
          <div className="space-y-4 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
            <div className="card p-3 sm:p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                  Controls
                </h2>
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  title="Fullscreen presentation mode"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </button>
              </div>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                In the real system, once you start and complete the lottery, it
                cannot be run again.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
              {status === "not-started" && (
                <button
                  type="button"
                  className="btn-primary flex items-center gap-2 text-sm px-6 py-3"
                  onClick={() => setStatus("running")}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Start Lottery
                </button>
              )}
              {status === "running" && (
                <button
                  type="button"
                  className="btn-secondary flex items-center gap-2 text-sm px-6 py-3"
                  onClick={() => setStatus("paused")}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Pause
                </button>
              )}
              {status === "paused" && (
                <button
                  type="button"
                  className="btn-primary flex items-center gap-2 text-sm px-6 py-3"
                  onClick={() => setStatus("running")}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Resume
                </button>
              )}
              {status === "completed" && (
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-600 ring-1 ring-emerald-500/50 dark:text-emerald-300">
                  Demo draw completed
                </span>
              )}
            </div>
            <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">
              Pause can be used for announcements or clarifications during the
              live event. The system will always resume from the exact next
              flat in sequence.
            </p>
          </div>

          <div className="card p-3 sm:p-4">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              Recent flats (Demo)
            </h2>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              A compact history of the flats that have already appeared.
            </p>
            <div className="mt-3 space-y-2 max-h-52 overflow-y-auto pr-1">
              {history.length === 0 && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  No flats drawn yet.
                </p>
              )}
              {history
                .slice()
                .reverse()
                .map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs dark:border-slate-800/80 dark:bg-slate-950/60"
                  >
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">
                        {item.flatNumber}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {item.displayName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-[11px] font-semibold ${
                          item.result === "ALLOTTED"
                            ? "text-emerald-600 dark:text-emerald-300"
                            : "text-rose-600 dark:text-rose-300"
                        }`}
                      >
                        {item.result === "ALLOTTED"
                          ? "Allotted"
                          : "Not allotted"}
                      </p>
                      {item.slotNumber && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Slot {item.slotNumber}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
          </div>
        )}
      </section>

      {isFullscreen && (
        <div className="fixed right-4 top-1/2 z-50 -translate-y-1/2">
          <div className="flex flex-col gap-2 rounded-full bg-slate-900/90 p-2 shadow-lg dark:bg-slate-100/90">
            {status === "not-started" && (
              <button
                type="button"
                className="flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 dark:bg-emerald-500"
                onClick={() => setStatus("running")}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Start
              </button>
            )}
            {status === "running" && (
              <button
                type="button"
                className="flex items-center gap-2 rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 dark:bg-amber-500"
                onClick={() => setStatus("paused")}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Pause
              </button>
            )}
            {status === "paused" && (
              <button
                type="button"
                className="flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 dark:bg-emerald-500"
                onClick={() => setStatus("running")}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Resume
              </button>
            )}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="rounded-full bg-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-600 dark:bg-slate-800"
            >
              Exit Fullscreen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


