"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { getFriendlyErrorMessage } from "@/lib/errors";
import { validateImageSize } from "@/lib/utils/validation";

const ALLOWED_IMAGE_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const ALLOWED_IMAGE_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp"]);

type ActionClient = {
  supabase: ReturnType<typeof createServerClient>;
  user: { id: string };
};

type ActionResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

type LikeToggleResult = {
  liked: boolean;
  likeCount: number;
};

type CommentRow = {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
};

type ImageUploadResult = {
  imageUrl: string;
  storagePath: string;
};

type OptionalActionClient = {
  supabase: ReturnType<typeof createServerClient>;
  userId: string | null;
};

async function getActionClient(): Promise<ActionClient> {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll().map(({ name, value }) => ({ name, value }));
        },
        setAll(
          cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>
        ) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options as never);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("로그인이 필요합니다.");
  }

  return { supabase, user: { id: user.id } };
}

async function getOptionalActionClient(): Promise<OptionalActionClient> {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll().map(({ name, value }) => ({ name, value }));
        },
        setAll(
          cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>
        ) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options as never);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabase, userId: user?.id ?? null };
}

function revalidatePostViews(postId: string) {
  revalidatePath("/posts");
  revalidatePath(`/posts/${postId}`);
}

function getFileExtension(fileName: string): string {
  const split = fileName.toLowerCase().split(".");
  return split.length > 1 ? split[split.length - 1] : "";
}

function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function validateImageFile(file: File): string | null {
  if (!file || file.size <= 0) {
    return "이미지 파일이 필요합니다.";
  }

  const sizeError = validateImageSize(file);
  if (sizeError) {
    return sizeError;
  }

  const fileExtension = getFileExtension(file.name);
  if (!ALLOWED_IMAGE_EXTENSIONS.has(fileExtension)) {
    return "지원하지 않는 이미지 확장자입니다. (jpg, jpeg, png, webp만 허용)";
  }

  if (!ALLOWED_IMAGE_MIME_TYPES.has(file.type)) {
    return "지원하지 않는 이미지 형식입니다. (image/jpeg, image/png, image/webp만 허용)";
  }

  return null;
}

export async function recordPostViewAction(postId: string): Promise<ActionResult<{ postId: string }>> {
  try {
    const normalizedPostId = postId.trim();
    if (!normalizedPostId) {
      return { success: false, error: "유효한 게시글 ID가 필요합니다." };
    }

    const { supabase, userId } = await getOptionalActionClient();

    const { error } = await supabase.from("post_views").insert({
      post_id: normalizedPostId,
      viewer_id: userId,
    });

    if (error) {
      return { success: false, error: getFriendlyErrorMessage(error) };
    }

    revalidatePath("/posts");
    return { success: true, data: { postId: normalizedPostId } };
  } catch (error) {
    const message = error instanceof Error ? error.message : "조회수 기록에 실패했습니다.";
    return { success: false, error: message };
  }
}

export async function toggleLikeAction(postId: string): Promise<ActionResult<LikeToggleResult>> {
  try {
    const normalizedPostId = postId.trim();
    if (!normalizedPostId) {
      return { success: false, error: "유효한 게시글 ID가 필요합니다." };
    }

    const { supabase, user } = await getActionClient();

    const { data: existingLike, error: readLikeError } = await supabase
      .from("likes")
      .select("post_id")
      .eq("post_id", normalizedPostId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (readLikeError) {
      return { success: false, error: getFriendlyErrorMessage(readLikeError) };
    }

    let liked = false;

    if (existingLike) {
      const { error: deleteError } = await supabase
        .from("likes")
        .delete()
        .eq("post_id", normalizedPostId)
        .eq("user_id", user.id);

      if (deleteError) {
        return { success: false, error: getFriendlyErrorMessage(deleteError) };
      }
    } else {
      const { error: insertError } = await supabase.from("likes").insert({
        post_id: normalizedPostId,
        user_id: user.id,
      });

      if (insertError) {
        return { success: false, error: getFriendlyErrorMessage(insertError) };
      }

      liked = true;
    }

    const { count, error: countError } = await supabase
      .from("likes")
      .select("post_id", { count: "exact", head: true })
      .eq("post_id", normalizedPostId);

    if (countError) {
      return { success: false, error: getFriendlyErrorMessage(countError) };
    }

    revalidatePostViews(normalizedPostId);
    return {
      success: true,
      data: {
        liked,
        likeCount: count ?? 0,
      },
    };
  } catch (error) {
    return { success: false, error: getFriendlyErrorMessage(error) };
  }
}

export async function createCommentAction(
  postId: string,
  content: string
): Promise<ActionResult<CommentRow>> {
  try {
    const normalizedPostId = postId.trim();
    const normalizedContent = content.trim();

    if (!normalizedPostId) {
      return { success: false, error: "유효한 게시글 ID가 필요합니다." };
    }

    if (!normalizedContent) {
      return { success: false, error: "댓글 내용을 입력해주세요." };
    }

    const { supabase, user } = await getActionClient();

    const { data, error } = await supabase
      .from("comments")
      .insert({
        post_id: normalizedPostId,
        user_id: user.id,
        content: normalizedContent,
      })
      .select("id, post_id, user_id, content, created_at, updated_at")
      .single();

    if (error) {
      return { success: false, error: getFriendlyErrorMessage(error) };
    }

    revalidatePostViews(normalizedPostId);
    return { success: true, data: data as CommentRow };
  } catch (error) {
    return { success: false, error: getFriendlyErrorMessage(error) };
  }
}

export async function updateCommentAction(
  commentId: string,
  content: string
): Promise<ActionResult<CommentRow>> {
  try {
    const normalizedCommentId = commentId.trim();
    const normalizedContent = content.trim();

    if (!normalizedCommentId) {
      return { success: false, error: "유효한 댓글 ID가 필요합니다." };
    }

    if (!normalizedContent) {
      return { success: false, error: "댓글 내용을 입력해주세요." };
    }

    const { supabase, user } = await getActionClient();

    const { data, error } = await supabase
      .from("comments")
      .update({
        content: normalizedContent,
        updated_at: new Date().toISOString(),
      })
      .eq("id", normalizedCommentId)
      .eq("user_id", user.id)
      .select("id, post_id, user_id, content, created_at, updated_at")
      .single();

    if (error) {
      return { success: false, error: getFriendlyErrorMessage(error) };
    }

    revalidatePostViews(data.post_id as string);
    return { success: true, data: data as CommentRow };
  } catch (error) {
    return { success: false, error: getFriendlyErrorMessage(error) };
  }
}

export async function deleteCommentAction(commentId: string): Promise<ActionResult<{ id: string }>> {
  try {
    const normalizedCommentId = commentId.trim();

    if (!normalizedCommentId) {
      return { success: false, error: "유효한 댓글 ID가 필요합니다." };
    }

    const { supabase, user } = await getActionClient();

    const { data: targetComment, error: targetReadError } = await supabase
      .from("comments")
      .select("id, post_id")
      .eq("id", normalizedCommentId)
      .eq("user_id", user.id)
      .single();

    if (targetReadError || !targetComment) {
      return {
        success: false,
        error: targetReadError ? getFriendlyErrorMessage(targetReadError) : "삭제할 댓글을 찾을 수 없습니다.",
      };
    }

    const { error: deleteError } = await supabase
      .from("comments")
      .delete()
      .eq("id", normalizedCommentId)
      .eq("user_id", user.id);

    if (deleteError) {
      return { success: false, error: getFriendlyErrorMessage(deleteError) };
    }

    revalidatePostViews(targetComment.post_id as string);
    return { success: true, data: { id: normalizedCommentId } };
  } catch (error) {
    return { success: false, error: getFriendlyErrorMessage(error) };
  }
}

export async function uploadPostImageAction(
  postId: string,
  file: File
): Promise<ActionResult<ImageUploadResult>> {
  try {
    const normalizedPostId = postId.trim();
    if (!normalizedPostId) {
      return { success: false, error: "유효한 게시글 ID가 필요합니다." };
    }

    const validationError = validateImageFile(file);
    if (validationError) {
      return { success: false, error: validationError };
    }

    const { supabase, user } = await getActionClient();

    const { data: post, error: postReadError } = await supabase
      .from("posts")
      .select("id, user_id")
      .eq("id", normalizedPostId)
      .single();

    if (postReadError || !post) {
      return {
        success: false,
        error: postReadError ? getFriendlyErrorMessage(postReadError) : "게시글을 찾을 수 없습니다.",
      };
    }

    if (post.user_id !== user.id) {
      return { success: false, error: "본인 글에만 이미지를 첨부할 수 있습니다." };
    }

    const safeName = sanitizeFileName(file.name);
    const storagePath = `${user.id}/${normalizedPostId}/${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("post-images")
      .upload(storagePath, file, { contentType: file.type, upsert: false });

    if (uploadError) {
      return { success: false, error: getFriendlyErrorMessage(uploadError) };
    }

    const { data: publicUrlData } = supabase.storage.from("post-images").getPublicUrl(storagePath);
    const imageUrl = publicUrlData.publicUrl;

    const { error: updateError } = await supabase
      .from("posts")
      .update({ image_url: imageUrl })
      .eq("id", normalizedPostId)
      .eq("user_id", user.id);

    if (updateError) {
      await supabase.storage.from("post-images").remove([storagePath]);
      return { success: false, error: getFriendlyErrorMessage(updateError) };
    }

    revalidatePostViews(normalizedPostId);
    return {
      success: true,
      data: {
        imageUrl,
        storagePath,
      },
    };
  } catch (error) {
    return { success: false, error: getFriendlyErrorMessage(error) };
  }
}
