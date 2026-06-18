const client = window.supabaseClient;

if (!client) {
  alert("Supabase 연결이 없습니다. supabaseClient.js와 script 순서를 확인해주세요.");
  throw new Error("window.supabaseClient is missing.");
}

const foodForm = document.querySelector("#food-form");
const foodNameInput = document.querySelector("#food-name");
const foodCategoryInput = document.querySelector("#food-category");
const foodQuantityInput = document.querySelector("#food-quantity");
const foodExpireDateInput = document.querySelector("#food-expire-date");
const foodMemoInput = document.querySelector("#food-memo");

const foodList = document.querySelector("#food-list");
const warningList = document.querySelector("#warning-list");
const foodCount = document.querySelector("#food-count");
const submitButton = document.querySelector("#submit-button");
const cancelButton = document.querySelector("#cancel-button");
const searchInput = document.querySelector("#search-input");

let allFoods = [];
let editingFoodId = null;
let currentUser = null;

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

function parseDateOnly(dateText) {
  if (!dateText) {
    return null;
  }

  const parts = String(dateText).split("-");

  if (parts.length !== 3) {
    return null;
  }

  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(year, month - 1, day);
}

function getDday(expireDate) {
  const targetDate = parseDateOnly(expireDate);

  if (!targetDate) {
    return 9999;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  targetDate.setHours(0, 0, 0, 0);

  const diff = targetDate - today;
  const dday = Math.ceil(diff / (1000 * 60 * 60 * 24));

  return dday;
}

function getDdayInfo(dday) {
  if (dday < 0) {
    return {
      text: `${Math.abs(dday)}일 지남`,
      className: "expired",
      cardClassName: "expired-card",
      warningClassName: "expired-item",
      status: "expired",
    };
  }

  if (dday === 0) {
    return {
      text: "오늘까지",
      className: "warning",
      cardClassName: "warning-card",
      warningClassName: "warning-item-soon",
      status: "warning",
    };
  }

  if (dday <= 3) {
    return {
      text: `D-${dday}`,
      className: "warning",
      cardClassName: "warning-card",
      warningClassName: "warning-item-soon",
      status: "warning",
    };
  }

  return {
    text: `D-${dday}`,
    className: "safe",
    cardClassName: "",
    warningClassName: "",
    status: "safe",
  };
}

function getFilteredFoods() {
  const keyword = searchInput.value.trim().toLowerCase();

  return allFoods.filter(function (food) {
    const name = food.name ? food.name.toLowerCase() : "";
    const category = food.category ? food.category.toLowerCase() : "";
    const memo = food.memo ? food.memo.toLowerCase() : "";

    return (
      name.includes(keyword) ||
      category.includes(keyword) ||
      memo.includes(keyword)
    );
  });
}

function renderFoods(foods) {
  foodList.innerHTML = "";

  if (foods.length === allFoods.length) {
    foodCount.textContent = `${foods.length}개`;
  } else {
    foodCount.textContent = `${foods.length}개 / 전체 ${allFoods.length}개`;
  }

  if (foods.length === 0) {
    foodList.innerHTML = `
      <li class="empty-message">조건에 맞는 음식이 없습니다.</li>
    `;
    return;
  }

  const foodItems = foods
    .map(function (food) {
      const dday = getDday(food.expire_date);
      const ddayInfo = getDdayInfo(dday);

      return `
        <li class="food-card ${ddayInfo.cardClassName}">
          <div class="food-top">
            <div>
              <h3 class="food-name">${escapeHTML(food.name)}</h3>
              <span class="food-category">${escapeHTML(food.category)}</span>
            </div>

            <span class="dday ${ddayInfo.className}">
              ${ddayInfo.text}
            </span>
          </div>

          <div class="food-info">
            <div>수량: ${escapeHTML(food.quantity)}개</div>
            <div>유통기한: ${escapeHTML(food.expire_date)}</div>
            <div>메모: ${food.memo ? escapeHTML(food.memo) : "없음"}</div>
          </div>

          <div class="food-actions">
            <button class="edit-button" onclick="startEditFood(${JSON.stringify(food.id)})">
              수정
            </button>
            <button class="delete-button" onclick="deleteFood(${JSON.stringify(food.id)})">
              삭제
            </button>
          </div>
        </li>
      `;
    })
    .join("");

  foodList.innerHTML = foodItems;
}

function renderWarningFoods() {
  warningList.innerHTML = "";

  const warningFoods = allFoods.filter(function (food) {
    const dday = getDday(food.expire_date);
    return dday <= 3;
  });

  if (warningFoods.length === 0) {
    warningList.innerHTML = `
      <li class="empty-message">임박한 음식이 없습니다.</li>
    `;
    return;
  }

  const warningItems = warningFoods
    .map(function (food) {
      const dday = getDday(food.expire_date);
      const ddayInfo = getDdayInfo(dday);

      return `
        <li class="warning-item ${ddayInfo.warningClassName}">
          <div class="warning-name">
            <span>${escapeHTML(food.name)}</span>
            <span class="dday ${ddayInfo.className}">
              ${ddayInfo.text}
            </span>
          </div>

          <div class="warning-info">
            <div>카테고리: ${escapeHTML(food.category)}</div>
            <div>수량: ${escapeHTML(food.quantity)}개</div>
            <div>기한: ${escapeHTML(food.expire_date)}</div>
          </div>
        </li>
      `;
    })
    .join("");

  warningList.innerHTML = warningItems;
}

function renderAll() {
  const filteredFoods = getFilteredFoods();
  renderFoods(filteredFoods);
  renderWarningFoods();
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

async function checkLogin() {
  const { data, error } = await client.auth.getSession();

  if (error) {
    console.error("로그인 상태 확인 실패:", error);
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
  return true;
}

async function loadFoods() {
  if (!currentUser) {
    return;
  }

  const { data, error } = await client
    .from("foods")
    .select("id, user_id, name, category, quantity, expire_date, memo, created_at")
    .order("expire_date", { ascending: true });

  if (error) {
    console.error("음식 목록 불러오기 실패:", error);
    alert("음식 목록을 불러오지 못했습니다.\n\n" + makeErrorText(error));
    return;
  }

  allFoods = data || [];
  renderAll();
}

async function saveFood(event) {
  event.preventDefault();

  if (!currentUser) {
    alert("로그인이 필요합니다.");
    window.location.href = "./index.html";
    return;
  }

  const name = foodNameInput.value.trim();
  const category = foodCategoryInput.value;
  const quantity = Number(foodQuantityInput.value);
  const expireDate = foodExpireDateInput.value;
  const memo = foodMemoInput.value.trim();

  if (!name) {
    alert("음식 이름을 입력해주세요.");
    return;
  }

  if (!category) {
    alert("카테고리를 선택해주세요.");
    return;
  }

  if (!quantity || quantity < 1) {
    alert("수량은 1 이상이어야 합니다.");
    return;
  }

  if (!expireDate) {
    alert("유통기한을 선택해주세요.");
    return;
  }

  const foodData = {
    user_id: currentUser.id,
    name: name,
    category: category,
    quantity: quantity,
    expire_date: expireDate,
    memo: memo,
  };

  if (editingFoodId !== null) {
    const { error } = await client
      .from("foods")
      .update(foodData)
      .eq("id", editingFoodId);

    if (error) {
      console.error("음식 수정 실패:", error);
      alert("음식 수정에 실패했습니다.\n\n" + makeErrorText(error));
      return;
    }

    resetForm();
    await loadFoods();
    return;
  }

  const { error } = await client.from("foods").insert(foodData);

  if (error) {
    console.error("음식 추가 실패:", error);
    alert("음식 추가에 실패했습니다.\n\n" + makeErrorText(error));
    return;
  }

  resetForm();
  await loadFoods();
}

async function deleteFood(id) {
  if (!currentUser) {
    alert("로그인이 필요합니다.");
    window.location.href = "./index.html";
    return;
  }

  const isDelete = confirm("정말 삭제할까요?");

  if (!isDelete) {
    return;
  }

  const { error } = await client
    .from("foods")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("음식 삭제 실패:", error);
    alert("음식 삭제에 실패했습니다.\n\n" + makeErrorText(error));
    return;
  }

  await loadFoods();
}

function startEditFood(id) {
  const food = allFoods.find(function (food) {
    return String(food.id) === String(id);
  });

  if (!food) {
    alert("수정할 음식 정보를 찾지 못했습니다.");
    return;
  }

  editingFoodId = food.id;

  foodNameInput.value = food.name;
  foodCategoryInput.value = food.category;
  foodQuantityInput.value = food.quantity;
  foodExpireDateInput.value = food.expire_date;
  foodMemoInput.value = food.memo ? food.memo : "";

  submitButton.textContent = "수정 완료";
  cancelButton.style.display = "block";
}

function resetForm() {
  foodForm.reset();
  foodQuantityInput.value = 1;

  editingFoodId = null;
  submitButton.textContent = "음식 추가";
  cancelButton.style.display = "none";
}

client.auth.onAuthStateChange(function (event, session) {
  if (!session) {
    currentUser = null;
  }
});

foodForm.addEventListener("submit", saveFood);

cancelButton.addEventListener("click", function () {
  resetForm();
});

searchInput.addEventListener("input", function () {
  renderAll();
});

window.startEditFood = startEditFood;
window.deleteFood = deleteFood;

async function initFridgePage() {
  const isLoggedIn = await checkLogin();

  if (!isLoggedIn) {
    return;
  }

  await loadFoods();
}

initFridgePage();