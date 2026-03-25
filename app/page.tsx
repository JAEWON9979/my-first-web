"use client";

import { useMemo, useState } from "react";

type TabKey = "all" | "goal" | "study" | "project";

type Post = {
  id: number;
  title: string;
  summary: string;
  date: string;
  category: Exclude<TabKey, "all">;
  tag: string;
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  const posts: Post[] = [
    {
      id: 1,
      title: "2026년 자격증 목표",
      summary: "컴활 1급, ADsp(데이터분석준전문가), 사회조사분석사 2급 취득하기",
      date: "~ 2026. 12. 31",
      category: "goal",
      tag: "목표",
    },
    {
      id: 2,
      title: "웹프로그래밍 블로그 생성 및 vercel 배포",
      summary: "copilot chat을 이용한 기본 블로그 생성 및 자기소개.",
      date: "2026.03.25",
      category: "study",
      tag: "수업일지",
    },
    {
      id: 3,
      title: "프로젝트 미진행중",
      summary: "추후 진행 예정",
      date: "~ 2026.12.31",
      category: "project",
      tag: "프로젝트",
    },
  ];

  const filteredPosts = useMemo(() => {
    if (activeTab === "all") {
      return posts;
    }

    return posts.filter((post) => post.category === activeTab);
  }, [activeTab]);

  return (
    <main className="min-h-screen bg-slate-100 pb-10 md:pb-12">
      <header className="border-b border-slate-300 bg-white">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-emerald-700">
              JAEWON BLOG
            </p>
            <h1 className="mt-1 text-xl font-bold text-slate-900 md:text-2xl">
              김재원 개인 블로그
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/JAEWON9979"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              GitHub
            </a>
            <a
              href="mailto:rlawodnjs9979@hs.ac.kr"
              className="border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              rlawodnjs9979@hs.ac.kr
            </a>
          </div>
        </div>
      </header>

      <nav className="border-b border-slate-300 bg-slate-50">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
          <ul className="flex flex-wrap gap-1 py-2 text-sm">
            <li>
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`border px-3 py-2 ${
                  activeTab === "all"
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-transparent text-slate-600 hover:border-slate-300 hover:bg-white"
                }`}
              >
                전체글
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => setActiveTab("goal")}
                className={`border px-3 py-2 ${
                  activeTab === "goal"
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-transparent text-slate-600 hover:border-slate-300 hover:bg-white"
                }`}
              >
                목표
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => setActiveTab("study")}
                className={`border px-3 py-2 ${
                  activeTab === "study"
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-transparent text-slate-600 hover:border-slate-300 hover:bg-white"
                }`}
              >
                수업일지
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => setActiveTab("project")}
                className={`border px-3 py-2 ${
                  activeTab === "project"
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-transparent text-slate-600 hover:border-slate-300 hover:bg-white"
                }`}
              >
                프로젝트
              </button>
            </li>
          </ul>
        </div>
      </nav>

      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 md:grid-cols-[1fr_300px] md:px-6">
        <section className="flex min-h-[68vh] flex-col border border-slate-300 bg-white">
          <div className="border-b border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800">
            {activeTab === "all" ? "전체 게시글" : "선택된 카테고리"}
          </div>

          {filteredPosts.length > 0 ? (
            <ul className="flex-1">
              {filteredPosts.map((post) => (
                <li key={post.id} className="border-b border-slate-200 last:border-b-0">
                  <article className="px-4 py-4 md:px-5">
                    <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                      <span className="font-semibold text-emerald-700">[{post.tag}]</span>
                      <span>{post.date}</span>
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900">{post.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{post.summary}</p>
                  </article>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-1 items-center justify-center px-4 py-16 text-center text-sm text-slate-500">
              선택한 카테고리에 게시글이 없습니다.
            </div>
          )}
        </section>

        <aside className="space-y-4">
          <section className="border border-slate-300 bg-white">
            <h3 className="border-b border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900">
              프로필
            </h3>
            <div className="space-y-1 px-4 py-4 text-sm text-slate-700">
              <p>이름: 김재원</p>
              <p>학교: 한신대학교</p>
              <p>전공: 공공인재빅데이터융합학</p>
              <p>취미: 게임, 독서, 음악듣기</p>
            </div>
          </section>

          <section className="border border-slate-300 bg-white">
            <h3 className="border-b border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900">
              카테고리
            </h3>
            <ul className="px-2 py-2 text-sm text-slate-700">
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTab("goal")}
                  className="flex w-full items-center justify-between px-2 py-2 text-left hover:bg-slate-50"
                >
                  <span>목표</span>
                  <span>1</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTab("study")}
                  className="flex w-full items-center justify-between px-2 py-2 text-left hover:bg-slate-50"
                >
                  <span>수업일지</span>
                  <span>1</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setActiveTab("project")}
                  className="flex w-full items-center justify-between px-2 py-2 text-left hover:bg-slate-50"
                >
                  <span>프로젝트</span>
                  <span>1</span>
                </button>
              </li>
            </ul>
          </section>
        </aside>
      </div>

      <footer className="fixed inset-x-0 bottom-0 z-30 border-t border-zinc-700 bg-black/90 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-2 overflow-x-auto whitespace-nowrap px-4 py-2 text-xs md:px-6">
          <span className="mr-1 font-semibold text-white">바로가기</span>
          <a
            href="https://github.com/JAEWON9979"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-2 py-0.5 font-medium text-white transition hover:-translate-y-0.5 hover:text-zinc-300 hover:underline"
            title="GitHub로 이동"
          >
            GitHub 사이트 이동
          </a>
          <span className="text-zinc-500">|</span>
          <a
            href="mailto:rlawodnjs9979@hs.ac.kr"
            className="inline-flex items-center px-2 py-0.5 font-medium text-white transition hover:-translate-y-0.5 hover:text-zinc-300 hover:underline"
            title="이메일 보내기"
          >
            rlawodnjs9979@hs.ac.kr
          </a>
        </div>
      </footer>
    </main>
  );
}