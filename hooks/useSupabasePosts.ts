"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getFriendlyErrorMessage } from "@/lib/errors";
import { formatAuthorName, type TabKey } from "@/lib/posts";

type ListPost = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
  category: Exclude<TabKey, "all">;
  author_name: string;
  like_count: number;
  view_count: number;
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
    like_count: 0,
    view_count: 0,
  };
}

function buildCountMap(rows: Array<{ post_id: string }>): Record<string, number> {
  return rows.reduce<Record<string, number>>((accumulator, row) => {
    accumulator[row.post_id] = (accumulator[row.post_id] ?? 0) + 1;
    return accumulator;
  }, {});
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
          .select("*, profiles!posts_user_id_fkey(username)")
          .order("created_at", { ascending: false });

        if (controller.signal.aborted) {
          return;
        }

        if (fetchError) {
          throw fetchError;
        }

        const [{ data: likeRows, error: likeError }, { data: viewRows, error: viewError }] = await Promise.all([
          supabase.from("likes").select("post_id"),
          supabase.from("post_views").select("post_id"),
        ]);

        if (likeError) {
          throw likeError;
        }

        if (viewError) {
          throw viewError;
        }

        const likeCountByPostId = buildCountMap((likeRows ?? []) as Array<{ post_id: string }>);
        const viewCountByPostId = buildCountMap((viewRows ?? []) as Array<{ post_id: string }>);

        setPosts(
          (data ?? []).map((row) => {
            const post = mapRowToPost(row as SupabasePostRow);

            return {
              ...post,
              like_count: likeCountByPostId[post.id] ?? 0,
              view_count: viewCountByPostId[post.id] ?? 0,
            };
          })
        );
      } catch (fetchError) {
        if (controller.signal.aborted) {
          return;
        }

        setError(getFriendlyErrorMessage(fetchError));
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