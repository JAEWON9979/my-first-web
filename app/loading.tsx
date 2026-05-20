export default function Loading() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-4xl items-center justify-center px-4 py-12 md:px-6">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 md:p-8">
        <div className="space-y-4">
          <div className="h-4 w-24 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-8 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
        </div>
      </section>
    </main>
  );
}