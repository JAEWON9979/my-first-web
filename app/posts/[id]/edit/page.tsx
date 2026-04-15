"use client";

import dynamic from "next/dynamic";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import "react-quill-new/dist/quill.snow.css";
import { TabKey } from "@/lib/posts";
import { usePosts } from "@/hooks/usePosts";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["link", "blockquote", "code-block"],
    ["clean"],
  ],
};

type Props = {
  params: Promise<{ id: string }>;
};

export default function EditPostPage({ params }: Props) {
  const { id } = use(params);
  const postId = Number(id);
  const router = useRouter();
  const { posts, isLoading, error, updatePost } = usePosts();
  const [editCategory, setEditCategory] = useState<Exclude<TabKey, "all"> | null>(null);
  const [editTitle, setEditTitle] = useState<string | null>(null);
  const [editTag, setEditTag] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string | null>(null);
  const targetPost = posts.find((post) => post.id === postId);

  const tabs: { key: TabKey; label: string }[] = [
    { key: "all", label: "전체글" },
    { key: "goal", label: "목표" },
    { key: "study", label: "수업일지" },
    { key: "project", label: "프로젝트" },
  ];

  const categoryTabs: { key: Exclude<TabKey, "all">; label: string }[] = tabs.filter(
    (tab): tab is { key: Exclude<TabKey, "all">; label: string } => tab.key !== "all"
  );

  const handleUpdate = () => {
    if (!targetPost) {
      return;
    }

    const category = editCategory ?? targetPost.category;
    const title = (editTitle ?? targetPost.title).trim();
    const tag = (editTag ?? targetPost.tag).trim();
    const content = editContent ?? targetPost.content;
    const plainText = content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

    if (!title || !tag || !plainText) {
      toast.error("제목을 입력해주세요");
      return;
    }

    const summary = plainText.slice(0, 80);

    updatePost(postId, {
      title,
      tag,
      summary,
      content,
      category,
    });

    toast.success("저장되었습니다!");
    router.push("/posts");
  };

  const handleCancel = () => {
    router.push(`/posts/${id}`);
  };

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-6">
        <div className="rounded-lg border border-slate-300 bg-white p-6 text-center md:p-8 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-sm text-slate-600 dark:text-slate-300">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-6">
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-6 text-center md:p-8 dark:border-rose-900 dark:bg-rose-950/30">
          <p className="text-sm text-rose-700 dark:text-rose-300">{error}</p>
        </div>
      </div>
    );
  }

  if (!targetPost) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-6">
        <div className="rounded-lg border border-slate-300 bg-white p-6 text-center md:p-8 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-sm text-slate-600 dark:text-slate-300">게시글을 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  const currentCategory = editCategory ?? targetPost.category;
  const currentTitle = editTitle ?? targetPost.title;
  const currentTag = editTag ?? targetPost.tag;
  const currentContent = editContent ?? targetPost.content;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-6">
      <div className="rounded-lg border border-slate-300 bg-white p-6 md:p-8 dark:border-slate-700 dark:bg-slate-800">
        <h1 className="mb-6 text-2xl font-bold text-slate-900 dark:text-slate-100">글 수정하기</h1>

        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            handleUpdate();
          }}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm text-slate-700 dark:text-slate-300">
              카테고리
              <select
                value={currentCategory}
                onChange={(event) => setEditCategory(event.target.value as Exclude<TabKey, "all">)}
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              >
                {categoryTabs.map((tab) => (
                  <option key={tab.key} value={tab.key}>
                    {tab.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm text-slate-700 dark:text-slate-300">
              태그
              <input
                type="text"
                value={currentTag}
                onChange={(event) => setEditTag(event.target.value)}
                placeholder="예: 목표"
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              />
            </label>
          </div>

          <label className="flex flex-col gap-2 text-sm text-slate-700 dark:text-slate-300">
            제목
            <input
              type="text"
              value={currentTitle}
              onChange={(event) => setEditTitle(event.target.value)}
              placeholder="게시글 제목을 입력하세요"
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>

          <div className="flex flex-col gap-2 text-sm text-slate-700 dark:text-slate-300">
            <p>요약/내용</p>
            <div className="prose max-w-none rounded-md border border-slate-300 bg-white dark:prose-invert dark:border-slate-600 dark:bg-slate-900">
              <ReactQuill
                theme="snow"
                value={currentContent}
                onChange={setEditContent}
                modules={modules}
                placeholder="내용을 입력하세요"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              취소
            </button>
            <button
              type="submit"
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
