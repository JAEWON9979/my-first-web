"use client";

import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 transition hover:scale-105 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
      aria-label="테마 전환"
    >
      <span>{isDark ? "🌞" : "🌙"}</span>
      <span>{isDark ? "라이트" : "다크"}</span>
    </button>
  );
}
