import Link from "next/link";

export default function HomePage() {
  return (
    <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1.4fr,1fr]">
      <section className="card relative overflow-hidden p-6 sm:p-8 md:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.26),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(248,250,252,0.05),_transparent_55%)] dark:bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.26),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(248,250,252,0.05),_transparent_55%)]" />
        <div className="relative space-y-4 sm:space-y-6">
          <p className="badge mb-2 w-max bg-slate-100 text-xs font-semibold text-primary-600 ring-primary-500/40 dark:bg-slate-900/90 dark:text-primary-200">
            One-time, transparent parking lottery
          </p>
          <h1 className="text-balance text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-3xl md:text-4xl lg:text-5xl">
            Parking Lottery Portal for Your Housing Society
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
            Tenants apply once. Society runs a single, live lottery event that
            fairly distributes limited car parking slots. Results are locked
            forever after the draw – no edits, no confusion.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-4">
            <Link href="/tenant" className="group btn-primary flex items-center justify-center gap-2 w-full sm:w-auto text-base px-6 py-3">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              I&apos;m a Tenant
              <svg className="h-4 w-4 transition group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link href="/admin" className="group btn-secondary flex items-center justify-center gap-2 w-full sm:w-auto text-base px-6 py-3">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              I&apos;m the Society / Admin
              <svg className="h-4 w-4 transition group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="mt-4 grid gap-3 text-xs sm:mt-6 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800/80 dark:bg-slate-900/60">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Fair allocation
              </p>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-100">
                Every valid tenant application enters the same lottery pool.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800/80 dark:bg-slate-900/60">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Fixed slots handled
              </p>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-100">
                Pre-assigned slots for special flats, shown like normal results.
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800/80 dark:bg-slate-900/60">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Results locked
              </p>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-100">
                One-time execution. Lottery cannot be run again or edited.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="card p-4 sm:p-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400 sm:text-sm">
            How it works
          </h2>
          <ol className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <li>
              <span className="font-semibold text-primary-600 dark:text-primary-200">1.</span> Each
              tenant applies once with flat, name and vehicle number. No
              duplicates allowed.
            </li>
            <li>
              <span className="font-semibold text-primary-600 dark:text-primary-200">2.</span> Admin
              reviews entries, configures up to 10 fixed slots, and locks
              applications.
            </li>
            <li>
              <span className="font-semibold text-primary-600 dark:text-primary-200">3.</span> During
              the live event, flats appear one-by-one on screen with animated
              lottery-style results.
            </li>
            <li>
              <span className="font-semibold text-primary-600 dark:text-primary-200">4.</span> Once
              completed, results are frozen. Tenants can later check their
              status online.
            </li>
          </ol>
        </div>

        <div className="card p-4 text-xs text-slate-600 dark:text-slate-300 sm:p-6">
          <h3 className="mb-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
            System highlights
          </h3>
          <ul className="list-inside list-disc space-y-1">
            <li>205 total parking slots, ~350 applicants supported.</li>
            <li>
              Admin-only dashboard for applications, fixed parking, and the live
              draw.
            </li>
            <li>
              Pause/resume controls for the draw – no skipping or repeating
              flats.
            </li>
            <li>Export-ready results for notice boards and records.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}


