import React, { useState } from "react";
import TodoForm from "./components/TodoForm.jsx";
import TodoList from "./components/TodoList.jsx";

function App() {
  const [todos, setTodos] = useState([]);

  function addTodo(content) {
    const newTodo = {
      id: Date.now(),
      content: content,
      isDone: false,
    };

    setTodos([newTodo, ...todos]);
  }

  function toggleTodo(id) {
    const nextTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, isDone: !todo.isDone } : todo
    );

    setTodos(nextTodos);
  }

  function deleteTodo(id) {
    const nextTodos = todos.filter((todo) => todo.id !== id);

    setTodos(nextTodos);
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
