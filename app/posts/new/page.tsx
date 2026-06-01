"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { getFriendlyErrorMessage } from "@/lib/errors";
import { TabKey } from "@/lib/posts";
import { validateImageSize, validatePost } from "@/lib/utils/validation";
import { uploadPostImageAction } from "@/app/actions/post-interactions";

const ALLOWED_IMAGE_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const ALLOWED_IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp"]);

function getFileExtension(fileName: string): string {
  const split = fileName.toLowerCase().split(".");
  return split.length > 1 ? split[split.length - 1] : "";
}

function validateClientImageFile(file: File): string | null {
  if (!file || file.size <= 0) {
    return "이미지 파일을 선택해주세요.";
  }

  const sizeError = validateImageSize(file);
  if (sizeError) {
    return sizeError;
  }

  const extension = getFileExtension(file.name);
  if (!ALLOWED_IMAGE_EXTENSIONS.has(extension)) {
    return "지원하지 않는 확장자입니다. (jpg, jpeg, png, webp만 허용)";
  }

  if (!ALLOWED_IMAGE_MIME_TYPES.has(file.type)) {
    return "지원하지 않는 파일 형식입니다. (image/jpeg, image/png, image/webp만 허용)";
  }

  return null;
}

export default function NewPostPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<Exclude<TabKey, "all">>("goal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ title: string; content: string }>({
    title: "",
    content: "",
  });
  const [submitMessage, setSubmitMessage] = useState("");
  const [imageMessage, setImageMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isLoading || isSubmitting) {
      return;
    }

    if (!user) {
      alert("로그인이 필요합니다.");
      router.push("/login");
      return;
    }

    const validation = validatePost({ title, content });
    setFieldErrors(validation.fieldErrors);
    if (!validation.isValid) {
      return;
    }

    if (selectedImageFile) {
      const imageValidationError = validateClientImageFile(selectedImageFile);
      if (imageValidationError) {
        setImageMessage(imageValidationError);
        return;
      }
    }

    setSubmitMessage("");
    setIsSubmitting(true);
    setImageMessage("");

    try {
      const supabase = createClient();

      // profiles row가 없으면 posts.user_id 외래키가 깨질 수 있으므로 먼저 보장한다.
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({ id: user.id, username: user.email ?? "" }, { onConflict: "id" });

      if (profileError) {
        throw profileError;
      }

      const { data: createdPost, error } = await supabase
        .from("posts")
        .insert({
          user_id: user.id,
          category,
          title: validation.trimmedTitle,
          content: validation.trimmedContent,
        })
        .select("id")
        .single();

      if (error) {
        throw error;
      }

      if (selectedImageFile && createdPost?.id) {
        const imageResult = await uploadPostImageAction(createdPost.id, selectedImageFile);

        if (!imageResult.success) {
          await supabase.from("posts").delete().eq("id", createdPost.id).eq("user_id", user.id);
          throw new Error(imageResult.error ?? "이미지 업로드에 실패했습니다.");
        }
      }

      router.push("/posts");
    } catch (submitError) {
      console.error(submitError);
      setSubmitMessage(getFriendlyErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-6 md:px-6 md:py-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 md:p-8">
        <div className="mb-6 border-b border-slate-200 pb-4 dark:border-slate-700">
          <p className="text-sm font-semibold text-emerald-700">새 글 작성</p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100 md:text-3xl">마크다운 글쓰기</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            제목과 본문을 입력한 뒤 저장하면 posts 테이블에 저장되고 목록으로 이동합니다.
          </p>
        </div>

        {submitMessage ? (
          <div className="mb-6 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300">
            {submitMessage}
          </div>
        ) : null}

        <form className="space-y-5 md:space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              제목
            </Label>
            <Input
              id="title"
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
              placeholder="게시글 제목을 입력하세요"
              autoComplete="off"
              disabled={isSubmitting || isLoading}
              className="h-12 rounded-lg border-slate-300 bg-white px-4 text-base text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            />
            {fieldErrors.title ? <p className="text-sm text-rose-600 dark:text-rose-300">{fieldErrors.title}</p> : null}
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
              onChange={(event) => {
                setContent(event.target.value);
                if (fieldErrors.content) {
                  setFieldErrors((previous) => ({ ...previous, content: "" }));
                }
                if (submitMessage) {
                  setSubmitMessage("");
                }
              }}
              placeholder="마크다운 형식으로 본문을 입력하세요"
              disabled={isSubmitting || isLoading}
              className="min-h-[18rem] rounded-lg border-slate-300 bg-white px-4 py-3 text-base leading-7 text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 md:min-h-[22rem]"
            />
            {fieldErrors.content ? <p className="text-sm text-rose-600 dark:text-rose-300">{fieldErrors.content}</p> : null}
          </div>

          <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900/40">
            <Label htmlFor="postImage" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              이미지 첨부
            </Label>
            <div className="flex flex-col gap-2">
              <Input
                id="postImage"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  if (!file) {
                    setSelectedImageFile(null);
                    return;
                  }

                  const validationError = validateClientImageFile(file);
                  if (validationError) {
                    setSelectedImageFile(null);
                    setImageMessage(validationError);
                    return;
                  }

                  setImageMessage("");
                  setSelectedImageFile(file);
                }}
                disabled={isSubmitting || isLoading}
                className="h-12 rounded-lg border-slate-300 bg-white px-4 text-base text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">2MB 이하 jpg/jpeg/png/webp 파일만 허용됩니다.</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {selectedImageFile ? `선택됨: ${selectedImageFile.name}` : "저장하면 선택한 이미지도 함께 업로드됩니다."}
              </p>
            </div>
            {imageMessage ? <p className="text-sm text-rose-600 dark:text-rose-300">{imageMessage}</p> : null}
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
