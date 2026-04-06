export type TabKey = "all" | "goal" | "study" | "project";

export type Post = {
  id: number;
  title: string;
  summary: string;
  date: string;
  author: string;
  category: Exclude<TabKey, "all">;
  tag: string;
};

export const posts: Post[] = [
  {
    id: 1,
    title: "2026년 자격증 목표",
    summary: "미리보기 : 컴활 1급, ADsp(데이터분석준전문가), 사회조사분석사 2급 취득하기",
    date: "~ 2026. 12. 31",
    author: "김재원",
    category: "goal",
    tag: "목표",
  },
  {
    id: 2,
    title: "웹프로그래밍 블로그 생성 및 vercel 배포",
    summary: "미리보기 : copilot chat을 이용한 기본 블로그 생성 및 자기소개.",
    date: "2026.03.25",
    author: "김재원",
    category: "study",
    tag: "수업일지",
  },
  {
    id: 3,
    title: "프로젝트 미진행중",
    summary: "미리보기 : 추후 진행 예정",
    date: "~ 2026.12.31",
    author: "김재원",
    category: "project",
    tag: "프로젝트",
  },
];
