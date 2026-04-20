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
const YELLOW_BG = "FFFDE7";
const YELLOW_BORDER = "F9A825";

pptx.layout = "LAYOUT_WIDE";
pptx.author = "安康綜合醫院";
pptx.title = "門診掛號系統 資料庫結構與UI設計";

// ── Helpers ──
function addHeader(slide, title) {
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: 0.7, fill: { color: GREEN_HEADER } });
  slide.addText(title, { x: 0.5, y: 0.1, w: 12, h: 0.5, fontSize: 20, fontFace: "Microsoft JhengHei", color: WHITE, bold: true });
}

function addFooter(slide, pageNum) {
  slide.addText("安康綜合醫院 門診掛號系統 — 資料庫結構與 UX/UI 設計文件", { x: 0.5, y: 6.9, w: 10, h: 0.4, fontSize: 9, fontFace: "Microsoft JhengHei", color: "999999" });
  slide.addText(`${pageNum}`, { x: 12, y: 6.9, w: 1, h: 0.4, fontSize: 9, fontFace: "Microsoft JhengHei", color: "999999", align: "right" });
}

function addTable(slide, headers, rows, opts = {}) {
  const tableRows = [];
  tableRows.push(headers.map((h) => ({ text: h, options: { bold: true, color: WHITE, fill: { color: GREEN }, fontSize: opts.fontSize || 11, fontFace: "Microsoft JhengHei" } })));
  rows.forEach((row, i) => {
    tableRows.push(row.map((cell) => ({ text: cell, options: { fontSize: opts.fontSize || 11, fontFace: "Microsoft JhengHei", color: TEXT, fill: { color: i % 2 === 0 ? "F5F5F5" : WHITE } } })));
  });
  slide.addTable(tableRows, { x: opts.x || 0.5, y: opts.y || 1.5, w: opts.w || 12.3, border: { pt: 0.5, color: "999999" }, colW: opts.colW, autoPage: false });
}

function addInfoBox(slide, items, y) {
  slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: y, w: 12.3, h: items.length * 0.32 + 0.2, fill: { color: GREEN_BG }, rectRadius: 0.05, line: { color: "CCCCCC", width: 0.5 } });
  items.forEach((item, i) => {
    slide.addText([
      { text: `${item[0]}　`, options: { bold: true, fontSize: 11, color: GREEN } },
      { text: item[1], options: { fontSize: 11, color: TEXT } },
    ], { x: 0.7, y: y + 0.1 + i * 0.32, w: 11.9, h: 0.3, fontFace: "Microsoft JhengHei" });
  });
}

function addNote(slide, text, y) {
  slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: y, w: 12.3, h: 0.6, fill: { color: YELLOW_BG }, line: { color: YELLOW_BORDER, width: 0.5 }, rectRadius: 0.05 });
  slide.addText(text, { x: 0.7, y: y + 0.05, w: 11.9, h: 0.5, fontSize: 11, fontFace: "Microsoft JhengHei", color: TEXT });
}

// ════════════════════════════════════════════
// SLIDE 1: 封面
// ════════════════════════════════════════════
let slide = pptx.addSlide();
slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: "100%", fill: { color: GREEN_HEADER } });
slide.addText("安康綜合醫院", { x: 0, y: 1.8, w: "100%", h: 1.2, fontSize: 44, fontFace: "Microsoft JhengHei", color: WHITE, bold: true, align: "center" });
slide.addText("門診掛號系統", { x: 0, y: 2.9, w: "100%", h: 0.8, fontSize: 28, fontFace: "Microsoft JhengHei", color: "D4DCD4", align: "center" });
slide.addText("資料庫結構設計與 UX/UI 設計文件", { x: 0, y: 3.7, w: "100%", h: 0.6, fontSize: 18, fontFace: "Microsoft JhengHei", color: "9DAF9D", align: "center" });
slide.addText("114.3.17 製作 ｜ 115.3.31 修訂", { x: 0, y: 6.2, w: "100%", h: 0.4, fontSize: 12, fontFace: "Microsoft JhengHei", color: "8CA08C", align: "center" });

// ════════════════════════════════════════════
// SLIDE 2: 目錄
// ════════════════════════════════════════════
slide = pptx.addSlide();
addHeader(slide, "目錄");
addFooter(slide, 2);

const tocLeft = [
  "一、檔案結構概述", "二、縣市主檔（cities）", "三、區域主檔（districts）",
  "四、科別主檔（departments）", "五、醫師主檔（doctors）", "六、病患資料檔（patients）",
  "七、掛號紀錄檔（registrations）", "八、索引設計", "九、預設資料摘要",
];
const tocRight = [
  "十、UX/UI 設計總覽", "十一、畫面佈局設計", "十二、病患資訊區塊",
  "十三、門診預約區塊", "十四、操作功能列", "十五、UX 互動設計",
  "十六、視覺風格設計", "十七、系統功能流程",
];

tocLeft.forEach((item, i) => {
  slide.addText(item, { x: 0.8, y: 1.0 + i * 0.4, w: 5.5, h: 0.38, fontSize: 13, fontFace: "Microsoft JhengHei", color: TEXT });
});
tocRight.forEach((item, i) => {
  slide.addText(item, { x: 7, y: 1.0 + i * 0.4, w: 5.5, h: 0.38, fontSize: 13, fontFace: "Microsoft JhengHei", color: TEXT });
});

// ════════════════════════════════════════════
// SLIDE 3: 檔案結構概述
// ════════════════════════════════════════════
slide = pptx.addSlide();
addHeader(slide, "一、檔案結構概述");
addFooter(slide, 3);

slide.addText([
  { text: "資料庫：", options: { bold: true } },
  { text: "SQLite，啟用 WAL 模式，檔案位於 database/hospital.db\n" },
  { text: "外鍵約束：", options: { bold: true } },
  { text: "PRAGMA foreign_keys = ON\n" },
  { text: "主鍵設計：", options: { bold: true } },
  { text: "全部採用自然鍵（Natural Key），不使用自動遞增流水號" },
], { x: 0.5, y: 1.0, w: 12.3, h: 1.0, fontSize: 12, fontFace: "Microsoft JhengHei", color: TEXT, lineSpacingMultiple: 1.5 });

slide.addText("與慈濟系統對應關係", { x: 0.5, y: 2.1, w: 12, h: 0.4, fontSize: 14, fontFace: "Microsoft JhengHei", color: GREEN_DARK, bold: true });

addTable(slide,
  ["本系統資料表", "慈濟系統對應檔案", "說明"],
  [
    ["cities", "縣市主檔（COUNTYTBL）", "儲存全台灣縣市資料"],
    ["districts", "鄉鎮主檔（TOWNTBL）", "儲存各縣市下的區域資料"],
    ["departments", "院內科別檔（GenSectionTbl）", "儲存醫院門診科別"],
    ["doctors", "醫師檔（GenDoctorTbl）", "儲存各科別醫師"],
    ["patients", "（新設計）", "整合病患基本資料"],
    ["registrations", "掛號看診檔（OpdRegDiagnosisTbl）", "儲存掛號紀錄"],
  ],
  { y: 2.5, colW: [2.5, 4.5, 5.3] }
);

// ER Diagram
slide.addText("資料表關聯圖", { x: 0.5, y: 5.2, w: 12, h: 0.35, fontSize: 14, fontFace: "Microsoft JhengHei", color: GREEN_DARK, bold: true });
slide.addShape(pptx.ShapeType.rect, { x: 0.5, y: 5.6, w: 12.3, h: 1.1, fill: { color: "F4F4F4" }, rectRadius: 0.05 });
slide.addText(
  "cities ──< districts                          （一個縣市有多個區域）\n" +
  "departments ──< doctors                    （一個科別有多位醫師）\n" +
  "cities ──< patients >── districts           （病患地址關聯縣市與區域）\n" +
  "patients ──< registrations >── departments └── doctors",
  { x: 0.8, y: 5.65, w: 11.8, h: 1.0, fontSize: 10, fontFace: "Courier New", color: TEXT, lineSpacingMultiple: 1.3 }
);

// ════════════════════════════════════════════
// SLIDE 4: 縣市主檔
// ════════════════════════════════════════════
slide = pptx.addSlide();
addHeader(slide, "二、縣市主檔（cities）");
addFooter(slide, 4);

addInfoBox(slide, [
  ["表格", "cities（縣市主檔）"],
  ["對應慈濟表", "縣市主檔（COUNTYTBL）"],
  ["說明", "儲存全台灣 22 個縣市資料，以縣市名稱作為主鍵"],
], 1.0);

slide.addText("欄位結構", { x: 0.5, y: 2.2, w: 12, h: 0.35, fontSize: 14, fontFace: "Microsoft JhengHei", color: GREEN_DARK, bold: true });

addTable(slide,
  ["鍵值", "欄位名稱", "中文", "型態", "屬性", "說明"],
  [
    ["P", "name", "縣市名稱", "TEXT", "PRIMARY KEY", "縣市名稱，作為主鍵"],
  ],
  { y: 2.6, colW: [0.8, 1.5, 1.5, 1, 2.5, 5] }
);

slide.addText("預設資料：全台灣 22 縣市", { x: 0.5, y: 3.6, w: 12, h: 0.35, fontSize: 14, fontFace: "Microsoft JhengHei", color: GREEN_DARK, bold: true });

const cities = ["台北市", "新北市", "基隆市", "桃園市", "新竹市", "新竹縣", "苗栗縣", "台中市", "彰化縣", "南投縣", "雲林縣", "嘉義市", "嘉義縣", "台南市", "高雄市", "屏東縣", "宜蘭縣", "花蓮縣", "台東縣", "澎湖縣", "金門縣", "連江縣"];
const cityRows = [];
for (let i = 0; i < cities.length; i += 6) {
  cityRows.push(cities.slice(i, i + 6));
}
// Pad last row
while (cityRows[cityRows.length - 1].length < 6) cityRows[cityRows.length - 1].push("");

addTable(slide, ["", "", "", "", "", ""], cityRows, { y: 4.0, colW: [2.05, 2.05, 2.05, 2.05, 2.05, 2.05], fontSize: 12 });

// ════════════════════════════════════════════
// SLIDE 5: 區域主檔
// ════════════════════════════════════════════
slide = pptx.addSlide();
addHeader(slide, "三、區域主檔（districts）");
addFooter(slide, 5);

addInfoBox(slide, [
  ["表格", "districts（區域主檔）"],
  ["對應慈濟表", "鄉鎮主檔（TOWNTBL）"],
  ["說明", "以（city_name, name）複合主鍵識別，透過 city_name 外鍵關聯縣市表"],
], 1.0);

slide.addText("欄位結構", { x: 0.5, y: 2.2, w: 12, h: 0.35, fontSize: 14, fontFace: "Microsoft JhengHei", color: GREEN_DARK, bold: true });

addTable(slide,
  ["鍵值", "欄位名稱", "中文", "型態", "屬性", "說明"],
  [
    ["P, FK, S", "city_name", "所屬縣市", "TEXT", "NOT NULL, FK → cities(name)", "與 name 共同組成複合主鍵"],
    ["P", "name", "區域名稱", "TEXT", "NOT NULL", "鄉鎮市區名稱"],
  ],
  { y: 2.6, colW: [0.9, 1.5, 1.3, 0.9, 3, 4.7] }
);

slide.addText("預設資料範例", { x: 0.5, y: 3.8, w: 12, h: 0.35, fontSize: 14, fontFace: "Microsoft JhengHei", color: GREEN_DARK, bold: true });

addTable(slide,
  ["縣市", "數量", "區域名稱（部分）"],
  [
    ["台北市", "12 區", "中正區、大同區、中山區、松山區、大安區、萬華區、信義區…"],
    ["新北市", "29 區", "板橋區、三重區、中和區、永和區、新莊區、新店區…"],
    ["台中市", "29 區", "中區、東區、南區、西區、北區、北屯區、西屯區…"],
    ["高雄市", "38 區", "楠梓區、左營區、鼓山區、三民區、鹽埕區、前金區…"],
  ],
  { y: 4.2, colW: [1.5, 1.2, 9.6], fontSize: 11 }
);

addNote(slide, "全台灣約 368 筆區域資料，完整資料詳見 schema.sql", 5.8);

// ════════════════════════════════════════════
// SLIDE 6: 科別主檔
// ════════════════════════════════════════════
slide = pptx.addSlide();
addHeader(slide, "四、科別主檔（departments）");
addFooter(slide, 6);

addInfoBox(slide, [
  ["表格", "departments（科別主檔）"],
  ["對應慈濟表", "院內科別檔（GenSectionTbl）"],
  ["說明", "以科別代碼（code）作為主鍵，使用有意義的英文代碼"],
], 1.0);

slide.addText("欄位結構", { x: 0.5, y: 2.2, w: 12, h: 0.35, fontSize: 14, fontFace: "Microsoft JhengHei", color: GREEN_DARK, bold: true });

addTable(slide,
  ["鍵值", "欄位名稱", "中文", "型態", "屬性", "說明"],
  [
    ["P", "code", "科別代碼", "TEXT", "PRIMARY KEY", "科別英文代碼，作為主鍵"],
    ["", "name", "科別名稱", "TEXT", "NOT NULL", "科別中文名稱"],
  ],
  { y: 2.6, colW: [0.8, 1.5, 1.3, 0.9, 2.5, 5.3] }
);

slide.addText("預設資料：8 大科別", { x: 0.5, y: 3.8, w: 12, h: 0.35, fontSize: 14, fontFace: "Microsoft JhengHei", color: GREEN_DARK, bold: true });

addTable(slide,
  ["code", "name（科別名稱）"],
  [
    ["internal", "內科"], ["surgery", "外科"], ["pediatrics", "小兒科"], ["obgyn", "婦產科"],
    ["ent", "耳鼻喉科"], ["derma", "皮膚科"], ["eye", "眼科"], ["family", "家醫科"],
  ],
  { y: 4.2, colW: [3, 9.3] }
);

// ════════════════════════════════════════════
// SLIDE 7: 醫師主檔
// ════════════════════════════════════════════
slide = pptx.addSlide();
addHeader(slide, "五、醫師主檔（doctors）");
addFooter(slide, 7);

addInfoBox(slide, [
  ["表格", "doctors（醫師主檔）"],
  ["對應慈濟表", "醫師檔（GenDoctorTbl）"],
  ["說明", "以（department_code, name）複合主鍵識別，每科 3 位醫師，共 24 位"],
], 1.0);

slide.addText("欄位結構", { x: 0.5, y: 2.2, w: 12, h: 0.35, fontSize: 14, fontFace: "Microsoft JhengHei", color: GREEN_DARK, bold: true });

addTable(slide,
  ["鍵值", "欄位名稱", "中文", "型態", "屬性", "說明"],
  [
    ["P, FK, S", "department_code", "所屬科別代碼", "TEXT", "NOT NULL, FK → departments(code)", "與 name 共同組成複合主鍵"],
    ["P", "name", "醫師姓名", "TEXT", "NOT NULL", "醫師中文姓名"],
  ],
  { y: 2.6, colW: [0.9, 2, 1.5, 0.8, 3.3, 3.8] }
);

slide.addText("預設資料：每科 3 位醫師", { x: 0.5, y: 3.8, w: 12, h: 0.35, fontSize: 14, fontFace: "Microsoft JhengHei", color: GREEN_DARK, bold: true });

addTable(slide,
  ["科別", "醫師 1", "醫師 2", "醫師 3"],
  [
    ["內科", "王建明", "林淑芬", "陳志豪"], ["外科", "張文華", "李美玲", "黃國榮"],
    ["小兒科", "劉怡君", "吳宗翰", "許雅婷"], ["婦產科", "蔡佩珊", "鄭凱文", "周淑惠"],
    ["耳鼻喉科", "楊俊傑", "蘇麗華", "洪振維"], ["皮膚科", "方雅琪", "謝承恩", "盧芷涵"],
    ["眼科", "曾國豪", "廖美慧", "趙柏翰"], ["家醫科", "林家豪", "陳雅文", "黃志偉"],
  ],
  { y: 4.2, colW: [2, 3.43, 3.43, 3.44] }
);

// ════════════════════════════════════════════
// SLIDE 8: 病患資料檔
// ════════════════════════════════════════════
slide = pptx.addSlide();
addHeader(slide, "六、病患資料檔（patients）");
addFooter(slide, 8);

addInfoBox(slide, [
  ["表格", "patients（病患資料檔）"],
  ["對應慈濟表", "（新設計，整合病患基本資料）"],
  ["說明", "以病歷號碼（medical_no）作為主鍵，台灣身分證字號格式，含 MOD-10 驗證"],
], 1.0);

addTable(slide,
  ["鍵值", "欄位名稱", "中文", "型態", "說明"],
  [
    ["P", "medical_no", "病歷號碼", "TEXT", "主鍵，身分證字號格式（1碼英文+9碼數字）"],
    ["", "name", "姓名", "TEXT", "NOT NULL"],
    ["", "gender", "性別", "TEXT", "CHECK('male','female')"],
    ["", "birthday", "生日", "TEXT", "YYYY-MM-DD"],
    ["", "age", "年齡", "INTEGER", "由前端根據生日自動計算"],
    ["", "phone", "電話", "TEXT", "聯絡電話"],
    ["FK, S", "city_name", "縣市", "TEXT", "FK → cities(name)"],
    ["FK, S", "district_name", "區域", "TEXT", "FK (city_name, district_name) → districts"],
    ["", "address", "詳細地址", "TEXT", "門牌號碼等"],
    ["", "created_at", "建立時間", "TEXT", "DEFAULT datetime('now','localtime')"],
    ["", "updated_at", "更新時間", "TEXT", "DEFAULT datetime('now','localtime')"],
  ],
  { y: 2.2, colW: [0.8, 1.8, 1, 1, 7.7], fontSize: 10 }
);

// ════════════════════════════════════════════
// SLIDE 9: 身分證驗證
// ════════════════════════════════════════════
slide = pptx.addSlide();
addHeader(slide, "六（續）、台灣身分證字號驗證規則");
addFooter(slide, 9);

slide.addText("檢查碼演算法（MOD-10）", { x: 0.5, y: 1.0, w: 12, h: 0.35, fontSize: 14, fontFace: "Microsoft JhengHei", color: GREEN_DARK, bold: true });

addTable(slide,
  ["步驟", "說明", "範例（A123456789）"],
  [
    ["1", "字母轉數字，拆為十位數(n1)與個位數(n2)", "A=10 → n1=1, n2=0"],
    ["2", "sum = n1 + n2 × 9", "sum = 1 + 0×9 = 1"],
    ["3", "第 2~9 碼乘以加權值 [8,7,6,5,4,3,2,1]", "1×8+2×7+3×6+4×5+5×4+6×3+7×2+8×1 = 120"],
    ["4", "sum += 各乘積之和", "sum = 1 + 120 = 121"],
    ["5", "sum += 第 10 碼（檢查碼）", "sum = 121 + 9 = 130"],
    ["6", "sum % 10 === 0 → 合法", "130 % 10 = 0 ✓"],
  ],
  { y: 1.5, colW: [0.8, 5.5, 6] }
);

slide.addText("字母對照表（部分）", { x: 0.5, y: 4.3, w: 12, h: 0.35, fontSize: 14, fontFace: "Microsoft JhengHei", color: GREEN_DARK, bold: true });

addTable(slide,
  ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"],
  [["10", "11", "12", "13", "14", "15", "16", "17", "34", "18", "19", "20", "21"]],
  { y: 4.7, colW: [0.946, 0.946, 0.946, 0.946, 0.946, 0.946, 0.946, 0.946, 0.946, 0.946, 0.946, 0.946, 0.946], fontSize: 10 }
);

addTable(slide,
  ["N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
  [["22", "35", "23", "24", "25", "26", "27", "28", "29", "32", "30", "31", "33"]],
  { y: 5.6, colW: [0.946, 0.946, 0.946, 0.946, 0.946, 0.946, 0.946, 0.946, 0.946, 0.946, 0.946, 0.946, 0.946], fontSize: 10 }
);

// ════════════════════════════════════════════
// SLIDE 10: 掛號紀錄檔
// ════════════════════════════════════════════
slide = pptx.addSlide();
addHeader(slide, "七、掛號紀錄檔（registrations）");
addFooter(slide, 10);

addInfoBox(slide, [
  ["表格", "registrations（掛號紀錄檔）"],
  ["對應慈濟表", "掛號看診檔（OpdRegDiagnosisTbl）"],
  ["主鍵", "複合主鍵（reg_date, reg_period, department_code, reg_number）"],
  ["說明", "掛號號碼由系統自動產生：當日該時段該科別累計數 + 1"],
], 1.0);

addTable(slide,
  ["鍵值", "欄位名稱", "中文", "型態", "說明"],
  [
    ["P", "reg_date", "掛號日期", "TEXT", "YYYY-MM-DD"],
    ["P", "reg_period", "掛號時段", "TEXT", "CHECK('morning','afternoon')：上午／下午"],
    ["P, FK", "department_code", "科別代碼", "TEXT", "FK → departments(code)"],
    ["P", "reg_number", "掛號號碼", "TEXT", "系統自動產生，兩碼數字（01, 02…）"],
    ["FK, S", "patient_medical_no", "病歷號碼", "TEXT", "FK → patients(medical_no)"],
    ["", "visit_type", "初複診", "TEXT", "CHECK('first','return')"],
    ["FK", "doctor_name", "醫師姓名", "TEXT", "FK (department_code, doctor_name) → doctors"],
    ["", "status", "掛號狀態", "TEXT", "DEFAULT 'confirmed'"],
    ["", "created_at", "建立時間", "TEXT", "DEFAULT datetime('now','localtime')"],
  ],
  { y: 2.4, colW: [0.8, 2.2, 1.2, 0.8, 7.3], fontSize: 10 }
);

// ════════════════════════════════════════════
// SLIDE 11: 掛號紀錄 - 慈濟對應
// ════════════════════════════════════════════
slide = pptx.addSlide();
addHeader(slide, "七（續）、與慈濟系統欄位對應");
addFooter(slide, 11);

addTable(slide,
  ["本系統欄位", "慈濟系統對應欄位", "說明"],
  [
    ["reg_number", "intRegNo（序號）", "就醫序號，由給號系統給定"],
    ["patient_medical_no", "chMRNo（病歷號）", "病歷號碼，10碼"],
    ["visit_type", "chRegFM（初複診掛號）", "0/1：初診，2：複診"],
    ["reg_date", "chDate（日期）", "掛號日期"],
    ["reg_period", "chNoonCode（午別代碼）", "掛號時段：上午／下午"],
    ["department_code", "chSecNo（科別代號）", "由排班表抄回"],
    ["doctor_name", "chDocNo（醫師代號）", "由排班表抄回"],
    ["status", "chIfWithdraw + chDigStat", "取消掛號 + 看診狀態"],
  ],
  { y: 1.2, colW: [3, 3.5, 5.8] }
);

// ════════════════════════════════════════════
// SLIDE 12: 索引設計 + 預設資料
// ════════════════════════════════════════════
slide = pptx.addSlide();
addHeader(slide, "八、索引設計");
addFooter(slide, 12);

slide.addText("本系統共建立 5 個索引，針對常用查詢欄位進行效能優化：", { x: 0.5, y: 1.0, w: 12, h: 0.35, fontSize: 13, fontFace: "Microsoft JhengHei", color: TEXT });

addTable(slide,
  ["#", "索引名稱", "資料表", "索引欄位", "用途"],
  [
    ["1", "idx_districts_city", "districts", "city_name", "依縣市查詢區域（級聯選擇）"],
    ["2", "idx_doctors_department", "doctors", "department_code", "依科別查詢醫師（級聯選擇）"],
    ["3", "idx_patients_city", "patients", "city_name", "依縣市查詢病患"],
    ["4", "idx_patients_district", "patients", "city_name, district_name", "依縣市與區域查詢病患"],
    ["5", "idx_registrations_patient", "registrations", "patient_medical_no", "依病患查詢掛號紀錄"],
  ],
  { y: 1.5, colW: [0.5, 2.8, 1.8, 3, 4.2] }
);

slide.addText("九、預設資料摘要", { x: 0.5, y: 4.2, w: 12, h: 0.4, fontSize: 16, fontFace: "Microsoft JhengHei", color: GREEN_DARK, bold: true });

addTable(slide,
  ["資料表", "筆數", "說明"],
  [
    ["cities", "22 筆", "全台灣 22 縣市"],
    ["districts", "約 368 筆", "全台灣各縣市之鄉鎮市區"],
    ["departments", "8 筆", "內科、外科、小兒科、婦產科、耳鼻喉科、皮膚科、眼科、家醫科"],
    ["doctors", "24 筆", "每科 3 位醫師"],
    ["patients", "0 筆", "由系統運行時動態新增"],
    ["registrations", "0 筆", "由系統運行時動態新增"],
  ],
  { y: 4.7, colW: [2, 1.5, 8.8] }
);

// ════════════════════════════════════════════
// SLIDE 13: UX/UI 設計總覽
// ════════════════════════════════════════════
slide = pptx.addSlide();
addHeader(slide, "十、UX/UI 設計總覽");
addFooter(slide, 13);

slide.addText("單頁式應用（SPA），所有掛號操作在同一畫面完成，以專業、清晰、易讀為設計原則。", { x: 0.5, y: 1.0, w: 12, h: 0.4, fontSize: 13, fontFace: "Microsoft JhengHei", color: TEXT });

addTable(slide,
  ["項目", "說明"],
  [
    ["設計架構", "單頁式應用（Single Page Application）"],
    ["前端框架", "React 19 + TypeScript + Vite"],
    ["樣式技術", "Tailwind CSS 4.2 + Inline Styles"],
    ["圖示庫", "Lucide React（Hospital, User, CalendarCheck, Check, Printer, RefreshCw, LogOut, ChevronDown）"],
    ["響應式設計", "最大寬度 960px，置中顯示"],
    ["設計語言", "全繁體中文介面，符合台灣醫療機構使用習慣"],
  ],
  { y: 1.6, colW: [2.5, 9.8] }
);

slide.addText("UI 元件架構", { x: 0.5, y: 4.4, w: 12, h: 0.35, fontSize: 14, fontFace: "Microsoft JhengHei", color: GREEN_DARK, bold: true });

addTable(slide,
  ["元件", "類型", "用途"],
  [
    ["FormInput", "文字輸入", "病歷號碼、姓名、年齡、電話、地址"],
    ["FormSelect", "下拉選單", "性別、初複診、縣市、區域、掛號時段、科別、醫師"],
    ["FormDateInput", "日期選擇", "生日、掛號日期"],
    ["ActionButton", "操作按鈕", "確認掛號、列印、清除、離開"],
    ["Divider", "分隔線", "區隔表單列"],
  ],
  { y: 4.8, colW: [2, 1.5, 8.8] }
);

// ════════════════════════════════════════════
// SLIDE 14: 畫面佈局
// ════════════════════════════════════════════
slide = pptx.addSlide();
addHeader(slide, "十一、畫面佈局設計");
addFooter(slide, 14);

addTable(slide,
  ["區塊", "位置", "背景", "說明"],
  [
    ["Header 標題列", "最上方", "綠色漸層 #7C9070→#5A7050", "醫院圖示 + 「安康綜合醫院」，圓角上方 20px"],
    ["病患資訊區塊", "中上方", "白色 #fff，圓角 16px", "三列表單：病歷號碼/姓名/性別/初複診、生日/年齡/電話、縣市/區域/地址"],
    ["門診預約區塊", "中下方", "淡灰漸層 #FAFAF8→#F7F6F3", "掛號日期/時段/科別/醫師，下方顯示掛號號碼"],
    ["操作功能列", "最下方", "綠色漸層 #7C9070→#5A7050", "四個操作按鈕 + 版權資訊，圓角下方 20px"],
  ],
  { y: 1.2, colW: [2, 1.2, 3.5, 5.6] }
);

// ════════════════════════════════════════════
// SLIDE 15: 病患資訊區塊
// ════════════════════════════════════════════
slide = pptx.addSlide();
addHeader(slide, "十二、病患資訊區塊");
addFooter(slide, 15);

addTable(slide,
  ["列", "欄位", "元件", "寬度", "功能說明"],
  [
    ["第一列", "病歷號碼", "FormInput", "160px", "自動大寫、即時驗證、自動查詢帶入"],
    ["", "姓名", "FormInput", "140px", "必填"],
    ["", "性別", "FormSelect", "100px", "男 / 女"],
    ["", "初複診", "FormSelect", "120px", "系統自動判斷初診或複診"],
    ["第二列", "生日", "FormDateInput", "160px", "選擇後年齡自動計算"],
    ["", "年齡", "FormInput", "80px", "根據生日自動計算"],
    ["", "電話", "FormInput", "180px", "聯絡電話"],
    ["第三列", "縣市", "FormSelect", "140px", "級聯選單第一層，全台 22 縣市"],
    ["", "區域", "FormSelect", "140px", "級聯選單第二層，依縣市載入"],
    ["", "詳細地址", "FormInput", "flex:1", "門牌號碼等"],
  ],
  { y: 1.0, colW: [0.9, 1.3, 1.5, 0.9, 7.7], fontSize: 10 }
);

// ════════════════════════════════════════════
// SLIDE 16: 門診預約區塊
// ════════════════════════════════════════════
slide = pptx.addSlide();
addHeader(slide, "十三、門診預約區塊");
addFooter(slide, 16);

addTable(slide,
  ["欄位", "元件類型", "寬度", "功能說明"],
  [
    ["掛號日期", "FormDateInput", "160px", "預設為當天日期，可手動修改"],
    ["掛號時段", "FormSelect", "120px", "上午（morning）/ 下午（afternoon），必填"],
    ["科別", "FormSelect", "180px", "級聯選單第一層，8 大科別，選擇後觸發醫師更新"],
    ["醫師", "FormSelect", "180px", "級聯選單第二層，依科別載入（每科 3 位）"],
  ],
  { y: 1.2, colW: [1.5, 1.8, 1.2, 7.8] }
);

slide.addText("掛號號碼產生規則", { x: 0.5, y: 3.3, w: 12, h: 0.35, fontSize: 14, fontFace: "Microsoft JhengHei", color: GREEN_DARK, bold: true });

addTable(slide,
  ["步驟", "說明", "範例"],
  [
    ["1", "查詢當日該時段該科別已有的掛號數量", "外科上午已掛 5 號"],
    ["2", "數量 + 1", "5 + 1 = 6"],
    ["3", "以兩碼數字格式呈現 padStart(2, '0')", "「06」"],
    ["4", "存入 registrations 表的 reg_number 欄位", "reg_number = '06'"],
  ],
  { y: 3.7, colW: [0.8, 5.5, 6] }
);

slide.addText("掛號號碼顯示：大字體 40px、綠色 #7C9070、預設 \"--\"，掛號成功後顯示兩碼號碼", { x: 0.5, y: 5.6, w: 12, h: 0.4, fontSize: 11, fontFace: "Microsoft JhengHei", color: GRAY });

// ════════════════════════════════════════════
// SLIDE 17: 操作功能列
// ════════════════════════════════════════════
slide = pptx.addSlide();
addHeader(slide, "十四、操作功能列");
addFooter(slide, 17);

addTable(slide,
  ["按鈕", "圖示", "漸層色", "功能"],
  [
    ["確認掛號", "Check ✓", "#4A5D43→#3D4E38", "檢查必填 → 新增/更新病患 → 建立掛號 → 顯示號碼"],
    ["列印掛號單", "Printer", "#4A5D43→#3D4E38", "呼叫 window.print() 列印收據"],
    ["清除畫面", "RefreshCw", "#8E9B87→#7C8A75", "重置所有欄位至初始狀態"],
    ["結束離開", "LogOut", "#A0A8A5→#8E9691", "呼叫 window.close() 關閉視窗"],
  ],
  { y: 1.2, colW: [1.5, 1.2, 2.5, 7.1] }
);

// ════════════════════════════════════════════
// SLIDE 18: UX 互動設計
// ════════════════════════════════════════════
slide = pptx.addSlide();
addHeader(slide, "十五、UX 互動設計");
addFooter(slide, 18);

slide.addText("級聯選單設計（Cascading Dropdowns）", { x: 0.5, y: 1.0, w: 12, h: 0.35, fontSize: 14, fontFace: "Microsoft JhengHei", color: GREEN_DARK, bold: true });

addTable(slide,
  ["級聯組合", "第一層", "第二層", "觸發 API", "行為"],
  [
    ["地址級聯", "縣市（22）", "區域", "GET /api/cities/:cityName/districts", "選縣市→清空區域→載入"],
    ["門診級聯", "科別（8）", "醫師", "GET /api/departments/:deptCode/doctors", "選科別→清空醫師→載入"],
  ],
  { y: 1.5, colW: [1.5, 1.2, 1, 4.5, 4.1] }
);

slide.addText("自動化功能", { x: 0.5, y: 3.0, w: 12, h: 0.35, fontSize: 14, fontFace: "Microsoft JhengHei", color: GREEN_DARK, bold: true });

addTable(slide,
  ["功能", "觸發條件", "行為"],
  [
    ["病歷號碼自動大寫", "輸入任何字元", "v.toUpperCase()"],
    ["病患資料自動帶入", "輸入完整 10 碼合法號碼", "API 查詢並帶入全部欄位"],
    ["年齡自動計算", "生日欄位變更", "根據生日自動計算足歲"],
    ["初複診自動判斷", "病歷號碼查詢結果", "舊病患→複診，新病患→初診"],
    ["掛號日期預設當天", "系統載入時", "自動填入今天日期"],
    ["掛號號碼自動產生", "確認掛號成功後", "後端 COUNT 查詢 + padStart"],
  ],
  { y: 3.4, colW: [2.5, 3, 6.8] }
);

// ════════════════════════════════════════════
// SLIDE 19: 視覺風格
// ════════════════════════════════════════════
slide = pptx.addSlide();
addHeader(slide, "十六、視覺風格設計");
addFooter(slide, 19);

slide.addText("色彩規劃", { x: 0.5, y: 1.0, w: 12, h: 0.35, fontSize: 14, fontFace: "Microsoft JhengHei", color: GREEN_DARK, bold: true });

const colors = [
  ["主色調 Header/Footer", "#7C9070→#5A7050", "7C9070", "綠色漸層"],
  ["強調按鈕", "#4A5D43→#3D4E38", "4A5D43", "深綠"],
  ["頁面背景", "#F7F6F3", "F7F6F3", "暖灰色"],
  ["卡片背景", "#FFFFFF", "FFFFFF", "純白"],
  ["文字主色", "#333333", "333333", "深灰色"],
  ["圖示/強調色", "#7C9070", "7C9070", "主題綠"],
  ["錯誤色", "#A62911", "A62911", "紅色"],
];

const colorRows = [];
colors.forEach(([usage, code, hex, desc]) => {
  colorRows.push([usage, code, desc]);
});

addTable(slide, ["用途", "色碼", "說明"], colorRows, { y: 1.4, colW: [3, 3.5, 5.8] });

slide.addText("字體規格", { x: 0.5, y: 4.8, w: 12, h: 0.35, fontSize: 14, fontFace: "Microsoft JhengHei", color: GREEN_DARK, bold: true });

addTable(slide,
  ["元素", "字體大小", "字重"],
  [
    ["醫院標題", "22px", "600 semi-bold"],
    ["區塊標題", "17px", "600"],
    ["表單輸入值", "13px", "400"],
    ["掛號號碼數字", "40px", "600"],
  ],
  { y: 5.2, colW: [3, 2, 7.3] }
);

// ════════════════════════════════════════════
// SLIDE 20: 系統功能流程
// ════════════════════════════════════════════
slide = pptx.addSlide();
addHeader(slide, "十七、系統功能流程");
addFooter(slide, 20);

slide.addText("掛號作業流程", { x: 0.5, y: 1.0, w: 12, h: 0.35, fontSize: 14, fontFace: "Microsoft JhengHei", color: GREEN_DARK, bold: true });

const flowSteps = [
  ["1", "輸入病歷號碼", "台灣身分證字號 10 碼，系統即時驗證"],
  ["2", "系統自動查詢", "GET /api/patients?medical_no=xxx"],
  ["3", "帶入或填寫資料", "舊病患自動帶入；新病患手動填寫"],
  ["4", "選擇門診資訊", "日期 → 時段（上午/下午）→ 科別 → 醫師"],
  ["5", "確認掛號", "POST/PUT /api/patients + POST /api/registrations"],
  ["6", "列印或清除", "列印掛號單或清除畫面準備下一位"],
];

flowSteps.forEach(([num, title, desc], i) => {
  const y = 1.5 + i * 0.6;
  slide.addShape(pptx.ShapeType.ellipse, { x: 0.6, y: y, w: 0.42, h: 0.42, fill: { color: GREEN } });
  slide.addText(num, { x: 0.6, y: y, w: 0.42, h: 0.42, fontSize: 15, fontFace: "Microsoft JhengHei", color: WHITE, bold: true, align: "center", valign: "middle" });
  slide.addShape(pptx.ShapeType.rect, { x: 1.2, y: y, w: 11.3, h: 0.42, fill: { color: GREEN_BG }, rectRadius: 0.05 });
  slide.addShape(pptx.ShapeType.rect, { x: 1.2, y: y, w: 0.06, h: 0.42, fill: { color: GREEN } });
  slide.addText([
    { text: `${title}  `, options: { bold: true, fontSize: 12, color: GREEN_DARK } },
    { text: desc, options: { fontSize: 11, color: TEXT } },
  ], { x: 1.4, y: y, w: 11, h: 0.42, fontFace: "Microsoft JhengHei", valign: "middle" });

  if (i < flowSteps.length - 1) {
    slide.addText("↓", { x: 0.65, y: y + 0.38, w: 0.35, h: 0.25, fontSize: 14, fontFace: "Microsoft JhengHei", color: GREEN, align: "center" });
  }
});

// ════════════════════════════════════════════
// SLIDE 21: API 呼叫流程
// ════════════════════════════════════════════
slide = pptx.addSlide();
addHeader(slide, "十七（續）、API 呼叫流程對照");
addFooter(slide, 21);

addTable(slide,
  ["操作", "方法", "API 端點", "Request", "Response"],
  [
    ["頁面載入", "GET", "/api/cities", "（無）", "[{name}, ...] 22 筆"],
    ["頁面載入", "GET", "/api/departments", "（無）", "[{code, name}, ...] 8 筆"],
    ["選擇縣市", "GET", "/api/cities/:cityName/districts", "cityName", "[{name}, ...]"],
    ["選擇科別", "GET", "/api/departments/:deptCode/doctors", "deptCode", "[{name}, ...]"],
    ["輸入病歷號", "GET", "/api/patients?medical_no=xxx", "medical_no", "病患資料 或 null"],
    ["新增病患", "POST", "/api/patients", "medical_no, name, ...", "{medical_no}"],
    ["更新病患", "PUT", "/api/patients/:medicalNo", "name, gender, ...", "更新成功"],
    ["建立掛號", "POST", "/api/registrations", "patient_medical_no, reg_date, reg_period, ...", "{reg_number, department_name}"],
  ],
  { y: 1.0, colW: [1.3, 0.8, 3.5, 3, 3.7], fontSize: 10 }
);

// ════════════════════════════════════════════
// SLIDE 22: React State
// ════════════════════════════════════════════
slide = pptx.addSlide();
addHeader(slide, "十七（續）、React State 管理");
addFooter(slide, 22);

addTable(slide,
  ["State 變數", "型態", "用途", "初始值"],
  [
    ["medicalNo", "string", "病歷號碼", '""'],
    ["patientName", "string", "病患姓名", '""'],
    ["gender", "string", "性別", '""'],
    ["visitType", "string", "初複診", '""'],
    ["birthday / age / phone", "string", "生日 / 年齡 / 電話", '""'],
    ["cityName", "string", "縣市名稱", '""'],
    ["districtName", "string", "區域名稱", '""'],
    ["address", "string", "詳細地址", '""'],
    ["regDate", "string", "掛號日期", "當天日期"],
    ["regPeriod", "string", "掛號時段", '""'],
    ["departmentCode", "string", "科別代碼", '""'],
    ["doctorName", "string", "醫師姓名", '""'],
    ["regNumber", "string", "掛號號碼", '"--"'],
    ["regDeptName", "string", "掛號科別名稱", '""'],
    ["cities / districts", "Option[]", "縣市/區域下拉選項", "[]"],
    ["departments / doctors", "Option[]", "科別/醫師下拉選項", "[]"],
  ],
  { y: 1.0, colW: [2.8, 1.2, 3, 5.3], fontSize: 10 }
);

// ════════════════════════════════════════════
// SLIDE 23: 結尾
// ════════════════════════════════════════════
slide = pptx.addSlide();
slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: "100%", fill: { color: GREEN_HEADER } });
slide.addText("安康綜合醫院", { x: 0, y: 2.5, w: "100%", h: 1, fontSize: 36, fontFace: "Microsoft JhengHei", color: WHITE, bold: true, align: "center" });
slide.addText("門診掛號系統 — 資料庫結構與 UX/UI 設計文件", { x: 0, y: 3.5, w: "100%", h: 0.6, fontSize: 18, fontFace: "Microsoft JhengHei", color: "D4DCD4", align: "center" });
slide.addText("P：主鍵 ｜ FK：外鍵 ｜ S：索引鍵", { x: 0, y: 4.8, w: "100%", h: 0.4, fontSize: 12, fontFace: "Microsoft JhengHei", color: "9DAF9D", align: "center" });

// ── Output ──
const outputPath = path.join(__dirname, "..", "docs", "掛號系統檔案結構.pptx");
pptx.writeFile({ fileName: outputPath }).then(() => {
  console.log(`PPT generated: ${outputPath}`);
});
