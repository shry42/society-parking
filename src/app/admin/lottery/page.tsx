"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, writeBatch, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

type DrawStatus = "not-started" | "running" | "paused" | "completed";

type DrawItem = {
  id: string;
  flatNumber: string;
  displayName: string;
  // how many slots this flat would like (1 or 2)
  slotsWanted?: number;
  // how many slots were actually granted in the draw
  slotsGranted?: number;
  result?: "ALLOTTED" | "NOT_ALLOTTED";
  // For 2 slots this will be a joined string e.g. "P-001, P-002"
  slotNumber?: string;
};

// Full list of physical parking slots as per Excel:
// G-1 to G-26 (26), UB-1 to UB-56 (59), LB-1 to LB-60 (50), T-1 to T-70 (70) => 205
const BASE_SLOTS: string[] = [
  ...Array.from({ length: 26 }, (_, i) => `G-${i + 1}`),
  ...Array.from({ length: 59 }, (_, i) => `UB-${i + 1}`),
  ...Array.from({ length: 50 }, (_, i) => `LB-${i + 1}`),
  ...Array.from({ length: 70 }, (_, i) => `T-${i + 1}`)
];

const TOTAL_SLOTS = BASE_SLOTS.length;

function parseSlotLabel(label: string): { prefix: string; num: number } | null {
  const m = /^([A-Z]+)-(\d+)$/.exec(label.trim());
  if (!m) return null;
  return { prefix: m[1]!, num: Number(m[2]) };
}

// Build all consecutive pairs (G-1,G-2), (UB-1,UB-2), ... so 2-slot owners always get sequential slots.
function buildAllPairs(): [string, string][] {
  const byPrefix: Record<string, string[]> = {};
  for (const s of BASE_SLOTS) {
    const p = parseSlotLabel(s);
    if (!p) continue;
    if (!byPrefix[p.prefix]) byPrefix[p.prefix] = [];
    byPrefix[p.prefix].push(s);
  }
  const pairs: [string, string][] = [];
  for (const arr of Object.values(byPrefix)) {
    arr.sort((a, b) => parseSlotLabel(a)!.num - parseSlotLabel(b)!.num);
    for (let i = 0; i + 1 < arr.length; i += 2) {
      pairs.push([arr[i]!, arr[i + 1]!]);
    }
  }
  return pairs;
}

function shuffleArray<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

// Build pair pool (for 2-slot flats) and single pool (for 1-slot flats). 2-slot owners always get consecutive slots.
function buildAssignmentPools(count2Slot: number): { pairPool: [string, string][]; singlePool: string[] } {
  const allPairs = buildAllPairs();
  const shuffledPairs = shuffleArray(allPairs);
  const pairPool = shuffledPairs.slice(0, count2Slot);
  const usedSlots = new Set(pairPool.flat());
  const singlePool = shuffleArray(BASE_SLOTS.filter((s) => !usedSlots.has(s)));
  return { pairPool, singlePool };
}

export default function AdminLotteryPage() {
  const [status, setStatus] = useState<DrawStatus>("not-started");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState<DrawItem[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [items, setItems] = useState<DrawItem[]>([]);
  const [pairPool, setPairPool] = useState<[string, string][]>([]);
  const [singlePool, setSinglePool] = useState<string[]>([]);
  const [nextPairIndex, setNextPairIndex] = useState(0);
  const [nextSingleIndex, setNextSingleIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resultsSaved, setResultsSaved] = useState(false);
  const [resultsLocked, setResultsLocked] = useState(false);

  // Load flats from parking_master
  useEffect(() => {
    if (!db) {
      setError("Firebase is not configured.");
      setLoading(false);
      return;
    }
    // First check if results already exist; if yes, lock the draw.
    getDocs(collection(db, "parking_results"))
      .then((snap) => {
        if (!snap.empty) {
          setResultsLocked(true);
        }
      })
      .catch(() => {
        // ignore errors here; we can still try to run the lottery
      });

    getDocs(collection(db, "parking_master"))
      .then((snap) => {
        const docs = snap.docs.map((d, idx) => {
          const data = d.data() as Record<string, unknown>;
          const flatNumber = (data.flatNo ?? `#${idx + 1}`).toString().trim();
          const displayName = (data.flatOwnersNameSoleFirstName ?? "Unknown").toString().trim();
          const rowIndex = Number(data._rowIndex ?? 0);

          // Handle case where some owners have 2 parking slots (purchased)
          // In Firestore this comes from Excel headers:
          // - "Parking Slot/s"  -> field `parkingSlotS`  (1 or 2 per flat)
          // - "Parking Slots"   -> field `parkingSlots` (summary, usually 1)
          const rawSlots = Number(
            (data.parkingSlotS as unknown) ??
              (data.parkingSlots as unknown) ??
              1
          );
          const slotsWanted = Number.isFinite(rawSlots) && rawSlots > 0 ? rawSlots : 1;

          return {
            id: d.id,
            flatNumber,
            displayName,
            slotsWanted,
            rowIndex
          };
        });

        // Sort strictly in ascending order of _rowIndex (same as Excel preview).
        docs.sort((a, b) => (a.rowIndex ?? 0) - (b.rowIndex ?? 0));

        const drawItems = docs.map(({ rowIndex, ...rest }) => rest as DrawItem);
        setItems(drawItems);
        const count2Slot = drawItems.filter((d) => (d.slotsWanted ?? 1) >= 2).length;
        const { pairPool: pairs, singlePool: singles } = buildAssignmentPools(count2Slot);
        setPairPool(pairs);
        setSinglePool(singles);
      })
      .catch((err: unknown) => {
        const msg = err && typeof err === "object" && "message" in err ? String((err as { message: string }).message) : "Failed to load data.";
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (status !== "running") return;
    if (!items.length) return;
    if (currentIndex >= items.length) {
      setStatus("completed");
      return;
    }

    const timer = setTimeout(async () => {
      const current = items[currentIndex];
      const slotsWanted = current.slotsWanted ?? 1;
      let labels: string[];
      if (slotsWanted >= 2 && nextPairIndex < pairPool.length) {
        labels = pairPool[nextPairIndex]!;
        setNextPairIndex((prev) => prev + 1);
      } else if (nextSingleIndex < singlePool.length) {
        labels = [singlePool[nextSingleIndex]!];
        setNextSingleIndex((prev) => prev + 1);
      } else {
        labels = [];
      }
      const result: DrawItem = {
        ...current,
        result: "ALLOTTED",
        slotsGranted: labels.length,
        slotNumber: labels.join(", ")
      };

      setHistory((prev) => [...prev, result]);

      // If this was the last flat, persist full results and lock.
      if (currentIndex + 1 === items.length && !resultsSaved && db) {
        try {
          const allResults = [...history, result];
          const batch = writeBatch(db);
          const colRef = collection(db, "parking_results");
          allResults.forEach((r) => {
            const ref = doc(colRef, r.id);
            batch.set(ref, {
              flatNo: r.flatNumber,
              ownerName: r.displayName,
              slotsWanted: r.slotsWanted ?? 1,
              slotsGranted: r.slotsGranted ?? (r.slotNumber ? String(r.slotNumber).split(",").length : 0),
              slotNumbers: r.slotNumber ?? "",
              createdAt: new Date().toISOString(),
            });
          });
          await batch.commit();
          setResultsSaved(true);
        } catch (e) {
          console.error("Failed to save lottery results:", e);
        }
      }

      setCurrentIndex((prev) => prev + 1);
    }, 5000);

    return () => clearTimeout(timer);
  }, [status, currentIndex, items, nextPairIndex, nextSingleIndex, pairPool, singlePool, history, resultsSaved]);

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
            Society Parking Lottery {resultsLocked ? "(Results Locked)" : ""}
          </p>

          {status === "completed" ? (
            <>
              <p className="text-lg font-medium text-slate-600 dark:text-slate-300 sm:text-xl lg:text-2xl xl:text-3xl">
                Lottery completed
              </p>
              <p className="mt-4 text-4xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400 sm:text-5xl lg:text-6xl xl:text-7xl">
                All results have been saved
              </p>
              <p className="mt-6 max-w-md text-base text-slate-600 dark:text-slate-300 sm:text-lg">
                You can download the results from the admin dashboard.
              </p>
            </>
          ) : current ? (
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
              </div>
            </>
          ) : (
            <>
              <p className="text-xl font-medium text-slate-600 dark:text-slate-300 sm:text-2xl lg:text-3xl">
                Lottery not started yet
              </p>
              <p className="mt-4 text-base text-slate-500 dark:text-slate-400 sm:text-lg lg:text-xl">
                When you start, the system will automatically cycle through all
                flats exactly once and allot shuffled parking slots.
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
                Once results are saved, the lottery is locked and cannot be run again.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
              {status === "not-started" && !resultsLocked && (
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
                  Draw completed
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
              Recent flats
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
                      <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-300">
                        Allotted
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
        <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-3">
          {status === "not-started" && (
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-700 hover:shadow-xl dark:bg-emerald-500"
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
              className="flex items-center gap-2 rounded-lg bg-amber-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-amber-700 hover:shadow-xl dark:bg-amber-500"
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
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-700 hover:shadow-xl dark:bg-emerald-500"
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
            className="rounded-lg bg-slate-600/90 px-5 py-3 text-sm font-semibold text-white shadow-lg backdrop-blur-sm transition hover:bg-slate-700/90 hover:shadow-xl dark:bg-slate-700/90 dark:hover:bg-slate-800/90"
          >
            Exit Fullscreen
          </button>
        </div>
      )}
    </div>
  );
}


