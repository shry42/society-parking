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
        <Link href="/tenant/apply" className="card group p-5 sm:p-6">
          <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-600/20 text-primary-600 ring-1 ring-primary-500/40 dark:text-primary-300">
            1
          </div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            Submit Application
          </h2>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
            Provide your flat number, name, and vehicle number to enter the
            lottery pool.
          </p>
          <p className="mt-3 text-[11px] font-medium text-primary-600 dark:text-primary-300">
            Continue →
          </p>
        </Link>

        <Link href="/tenant/result" className="card group p-5 sm:p-6">
          <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-400/40 dark:text-emerald-300">
            2
          </div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            Check Lottery Result
          </h2>
          <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
            After the live lottery is completed, view whether parking is
            allotted or not allotted for your flat.
          </p>
          <p className="mt-3 text-[11px] font-medium text-emerald-600 dark:text-emerald-300">
            Check status →
          </p>
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


