# WARM ORANGE 구현·검증 기록

## 적용

Flutter 유지. 현황, 재사용 상품 목록 탭, 상품 상세, 알림, 설정, 로그인·연결 양식 및 공통 상태에 공통 테마 적용. 회사명 KEYWE COMPANY. 화면 전체 최대 480px, 헤더·하단 메뉴 포함 중앙 정렬. 요약 카드 내부 숫자·라벨도 가운데 정렬.

후속 요청: 외부 여백 5px, 목록 좌우 여백 5px로 통일. 요약 카드를 클릭하면 재고 부족·품절 필터가 적용된 상품 탭 또는 미확인 알림만 표시하는 알림 탭으로 이동합니다. 상품 요약 진입 시 이전 검색어와 확인 필요 필터는 초기화되어 서로 충돌하지 않습니다. 미확인 알림은 확인 완료하면 해당 목록에서 빠지며, 필터를 지우거나 하단 알림 탭을 누르면 전체 알림을 볼 수 있습니다.

- `mobile/lib/warm_theme.dart`: 아이보리 #FAF6EF, 브라운 #2C1B13, 오렌지 #F06416, 경계 #EADFD3, 16px 카드, 버튼·폼·하단 메뉴 테마, WarmBadge.
- `mobile/lib/main.dart`: 동일 데이터 기반 목록·검색·필터 재사용, 실제 재고 집계 및 미확인 알림 수, 확인 필요 필터, 최근 알림, Semantics, 이미지 실패 대체 화면, 전체 UI.
- `mobile/lib/strings.dart`: 새 문구 한영 번역. 날짜도 언어에 맞게 표시. 상품명·옵션은 원본 데이터 유지.
- `mobile/lib/repository.dart`: 데모 매장명만 KEYWE COMPANY로 변경. Shopify 서버·인증·재고 계산·FCM·결제 로직 미변경.
- 알림 확인창·기준 수량·설정 창의 입력 컨트롤러는 닫기 애니메이션이 끝난 뒤 해제하도록 UI 수명 수정.

데모는 Shopify 미연결로 표시. LIVE는 동기화 데이터·오류·로그인 상태에 따라 표시하며 연결을 지어내지 않음. 할인·결제 비활성 안내 유지. 상품 사진은 정확히 일치하는 데모 옵션 3개에만 적용하며 다른 상품은 사진 없음 대체 화면 표시.

작은 오렌지 글자와 선택 필터는 대비를 위해 #B74306으로 조정. 주요 #F06416 패널 위에는 짙은 글자 사용. 큰 글자는 강제로 축소하지 않고 필요한 경우 줄을 나눔.

## 에셋과 라이선스

기존 앱에는 별도 폰트 파일이 없었으며 Flutter 기본 폰트를 사용했습니다. Google Fonts 공식 저장소의 Noto Sans KR을 `mobile/assets/fonts/NotoSansKR.ttf`에 포함. SIL OFL 1.1 원문은 같은 폴더의 `OFL.txt`. 출처: https://github.com/google/fonts/tree/main/ofl/notosanskr

제품 사진은 내장 image_gen으로 새로 생성했습니다. 외부 쇼핑몰 이미지가 아니며 실제 판매 제품 사진으로 주장하지 않습니다. 프로젝트 에셋:

- `mobile/assets/products/tote.png`: 내추럴 캔버스 토트백
- `mobile/assets/products/mug.png`: 차콜 세라믹 머그
- `mobile/assets/products/tumbler.png`: 포그 그레이 텀블러

프롬프트 공통: “Create one square photorealistic studio product photograph for a fictional premium Korean lifestyle shop's demo app. Warm ivory seamless backdrop #F5EDE2, soft natural window lighting, subtle shadow, object centered and fully visible, generous 15% breathing room. Three-quarter angle, editorial catalog style, accurate physical materials, realistic proportions. Single product only. No typography, watermark, frame, hands or decorative props. This is a local project product image, not a UI mockup.”

각 Subject: “A natural unbleached cotton canvas tote bag, no text, no logo, soft fabric texture and two handles” / “One charcoal matte ceramic coffee mug, no text, no logo, visible handle, 350ml size” / “One fog gray stainless steel insulated tumbler with lid, no text, no logo, 500ml size”.

## 검증

- Flutter analyze: 이슈 없음.
- Flutter 테스트: 기존 3개 및 관련 동작 5개. 검색·전체 필터·확인 필요 필터, 알림 확인 기록과 미확인 수 감소, 360px에서 글자 2배·긴 상품명·사진 누락·네비게이션·상세, 상품 카드 Enter/Space, 요약 카드와 미확인 전용 목록 전환을 검증합니다. 8개 모두 통과했습니다.
- Flutter 웹 빌드 및 Android 데모 debug APK 빌드 성공.
- 실제 브라우저: 390×844 모바일 및 1280×720 데스크톱 화면 확인. 큰 화면에서 헤더·본문·하단 메뉴 480px 유지.
- 배포본 필터 실제 결과: 전체 40 / 재고 부족 8 / 품절 3 / 정상 27. 옵션 검색 “오션 블루” 1개.
- 브라우저에서 상세 이동, 알림 당시·현재 수량, 확인 기록 저장 후 미확인 6→5, 설정 편집·저장, 한영 전환·날짜 형식, 오류 안내·재시도·로딩, 빈 목록 0개를 확인.
- Semantics 트리에서 언어 버튼·메뉴·상품 카드·필터의 접근 가능한 이름 확인. 화면 읽기 프로그램으로 실제 낭독한 검증은 수행하지 않음.
- Vercel 홈/JS/사진/폰트 비인증 HTTP 200 및 실제 UI 실행 확인.

캡처: `docs/screenshots/warm-mobile.png`, `warm-desktop.png`, `warm-detail.png`, `warm-settings.png`.

## 미검증·제한

“02 · WARM ORANGE” 원본 시안은 전달된 첨부 폴더 및 확인 가능한 클립보드 이미지에서 발견하지 못했습니다. 명세 기반 구현이며 시안과 직접 비교는 미검증입니다. 이미지 다운로드 실패 대체 UI는 구현했으나 실제 외부 상품 이미지 네트워크 장애 주입은 하지 않았습니다. 사진은 현재 3개 옵션만 제공됩니다. 실기기 Android 설치·FCM 수신 및 실제 Shopify 데이터 연결은 이번 디자인 검증 대상에서 실행하지 않았습니다.

사용자 후속 배포 요청에 따라 https://storecontrol-beryl.vercel.app 에 정식 배포했습니다. 서버·비밀키·로컬 DB는 배포하지 않았습니다.
