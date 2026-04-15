import PostListContainer from "@/components/PostListContainer";

export default function PostsPage() {

  return (
    <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 md:grid-cols-[1fr_300px] md:px-6">
      <PostListContainer />

      <aside className="space-y-4">
        <section className="border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800">
          <h3 className="border-b border-slate-200 px-4 py-3 text-sm font-semibold text-slate-900 dark:border-slate-700 dark:text-slate-100">
            프로필
          </h3>
          <div className="space-y-1 px-4 py-4 text-sm text-slate-700 dark:text-slate-300">
            <p>이름: 김재원</p>
            <p>학교: 한신대학교</p>
            <p>전공: 공공인재빅데이터융합학</p>
            <p>취미: 게임, 독서, 음악듣기</p>
          </div>
        </section>
      </aside>
    </div>
  );
}
