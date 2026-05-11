# 프로젝트 컨텍스트 (my-first-web)

## 기준 정보
- 워크스페이스: my-first-web
- 최신 갱신일: 2026-05-11
- 스택: Next.js 16.2.1 (App Router), React 19.2.4, Tailwind CSS v4, shadcn/ui
- Supabase: Chapter 8 DB 연동 완료, Chapter 9 Auth 준비

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
- 스타일은 Tailwind CSS v4와 shadcn/ui 토큰을 우선 사용한다
- 브라운 테마의 `--primary: #8B6B4E`를 주요 색상으로 사용한다
- 배경은 밝고 깔끔한 톤(`--background: #FBF8F3`)을 유지한다
- 메인 컨텐츠는 `max-w-4xl mx-auto`를 기준으로 정렬한다
- UI 프리미티브는 설치된 shadcn/ui 컴포넌트(button, card, input, dialog, textarea, label)를 우선 사용한다

## 데이터 모델 및 인증 현재 상태
- **Chapter 8 완료**: Supabase DB 연동 (posts 테이블, 실제 insert/read)
- **Chapter 9 준비**: Email/Password 인증 (로그인, 회원가입, 로그아웃)
- `profiles` 테이블: `id(uuid, PK)`, `email`, `name`, `role`, `created_at`
- `posts` 테이블: `id(uuid, PK)`, `title`, `content`, `category`, `user_id(profiles.id FK)`, `created_at`
- **Ch9 새로 추가될 파일**:
  - `lib/auth.ts`: signInWithEmail, signUpWithEmail, signOut 함수
  - `contexts/AuthCon8 완료 기준)
- Chapter 7 요구사항에 맞춘 4대 핵심 문서 세팅 완료
- Supabase 프로젝트 연결 및 마이그레이션 완료(`20260504043926_create_tables.sql`)
- `lib/supabase/client.ts` 생성 (createBrowserClient 기반)
- `/posts` 목록을 Supabase 실제 데이터로 조회 구현
- `/posts/new` 글 작성 페이지를 Supabase insert로 구현
- Ch9 기준 문서 정비
- Chapter 7 요구사항에 맞춘 4대 핵심 문서(ARCHITECTURE, context, todo, copilot-instructions) 세팅 완료
- 필수 shadcn/ui(button, card, input, dialog, textarea, label) 설치 완료
- 브라운 테마 및 디자인 토큰 적용 완료
- ACh9 다음 액션
- lib/auth.ts 생성: signInWithEmail, signUpWithEmail, signOut 구현
- AuthProvider 또는 AuthContext 생성: 로그인 상태 전역 공유
- /app/login, /app/signup 페이지 구현: 실제 인증 폼 연결
- middleware.ts 생성: /posts/new, /posts/[id]/edit, /mypage 보호 라우트
- header/navigation에서 로그인 상태에 따라 "로그인/회원가입" 또는 "로그아웃" 버튼 표시
- 빠른 Supabase 연동이 필요하다
- 다음 액션: Chapter 8 기준으로 Supabase 프로젝트 연결과 클라이언트 초기화를 진행한다

## 문서 기준 계약 (Source of Truth)
- `ARCHITECTURE.md`: 설계 기준 단일 문서
- `context.md`: 현재 상태 + 기술 결정 로그
- `todo.md`: 단계별 체크리스트 + 진행률
- `copilot-instructions.md`: AI 지침