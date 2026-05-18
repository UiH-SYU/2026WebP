import React from "react";
import TodoItem from "./TodoItem.jsx";

function TodoList({ todos, onToggle, onDelete }) {
  if (todos.length === 0) {
    return <p>등록된 할 일이 없습니다.</p>;
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

export default TodoList;
