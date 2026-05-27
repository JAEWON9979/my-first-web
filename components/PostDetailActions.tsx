"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { getFriendlyErrorMessage } from "@/lib/errors";
import { TabKey } from "@/lib/posts";
import { validatePost } from "@/lib/utils/validation";

type PostDetail = {
  id: string;
  title: string;
  content: string;
  user_id: string;
  category: Exclude<TabKey, "all">;
};

type PostDetailActionsProps = {
  post: PostDetail;
};

export default function PostDetailActions({ post }: PostDetailActionsProps) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [category, setCategory] = useState<Exclude<TabKey, "all">>(post.category);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ title: string; content: string }>({
    title: "",
    content: "",
  });
  const [submitMessage, setSubmitMessage] = useState("");

  // UI를 숨기는 것은 편의상 제어일 뿐이며, 실제 보안은 Ch11의 RLS로 적용한다.
  const canManagePost = !isLoading && user?.id === post.user_id;

  const handleDelete = async () => {
    if (!canManagePost) {
      return;
    }

    const shouldDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!shouldDelete) {
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const supabase = createClient();
      const { error } = await supabase.from("posts").delete().eq("id", post.id);

      if (error) {
        throw error;
      }

      router.push("/posts");
    } catch (deleteError) {
      console.error(deleteError);
      setSubmitMessage(getFriendlyErrorMessage(deleteError));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canManagePost || isSubmitting) {
      return;
    }

    const validation = validatePost({ title, content });
    setFieldErrors(validation.fieldErrors);
    if (!validation.isValid) {
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("posts")
        .update({ title: validation.trimmedTitle, content: validation.trimmedContent, category })
        .eq("id", post.id);

      if (error) {
        throw error;
      }

      router.push("/posts");
    } catch (updateError) {
      console.error(updateError);
      setSubmitMessage(getFriendlyErrorMessage(updateError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-10 border-t border-slate-200 pt-6 dark:border-slate-700">
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href="/posts"
          className="inline-flex items-center rounded-md border border-emerald-700 bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-800"
        >
          ← 블로그 목록으로 돌아가기
        </Link>

        {canManagePost && !isEditing ? (
          <>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              수정
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isSubmitting}
              className="inline-flex items-center rounded-md border border-rose-300 bg-white px-4 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-rose-900 dark:bg-slate-900 dark:text-rose-300 dark:hover:bg-rose-950/30"
            >
              삭제
            </button>
          </>
        ) : null}
      </div>

      {submitMessage ? <p className="mt-4 text-sm text-rose-600 dark:text-rose-300">{submitMessage}</p> : null}

      {canManagePost && isEditing ? (
        <form className="mt-6 space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-900/40" onSubmit={handleUpdate}>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">카테고리</label>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value as Exclude<TabKey, "all">)}
              disabled={isSubmitting}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="goal">목표</option>
              <option value="study">수업일지</option>
              <option value="project">프로젝트</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">제목</label>
            <input
              type="text"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                if (fieldErrors.title) {
                  setFieldErrors((previous) => ({ ...previous, title: "" }));
                }
                if (submitMessage) {
                  setSubmitMessage("");
                }
              }}
              disabled={isSubmitting}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            />
            {fieldErrors.title ? <p className="text-sm text-rose-600 dark:text-rose-300">{fieldErrors.title}</p> : null}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">내용</label>
            <textarea
              value={content}
              onChange={(event) => {
                setContent(event.target.value);
                if (fieldErrors.content) {
                  setFieldErrors((previous) => ({ ...previous, content: "" }));
                }
                if (submitMessage) {
                  setSubmitMessage("");
                }
              }}
              disabled={isSubmitting}
              className="min-h-56 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm leading-7 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            />
            {fieldErrors.content ? <p className="text-sm text-rose-600 dark:text-rose-300">{fieldErrors.content}</p> : null}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setFieldErrors({ title: "", content: "" });
                setSubmitMessage("");
              }}
              disabled={isSubmitting}
              className="inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center rounded-md border border-emerald-700 bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "저장 중..." : "저장"}
            </button>
          </div>
        </form>
      ) : null}
    </div>
  );
}