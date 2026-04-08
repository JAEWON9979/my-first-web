import Link from "next/link";
import { posts } from "@/lib/posts";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params;
  const post = posts.find((p) => p.id === Number(id));

  if (!post) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6">
        <div className="flex items-center justify-center rounded-lg border border-slate-300 bg-white p-8 text-center">
          <div>
            <p className="mb-4 text-lg font-semibold text-slate-900">게시글을 찾을 수 없습니다</p>
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

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6 md:px-6">
      <article className="rounded-lg border border-slate-300 bg-white p-6 md:p-8">
        {/* 태그, 날짜 */}
        <div className="mb-4 flex items-center justify-between text-sm text-slate-500">
          <span className="font-semibold text-emerald-700">[{post.tag}]</span>
          <span>{post.date}</span>
        </div>

        {/* 제목 */}
        <h1 className="mb-2 text-3xl font-bold text-slate-900 md:text-4xl">{post.title}</h1>

        {/* 작성자 정보 및 수정/삭제 버튼 */}
        <div className="mb-6 border-b border-slate-200 pb-4 flex items-center justify-between">
          <p className="text-sm text-slate-600">작성자: {post.author}</p>
          <span className="text-xs text-slate-400">상세 보기</span>
        </div>

        {/* 내용 */}
        <div className="prose prose-sm max-w-none text-slate-700 md:prose-base">
          <p className="whitespace-pre-wrap leading-7">{post.content}</p>
        </div>

        {/* 하단 링크 */}
        <div className="mt-8 border-t border-slate-200 pt-6">
          <Link
            href="/posts"
            className="inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            ← 블로그 목록으로 돌아가기
          </Link>
        </div>
      </article>
    </div>
  );
}
