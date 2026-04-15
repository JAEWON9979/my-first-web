"use client";

import { useEffect, useMemo, useState } from "react";
import { ApiPost, Post, toPost } from "@/lib/posts";

type PostOverrides = Record<number, Partial<Post>>;

const POST_OVERRIDES_KEY = "postOverrides";

function readPostOverrides(): PostOverrides {
  try {
    const stored = localStorage.getItem(POST_OVERRIDES_KEY);
    if (!stored) {
      return {};
    }

    return JSON.parse(stored) as PostOverrides;
  } catch {
    return {};
  }
}

function applyPostOverrides(basePosts: Post[], overrides: PostOverrides): Post[] {
  return basePosts.map((post) => {
    const override = overrides[post.id];
    return override ? { ...post, ...override } : post;
  });
}

function writePostOverride(id: number, overrideData: Partial<Post>) {
  const currentOverrides = readPostOverrides();
  currentOverrides[id] = {
    ...(currentOverrides[id] ?? {}),
    ...overrideData,
  };

  localStorage.setItem(POST_OVERRIDES_KEY, JSON.stringify(currentOverrides));
}

export function usePosts(initialSearchQuery = "") {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchPosts() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=10", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("게시글을 불러오지 못했습니다.");
        }

        const data = (await response.json()) as ApiPost[];
        const mappedPosts = data.map(toPost);
        const overrides = readPostOverrides();
        setPosts(applyPostOverrides(mappedPosts, overrides));
      } catch (fetchError) {
        if (controller.signal.aborted) {
          return;
        }

        const message =
          fetchError instanceof Error
            ? fetchError.message
            : "알 수 없는 오류가 발생했습니다.";
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

  const deletePost = (id: number) => {
    setPosts((currentPosts) => currentPosts.filter((post) => post.id !== id));
  };

  const updatePost = (id: number, updatedData: Partial<Post>) => {
    setPosts((currentPosts) =>
      currentPosts.map((post) => {
        if (post.id !== id) {
          return post;
        }

        return {
          ...post,
          ...updatedData,
        };
      })
    );

    writePostOverride(id, updatedData);
  };

  return {
    posts,
    searchedPosts,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    deletePost,
    updatePost,
  };
}