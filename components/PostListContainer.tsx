"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import SearchBar from "@/components/SearchBar";
import { TabKey } from "@/lib/posts";
import { usePosts } from "@/hooks/usePosts";

type SortOrder = "newest" | "oldest";

type ViewOptions = {
  selectedCategory: TabKey;
  searchQuery: string;
  sortOrder: SortOrder;
};

function getInitialViewOptions(): ViewOptions {
  const defaults: ViewOptions = {
    selectedCategory: "all",
    searchQuery: "",
    sortOrder: "newest",
  };

  if (typeof window === "undefined") {
    return defaults;
  }

  try {
    const saved = localStorage.getItem("postsViewOptions");
    if (!saved) {
      return defaults;
    }

    const parsed = JSON.parse(saved) as Partial<ViewOptions>;

    return {
      selectedCategory: parsed.selectedCategory ?? defaults.selectedCategory,
      searchQuery: typeof parsed.searchQuery === "string" ? parsed.searchQuery : defaults.searchQuery,
      sortOrder:
        parsed.sortOrder === "newest" || parsed.sortOrder === "oldest"
          ? parsed.sortOrder
          : defaults.sortOrder,
    };
  } catch {
    return defaults;
  }
}

const initialViewOptions = getInitialViewOptions();

export default function PostListContainer() {
  const { searchedPosts, isLoading, error, searchQuery, setSearchQuery, deletePost } = usePosts(
    initialViewOptions.searchQuery
  );
  const [selectedCategory, setSelectedCategory] = useState<TabKey>(initialViewOptions.selectedCategory);
  const [sortOrder, setSortOrder] = useState<SortOrder>(initialViewOptions.sortOrder);

  useEffect(() => {
    localStorage.setItem(
      "postsViewOptions",
      JSON.stringify({ selectedCategory, searchQuery, sortOrder })
    );
  }, [selectedCategory, searchQuery, sortOrder]);

  const tabs: { key: TabKey; label: string }[] = [
    { key: "all", label: "전체보기" },
    { key: "goal", label: "목표" },
    { key: "study", label: "수업일지" },
    { key: "project", label: "프로젝트" },
  ];

  const filteredPosts = useMemo(() => {
    return searchedPosts.filter((post) => {
      const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;

      return matchesCategory;
    });
  }, [searchedPosts, selectedCategory]);

  const sortedPosts = useMemo(() => {
    return [...filteredPosts].sort((a, b) => {
      const aTime = new Date(a.date).getTime();
      const bTime = new Date(b.date).getTime();

      if (sortOrder === "oldest") {
        return aTime - bTime;
      }

      return bTime - aTime;
    });
  }, [filteredPosts, sortOrder]);

  const handleDelete = (id: number) => {
    const shouldDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!shouldDelete) {
      return;
    }

    deletePost(id);
    toast.success("삭제되었습니다");
  };

  return (
    <section className="flex min-h-[68vh] flex-col border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800">
      <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <ul className="flex gap-0 text-sm">
            {tabs.map((tab) => (
              <li key={tab.key}>
                <button
                  type="button"
                  onClick={() => setSelectedCategory(tab.key)}
                  className={`px-4 py-3 font-medium border-b-2 transition ${
                    selectedCategory === tab.key
                      ? "text-emerald-700 font-bold border-b-2 border-emerald-700"
                      : "text-slate-600 border-b-2 border-transparent hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
                  }`}
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>

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
          </div>
        </div>
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
      ) : sortedPosts.length > 0 ? (
        <ul className="grid grid-cols-1 gap-6 p-4 md:grid-cols-2 md:p-5">
          {sortedPosts.map((post) => (
            <li key={post.id}>
              <article className="flex h-full flex-col gap-2 rounded-lg border border-slate-200 bg-white p-5 shadow transition hover:shadow-lg dark:border-slate-700 dark:bg-slate-900">
                <Link href={`/posts/${post.id}`}>
                  <div className="mb-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-semibold text-emerald-700">[{post.tag}]</span>
                    <span>{post.date}</span>
                  </div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{post.title}</h2>
                  <p className="mt-2 break-all line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{post.summary}</p>
                </Link>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => handleDelete(post.id)}
                    className="font-medium text-red-500 transition hover:text-red-700 hover:underline"
                  >
                    삭제
                  </button>
                  <span className="font-medium text-slate-500 dark:text-slate-400">작성자: {post.author}</span>
                </div>
              </article>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-1 items-center justify-center px-4 py-16 text-center text-sm text-slate-500 dark:text-slate-400">
          이 카테고리의 게시글이 없습니다.
        </div>
      )}
    </section>
  );
}