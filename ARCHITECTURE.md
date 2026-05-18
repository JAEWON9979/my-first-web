# 블로그 아키텍처 설계서 (my-first-web)

## 1. 문서 목적
이 문서는 my-first-web 프로젝트의 설계 기준을 정의한다. Ch8(Supabase DB 완료), Ch9(Auth 완료), Ch10(게시글 CRUD 완료), Ch11(RLS 적용 완료)에서 구조, 데이터, 권한, UI 원칙의 단일 기준을 제공한다.

## 2. 시스템 개요
- 제품 성격: 개인 블로그 및 포트폴리오 사이트
- 포함 콘텐츠: 개발 일지, 스터디 기록, 프로젝트 소개, 포스트 CRUD
- 라우팅 방식: Next.js 16.2.1 App Router 전용
- 인증: Supabase Auth (이메일/비밀번호만, 소셜 로그인 X)
- UI 스택: React 19.2.4, Tailwind CSS v4, shadcn/ui
- 디자인 방향: 밝고 깔끔한 배경 위에 브라운 톤 primary를 사용하는 정돈된 개인 블로그 스타일
- 메인 컨텐츠 폭: `max-w-4xl mx-auto`
- Supabase: Chapter 8 DB 완료, Chapter 9 Auth 완료, Chapter 10 CRUD 완료, Chapter 11 RLS 적용 완료

## 2-1. 개발 규칙
- 라우팅은 Next.js App Router만 사용한다.
- `next/router`는 사용하지 않는다.
- Supabase 클라이언트는 Ch8 기준 `lib/supabase/client.ts`를 사용한다.
- 데이터 컬럼명은 스키마를 그대로 따른다. 임의 변경 금지.
- RLS는 SQL Editor 직접 실행이 아니라 Supabase CLI 마이그레이션으로만 추가한다.
- UI의 작성자 일치 분기는 보안이 아니며, 실제 보안은 RLS가 담당한다.
- `posts` 권한은 `user_id = auth.uid()` 기준으로 설계한다.
- `service_role` 키는 클라이언트에서 절대 사용하지 않는다.

## 3. 페이지 맵 (URL 구조)
| 경로 | 상태 | 목적 | 인증 요구사항 |
| --- | --- | --- | --- |
| `/` | 구현됨 | 홈 및 소개 진입점 | 없음 |
| `/posts` | 구현됨 | Supabase posts 목록 조회 | 없음 |
| `/posts/[id]` | 구현됨 | 게시글 1개 상세 조회 | 없음 |
| `/posts/new` | 구현됨 | 게시글 생성 | 로그인 필요(middleware 보호) |
| `/posts/[id]/edit` | 구현됨(리다이렉트) | 기존 글 수정 진입점 | 로그인 필요(middleware 보호, 작성자만) |
| `/development-log` | 구현됨 | 개발 일지 카테고리 | 없음 |
| `/projects` | 구현됨 | 프로젝트 카테고리 | 없음 |
| `/study-log` | 구현됨 | 스터디 기록 카테고리 | 없음 |
| `/login` | 구현됨 | 로그인 화면 진입 | Supabase Auth 연결 |
| `/signup` | 구현됨 | 회원가입 화면 진입 | Supabase Auth 연결 |
| `/mypage` | 뼈대 구현 | 내 정보 및 본인 글 관리 | 로그인 필요(middleware 보호) |

보호 라우트 (middleware.ts
보호 경로: `/posts/new`, `/posts/[id]/edit`, `/mypage`

## 4. 컴포넌트 계층
### 4.1 앱 셸 (app/layout.tsx, max-w-4xl 컨테이너)
- `app/layout.tsx`
  - 전역 HTML 구조
  - 폰트 및 body 배경/텍스트 토큰 적용
  - `AuthProvider` (로그인 상태 전역 관리)
  - `ThemeProvider`
  - `ToastProvider`
  - 공통 헤더와 푸터
  - 헤더에서 로그인 상태 분기: 비로그인 시 "로그인/회원가입", 로그인 시 "로그아웃" 버튼 표시
- `max-w-4xl mx-auto` 컨테이너
  - 모든 주요 페이지의 공통 가로 폭 기준
  - 모바일에서는 `px-4`, 데스크톱에서는 `md:px-6` 계열의 여백 사용

### 4.2 주요 페이지 (홈, 포스트, 커스텀 카테고리 등)
- 홈(`/`)
  - 블로그 소개
  - 포스트/작성 진입 링크
- 포스트 목록(`/posts`)
  - Supabase `posts` 테이블 카드 목록
  - 최신순 정렬(created_at desc)
  - 로딩/에러/빈 상태 UI
- 글 작성(`/posts/new`)
  - 제목/본문 입력 폼
  - `useAuth()`로 로그인 확인 후 `posts.insert`
- 글 상세(`/posts/[id]`)
  - Supabase 단일 게시글 조회
  - 로그인 사용자와 작성자 일치 시 수정/삭제 버튼 표시
- 글 수정(`/posts/[id]/edit`)
  - 현재는 상세 페이지의 Supabase 기반 편집 UI로 연결되는 진입점
  - 실제 수정/삭제는 `components/PostDetailActions.tsx`의 `posts.update` / `posts.delete` 패턴 사용
- 커스텀 카테고리(`/development-log`, `/projects`, `/study-log`)
  - 주제별 카드형 목록 또는 요약 영역
- 인증 뼈대(`/login`, `/signup`, `/mypage`)
  - 중앙 정렬 카드형 레이아웃
  - Chapter 8~10에서 기능 연결 완료 또는 진행 중 항목만 유지

### 4.3 UI 프리미티브 레이어 (설치된 shadcn/ui 목록)
- `button`
- `card`
- `input`
- `dialog`
- `textarea`
- `label`

### 5. 데이터 모델 (Supabase)
### profiles
- `id`: uuid, PK
- `email`: text
- `name`: text
- `role`: text
- `created_at`: timestamp

### posts
- `id`: uuid, PK
- `title`: text
- `content`: text
- `user_id`: uuid, FK -> `profiles.id`
- `created_at`: timestamptz

### 관계
- `profiles` 1 : N `posts`
- 한 명의 사용자는 여러 개의 게시글을 작성할 수 있다
- 각 게시글은 정확히 하나의 작성자(`user_id`)를 가진다

## 6. 인증/권한 및 CRUD 흐름 매트릭스
| 기능 | 라우트/화면 | 인증 요구사항 | 비고 |
| --- | --- | --- | --- |
| 글 목록 조회 | `/posts` | 없음 | 공개 화면 |
| 글 상세 조회 | `/posts/[id]` | 없음 | 공개 화면 |
| 새 글 작성 | `/posts/new` | 필요 | 로그인 사용자만 허용 |
| 글 수정 | `/posts/[id]/edit` | 필요 | 상세 페이지의 Supabase 편집 UI로 이동 |
| 글 삭제 | 상세 화면 액션 | 필요 | 작성자 본인만 허용 |
| 개발 일지 확인 | `/development-log` | 없음 | 공개 카테고리 |
| 프로젝트 확인 | `/projects` | 없음 | 공개 카테고리 |
| 스터디 기록 확인 | `/study-log` | 없음 | 공개 카테고리 |
| 로그인 | `/login` | 없음 | 인증 진입점 |
| 회원가입 | `/signup` | 없음 | 계정 생성 진입점 |
| 마이페이지 | `/mypage` | 필요(예정) | 본인 정보 및 본인 글 관리 |

### 6-1. Ch11 RLS 대상
- 대상 테이블: `posts`
- 정책 기준: `posts.user_id = auth.uid()`
- 적용 범위: SELECT, INSERT, UPDATE, DELETE
- 보안 책임 분리: UI의 작성자 일치 분기는 사용자 경험용이며, 실제 권한 강제는 DB RLS가 담당한다.
- 정책 구현 위치: `supabase/migrations/20260518042936_posts_rls_policy.sql`
- 정책 요약
  - SELECT: 공개 읽기 허용
  - INSERT: 로그인 사용자만, `WITH CHECK (user_id = auth.uid())`
  - UPDATE: 작성자만, `USING`과 `WITH CHECK`를 모두 `user_id = auth.uid()`로 강제
  - DELETE: 작성자만, `USING (user_id = auth.uid())`
- 목적: UI 분기와 무관하게 본인 글만 수정/삭제 가능하도록 DB에서 강제

## 7. 문서 단일 기준 (Source of Truth)
- `ARCHITECTURE.md`: 설계 기준
- `context.md`: 상태 로그
- `todo.md`: 진행 체크
- `copilot-instructions.md`: AI 지침
- 문서와 코드가 불일치하면 문서를 먼저 갱신한다.
