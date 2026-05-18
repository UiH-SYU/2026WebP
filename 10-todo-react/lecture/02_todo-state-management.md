# 10주차 - TODO 프로젝트 2: 상태 관리

## 이번 주 목표

- TODO 앱에서 어떤 state가 필요한지 설명할 수 있다.
- state와 props의 흐름을 구분할 수 있다.
- 추가, 완료, 삭제가 어떻게 작동하는지 큰 흐름을 이해할 수 있다.

## 왜 이 실습을 하나요?

TODO 앱의 핵심은 화면보다 데이터 흐름입니다.
어떤 값이 바뀌고, 누가 그 값을 가지고 있고, 어떤 함수가 그 값을 바꾸는지 이해해야 React 프로젝트를 스스로 완성할 수 있습니다.

## 준비물

- `10-todo-react/example/todo-react-complete/src/App.jsx`
- `10-todo-react/starter/todo-react-starter/src/App.jsx`

## 이번 주 파일 설명

- `10-todo-react/example/todo-react-complete/src/App.jsx`: `todos` state를 가지고 있는 파일입니다.
- `10-todo-react/example/todo-react-complete/src/components/TodoForm.jsx`: 새 할 일을 입력받는 파일입니다.
- `10-todo-react/example/todo-react-complete/src/components/TodoList.jsx`, `10-todo-react/example/todo-react-complete/src/components/TodoItem.jsx`: 목록을 표시하고 동작을 전달받는 파일입니다.

## 코드에서 꼭 볼 부분

- `todos`: 전체 할 일 목록 state입니다.
- `addTodo()`: 새 항목을 추가합니다.
- `toggleTodo()`: 완료 여부를 바꿉니다.
- `deleteTodo()`: 항목을 제거합니다.

## 실습 순서

1. `todos` state가 어디에 있는지 확인합니다.
2. 새 항목 추가 함수가 어떤 데이터를 만드는지 읽습니다.
3. 완료 토글 함수가 배열을 어떻게 바꾸는지 확인합니다.
4. 삭제 함수가 어떤 방식으로 항목을 제거하는지 읽습니다.

## 학생 실습 미션

1. `todos`를 왜 상위 컴포넌트가 들고 있어야 하는지 설명해보세요.
2. 추가, 완료, 삭제가 각각 어떤 함수로 처리되는지 정리해보세요.
3. starter의 TODO 주석을 보고 어떤 로직을 완성해야 하는지 써보세요.

## 체크리스트

- [ ] TODO 앱의 핵심 state를 이해했다.
- [ ] props와 state의 흐름을 구분할 수 있다.
- [ ] 추가, 완료, 삭제 로직을 설명할 수 있다.

## 자주 하는 실수

- 하위 컴포넌트가 전체 데이터를 소유해야 한다고 생각하는 경우
- state를 직접 수정하려는 경우
- 함수 역할을 분리하지 않고 한 곳에 몰아넣는 경우

## 한 줄 정리

TODO 앱은 결국 "배열 state를 어떻게 안전하게 바꾸는가"를 배우는 프로젝트입니다.
