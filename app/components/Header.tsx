"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "@/lib/auth";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const handleLogout = async () => {
    const result = await signOut();

    if ("success" in result) {
      toast.success("로그아웃되었습니다.");
      router.push("/");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <>
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
            {user && (
              <li>
                <Link
                  href="/posts/new"
                  className="border border-transparent px-3 py-2 text-slate-600 hover:border-slate-300 hover:bg-white dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-900 dark:hover:text-slate-100"
                >
                  새 글 쓰기
                </Link>
              </li>
            )}
          </ul>

          <div className="flex items-center gap-2">
            {isLoading ? (
              <div className="h-8 w-20 animate-pulse rounded bg-slate-300 dark:bg-slate-600" />
            ) : user ? (
              <>
                <span className="px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                >
                  로그인
                </Link>
                <Link
                  href="/signup"
                  className="border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                >
                  회원가입
                </Link>
              </>
            )}
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </>
  );
}
