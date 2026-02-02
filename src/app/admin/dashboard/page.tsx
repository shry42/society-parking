"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Application = {
  id: string;
  flatNumber: string;
  tenantName: string;
};

type ResultRow = {
  flatNo: string;
  ownerName: string;
  slotsGranted: number;
  slotNumbers: string;
};

async function downloadResultsCsv() {
  if (!db) return;

  const snap = await getDocs(collection(db, "parking_results"));
  const rows: ResultRow[] = snap.docs.map((d) => {
    const data = d.data() as any;
    return {
      flatNo: String(data.flatNo ?? ""),
      ownerName: String(data.ownerName ?? ""),
      slotsGranted: Number(data.slotsGranted ?? 0),
      slotNumbers: String(data.slotNumbers ?? "")
    };
  });

  if (!rows.length) {
    alert("No lottery results saved yet.");
    return;
  }

  const header = ["Flat Number", "Owner Name", "Slots Allotted", "Parking Slots"];

  const csvRows = rows.map((r) => [
    r.flatNo,
    r.ownerName,
    String(r.slotsGranted),
    r.slotNumbers
  ]);

  const csv = [header, ...csvRows]
    .map((row) =>
      row
        .map((cell) => {
          const value = cell.replace(/"/g, '""');
          return `"${value}"`;
        })
        .join(",")
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "parking-lottery-results.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function AdminDashboardPage() {
  const [locked, setLocked] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    if (!db) return;
    getDocs(collection(db, "parking_master"))
      .then((snap) => {
        const rows: Application[] = snap.docs.map((d, idx) => {
          const data = d.data() as any;
          const flatNumber = String(data.flatNo ?? `#${idx + 1}`).trim();
          const tenantName = String(data.flatOwnersNameSoleFirstName ?? "Unknown").trim();
          const rowIndex = Number(data._rowIndex ?? 0);
          return { id: d.id, flatNumber, tenantName, rowIndex } as any;
        });
        rows.sort((a: any, b: any) => (a.rowIndex ?? 0) - (b.rowIndex ?? 0));
        setApplications(rows.map(({ rowIndex, ...rest }: any) => rest as Application));
      })
      .catch((err) => {
        console.error("Failed to load applications:", err);
      });
  }, []);

  const stats = useMemo(
    () => ({
      totalApplications: applications.length,
      totalSlots: 205
    }),
    [applications.length]
  );

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3">
        <div className="mb-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Link href="/admin" className="hover:text-slate-700 dark:hover:text-slate-300">
            Admin Portal
          </Link>
          <span>/</span>
          <span className="text-slate-700 dark:text-slate-300">Dashboard</span>
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Review applications and control the live lottery draw.
          </p>
        </div>
      </div>

      <section className="grid gap-3 sm:gap-4 md:grid-cols-2">
        <div className="card p-3 sm:p-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Total applications
          </p>
          <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-50 sm:text-2xl">
            {stats.totalApplications}
          </p>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            199 members (6 have 2 parking slots).
          </p>
        </div>

        <div className="card p-3 sm:p-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Parking slots
          </p>
          <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-50 sm:text-2xl">
            {stats.totalSlots}
          </p>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Total of 205 parking slots available for the society.
          </p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.4fr,1fr]">
        <div className="card p-3 sm:p-4">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              Society members
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm"
                onClick={() => {
                  void downloadResultsCsv();
                }}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download CSV
              </button>
              <span className="badge text-[10px] sm:text-xs">
                {locked ? "Applications locked" : "Accepting applications"}
              </span>
            </div>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800/90 dark:bg-slate-950/60">
            <table className="min-w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-100 text-[11px] uppercase tracking-wide text-slate-500 dark:bg-slate-900/80 dark:text-slate-400">
                <tr>
                  <th className="px-2 py-2 sm:px-3 sm:py-2.5">Sr No</th>
                  <th className="px-2 py-2 sm:px-3 sm:py-2.5">Flat</th>
                  <th className="px-2 py-2 sm:px-3 sm:py-2.5">Tenant</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, index) => (
                  <tr
                    key={app.id}
                    className="border-t border-slate-200 hover:bg-slate-100 dark:border-slate-800/80 dark:hover:bg-slate-900/60"
                  >
                    <td className="px-2 py-2 text-slate-600 dark:text-slate-300 sm:px-3 sm:py-2.5">
                      {index + 1}
                    </td>
                    <td className="px-2 py-2 font-medium text-slate-900 dark:text-slate-100 sm:px-3 sm:py-2.5">
                      {app.flatNumber}
                    </td>
                    <td className="px-2 py-2 text-slate-700 dark:text-slate-300 sm:px-3 sm:py-2.5">
                      {app.tenantName}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            Showing real member data. Vehicle numbers are not displayed.
          </p>
        </div>

        <div className="space-y-4">
          <div className="card p-3 sm:p-4">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              Application lock
            </h2>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              Before starting the lottery, lock all applications so no one can
              add or change entries.
            </p>
            <button
              type="button"
              className={`mt-3 w-full rounded-full px-4 py-2 text-xs font-semibold transition ${
                locked
                  ? "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  : "bg-amber-500 text-slate-950"
              }`}
              onClick={() => setLocked((prev) => !prev)}
            >
              {locked ? "Unlock applications" : "Lock applications"}
            </button>
            <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
              In the real system, locking is irreversible once the lottery
              starts.
            </p>
          </div>

          <div className="card p-3 sm:p-4">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              Lottery draw
            </h2>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              Run the live, animated draw on a big screen. Each flat appears
              once in random order with its result.
            </p>
            <div className="mt-3 flex flex-col gap-2">
              <Link
                href="/admin/lottery"
                className="btn-primary flex w-full items-center justify-center gap-2 text-sm px-6 py-3"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Open Live Lottery Screen
              </Link>
              <button
                type="button"
                onClick={() => {
                  const popup = window.open(
                    "/admin/lottery",
                    "lotteryScreen",
                    "width=1920,height=1080,menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=no"
                  );
                  if (popup) {
                    popup.focus();
                  }
                }}
                className="btn-secondary flex w-full items-center justify-center gap-2 text-sm px-6 py-3"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Open in Popup Window
              </button>
            </div>
            <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
              Use popup window for separate display screen. Includes pause / resume controls and ensures no repetition or
              skipping of flats.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}


