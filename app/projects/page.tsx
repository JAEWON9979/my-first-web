import Link from "next/link";

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f2f4f7_0%,#eef4fb_48%,#f8fafc_100%)] px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto w-full max-w-5xl rounded-2xl border border-slate-200/80 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.08)] md:p-8">
        <div className="mb-5 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">프로젝트</h1>
          <Link href="/" className="text-sm text-slate-600 hover:text-slate-900">
            전체글로 돌아가기
          </Link>
        </div>

        <section className="min-h-80 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5" />
      </div>
    </main>
  );
}
