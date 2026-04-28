const itineraryData = [
  {
    date: "5/7 (四)",
    theme: "抵達福井",
    meals: { b: "自理", l: "自理", d: "" },
    hotel: "東横INN 福井站前",
    spots: [{ name: "待議", desc: "" }],
  },
  {
    date: "5/8 (五)",
    theme: "福井",
    meals: { b: "飯店早餐", l: "", d: "" },
    hotel: "東横INN 福井站前",
    spots: [
      { name: "永平寺", desc: "曹洞宗大本山，靜謐禪意" },
      { name: "平泉寺白山神社", desc: "" },
      { name: "大野", desc: "" },
      { name: "一乘谷朝倉氏遺跡", desc: "戰國時代城下町遺構" },
    ],
  },
  {
    date: "5/9 (六)",
    theme: "福井 → 富山",
    meals: { b: "飯店早餐", l: "", d: "" },
    hotel: "東橫INN 富山站新幹線口2號店",
    spots: [
      { name: "毛谷黑龍神社", desc: "" },
      { name: "柴田神社(北之庄城)", desc: "" },
      { name: "富山市役所展望塔", desc: "" },
    ],
  },
  {
    date: "5/10 (日)",
    theme: "富山 → 新高岡",
    meals: { b: "飯店早餐", l: "", d: "" },
    hotel: "東横INN 新高岡駅新幹線南口",
    spots: [
      { name: "日枝神社", desc: "" },
      {
        name: "五箇山と越中の小京都",
        desc: "https://toyama.visit-town.com/visittour/tabitakutoyama-goka",
      },
      { name: "MPC高岡南", desc: "看樂器" },
    ],
  },
  {
    date: "5/11 (一)",
    theme: "新高岡 → 金澤",
    meals: { b: "飯店早餐", l: "新湊漁夫市場", d: "" },
    hotel: "東橫INN 金澤車站東口",
    spots: [
      { name: "雨晴", desc: "" },
      { name: "氣多神社", desc: "" },
      { name: "高岡大佛射水神社", desc: "" },
    ],
  },
  {
    date: "5/12 (二)",
    theme: "金澤",
    meals: { b: "飯店早餐", l: "", d: "" },
    hotel: "東橫INN 金澤車站東口",
    spots: [
      { name: "待議", desc: "" },
      { name: "待議", desc: "" },
    ],
  },
  {
    date: "5/13 (三)",
    theme: "金澤",
    meals: { b: "飯店早餐", l: "", d: "" },
    hotel: "東橫INN 金澤車站東口",
    spots: [
      { name: "待議", desc: "" },
      { name: "待議", desc: "" },
    ],
  },
  {
    date: "5/14 (四)",
    theme: "回程",
    meals: { b: "飯店早餐", l: "", d: "機上晚餐" },
    hotel: "溫暖的家",
    spots: [
      { name: "金劔宮", desc: "" },
      { name: "白山比咩神社", desc: "" },
    ],
  },
];

const listContainer = document.getElementById("itinerary-list");
const isMobile = window.innerWidth <= 992; // 判斷是否為手機版

itineraryData.forEach((day) => {
  const aosAttr = isMobile ? 'data-aos="zoom-in"' : '';
  let dayHtml = `
      <div class="day-group" ${aosAttr}>
          <div class="day-label">${day.date} - ${day.theme}</div>
          
          <div class="info-box meal-info">
            <i class="fas fa-utensils"></i>
            <div>
              <span class="meal-item"><strong>早：</strong>${day.meals.b}</span>
              <span class="meal-item"><strong>中：</strong>${day.meals.l}</span>
              <span class="meal-item"><strong>晚：</strong>${day.meals.d}</span>
            </div>
          </div>
  `;

  // 景點列表
  day.spots.forEach((spot) => {
    dayHtml += `
          <div class="card" onclick="updateMap('${spot.name}')">
              <div class="spot-title">${spot.name}</div>
              <div class="spot-desc">${spot.desc}</div>
          </div>
      `;
  });

  // 住宿資訊
  dayHtml += `
          <div class="info-box hotel-info" onclick="updateMap('${day.hotel}')">
            <i class="fas fa-bed"></i>
            <div><strong>住宿：</strong>${day.hotel}</div>
          </div>
      </div>`;

  listContainer.innerHTML += dayHtml;
});

function updateMap(address) {
  const encoded = encodeURIComponent(address);
  // 修正連結格式
  document.getElementById("gmap").src =
    `https://maps.google.com/maps?q=${encoded}&hl=zh-TW&z=15&output=embed`;

  if (window.innerWidth <= 992) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

const goToTopBtn = document.getElementById("goToTop");
const sidebar = document.getElementById("sidebar");

// 監聽側邊欄的捲動事件
sidebar.addEventListener("scroll", () => {
  // 當側邊欄往下捲動超過 300 像素時顯示按鈕
  if (sidebar.scrollTop > 300) {
    goToTopBtn.classList.add("show");
  } else {
    goToTopBtn.classList.remove("show");
  }
});

// 點擊按鈕回頂部的邏輯
goToTopBtn.addEventListener("click", () => {
  sidebar.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// 針對手機版 RWD 的額外監聽 (手機版是全頁捲動)
window.addEventListener("scroll", () => {
  if (window.innerWidth <= 992) {
    if (window.pageYOffset > 300) {
      goToTopBtn.classList.add("show");
    } else {
      goToTopBtn.classList.remove("show");
    }
  }
});

// 取得航班觸發元素
const flightTrigger = document.querySelector('.flight-trigger');
const flightPopup = document.querySelector('.flight-popup');

// 監聽點擊事件
flightTrigger.addEventListener('click', (e) => {
  // 切換顯示狀態
  const isVisible = flightPopup.style.visibility === 'visible';
  flightPopup.style.visibility = isVisible ? 'hidden' : 'visible';
  flightPopup.style.opacity = isVisible ? '0' : '1';
  
  // 防止點擊穿透到地圖或其他元素
  e.stopPropagation();
});

// 點擊頁面其他地方時自動關閉
document.addEventListener('click', () => {
  flightPopup.style.visibility = 'hidden';
  flightPopup.style.opacity = '0';
});