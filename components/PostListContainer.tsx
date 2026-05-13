"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/SearchBar";
import { useSupabasePosts } from "@/hooks/useSupabasePosts";
import { getCategoryLabel, TabKey } from "@/lib/posts";

type SortOrder = "newest" | "oldest";

export default function PostListContainer() {
  const [selectedCategory, setSelectedCategory] = useState<TabKey>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  const { posts, isLoading, error } = useSupabasePosts();

  const tabs: { key: TabKey; label: string }[] = [
    { key: "all", label: "전체보기" },
    { key: "goal", label: "목표" },
    { key: "study", label: "수업일지" },
    { key: "project", label: "프로젝트" },
  ];

  const filteredPosts = useMemo(() => {
    const lowerQuery = searchQuery.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
      const matchesSearch =
        !lowerQuery ||
        post.title.toLowerCase().includes(lowerQuery) ||
        post.content.toLowerCase().includes(lowerQuery);

      return matchesCategory && matchesSearch;
    });
  }, [posts, searchQuery, selectedCategory]);

  const sortedPosts = useMemo(() => {
    return [...filteredPosts].sort((a, b) => {
      const aTime = new Date(a.created_at).getTime();
      const bTime = new Date(b.created_at).getTime();

      return sortOrder === "oldest" ? aTime - bTime : bTime - aTime;
    });
  }, [filteredPosts, sortOrder]);

  return (
    <section className="flex min-h-[68vh] flex-col border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800">
      <div className="border-b border-slate-200 px-4 py-4 dark:border-slate-700">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-emerald-700">Supabase Posts</p>
            <h1 className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">블로그 목록</h1>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value as SortOrder)}
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 outline-none focus:border-emerald-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="newest">최신순</option>
              <option value="oldest">오래된순</option>
            </select>

            <SearchBar initialQuery={searchQuery} onSearch={setSearchQuery} />

            <Link href="/posts/new">
              <Button size="sm" className="h-8 bg-slate-900 px-3 text-white hover:bg-slate-800">
                새 글 쓰기
              </Button>
            </Link>
          </div>
        </div>

        <ul className="mt-4 flex flex-wrap gap-1 text-sm">
          {tabs.map((tab) => (
            <li key={tab.key}>
              <button
                type="button"
                onClick={() => setSelectedCategory(tab.key)}
                className={`rounded-md border px-3 py-1.5 font-medium transition ${
                  selectedCategory === tab.key
                    ? "border-emerald-700 bg-emerald-700 text-white"
                    : "border-transparent text-slate-600 hover:border-slate-300 hover:bg-white dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-900"
                }`}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center px-4 py-16">
          <p className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
            게시글을 불러오는 중...
          </p>
        </div>
      ) : error ? (
        <div className="flex flex-1 items-center justify-center px-4 py-16">
          <p className="rounded-md border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">
            {error}
          </p>
        </div>
      ) : sortedPosts.length === 0 ? (
        <div className="flex min-h-[40vh] flex-1 items-center justify-center px-4 py-16 text-center">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">이 카테고리의 게시글이 없습니다.</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-6 p-4 md:grid-cols-2 md:p-5">
          {sortedPosts.map((post) => (
            <li key={post.id}>
              <Link href={`/posts/${post.id}`} className="block h-full">
                <article className="flex h-full flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-emerald-200 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-emerald-800">
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-emerald-700">[{getCategoryLabel(post.category)}]</span>
                    <span>{post.created_at}</span>
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{post.title}</h2>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    작성자: {post.author_name}
                  </p>
                  <p className="line-clamp-3 break-all text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {post.content}
                  </p>
                </article>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}