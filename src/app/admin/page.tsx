import Link from "next/link";

export default function AdminLandingPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-2xl">
            Society / Admin Portal
          </h1>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            Restricted area for office staff to manage applications, configure
            fixed parking, and run the one-time live lottery.
          </p>
        </div>
        <Link
          href="/"
          className="text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
        >
          ← Back to home
        </Link>
      </div>

      <div className="grid gap-4 sm:gap-5 md:grid-cols-[1.3fr,1fr]">
        <Link href="/admin/login" className="card group p-5 sm:p-6">
          <p className="badge mb-3 text-[11px] uppercase tracking-[0.18em] text-primary-600 dark:text-primary-200">
            Admin access only
          </p>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            Log in to Admin Dashboard
          </h2>
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
            Secure login for authorized committee / office members. From the
            dashboard you can lock applications, set fixed slots and run the
            live draw.
          </p>
          <p className="mt-3 text-[11px] font-medium text-primary-600 dark:text-primary-300">
            Go to login →
          </p>
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


