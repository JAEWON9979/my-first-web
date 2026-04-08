import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-12 px-4 py-10 md:px-6 md:py-16">
      {/* 상단: 환영 인사 구역 */}
      <section className="space-y-6">
        <div>
          <h2 className="mb-4 text-4xl font-bold text-slate-900 dark:text-slate-100 md:text-5xl">
            안녕하세요, 김재원입니다.
          </h2>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-300">
            웹 개발을 공부하며 배운 내용과 일상, 그리고 앞으로의 목표를 기록하는 개인 블로그입니다.
            꾸준히 성장하는 개발자가 되기 위해 노력하고 있습니다.
          </p>
        </div>

        {/* 버튼 그룹 */}
        <div className="flex flex-wrap gap-3">
          <Link
            href="/posts"
            className="inline-block rounded-lg bg-emerald-700 px-6 py-3 font-medium text-white transition hover:bg-emerald-800"
          >
            블로그 글 보기
          </Link>
          <Link
            href="/posts/new"
            className="inline-block rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-900 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            새 글 작성
          </Link>
        </div>
      </section>

      {/* 구분선 */}
      <hr className="border-slate-200 dark:border-slate-700" />

      {/* 하단: 프로필 구역 */}
      <section className="space-y-6">
        <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100">About Me</h3>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* NAME */}
            <div>
              <p className="text-sm text-emerald-700 font-semibold mb-2">NAME</p>
              <p className="text-lg text-slate-900 dark:text-slate-100">김재원</p>
            </div>

            {/* UNIVERSITY */}
            <div>
              <p className="text-sm text-emerald-700 font-semibold mb-2">UNIVERSITY</p>
              <p className="text-lg text-slate-900 dark:text-slate-100">한신대학교</p>
            </div>

            {/* MAJOR */}
            <div>
              <p className="text-sm text-emerald-700 font-semibold mb-2">MAJOR</p>
              <p className="text-lg text-slate-900 dark:text-slate-100">공공인재빅데이터융합학</p>
            </div>

            {/* HOBBIES */}
            <div>
              <p className="text-sm text-emerald-700 font-semibold mb-2">HOBBIES</p>
              <p className="text-lg text-slate-900 dark:text-slate-100">게임, 독서, 음악듣기</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}