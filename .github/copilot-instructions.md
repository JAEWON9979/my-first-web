# GitHub Copilot Instructions for my-first-web

## Tech Stack
- Next.js 16.2.1 (App Router ONLY)
- React 19.2.4
- Tailwind CSS 4
- TypeScript
- shadcn/ui
	- installed components: button, card, input, dialog, textarea, label
- Supabase는 Chapter 8에서 연동 예정

## Design Tokens
- Primary Color: #8B6B4E
- Background Color: #FBF8F3
- Text Color: #3A2E26
- Layout: 메인 컨텐츠 최대 너비는 max-w-4xl mx-auto
- Spacing: 컨텐츠 간격은 space-y-6, 카드 내부는 p-6
- Responsive: md 이상은 2열 그리드, 모바일은 1열 스택
- 색상은 Tailwind 기본 팔레트보다 CSS 변수와 shadcn/ui 토큰을 우선 사용

## Component Rules
- UI 컴포넌트는 shadcn/ui를 우선 사용한다
- Button, Card, Input, Dialog, Textarea, Label을 먼저 활용한다
- 새로운 UI가 필요하면 components/ui/ 안의 컴포넌트를 먼저 검토한다
- 필요할 때만 커스텀 컴포넌트를 components/ 루트에 둔다
- 페이지 뼈대는 가능한 한 Card와 기본 레이아웃으로 단순하게 구성한다

## Coding Conventions
- 기본은 Server Component로 작성한다
- 상태 관리, 이벤트 처리, 브라우저 API가 필요할 때만 Client Component를 쓴다
- 데이터 페칭 로직은 페이지 컴포넌트에 직접 섞지 말고 lib/ 또는 hooks/로 분리한다
- App Router(app/ 폴더)만 사용한다
- 라우트는 app/ 아래 파일 기반으로만 생성한다
- 인증 라우트는 현재 뼈대 수준으로 유지하고, 실제 인증 로직은 Chapter 8 이후에 연결한다

## Project Structure
- 홈: /
- 포스트 목록: /posts
- 글 작성: /posts/new
- 글 상세: /posts/[id]
- 글 수정: /posts/[id]/edit
- 커스텀 라우트: /development-log, /projects, /study-log
- 인증 라우트 뼈대: /login, /signup, /mypage

## Known AI Mistakes
- next/router를 사용하지 않는다. 항상 next/navigation을 사용한다
- pages/ Router를 만들지 않는다. App Router만 사용한다
- App Router 동적 라우트의 params는 await해서 사용한다
- Tailwind 기본 색상(bg-blue-500, text-red-400 등)을 직접 남발하지 않는다
- 디자인 토큰이 이미 정의되어 있으면 새 색상 체계를 임의로 추가하지 않는다
- 의미 없는 use client를 붙이지 않는다
- 새로운 AI 실수를 발견하면 해당 패턴을 이 섹션에 즉시 추가하고, 이후 세션부터 동일 규칙을 자동 적용한다

## Change Logging
- 코드, 설정, 문서를 수정하면 docs/change-history.md도 함께 갱신한다
- 한 번의 작업 묶음은 하나의 변경 로그로 정리한다
- 변경 로그에는 요청 내용, 변경 파일, 핵심 변경 내용, 이유를 포함한다

## Docs Source of Truth
- ARCHITECTURE.md: 라우트, 컴포넌트 계층, 데이터 모델 설계의 단일 기준 문서
- context.md: 현재 상태와 기술 결정 로그
- todo.md: 단계별 체크리스트와 진행률
- 문서와 코드가 다르면 문서를 먼저 갱신하고, 이후 코드를 문서 기준으로 맞춘다. AI가 임의로 구조를 바꾸지 않는다.