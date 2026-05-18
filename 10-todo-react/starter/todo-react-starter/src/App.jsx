import React, { useState } from "react";
import TodoForm from "./components/TodoForm.jsx";
import TodoList from "./components/TodoList.jsx";

function App() {
  const [todos, setTodos] = useState([]);

  function addTodo(content) {
    // TODO:
    // 새 todo 객체를 만들고 setTodos를 사용해 목록 앞쪽에 추가해보세요.
  }

  function toggleTodo(id) {
    // TODO:
    // map을 사용해서 id가 같은 todo의 isDone 값을 반대로 바꿔보세요.
  }

  function deleteTodo(id) {
    // TODO:
    // filter를 사용해서 id가 같은 todo를 목록에서 제거해보세요.
  }

  return (
    <main className="page">
      <section className="card">
        <h1>React TODO Starter</h1>
        <TodoForm onAdd={addTodo} />
        <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
      </section>
    </main>
  );
}

export default App;
