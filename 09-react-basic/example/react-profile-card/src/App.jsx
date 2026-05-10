import React from "react";

function ProfileCard({ name, major, hobby }) {
  return (
    <article style={styles.card}>
      <h2>{name}</h2>
      <p>전공: {major}</p>
      <p>취미: {hobby}</p>
    </article>
  );
}

function App() {
  return (
    <main style={styles.page}>
      <ProfileCard name="김하늘" major="컴퓨터공학" hobby="영화 감상" />
      <ProfileCard name="정의현" major="반도체공학" hobby="바이브 코딩 게임 개발" />
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fef3c7",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    width: "280px",
    padding: "24px",
    borderRadius: "20px",
    backgroundColor: "#ffffff",
    boxShadow: "0 12px 30px rgba(0, 0, 0, 0.08)",
  },
};

export default App;
