export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 md:px-6">
      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 md:p-8">
        <div className="mb-5 flex items-center justify-between text-sm">
          <div className="h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-4 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        </div>

        <div className="space-y-4">
          <div className="h-10 w-4/5 animate-pulse rounded bg-slate-200 dark:bg-slate-700 md:h-12" />
          <div className="border-b border-slate-200 pb-4 dark:border-slate-700">
            <div className="h-4 w-44 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          </div>

          <div className="space-y-3">
            <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-4 w-11/12 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-4 w-10/12 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-4 w-9/12 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>
      </article>
    </div>
  );
}