# Copilot Instructions

## Tech Stack
- Next.js 16.2.1 (App Router ONLY)
- Tailwind CSS ^4

## Coding Conventions
- 기본은 Server Component로 작성한다.
- 스타일링은 Tailwind CSS만 사용한다.
- 명시적으로 요청되지 않았다면 다른 css 프레임워크나 라이브러리를 사용하지 않는다.

## Known AI Mistakes
- next/router 사용 금지. 반드시 next/navigation 사용.
- Pages Router(pages/ 기반) 사용 금지. App Router(app/ 기반)만 사용.
- App Router 동적 라우트에서 params는 await 필수.

## Change Logging
- 사용자가 별도로 요청하지 않아도, 코드/설정/문서 파일을 수정하거나 생성/삭제한 경우 `docs/change-history.md`를 자동으로 업데이트한다.
- 기록 형식은 날짜 기준 누적 로그로 유지하고, 최소한 `변경 파일`, `핵심 변경 내용`, `이유(있다면)`를 포함한다.
- 한 번의 요청에서 여러 파일을 수정했으면 하나의 묶음으로 정리해 중복 기록을 피한다.
