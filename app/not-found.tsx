import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-4xl items-center justify-center px-4 py-12 md:px-6">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800 md:p-8">
        <p className="text-sm font-semibold text-rose-600">페이지를 찾을 수 없음</p>
        <h1 className="mt-3 text-2xl font-bold text-slate-900 dark:text-slate-100">존재하지 않는 게시글입니다</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
          요청하신 페이지를 찾을 수 없습니다. 주소를 확인하거나 홈으로 돌아가 주세요.
        </p>

        <div className="mt-6 flex justify-center">
          <Link href="/" className="inline-flex items-center rounded-md border border-emerald-700 bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800">
            홈으로 돌아가기
          </Link>
        </div>
      </section>
    </main>
  );
}
