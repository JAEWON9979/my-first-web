@AGENTS.md

# Claude 전용 규칙 (Ch7~Ch11)

## 공통 기준
- @AGENTS.md의 Version Policy와 Ch7/Ch8/Ch9 기준을 항상 준수한다.
- 교재 기준 버전이 우선이며, 실제 package.json 충돌 시 문서에 함께 표기한다.

## Ch9 진행 시 유의사항
- Supabase Auth는 signInWithPassword, signUp, signOut만 사용
- 구버전 auth.signIn() 절대 금지
- middleware.ts로 보호 라우트 구현
- 클라이언트에 service_role 키 절대 금지
- App Router만 사용 (pages router 금지)

## Ch11 진행 시 유의사항
- RLS는 SQL Editor가 아니라 Supabase CLI 마이그레이션으로 추가
- `posts.user_id = auth.uid()` 기준으로 정책을 분리
- UI에서 버튼을 숨기는 것은 보안이 아니므로 RLS를 우선
- SELECT, INSERT, UPDATE, DELETE 정책 조건을 각각 검토
