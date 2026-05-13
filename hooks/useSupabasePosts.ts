"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatAuthorName, type TabKey } from "@/lib/posts";

type ListPost = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
  category: Exclude<TabKey, "all">;
  author_name: string;
};

type SupabasePostRow = {
  id: string;
  title: string;
  content: string;
  created_at: string | null;
  user_id: string;
  category: Exclude<TabKey, "all"> | null;
  profiles?: { username: string | null } | null;
};

function formatDate(value: string | null) {
  if (!value) {
    return "";
  }

  return value.slice(0, 10);
}

function mapRowToPost(row: SupabasePostRow): ListPost {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    created_at: formatDate(row.created_at),
    user_id: row.user_id,
    category: row.category ?? "goal",
    author_name: formatAuthorName(row.profiles?.username, row.user_id),
  };
}

export function useSupabasePosts() {
  const [posts, setPosts] = useState<ListPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchPosts() {
      setIsLoading(true);
      setError(null);

      try {
        const supabase = createClient();
        const { data, error: fetchError } = await supabase
          .from("posts")
          .select("*, profiles(username)")
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

  return {
    posts,
    isLoading,
    error,
  };
}