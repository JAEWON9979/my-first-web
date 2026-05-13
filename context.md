# 프로젝트 컨텍스트 (my-first-web)

## 기준 정보
- 워크스페이스: my-first-web
- 최신 갱신일: 2026-05-13
- 스택: Next.js 16.2.1 (App Router), React 19.2.4, Tailwind CSS v4, shadcn/ui
- Supabase: Chapter 8 DB 연동 완료, Chapter 9 Auth 적용, Chapter 10 게시글 CRUD 완료

## 현재 라우트 스냅샷
- `/`: 홈
- `/posts`: 포스트 목록
- `/posts/[id]`: 포스트 상세
- `/posts/new`: 글 작성
- `/posts/[id]/edit`: 글 수정
- `/development-log`: 개발일지
- `/projects`: 프로젝트
- `/study-log`: 스터디 기록
- `/login`: 로그인 뼈대
- `/signup`: 회원가입 뼈대
- `/mypage`: 마이페이지 뼈대

## 기술 결정 사항
- Server Component를 기본으로 적용한다
- 네비게이션은 `next/navigation`만 사용한다
- `next/router`는 절대 사용하지 않는다
- 스타일은 Tailwind CSS v4와 shadcn/ui 토큰을 우선 사용한다
- 브라운 테마의 `--primary: #8B6B4E`를 주요 색상으로 사용한다
- 배경은 밝고 깔끔한 톤(`--background: #FBF8F3`)을 유지한다
- 메인 컨텐츠는 `max-w-4xl mx-auto`를 기준으로 정렬한다
- UI 프리미티브는 설치된 shadcn/ui 컴포넌트(button, card, input, dialog, textarea, label)를 우선 사용한다
- DB 컬럼명은 Supabase 스키마를 그대로 사용한다. 임의 변경 금지.

## 데이터 모델 및 인증 현재 상태
- **Chapter 8 완료**: Supabase DB 연동 (posts 테이블, 실제 insert/read)
- **Chapter 9 완료**: Email/Password 인증, AuthProvider, middleware 보호 라우트 적용
- **Chapter 10 완료**: 게시글 상세 조회/작성/수정/삭제 CRUD 연결
- `profiles` 테이블: `id(uuid, PK)`, `email`, `name`, `role`, `created_at`
- `posts` 테이블: `id(uuid, PK)`, `user_id(uuid)`, `title(text)`, `content(text)`, `created_at(timestamptz)`
- Supabase 쿼리 패턴
  - 목록 조회: `createClient().from("posts").select("id, title, content, created_at, user_id").order("created_at", { ascending: false })`
  - 상세 조회: 서버에서 `createServerClient(...).from("posts").select(...).eq("id", id).single()`
  - 작성: `createClient().from("posts").insert({ user_id: user.id, title, content })`
  - 수정: `createClient().from("posts").update({ title, content }).eq("id", post.id)`
  - 삭제: `createClient().from("posts").delete().eq("id", post.id)`
- 인증 상태: `contexts/AuthContext.tsx`의 `useAuth()`로 전역 공유
- 작성/수정/삭제 액션은 `user.id === post.user_id`일 때만 UI에 표시되며, 실제 보안은 Ch11 RLS로 분리 예정

## 최근 완료 사항
- Chapter 7 요구사항에 맞춘 4대 핵심 문서 세팅 완료
- Supabase 프로젝트 연결 및 마이그레이션 완료(`20260504043926_create_tables.sql`)
- `lib/supabase/client.ts` 생성 (createBrowserClient 기반)
- `/posts` 목록을 Supabase 실제 데이터로 조회 구현
- `/posts/new` 글 작성 페이지를 Supabase insert로 구현
- `/posts/[id]` 상세 조회를 Supabase 단일 글 조회로 구현
- `/posts/[id]/edit` 수정 화면 및 상세 화면의 수정/삭제 액션 연결
- Ch9 기준 문서 정비 및 AuthProvider 연결 완료

## Ch10 다음 확인 포인트
- 상세 페이지의 수정/삭제 액션은 UI 제어 수준이며, 실제 권한 보안은 Ch11 RLS에서 적용
- 목록/상세/작성/수정 모두 App Router 기반으로 유지
- `next/router` 사용 금지, 데이터 컬럼명 임의 변경 금지

## 문서 기준 계약 (Source of Truth)
- `ARCHITECTURE.md`: 설계 기준 단일 문서
- `context.md`: 현재 상태 + 기술 결정 로그
- `todo.md`: 단계별 체크리스트 + 진행률
- `copilot-instructions.md`: AI 지침