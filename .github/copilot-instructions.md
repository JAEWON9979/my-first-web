# GitHub Copilot Instructions for my-first-web

## Tech Stack
- Next.js 16.2.1 (App Router ONLY)
- React 19.2.4
- Tailwind CSS 4
- TypeScript
- shadcn/ui
	- installed components: button, card, input, dialog, textarea, label
- Supabase 연동 (Chapter 8 완료: 데이터베이스, Chapter 9: 인증)
	- @supabase/supabase-js: 2.47.12
	- @supabase/ssr: 0.5.2
	- 클라이언트: lib/supabase/client.ts의 createBrowserClient 사용

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
- **기존 구조 유지:** 코드 변경 작업을 수행할 때는 현재 프로젝트의 파일 구조, 컴포넌트 설계 방식, 디자인 패턴을 항상 최대한 유지해야 합니다.
- **구조 변경 시 사전 고지:** 만약 더 나은 방식이 있거나 불가피한 이유로 기존 구조(뼈대)를 변경해야 할 경우, 임의로 코드를 수정하지 말고 반드시 변경해야 하는 이유와 기대 효과를 먼저 설명하고, 사용자의 동의를 구한 뒤에 실행하십시오.

## Coding Conventions
- 기본은 Server Component로 작성한다
- 상태 관리, 이벤트 처리, 브라우저 API가 필요할 때만 Client Component를 쓴다
- 데이터 페칭 로직은 페이지 컴포넌트에 직접 섞지 말고 lib/ 또는 hooks/로 분리한다
- App Router(app/ 폴더)만 사용한다
- 라우트는 app/ 아래 파일 기반으로만 생성한다
- 인증 로직은 lib/auth.ts에 집중하고, 화면 컴포넌트는 그 함수들만 호출하게 한다
- 보호 라우트는 middleware.ts로 관리한다

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
- Supabase Auth: signInWithPassword, signUp, signOut만 사용한다. 구버전 auth.signIn()은 절대 사용하지 않는다
- Supabase 인증: 클라이언트에 service_role 키를 절대 두지 않는다
- 의미 없는 use client를 붙이지 않는다
- 새로운 AI 실수를 발견하면 해당 패턴을 이 섹션에 즉시 추가하고, 이후 세션부터 동일 규칙을 자동 적용한다

- Cookies/쿠키 처리 관련: `setAll` 같은 쿠키 집합을 처리하는 콜백의 파라미터는 암시적 `any`를 허용하지 않습니다. 아래 예시처럼 명시적 타입을 항상 지정하세요. 주로 `middleware.ts`와 Server Action(`app/actions/*.ts`)에서 필요합니다.

```ts
// 권장 타입 표기 예시
setAll(
	cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>
) {
	cookiesToSet.forEach(({ name, value, options }) => {
		// NextResponse.cookies.set 또는 cookieStore.set에 전달
		response.cookies.set(name, value, options as unknown as Record<string, unknown>);
	});
}
```

이 규칙을 따르면 Vercel/Next.js 빌드에서 발생하는 `Parameter 'cookiesToSet' implicitly has an 'any' type` 에러를 예방할 수 있습니다.

## Change Logging
- 코드, 설정, 문서를 수정하면 docs/change-history.md도 함께 갱신한다
- 한 번의 작업 묶음은 하나의 변경 로그로 정리한다
- 변경 로그에는 요청 내용, 변경 파일, 핵심 변경 내용, 이유를 포함한다

## Docs Source of Truth
- ARCHITECTURE.md: 라우트, 컴포넌트 계층, 데이터 모델 설계의 단일 기준 문서
- context.md: 현재 상태와 기술 결정 로그
- todo.md: 단계별 체크리스트와 진행률
- 문서와 코드가 다르면 문서를 먼저 갱신하고, 이후 코드를 문서 기준으로 맞춘다. AI가 임의로 구조를 바꾸지 않는다.