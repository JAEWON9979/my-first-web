"use client";

import { useEffect, useState } from "react";

type SearchBarProps = {
  initialQuery?: string;
  onSearch: (query: string) => void;
};

export default function SearchBar({ initialQuery = "", onSearch }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  return (
    <input
      type="text"
      value={query}
      onChange={(event) => {
        const nextQuery = event.target.value;
        setQuery(nextQuery);
        onSearch(nextQuery);
      }}
      placeholder="검색어를 입력하세요"
      className="rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-emerald-500 focus:outline-none dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
    />
  );
}