import "./App.css";
import Counter from "./Counter.jsx";
import TodoList from "./TodoList.jsx";

function App() {
  return (
    <main className="page">
      <div className="container">
        <header className="hero">
          <p className="eyebrow">Vite + React Live Class</p>
          <h1>카운터와 투두 리스트 만들기</h1>
          <p className="hero-text">
            React는 화면을 직접 고치는 방식이 아니라, 상태를 바꾸면 화면이 따라 바뀌는
            방식입니다.
          </p>
        </header>

        <Counter />
        <TodoList />
      </div>
    </main>
  );
}

export default App;
