"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { posts as initialPosts, TabKey } from "@/lib/posts";

export default function PostsPage() {
  const [selectedCategory, setSelectedCategory] = useState<TabKey>("all");
  const [posts, setPosts] = useState(initialPosts);

  // 컴포넌트 마운트 시 localStorage에서 데이터 불러오기
  useEffect(() => {
    try {
      const storedPosts = localStorage.getItem("posts");
      if (storedPosts) {
        setPosts(JSON.parse(storedPosts));
      } else {
        // localStorage에 초기 데이터가 없으면 저장
        localStorage.setItem("posts", JSON.stringify(initialPosts));
      }
    } catch (error) {
      console.error("localStorage 불러오기 오류:", error);
      setPosts(initialPosts);
    }
  }, []);

  const tabs: { key: TabKey; label: string }[] = [
    { key: "all", label: "전체보기" },
    { key: "goal", label: "목표" },
    { key: "study", label: "수업일지" },
    { key: "project", label: "프로젝트" },
  ];

  const filteredPosts = selectedCategory === "all" 
    ? posts 
    : posts.filter((post) => post.category === selectedCategory);

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 md:grid-cols-[1fr_300px] md:px-6">
      <section className="flex min-h-[68vh] flex-col border border-slate-300 bg-white">
        {/* 탭 메뉴 */}
        <div className="border-b border-slate-200 px-4 py-0">
          <ul className="flex gap-0 text-sm">
            {tabs.map((tab) => (
              <li key={tab.key}>
                <button
                  type="button"
                  onClick={() => setSelectedCategory(tab.key)}
                  className={`px-4 py-3 font-medium border-b-2 transition ${
                    selectedCategory === tab.key
                      ? "text-emerald-700 font-bold border-b-2 border-emerald-700"
                      : "text-slate-600 border-b-2 border-transparent hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {filteredPosts.length > 0 ? (
          <ul className="grid grid-cols-1 gap-6 p-4 md:grid-cols-2 md:p-5">
            {filteredPosts.map((post) => (
              <li key={post.id}>
                <Link href={`/posts/${post.id}`}>
                  <article className="flex h-full flex-col gap-2 rounded-lg border border-slate-200 bg-white p-5 shadow transition hover:shadow-lg cursor-pointer">
                    <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                      <span className="font-semibold text-emerald-700">[{post.tag}]</span>
                      <span>{post.date}</span>
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900">{post.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{post.summary}</p>
                    <div className="mt-3 flex items-center justify-end text-xs">
                      <span className="font-medium text-slate-500">작성자: {post.author}</span>
                    </div>
                  </article>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-1 items-center justify-center px-4 py-16 text-center text-sm text-slate-500">
            이 카테고리의 게시글이 없습니다.
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
      </aside>
    </div>
  );
}
