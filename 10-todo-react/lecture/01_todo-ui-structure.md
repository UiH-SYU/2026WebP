# 10주차 - TODO 프로젝트 1: 화면 구조와 컴포넌트

## 이번 주 목표

- TODO 앱 화면을 컴포넌트 단위로 나눌 수 있다.
- 각 컴포넌트의 역할을 설명할 수 있다.
- App, Form, List, Item 구조를 이해할 수 있다.

## 왜 이 실습을 하나요?

프로젝트는 바로 코드를 쓰기 전에 구조를 먼저 이해하는 것이 중요합니다.
특히 초보자는 어떤 컴포넌트가 어떤 역할을 맡는지 먼저 분리해야 구현 중 덜 헷갈립니다.

## 준비물

- `10-todo-react/example/todo-react-complete/` 예제
- `10-todo-react/starter/todo-react-starter/` starter

## 이번 주 파일 설명

- `10-todo-react/example/todo-react-complete/src/App.jsx`: 전체 상태와 주요 함수를 관리합니다.
- `10-todo-react/example/todo-react-complete/src/components/TodoForm.jsx`: 입력창과 추가 버튼을 담당합니다.
- `10-todo-react/example/todo-react-complete/src/components/TodoList.jsx`: 목록을 출력합니다.
- `10-todo-react/example/todo-react-complete/src/components/TodoItem.jsx`: 개별 항목을 표시합니다.

## 코드에서 꼭 볼 부분

- `App`: 가장 상위에서 데이터를 관리합니다.
- `TodoForm`: 입력을 받습니다.
- `TodoList`: 배열을 목록으로 보여줍니다.
- `TodoItem`: 체크박스와 삭제 버튼을 처리합니다.

## 실습 순서

1. 예제 폴더의 컴포넌트 파일 이름을 먼저 확인합니다.
2. 각 파일이 무엇을 담당하는지 한 줄로 적어봅니다.
3. 상위 컴포넌트와 하위 컴포넌트 관계를 그림으로 그려봅니다.
4. starter 파일과 비교해 어떤 부분을 학생이 작성해야 하는지 확인합니다.

## 학생 실습 미션

1. 각 컴포넌트 역할을 표처럼 정리해보세요.
2. TODO 앱에 왜 컴포넌트 분리가 필요한지 적어보세요.
3. 가장 상위에서 관리해야 할 값이 무엇인지 생각해보세요.

## 체크리스트

- [ ] TODO 앱의 주요 컴포넌트를 말할 수 있다.
- [ ] 각 컴포넌트 역할을 구분할 수 있다.
- [ ] 상위와 하위 컴포넌트 관계를 이해했다.

## 자주 하는 실수

- 모든 기능을 `App` 하나에만 넣으려는 경우
- Form과 List의 역할이 겹치는 경우
- 화면 구조와 데이터 흐름을 따로 보지 않는 경우

## 한 줄 정리

컴포넌트 구조를 먼저 이해하면 TODO 프로젝트 구현이 훨씬 단순해집니다.
