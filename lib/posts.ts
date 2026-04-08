export type TabKey = "all" | "goal" | "study" | "project";

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

export const posts: Post[] = [
  {
    id: 1,
    title: "React 19 새 기능 정리",
    content: "React 19에서 달라진 점과 실무에서 체감되는 변화 포인트를 정리했습니다.",
    author: "김재원",
    date: "2026-03-30",
    category: "goal",
    summary: "React 19 핵심 기능과 변화 요약",
    tag: "목표",
  },
  {
    id: 2,
    title: "Tailwind CSS 4 변경사항",
    content: "Tailwind CSS 4에서 달라진 설정 방식과 유틸리티 사용법을 정리했습니다.",
    author: "이디자인",
    date: "2026-03-28",
    category: "study",
    summary: "Tailwind CSS 4에서 달라진 핵심 포인트",
    tag: "수업일지",
  },
  {
    id: 3,
    title: "Next.js 16 App Router 가이드",
    content: "App Router 기반 라우팅과 동적 라우트 작성 방법을 예제로 정리했습니다.",
    author: "박개발",
    date: "2026-03-25",
    category: "project",
    summary: "App Router를 빠르게 익히는 실습 가이드",
    tag: "프로젝트",
  },
];
