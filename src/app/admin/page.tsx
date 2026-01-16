import Link from "next/link";

export default function AdminLandingPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl">
            Society / Admin Portal
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Restricted area for office staff to manage applications, configure
            fixed parking, and run the one-time live lottery.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-5 md:grid-cols-[1.3fr,1fr]">
        <Link href="/admin/login" className="card group relative overflow-hidden p-6 sm:p-8 transition hover:shadow-xl hover:scale-[1.02]">
          <div className="absolute right-0 top-0 -mr-4 -mt-4 h-24 w-24 rounded-full bg-primary-600/10 blur-2xl" />
          <div className="relative z-10">
            <p className="badge mb-4 text-xs uppercase tracking-[0.18em] text-primary-600 dark:text-primary-200">
              Admin access only
            </p>
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-600/20 text-primary-600 ring-2 ring-primary-500/40 dark:text-primary-300">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              Log in to Admin Dashboard
            </h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Secure login for authorized committee / office members. From the
              dashboard you can lock applications, set fixed slots and run the
              live draw.
            </p>
            <div className="mt-4">
              <div className="btn-primary inline-flex items-center gap-2">
                Go to login
                <svg className="h-4 w-4 transition group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </Link>

        <div className="card p-5 text-xs text-slate-600 dark:text-slate-300 sm:p-6">
          <h3 className="mb-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
            Admin capabilities
          </h3>
          <ul className="mt-1 list-inside list-disc space-y-1">
            <li>View and validate all tenant applications.</li>
            <li>
              Pre-assign up to 10 fixed parking slots for special flats decided
              by the society.
            </li>
            <li>
              Lock applications before starting the lottery to prevent changes.
            </li>
            <li>
              Run a live, animated lottery with pause and resume controls.
            </li>
            <li>
              Download final results as Excel / CSV for records and notice
              boards.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}


