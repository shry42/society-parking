"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const COLLECTION = "parking_master";

const DISPLAY_ORDER = [
  "_rowIndex",
  "srNo",
  "flatNo",
  "flatOwnersNameSoleFirstName",
  "parkingSlotS",
  "firstMobileNo",
  "secondMobileNo",
  "emailId",
  "parkingSlots",
];

function labelForKey(key: string): string {
  const labels: Record<string, string> = {
    _rowIndex: "#",
    srNo: "Sr No",
    flatNo: "Flat No.",
    flatOwnersNameSoleFirstName: "Flat Owner Name",
    parkingSlotS: "Parking Slot/s",
    firstMobileNo: "First Mobile",
    secondMobileNo: "Second Mobile",
    emailId: "Email",
    parkingSlots: "Parking Slots",
  };
  return labels[key] ?? key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
}

const COL_PATTERN = /^col_\d+$/;

function getAllColumns(rows: Record<string, unknown>[]): string[] {
  const set = new Set<string>();
  for (const row of rows) {
    for (const k of Object.keys(row)) {
      if (k !== "_source" && k !== "_sheet" && k !== "id" && !COL_PATTERN.test(k)) set.add(k);
    }
  }
  const rest = Array.from(set).filter((k) => !DISPLAY_ORDER.includes(k));
  rest.sort((a, b) => a.localeCompare(b));
  return [...DISPLAY_ORDER.filter((k) => set.has(k)), ...rest];
}

export default function ExcelSheetPage() {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!db) {
      setError("Firebase is not configured.");
      setLoading(false);
      return;
    }
    getDocs(collection(db, COLLECTION))
      .then((snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Record<string, unknown>));
        data.sort((a, b) => {
          const aIdx = Number(a._rowIndex ?? 0);
          const bIdx = Number(b._rowIndex ?? 0);
          return aIdx - bIdx;
        });
        setRows(data);
      })
      .catch((err) => setError(err?.message ?? "Failed to load data"))
      .finally(() => setLoading(false));
  }, []);

  const columns = rows.length > 0 ? getAllColumns(rows) : [];
  const hasData = rows.length > 0;

  return (
    <div className="mx-auto max-w-full space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-slate-700 dark:hover:text-slate-300">
            Home
          </Link>
          <span>/</span>
          <span className="text-slate-700 dark:text-slate-300">Excel Sheet</span>
        </div>
        <Link
          href="/"
          className="btn-secondary inline-flex w-max items-center gap-2 text-sm"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/80">
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-50 sm:text-xl">
            Parking Master Data (Excel Sheet)
          </h1>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            {hasData
              ? `${rows.length} rows · ${columns.length} columns · Source: parking_master`
              : "Uploaded data from Firebase"}
          </p>
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-2 py-16 text-slate-500 dark:text-slate-400">
            <svg className="h-6 w-6 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Loading…
          </div>
        )}

        {error && (
          <div className="rounded-lg border-2 border-rose-500/50 bg-rose-50 p-4 dark:border-rose-500/30 dark:bg-rose-900/20">
            <p className="text-sm text-rose-800 dark:text-rose-200">{error}</p>
          </div>
        )}

        {!loading && !error && hasData && (
          <div className="overflow-auto max-h-[70vh]">
            <table className="w-full min-w-max border-collapse text-left text-sm">
              <thead className="sticky top-0 z-10 bg-slate-100 dark:bg-slate-800">
                <tr>
                  {columns.map((key) => (
                    <th
                      key={key}
                      className="whitespace-nowrap border-b border-r border-slate-300 px-3 py-2 font-semibold text-slate-700 last:border-r-0 dark:border-slate-600 dark:text-slate-200"
                    >
                      {labelForKey(key)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr
                    key={(row.id as string) ?? idx}
                    className={idx % 2 === 0 ? "bg-white dark:bg-slate-900/50" : "bg-slate-50/80 dark:bg-slate-800/30"}
                  >
                    {columns.map((key) => (
                      <td
                        key={key}
                        className="whitespace-nowrap border-b border-r border-slate-200 px-3 py-2 text-slate-800 last:border-r-0 dark:border-slate-700 dark:text-slate-200"
                      >
                        {row[key] == null ? "" : String(row[key])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && !hasData && (
          <div className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
            No data in parking_master yet. Run the upload script to import the Excel file.
          </div>
        )}
      </div>
    </div>
  );
}
