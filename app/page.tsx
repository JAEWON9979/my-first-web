"use client";

import { useMemo, useState } from "react";

type TabKey = "all" | "goal" | "study" | "project";

type Post = {
  id: number;
  title: string;
  summary: string;
  date: string;
  author: string;
  category: Exclude<TabKey, "all">;
  tag: string;
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isWriting, setIsWriting] = useState(false);

  const tabTitle: Record<TabKey, string> = {
    all: "전체글",
    goal: "목표",
    study: "수업일지",
    project: "프로젝트",
  };

  const tabs: { key: TabKey; label: string }[] = [
    { key: "all", label: "전체글" },
    { key: "goal", label: "목표" },
    { key: "study", label: "수업일지" },
    { key: "project", label: "프로젝트" },
  ];

  const categoryTabs: { key: Exclude<TabKey, "all">; label: string }[] = tabs.filter(
    (tab): tab is { key: Exclude<TabKey, "all">; label: string } => tab.key !== "all"
  );

  const initialPosts: Post[] = [
    {
      id: 1,
      title: "2026년 자격증 목표",
      summary: "미리보기 : 컴활 1급, ADsp(데이터분석준전문가), 사회조사분석사 2급 취득하기",
      date: "~ 2026. 12. 31",
      author: "김재원",
      category: "goal",
      tag: "목표",
    },
    {
      id: 2,
      title: "웹프로그래밍 블로그 생성 및 vercel 배포",
      summary: "미리보기 : copilot chat을 이용한 기본 블로그 생성 및 자기소개.",
      date: "2026.03.25",
      author: "김재원",
      category: "study",
      tag: "수업일지",
    },
    {
      id: 3,
      title: "프로젝트 미진행중",
      summary: "미리보기 : 추후 진행 예정",
      date: "~ 2026.12.31",
      author: "김재원",
      category: "project",
      tag: "프로젝트",
    },
  ];

  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [newPostCategory, setNewPostCategory] = useState<Exclude<TabKey, "all">>("goal");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostTag, setNewPostTag] = useState("");
  const [newPostSummary, setNewPostSummary] = useState("");

  const filteredPosts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesTab = activeTab === "all" || post.category === activeTab;
      const matchesSearch =
        normalizedQuery.length === 0 ||
        post.title.toLowerCase().includes(normalizedQuery) ||
        post.summary.toLowerCase().includes(normalizedQuery);

      return matchesTab && matchesSearch;
    });
  }, [activeTab, posts, searchQuery]);

  const resetWriteForm = () => {
    setNewPostCategory("goal");
    setNewPostTitle("");
    setNewPostTag("");
    setNewPostSummary("");
  };

  const handleSavePost = () => {
    const title = newPostTitle.trim();
    const tag = newPostTag.trim();
    const summary = newPostSummary.trim();

    if (!title || !tag || !summary) {
      return;
    }

    const maxId = posts.reduce((acc, post) => Math.max(acc, post.id), 0);
    const today = new Date();
    const formattedToday = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, "0")}.${String(
      today.getDate()
    ).padStart(2, "0")}`;

    const newPost: Post = {
      id: maxId + 1,
      title,
      summary,
      date: formattedToday,
      author: "김재원",
      category: newPostCategory,
      tag,
    };

    setPosts((prevPosts) => [newPost, ...prevPosts]);
    setActiveTab("all");
    setSearchQuery("");
    resetWriteForm();
    setIsWriting(false);
  };

  const handleCancelWrite = () => {
    resetWriteForm();
    setIsWriting(false);
  };

  const handleDelete = (id: number) => {
    setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
  };

  const getCategoryPostCount = (category: Exclude<TabKey, "all">) => {
    return posts.filter((post) => post.category === category).length;
  };

  return (
    <main className="min-h-screen bg-slate-100 pb-10 md:pb-24">
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
            {tabs.map((tab) => (
              <li key={tab.key}>
                <button
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`border px-3 py-2 ${
                    activeTab === tab.key
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-transparent text-slate-600 hover:border-slate-300 hover:bg-white"
                  }`}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 md:grid-cols-[1fr_300px] md:px-6">
        <section className="flex min-h-[68vh] flex-col border border-slate-300 bg-white">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
            <h2 className="text-sm font-semibold text-slate-800">{tabTitle[activeTab]}</h2>
            <div className="flex w-full max-w-md items-center justify-end gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="게시글 검색"
                aria-label="게시글 검색"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
              <button
                type="button"
                onClick={() => setIsWriting(true)}
                className="shrink-0 rounded-md border border-emerald-700 bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-emerald-800"
              >
                글쓰기
              </button>
            </div>
          </div>

          {isWriting ? (
            <form
              className="space-y-4 p-4 md:p-5"
              onSubmit={(event) => {
                event.preventDefault();
                handleSavePost();
              }}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-sm text-slate-700">
                  카테고리
                  <select
                    value={newPostCategory}
                    onChange={(event) => setNewPostCategory(event.target.value as Exclude<TabKey, "all">)}
                    className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  >
                    {categoryTabs.map((tab) => (
                      <option key={tab.key} value={tab.key}>
                        {tab.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-2 text-sm text-slate-700">
                  태그
                  <input
                    type="text"
                    value={newPostTag}
                    onChange={(event) => setNewPostTag(event.target.value)}
                    placeholder="예: 목표"
                    className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </label>
              </div>

              <label className="flex flex-col gap-2 text-sm text-slate-700">
                제목
                <input
                  type="text"
                  value={newPostTitle}
                  onChange={(event) => setNewPostTitle(event.target.value)}
                  placeholder="게시글 제목을 입력하세요"
                  className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </label>

              <label className="flex flex-col gap-2 text-sm text-slate-700">
                요약/내용
                <textarea
                  value={newPostSummary}
                  onChange={(event) => setNewPostSummary(event.target.value)}
                  placeholder="내용을 입력하세요"
                  rows={6}
                  className="resize-y rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </label>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCancelWrite}
                  className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={!newPostTitle.trim() || !newPostTag.trim() || !newPostSummary.trim()}
                  className="rounded-md border border-emerald-700 bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300"
                >
                  저장
                </button>
              </div>
            </form>
          ) : filteredPosts.length > 0 ? (
            <ul className="grid grid-cols-1 gap-6 p-4 md:grid-cols-2 md:p-5">
              {filteredPosts.map((post) => (
                <li key={post.id}>
                  <article className="flex h-full flex-col gap-2 rounded-lg border border-slate-200 bg-white p-5 shadow transition hover:shadow-lg">
                    <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                      <span className="font-semibold text-emerald-700">[{post.tag}]</span>
                      <span>{post.date}</span>
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900">{post.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{post.summary}</p>
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm("정말 삭제하시겠습니까?")) {
                            handleDelete(post.id);
                          }
                        }}
                        className="text-red-500 hover:text-red-700 hover:underline"
                      >
                        삭제
                      </button>
                      <span className="font-medium text-slate-500">작성자: {post.author}</span>
                    </div>
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
              {categoryTabs.map((tab) => (
                <li key={tab.key}>
                  <button
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className="flex w-full items-center justify-between px-2 py-2 text-left hover:bg-slate-50"
                  >
                    <span>{tab.label}</span>
                    <span>{getCategoryPostCount(tab.key)}</span>
                  </button>
                </li>
              ))}
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