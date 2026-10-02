# Vercel 한국어 데모 배포

- 주소: https://storecontrol-beryl.vercel.app
- 프로젝트: `keywe/storecontrol`
- 배포 ID: `dpl_DDEMng3g5jeZYcHprBPt91gSd9Xb`
- Vercel 상태: READY
- 방식: Vercel CLI 62.1.0, 인증된 keywe 계정의 Production 배포. 이전 비로그인 임시 배포를 대체했습니다.
- 범위: 한국어 기본 Flutter 웹 데모. 샘플 데이터만 사용하며 Shopify 서버 및 Firebase 실서비스 연동은 포함하지 않습니다.

`mobile/build/web` 정적 파일을 `.local/vercel-demo/public`에 복사하고 `deploy/vercel-demo.json`을 배포 폴더의 `vercel.json`으로 복사했습니다. 서버 소스, 환경 변수, 로컬 데이터베이스 및 APK는 업로드하지 않았습니다.

다시 빌드할 때는 Flutter에서 `flutter build web --dart-define=DEMO=true`를 실행하고 정적 파일을 갱신하세요. 배포 폴더에서 `npx vercel@62.1.0 deploy --prod --scope keywe --project storecontrol --yes`로 배포합니다. 추가 공개 배포는 사용자 요청이 있을 때 진행합니다.

홈, JavaScript, 상품 사진, 한글 폰트의 비인증 HTTP 200 응답과 브라우저 실행을 확인했습니다. 최신 화면은 WARM ORANGE 테마, KEYWE COMPANY 매장명, 가운데 정렬된 요약 카드입니다.

공식 안내: https://vercel.com/docs/cli/deploy
