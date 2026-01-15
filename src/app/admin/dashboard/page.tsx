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
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-2xl">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Review applications, configure fixed parking, and control the live
            lottery draw.
          </p>
        </div>
        <Link
          href="/admin"
          className="text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
        >
          ← Admin portal
        </Link>
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
                className="btn-secondary px-3 py-1.5 text-[11px]"
                onClick={() => downloadCsv(mockApplications)}
              >
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
              className="btn-primary mt-3 w-full justify-center text-xs"
            >
              Open live lottery screen
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


