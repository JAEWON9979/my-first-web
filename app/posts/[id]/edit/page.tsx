"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Post, TabKey } from "@/lib/posts";

type Props = {
  params: Promise<{ id: string }>;
};

export default function EditPostPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const [editCategory, setEditCategory] = useState<Exclude<TabKey, "all">>("goal");
  const [editTitle, setEditTitle] = useState("");
  const [editTag, setEditTag] = useState("");
  const [editSummary, setEditSummary] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const tabs: { key: TabKey; label: string }[] = [
    { key: "all", label: "전체글" },
    { key: "goal", label: "목표" },
    { key: "study", label: "수업일지" },
    { key: "project", label: "프로젝트" },
  ];

  const categoryTabs: { key: Exclude<TabKey, "all">; label: string }[] = tabs.filter(
    (tab): tab is { key: Exclude<TabKey, "all">; label: string } => tab.key !== "all"
  );

  // 초기값 로드
  useEffect(() => {
    try {
      const storedPostsJson = localStorage.getItem("posts");
      if (storedPostsJson) {
        const allPosts = JSON.parse(storedPostsJson) as Post[];
        const foundPost = allPosts.find((p) => p.id === parseInt(id, 10));
        if (foundPost) {
          setEditCategory(foundPost.category);
          setEditTitle(foundPost.title);
          setEditTag(foundPost.tag);
          setEditSummary(foundPost.summary);
        }
      }
    } catch (error) {
      console.error("게시글 불러오기 오류:", error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  const handleUpdate = () => {
    // 입력값 검증
    const title = editTitle.trim();
    const tag = editTag.trim();
    const summary = editSummary.trim();

    if (!title || !tag || !summary) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    try {
      const storedPostsJson = localStorage.getItem("posts");
      const allPosts = storedPostsJson ? JSON.parse(storedPostsJson) : [];

      // map으로 순회하면서 해당 id의 객체 업데이트
      const updatedPosts = allPosts.map((post: Post) => {
        if (post.id === parseInt(id, 10)) {
          return {
            ...post,
            title,
            tag,
            summary,
            category: editCategory,
          };
        }
        return post;
      });

      // localStorage에 저장
      localStorage.setItem("posts", JSON.stringify(updatedPosts));

      // 성공 알림 후 상세 페이지로 이동
      alert("수정되었습니다");
      router.push(`/posts/${id}`);
    } catch (error) {
      console.error("글 수정 중 오류 발생:", error);
      alert("글 수정 중 오류가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    router.push(`/posts/${id}`);
  };

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-6">
        <div className="rounded-lg border border-slate-300 bg-white p-6 md:p-8 text-center">
          <p className="text-sm text-slate-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-6">
      <div className="rounded-lg border border-slate-300 bg-white p-6 md:p-8">
        <h1 className="mb-6 text-2xl font-bold text-slate-900">글 수정하기</h1>

        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            handleUpdate();
          }}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm text-slate-700">
              카테고리
              <select
                value={editCategory}
                onChange={(event) => setEditCategory(event.target.value as Exclude<TabKey, "all">)}
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
                value={editTag}
                onChange={(event) => setEditTag(event.target.value)}
                placeholder="예: 목표"
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </label>
          </div>

          <label className="flex flex-col gap-2 text-sm text-slate-700">
            제목
            <input
              type="text"
              value={editTitle}
              onChange={(event) => setEditTitle(event.target.value)}
              placeholder="게시글 제목을 입력하세요"
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-slate-700">
            요약/내용
            <textarea
              value={editSummary}
              onChange={(event) => setEditSummary(event.target.value)}
              placeholder="내용을 입력하세요"
              rows={6}
              className="resize-y rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </label>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!editTitle.trim() || !editTag.trim() || !editSummary.trim()}
              className="rounded-md border border-emerald-700 bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300"
            >
              수정 완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
