window.onload = function () {
  const now = new Date();
  const month = now.getMonth() + 1; // 5月
  const date = now.getDate();
  const hour = now.getHours();

  let defaultLocation = "金澤市"; // 全域預設值

  // 判斷是否在行程區間內 (2026年5月)
  if (now.getFullYear() === 2026 && month === 5) {
    if (date === 7) {
      // 5/7 下午4點後抵達福井 (檔案紀錄 5/7 住宿為福井)
      if (hour >= 16) defaultLocation = "福井";
    } else if (date === 8) {
      // 5/8 整天在福井 (永平寺、一乘谷朝倉氏遺跡)
      defaultLocation = "福井";
    } else if (date === 9) {
      // 5/9 下午4點後抵達富山 (檔案紀錄 5/9 住宿轉為富山)
      if (hour >= 16) defaultLocation = "富山";
      else defaultLocation = "福井";
    } else if (date === 10) {
      // 5/10 下午4點在新高岡 (檔案紀錄 5/10 住宿為新高岡)
      if (hour >= 16) defaultLocation = "新高岡";
      else defaultLocation = "富山";
    } else if (date === 11) {
      // 5/11 下午3點後在金澤 (檔案紀錄 5/11 住宿轉為金澤)
      if (hour >= 15) defaultLocation = "金澤";
      else defaultLocation = "新高岡";
    } else if (date >= 12 && date <= 14) {
      // 5/12-5/14 住宿均在金澤
      defaultLocation = "金澤";
    }
  }

  // 執行地圖更新
  updateMap(defaultLocation);
};

const itineraryData = [
  {
    date: "5/7 (四)",
    theme: "抵達福井",
    meals: { b: "自理", l: "自理", d: "焼めし つねを 小松駅店" },
    hotel: "東横INN 福井站前",
    spots: [{ name: "待議", desc: "" }],
    specialties: [
      {
        name: "村中甘泉堂 羽二重餅",
        target: "くるふ福井駅店",
        tag: "https://www.kansendo.com/item/",
        img: "./images/村中甘泉堂羽二重餅.png",
      },
    ],
  },
  {
    date: "5/8 (五)",
    theme: "福井",
    meals: { b: "飯店早餐", l: "", d: "" },
    hotel: "東横INN 福井站前",
    spots: [
      { name: "永平寺", desc: "曹洞宗大本山，靜謐禪意" },
      { name: "平泉寺白山神社", desc: "" },
      { name: "大野市", desc: "" },
      { name: "一乘谷朝倉氏遺跡", desc: "戰國時代城下町遺構" },
    ],
  },
  {
    date: "5/9 (六)",
    theme: "福井 → 富山",
    meals: { b: "飯店早餐", l: "", d: "富山迴轉壽司 富山車站前店" },
    hotel: "東橫INN 富山站新幹線口2號店",
    spots: [
      { name: "毛谷黑龍神社", desc: "" },
      { name: "柴田神社(北之庄城)", desc: "" },
      { name: "富山市役所展望塔", desc: "" },
      { name: "3COINS 富山站前", desc: "" },
    ],
    specialties: [
      {
        name: "富山柿餅",
        target: "南礪市 三社柿",
        tag: "400年工藝",
        img: "",
      },
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
      { name: "金澤FORUS--購物", desc: "島村樂器、UNIQLO、無印良品" },
    ],
  },
  {
    date: "5/12 (二)",
    theme: "金澤",
    meals: { b: "飯店早餐", l: "", d: "" },
    hotel: "東橫INN 金澤車站東口",
    spots: [
      { name: "近江町市場", desc: "" },
      { name: "長町武家屋敷跡", desc: "" },
    ],
  },
  {
    date: "5/13 (三)",
    theme: "金澤",
    meals: { b: "飯店早餐", l: "", d: "" },
    hotel: "東橫INN 金澤車站東口",
    spots: [
      { name: "金澤城 兼六園", desc: "" },
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
  const aosAttr = isMobile ? 'data-aos="zoom-in"' : "";
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

  // 1. 景點列表
  day.spots.forEach((spot) => {
    dayHtml += `
      <div class="card" onclick="updateMap('${spot.name}')">
        <div class="spot-title">${spot.name}</div>
        <div class="spot-desc">${spot.desc}</div>
      </div>
    `;
  });

  // 2. 新增：北陸特產 (如果該日有資料才顯示)
  if (day.specialties && day.specialties.length > 0) {
    day.specialties.forEach((spec) => {
      dayHtml += `
        <div class="info-box specialty-info" onclick="updateMap('${spec.target}')">
          <div class="specialty-text">
            <div><i class="fas fa-gift"></i></div>
            <div>
              <strong>特產：</strong>${spec.name} (${spec.tag})
            </div>
          </div>
          <!-- 圖示與預覽圖容器 -->
          <div class="specialty-icon-container">
            <i class="fas fa-image"></i>
            <img src="${spec.img || "./images/default.png"}" class="specialty-preview-img" alt="${spec.name}" />
          </div>
        </div>
      `;
    });
  }

  // 3. 住宿資訊
  dayHtml += `
    <div class="info-box hotel-info" onclick="updateMap('${day.hotel}')">
      <i class="fas fa-bed"></i>
      <div><strong>住宿：</strong>${day.hotel}</div>
    </div>
  </div>`;

  listContainer.innerHTML += dayHtml;
});

const updateMap = (address) => {
  const encoded = encodeURIComponent(address);
  // 修正連結格式
  document.getElementById("gmap").src =
    `https://maps.google.com/maps?q=${encoded}&hl=zh-TW&z=15&output=embed`;

  if (window.innerWidth <= 992) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};

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

// ===== 天氣預報功能 =====
const weatherLocations = {
  fukui:    { label: "福井", lat: 36.0652, lon: 136.2217 },
  toyama:   { label: "富山", lat: 36.6953, lon: 137.2113 },
  takaoka:  { label: "新高岡", lat: 36.7580, lon: 137.0059 },
  kanazawa: { label: "金澤", lat: 36.5613, lon: 136.6562 },
};

const dayRegions = [
  "fukui", "fukui", "toyama", "takaoka", "kanazawa", "kanazawa", "kanazawa", "kanazawa"
];

function wmoIcon(code) {
  if (code === 0) return "☀️";
  if (code <= 2) return "⛅";
  if (code <= 3) return "☁️";
  if (code <= 49) return "🌫️";
  if (code <= 69) return "🌦️";
  if (code <= 79) return "🌨️";
  return "⛈️";
}

async function loadWeatherBadges() {
  const weatherMap = {};
  const regions = [...new Set(dayRegions)];
  await Promise.all(regions.map(async (r) => {
    const { lat, lon } = weatherLocations[r];
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode&timezone=Asia%2FTokyo&start_date=2026-05-07&end_date=2026-05-14`;
    const res = await fetch(url);
    weatherMap[r] = (await res.json()).daily;
  }));

  document.querySelectorAll('.day-group').forEach((el, i) => {
    const region = dayRegions[i];
    const d = weatherMap[region];
    const hi = Math.round(d.temperature_2m_max[i]);
    const lo = Math.round(d.temperature_2m_min[i]);
    const rain = Math.round(d.precipitation_probability_max[i]);
    const icon = wmoIcon(d.weathercode[i]);

    const badge = document.createElement('div');
    badge.className = 'weather-badge';
    badge.innerHTML = `<span class="wb-icon">${icon}</span><span class="wb-hi">${hi}°</span><span class="wb-sep">/</span><span class="wb-lo">${lo}°</span><span class="wb-rain">☂️${rain}%</span>`;
    el.querySelector('.day-label').appendChild(badge);
  });
}

loadWeatherBadges();