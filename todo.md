# 프로젝트 체크리스트 (my-first-web)

## 전체 진행률
- 진행률: 25%
- 기준일: 2026-04-29

## 1단계. 아키텍처 및 설계 기초 (Chapter 7 완료) - 100%
- [x] 4대 핵심 문서(ARCHITECTURE, context, todo, copilot-instructions) 구축
- [x] 디자인 토큰 및 테마 설정(브라운 테마 --primary) 정리
- [x] 기본 페이지 맵(홈, posts, dev-log, projects, study-log, auth 뼈대) 생성
- [x] 필수 shadcn/ui 컴포넌트(button, card, input, dialog, textarea, label) 설치
- 검증 메모: Chapter 7 범위의 설계 문서와 App Router 뼈대가 실제 프로젝트 상태에 맞게 정리됨.

## 2단계. UI 고도화 및 와이어프레임 구현 - 0%
- [ ] 주요 페이지(/posts, /development-log)에 shadcn/ui Card를 활용한 레이아웃 적용
- [ ] 공통 메인 레이아웃(max-w-4xl) 세팅
- [ ] 입력 폼 디자인 가이드 준수
- 검증 메모: 현재는 뼈대와 설계가 우선 정리된 상태이며, 실제 UI 고도화는 다음 단계에서 진행 예정.

## 3단계. 데이터베이스 및 Supabase 연동 (Chapter 8 대비) - 0%
- [ ] users 테이블(id, email, name, role, created_at) 설계
- [ ] posts 테이블(id, title, content, category, author_id, created_at) 설계
- [ ] Supabase 프로젝트 연결 및 클라이언트 초기화
- [ ] 실데이터 Fetch/CRUD 흐름 정리

## 4단계. 최종 점검 및 제출 준비 - 0%
- [ ] 전체 라우트와 문서 정합성 점검
- [ ] 반응형 레이아웃 최종 확인
- [ ] 제출 전 오탈자 및 링크 점검

## 즉시 다음 액션 (우선순위)
- `/posts`와 `/development-log` 페이지에 Card 기반 공통 레이아웃을 적용한다.
- 공통 메인 레이아웃을 `max-w-4xl` 기준으로 정리한다.