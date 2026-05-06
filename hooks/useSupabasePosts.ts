"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type ListPost = {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  category: string;
  summary: string;
  tag: string;
};

type SupabasePostRow = {
  id: string;
  title: string;
  content: string;
  category: string | null;
  created_at: string | null;
};

const tagByCategory: Record<string, string> = {
  goal: "목표",
  study: "수업일지",
  project: "프로젝트",
  general: "일반",
};

function formatDate(value: string | null) {
  if (!value) {
    return "";
  }

  return value.slice(0, 10);
}

function mapRowToPost(row: SupabasePostRow): ListPost {
  const category = row.category ?? "general";

  return {
    id: row.id,
    title: row.title,
    content: row.content,
    author: "작성자 미확인",
    date: formatDate(row.created_at),
    category,
    summary: row.content.slice(0, 80),
    tag: tagByCategory[category] ?? "일반",
  };
}

export function useSupabasePosts(initialSearchQuery = "") {
  const [posts, setPosts] = useState<ListPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchPosts() {
      setIsLoading(true);
      setError(null);

      try {
        const supabase = createClient();
        const { data, error: fetchError } = await supabase
          .from("posts")
          .select("id, title, content, category, created_at")
          .order("created_at", { ascending: false });

        if (controller.signal.aborted) {
          return;
        }

        if (fetchError) {
          throw fetchError;
        }

        setPosts((data ?? []).map((row) => mapRowToPost(row as SupabasePostRow)));
      } catch (fetchError) {
        if (controller.signal.aborted) {
          return;
        }

        const message = fetchError instanceof Error ? fetchError.message : "알 수 없는 오류가 발생했습니다.";
        setError(message);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    fetchPosts();

    return () => {
      controller.abort();
    };
  }, []);

  const searchedPosts = useMemo(() => {
    if (!searchQuery.trim()) {
      return posts;
    }

    const lowerQuery = searchQuery.toLowerCase();

    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(lowerQuery) ||
        post.summary.toLowerCase().includes(lowerQuery)
    );
  }, [posts, searchQuery]);

  const deletePost = async (id: string) => {
    const supabase = createClient();
    const { error: deleteError } = await supabase.from("posts").delete().eq("id", id);

    if (deleteError) {
      throw deleteError;
    }

    setPosts((currentPosts) => currentPosts.filter((post) => post.id !== id));
  };

  return {
    posts,
    searchedPosts,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    deletePost,
  };
}