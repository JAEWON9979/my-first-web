# 프로젝트 체크리스트 (my-first-web)

## 전체 진행률
- 진행률: 85% (Ch8~Ch11 핵심 완료, 최종 검수만 남음)
- 기준일: 2026-05-18

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

## 3단계. Supabase Authentication (Chapter 9) - 100%
- [x] Supabase CLI 연결 확인 및 Auth Provider 설정 확인
- [x] lib/auth.ts 생성 (signInWithEmail, signUpWithEmail, signOut)
- [x] AuthProvider 또는 AuthContext 생성 및 app/layout.tsx 연결
- [x] /app/login 페이지 구현 (이메일/비밀번호 로그인)
- [x] /app/signup 페이지 구현 (이메일/비밀번호 회원가입)
- [x] header에서 로그인 상태 표시 (로그인/회원가입 <-> 로그아웃)
- [x] middleware.ts 생성 (보호 라우트: /posts/new, /posts/[id]/edit, /mypage)
- [x] 시나리오 검증 (로그인 후 글쓰기, 로그아웃 후 /posts/new 접근 차단)
- 검증 메모: 이메일/비밀번호 인증만 사용, 구버전 auth.signIn() 금지, 보호 라우트 middleware 기반

추가 메모:
- 로그인/회원가입 직후 `profiles.username` 동기화 보강
- 작성자 표시를 `@` 앞부분 / UUID 앞 8자리 폴백 규칙으로 통일

## 4단계. 게시글 CRUD (Chapter 10) - 100%
- [x] /posts 목록을 Supabase posts 테이블로 조회 연결
- [x] /posts/[id] 상세 조회를 posts 단일 조회로 연결
- [x] /posts/new 게시글 작성 insert 연결
- [x] /posts/[id]/edit 게시글 수정 update 연결
- [x] 게시글 상세 화면에서 삭제 delete 연결
- [x] 로그인 사용자와 작성자 일치 여부에 따라 수정/삭제 버튼 노출
- 검증 메모: `posts` 테이블의 `id`, `user_id`, `title`, `content`, `created_at` 컬럼만 사용하고, `next/router`는 사용하지 않음

추가 메모:
- 목록/상세 작성자 표시를 `profiles.username` 기반으로 통일하고 `formatAuthorName()` 헬퍼를 사용함
- 메인 목록의 localStorage 기반 상태 저장과 JSONPlaceholder local hook을 제거함
- `npm run build` 성공 확인 완료

## 5단계. 권한 및 고급 기능 (Chapter 11 이후) - 100%
- [x] Supabase CLI 마이그레이션으로 posts RLS 정책 추가
- [x] posts.user_id = auth.uid() 기준으로 SELECT / INSERT / UPDATE / DELETE 정책 정리
- [x] 본인 글만 수정/삭제 가능 권한을 DB 레벨에서 강제
- [x] 클라이언트 UI 분기는 보안이 아니라는 점을 문서와 코드 주석에 일치시킴

## 6단계. 최종 점검 및 배포 - 60%
- [x] npm run build 성공 확인
- [x] Supabase db push로 RLS 마이그레이션 반영 확인
- [x] 민감 키 유출 검사(git grep) 결과 출력 없음
- [ ] 브라우저에서 회원가입 → 로그인 → 글쓰기 → 로그아웃 전체 흐름 검증
- [ ] 반응형 레이아웃 최종 확인
- [ ] 제출 전 오탈자 및 링크 점검

추가 메모:
- Next 16의 `middleware` deprecation 경고는 남아 있으나 빌드 자체는 성공
- Ch11 RLS 정책과 마이그레이션 반영은 완료되었고, 남은 작업은 최종 사용성 검수다.

## 즉시 다음 액션 (Ch11 우선순위)
1. 브라우저에서 회원가입 → 로그인 → 글쓰기 → 로그아웃 전체 흐름 검증
2. 반응형 레이아웃 최종 확인
3. 제출 전 오탈자 및 링크 점검
4. 필요 시 `middleware`를 `proxy`로 전환 검토