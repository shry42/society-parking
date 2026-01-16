import Link from "next/link";

export default function TenantLandingPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-2xl">
          Tenant Portal
        </h1>
        <Link href="/" className="text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200">
          ← Back to home
        </Link>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-300">
        Apply once for a car parking slot and later check your lottery result
        using your flat number. Duplicate applications for the same flat or
        vehicle are not allowed.
      </p>

      <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
        <Link href="/tenant/apply" className="card group relative overflow-hidden p-6 sm:p-8 transition hover:shadow-xl hover:scale-[1.02]">
          <div className="absolute right-0 top-0 -mr-4 -mt-4 h-24 w-24 rounded-full bg-primary-600/10 blur-2xl" />
          <div className="relative z-10">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600/20 text-primary-600 ring-2 ring-primary-500/40 dark:text-primary-300">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              Submit Application
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Provide your flat number, name, and vehicle number to enter the
              lottery pool.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-300">
              Start application
              <svg className="h-4 w-4 transition group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>

        <Link href="/tenant/result" className="card group relative overflow-hidden p-6 sm:p-8 transition hover:shadow-xl hover:scale-[1.02]">
          <div className="absolute right-0 top-0 -mr-4 -mt-4 h-24 w-24 rounded-full bg-emerald-500/10 blur-2xl" />
          <div className="relative z-10">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 ring-2 ring-emerald-400/40 dark:text-emerald-300">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              Check Lottery Result
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              After the live lottery is completed, view whether parking is
              allotted or not allotted for your flat.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-300">
              Check status
              <svg className="h-4 w-4 transition group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>
      </div>

      <div className="card border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 dark:border-slate-800/80 dark:bg-slate-950/60 dark:text-slate-300">
        <p className="font-semibold text-slate-900 dark:text-slate-100">Important:</p>
        <ul className="mt-1 list-inside list-disc space-y-1">
          <li>
            Each flat can submit{" "}
            <span className="font-semibold">only one application</span>.
          </li>
          <li>
            The same vehicle number{" "}
            <span className="font-semibold">cannot be used twice</span> across
            different flats.
          </li>
          <li>
            Once the lottery is completed, results are{" "}
            <span className="font-semibold">permanently locked</span>.
          </li>
        </ul>
      </div>
    </div>
  );
}


