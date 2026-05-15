"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getCategoryLabel } from "@/lib/posts";
import type { TabKey } from "@/lib/posts";

interface AuthorProfileProps {
  authorName: string;
  userId: string;
}

type CategoryCount = {
  category: TabKey | "all";
  label: string;
  count: number;
};

export default function AuthorProfile({
  authorName,
  userId,
}: AuthorProfileProps) {
  const [categoryCounts, setCategoryCounts] = useState<CategoryCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryCounts = async () => {
      try {
        const supabase = createClient();

        // 같은 작성자의 모든 글 조회
        const { data: posts, error } = await supabase
          .from("posts")
          .select("category")
          .eq("user_id", userId);

        if (error) {
          console.error("글 조회 실패:", error);
          setLoading(false);
          return;
        }

        // 카테고리별 개수 계산
        const counts: Record<string, number> = {
          all: posts?.length || 0,
          goal: 0,
          study: 0,
          project: 0,
        };

        posts?.forEach((post) => {
          const category = (post.category as TabKey) || "goal";
          if (category in counts) {
            counts[category]++;
          }
        });

        // 카테고리별 데이터 구성
        const categoryData: CategoryCount[] = [
          { category: "all", label: "전체", count: counts.all },
          {
            category: "goal",
            label: getCategoryLabel("goal"),
            count: counts.goal,
          },
          {
            category: "study",
            label: getCategoryLabel("study"),
            count: counts.study,
          },
          {
            category: "project",
            label: getCategoryLabel("project"),
            count: counts.project,
          },
        ];

        setCategoryCounts(categoryData);
      } catch (error) {
        console.error("작성자 글 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryCounts();
  }, [userId]);

  return (
    <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/50">
      <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
        작성자: {authorName}
      </h3>

      {loading ? (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          카테고리 정보를 불러오는 중...
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {categoryCounts.map((item) => (
            <div
              key={item.category}
              className="rounded bg-white p-2 text-center dark:bg-slate-800"
            >
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {item.label}
              </p>
              <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                {item.count}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
