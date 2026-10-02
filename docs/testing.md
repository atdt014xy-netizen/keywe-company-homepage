# 테스트 및 실제 연결 판정

## 자동 검사

서버는 원본 폴더에서:

```powershell
Set-Location shopify-app
npm.cmd ci
npm.cmd test
npm.cmd run typecheck
npm.cmd run build
npm.cmd run lint
npm.cmd audit
```

모바일은 영문 폴더 연결에서:

```powershell
Set-Location "$env:USERPROFILE\develop\storecontrol\mobile"
flutter analyze
flutter test
flutter build web --dart-define=DEMO=true
flutter build apk --debug --dart-define=DEMO=true
```

서버 테스트는 PGlite에서 실제 schema.sql과 SQL 트랜잭션을 실행합니다. 실 운영 PostgreSQL 다중 프로세스 경쟁은 별도 검증 대상입니다. 모바일 테스트는 Firebase를 초기화하지 않고 독립 데모 저장소를 사용합니다.

## 테스트 범위

| 항목 | 자동 검증 방식 |
|---|---|
| 타 매장 접근 차단 | membership 검사와 실제 모바일 read/write route의 403 |
| 코드 만료·재사용·계정·매장 바인딩 | 5분 경계, 잘못된 UID/매장, 두 번째 사용 거부 |
| 토큰 암호화 | 랜덤 IV, 복호화, ciphertext 변조 거부 |
| 웹훅 원문 서명 | 공백 포함 원문과 재직렬화 본문 차이·잘못된 서명 |
| 중복·역순 | receipt 중복 job 방지, 오래된 snapshot이 최신 수량을 덮어쓰지 않음 |
| 재고 기준 | 5→4, 4→3→2, 7→4, 0 이하 진입 |
| 미추적·창고 격리 | null 상태, 다른 창고 무시, 매장별 수량 분리 |
| 초기 연결 | 개별 푸시 없이 초기 요약 하나 |
| 방해금지 | Asia/Seoul 자정 교차, 뉴욕 DST, 회복 시 요약 제외 |
| 옵션 설정 | 개별 기준, 알림 비활성화 |
| 설치 해제 | 세션·기기·회원·코드 제거, queued 작업 취소 |
| 큐 복구 | 임대 만료 회수, 이전 worker lease 배제, backoff·실패 기록 |
| 구독 준비 로직 | 만료·오래된 검증 상태에서 새 할인 권한 거부. 실제 결제 연동 테스트 아님 |
| 모바일 | 현황→상세, 알림함, 설정, 검색·빈 목록, 영어→한국어, 데모 저장소 독립 |

## 로컬 HTTP smoke

`npm run dev:local` 실행 후:

```powershell
Invoke-RestMethod http://127.0.0.1:3000/health
```

실행 중 확인한 기대 응답:

- `/health` → 200, `status=ok`, `shopifyConnected=not-asserted`
- 인증 없이 `/api/mobile/overview?shop=alpha.myshopify.com` → 401
- 원문 서명 없이 POST `/webhooks/events` → 401

## 첫 실제 연결 성공 기준 — 아직 수행하지 않음

“개발용 Shopify 매장의 선택한 옵션·창고 재고를 5에서 4로 변경하면, 서버가 이벤트를 처리하고 실제 안드로이드 폰에 한 번 알림이 도착하며, 알림 선택 시 해당 상품이 열린다.”

1. 개발 매장·옵션 GID·창고 GID·Android 기종/OS·앱 빌드를 기록합니다.
2. 설치 승인 → 창고 선택 → 초기 동기화 → verified Firebase 계정 연결 → 푸시 권한을 완료합니다.
3. 선택 옵션 판매 가능 수량을 5로 맞추고 앱과 서버에 반영된 것을 확인합니다.
4. 같은 옵션·창고를 4로 바꾸고 `webhook_receipts`, `jobs`, `inventory`, `alerts`를 확인합니다.
5. 폰 수신 시각·알림 개수·탭 후 상품·옵션·창고를 확인합니다.
6. 4→3→2에서 반복 부족 알림이 없는지, 5 이상 회복 후 다시 4에서 새 알림이 오는지 확인합니다.
7. 0 진입 품절 알림을 별도 확인합니다.
8. 잠금, 백그라운드, 일반 종료에서 각각 반복합니다. 강제 종료는 별도 제한 사례로 기록합니다.
9. 로그인 만료 상태에서 알림 선택 → 재로그인 → 원래 상품으로 이동을 확인합니다.
10. 권한 거절, 토큰 갱신, 로그아웃, 매장 연결 해제, Shopify 설치 해제 후 접근 중단을 확인합니다.

서버의 `fcm_accepted`만으로 5번을 PASS 처리하면 안 됩니다. 테스트 알림은 재고 변경 시험을 대체하지 않습니다. 자동 테스트 통과도 개발 매장 실증을 대신하지 않습니다.

## 후속 단계 필수 시험

현재 미구현인 Phase 2~4에 대해서는 테스트를 통과했다고 보고하지 않습니다. 할인 반복 클릭/네트워크 응답 유실, 다른 매장 옵션·타 앱 할인 변경 거부, 자동 종료·수동 종료, 할인 성공/배너 실패 복구, stale 배너 숨김, 실제 구독 만료 후 조회/종료/새 실행 권한을 해당 기능 구현 시 추가해야 합니다.
