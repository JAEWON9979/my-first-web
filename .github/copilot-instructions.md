# GitHub Copilot Instructions for my-first-web

## Tech Stack
- Next.js 16.2.1 (App Router ONLY)
- React 19.2.4
- Tailwind CSS ^4
- **shadcn/ui** (`components/ui/` 경로에 설치됨)
- TypeScript

## Design Tokens (디자인 절대 규칙)
- **Primary Color:** `#8B6B4E` (따뜻한 브라운) -> Tailwind에서 `bg-primary`, `text-primary`로 사용
- **Background Color:** `#FBF8F3` (밝은 아이보리) -> `bg-background`로 사용
- **Text Color:** `#3A2E26` -> `text-foreground`로 사용
- **Layout:** 메인 컨텐츠 최대 너비는 `max-w-4xl mx-auto` 적용
- **Spacing:** 컨텐츠 간격은 `space-y-6`, 카드 내부는 `p-6` 사용
- **Responsive:** 데스크톱(md 이상)은 2열 그리드(`grid-cols-2`), 모바일은 1열 스택 적용

## Component Rules (UI 컴포넌트 사용 규칙)
- UI 컴포넌트는 반드시 `shadcn/ui`를 우선 사용한다. (예: `Button`, `Card`, `Input`, `Dialog` 등)
- 코드가 필요하면 `components/ui/` 폴더 내에 있는 컴포넌트를 import 해서 사용한다.
- **[경고]** Tailwind의 기본 색상(예: `bg-blue-500`, `text-red-400` 등)을 직접 하드코딩하지 마라. 반드시 위에서 정의한 디자인 토큰(CSS 변수)을 활용하라.
- 명시적으로 요청되지 않았다면 다른 CSS 프레임워크나 라이브러리를 추가로 사용하지 않는다.

## Coding Conventions
- 특별한 이유(상태 관리, 이벤트 처리 등)가 없으면 Server Component를 기본으로 작성한다.
- 데이터 페칭 로직은 향후 데이터베이스 연동을 고려하여 페이지 컴포넌트 내부에 섞지 말고 `lib/` 또는 커스텀 훅(`hooks/`)으로 분리한다.

## Known AI Mistakes (절대 금지 사항)
- `next/router` 사용 금지. 반드시 `next/navigation` 사용.
- Pages Router(`pages/` 기반) 사용 금지. App Router(`app/` 기반)만 사용.
- App Router 동적 라우트에서 `params`는 `await` 필수.

## Change Logging (자동 기록 규칙)
- 사용자가 별도로 요청하지 않아도, 코드/설정/문서 파일을 수정하거나 생성/삭제한 경우 `docs/change-history.md`를 자동으로 업데이트한다.
- 기록 형식은 날짜 기준 누적 로그로 유지하고, 최소한 `사용자가 요청한 명령을 그대로 작성`, `변경 파일`, `핵심 변경 내용`, `이유(있다면)`를 포함한다.
- 한 번의 요청에서 여러 파일을 수정했으면 하나의 묶음으로 정리해 중복 기록을 피한다.