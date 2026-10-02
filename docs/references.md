# 공식 자료 및 버전 기록

확인일: 2026-10-02. 아래 문서와 실제 설치된 패키지의 타입·빌드 결과를 함께 확인했습니다. 정확한 의존성 해상도는 `shopify-app/package-lock.json`, `mobile/pubspec.lock`에 기록됩니다.

| 대상 | 선택 | 근거 |
|---|---|---|
| Shopify 앱 | React Router 공식 템플릿 | [공식 GitHub](https://github.com/Shopify/shopify-app-template-react-router), 가져온 커밋 `93348fe7dbd8e1a33eea69e2bbba1990d136b0da` |
| Shopify 서버 라이브러리 | `@shopify/shopify-app-react-router` 3.x, `shopify-api` 15.x | 템플릿 현재 의존성과 호환, 설치 lockfile 고정 |
| GraphQL Admin / Webhook | **2026-07** | [버전 정책](https://shopify.dev/docs/api/usage/versioning). 2026-10도 출시 시점이지만 지원되는 안정 2026-07에 명시적으로 고정하여 사용 |
| 토큰 | Expiring offline access token | [공식 안내](https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens), [이전 안내](https://shopify.dev/docs/apps/build/authentication-authorization/migrate-to-expiring-offline-access-tokens) |
| Flutter | 3.47.5 / Dart 3.13.4 | [수동 설치](https://docs.flutter.dev/install/manual), [SDK archive](https://docs.flutter.dev/install/archive) |
| Android | API 36 / JDK 21 | Flutter 현재 템플릿, [공식 Android 도구](https://developer.android.com/studio) |
| FCM | firebase_messaging 16.7.0 | [Flutter 클라이언트 안내](https://firebase.google.com/docs/cloud-messaging/flutter/get-started) |
| 재고 조회 | InventoryItem + selected inventoryLevel | [재고 항목](https://shopify.dev/docs/api/admin-graphql/2026-07/queries/inventoryItem), [재고 수준](https://shopify.dev/docs/api/admin-graphql/2026-07/queries/inventoryLevel) |
| 컴플라이언스 | 필수 3개 webhook | [개인정보 웹훅](https://shopify.dev/docs/apps/build/compliance/privacy-law-compliance) |
| 후속 배너 | Theme App Extension | [확장 구성](https://shopify.dev/docs/apps/build/online-store/theme-app-extensions/configuration) |
| 후속 과금 | Shopify App Pricing | [공식 과금 문서](https://shopify.dev/docs/apps/launch/billing/shopify-app-pricing). 계정별 사용 가능 여부는 로그인 후 확인 필요 |
| Play 결제 | 출시 국가별 추가 확인 필요 | [Google Play 결제 정책](https://support.google.com/googleplay/android-developer/answer/9858738). 이번 앱에는 외부 결제 버튼·우회 안내를 넣지 않음 |

Shopify AI Toolkit의 `admin` 스키마 validator로 `LOCATIONS`, `INVENTORY` 두 쿼리를 2026-07에 대해 검증했습니다. 둘 다 유효하며 `InventoryItem.variant`와 `ProductVariant.image`에는 deprecated 경고가 있습니다. 지원 버전에 존재하므로 이번 Phase 1에서는 유지하되 다음 버전 갱신에서 `variants`·`media` 전환과 다중 variant inventory 모델 영향을 함께 검증해야 합니다.

## API 갱신 절차

1. 현재 지원 종료일과 다음 안정 버전 release notes를 확인합니다.
2. 별도 개발 브랜치에서 `app/shopify.server.ts`, `.graphqlrc.ts`, `shopify.app.toml`의 세 버전을 함께 변경합니다.
3. 공식 스키마로 쿼리를 검증하고 필드 폐기·권한·페이지네이션 변화를 확인합니다.
4. 개발 매장에서 초기 동기화, 5→4 웹훅, 토큰 refresh, 설치 해제, compliance webhook을 다시 시험합니다.
5. 응답의 `X-Shopify-API-Version`이 요청 버전과 일치하는지 실제 요청에서 확인합니다. fallback된 응답을 정상 갱신으로 간주하지 않습니다.
6. 검증 기록과 lockfile을 갱신한 후 승인된 배포를 진행합니다.

## 의존성 주의

공식 템플릿 설치 직후 npm audit에서 취약점이 보고되어 lodash 4.18.1, minimatch 9.0.9, gaxios 6의 uuid 11.1.1 호환 override를 적용했습니다. 확인 시점에는 전체 audit에서 0개가 보고되었습니다. 이는 미래 취약점 부재를 보장하지 않습니다.

Flutter Android 빌드에서 Firebase 플러그인의 Kotlin Gradle Plugin 사용에 대한 차기 Flutter 호환성 경고가 있습니다. 이번 고정 버전에서 빌드는 성공했으며, Flutter 갱신 때 Firebase 플러그인의 Built-in Kotlin 전환 여부를 재확인해야 합니다.
