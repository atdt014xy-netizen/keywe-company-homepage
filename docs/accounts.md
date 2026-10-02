# 실제 계정 설정과 필요한 사용자 작업

## 한 번에 준비할 항목

| 항목 | 입력 위치 | 채팅 전달 여부 |
|---|---|---|
| 개발용 매장 `name.myshopify.com` | Shopify CLI·모바일 연결 화면 | 공유 가능 |
| Shopify 개발 앱 client ID | `shopify.app.toml`의 `client_id`, `.env`의 `SHOPIFY_API_KEY` | 공개 식별자이나 로컬 입력 권장 |
| Shopify 앱 secret | `.env`의 `SHOPIFY_API_SECRET` | **전달 금지** |
| 서버 세션 암호화 키 | `.env`의 `TOKEN_ENCRYPTION_KEY` | **전달 금지** |
| HTTPS 개발 서버 주소 | `SHOPIFY_APP_URL`, 모바일 `API_BASE`, 앱 URL·리디렉션 | 공유 가능 |
| Firebase 프로젝트 ID | 서버 `.env`, 모바일 설정 | 공유 가능 |
| Firebase Android 앱 설정 | `mobile/config.live.json` | 로컬 입력 권장 |
| Firebase Admin 서비스 계정 파일 | 저장소 밖에 보관, `GOOGLE_APPLICATION_CREDENTIALS`에 경로만 입력 | **내용 전달 금지** |
| 안드로이드 실기기 | USB 디버깅·Google Play services·인터넷 | 준비 여부만 알려주세요 |

계정이 없더라도 데모·로컬 서버·자동 테스트는 독립 실행할 수 있습니다. 유료 가입, 운영 매장 수정, 공개 배포는 자동으로 수행하지 않습니다.

## Shopify

1. Shopify Dev Dashboard에서 앱과 **개발용 매장**을 준비합니다.
2. 공식 CLI에서 `npm.cmd run config:link`로 해당 앱에 연결합니다. 실제 client ID가 없으면 `config:validate`도 연결 설정 단계에서 차단됩니다.
3. 최초 요청 권한은 `read_products,read_inventory,read_locations`입니다. 할인·테마 쓰기 권한, 고객·주문 권한을 요구하지 않습니다.
4. `.env`의 앱 키·secret·HTTPS URL을 입력합니다. Shopify 앱 secret과 설치 후 발급되는 **매장별 접근 토큰은 서로 다릅니다**. 접근 토큰을 수동으로 모바일에 입력하지 않습니다.
5. `npm.cmd run setup`, `npm.cmd run dev`, 별도 터미널 `npm.cmd run worker`로 실행합니다. 개발 터널 URL이 바뀌면 모바일 API_BASE도 갱신합니다.
6. 개발 매장 관리자가 설치 승인합니다. 공식 React Router 라이브러리가 설치 인증·token exchange·expiring offline token refresh를 처리합니다.
7. Shopify 앱 화면에서 실제 창고 하나를 선택하고 최초 동기화가 끝날 때까지 기다립니다.

암호화 키는 예를 들어 다음 명령으로 **로컬 파일에 직접 기록**할 수 있습니다. 출력값을 채팅에 붙이지 마세요. 기존 키를 덮어쓰면 저장된 토큰을 복호화할 수 없으므로 기존 설정을 먼저 확인합니다.

```powershell
node -e "const fs=require('fs'); fs.appendFileSync('.env','\nTOKEN_ENCRYPTION_KEY='+require('crypto').randomBytes(32).toString('base64')+'\n')"
```

## Firebase

1. Firebase 프로젝트에서 Authentication의 Email/Password 제공자를 활성화합니다. 로그인 시 이메일 인증 완료를 서버와 앱 양쪽에서 확인합니다.
2. Android 앱 `com.storecontrol.storecontrol`을 등록하고 앱 공개 설정을 `mobile/config.live.json`에 입력합니다. 기본 초기화는 `FirebaseOptions`로 수행합니다.
3. 프로젝트의 Cloud Messaging API 사용 가능 상태를 확인합니다. Admin SDK에 필요한 권한만 부여한 서비스 계정 JSON은 저장소 밖에서 관리합니다. 클라우드 배포 시에는 서비스 계정 키 파일보다 해당 플랫폼의 workload identity/ADC를 우선 사용합니다.
4. 서버 `FIREBASE_PROJECT_ID` 및 `GOOGLE_APPLICATION_CREDENTIALS`를 설정합니다. Firebase 서버 Admin 키와 모바일 API key를 혼동하지 않습니다.
5. 실제 모드 Android 앱을 설치하고 계정을 만들고 이메일 인증 후 로그인합니다.
6. 앱에 표시된 모바일 UID를 Shopify 앱의 연결 양식에 입력합니다. 발급된 코드를 **같은 UID·같은 매장**으로 5분 안에 한 번만 사용합니다. 매장 주소만 알아서는 접근할 수 없습니다.
7. 설정에서 푸시 권한을 허용합니다. 기기 토큰이 서버에 등록된 뒤 테스트 알림을 보냅니다.

## 기기 확인

잠금·백그라운드·종료 상태는 서로 다른 시험 항목입니다. Android 설정의 **강제 종료(force stop)** 후에는 앱을 직접 다시 열기 전까지 FCM 수신이 제한될 수 있습니다. 일반 앱 종료와 혼동하지 마세요.

푸시 발송 성공은 서버의 `fcm_accepted` 기록입니다. 실제 기기 수신은 별도 관찰·스크린샷·시각으로 기록해야 합니다. 수신 후 상품 상세 이동까지 확인해야 최초 연동 PASS로 볼 수 있습니다.

로그아웃 시 서버에서 해당 기기 토큰을 해제하고 보안 저장소를 정리합니다. 네트워크가 끊긴 상태에서는 서버 해제를 확인할 수 없으므로 로그아웃 작업이 오류를 표시합니다. 모바일 계정 연결 해제는 다른 운영자의 매장 연결에 영향을 주지 않습니다. Shopify 설치 해제는 그 매장의 모든 모바일 접근·푸시·작업을 중단합니다.
