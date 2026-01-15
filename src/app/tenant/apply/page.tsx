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
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-2xl">
            Parking Lottery Application
          </h1>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Submit this form once to participate in the society parking
            lottery.
          </p>
        </div>
        <Link
          href="/tenant"
          className="text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
        >
          ← Tenant portal
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="card p-4 space-y-4 sm:p-6 sm:space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-1">
            <label
              htmlFor="flatNumber"
              className="text-xs font-medium text-slate-700 dark:text-slate-200"
            >
              Flat number
            </label>
            <input
              id="flatNumber"
              name="flatNumber"
              required
              maxLength={10}
              placeholder="e.g. A-302"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-primary-500/40 transition focus:border-primary-500 focus:ring-1 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              value={form.flatNumber}
              onChange={handleChange}
            />
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Each flat can apply only once.
            </p>
          </div>

          <div className="space-y-1.5 sm:col-span-1">
            <label
              htmlFor="tenantName"
              className="text-xs font-medium text-slate-700 dark:text-slate-200"
            >
              Tenant name
            </label>
            <input
              id="tenantName"
              name="tenantName"
              required
              maxLength={60}
              placeholder="Full name"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-primary-500/40 transition focus:border-primary-500 focus:ring-1 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
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

        <div className="space-y-1.5">
          <label
            htmlFor="vehicleNumber"
            className="text-xs font-medium text-slate-700 dark:text-slate-200"
          >
            Vehicle number
          </label>
          <input
            id="vehicleNumber"
            name="vehicleNumber"
            required
            maxLength={20}
            placeholder="e.g. MH12AB1234"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-primary-500/40 transition focus:border-primary-500 focus:ring-1 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            value={form.vehicleNumber}
            onChange={handleChange}
          />
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            The same vehicle number cannot be used for more than one
            application.
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            By submitting, you confirm that the details are correct and agree
            that the lottery will be executed only once.
          </p>
          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          >
            {submitting ? "Submitting…" : "Submit application"}
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


