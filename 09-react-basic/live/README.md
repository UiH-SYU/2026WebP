# React First Class

React 입문 라이브 강의용으로 만든 Vite + React 프로젝트입니다.

## 권장 Node 버전

- Node.js 22 이상
- 이 폴더에서는 `.nvmrc`가 있으므로 `nvm use`로 맞출 수 있습니다.

## 설치 방법

```bash
nvm use
npm install
```

## 실행 방법

```bash
npm run dev
```

## 강의용 프로젝트 설명

- Vite로 만든 React 기본 프로젝트입니다.
- 하나의 화면에서 카운터와 투두 리스트를 함께 보여줍니다.
- 초보자가 `state`, `event`, `map` 렌더링을 처음 보는 상황을 기준으로 작성했습니다.

## 주요 파일 설명

- `package.json`: 프로젝트 정보, 실행 명령어, 필요한 라이브러리 목록
- `src/main.jsx`: React 앱을 브라우저의 `root`에 연결하는 파일
- `src/App.jsx`: 전체 화면을 조립하는 파일
- `src/Counter.jsx`: 카운터 컴포넌트 파일
- `src/TodoList.jsx`: 투두 리스트 컴포넌트 파일
- `src/App.css`: 화면 스타일 파일
- `lecture-script.md`: 라이브 강의 진행 순서와 짤막한 대본
