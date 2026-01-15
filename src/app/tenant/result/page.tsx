"use client";

import { useState } from "react";
import Link from "next/link";

type ResultState =
  | { status: "idle" }
  | { status: "searching" }
  | {
      status: "found";
      allotted: boolean;
      slotNumber?: string;
    }
  | { status: "not-found" };

export default function TenantResultPage() {
  const [flatNumber, setFlatNumber] = useState("");
  const [state, setState] = useState<ResultState>({ status: "idle" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder: will later query Firebase for this flat's final result
    setState({ status: "searching" });
    setTimeout(() => {
      // demo only: fake outcome based on last character
      const trimmed = flatNumber.trim().toUpperCase();
      if (!trimmed) {
        setState({ status: "not-found" });
        return;
      }
      const lastChar = trimmed.at(-1);
      if (lastChar && /\d/.test(lastChar) && Number(lastChar) % 2 === 0) {
        setState({
          status: "found",
          allotted: true,
          slotNumber: `P-${lastChar}1`
        });
      } else {
        setState({ status: "found", allotted: false });
      }
    }, 800);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-2xl">
            Check Parking Lottery Result
          </h1>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            After the live draw is completed and locked, you can view your
            final parking status here.
          </p>
        </div>
        <Link
          href="/tenant"
          className="text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
        >
          ← Tenant portal
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="card p-4 space-y-4 sm:p-6">
        <div className="space-y-1.5">
          <label
            htmlFor="flatNumber"
            className="text-xs font-medium text-slate-700 dark:text-slate-200"
          >
            Flat number
          </label>
          <input
            id="flatNumber"
            required
            maxLength={10}
            placeholder="e.g. A-302"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-primary-500/40 transition focus:border-primary-500 focus:ring-1 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            value={flatNumber}
            onChange={(e) => setFlatNumber(e.target.value.toUpperCase())}
          />
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Exactly as used while submitting the application.
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Note: The lottery is conducted only once. Results cannot be
            changed.
          </p>
          <button
            type="submit"
            disabled={state.status === "searching"}
            className="btn-primary w-full text-xs disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          >
            {state.status === "searching" ? "Checking…" : "View result"}
          </button>
        </div>
      </form>

      {state.status === "found" && (
        <div className="card border-slate-200 bg-slate-50 p-5 text-sm dark:border-slate-800/80 dark:bg-slate-950/50">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
            Final status
          </p>
          {state.allotted ? (
            <>
              <p className="mt-2 text-lg font-semibold text-emerald-600 dark:text-emerald-300">
                Parking Allotted
              </p>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
                Your parking slot number is{" "}
                <span className="font-semibold text-emerald-700 dark:text-emerald-200">
                  {state.slotNumber ?? "TBD"}
                </span>
                .
              </p>
            </>
          ) : (
            <>
              <p className="mt-2 text-lg font-semibold text-rose-600 dark:text-rose-300">
                Not Allotted
              </p>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
                Unfortunately, parking could not be allotted to this flat in
                the lottery.
              </p>
            </>
          )}
        </div>
      )}

      {state.status === "not-found" && (
        <div className="card border-amber-500/30 bg-amber-50 p-4 text-xs text-amber-800 dark:bg-amber-900/10 dark:text-amber-100">
          <p className="font-semibold">No result found for this flat.</p>
          <p className="mt-1 text-amber-700 dark:text-amber-100">
            Please verify your flat number. Results become available only after
            the live lottery is fully completed and locked by the society
            office.
          </p>
        </div>
      )}
    </div>
  );
}


