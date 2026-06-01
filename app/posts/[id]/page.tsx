import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import PostDetailActions from "@/components/PostDetailActions";
import PostEngagementSection from "@/components/PostEngagementSection";
import { getFriendlyErrorMessage } from "@/lib/errors";
import { formatAuthorName, getCategoryLabel } from "@/lib/posts";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { data: post, error: postError } = await supabase
    .from("posts")
    .select("*, profiles!posts_user_id_fkey(username)")
    .eq("id", id)
    .single();

  const [{ count: likeCount, error: likeCountError }, { data: comments, error: commentsError }] = await Promise.all([
    supabase.from("likes").select("post_id", { count: "exact", head: true }).eq("post_id", id),
    supabase
      .from("comments")
      .select("id, post_id, user_id, content, created_at, updated_at, profiles!comments_user_id_fkey(username)")
      .eq("post_id", id)
      .order("created_at", { ascending: true }),
  ]);

  if (postError || !post) {
    notFound();
  }

  if (likeCountError) {
    throw new Error(getFriendlyErrorMessage(likeCountError));
  }

  if (commentsError) {
    throw new Error(getFriendlyErrorMessage(commentsError));
  }

  const initialComments = (comments ?? []).map((comment) => {
    const profile = comment.profiles as { username?: string } | Array<{ username?: string }> | null;
    const username = Array.isArray(profile) ? profile[0]?.username : profile?.username;

    return {
      id: comment.id,
      post_id: comment.post_id,
      user_id: comment.user_id,
      content: comment.content,
      created_at: comment.created_at,
      updated_at: comment.updated_at,
      author_name: formatAuthorName(username, comment.user_id),
    };
  });

  const formattedDate = post.created_at ? post.created_at.slice(0, 10) : "";

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-6 md:py-8">
      <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800 md:p-8">
        <div className="mb-5 flex flex-col gap-2 text-sm text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-semibold text-emerald-700">[{getCategoryLabel(post.category)}]</span>
          <span>{formattedDate}</span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 md:text-4xl">
          {post.title}
        </h1>

        <div className="mt-4 border-b border-slate-200 pb-4 dark:border-slate-700">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            작성자: {formatAuthorName(post.profiles?.username, post.user_id)}
          </p>
        </div>

        <div className="prose prose-slate mt-8 max-w-none break-words leading-8 dark:prose-invert prose-headings:text-slate-900 prose-p:text-slate-700 dark:prose-headings:text-slate-100 dark:prose-p:text-slate-300">
          {post.content.split("\n\n").map((paragraph: string) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <PostEngagementSection
          postId={post.id}
          postUserId={post.user_id}
          initialLikeCount={likeCount ?? 0}
          initialComments={initialComments}
          initialImageUrl={post.image_url ?? null}
        />

        <PostDetailActions post={post} />
      </article>
    </div>
  );
}
