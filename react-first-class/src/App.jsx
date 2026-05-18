import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);
  const [todoText, setTodoText] = useState("");
  const [todos, setTodos] = useState([]);

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
    <div>
      <h1>React 첫 수업</h1>

      <section>
        <h2>카운터</h2>
        <p>현재 숫자: {count}</p>

        <button onClick={() => setCount(count - 1)}>-1</button>
        <button onClick={() => setCount(count + 1)}>+1</button>
        <button onClick={() => setCount(0)}>초기화</button>
      </section>

      <section>
        <h2>투두 리스트</h2>

        <input
          type="text"
          value={todoText}
          onChange={(event) => setTodoText(event.target.value)}
          onKeyDown={handleTodoKeyDown}
          placeholder="할 일을 입력하세요"
        />

        <button onClick={addTodo}>추가</button>

        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>
              {todo.text}
              <button onClick={() => deleteTodo(todo.id)}>삭제</button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;