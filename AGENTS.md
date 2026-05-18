<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Ch7~Ch11 Shared Agent Rules

## Version & Stack (교재 기준 고정)

| 패키지 | 버전 | 설명 |
| --- | --- | --- |
| `next` | 16.2.1 | App Router 전용, pages router 금지 |
| `react` | 19.2.4 | Server Component 우선 |
| `tailwind` | v4 | 기본 팔레트 사용 금지, 토큰 우선 |
| `@supabase/supabase-js` | 2.47.12 | 실제 package.json이 더 최신일 수 있음 |
| `@supabase/ssr` | 0.5.2 | createBrowserClient 사용 |

> 주의: 실제 package.json이 교재 기준보다 최신일 수 있습니다. 이 경우 문서에 **교재 기준**과 **현재 설치 기준**을 함께 표기합니다.

## Ch7 기준 (설정 & 설계)
- Next.js 16.2.1 App Router 전용
- Tailwind CSS v4 + shadcn/ui (button, card, input, dialog, textarea, label)
- 디자인 토큰: Primary #8B6B4E, Background #FBF8F3
- 네비게이션: `next/navigation` 만 사용
- 레이아웃: `max-w-4xl mx-auto`

## Ch8 기준 (Supabase DB)
- Supabase 프로젝트 연결
- `lib/supabase/client.ts` 생성 (createBrowserClient)
- 환경변수: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- 데이터 모델: profiles, posts 테이블
- CRUD: /posts 목록 조회, /posts/new insert

## Ch9 기준 (Supabase Auth)
- Email/Password 인증만 (소셜 로그인 금지)
- signInWithPassword, signUp, signOut 함수 사용
- 구버전 auth.signIn() 절대 금지
- 보호 라우트: middleware.ts 기반
- 파일: lib/auth.ts, AuthProvider, /login, /signup, middleware.ts

## Ch11 기준 (Supabase RLS)
- 보안 강제는 항상 RLS가 담당한다. UI 버튼 숨김이나 화면 분기는 사용자 경험일 뿐 보안 근거로 삼지 않는다.
- RLS는 SQL Editor 직접 실행이 아니라 Supabase CLI 마이그레이션 파일로만 남긴다.
- `posts` RLS 적용 여부와 정책 내용은 문서와 마이그레이션 파일 경로를 함께 기록한다.
- 대상 테이블은 `posts`이며, `user_id = auth.uid()` 기준으로 정책을 만든다.
- UI 분기는 보안이 아니며, 실제 보안은 RLS가 담당한다.
- `service_role` 키는 클라이언트에서 절대 사용하지 않는다
- SELECT, INSERT, UPDATE, DELETE 정책을 각각 명시적으로 검토한다
