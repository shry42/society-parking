"use client";

import { useState } from "react";
import Link from "next/link";

type FormState = {
  flatNumber: string;
  tenantName: string;
  vehicleNumber: string;
};

export default function TenantApplyPage() {
  const [form, setForm] = useState<FormState>({
    flatNumber: "",
    tenantName: "",
    vehicleNumber: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value.toUpperCase() }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder: will be replaced with Firebase write + duplicate check
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 900);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Link href="/tenant" className="hover:text-slate-700 dark:hover:text-slate-300">
              Tenant Portal
            </Link>
            <span>/</span>
            <span className="text-slate-700 dark:text-slate-300">Application</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
            Parking Lottery Application
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Submit this form once to participate in the society parking lottery.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-6 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-1">
            <label
              htmlFor="flatNumber"
              className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
            >
              <svg className="h-4 w-4 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Flat number <span className="text-rose-500">*</span>
            </label>
            <input
              id="flatNumber"
              name="flatNumber"
              required
              maxLength={10}
              placeholder="e.g. A-302"
              className="w-full rounded-lg border-2 border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none ring-primary-500/40 transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              value={form.flatNumber}
              onChange={handleChange}
            />
            <p className="flex items-start gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <svg className="mt-0.5 h-3 w-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Each flat can apply only once.
            </p>
          </div>

          <div className="space-y-2 sm:col-span-1">
            <label
              htmlFor="tenantName"
              className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
            >
              <svg className="h-4 w-4 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Tenant name <span className="text-rose-500">*</span>
            </label>
            <input
              id="tenantName"
              name="tenantName"
              required
              maxLength={60}
              placeholder="Full name"
              className="w-full rounded-lg border-2 border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none ring-primary-500/40 transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              value={form.tenantName}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  tenantName: e.target.value
                }))
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="vehicleNumber"
            className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200"
          >
            <svg className="h-4 w-4 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Vehicle number <span className="text-rose-500">*</span>
          </label>
          <input
            id="vehicleNumber"
            name="vehicleNumber"
            required
            maxLength={20}
            placeholder="e.g. MH12AB1234"
            className="w-full rounded-lg border-2 border-slate-300 bg-white px-4 py-3 text-base text-slate-900 outline-none ring-primary-500/40 transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            value={form.vehicleNumber}
            onChange={handleChange}
          />
          <p className="flex items-start gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <svg className="mt-0.5 h-3 w-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            The same vehicle number cannot be used for more than one application.
          </p>
        </div>

        <div className="rounded-lg border-2 border-amber-200 bg-amber-50 p-4 dark:border-amber-800/50 dark:bg-amber-900/20">
          <div className="flex gap-3">
            <svg className="h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Important:</strong> By submitting, you confirm that the details are correct and agree that the lottery will be executed only once. Please review all information before submitting.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-end">
          <Link
            href="/tenant"
            className="btn-secondary w-full justify-center sm:w-auto"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary flex items-center justify-center gap-2 w-full disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto text-base px-6 py-3"
          >
            {submitting ? (
              <>
                <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Submitting…
              </>
            ) : (
              <>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Submit Application
              </>
            )}
          </button>
        </div>
      </form>

      {submitted && (
        <div className="card border-emerald-500/30 bg-emerald-50 p-4 text-xs text-emerald-800 dark:bg-emerald-900/10 dark:text-emerald-100">
          <p className="font-semibold">Application received (demo state).</p>
          <p className="mt-1 text-emerald-700 dark:text-emerald-200">
            In the final system this form will save your entry to the society
            parking lottery database, ensuring no duplicate flat or vehicle
            numbers.
          </p>
        </div>
      )}
    </div>
  );
}


