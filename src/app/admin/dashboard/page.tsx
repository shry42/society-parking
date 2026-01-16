"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Application = {
  id: string;
  flatNumber: string;
  tenantName: string;
  vehicleNumber: string;
  hasFixedSlot?: boolean;
  fixedSlotNumber?: string;
};

const mockApplications: Application[] = [
  {
    id: "1",
    flatNumber: "A-101",
    tenantName: "Kumar Family",
    vehicleNumber: "MH12AB1234"
  },
  {
    id: "2",
    flatNumber: "A-302",
    tenantName: "Shah Family",
    vehicleNumber: "MH12XY9876",
    hasFixedSlot: true,
    fixedSlotNumber: "F-01"
  },
  {
    id: "3",
    flatNumber: "B-204",
    tenantName: "Patel Family",
    vehicleNumber: "MH14CD4567"
  }
];

function downloadCsv(applications: Application[]) {
  const header = [
    "Flat Number",
    "Tenant Name",
    "Vehicle Number",
    "Has Fixed Slot",
    "Fixed Slot Number"
  ];

  const rows = applications.map((a) => [
    a.flatNumber,
    a.tenantName,
    a.vehicleNumber,
    a.hasFixedSlot ? "YES" : "NO",
    a.fixedSlotNumber ?? ""
  ]);

  const csv = [header, ...rows]
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

  const stats = useMemo(
    () => ({
      totalApplications: mockApplications.length,
      fixedSlotsUsed: mockApplications.filter((a) => a.hasFixedSlot).length,
      totalSlots: 205
    }),
    []
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
            Review applications, configure fixed parking, and control the live
            lottery draw.
          </p>
        </div>
      </div>

      <section className="grid gap-3 sm:gap-4 md:grid-cols-3">
        <div className="card p-3 sm:p-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Total applications
          </p>
          <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-50 sm:text-2xl">
            {stats.totalApplications}
          </p>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Approx. 350 tenants expected overall.
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
            Once all 205 are allotted, remaining flats will show &quot;Not
            Allotted&quot;.
          </p>
        </div>

        <div className="card p-3 sm:p-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
            Fixed parking
          </p>
          <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-50 sm:text-2xl">
            {stats.fixedSlotsUsed} / 10
          </p>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Pre-assigned slots decided by the society but shown like normal
            lottery results.
          </p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.4fr,1fr]">
        <div className="card p-3 sm:p-4">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
              Applications (sample data)
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm"
                onClick={() => downloadCsv(mockApplications)}
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
                  <th className="px-2 py-2 sm:px-3 sm:py-2.5">Flat</th>
                  <th className="px-2 py-2 sm:px-3 sm:py-2.5">Tenant</th>
                  <th className="px-2 py-2 sm:px-3 sm:py-2.5">Vehicle</th>
                  <th className="px-2 py-2 text-right sm:px-3 sm:py-2.5">Fixed slot</th>
                </tr>
              </thead>
              <tbody>
                {mockApplications.map((app) => (
                  <tr
                    key={app.id}
                    className="border-t border-slate-200 hover:bg-slate-100 dark:border-slate-800/80 dark:hover:bg-slate-900/60"
                  >
                    <td className="px-2 py-2 font-medium text-slate-900 dark:text-slate-100 sm:px-3 sm:py-2.5">
                      {app.flatNumber}
                    </td>
                    <td className="px-2 py-2 text-slate-700 dark:text-slate-300 sm:px-3 sm:py-2.5">
                      {app.tenantName}
                    </td>
                    <td className="px-2 py-2 text-slate-600 dark:text-slate-300 sm:px-3 sm:py-2.5">
                      {app.vehicleNumber}
                    </td>
                    <td className="px-2 py-2 text-right sm:px-3 sm:py-2.5">
                      {app.hasFixedSlot ? (
                        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 ring-1 ring-emerald-500/40 dark:text-emerald-300">
                          {app.fixedSlotNumber}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          Normal lottery
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
            In production this table will show live data from the tenant
            application system and enforce no duplicate flats or vehicles.
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
              {locked ? "Unlock applications (demo only)" : "Lock applications"}
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
            <Link
              href="/admin/lottery"
              className="btn-primary mt-3 flex w-full items-center justify-center gap-2 text-sm px-6 py-3"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Open Live Lottery Screen
            </Link>
            <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
              Includes pause / resume controls and ensures no repetition or
              skipping of flats.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}


