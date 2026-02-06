export default function HomePage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="card max-w-xl text-center p-8 sm:p-10">
        <p className="badge mb-4 w-max mx-auto bg-amber-100 text-xs font-semibold text-amber-700 ring-amber-500/40 dark:bg-amber-900/40 dark:text-amber-200">
          Website under progress
        </p>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          Parking Lottery portal is under construction
        </h1>
        <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300">
          The system is currently being set up and is not yet available for
          public use. Online tenant and admin access has been temporarily
          disabled while we complete the setup.
        </p>
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          Please check back later or contact the project owner / society
          representative for more information.
        </p>
      </div>
    </main>
  );
}


