export default function Loading() {
  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 md:grid-cols-[1fr_300px] md:px-6">
      <section className="flex min-h-[68vh] flex-col border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="border-b border-slate-200 px-4 py-4 dark:border-slate-700">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-6 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            </div>

            <div className="flex items-center gap-2">
              <div className="h-8 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-8 w-44 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-8 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-1">
            <div className="h-8 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-8 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-8 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-8 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 p-4 md:grid-cols-2 md:p-5">
          {Array.from({ length: 4 }).map((_, index) => (
            <article
              key={index}
              className="flex min-h-[16rem] flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <div className="h-4 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-4 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              </div>
              <div className="h-6 w-4/5 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              <div className="h-4 w-2/5 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              <div className="mt-auto space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-4 w-11/12 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                <div className="h-4 w-4/5 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              </div>
            </article>
          ))}
        </div>
      </section>

      <aside className="space-y-4">
        <section className="border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800">
          <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
            <div className="h-4 w-16 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="space-y-3 px-4 py-4">
            <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          </div>
        </section>

        <section className="border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800">
          <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
            <div className="h-4 w-20 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          </div>
          <div className="space-y-3 px-4 py-4">
            <div className="h-10 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-10 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-10 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          </div>
        </section>
      </aside>
    </div>
  );
}