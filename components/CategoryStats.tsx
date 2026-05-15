"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getCategoryLabel } from "@/lib/posts";
import type { TabKey } from "@/lib/posts";

type CategoryCount = {
  category: TabKey | "all";
  label: string;
  count: number;
};

export default function CategoryStats() {
  const [categoryCounts, setCategoryCounts] = useState<CategoryCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryCounts = async () => {
      try {
        const supabase = createClient();

        // 모든 글 조회 (카테고리별)
        const { data: posts, error } = await supabase
          .from("posts")
          .select("category");

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
        console.error("카테고리 통계 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryCounts();
  }, []);

  return (
    <section className="border border-slate-300 bg-yellow-50 dark:border-slate-700 dark:bg-slate-800">
      <h3 className="border-b border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900 dark:border-slate-700 dark:text-slate-100">
        카테고리 통계
      </h3>
      <div className="px-4 py-4">
        {loading ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            로딩 중...
          </p>
        ) : (
          <div className="space-y-2">
            {categoryCounts.map((item) => (
              <div
                key={item.category}
                className="flex items-center justify-between rounded bg-white p-2 dark:bg-slate-900"
              >
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {item.label}
                </span>
                <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                  {item.count}개
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
