import React, { useState } from "react";

function TodoForm({ onAdd }) {
  const [inputValue, setInputValue] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    const trimmedValue = inputValue.trim();

    if (!trimmedValue) {
      return;
    }

    onAdd(trimmedValue);
    setInputValue("");
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={inputValue}
        placeholder="할 일을 입력하세요"
        onChange={(event) => setInputValue(event.target.value)}
      />
      <button type="submit">추가</button>
    </form>
  );
}

export default TodoForm;
