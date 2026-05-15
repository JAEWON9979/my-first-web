import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import PostDetailActions from "@/components/PostDetailActions";
import AuthorProfile from "@/components/AuthorProfile";
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
    .select("*, profiles(username)")
    .eq("id", id)
    .single();

  if (postError || !post) {
    notFound();
  }

  const formattedDate = post.created_at ? post.created_at.slice(0, 10) : "";

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 md:px-6">
      <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 md:p-8">
        <div className="mb-5 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-emerald-700">[{getCategoryLabel(post.category)}]</span>
          <span>{formattedDate}</span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 md:text-4xl">
          {post.title}
        </h1>

        <div className="mt-4 border-b border-slate-200 pb-4 dark:border-slate-700">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            작성자: {formatAuthorName(post.profiles?.username, post.user_id)}
          </p>
        </div>

        <AuthorProfile
          authorName={formatAuthorName(post.profiles?.username, post.user_id)}
          userId={post.user_id}
        />

        <div className="prose prose-slate mt-8 max-w-none leading-8 dark:prose-invert prose-headings:text-slate-900 prose-p:text-slate-700 dark:prose-headings:text-slate-100 dark:prose-p:text-slate-300">
          {post.content.split("\n\n").map((paragraph: string) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <PostDetailActions post={post} />
      </article>
    </div>
  );
}
