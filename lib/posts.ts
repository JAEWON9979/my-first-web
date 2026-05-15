export type TabKey = "all" | "goal" | "study" | "project";

export const categoryLabelMap: Record<Exclude<TabKey, "all">, string> = {
  goal: "커뮤니티",
  study: "수업일지",
  project: "프로젝트",
};

export function getCategoryLabel(category: Exclude<TabKey, "all">) {
  return categoryLabelMap[category];
}

export function formatAuthorName(
  authorName: string | null | undefined,
  fallbackId?: string | null,
) {
  if (authorName) {
    return authorName.includes("@") ? authorName.split("@")[0] : authorName;
  }

  return fallbackId ? fallbackId.slice(0, 8) : "";
}

export type Post = {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  category: Exclude<TabKey, "all">;
  summary: string;
  tag: string;
};

export type ApiPost = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

const categoryCycle: Array<Exclude<TabKey, "all">> = ["goal", "study", "project"];

const tagByCategory: Record<Exclude<TabKey, "all">, string> = categoryLabelMap;

const authorPool = ["김재원", "이디자인", "박개발"];

export function toPost(apiPost: ApiPost): Post {
  const category = categoryCycle[(apiPost.id - 1) % categoryCycle.length];
  const author = authorPool[(apiPost.userId - 1) % authorPool.length] ?? "방문자";

  return {
    id: apiPost.id,
    title: apiPost.title,
    content: apiPost.body,
    author,
    date: "2026-04-13",
    category,
    summary: apiPost.body.slice(0, 80),
    tag: tagByCategory[category],
  };
}
