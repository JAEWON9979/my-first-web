"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { TabKey } from "@/lib/posts";

export default function NewPostPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<Exclude<TabKey, "all">>("goal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    if (!user) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle) {
      setErrorMessage("제목을 입력해주세요.");
      return;
    }

    if (!trimmedContent) {
      setErrorMessage("내용을 입력해주세요.");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const supabase = createClient();

      // profiles row가 없으면 posts.user_id 외래키가 깨질 수 있으므로 먼저 보장한다.
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({ id: user.id, username: user.email ?? "" }, { onConflict: "id" });

      if (profileError) {
        throw profileError;
      }

      const { error } = await supabase.from("posts").insert({
        user_id: user.id,
        category,
        title: trimmedTitle,
        content: trimmedContent,
      });

      if (error) {
        throw error;
      }

      router.push("/posts");
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "게시글 저장에 실패했습니다.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 md:px-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 md:p-8">
        <div className="mb-6 border-b border-slate-200 pb-4 dark:border-slate-700">
          <p className="text-sm font-semibold text-emerald-700">새 글 작성</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-slate-100">마크다운 글쓰기</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            제목과 본문을 입력한 뒤 저장하면 posts 테이블에 저장되고 목록으로 이동합니다.
          </p>
        </div>

        {errorMessage ? (
          <div className="mb-6 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">
            {errorMessage}
          </div>
        ) : null}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              제목
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="게시글 제목을 입력하세요"
              autoComplete="off"
              disabled={isSubmitting || isLoading}
              className="h-12 rounded-lg border-slate-300 bg-white px-4 text-base text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              카테고리
            </Label>
            <select
              id="category"
              value={category}
              onChange={(event) => setCategory(event.target.value as Exclude<TabKey, "all">)}
              disabled={isSubmitting || isLoading}
              className="h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-base text-slate-900 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            >
              <option value="goal">커뮤니티</option>
              <option value="study">수업일지</option>
              <option value="project">프로젝트</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              본문
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="마크다운 형식으로 본문을 입력하세요"
              disabled={isSubmitting || isLoading}
              className="min-h-[22rem] rounded-lg border-slate-300 bg-white px-4 py-3 text-base leading-7 text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex justify-end border-t border-slate-200 pt-6 dark:border-slate-700">
            <Button type="submit" disabled={isSubmitting || isLoading} className="bg-emerald-700 hover:bg-emerald-800">
              {isSubmitting ? "저장 중..." : "저장"}
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
}
