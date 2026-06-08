const witchButton = document.querySelector("#witchButton");
const speechBubble = document.querySelector("#speechBubble");

const witchLines = [
  "안녕! 나는 이 오두막을 지키는 작은 마녀야.",
  "냉장고를 누르면 유통기한을 관리할 수 있어!",
  "상한 재료는 마법 냄새가 난다구.",
  "오늘은 어떤 재료를 정리해볼까?",
  "유통기한이 가까운 재료부터 확인해봐.",
  "냉장고 정리도 훌륭한 마법사의 기본이지.",
  "카드는 아직 준비 중인 마법 도구야.",
  "재료를 추가하고, 필요 없어지면 삭제하면 돼.",
  "반짝이는 보라색 냉장고, 꽤 괜찮지?",
  "클릭할 때마다 내가 작은 힌트를 줄게!"
];

let lineIndex = 0;

witchButton.addEventListener("click", function () {
  speechBubble.classList.add("hide");

  setTimeout(function () {
    lineIndex++;

    if (lineIndex >= witchLines.length) {
      lineIndex = 0;
    }

    speechBubble.textContent = witchLines[lineIndex];
    speechBubble.classList.remove("hide");
  }, 180);
});