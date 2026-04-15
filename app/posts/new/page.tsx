"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { TabKey } from "@/lib/posts";

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

export default function NewPostPage() {
  const router = useRouter();
  const [newPostCategory, setNewPostCategory] = useState<Exclude<TabKey, "all">>("goal");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostTag, setNewPostTag] = useState("");
  const [content, setContent] = useState("");

  const tabs: { key: TabKey; label: string }[] = [
    { key: "all", label: "전체글" },
    { key: "goal", label: "목표" },
    { key: "study", label: "수업일지" },
    { key: "project", label: "프로젝트" },
  ];

  const categoryTabs: { key: Exclude<TabKey, "all">; label: string }[] = tabs.filter(
    (tab): tab is { key: Exclude<TabKey, "all">; label: string } => tab.key !== "all"
  );

  const handleSavePost = () => {
    if (!newPostTitle.trim()) {
      toast.error("제목을 입력해주세요");
      return;
    }

    toast.success("저장되었습니다!");
    router.push("/posts");
  };

  const handleCancelWrite = () => {
    router.push("/posts");
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-6">
      <div className="rounded-lg border border-slate-300 bg-white p-6 md:p-8 dark:border-slate-700 dark:bg-slate-800">
        <h1 className="mb-6 text-2xl font-bold text-slate-900 dark:text-slate-100">새 글 쓰기</h1>

        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            handleSavePost();
          }}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm text-slate-700 dark:text-slate-300">
              카테고리
              <select
                value={newPostCategory}
                onChange={(event) => setNewPostCategory(event.target.value as Exclude<TabKey, "all">)}
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
                value={newPostTag}
                onChange={(event) => setNewPostTag(event.target.value)}
                placeholder="예: 목표"
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              />
            </label>
          </div>

          <label className="flex flex-col gap-2 text-sm text-slate-700 dark:text-slate-300">
            제목
            <input
              type="text"
              value={newPostTitle}
              onChange={(event) => setNewPostTitle(event.target.value)}
              placeholder="게시글 제목을 입력하세요"
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            />
          </label>

          <div className="flex flex-col gap-2 text-sm text-slate-700 dark:text-slate-300">
            <p>요약/내용</p>
            <div className="prose max-w-none rounded-md border border-slate-300 bg-white dark:prose-invert dark:border-slate-600 dark:bg-slate-900">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                modules={modules}
                placeholder="내용을 입력하세요"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={handleCancelWrite}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              취소
            </button>
            <button
              type="submit"
              className="rounded-md border border-emerald-700 bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
