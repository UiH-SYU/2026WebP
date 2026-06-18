const sb = window.supabaseClient;

if (!sb) {
  alert("Supabase 연결이 없습니다. supabaseClient.js와 script 순서를 확인해주세요.");
  throw new Error("window.supabaseClient is missing.");
}

const fridgeButton = document.getElementById("fridgeButton");
const cardTableButton = document.getElementById("cardTableButton");
const witchButton = document.getElementById("witchButton");
const witchImage = document.getElementById("witchImage");
const speechBubble = document.getElementById("speechBubble");
const fridgeTransition = document.getElementById("fridgeTransition");

const loginBox = document.getElementById("loginBox");
const profileBox = document.getElementById("profileBox");

const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const nicknameInput = document.getElementById("nicknameInput");

const loginButton = document.getElementById("loginButton");
const signupButton = document.getElementById("signupButton");
const logoutButton = document.getElementById("logoutButton");

const loginStatus = document.getElementById("loginStatus");
const profileName = document.getElementById("profileName");
const itemCount = document.getElementById("itemCount");
const expiryCount = document.getElementById("expiryCount");
const cardCount = document.getElementById("cardCount");
const openFridgeFromBoard = document.getElementById("openFridgeFromBoard");
const openCardsFromBoard = document.getElementById("openCardsFromBoard");
const authMessage = document.getElementById("authMessage");

const witchTalks = [
  {
    text: "안녕! 나는 정리의 마법사야 만나서 반가워.",
    image: "./images/witch.png",
    voice: "./sounds/hello.mp3"
  },
  {
    text: "마법을 사용하면 냉장고를 밖에서도 정리할 수 있어!",
    image: "./images/witch.png",
    voice: "./sounds/organize.mp3"
  },
  {
    text: "큰일이야 전부 썩었어 얼른 버려!!",
    image: "./images/angrywitch.png",
    voice: "./sounds/warning.mp3"
  },
  {
    text: "음... 오늘은 어떤 새로운 물건이 들어올려나?",
    image: "./images/boringwitch.png",
    voice: "./sounds/boring.mp3"
  },
  {
    text: "고마워... 같이 정리해줘서 정말 기뻐.",
    image: "./images/derewitch.png",
    voice: "./sounds/happy.mp3"
  }
];

let talkIndex = 0;
let bubbleTimer = null;
let currentVoice = null;
let isFridgeOpening = false;

witchButton.addEventListener("click", () => {
  const currentTalk = witchTalks[talkIndex];

  showWitchMessage(
    currentTalk.text,
    currentTalk.image,
    currentTalk.voice
  );

  talkIndex = (talkIndex + 1) % witchTalks.length;
});

function showWitchMessage(text, imagePath, voicePath) {
  speechBubble.textContent = text;

  if (imagePath) {
    witchImage.src = imagePath;
  }

  speechBubble.classList.add("show");

  if (voicePath) {
    playWitchVoice(voicePath);
  }

  clearTimeout(bubbleTimer);

  bubbleTimer = setTimeout(() => {
    speechBubble.classList.remove("show");
  }, 3000);
}

function playWitchVoice(voicePath) {
  if (!voicePath) return;

  if (currentVoice) {
    currentVoice.pause();
    currentVoice.currentTime = 0;
  }

  currentVoice = new Audio(voicePath);
  currentVoice.volume = 0.9;

  currentVoice.play().catch(() => {
    console.log("음성 파일이 없거나, 브라우저가 재생을 막았습니다.");
  });
}

fridgeButton.addEventListener("click", () => {
  openFridgeWithAnimation();
});

openFridgeFromBoard.addEventListener("click", () => {
  openFridgeWithAnimation();
});

cardTableButton.addEventListener("click", () => {
  openCardsPage();
});

openCardsFromBoard.addEventListener("click", () => {
  openCardsPage();
});

async function openFridgeWithAnimation() {
  if (isFridgeOpening) return;

  const session = await getCurrentSession();

  if (!session) {
    showWitchMessage(
      "먼저 로그인해야 너만의 냉장고를 열 수 있어!",
      "./images/angrywitch.png",
      "./sounds/banrefridge.mp3"
    );

    emailInput.focus();
    return;
  }

  isFridgeOpening = true;

  fridgeButton.classList.add("opening");

  setTimeout(() => {
    fridgeTransition.classList.add("show");
  }, 650);

  setTimeout(() => {
    window.location.href = "./fridge.html";
  }, 1450);
}

async function openCardsPage() {
  const session = await getCurrentSession();

  if (!session) {
    showWitchMessage(
      "카드 도감도 로그인해야 볼 수 있어!",
      "./images/angrywitch.png",
      "./sounds/bandcard.mp3"
    );

    emailInput.focus();
    return;
  }

  window.location.href = "./cards.html";
}

signupButton.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const nickname = nicknameInput.value.trim() || "마법사";

  if (!email || !password) {
    setAuthMessage("이메일과 비밀번호를 입력해줘.");
    return;
  }

  if (password.length < 6) {
    setAuthMessage("비밀번호는 최소 6자 이상으로 해줘.");
    return;
  }

  setAuthMessage("회원가입 중...");

  const { data, error } = await sb.auth.signUp({
    email,
    password,
    options: {
      data: {
        nickname
      }
    }
  });

  if (error) {
    setAuthMessage("회원가입 실패: " + error.message);
    showWitchMessage(
      "회원가입 마법이 실패했어...",
      "./images/sadwitch.png",
      "./sounds/registerfail.mp3"
    );
    return;
  }

  setAuthMessage("회원가입 완료!");

  await renderAuthState();

  if (data.user) {
    showWitchMessage(
      `${nickname}님, 가입을 환영해!`,
      "./images/happywitch.png",
      "./sounds/ocaeri.mp3"
    );
  }
});

loginButton.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    setAuthMessage("이메일과 비밀번호를 입력해줘.");
    return;
  }

  setAuthMessage("로그인 중...");

  const { data, error } = await sb.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    setAuthMessage("로그인 실패: " + error.message);
    showWitchMessage(
      "로그인 마법이 실패했어...",
      "./images/sadwitch.png",
      "./sounds/loginfail.mp3"
    );
    return;
  }

  const nickname = getUserDisplayName(data.user);

  setAuthMessage("로그인 성공!");

  await renderAuthState();

  showWitchMessage(
    `${nickname}님, 어서 와!`,
    "./images/happywitch.png",
    "./sounds/ocaeri.mp3"
  );
});

logoutButton.addEventListener("click", async () => {
  setAuthMessage("로그아웃 중...");

  const { error } = await sb.auth.signOut();

  if (error) {
    setAuthMessage("로그아웃 실패: " + error.message);
    return;
  }

  await renderAuthState();

  showWitchMessage(
    "다음에 또 정리하러 와줘!",
    "./images/happywitch.png",
    "./sounds/matane.mp3"
  );
});

async function renderAuthState() {
  const session = await getCurrentSession();

  if (!session) {
    loginBox.hidden = false;
    profileBox.hidden = true;

    loginStatus.textContent = "Guest";
    profileName.textContent = "마법사";
    itemCount.textContent = "0";
    expiryCount.textContent = "0";

    if (cardCount) {
      cardCount.textContent = "0";
    }

    return;
  }

  const user = session.user;
  const nickname = getUserDisplayName(user);

  loginBox.hidden = true;
  profileBox.hidden = false;

  loginStatus.textContent = "Login";
  profileName.textContent = nickname;

  await updateFridgePreview();
  await updateCardPreview();
}

async function updateFridgePreview() {
  const { data, error } = await sb
    .from("foods")
    .select("id, expire_date")
    .order("expire_date", { ascending: true });

  if (error) {
    console.error("냉장고 미리보기 불러오기 실패:", error);
    itemCount.textContent = "0";
    expiryCount.textContent = "0";

    setAuthMessage("냉장고 정보를 불러오지 못했어: " + error.message);
    return;
  }

  const foods = data || [];

  itemCount.textContent = foods.length;
  expiryCount.textContent = countExpiringFoods(foods);
}

async function updateCardPreview() {
  if (!cardCount) return;

  const { data, error } = await sb
    .from("user_cards")
    .select("id");

  if (error) {
    console.error("카드 미리보기 불러오기 실패:", error);
    cardCount.textContent = "0";
    return;
  }

  cardCount.textContent = String((data || []).length);
}

function countExpiringFoods(foods) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return foods.filter((food) => {
    if (!food.expire_date) return false;

    const parts = String(food.expire_date).split("-");

    if (parts.length !== 3) return false;

    const expiryDate = new Date(
      Number(parts[0]),
      Number(parts[1]) - 1,
      Number(parts[2])
    );

    if (Number.isNaN(expiryDate.getTime())) return false;

    expiryDate.setHours(0, 0, 0, 0);

    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    return diffDays <= 3;
  }).length;
}

async function getCurrentSession() {
  const { data, error } = await sb.auth.getSession();

  if (error) {
    console.log(error);
    return null;
  }

  return data.session;
}

function getUserDisplayName(user) {
  return (
    user?.user_metadata?.nickname ||
    user?.email?.split("@")[0] ||
    "마법사"
  );
}

function setAuthMessage(message) {
  if (authMessage) {
    authMessage.textContent = message;
  }
}

sb.auth.onAuthStateChange(() => {
  renderAuthState();
});

renderAuthState();