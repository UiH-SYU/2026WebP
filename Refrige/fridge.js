// 1. Supabase 연결 정보
const SUPABASE_URL = "https://cusuqrawykjcxziupovi.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1c3VxcmF3eWtqY3h6aXVwb3ZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxOTUyMzcsImV4cCI6MjA5Mjc3MTIzN30.UYST5NTS1mR3HDnYU8qNnvTvWgJt72guuKuUxpbpHzk";

// 2. Supabase 클라이언트 생성
const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 3. HTML 요소 가져오기
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

// 4. 전체 음식 데이터와 수정 중인 id
let allFoods = [];
let editingFoodId = null;

// 5. HTML 출력 안전 처리
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

// 6. YYYY-MM-DD를 로컬 날짜로 변환
function parseDateOnly(dateText) {
  const parts = dateText.split("-");
  const year = Number(parts[0]);
  const month = Number(parts[1]);
  const day = Number(parts[2]);

  return new Date(year, month - 1, day);
}

// 7. D-day 계산
function getDday(expireDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetDate = parseDateOnly(expireDate);
  targetDate.setHours(0, 0, 0, 0);

  const diff = targetDate - today;
  const dday = Math.ceil(diff / (1000 * 60 * 60 * 24));

  return dday;
}

// 8. D-day 상태 결정
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

// 9. 등록일 보기 좋게 변환
function formatDateTime(dateTime) {
  if (!dateTime) {
    return "정보 없음";
  }

  const date = new Date(dateTime);

  if (Number.isNaN(date.getTime())) {
    return dateTime;
  }

  return date.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// 10. 검색 적용
function getFilteredFoods() {
  const keyword = searchInput.value.trim().toLowerCase();

  const filteredFoods = allFoods.filter(function (food) {
    const name = food.name.toLowerCase();
    const category = food.category.toLowerCase();
    const memo = food.memo ? food.memo.toLowerCase() : "";

    return (
      name.includes(keyword) ||
      category.includes(keyword) ||
      memo.includes(keyword)
    );
  });

  return filteredFoods;
}

// 11. 가운데 선반 음식 리스트 출력
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
            <div>수량: ${food.quantity}개</div>
            <div>유통기한: ${escapeHTML(food.expire_date)}</div>
            <div>메모: ${food.memo ? escapeHTML(food.memo) : "없음"}</div>
          </div>

          <div class="food-actions">
            <button class="edit-button" onclick="startEditFood(${food.id})">
              수정
            </button>
            <button class="delete-button" onclick="deleteFood(${food.id})">
              삭제
            </button>
          </div>
        </li>
      `;
    })
    .join("");

  foodList.innerHTML = foodItems;
}

// 12. 오른쪽 문 유통기한 임박 음식 출력
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
            <div>수량: ${food.quantity}개</div>
            <div>기한: ${escapeHTML(food.expire_date)}</div>
          </div>
        </li>
      `;
    })
    .join("");

  warningList.innerHTML = warningItems;
}

// 13. 전체 다시 출력
function renderAll() {
  const filteredFoods = getFilteredFoods();
  renderFoods(filteredFoods);
  renderWarningFoods();
}

// 14. Supabase에서 음식 목록 불러오기
async function loadFoods() {
  const { data, error } = await client
    .from("foods")
    .select("id, name, category, quantity, expire_date, memo, created_at")
    .order("expire_date", { ascending: true });

  if (error) {
    console.error(error);
    alert("음식 목록을 불러오지 못했습니다.");
    return;
  }

  allFoods = data;
  renderAll();
}

// 15. 음식 추가 또는 수정
async function saveFood(event) {
  event.preventDefault();

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
    name: name,
    category: category,
    quantity: quantity,
    expire_date: expireDate,
    memo: memo,
  };

  // 수정 모드
  if (editingFoodId !== null) {
    const { error } = await client
      .from("foods")
      .update(foodData)
      .eq("id", editingFoodId);

    if (error) {
      console.error(error);
      alert("음식 수정에 실패했습니다.");
      return;
    }

    resetForm();
    await loadFoods();
    return;
  }

  // 추가 모드
  const { error } = await client.from("foods").insert(foodData);

  if (error) {
    console.error(error);
    alert("음식 추가에 실패했습니다.");
    return;
  }

  resetForm();
  await loadFoods();
}

// 16. 음식 삭제
async function deleteFood(id) {
  const isDelete = confirm("정말 삭제할까요?");

  if (!isDelete) {
    return;
  }

  const { error } = await client.from("foods").delete().eq("id", id);

  if (error) {
    console.error(error);
    alert("음식 삭제에 실패했습니다.");
    return;
  }

  await loadFoods();
}

// 17. 수정 시작
function startEditFood(id) {
  const food = allFoods.find(function (food) {
    return food.id === id;
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

// 18. 폼 초기화
function resetForm() {
  foodForm.reset();
  foodQuantityInput.value = 1;

  editingFoodId = null;
  submitButton.textContent = "음식 추가";
  cancelButton.style.display = "none";
}

// 19. 이벤트 연결
foodForm.addEventListener("submit", saveFood);

cancelButton.addEventListener("click", function () {
  resetForm();
});

searchInput.addEventListener("input", function () {
  renderAll();
});

// 20. onclick 함수 등록
window.startEditFood = startEditFood;
window.deleteFood = deleteFood;

// 21. 페이지 열리면 음식 목록 불러오기
loadFoods();