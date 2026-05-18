import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <section className="card">
      <h2>카운터</h2>
      <p className="description">버튼을 누르면 state가 바뀌고, 숫자도 함께 바뀝니다.</p>

      <div className="count-box">{count}</div>

      <div className="button-row">
        <button onClick={() => setCount(count - 1)}>-1</button>
        <button onClick={() => setCount(count + 1)}>+1</button>
        <button className="light-button" onClick={() => setCount(0)}>
          초기화
        </button>
      </div>
    </section>
  );
}

export default Counter;
