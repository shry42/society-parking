"use client";

import { useState } from "react";
import Link from "next/link";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

type ResultState =
  | { status: "idle" }
  | { status: "searching" }
  | {
      status: "found";
      allotted: boolean;
      slotNumber?: string;
    }
  | { status: "not-found" };

const RESULTS_COLLECTION = "results";

export default function TenantResultPage() {
  const [flatNumber, setFlatNumber] = useState("");
  const [state, setState] = useState<ResultState>({ status: "idle" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = flatNumber.trim().toUpperCase();
    if (!trimmed) {
      setState({ status: "not-found" });
      return;
    }
    setState({ status: "searching" });
    try {
      if (db) {
        const resultsRef = collection(db, RESULTS_COLLECTION);
        const q = query(resultsRef, where("flatNumber", "==", trimmed));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const doc = snap.docs[0];
          const data = doc.data();
          setState({
            status: "found",
            allotted: Boolean(data.allotted),
            slotNumber: data.slotNumber ?? undefined,
          });
          return;
        }
      }
      setState({ status: "not-found" });
    } catch {
      setState({ status: "not-found" });
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3">
        <div className="mb-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <Link href="/tenant" className="hover:text-slate-700 dark:hover:text-slate-300">
            Tenant Portal
          </Link>
          <span>/</span>
          <span className="text-slate-700 dark:text-slate-300">Check Result</span>
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
            Check Parking Lottery Result
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            After the live draw is completed and locked, you can view your
            final parking status here.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-5 sm:p-8">
        <div className="space-y-2">
          <label
            htmlFor="flatNumber"
            className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
          >
            <svg className="h-4 w-4 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Enter your flat number
          </label>
          <input
            id="flatNumber"
            required
            maxLength={10}
            placeholder="e.g. A-302"
            className="w-full rounded-lg border-2 border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none ring-primary-500/40 transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            value={flatNumber}
            onChange={(e) => setFlatNumber(e.target.value.toUpperCase())}
          />
          <p className="flex items-start gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <svg className="mt-0.5 h-3 w-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Enter exactly as used while submitting the application.
          </p>
        </div>

        <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4 dark:border-blue-800/50 dark:bg-blue-900/20">
          <div className="flex gap-3">
            <svg className="h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Note:</strong> The lottery is conducted only once. Results cannot be changed after the draw is completed.
            </p>
          </div>
        </div>

        <button
          type="submit"
          disabled={state.status === "searching"}
          className="btn-primary flex w-full items-center justify-center gap-2 text-base disabled:cursor-not-allowed disabled:opacity-70 sm:w-full px-6 py-3"
        >
          {state.status === "searching" ? (
            <>
              <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Checking…
            </>
          ) : (
            <>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Check Result
            </>
          )}
        </button>
      </form>

      {state.status === "found" && (
        <div className={`card p-8 text-center ${
          state.allotted 
            ? "border-2 border-emerald-500/50 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-900/20" 
            : "border-2 border-rose-500/50 bg-rose-50 dark:border-rose-500/30 dark:bg-rose-900/20"
        }`}>
          {state.allotted ? (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 dark:bg-emerald-500/10">
                <svg className="h-10 w-10 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-300 sm:text-3xl">
                🎉 Parking Allotted!
              </p>
              <p className="mt-3 text-lg font-semibold text-slate-700 dark:text-slate-200">
                Your parking slot number is
              </p>
              <p className="mt-2 text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 sm:text-5xl">
                {state.slotNumber ?? "TBD"}
              </p>
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
                Please contact the society office for further instructions.
              </p>
            </>
          ) : (
            <>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/20 dark:bg-rose-500/10">
                <svg className="h-10 w-10 text-rose-600 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-rose-600 dark:text-rose-300 sm:text-3xl">
                Not Allotted
              </p>
              <p className="mt-3 text-base text-slate-700 dark:text-slate-200">
                Unfortunately, parking could not be allotted to this flat in the lottery.
              </p>
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">
                All 205 parking slots have been allocated. Please contact the society office for alternative arrangements.
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


