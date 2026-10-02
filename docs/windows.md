# Windows 설치 및 실행

## 이번 PC에서 확인한 환경

- Windows PowerShell 7, Node.js 24.18.0, npm 11.16.0, Git
- Flutter 3.47.5 / Dart 3.13.4 (공식 Git 태그 설치)
- JDK 21: `%USERPROFILE%\develop\jdk21\jdk-21.0.12.1+1`
- Android SDK: `%USERPROFILE%\develop\android-sdk`
- Flutter SDK: `%USERPROFILE%\develop\flutter`
- Android API 36, Build Tools 36.0.0, NDK 28.2.13676358. 플러그인이 요구하는 API 34·35도 설치됩니다.
- Docker Desktop과 외부 PostgreSQL 서버는 설치되어 있지 않습니다.

전역 PATH는 변경하지 않았습니다. 현재 PowerShell 창에서 설정하세요.

```powershell
$env:Path = "$env:USERPROFILE\develop\flutter\bin;$env:Path"
$env:JAVA_HOME = "$env:USERPROFILE\develop\jdk21\jdk-21.0.12.1+1"
$env:ANDROID_HOME = "$env:USERPROFILE\develop\android-sdk"
$env:Path = "$env:ANDROID_HOME\platform-tools;$env:Path"
```

다른 PC는 Flutter 공식 설치 안내 및 Android Studio SDK Manager를 이용하세요. SDK 라이선스는 `flutter doctor --android-licenses`, 환경은 `flutter doctor -v`로 확인합니다. 이번에 사용한 명령행 SDK 도구에는 `sdkmanager` 사용 중단 예정 경고가 있으므로 후속 설치에서는 Android CLI 안내를 확인하세요.

## 경로 주의

Flutter 3.47.5 분석기가 한글 경로에서 LSP JSON 파싱 오류로 종료했습니다. 원본은 이동하지 않고 영문 junction을 만들어 해결했습니다.

```powershell
New-Item -ItemType Junction -Path "$env:USERPROFILE\develop\storecontrol" -Target "C:\Users\USER\Documents\ChatGPT\어플만들기"
```

이미 존재하면 다시 만들지 마세요. **Flutter 명령만 이 영문 경로에서 실행**합니다. React Router 빌드는 junction과 원본의 경로 해석 차이가 있으므로 **원본 `shopify-app` 경로**에서 실행하세요. 새로운 PC에서는 처음부터 `C:\dev\StoreControl` 같은 영문 경로를 권장합니다.

## 데모

```powershell
Set-Location "$env:USERPROFILE\develop\storecontrol\mobile"
flutter pub get
flutter run -d chrome --dart-define=DEMO=true
```

Android USB 디버깅이 활성화된 기기를 연결한 뒤:

```powershell
flutter devices
flutter run --dart-define=DEMO=true
```

데모는 계정 없이 실행됩니다. 재고 기준·알림 대응·설정 변경은 메모리에만 남고 앱 재시작 시 초기화됩니다. 설정에서 연결 오류·빈 목록을 재현할 수 있습니다. 상품 이미지는 명확한 플레이스홀더이며 실제 모드는 Shopify 상품 이미지를 표시합니다.

## 서버: PostgreSQL 권장 구성

Docker Desktop 설치 후 프로젝트 루트에서:

```powershell
docker compose up -d
Set-Location shopify-app
Copy-Item .env.example .env
npm.cmd ci
# .env에 로컬 설정과 비밀값을 직접 입력한 뒤 실행
npm.cmd run setup
npm.cmd run dev
```

별도 터미널에서 같은 `shopify-app` 폴더:

```powershell
npm.cmd run worker
```

Compose 비밀번호는 로컬 개발용 예제입니다. 포트는 127.0.0.1에만 바인딩합니다. 운영에는 별도 비밀값·TLS·백업을 사용하세요. Docker가 없으면 PostgreSQL 17 Windows 설치판을 설치하고 동일한 `DATABASE_URL` 형식을 사용해도 됩니다.

## 서버: Docker 없는 로컬 대안

```powershell
Set-Location 'C:\Users\USER\Documents\ChatGPT\어플만들기\shopify-app'
npm.cmd ci
npm.cmd run dev:local
```

PGlite는 PostgreSQL을 WASM으로 실행하는 로컬 엔진입니다. 데이터와 큐는 `.local/postgres`에 영속 저장됩니다. 웹 서버·워커가 **한 프로세스**로 실행되며, 같은 파일 저장소를 여러 프로세스로 열면 안 됩니다. `.env.local`은 처음 실행할 때 무작위 로컬 키로 생성되고 기존 파일은 보존됩니다. 이 키는 Shopify/Firebase 자격 증명이 아닙니다. `.env.local`을 실제 연결에 쓰려면 해당 값을 직접 설정해야 합니다.

PGlite는 실제 PostgreSQL 서버의 네트워크·다중 워커 경쟁·운영 장애 복구 검증을 대체하지 않습니다. 운영에서는 `LOCAL_DATABASE_DIR`을 설정하면 서버가 시작을 거부합니다.

## APK 생성

```powershell
Set-Location "$env:USERPROFILE\develop\storecontrol\mobile"
flutter build apk --debug --dart-define=DEMO=true
```

기본 출력: `mobile/build/app/outputs/flutter-apk/app-debug.apk`.

실제 연결 설정을 적용하려면 `config.live.example.json`을 `config.live.json`으로 복사하여 Firebase 앱의 공개 설정과 HTTPS 서버 주소를 입력합니다. 서버의 Shopify secret·서비스 계정 JSON을 모바일에 넣으면 안 됩니다.

```powershell
flutter run --dart-define-from-file=config.live.json
flutter build apk --debug --dart-define-from-file=config.live.json
```

Android application ID: `com.storecontrol.storecontrol`. Firebase Android 앱 등록도 동일하게 합니다. Firebase 공개 앱 설정값은 서버 비밀키와 다릅니다. `config.live.json`도 실수 방지를 위해 Git에서 제외했습니다.

## 출시 AAB·서명

현재는 개발용입니다. 배포 승인, 실기기 검증, Play 정책 검토, 개인정보처리방침·계정 삭제 경로, 앱 ID 확정이 선행되어야 합니다.

1. Play App Signing용 업로드 키를 저장소 밖에 만들고 별도 암호 관리 도구와 오프라인 백업에 보관합니다.
2. `mobile/android/key.properties`에 `storeFile`, `storePassword`, `keyAlias`, `keyPassword`를 로컬로 설정합니다.
3. release 서명은 해당 파일이 있을 때만 설정하도록 Gradle에 구성했습니다. 디버그 키를 출시용으로 사용하지 않습니다.
4. 승인 후 `flutter build appbundle --release --dart-define-from-file=config.live.json`으로 생성합니다.
5. `.jks`, `.keystore`, `key.properties`, Play 서비스 계정 파일은 Git·채팅·로그에 넣지 않습니다.

이번 작업에서 iOS 프로젝트 생성·빌드·출시는 수행하지 않았습니다.
