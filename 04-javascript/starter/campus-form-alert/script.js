const form = document.getElementById("club-form");

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const studentName = document.getElementById("student-name").value;
  const studentId = document.getElementById("student-id").value;
  const studentEmail = document.getElementById("student-email").value;
  const clubName = document.getElementById("club-name").value;
  const part = document.getElementById("part").value;
  const reason = document.getElementById("reason").value;

  const message =
    "동아리에 지원해 주셔서 감사합니다!!!\n\n" +
    "이름: " + studentName + "\n" +
    "학번: " + studentId + "\n" +
    "이메일: " + studentEmail + "\n" +
    "관심 동아리: " + clubName + "\n" +
    "지원 분야: " + part + "\n" +
    "지원 이유: " + reason;

  alert(message);
});
