import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import ThemeProvider from "./components/ThemeProvider";
import ThemeToggle from "./components/ThemeToggle";
import ToastProvider from "./components/ToastProvider";
import { AuthProvider } from "@/lib/AuthContext";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
    <html lang="ko" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className="flex min-h-screen flex-col bg-white text-slate-900 transition-colors duration-300 dark:bg-slate-900 dark:text-slate-100">
        <AuthProvider>
        <ThemeProvider>
        <ToastProvider />
        <header className="border-b border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-6">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-emerald-700">
                JAEWON BLOG
              </p>
              <h1 className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100 md:text-2xl">
                김재원 개인 블로그
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <a
                href="https://github.com/JAEWON9979"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
              >
                GitHub
              </a>
              <a
                href="mailto:rlawodnjs9979@hs.ac.kr"
                className="border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
              >
                rlawodnjs9979@hs.ac.kr
              </a>
            </div>
          </div>
        </header>

        <nav className="border-b border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-950">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 md:px-6">
            <ul className="flex flex-wrap gap-1 py-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="border border-transparent px-3 py-2 text-slate-600 hover:border-slate-300 hover:bg-white dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-900 dark:hover:text-slate-100"
                >
                  홈
                </Link>
              </li>
              <li>
                <Link
                  href="/posts"
                  className="border border-transparent px-3 py-2 text-slate-600 hover:border-slate-300 hover:bg-white dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-900 dark:hover:text-slate-100"
                >
                  블로그 목록
                </Link>
              </li>
              <li>
                <Link
                  href="/posts/new"
                  className="border border-transparent px-3 py-2 text-slate-600 hover:border-slate-300 hover:bg-white dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-900 dark:hover:text-slate-100"
                >
                  새 글 쓰기
                </Link>
              </li>
            </ul>

            <ThemeToggle />
          </div>
        </nav>

        <main>{children}</main>

        <footer className="fixed bottom-0 left-0 w-full z-50 bg-black py-3 px-6 text-gray-300">
          <div className="flex items-center justify-center gap-4 text-sm">
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
        </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
