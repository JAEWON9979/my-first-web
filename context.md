# 프로젝트 컨텍스트 (my-first-web)

## 기준 정보
- 워크스페이스: my-first-web
- 최신 갱신일: 2026-04-29
- 스택: Next.js 16.2.1 (App Router), React 19.2.4, Tailwind CSS v4, shadcn/ui
- Supabase: Chapter 8에서 연동 예정

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
- 현재는 UI 뼈대만 존재한다
- Chapter 8에서 Supabase Auth 및 DB 연동을 진행할 예정이다
- `profiles` 테이블 예정: `id(uuid, PK)`, `email`, `name`, `role`, `created_at`
- `posts` 테이블 예정: `id(uuid, PK)`, `title`, `content`, `category`, `author_id(profiles.id FK)`, `created_at`
- 인증/CRUD는 아직 정적 상태이며 실제 데이터 연결 전 단계다

## 최근 반영 사항 (Chapter 7 완료 기준)
- Chapter 7 요구사항에 맞춘 4대 핵심 문서(ARCHITECTURE, context, todo, copilot-instructions) 세팅 완료
- 필수 shadcn/ui(button, card, input, dialog, textarea, label) 설치 완료
- 브라운 테마 및 디자인 토큰 적용 완료
- App Router 기준의 주요 라우트와 인증 뼈대 생성 완료

## 남은 리스크 및 다음 액션
- 실제 DB가 연결되지 않아 현재는 정적 UI만 존재한다
- 빠른 Supabase 연동이 필요하다
- 다음 액션: Chapter 8 기준으로 Supabase 프로젝트 연결과 클라이언트 초기화를 진행한다

## 문서 기준 계약 (Source of Truth)
- `ARCHITECTURE.md`: 설계 기준 단일 문서
- `context.md`: 현재 상태 + 기술 결정 로그
- `todo.md`: 단계별 체크리스트 + 진행률
- `copilot-instructions.md`: AI 지침