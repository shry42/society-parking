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
        Member data is maintained by the society. After the lottery is run,
        check your parking result using your flat number.
      </p>

      <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
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
            Member list is maintained by the society; tenants do not submit applications.
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


