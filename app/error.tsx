"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // 개발 환경에서만 콘솔에 기록 (운영 환경에서는 민감한 에러 정보 노출 방지)
    if (process.env.NODE_ENV === 'development') {
      console.error(error);
    }
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-4xl items-center justify-center px-4 py-12 md:px-6">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800 md:p-8">
        <p className="text-sm font-semibold text-emerald-700">오류가 발생했습니다</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-slate-100">잠시 후 다시 시도해 주세요.</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
          요청을 처리하는 동안 문제가 생겼습니다. 이전 상태를 다시 불러오려면 아래 버튼을 눌러 주세요.
        </p>

        <div className="mt-6 flex justify-center">
          <Button type="button" onClick={reset} className="bg-emerald-700 hover:bg-emerald-800">
            다시 시도
          </Button>
        </div>
      </section>
    </main>
  );
}