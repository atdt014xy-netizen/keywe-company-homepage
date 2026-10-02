# 단계별 구현·검증 기록

작성일: 2026-10-02 (한국 시간). 실제 실행 결과만 PASS로 기록합니다.

## 구현 완료

Phase 1의 소스 구현:

- Flutter Android 앱: 현황/알림/설정, 상품 상세·검색·필터·기준 설정·대응 기록, 로딩/빈 목록/오류/오래된 데이터 표시, 한국어 기본·영어 전환 (사용자 후속 요청 반영)
- 후속 로컬 미리보기: 헤더·본문·하단 메뉴 전체 최대 480px. 가상 상품 40개 옵션과 알림 기록 14개, 확인 기록·입고 후 재고 사례를 포함합니다. 이 변경은 사용자 요청에 따라 Vercel에 배포하지 않습니다.
- 별도 DemoRepository와 LiveRepository, 모든 화면의 데이터 모드 배너, 데모 세션 독립
- Firebase 이메일 인증 로그인, 일회용 UID·매장 바인딩 코드, secure storage, FCM 권한·토큰 등록/갱신/해제·상품 deep link 코드
- 공식 Shopify React Router 설치 흐름, 암호화 SessionStorage, expiring offline token refresh 사용
- 최소 읽기 권한·GraphQL 2026-07·선택 창고·옵션별 판매 가능 재고·페이지네이션
- 원문 HMAC 웹훅·중복 receipt·영속 SQL 큐·lease/재시도/실패 기록·주기 재동기화·설치 해제·필수 compliance webhook
- 재고 5→4·회복 후 재하락·품절 구분·초기 요약·방해금지·독립 알림함
- PostgreSQL Compose, Docker 없는 단일 프로세스 PGlite 대안, 서버 Dockerfile, 비밀값 없는 예제 설정
- Windows·계정·서명/AAB·배포·테스트 문서

**Phase 1 전체 완료는 아님:** 실제 매장·FCM·실기기 종단 검증을 아직 수행하지 못했습니다.

## 실제 실행·검증 완료

| 검사 | 결과 | 범위 |
|---|---|---|
| 서버 `npm test` | PASS, 20개 | PGlite SQL + 인증된 UID를 대입한 모바일 route 테스트. 실제 Firebase 프로젝트 시험 아님 |
| 서버 TypeScript | PASS | `npm run typecheck` |
| 서버 ESLint | PASS | `npm run lint` |
| 서버 프로덕션 빌드 | PASS | React Router client + server bundle |
| npm audit | PASS, 보고된 취약점 0개 | 확인 시점 lockfile |
| Flutter 분석 | PASS, No issues found | 영문 junction 경로 |
| Flutter 테스트 | PASS, 3개 | 화면 이동·검색·번역·데모 격리 |
| Flutter Web build | PASS | 실제 Flutter 데모 번들 |
| Android debug APK | PASS | `mobile/build/app/outputs/flutter-apk/app-debug.apk`, 데모 빌드 |
| GraphQL 공식 스키마 검증 | PASS, 쿼리 2개 | 2026-07, deprecated 필드 경고 기록 |
| 로컬 서버 실행 | PASS | `/health` 200, PGlite DB 연결 |
| 로컬 HTTP 인증 거부 | PASS | 미인증 모바일 요청 401, 무서명 웹훅 401 |
| 브라우저 직접 조작 | PASS | 현황→상품 상세, 알림 당시/현재 수량, 설정·한국어, 412px 휴대폰 너비 레이아웃 |

## 코드만 구현됨 / 실제 연결 미검증

- Shopify 설치 승인·창고 선택·실제 재고 동기화 및 webhook delivery
- Firebase 이메일 인증·실제 ID token 검증, FCM 송신·기기 수신
- 실제 Android 잠금·백그라운드·종료 상태와 deep link·재로그인 복귀
- 실제 token refresh/만료/재설치 및 Shopify compliance webhook
- 외부 PostgreSQL·복수 worker 경합, 컨테이너 빌드·서버 배포

알림 수신 성공의 필수 판정인 **개발 매장 5→4 → 폰에 1회 알림 → 해당 상품 열기**는 **NOT RUN**입니다. FCM 수락을 실제 수신으로 대체하지 않습니다.

## 실패 또는 차단 사항

| 항목 | 상태 |
|---|---|
| 처음의 Flutter 분석기 오류 | 한글 경로에서 LSP JSON 오류. 원본 보존 + 영문 junction으로 해결 |
| 모바일 화면 테스트 최초 실패 | 작은 테스트 viewport의 스크롤 전 항목 선택 문제. 실제 ListView를 스크롤하도록 고쳐 PASS |
| 템플릿 Git 메타데이터 삭제 | 자동 승인 검토에서 차단. 삭제 대신 `.local/template-git`로 보존 이동 |
| Vite 로컬 dev optimizer / junction 빌드 | 경로 정규화 문제. 원본 서버 경로에서 빌드한 bundle을 단일 프로세스로 실행하는 방식으로 해결 |
| Shopify CLI config validate | client ID가 비어 앱 연결 설정을 요구하여 미완료. 가짜 ID를 넣어 PASS 처리하지 않음 |
| 실제 계정/기기 | 자격 증명 없음, `adb devices` 연결 기기 없음 |
| 출시 AAB | 출시 서명키 없음, 미생성. release는 로컬 key.properties 없이 빌드 거부 |

## 사용자가 해야 할 최소 작업

1. [accounts.md](accounts.md)의 표에 따라 개발 Shopify 앱·매장, Firebase 프로젝트·Android 앱을 준비하고 비밀값을 로컬에 입력합니다.
2. 실제 폰을 연결하고 실제 모드 APK로 로그인·이메일 인증·일회용 매장 연결·푸시 권한을 완료합니다.
3. [testing.md](testing.md)의 최초 실제 연결 시험을 개발 매장에서 함께 수행합니다.

매장 주소·Firebase 프로젝트 ID·기기 준비 여부만 채팅으로 알려주면 됩니다. secret/서비스 계정 JSON/서명키는 보내지 마세요.

## 다음 단계

| 단계 | 현재 상태 | 다음 작업 |
|---|---|---|
| Phase 1 | 코드·로컬 검증 완료, 실연동 미검증 | 위 5→4 실기기 수신 시험, 실제 DB/재설치/권한 거부 검증 |
| Phase 2 | 미구현 | 명시적 옵션 선택·확인, 자동 할인 idempotency 원장·시작/종료·복구·감사 기록 |
| Phase 3 | 미구현 | Theme App Extension, 앱 소유 metafield, 부분 성공 복구·stale 숨김 |
| Phase 4 | 미구현 | 계정별 App Pricing 지원 확인, 구독 상태 서버 검증, Play 국가별 정책·개인정보/계정 삭제·심사 준비 |

Phase 2~4는 실행 완료·연동 완료로 보고하지 않습니다. 공개 배포·유료 기능 활성화·심사 제출은 수행하지 않았습니다.

## 변경 파일과 실행 명령

빈 저장소에서 `mobile/`, `shopify-app/`, `docs/`, `docker-compose.yml`, 루트 `.gitignore`·`README.md`를 생성했습니다. 주요 구현은 `mobile/lib`, `shopify-app/server`, `shopify-app/app/routes`에 있습니다. 정확한 전체 목록은 `git status --short --untracked-files=all`로 확인할 수 있습니다. Git 커밋·push·PR은 만들지 않았습니다.

- 데모: `flutter run -d chrome --dart-define=DEMO=true`
- 로컬 서버: `npm.cmd run dev:local`
- PostgreSQL: `docker compose up -d` → 서버 `npm.cmd run setup`
- 실제 개발 서버/worker: `npm.cmd run dev`, 별도 터미널 `npm.cmd run worker`
- 검증: `npm.cmd test`, `npm.cmd run typecheck`, `npm.cmd run lint`, `flutter analyze`, `flutter test`
- APK: `flutter build apk --debug --dart-define=DEMO=true`
