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
  }
];

export default function AdminLotteryPage() {
  const [status, setStatus] = useState<DrawStatus>("not-started");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState<DrawItem[]>([]);

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
      const remainingSlots = 205 - history.filter((h) => h.result === "ALLOTTED").length;
      let result: DrawItem;

      if (isFixed) {
        result = { ...current, result: "ALLOTTED" };
      } else if (remainingSlots > 0) {
        result = {
          ...current,
          result: Math.random() > 0.4 ? "ALLOTTED" : "NOT_ALLOTTED",
          slotNumber: `P-${String(remainingSlots).padStart(3, "0")}`
        };
      } else {
        result = { ...current, result: "NOT_ALLOTTED" };
      }

      setHistory((prev) => [...prev, result]);
      setCurrentIndex((prev) => prev + 1);
    }, 1600);

    return () => clearTimeout(timer);
  }, [status, currentIndex, items, history]);

  const current = history[history.length - 1];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3">
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

      <section className="grid gap-4 lg:grid-cols-[1.4fr,1fr]">
        <div className="card flex flex-col items-center justify-center gap-4 p-6 text-center sm:p-8 lg:p-10">
          <p className="badge mb-2 text-xs font-semibold uppercase tracking-[0.26em] text-primary-600 dark:text-primary-200">
            Society Parking Lottery
          </p>

          {current ? (
            <>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Flat appearing in draw
              </p>
              <p className="text-4xl font-extrabold tracking-[0.18em] text-primary-600 dark:text-primary-200 sm:text-5xl lg:text-6xl">
                {current.flatNumber}
              </p>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                {current.displayName}
              </p>

              <div className="mt-5 flex flex-col items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                  Result
                </p>
                {current.result === "ALLOTTED" ? (
                  <>
                    <p className="rounded-full bg-emerald-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600 ring-2 ring-emerald-500/60 dark:text-emerald-300 sm:px-6 sm:text-sm">
                      Parking Allotted
                    </p>
                    {current.slotNumber && (
                      <p className="text-sm text-emerald-700 dark:text-emerald-200">
                        Slot number:{" "}
                        <span className="font-semibold">
                          {current.slotNumber}
                        </span>
                      </p>
                    )}
                  </>
                ) : (
                  <p className="rounded-full bg-rose-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-rose-600 ring-2 ring-rose-500/60 dark:text-rose-200 sm:px-6 sm:text-sm">
                    Not Allotted
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Lottery not started yet
              </p>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                When you start, the system will automatically cycle through all
                flats exactly once in random order.
              </p>
            </>
          )}
        </div>

        <div className="space-y-4">
          <div className="card p-3 sm:p-4">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              Controls (Demo)
            </h2>
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
      </section>
    </div>
  );
}


