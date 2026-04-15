import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import { ApiPost, toPost } from "@/lib/posts";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params;
  let post = null;

  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      cache: "no-store",
    });

    if (response.ok) {
      const data = (await response.json()) as ApiPost;
      post = toPost(data);
    }
  } catch (error) {
    console.error("게시글 상세 조회 오류:", error);
  }

  if (!post) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6">
        <div className="flex items-center justify-center rounded-lg border border-slate-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800">
          <div>
            <p className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">게시글을 찾을 수 없습니다</p>
            <Link
              href="/posts"
              className="inline-block rounded-md border border-emerald-700 bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-800"
            >
              블로그 목록으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const sanitizedContent = DOMPurify.sanitize(post.content);

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-6">
      <article className="rounded-lg border border-slate-300 bg-white p-6 md:p-8 dark:border-slate-700 dark:bg-slate-800">
        {/* 태그, 날짜 */}
        <div className="mb-4 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-emerald-700">[{post.tag}]</span>
          <span>{post.date}</span>
        </div>

        {/* 제목 */}
        <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-slate-100 md:text-4xl">{post.title}</h1>

        {/* 작성자 정보 및 수정/삭제 버튼 */}
        <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-700">
          <p className="text-sm text-slate-600 dark:text-slate-300">작성자: {post.author}</p>
          <span className="text-xs text-slate-400 dark:text-slate-500">상세 보기</span>
        </div>

        {/* 내용 */}
        <div className="text-slate-700 dark:text-slate-300">
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        </div>

        {/* 하단 링크 */}
        <div className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-700">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/posts"
              className="inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              ← 블로그 목록으로 돌아가기
            </Link>
            <Link
              href={`/posts/${post.id}/edit`}
              className="inline-flex items-center rounded-md border border-emerald-700 bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-800"
            >
              수정하기
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
