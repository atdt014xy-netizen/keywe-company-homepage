# StoreControl

Shopify 운영자를 위한 Flutter Android 앱과 Shopify 공식 React Router 템플릿 기반 서버입니다. FlutterFlow는 사용하지 않습니다.

**현재 범위: Phase 1 구현 및 로컬 검증. 실제 Shopify 설치·실기기 FCM 수신은 미검증이며, Phase 1 전체 완료로 선언하지 않습니다.** 할인·배너·구독은 후속 단계이고 이번 앱에서 실행할 수 없습니다.

## 먼저 실행하기

현재 PC에는 Flutter를 `C:\Users\USER\develop\flutter`, Android SDK를 `C:\Users\USER\develop\android-sdk`, JDK를 `C:\Users\USER\develop\jdk21`에 설치했습니다. 원본 프로젝트는 현재 폴더에 유지됩니다. 한글 경로에서 Flutter 분석기 문제가 있어 `C:\Users\USER\develop\storecontrol`이라는 폴더 연결도 만들었습니다.

```powershell
$env:Path = "$env:USERPROFILE\develop\flutter\bin;$env:Path"
Set-Location "$env:USERPROFILE\develop\storecontrol\mobile"
flutter pub get
flutter run -d chrome --dart-define=DEMO=true
```

이미 빌드된 웹 데모는 실행 중인 동안 [로컬 데모](http://127.0.0.1:8080)에서 볼 수 있습니다. 종료 후 다시 실행하려면 프로젝트 원본 폴더에서:

```powershell
python -m http.server 8080 --bind 127.0.0.1 --directory mobile/build/web
```

Docker·Shopify·Firebase 없이 서버 실행:

```powershell
Set-Location shopify-app
npm.cmd ci
npm.cmd run dev:local
```

`http://127.0.0.1:3000/health`가 DB 연결 상태를 반환합니다. 이 서버는 실제 API의 인증을 우회하지 않습니다. 계정 미설정 상태에서 모바일 API는 401을 반환합니다. 데모 앱은 이 서버에 연결하지 않고 별도의 메모리 저장소를 사용합니다.

## 문서

- [Windows 설치·실행 및 APK/AAB](docs/windows.md)
- [Shopify·Firebase 설정과 필요한 사용자 작업](docs/accounts.md)
- [설계·보안·운영](docs/architecture.md)
- [테스트와 최초 실제 연결 검증](docs/testing.md)
- [단계별 구현·검증 기록](docs/progress.md)
- [공식 문서·버전 선택](docs/references.md)

## 프로젝트

| 폴더 | 역할 |
|---|---|
| `mobile/` | Flutter Android 및 데모 검증용 Web, 한국어 기본 UI·영어 전환 |
| `shopify-app/app/` | 공식 Shopify 인증·설정 화면, 모바일 API·웹훅 |
| `shopify-app/server/` | PostgreSQL 저장소, 암호화 세션, 재고 동기화, 영속 큐·FCM 워커 |
| `shopify-app/tests/` | 실제 SQL 엔진 기반 핵심 동작 검증 |
| `docs/` | 한국어 실행·설정·검증 기록 |
| `docker-compose.yml` | 로컬 PostgreSQL 17 |

실제 계정 비밀값은 `.env`와 저장소 밖 서비스 계정 파일에만 보관하세요. 예제 파일에는 비밀값이 없습니다. 사용자 요청으로 한국어 웹 데모를 [Vercel](https://storecontrol-beryl.vercel.app)에 배포했습니다. 실제 Shopify 서버 배포·유료 가입·운영 쇼핑몰 변경은 수행하지 않았습니다.

디자인 변경과 검증 결과: [WARM ORANGE 기록](docs/warm-orange.md).
