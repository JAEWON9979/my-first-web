# 블로그 아키텍처 설계서 (my-first-web)

## 1. 문서 목적
이 문서는 my-first-web 프로젝트의 설계 기준을 정의한다. Ch8~12에서 Supabase 연동, 인증, 마이페이지, CRUD 확장이 이어질 때 흔들리지 않도록 구조, 데이터, 권한, UI 원칙의 단일 기준을 제공한다.

## 2. 시스템 개요
- 제품 성격: 개인 블로그 및 포트폴리오 사이트
- 포함 콘텐츠: 개발 일지, 스터디 기록, 프로젝트 소개, 포스트 CRUD
- 라우팅 방식: Next.js 16.2.1 App Router 전용
- UI 스택: React 19.2.4, Tailwind CSS v4, shadcn/ui
- 디자인 방향: 밝고 깔끔한 배경 위에 브라운 톤 primary를 사용하는 정돈된 개인 블로그 스타일
- 메인 컨텐츠 폭: `max-w-4xl mx-auto`
- Supabase: Chapter 8에서 데이터/인증 연동 예정

## 3. 페이지 맵 (URL 구조)
| 경로 | 상태 | 목적 | 인증 요구사항 |
| --- | --- | --- | --- |
| `/` | 구현됨 | 홈 및 소개 진입점 | 없음 |
| `/posts` | 구현됨 | 전체 글 목록 확인 | 없음 |
| `/posts/new` | 구현됨 | 새 글 작성 화면 | 로그인 필요(예정 보호 경로) |
| `/posts/[id]` | 구현됨 | 글 상세 확인 | 없음 |
| `/posts/[id]/edit` | 구현됨 | 기존 글 수정 | 로그인 필요(예정 보호 경로) |
| `/development-log` | 구현됨 | 개발 일지 카테고리 | 없음 |
| `/projects` | 구현됨 | 프로젝트 카테고리 | 없음 |
| `/study-log` | 구현됨 | 스터디 기록 카테고리 | 없음 |
| `/login` | 뼈대 구현 | 로그인 화면 진입 | 없음 |
| `/signup` | 뼈대 구현 | 회원가입 화면 진입 | 없음 |
| `/mypage` | 뼈대 구현 | 내 정보 및 본인 글 관리 | 로그인 필요(예정 보호 경로) |

보호 경로(예정): `/posts/new`, `/posts/[id]/edit`, `/mypage`

## 4. 컴포넌트 계층
### 4.1 앱 셸 (app/layout.tsx, max-w-4xl 컨테이너)
- `app/layout.tsx`
  - 전역 HTML 구조
  - 폰트 및 body 배경/텍스트 토큰 적용
  - `ThemeProvider`
  - `ToastProvider`
  - 공통 헤더와 푸터
- `max-w-4xl mx-auto` 컨테이너
  - 모든 주요 페이지의 공통 가로 폭 기준
  - 모바일에서는 `px-4`, 데스크톱에서는 `md:px-6` 계열의 여백 사용

### 4.2 주요 페이지 (홈, 포스트, 커스텀 카테고리 등)
- 홈(`/`)
  - 블로그 소개
  - 포스트/작성 진입 링크
- 포스트 목록(`/posts`)
  - 게시글 카드 목록
  - 검색/필터/정렬 확장 가능 영역
- 글 작성(`/posts/new`)
  - 입력 폼
  - `Card`, `Input`, `Textarea`, `Label`, `Button` 조합
- 글 상세(`/posts/[id]`)
  - 본문 표시
  - 수정/삭제 액션 영역
- 글 수정(`/posts/[id]/edit`)
  - 작성 폼과 유사한 편집 화면
- 커스텀 카테고리(`/development-log`, `/projects`, `/study-log`)
  - 주제별 카드형 목록 또는 요약 영역
- 인증 뼈대(`/login`, `/signup`, `/mypage`)
  - 중앙 정렬 카드형 레이아웃
  - Chapter 8~9에서 기능 연결 예정

### 4.3 UI 프리미티브 레이어 (설치된 shadcn/ui 목록)
- `button`
- `card`
- `input`
- `dialog`
- `textarea`
- `label`

## 5. 데이터 모델 초안 (Supabase)
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
- `category`: text
- `author_id`: uuid, FK -> `profiles.id`
- `created_at`: timestamp

### 관계
- `profiles` 1 : N `posts`
- 한 명의 사용자는 여러 개의 게시글을 작성할 수 있다
- 각 게시글은 정확히 하나의 작성자(`author_id`)를 가진다

## 6. 인증/권한 및 CRUD 흐름 매트릭스
| 기능 | 라우트/화면 | 인증 요구사항 | 비고 |
| --- | --- | --- | --- |
| 글 목록 조회 | `/posts` | 없음 | 공개 화면 |
| 글 상세 조회 | `/posts/[id]` | 없음 | 공개 화면 |
| 새 글 작성 | `/posts/new` | 필요(예정) | 로그인 사용자만 허용 |
| 글 수정 | `/posts/[id]/edit` | 필요(예정) | 작성자 본인만 허용 |
| 글 삭제 | 상세 화면 액션 | 필요(예정) | 작성자 본인만 허용 |
| 개발 일지 확인 | `/development-log` | 없음 | 공개 카테고리 |
| 프로젝트 확인 | `/projects` | 없음 | 공개 카테고리 |
| 스터디 기록 확인 | `/study-log` | 없음 | 공개 카테고리 |
| 로그인 | `/login` | 없음 | 인증 진입점 |
| 회원가입 | `/signup` | 없음 | 계정 생성 진입점 |
| 마이페이지 | `/mypage` | 필요(예정) | 본인 정보 및 본인 글 관리 |

## 7. 문서 단일 기준 (Source of Truth)
- `ARCHITECTURE.md`: 설계 기준
- `context.md`: 상태 로그
- `todo.md`: 진행 체크
- `copilot-instructions.md`: AI 지침
- 문서와 코드가 불일치하면 문서를 먼저 갱신한다.
