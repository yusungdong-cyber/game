# Jeju 3D Treasure Hunt (제주 3D 보물찾기)

Jeju Island 테마의 웹 기반 3D 보물찾기 게임입니다.
플레이어는 3D 맵을 돌아다니며 숨겨진 4자리 경품 코드를 찾고, 이벤트 페이지로 이동해 코드를 제출할 수 있습니다.

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 Vite 개발 서버 주소(예: `http://localhost:5173`)를 열면 됩니다.

## 빌드

```bash
npm run build
npm run preview
```

## 조작 방법

- 데스크톱
  - 이동: `WASD` 또는 방향키
  - 시점: 게임 화면 클릭 후 마우스 이동 (포인터락)
- 모바일
  - 왼쪽 조이스틱: 이동
  - 오른쪽 패드: 시점 이동

## 구성 요소

- `App`: 게임 흐름, 타이머, 성공 처리, 로컬 저장 상태 관리
- `GameScene`: 3D 환경 생성 (해변, 감귤밭, 돌담/카페 거리)
- `PlayerController`: 데스크톱/모바일 이동 및 카메라 제어
- `CodeObject`: 코드가 표시되는 숨김 오브젝트
- `HintSystem`: 힌트 순환
- `SuccessModal`: 성공 모달 및 이벤트 이동 버튼
- `UIOverlay`: 타이머/힌트/모바일 컨트롤 UI

## 커스터마이징 포인트

아래 파일의 주석 위치에서 쉽게 변경할 수 있습니다.

1. 경품 코드
- 파일: `src/config/gameConfig.js`
- `FIXED_PRIZE_CODE`를 `'1234'`처럼 4자리 문자열로 지정
- `null`이면 랜덤 생성

2. 이벤트 URL
- 파일: `src/config/gameConfig.js`
- `EVENT_URL` 수정

3. 힌트 텍스트
- 파일: `src/config/gameConfig.js`
- `HINT_TEXTS` 배열 수정

4. 맵 오브젝트/배치
- 파일: `src/components/GameScene.js`
- `addOcean`, `addTangerineTrees`, `addCafeStreet`, `addDolHareubang`, `addStoneWalls` 등 함수에서 오브젝트 수정
- 코드 숨김 위치: `CodeObject` 생성 시 `position`

## 보안/중복 방지(기본)

- 코드는 UI에 사전 노출하지 않고 3D 오브젝트에서만 확인 가능
- 발견 상태를 `localStorage`와 `sessionStorage`에 저장
- 같은 기기에서 즉시 반복 참여를 막기 위해 쿨다운(`RECLAIM_COOLDOWN_MS`) 적용

