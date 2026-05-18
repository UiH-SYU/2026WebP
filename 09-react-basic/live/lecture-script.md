# React 입문 라이브 강의 스크립트

## 1. 시작 멘트

강사 멘트:

- "오늘은 React를 처음 시작하는 시간입니다."
- "React 전체를 다 배우는 시간은 아니고, React가 어떻게 화면을 만드는지 핵심 감각을 잡는 시간이 됩니다."
- "오늘 결과물은 카운터 하나, 투두 리스트 하나입니다."
- "가장 중요한 문장은 이것입니다."
- "React는 화면을 직접 고치는 방식이 아니라, 상태를 바꾸면 화면이 따라 바뀌는 방식입니다."

설명 포인트:

- 오늘 목표는 완벽한 앱이 아니라 React 감각 익히기
- 깊은 개념보다 직접 만들어보는 경험에 집중

## 2. Live Server 방식과 React/Vite 방식 차이

강사 멘트:

- "예전에는 `index.html` 파일을 만들고 Live Server로 바로 열었습니다."
- "그 방식은 HTML 파일을 브라우저가 바로 보여주는 구조입니다."
- "그런데 React 프로젝트는 여러 JavaScript 파일과 라이브러리를 같이 묶어서 실행해야 합니다."
- "그래서 개발 서버가 필요합니다."
- "오늘 쓸 Vite는 React 프로젝트를 빠르게 실행시켜주는 개발 도구입니다."

설명 포인트:

- Live Server: 정적인 파일을 바로 보여주는 도구
- Vite: React 프로젝트를 개발할 때 빠르게 띄워주는 도구
- React는 그냥 HTML 한 장으로 끝나는 구조가 아님

## 3. 터미널에서 프로젝트 생성

강사 멘트:

- "이제 터미널을 켜세요."
- "오늘은 Node.js 22 이상 기준으로 진행하겠습니다."
- "이 명령어는 React 프로젝트 뼈대를 자동으로 만들어줍니다."

실행할 명령어:

```bash
nvm use
npm -v
node -v
npm create vite@latest react-first-class -- --template react
```

설명 포인트:

- `nvm use`: 현재 폴더 기준 Node 버전을 맞추는 명령
- `node -v`: 지금 사용 중인 Node 버전 확인
- `npm create`: 새 프로젝트를 만드는 명령
- `vite@latest`: 최신 Vite 도구 사용
- `react-first-class`: 프로젝트 폴더 이름
- `--template react`: React용 기본 구조 선택

강사 멘트:

- "이제 방금 만든 프로젝트 폴더로 이동합니다."

실행할 명령어:

```bash
cd react-first-class
```

설명 포인트:

- `cd`는 폴더 이동 명령

강사 멘트:

- "이제 필요한 라이브러리를 설치합니다."
- "여기서 `node_modules` 폴더가 생깁니다."

실행할 명령어:

```bash
npm install
```

설명 포인트:

- 프로젝트에 필요한 도구와 라이브러리를 내려받는 과정
- 설치가 끝나면 `node_modules`, `package-lock.json`이 생김

강사 멘트:

- "이제 개발 서버를 실행합니다."
- "터미널에 나온 주소를 브라우저로 열면 React 앱이 보입니다."

실행할 명령어:

```bash
npm run dev
```

설명 포인트:

- `package.json`의 `scripts`에 있는 `dev` 명령 실행
- 개발할 때는 이 서버를 켜고 작업함

## 4. 프로젝트 폴더 구조 설명

강사 멘트:

- "이제 VS Code에서 폴더를 열고 왼쪽 파일 목록을 같이 봅시다."

설명 포인트:

- `node_modules`: 설치된 라이브러리가 들어 있는 폴더
- `package.json`: 프로젝트 설명서
- `package-lock.json`: 설치된 버전을 기록해 두는 파일
- `src`: 우리가 주로 코드를 작성하는 폴더
- `src/main.jsx`: React 앱을 시작하는 입구
- `src/App.jsx`: 전체 화면을 조립하는 파일
- `src/Counter.jsx`: 카운터 컴포넌트 파일
- `src/TodoList.jsx`: 투두 리스트 컴포넌트 파일
- `src/App.css`: 화면 스타일 파일
- `index.html`: React가 들어갈 빈 무대
- `vite.config.js`: Vite 설정 파일

## 5. package.json 설명

강사 멘트:

- "`package.json`은 이 프로젝트의 설명서입니다."
- "이 안에는 프로젝트 이름, 실행 명령어, 필요한 라이브러리 목록이 들어 있습니다."
- "`npm run dev`를 쳤다는 것은 사실 `scripts` 안에 있는 `dev`를 실행한 것입니다."

설명 포인트:

- `scripts.dev`: 개발 서버 실행 명령
- `dependencies`: 앱 실행에 필요한 라이브러리
- `react`: 화면을 만드는 라이브러리
- `react-dom`: React 화면을 브라우저에 붙여주는 역할
- `vite`: 개발 서버와 빌드 도구 역할

## 6. index.html, main.jsx, App.jsx 관계

강사 멘트:

- "`index.html`은 빈 무대입니다."
- "여기 있는 `div id=\"root\"`가 React가 들어갈 자리입니다."
- "`main.jsx`는 React 앱을 그 자리로 연결하는 입구입니다."
- "`App.jsx`는 실제 우리가 보는 화면입니다."
- "완성본에서는 코드가 너무 길어지지 않게 카운터와 투두를 파일로 나눌 수도 있습니다."
- "흐름은 이렇게 기억하면 됩니다. `index.html → main.jsx → App.jsx`"

설명 포인트:

- `root`는 React가 끼워 넣어질 자리
- `main.jsx`가 `App` 컴포넌트를 root에 렌더링
- `App.jsx`에서 실제 UI 작성

## 7. App.jsx 초기화

강사 멘트:

- "이제 `App.jsx`를 열어봅시다."
- "기본 Vite 코드는 연습에 필요 없는 부분이 많아서 지우겠습니다."
- "처음에는 가장 단순하게 `h1` 하나만 써보겠습니다."
- "React 컴포넌트는 화면을 반환하는 함수라고 생각하면 됩니다."

작성할 코드:

```jsx
function App() {
  return (
    <div>
      <h1>React 첫 수업</h1>
    </div>
  );
}

export default App;
```

설명 포인트:

- JSX는 JavaScript 안에서 HTML처럼 쓰는 문법
- 컴포넌트는 화면 조각을 만드는 함수

## 8. 카운터 만들기

강사 멘트:

- "이제 카운터 화면부터 만들어보겠습니다."
- "먼저 숫자와 버튼만 써볼게요."
- "지금은 버튼을 눌러도 아무 일도 일어나지 않습니다."
- "이제 React의 핵심인 state를 넣어보겠습니다."

작성할 코드 타이밍:

1. 화면만 먼저 작성

```jsx
<h2>카운터</h2>
<p>현재 숫자: 0</p>
<button>-1</button>
<button>+1</button>
<button>초기화</button>
```

2. `useState` 도입

```jsx
import { useState } from "react";

const [count, setCount] = useState(0);
```

강사 멘트:

- "`count`는 현재 값입니다."
- "`setCount`는 값을 바꾸는 함수입니다."
- "처음 숫자는 0으로 시작합니다."

3. 버튼 연결

```jsx
<button onClick={() => setCount(count - 1)}>-1</button>
<button onClick={() => setCount(count + 1)}>+1</button>
<button onClick={() => setCount(0)}>초기화</button>
```

설명 포인트:

- `onClick`은 클릭 이벤트
- 클릭 → `setCount` 실행 → `count` 변경 → 화면 다시 렌더링
- React는 화면을 직접 수정하지 않고 state를 바꾸는 방식

## 9. 투두 만들기

강사 멘트:

- "이제 조금 더 React다운 예제로 투두 리스트를 만들어보겠습니다."
- "여기서는 문자열 하나와 배열 하나를 state로 관리합니다."

### 입력값 state 만들기

작성할 코드:

```jsx
const [todoText, setTodoText] = useState("");
```

강사 멘트:

- "`todoText`는 입력창 안의 현재 글자입니다."
- "input도 React에서는 state로 관리할 수 있습니다."

작성할 코드:

```jsx
<input
  type="text"
  value={todoText}
  onChange={(event) => setTodoText(event.target.value)}
/>
```

설명 포인트:

- `value`로 현재 값 연결
- `onChange`로 입력할 때마다 state 변경

### 목록 배열 state 만들기

작성할 코드:

```jsx
const [todos, setTodos] = useState([]);
```

강사 멘트:

- "`todos`는 할 일 목록 배열입니다."

### addTodo 함수 만들기

작성할 코드:

```jsx
function addTodo() {
  const trimmedText = todoText.trim();

  if (trimmedText === "") {
    return;
  }

  const newTodo = {
    id: Date.now(),
    text: trimmedText,
  };

  setTodos([...todos, newTodo]);
  setTodoText("");
}
```

설명 포인트:

- 공백만 있는 문자열은 추가하지 않음
- 새 객체를 만들어 배열 뒤에 붙임
- 추가 후 input 비우기

### 목록 렌더링

작성할 코드:

```jsx
<ul>
  {todos.map((todo) => (
    <li key={todo.id}>{todo.text}</li>
  ))}
</ul>
```

강사 멘트:

- "`map`은 배열을 화면으로 바꿔주는 가장 기본적인 방법입니다."
- "`key`는 React가 각 항목을 구분하기 위한 이름표라고 생각하면 됩니다."

### 삭제 기능 만들기

작성할 코드:

```jsx
function deleteTodo(id) {
  const nextTodos = todos.filter((todo) => todo.id !== id);
  setTodos(nextTodos);
}
```

```jsx
<button onClick={() => deleteTodo(todo.id)}>삭제</button>
```

설명 포인트:

- `filter`는 지울 항목만 빼고 새 배열을 만드는 방식
- 배열이 바뀌면 화면도 다시 바뀜

### Enter 키 처리

작성할 코드:

```jsx
function handleTodoKeyDown(event) {
  if (event.key === "Enter") {
    addTodo();
  }
}
```

```jsx
onKeyDown={handleTodoKeyDown}
```

강사 멘트:

- "버튼 클릭 말고 Enter로도 추가되게 해보겠습니다."
- "이렇게 이벤트를 하나 더 연결할 수 있습니다."

## 10. 마무리 정리

강사 멘트:

- "오늘은 React 프로젝트를 시작하는 가장 기본 흐름을 봤습니다."
- "터미널에서 프로젝트를 만들고, `npm install`, `npm run dev`로 실행했습니다."
- "`index.html → main.jsx → App.jsx` 흐름도 확인했습니다."
- "그리고 컴포넌트, JSX, state, event, map 렌더링까지 사용해봤습니다."
- "마지막으로 이 문장을 다시 기억해 주세요."
- "React에서 중요한 건 화면을 직접 수정하는 게 아니라, 상태를 바꾸고 그 상태에 맞게 화면을 다시 그리게 하는 것입니다."

정리 포인트:

- 컴포넌트: 화면을 반환하는 함수
- JSX: JavaScript 안에서 HTML처럼 쓰는 문법
- state: 바뀌는 데이터
- event: 클릭, 입력, 키보드 같은 사용자 동작
- map 렌더링: 배열을 목록 UI로 보여주는 방법

## 실제 라이브 진행 순서 요약

1. 결과물 소개하고 React 핵심 문장 먼저 전달
2. Live Server와 Vite 차이 설명
3. 터미널 명령어 4개 실행
4. 폴더 구조와 `package.json` 설명
5. `App.jsx`를 h1부터 시작해서 카운터, 투두 순서로 완성
