# Architecture - my-first-web

## 1. Page Map (URL Structure)
- `/` : 홈 (랜딩 페이지)
- `/posts` : 전체 글 목록
- `/posts/[id]` : 글 상세 보기
- `/posts/new` : 새 글 작성
- `/posts/[id]/edit` : 글 수정
- `/login` : 로그인
- `/signup` : 회원가입
- `/mypage` : 마이페이지 (내 글 관리)

## 2. User Flow
1. **글 읽기:** 홈 -> 포스트 목록 -> 카드 클릭 -> 상세 페이지
2. **글 작성:** 포스트 목록 -> '글쓰기' 버튼 -> (로그인 체크) -> 작성 폼 -> 제출 -> 상세 페이지로 리다이렉트
3. **글 수정:** 상세 페이지 -> '수정' 버튼 -> 수정 폼 -> 저장 -> 상세 페이지 반영

## 3. Data Model (Planned for Ch 8)
- **posts 테이블:** id(UUID), title(text), content(text), author_id(UUID), category(text), tags(text[]), created_at(timestamp)
- **users 테이블:** id(UUID), email(text), name(text), avatar_url(text)

## 4. Component Hierarchy
- `Layout`: Header(Nav), Footer 포함
- `PostListContainer`: 검색, 필터, 정렬 기능 포함 카드 목록
- `Editor`: ReactQuill 기반 에디터 컴포넌트
