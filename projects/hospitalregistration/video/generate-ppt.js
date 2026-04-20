const pptxgen = require("pptxgenjs");
const path = require("path");

const pptx = new pptxgen();

// ── Theme colors ──
const GREEN = "4A7C59";
const GREEN_DARK = "2D5A3D";
const GREEN_HEADER = "5A7050";
const GREEN_LIGHT = "E8F0E8";
const GREEN_BG = "F0F7F2";
const WHITE = "FFFFFF";
const TEXT = "333333";
const TITLE_COLOR = "2D2D2D";
const GRAY = "666666";
const RED = "A62911";

pptx.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
pptx.author = "安康綜合醫院";
pptx.title = "門診掛號系統 操作手冊";

// ── Helper: add green header bar to every content slide ──
function addHeader(slide, title) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: "100%", h: 0.7,
    fill: { color: GREEN_HEADER },
  });
  slide.addText(title, {
    x: 0.5, y: 0.1, w: 12, h: 0.5,
    fontSize: 20, fontFace: "Microsoft JhengHei", color: WHITE, bold: true,
  });
}

// ── Helper: add footer ──
function addFooter(slide, pageNum) {
  slide.addText(`安康綜合醫院 門診掛號系統 操作手冊`, {
    x: 0.5, y: 6.9, w: 8, h: 0.4,
    fontSize: 9, fontFace: "Microsoft JhengHei", color: "999999",
  });
  slide.addText(`${pageNum}`, {
    x: 12, y: 6.9, w: 1, h: 0.4,
    fontSize: 9, fontFace: "Microsoft JhengHei", color: "999999", align: "right",
  });
}

// ── Helper: styled table ──
function addTable(slide, headers, rows, opts = {}) {
  const tableRows = [];
  // Header row
  tableRows.push(
    headers.map((h) => ({
      text: h,
      options: { bold: true, color: WHITE, fill: { color: GREEN }, fontSize: 11, fontFace: "Microsoft JhengHei" },
    }))
  );
  // Data rows
  rows.forEach((row, i) => {
    tableRows.push(
      row.map((cell) => ({
        text: cell,
        options: { fontSize: 11, fontFace: "Microsoft JhengHei", color: TEXT, fill: { color: i % 2 === 0 ? "F5F5F5" : WHITE } },
      }))
    );
  });
  slide.addTable(tableRows, {
    x: opts.x || 0.5,
    y: opts.y || 2.0,
    w: opts.w || 12.3,
    border: { pt: 0.5, color: "999999" },
    colW: opts.colW,
    autoPage: false,
  });
}

// ── Helper: step box ──
function addStep(slide, num, title, desc, y) {
  // Circle
  slide.addShape(pptx.ShapeType.ellipse, {
    x: 0.6, y: y, w: 0.45, h: 0.45,
    fill: { color: GREEN },
  });
  slide.addText(`${num}`, {
    x: 0.6, y: y, w: 0.45, h: 0.45,
    fontSize: 16, fontFace: "Microsoft JhengHei", color: WHITE, bold: true, align: "center", valign: "middle",
  });
  // Box
  slide.addShape(pptx.ShapeType.rect, {
    x: 1.2, y: y, w: 11.3, h: 0.45,
    fill: { color: GREEN_BG },
    rectRadius: 0.05,
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 1.2, y: y, w: 0.06, h: 0.45,
    fill: { color: GREEN },
  });
  slide.addText([
    { text: `${title}  `, options: { bold: true, fontSize: 12, color: GREEN_DARK } },
    { text: desc, options: { fontSize: 11, color: TEXT } },
  ], {
    x: 1.4, y: y, w: 11, h: 0.45,
    fontFace: "Microsoft JhengHei", valign: "middle",
  });
}

// ════════════════════════════════════════════
// SLIDE 1: Title
// ════════════════════════════════════════════
let slide = pptx.addSlide();
slide.addShape(pptx.ShapeType.rect, {
  x: 0, y: 0, w: "100%", h: "100%",
  fill: { type: "solid", color: GREEN_HEADER },
});
slide.addText("安康綜合醫院", {
  x: 0, y: 1.8, w: "100%", h: 1.2,
  fontSize: 44, fontFace: "Microsoft JhengHei", color: WHITE, bold: true,
  align: "center",
});
slide.addText("門診掛號系統 操作手冊", {
  x: 0, y: 3.0, w: "100%", h: 0.8,
  fontSize: 24, fontFace: "Microsoft JhengHei", color: "D4DCD4",
  align: "center",
});
slide.addText("Hospital Registration System - User Guide", {
  x: 0, y: 4.2, w: "100%", h: 0.5,
  fontSize: 13, fontFace: "Microsoft JhengHei", color: "9DAF9D",
  align: "center",
});
slide.addText("115.4.7", {
  x: 0, y: 6.5, w: "100%", h: 0.4,
  fontSize: 12, fontFace: "Microsoft JhengHei", color: "8CA08C",
  align: "center",
});

// ════════════════════════════════════════════
// SLIDE 2: 目錄
// ════════════════════════════════════════════
slide = pptx.addSlide();
addHeader(slide, "目錄");
addFooter(slide, 2);

const tocItems = [
  "一、系統簡介",
  "二、系統啟動",
  "三、畫面說明",
  "四、掛號作業流程",
  "五、步驟一：輸入病歷號碼",
  "六、步驟二：填寫／確認病患資訊",
  "七、步驟三：選擇門診預約資訊",
  "八、步驟四：確認掛號",
  "九、舊病患掛號範例",
  "十、新病患掛號範例",
  "十一、操作按鈕說明",
  "十二、常見問題（FAQ）",
];

tocItems.forEach((item, i) => {
  slide.addText(item, {
    x: 1.5, y: 1.0 + i * 0.42, w: 10, h: 0.4,
    fontSize: 14, fontFace: "Microsoft JhengHei", color: TEXT,
  });
});

// ════════════════════════════════════════════
// SLIDE 3: 系統簡介
// ════════════════════════════════════════════
slide = pptx.addSlide();
addHeader(slide, "一、系統簡介");
addFooter(slide, 3);

addTable(slide,
  ["項目", "說明"],
  [
    ["系統名稱", "安康綜合醫院 門診掛號系統 v2.0"],
    ["系統用途", "提供掛號櫃台人員進行門診掛號作業"],
    ["操作方式", "單一畫面完成所有掛號流程，無需切換頁面"],
    ["使用環境", "網頁瀏覽器（建議使用 Chrome 或 Edge）"],
  ],
  { y: 1.2, colW: [3, 9.3] }
);

slide.addText("本系統為單頁式掛號應用程式，具備自動帶入舊病患資料、身分證即時驗證、年齡自動計算等智慧功能，大幅減少手動輸入的時間與錯誤。", {
  x: 0.5, y: 3.8, w: 12.3, h: 0.8,
  fontSize: 13, fontFace: "Microsoft JhengHei", color: TEXT, lineSpacingMultiple: 1.5,
});

// ════════════════════════════════════════════
// SLIDE 4: 系統啟動
// ════════════════════════════════════════════
slide = pptx.addSlide();
addHeader(slide, "二、系統啟動");
addFooter(slide, 4);

const startSteps = [
  ["1", "安裝", "首次使用，雙擊 install.command 安裝所需程式套件"],
  ["2", "啟動", "雙擊 start.command，系統自動啟動後端伺服器與前端應用"],
  ["3", "開啟", "瀏覽器自動開啟掛號畫面（http://localhost:5173）"],
  ["4", "備用", "若瀏覽器未開啟，手動在網址列輸入上述網址"],
];

startSteps.forEach(([num, title, desc], i) => {
  addStep(slide, num, title, desc, 1.2 + i * 0.65);
});

// ════════════════════════════════════════════
// SLIDE 5: 畫面說明
// ════════════════════════════════════════════
slide = pptx.addSlide();
addHeader(slide, "三、畫面說明");
addFooter(slide, 5);

slide.addText("系統畫面由上而下分為四大區塊：", {
  x: 0.5, y: 1.0, w: 12, h: 0.4,
  fontSize: 13, fontFace: "Microsoft JhengHei", color: TEXT,
});

addTable(slide,
  ["區塊", "位置", "說明"],
  [
    ["標題列", "最上方（綠色）", "顯示醫院名稱「安康綜合醫院」"],
    ["病患資訊", "中上方（白色）", "病歷號碼、姓名、性別、初複診、生日、年齡、電話、縣市、區域、地址"],
    ["門診預約", "中下方（淡灰色）", "掛號日期、掛號時段、科別、醫師，下方顯示掛號號碼"],
    ["操作功能列", "最下方（綠色）", "確認掛號、列印掛號單、清除畫面、結束離開"],
  ],
  { y: 1.5, colW: [2, 2.5, 7.8] }
);

// ════════════════════════════════════════════
// SLIDE 6: 掛號作業流程
// ════════════════════════════════════════════
slide = pptx.addSlide();
addHeader(slide, "四、掛號作業流程");
addFooter(slide, 6);

const flowSteps = [
  ["1", "輸入病歷號碼", "台灣身分證字號 10 碼"],
  ["2", "確認／填寫病患資訊", "舊病患自動帶入，新病患手動填寫"],
  ["3", "選擇門診預約資訊", "掛號日期 → 掛號時段 → 科別 → 醫師"],
  ["4", "點擊「確認掛號」", "系統自動產生掛號號碼"],
  ["5", "列印掛號單", "選擇性操作"],
  ["6", "點擊「清除畫面」", "準備下一位病患掛號"],
];

flowSteps.forEach(([num, title, desc], i) => {
  addStep(slide, num, title, desc, 1.1 + i * 0.65);

  if (i < flowSteps.length - 1) {
    slide.addText("↓", {
      x: 0.65, y: 1.1 + i * 0.65 + 0.4, w: 0.35, h: 0.3,
      fontSize: 16, fontFace: "Microsoft JhengHei", color: GREEN, align: "center",
    });
  }
});

// ════════════════════════════════════════════
// SLIDE 7: 步驟一 - 輸入病歷號碼
// ════════════════════════════════════════════
slide = pptx.addSlide();
addHeader(slide, "五、步驟一：輸入病歷號碼");
addFooter(slide, 7);

slide.addText("在「病歷號碼」欄位中輸入病患的台灣身分證字號（共 10 碼：1 碼英文 + 9 碼數字）", {
  x: 0.5, y: 1.0, w: 12, h: 0.4,
  fontSize: 13, fontFace: "Microsoft JhengHei", color: TEXT,
});

addTable(slide,
  ["查詢結果", "系統行為"],
  [
    ["查到既有病患（舊病患）", "自動帶入所有病患資料，初複診設為「複診」"],
    ["查無此病患（新病患）", "欄位維持空白，初複診自動設為「初診」"],
  ],
  { y: 1.6, colW: [3.5, 8.8] }
);

slide.addText("驗證提示訊息", {
  x: 0.5, y: 3.0, w: 12, h: 0.4,
  fontSize: 14, fontFace: "Microsoft JhengHei", color: GREEN_DARK, bold: true,
});

addTable(slide,
  ["輸入情況", "提示訊息"],
  [
    ["第一碼輸入非英文字母", "「第一碼必須為英文字母」"],
    ["第二碼之後輸入非數字", "「第二碼起必須為數字」"],
    ["輸入不足 10 碼", "「還需輸入 N 碼」"],
    ["10 碼但檢查碼不正確", "「身分證字號檢查碼錯誤」"],
    ["驗證通過", "（無提示，正常顯示）"],
  ],
  { y: 3.5, colW: [3.5, 8.8] }
);

// ════════════════════════════════════════════
// SLIDE 8: 步驟二 - 病患資訊
// ════════════════════════════════════════════
slide = pptx.addSlide();
addHeader(slide, "六、步驟二：填寫／確認病患資訊");
addFooter(slide, 8);

addTable(slide,
  ["列", "欄位", "必填", "操作說明"],
  [
    ["第一列", "病歷號碼", "是", "已在步驟一輸入"],
    ["", "姓名", "是", "輸入病患中文姓名。舊病患會自動帶入"],
    ["", "性別", "否", "下拉選單：男 / 女"],
    ["", "初複診", "否", "系統自動判斷：舊病患→複診，新病患→初診"],
    ["第二列", "生日", "否", "日期選擇器，選擇後年齡自動計算"],
    ["", "年齡", "否", "系統根據生日自動計算，無需手動輸入"],
    ["", "電話", "否", "輸入聯絡電話"],
    ["第三列", "縣市", "否", "下拉選單，全台 22 縣市。選擇後區域自動更新"],
    ["", "區域", "否", "依所選縣市自動載入對應鄉鎮市區"],
    ["", "詳細地址", "否", "輸入門牌號碼等詳細地址"],
  ],
  { y: 1.0, colW: [1.2, 1.8, 0.8, 8.5] }
);

// ════════════════════════════════════════════
// SLIDE 9: 步驟三 - 門診預約
// ════════════════════════════════════════════
slide = pptx.addSlide();
addHeader(slide, "七、步驟三：選擇門診預約資訊");
addFooter(slide, 9);

addTable(slide,
  ["欄位", "必填", "操作說明"],
  [
    ["掛號日期", "是", "預設為今天日期，可手動修改為其他日期"],
    ["掛號時段", "是", "下拉選單：上午 / 下午"],
    ["科別", "是", "下拉選單：內科、外科、小兒科、婦產科、耳鼻喉科、皮膚科、眼科、家醫科。選擇後醫師選單自動更新"],
    ["醫師", "是", "依所選科別自動載入該科醫師名單（每科 3 位）"],
  ],
  { y: 1.2, colW: [2, 1, 9.3] }
);

// Note box
slide.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 3.8, w: 12.3, h: 1.2,
  fill: { color: "FFFDE7" },
  line: { color: "F9A825", width: 0.5 },
  rectRadius: 0.05,
});
slide.addText([
  { text: "掛號號碼編號規則\n", options: { bold: true, fontSize: 13, color: GREEN_DARK } },
  { text: "掛號號碼依「掛號日期 + 掛號時段 + 科別」獨立編號。\n例如：同一天上午內科第一位 = 01 號，第二位 = 02 號。同一天下午內科重新從 01 號開始。", options: { fontSize: 12, color: TEXT } },
], {
  x: 0.7, y: 3.9, w: 11.9, h: 1.0,
  fontFace: "Microsoft JhengHei", lineSpacingMultiple: 1.4,
});

// ════════════════════════════════════════════
// SLIDE 10: 步驟四 - 確認掛號
// ════════════════════════════════════════════
slide = pptx.addSlide();
addHeader(slide, "八、步驟四：確認掛號");
addFooter(slide, 10);

const confirmSteps = [
  ["1", "點擊按鈕", "確認所有資訊後，點擊「確認掛號」按鈕"],
  ["2", "系統檢查", "自動檢查必填欄位：病歷號碼、姓名、掛號日期、掛號時段、科別、醫師"],
  ["3", "補齊遺漏", "若有遺漏，系統彈出提示訊息，補齊後再次點擊"],
  ["4", "掛號成功", "畫面顯示科別名稱與掛號號碼（兩碼數字），彈出「掛號成功！」"],
];

confirmSteps.forEach(([num, title, desc], i) => {
  addStep(slide, num, title, desc, 1.2 + i * 0.65);
});

// Warning box
slide.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 4.2, w: 12.3, h: 0.7,
  fill: { color: "FCE4EC" },
  line: { color: RED, width: 0.5 },
  rectRadius: 0.05,
});
slide.addText("必填欄位：病歷號碼、姓名、掛號日期、掛號時段、科別、醫師。缺少任何一項將無法完成掛號。", {
  x: 0.7, y: 4.3, w: 11.9, h: 0.5,
  fontSize: 12, fontFace: "Microsoft JhengHei", color: RED, bold: true,
});

// ════════════════════════════════════════════
// SLIDE 11: 舊病患掛號範例
// ════════════════════════════════════════════
slide = pptx.addSlide();
addHeader(slide, "九、舊病患掛號操作範例");
addFooter(slide, 11);

// Scenario box
slide.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 1.0, w: 12.3, h: 0.55,
  fill: { color: GREEN_LIGHT },
  rectRadius: 0.05,
});
slide.addText("情境：病患王小明（A123456789）前來內科看診，掛號上午門診", {
  x: 0.7, y: 1.05, w: 12, h: 0.45,
  fontSize: 13, fontFace: "Microsoft JhengHei", color: GREEN_DARK, bold: true, valign: "middle",
});

const oldPatientSteps = [
  ["1", "輸入病歷號碼", "輸入 A123456789"],
  ["2", "系統自動帶入", "姓名、性別、生日、電話、地址自動填入，初複診設為「複診」"],
  ["3", "確認病患資訊", "確認資料正確，如有變更可直接修改"],
  ["4", "選擇門診資訊", "時段：上午 → 科別：內科 → 醫師：王建明"],
  ["5", "確認掛號", "點擊「確認掛號」，顯示掛號號碼"],
  ["6", "列印與清除", "列印掛號單（選擇性），點擊「清除畫面」準備下一位"],
];

oldPatientSteps.forEach(([num, title, desc], i) => {
  addStep(slide, num, title, desc, 1.8 + i * 0.6);
});

// ════════════════════════════════════════════
// SLIDE 12: 新病患掛號範例
// ════════════════════════════════════════════
slide = pptx.addSlide();
addHeader(slide, "十、新病患掛號操作範例");
addFooter(slide, 12);

slide.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 1.0, w: 12.3, h: 0.55,
  fill: { color: GREEN_LIGHT },
  rectRadius: 0.05,
});
slide.addText("情境：新病患陳美美（F231234567）首次前來眼科看診，掛號下午門診", {
  x: 0.7, y: 1.05, w: 12, h: 0.45,
  fontSize: 13, fontFace: "Microsoft JhengHei", color: GREEN_DARK, bold: true, valign: "middle",
});

const newPatientSteps = [
  ["1", "輸入病歷號碼", "輸入 F231234567，系統查無此病患"],
  ["2", "手動填寫資訊", "姓名：陳美美、性別：女、生日、電話、地址等"],
  ["3", "系統自動判斷", "初複診自動設為「初診」，年齡根據生日自動計算"],
  ["4", "選擇門診資訊", "時段：下午 → 科別：眼科 → 醫師：廖美慧"],
  ["5", "確認掛號", "系統自動建立新病患資料並完成掛號"],
  ["6", "下次自動帶入", "該病患資料已儲存，下次輸入同號碼即可自動帶入"],
];

newPatientSteps.forEach(([num, title, desc], i) => {
  addStep(slide, num, title, desc, 1.8 + i * 0.6);
});

// ════════════════════════════════════════════
// SLIDE 13: 操作按鈕說明
// ════════════════════════════════════════════
slide = pptx.addSlide();
addHeader(slide, "十一、操作按鈕說明");
addFooter(slide, 13);

addTable(slide,
  ["按鈕", "功能", "使用時機"],
  [
    ["確認掛號", "檢查必填欄位 → 新增或更新病患 → 建立掛號紀錄 → 產生掛號號碼", "所有資訊填寫完畢後點擊"],
    ["列印掛號單", "開啟瀏覽器列印功能，列印掛號收據", "掛號成功後，需要紙本收據時"],
    ["清除畫面", "重置所有欄位為初始狀態", "完成掛號，準備下一位病患時"],
    ["結束離開", "關閉瀏覽器視窗", "所有作業完成，不再使用系統時"],
  ],
  { y: 1.2, colW: [2, 6, 4.3] }
);

// ════════════════════════════════════════════
// SLIDE 14: FAQ
// ════════════════════════════════════════════
slide = pptx.addSlide();
addHeader(slide, "十二、常見問題（FAQ）");
addFooter(slide, 14);

const faqs = [
  ["出現紅色錯誤訊息？", "請確認身分證字號格式正確：第一碼英文，其餘數字，共 10 碼"],
  ["病患資料沒有自動帶入？", "該病患為新病患，資料庫無紀錄。手動填寫後掛號成功會自動儲存"],
  ["區域選單是空的？", "請先選擇縣市，區域會自動載入。若仍為空，檢查後端是否正常運作"],
  ["掛號號碼怎麼產生的？", "依「當日 + 時段 + 科別」累計數量 +1，上午與下午分開計號"],
  ["可以掛其他日期的號嗎？", "可以，掛號日期可手動修改為其他日期進行預約掛號"],
  ["掛號後發現資料有誤？", "下次掛號時修正資料即可，系統會自動覆蓋舊資料"],
];

faqs.forEach(([q, a], i) => {
  const y = 1.1 + i * 0.85;
  slide.addText(`Q${i + 1}：${q}`, {
    x: 0.5, y: y, w: 12.3, h: 0.35,
    fontSize: 13, fontFace: "Microsoft JhengHei", color: GREEN_DARK, bold: true,
  });
  slide.addText(`A：${a}`, {
    x: 0.8, y: y + 0.35, w: 12, h: 0.35,
    fontSize: 12, fontFace: "Microsoft JhengHei", color: TEXT,
  });
});

// ════════════════════════════════════════════
// SLIDE 15: 操作小技巧
// ════════════════════════════════════════════
slide = pptx.addSlide();
addHeader(slide, "操作小技巧");
addFooter(slide, 15);

addTable(slide,
  ["技巧", "說明"],
  [
    ["快速掛號（舊病患）", "只需 5 步：輸入病歷號碼 → 選時段 → 選科別 → 選醫師 → 確認掛號"],
    ["英文自動大寫", "病歷號碼欄位自動轉大寫，無需擔心 Caps Lock"],
    ["善用自動帶入", "舊病患資料完整帶入，通常只需確認無誤即可"],
    ["Tab 鍵切換", "使用 Tab 鍵依序切換欄位，加快輸入速度"],
    ["掛號日期預設今天", "大多數情況不需修改，可直接跳過"],
    ["連續掛號", "點擊「清除畫面」即可立即進行下一位，無需重新載入"],
  ],
  { y: 1.2, colW: [3, 9.3] }
);

// ════════════════════════════════════════════
// SLIDE 16: Ending
// ════════════════════════════════════════════
slide = pptx.addSlide();
slide.addShape(pptx.ShapeType.rect, {
  x: 0, y: 0, w: "100%", h: "100%",
  fill: { type: "solid", color: GREEN_HEADER },
});
slide.addText("感謝使用", {
  x: 0, y: 2.2, w: "100%", h: 1,
  fontSize: 36, fontFace: "Microsoft JhengHei", color: WHITE, bold: true,
  align: "center",
});
slide.addText("安康綜合醫院 門診掛號系統", {
  x: 0, y: 3.2, w: "100%", h: 0.8,
  fontSize: 20, fontFace: "Microsoft JhengHei", color: "D4DCD4",
  align: "center",
});
slide.addText("如有操作問題，請聯繫系統管理人員", {
  x: 0, y: 4.5, w: "100%", h: 0.5,
  fontSize: 14, fontFace: "Microsoft JhengHei", color: "9DAF9D",
  align: "center",
});

// ── Output ──
const outputPath = path.join(__dirname, "..", "docs", "操作手冊.pptx");
pptx.writeFile({ fileName: outputPath }).then(() => {
  console.log(`PPT generated: ${outputPath}`);
});
