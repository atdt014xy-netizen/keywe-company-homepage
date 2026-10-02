# StoreControl Shopify 서버

실행과 실제 연결 안내는 상위 [README](../README.md) 및 [docs](../docs/windows.md)를 참조하세요.

공식 [Shopify React Router 템플릿](https://github.com/Shopify/shopify-app-template-react-router)의 커밋 `93348fe7dbd8e1a33eea69e2bbba1990d136b0da`에서 시작했습니다. 원본 라이선스는 LICENSE.md에 보존했습니다. 공식 인증 흐름을 유지하고 PostgreSQL, 암호화 SessionStorage, 모바일 Firebase 인증, 재고 알림 큐를 추가했습니다. 템플릿 SQLite/Prisma 기능은 사용하지 않습니다.

```powershell
npm.cmd ci
npm.cmd run dev:local
```

로컬 대안은 PGlite 단일 프로세스이며 실제 연결 권한을 우회하지 않습니다. PostgreSQL 구성에서는 `npm run setup`, `npm run dev`, 별도 터미널에서 `npm run worker`를 사용합니다. 실제 앱 설정은 `.env.example`을 참고하세요.

`npm test`, `npm run typecheck`, `npm run lint`, `npm run build`로 검증합니다. 실제 매장·폰 검증 상태는 [progress](../docs/progress.md)에 기록됩니다.
