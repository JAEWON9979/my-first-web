"use client";

import { FormEvent, useEffect, useMemo, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { createClient } from "@/lib/supabase/client";
import {
  createCommentAction,
  deleteCommentAction,
  recordPostViewAction,
  toggleLikeAction,
  updateCommentAction,
  uploadPostImageAction,
} from "@/app/actions/post-interactions";
import { formatAuthorName } from "@/lib/posts";

type CommentItem = {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  author_name: string;
};

type PostEngagementSectionProps = {
  postId: string;
  postUserId: string;
  initialLikeCount: number;
  initialComments: CommentItem[];
  initialImageUrl: string | null;
};

const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;
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

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return "이미지는 2MB 이하만 업로드할 수 있습니다.";
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

export default function PostEngagementSection({
  postId,
  postUserId,
  initialLikeCount,
  initialComments,
  initialImageUrl,
}: PostEngagementSectionProps) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [isPending, startTransition] = useTransition();

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [comments, setComments] = useState<CommentItem[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const isPostOwner = !isLoading && user?.id === postUserId;

  const sortedComments = useMemo(() => {
    return [...comments].sort((a, b) => {
      const aTime = new Date(a.created_at).getTime();
      const bTime = new Date(b.created_at).getTime();
      return aTime - bTime;
    });
  }, [comments]);

  useEffect(() => {
    startTransition(async () => {
      await recordPostViewAction(postId);
    });
  }, [postId]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const supabase = createClient();
    supabase
      .from("likes")
      .select("post_id")
      .eq("post_id", postId)
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setLiked(!!data);
      });
  }, [postId, user]);

  const handleLikeToggle = () => {
    if (!user) {
      setErrorMessage("좋아요는 로그인 후 사용할 수 있습니다.");
      return;
    }

    setErrorMessage("");
    setMessage("");

    startTransition(async () => {
      const result = await toggleLikeAction(postId);

      if (!result.success || !result.data) {
        setErrorMessage(result.error ?? "좋아요 처리에 실패했습니다.");
        return;
      }

      setLiked(result.data.liked);
      setLikeCount(result.data.likeCount);
    });
  };

  const handleCreateComment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      setErrorMessage("댓글 작성은 로그인 후 사용할 수 있습니다.");
      router.push("/login");
      return;
    }

    const content = newComment.trim();
    if (!content) {
      setErrorMessage("댓글 내용을 입력해주세요.");
      return;
    }

    setErrorMessage("");
    setMessage("");

    startTransition(async () => {
      const result = await createCommentAction(postId, content);

      if (!result.success || !result.data) {
        setErrorMessage(result.error ?? "댓글 작성에 실패했습니다.");
        return;
      }

      const created = result.data;
      if (!created.id || !created.post_id || !created.user_id || !created.created_at || !created.updated_at) {
        setErrorMessage("댓글 응답 형식이 올바르지 않습니다.");
        return;
      }

      setComments((prev) => [
        ...prev,
        {
          id: created.id,
          post_id: created.post_id,
          user_id: created.user_id,
          content: created.content,
          created_at: created.created_at,
          updated_at: created.updated_at,
          author_name: formatAuthorName(user.email, user.id),
        },
      ]);
      setNewComment("");
      setMessage("댓글이 등록되었습니다.");
    });
  };

  const beginEditComment = (comment: CommentItem) => {
    setEditingCommentId(comment.id);
    setEditingCommentContent(comment.content);
    setErrorMessage("");
    setMessage("");
  };

  const handleUpdateComment = (commentId: string) => {
    if (!user) {
      setErrorMessage("로그인이 필요합니다.");
      return;
    }

    const content = editingCommentContent.trim();
    if (!content) {
      setErrorMessage("댓글 내용을 입력해주세요.");
      return;
    }

    setErrorMessage("");
    setMessage("");

    startTransition(async () => {
      const result = await updateCommentAction(commentId, content);

      if (!result.success || !result.data) {
        setErrorMessage(result.error ?? "댓글 수정에 실패했습니다.");
        return;
      }

      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                content: result.data?.content ?? comment.content,
                updated_at: result.data?.updated_at ?? comment.updated_at,
              }
            : comment
        )
      );

      setEditingCommentId(null);
      setEditingCommentContent("");
      setMessage("댓글이 수정되었습니다.");
    });
  };

  const handleDeleteComment = (commentId: string) => {
    if (!user) {
      setErrorMessage("로그인이 필요합니다.");
      return;
    }

    const shouldDelete = window.confirm("댓글을 삭제하시겠습니까?");
    if (!shouldDelete) {
      return;
    }

    setErrorMessage("");
    setMessage("");

    startTransition(async () => {
      const result = await deleteCommentAction(commentId);

      if (!result.success) {
        setErrorMessage(result.error ?? "댓글 삭제에 실패했습니다.");
        return;
      }

      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
      setMessage("댓글이 삭제되었습니다.");
    });
  };

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      setSelectedImageFile(null);
      return;
    }

    const validationError = validateClientImageFile(file);
    if (validationError) {
      setSelectedImageFile(null);
      setErrorMessage(validationError);
      return;
    }

    setErrorMessage("");
    setSelectedImageFile(file);
  };

  const handleImageUpload = () => {
    if (!isPostOwner) {
      setErrorMessage("본인 글에만 이미지를 업로드할 수 있습니다.");
      return;
    }

    if (!selectedImageFile) {
      setErrorMessage("업로드할 이미지를 선택해주세요.");
      return;
    }

    const validationError = validateClientImageFile(selectedImageFile);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setErrorMessage("");
    setMessage("");

    startTransition(async () => {
      const result = await uploadPostImageAction(postId, selectedImageFile);

      if (!result.success || !result.data) {
        setErrorMessage(result.error ?? "이미지 업로드에 실패했습니다.");
        return;
      }

      setImageUrl(result.data.imageUrl);
      setSelectedImageFile(null);
      setMessage("이미지가 업로드되었습니다.");
    });
  };

  return (
    <section className="mt-10 space-y-6 border-t border-slate-200 pt-6 dark:border-slate-700">
      <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
        <div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">좋아요</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">총 {likeCount}개</p>
        </div>
        <button
          type="button"
          onClick={handleLikeToggle}
          disabled={isPending}
          className={`rounded-md px-4 py-2 text-sm font-medium transition ${
            liked
              ? "bg-emerald-700 text-white hover:bg-emerald-800"
              : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-700"
          }`}
        >
          {liked ? "좋아요 취소" : "좋아요"}
        </button>
      </div>

      <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">이미지 첨부</h2>
          {imageUrl ? (
            <a
              href={imageUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium text-emerald-700 underline"
            >
              원본 보기
            </a>
          ) : null}
        </div>

        {imageUrl ? (
          <div className="relative min-h-60 w-full overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
            <Image
              src={imageUrl}
              alt="게시글 이미지"
              width={1200}
              height={800}
              className="h-auto w-full object-contain"
              sizes="100vw"
            />
          </div>
        ) : (
          <p className="text-sm text-slate-500 dark:text-slate-400">등록된 이미지가 없습니다.</p>
        )}

        {isPostOwner ? (
          <div className="space-y-2">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageFileChange}
              disabled={isPending}
              className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border file:border-slate-300 file:bg-white file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-700 dark:text-slate-300 dark:file:border-slate-600 dark:file:bg-slate-900 dark:file:text-slate-100"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              2MB 이하 jpg/jpeg/png/webp 파일만 허용됩니다.
            </p>
            <button
              type="button"
              onClick={handleImageUpload}
              disabled={isPending || !selectedImageFile}
              className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "업로드 중..." : "이미지 업로드"}
            </button>
          </div>
        ) : (
          <p className="text-xs text-slate-500 dark:text-slate-400">이미지 업로드는 작성자만 가능합니다.</p>
        )}
      </div>

      <div className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">댓글 {comments.length}개</h2>

        <form onSubmit={handleCreateComment} className="space-y-2">
          <textarea
            value={newComment}
            onChange={(event) => setNewComment(event.target.value)}
            placeholder={user ? "댓글을 입력하세요" : "로그인 후 댓글을 작성할 수 있습니다"}
            disabled={isPending || !user}
            className="min-h-24 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isPending || !user}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "처리 중..." : "댓글 등록"}
            </button>
          </div>
        </form>

        <ul className="space-y-3">
          {sortedComments.map((comment) => {
            const canManageComment = !isLoading && user?.id === comment.user_id;

            return (
              <li key={comment.id} className="rounded-md border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900">
                <div className="mb-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>작성자: {comment.author_name}</span>
                  <span>{comment.created_at.slice(0, 10)}</span>
                </div>

                {editingCommentId === comment.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editingCommentContent}
                      onChange={(event) => setEditingCommentContent(event.target.value)}
                      className="min-h-20 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCommentId(null);
                          setEditingCommentContent("");
                        }}
                        className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-700"
                      >
                        취소
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateComment(comment.id)}
                        disabled={isPending}
                        className="rounded-md bg-emerald-700 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        저장
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap break-all text-sm leading-6 text-slate-700 dark:text-slate-200">{comment.content}</p>
                )}

                {canManageComment && editingCommentId !== comment.id ? (
                  <div className="mt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => beginEditComment(comment)}
                      className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-700"
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteComment(comment.id)}
                      disabled={isPending}
                      className="rounded-md border border-rose-300 bg-white px-3 py-1.5 text-xs font-medium text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-rose-900 dark:bg-slate-900 dark:text-rose-300 dark:hover:bg-rose-950/30"
                    >
                      삭제
                    </button>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>

      {errorMessage ? <p className="text-sm text-rose-600 dark:text-rose-300">{errorMessage}</p> : null}
      {message ? <p className="text-sm text-emerald-700 dark:text-emerald-300">{message}</p> : null}
    </section>
  );
}
