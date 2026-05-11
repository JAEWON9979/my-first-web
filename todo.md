# 프로젝트 체크리스트 (my-first-web)

## 전체 진행률
- 진행률: 40% (Ch8 완료, Ch9 준비)
- 기준일: 2026-05-11

## 1단계. 아키텍처 및 설계 기초 (Chapter 7 완료) - 100%
- [x] 4대 핵심 문서(ARCHITECTURE, context, todo, copilot-instructions) 구축
- [x] 디자인 토큰 및 테마 설정(브라운 테마 --primary) 정리
- [x] 기본 페이지 맵(홈, posts, dev-log, projects, study-log, auth 뼈대) 생성
- [x] 필수 shadcn/ui 컴포넌트(button, card, input, dialog, textarea, label) 설치
- 검증 메모: Chapter 7 범위의 설계 문서와 App Router 뼈대가 실제 프로젝트 상태에 맞게 정리됨.

## 2단계. Supabase 데이터베이스 및 클라이언트 (Chapter 8 완료) - 100%
- [x] Supabase 프로젝트 연결
- [x] 마이그레이션 파일(profiles, posts) 생성
- [x] lib/supabase/client.ts 생성 (createBrowserClient)
- [x] /posts 목록을 Supabase 조회로 변경
- [x] /posts/new 글 작성을 Supabase insert로 구현
- 검증 메모: 실제 데이터가 Supabase에 저장되고 조회되는 것을 확인함.

## 3단계. Supabase Authentication (Chapter 9) - 0%
- [ ] Supabase CLI 연결 확인 및 Auth Provider 설정 확인
- [ ] lib/auth.ts 생성 (signInWithEmail, signUpWithEmail, signOut)
- [ ] AuthProvider 또는 AuthContext 생성 및 app/layout.tsx 연결
- [ ] /app/login 페이지 구현 (이메일/비밀번호 로그인)
- [ ] /app/signup 페이지 구현 (이메일/비밀번호 회원가입)
- [ ] header에서 로그인 상태 표시 (로그인/회원가입 <-> 로그아웃)
- [ ] middleware.ts 생성 (보호 라우트: /posts/new, /posts/[id]/edit, /mypage)
- [ ] 시나리오 검증 (로그인 후 글쓰기, 로그아웃 후 /posts/new 접근 차단)
- 검증 메모: 이메일/비밀번호 인증만 사용, 구버전 auth.signIn() 금지, 보호 라우트 middleware 기반

## 4단계. 권한 및 고급 기능 (Chapter 10 이후) - 0%
- [ ] RLS (Row-Level Security) 정책 설정
- [ ] 본인 글만 수정/삭제 가능 권한 제어

## 5단계. 최종 점검 및 배포 - 0%
- [ ] npm run build 성공 확인
- [ ] 브라우저에서 회원가입 → 로그인 → 글쓰기 → 로그아웃 전체 흐름 검증
- [ ] 반응형 레이아웃 최종 확인
- [ ] 제출 전 오탈자 및 링크 점검

## 즉시 다음 액션 (Ch9 우선순위)
1. 이 문서 + context.md, copilot-instructions.md, ARCHITECTURE.md 정비 완료
2. Supabase CLI 연결 상태 확인 (`npx supabase projects list`)
3. Supabase 대시보드에서 Auth Email Provider 및 URL Configuration 확인
4. lib/auth.ts 파일 생성 및 테스트