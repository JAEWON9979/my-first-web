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
    <header className="border-b border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        {/* 좌측: 로고 */}
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-emerald-700">
            JAEWON BLOG
          </p>
          <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 md:text-xl">
            김재원 개인 블로그
          </h1>
        </div>

        {/* 우측: 네비게이션 + 인증 버튼 + 다크모드 토글 */}
        <div className="flex items-center gap-6">
          {/* 네비게이션 링크 */}
          <ul className="flex gap-6 text-sm">
            <li>
              <Link
                href="/"
                className="font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
              >
                홈
              </Link>
            </li>
            <li>
              <Link
                href="/posts"
                className="font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
              >
                블로그 목록
              </Link>
            </li>
            {user && (
              <li>
                <Link
                  href="/posts/new"
                  className="font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
                >
                  새 글 쓰기
                </Link>
              </li>
            )}
          </ul>

          {/* 인증 버튼 + 다크모드 토글 */}
          <div className="flex items-center gap-3">
            {isLoading ? (
              <div className="h-8 w-20 animate-pulse rounded bg-slate-300 dark:bg-slate-600" />
            ) : user ? (
              <>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
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
      </div>
    </header>
  );
}
