const sb = window.supabaseClient;

if (!sb) {
  alert("Supabase 연결이 없습니다. supabaseClient.js와 script 순서를 확인해주세요.");
  throw new Error("window.supabaseClient is missing.");
}

const CARD_IMAGE_BUCKET = "card-images";

const userInfo = document.getElementById("userInfo");
const logoutButton = document.getElementById("logoutButton");
const cardTotalCount = document.getElementById("cardTotalCount");

const cardForm = document.getElementById("cardForm");
const cardNameInput = document.getElementById("cardNameInput");
const cardSeriesInput = document.getElementById("cardSeriesInput");
const rarityInput = document.getElementById("rarityInput");
const obtainedAtInput = document.getElementById("obtainedAtInput");
const cardImageInput = document.getElementById("cardImageInput");
const memoInput = document.getElementById("memoInput");

const submitButton = document.getElementById("submitButton");
const cancelButton = document.getElementById("cancelButton");

const searchInput = document.getElementById("searchInput");
const cardList = document.getElementById("cardList");

let currentUser = null;
let allCards = [];
let editingCardId = null;
let editingImagePath = null;

logoutButton.addEventListener("click", async () => {
  await sb.auth.signOut();
  window.location.href = "./index.html";
});

cardForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await saveCard();
});

cancelButton.addEventListener("click", () => {
  resetForm();
});

searchInput.addEventListener("input", () => {
  renderCards();
});

function escapeHTML(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getUserDisplayName(user) {
  return (
    user?.user_metadata?.nickname ||
    user?.email?.split("@")[0] ||
    "마법사"
  );
}

function getTodayText() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function makeErrorText(error) {
  if (!error) {
    return "알 수 없는 오류";
  }

  return [
    error.message ? `message: ${error.message}` : "",
    error.details ? `details: ${error.details}` : "",
    error.hint ? `hint: ${error.hint}` : "",
    error.code ? `code: ${error.code}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function getCardImageUrl(imagePath) {
  if (!imagePath) {
    return "";
  }

  const { data } = sb.storage
    .from(CARD_IMAGE_BUCKET)
    .getPublicUrl(imagePath);

  return data.publicUrl;
}

function getFileExtension(fileName) {
  const parts = fileName.split(".");
  if (parts.length < 2) return "jpg";

  return parts[parts.length - 1].toLowerCase();
}

function makeSafeFileName(fileName) {
  return fileName
    .replaceAll(" ", "_")
    .replace(/[^\w.-]/g, "");
}

async function uploadCardImageIfNeeded() {
  const file = cardImageInput.files[0];

  if (!file) {
    return editingImagePath;
  }

  if (!file.type.startsWith("image/")) {
    alert("이미지 파일만 업로드할 수 있어.");
    return null;
  }

  const maxSize = 5 * 1024 * 1024;

  if (file.size > maxSize) {
    alert("이미지는 5MB 이하로 올려줘.");
    return null;
  }

  const extension = getFileExtension(file.name);
  const safeName = makeSafeFileName(file.name) || `card.${extension}`;
  const filePath = `${currentUser.id}/${Date.now()}-${safeName}`;

  const { error } = await sb.storage
    .from(CARD_IMAGE_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    console.error("카드 이미지 업로드 실패:", error);
    alert("카드 이미지 업로드에 실패했습니다.\n\n" + makeErrorText(error));
    return null;
  }

  return filePath;
}

async function checkLogin() {
  const { data, error } = await sb.auth.getSession();

  if (error) {
    alert("로그인 상태 확인 중 오류가 발생했습니다.\n\n" + makeErrorText(error));
    window.location.href = "./index.html";
    return false;
  }

  if (!data.session) {
    alert("로그인이 필요합니다.");
    window.location.href = "./index.html";
    return false;
  }

  currentUser = data.session.user;
  userInfo.textContent = `${getUserDisplayName(currentUser)}님의 카드 도감`;

  return true;
}

async function loadCards() {
  const { data, error } = await sb
    .from("user_cards")
    .select("id, card_name, card_series, rarity, memo, obtained_at, image_path, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("카드 목록 불러오기 실패:", error);
    alert("카드 목록을 불러오지 못했습니다.\n\n" + makeErrorText(error));
    return;
  }

  allCards = data || [];
  renderCards();
}

function getFilteredCards() {
  const keyword = searchInput.value.trim().toLowerCase();

  return allCards.filter((card) => {
    const cardName = card.card_name ? card.card_name.toLowerCase() : "";
    const cardSeries = card.card_series ? card.card_series.toLowerCase() : "";
    const rarity = card.rarity ? card.rarity.toLowerCase() : "";
    const memo = card.memo ? card.memo.toLowerCase() : "";

    return (
      cardName.includes(keyword) ||
      cardSeries.includes(keyword) ||
      rarity.includes(keyword) ||
      memo.includes(keyword)
    );
  });
}

function renderCards() {
  const cards = getFilteredCards();

  cardTotalCount.textContent = `${allCards.length}장`;

  if (cards.length === 0) {
    cardList.innerHTML = `
      <li class="empty-message">
        아직 등록된 카드가 없어.<br />
        위에서 수집한 카드를 작성해줘.
      </li>
    `;
    return;
  }

  cardList.innerHTML = cards
    .map((card) => {
      const imageUrl = getCardImageUrl(card.image_path);

      const photoHTML = imageUrl
        ? `
          <div class="card-photo">
            <img src="${escapeHTML(imageUrl)}" alt="${escapeHTML(card.card_name)}" />
          </div>
        `
        : `
          <div class="card-photo empty-photo">
            No<br />Image
          </div>
        `;

      return `
        <li class="collection-card">
          ${photoHTML}

          <div class="card-content">
            <h3>${escapeHTML(card.card_name)}</h3>

            <div class="card-chip-row">
              <span class="card-chip">${escapeHTML(card.card_series || "미분류")}</span>
              <span class="card-chip">${escapeHTML(card.rarity)}</span>
            </div>

            <p class="card-info">
              수집일: ${escapeHTML(card.obtained_at || "미입력")}<br />
              메모: ${card.memo ? escapeHTML(card.memo) : "없음"}
            </p>

            <div class="card-actions">
              <button class="edit-button" type="button" onclick="startEditCard(${JSON.stringify(card.id)})">
                수정
              </button>
              <button class="delete-button" type="button" onclick="deleteCard(${JSON.stringify(card.id)})">
                삭제
              </button>
            </div>
          </div>
        </li>
      `;
    })
    .join("");
}

async function saveCard() {
  const cardName = cardNameInput.value.trim();
  const cardSeries = cardSeriesInput.value.trim();
  const rarity = rarityInput.value;
  const obtainedAt = obtainedAtInput.value || getTodayText();
  const memo = memoInput.value.trim();

  if (!cardName) {
    alert("카드 이름을 입력해주세요.");
    cardNameInput.focus();
    return;
  }

  if (!cardSeries) {
    alert("시리즈를 입력해주세요.");
    cardSeriesInput.focus();
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = editingCardId ? "수정 중..." : "추가 중...";

  const imagePath = await uploadCardImageIfNeeded();

  if (imagePath === null && cardImageInput.files[0]) {
    submitButton.disabled = false;
    submitButton.textContent = editingCardId ? "수정 완료" : "카드 추가";
    return;
  }

  const cardData = {
    user_id: currentUser.id,
    card_name: cardName,
    card_series: cardSeries,
    rarity: rarity,
    obtained_at: obtainedAt,
    memo: memo,
    image_path: imagePath,
  };

  if (editingCardId !== null) {
    const { error } = await sb
      .from("user_cards")
      .update(cardData)
      .eq("id", editingCardId);

    if (error) {
      console.error("카드 수정 실패:", error);
      alert("카드 수정에 실패했습니다.\n\n" + makeErrorText(error));

      submitButton.disabled = false;
      submitButton.textContent = "수정 완료";
      return;
    }

    resetForm();
    await loadCards();
    return;
  }

  const { error } = await sb
    .from("user_cards")
    .insert(cardData);

  if (error) {
    console.error("카드 추가 실패:", error);
    alert("카드 추가에 실패했습니다.\n\n" + makeErrorText(error));

    submitButton.disabled = false;
    submitButton.textContent = "카드 추가";
    return;
  }

  resetForm();
  await loadCards();
}

function startEditCard(id) {
  const card = allCards.find((card) => String(card.id) === String(id));

  if (!card) {
    alert("수정할 카드를 찾지 못했습니다.");
    return;
  }

  editingCardId = card.id;
  editingImagePath = card.image_path || null;

  cardNameInput.value = card.card_name;
  cardSeriesInput.value = card.card_series || "";
  rarityInput.value = card.rarity;
  obtainedAtInput.value = card.obtained_at || getTodayText();
  memoInput.value = card.memo || "";
  cardImageInput.value = "";

  submitButton.textContent = "수정 완료";
  cancelButton.style.display = "block";

  cardNameInput.focus();
}

async function deleteCard(id) {
  const card = allCards.find((card) => String(card.id) === String(id));

  if (!card) {
    alert("삭제할 카드를 찾지 못했습니다.");
    return;
  }

  const isDelete = confirm("이 카드를 삭제할까요?");

  if (!isDelete) {
    return;
  }

  const { error } = await sb
    .from("user_cards")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("카드 삭제 실패:", error);
    alert("카드 삭제에 실패했습니다.\n\n" + makeErrorText(error));
    return;
  }

  if (card.image_path) {
    await sb.storage
      .from(CARD_IMAGE_BUCKET)
      .remove([card.image_path]);
  }

  await loadCards();
}

function resetForm() {
  cardForm.reset();
  obtainedAtInput.value = getTodayText();

  editingCardId = null;
  editingImagePath = null;

  submitButton.disabled = false;
  submitButton.textContent = "카드 추가";
  cancelButton.style.display = "none";
}

window.startEditCard = startEditCard;
window.deleteCard = deleteCard;

async function initCardsPage() {
  const isLoggedIn = await checkLogin();

  if (!isLoggedIn) {
    return;
  }

  obtainedAtInput.value = getTodayText();

  await loadCards();
}

initCardsPage();