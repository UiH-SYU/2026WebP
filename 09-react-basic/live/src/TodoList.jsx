import { useState } from "react";

function TodoList() {
  const [todoText, setTodoText] = useState("");
  const [todos, setTodos] = useState([
    { id: 1, text: "React 설치해보기" },
    { id: 2, text: "카운터 완성하기" },
  ]);

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

  function deleteTodo(id) {
    const nextTodos = todos.filter((todo) => todo.id !== id);
    setTodos(nextTodos);
  }

  function handleTodoKeyDown(event) {
    if (event.key === "Enter") {
      addTodo();
    }
  }

  return (
    <section className="card">
      <h2>투두 리스트</h2>
      <p className="description">입력한 할 일을 배열에 넣고, map으로 화면에 보여줍니다.</p>

      <div className="todo-form">
        <input
          type="text"
          placeholder="할 일을 입력하세요"
          value={todoText}
          onChange={(event) => setTodoText(event.target.value)}
          onKeyDown={handleTodoKeyDown}
        />
        <button onClick={addTodo}>추가</button>
      </div>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li className="todo-item" key={todo.id}>
            <span>{todo.text}</span>
            <button className="delete-button" onClick={() => deleteTodo(todo.id)}>
              삭제
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default TodoList;
