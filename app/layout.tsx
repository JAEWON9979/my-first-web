import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "내 블로그",
  description: "김재원의 개인 블로그",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col">
        <header className="border-b border-slate-300 bg-white">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-6">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-emerald-700">
                JAEWON BLOG
              </p>
              <h1 className="mt-1 text-xl font-bold text-slate-900 md:text-2xl">
                김재원 개인 블로그
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/JAEWON9979"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                GitHub
              </a>
              <a
                href="mailto:rlawodnjs9979@hs.ac.kr"
                className="border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                rlawodnjs9979@hs.ac.kr
              </a>
            </div>
          </div>
        </header>

        <nav className="border-b border-slate-300 bg-slate-50">
          <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
            <ul className="flex flex-wrap gap-1 py-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="border border-transparent px-3 py-2 text-slate-600 hover:border-slate-300 hover:bg-white"
                >
                  홈
                </Link>
              </li>
              <li>
                <Link
                  href="/posts"
                  className="border border-transparent px-3 py-2 text-slate-600 hover:border-slate-300 hover:bg-white"
                >
                  블로그 목록
                </Link>
              </li>
              <li>
                <Link
                  href="/posts/new"
                  className="border border-transparent px-3 py-2 text-slate-600 hover:border-slate-300 hover:bg-white"
                >
                  새 글 쓰기
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <main className="min-h-screen bg-slate-100 pb-10 md:pb-24 flex-grow pb-20">
          {children}
        </main>

        <footer className="fixed bottom-0 left-0 w-full z-50 bg-black py-3 px-6 text-gray-300">
          <div className="flex items-center gap-4 text-sm">
            <span className="font-bold text-white">바로가기</span>
            <a href="https://github.com/JAEWON9979" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              GitHub 사이트 이동
            </a>
            <span className="text-gray-500">|</span>
            <a href="mailto:rlawodnjs9979@hs.ac.kr" className="hover:text-white">
              rlawodnjs9979@hs.ac.kr
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
