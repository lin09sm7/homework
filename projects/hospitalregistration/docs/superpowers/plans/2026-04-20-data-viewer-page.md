# Data Viewer Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/data` page that displays every DB table in a configurable 1/2/4-pane layout with search, sort, pagination, and 5-second auto-refresh, so users can watch registrations appear live as they use the main page.

**Architecture:** Introduce `react-router-dom` to split `App.tsx` into `RegistrationPage` and a new `DataViewerPage`. Use `@tanstack/react-table` (headless) for per-pane table rendering, styled with the existing Tailwind theme. Add two "list all" backend endpoints for doctors and districts; reuse the four existing `GET` endpoints. Frontend HTTP calls are centralized in a new `api.ts` module.

**Tech Stack:** React 19 + TypeScript + Vite 8 + Tailwind 4 (existing); adds `react-router-dom` and `@tanstack/react-table` v8. Backend stays Express 5 + better-sqlite3.

**Project notes:**
- The project is **not a git repository** — skip `git commit` steps (or run `git init` first if desired).
- The project has **no automated test suite**. Each task ends with **manual verification steps** that the engineer runs; these replace the usual "write failing test" ritual.
- UI labels are in **Traditional Chinese** to match the existing page.

**Absolute paths used below:**
- Backend: `/Users/linshimei/Desktop/HospitalRegistration/backend/`
- Frontend: `/Users/linshimei/Desktop/HospitalRegistration/frontend/`

---

## Task 1: Add backend endpoints `/api/doctors` and `/api/districts`

**Files:**
- Modify: `backend/server.js` (insert after line 55, the `/api/departments/:deptCode/doctors` handler; and after line 35, the `/api/cities/:cityName/districts` handler)

- [ ] **Step 1: Add `GET /api/doctors` (list all doctors with department info)**

Insert immediately after the existing `/api/departments/:deptCode/doctors` handler (currently ending around line 55):

```js
// GET /api/doctors  (list all, joined with department name)
app.get("/api/doctors", (_req, res) => {
  const doctors = db
    .prepare(
      `SELECT d.department_code, d.name, dep.name AS department_name
       FROM doctors d
       JOIN departments dep ON d.department_code = dep.code
       ORDER BY dep.rowid, d.rowid`
    )
    .all();
  res.json(doctors);
});
```

- [ ] **Step 2: Add `GET /api/districts` (list all districts with city name)**

Insert immediately after the existing `/api/cities/:cityName/districts` handler (currently ending around line 35):

```js
// GET /api/districts  (list all)
app.get("/api/districts", (_req, res) => {
  const districts = db
    .prepare(
      `SELECT city_name, name
       FROM districts
       ORDER BY city_name, rowid`
    )
    .all();
  res.json(districts);
});
```

- [ ] **Step 3: Restart the backend**

Run in `backend/`:
```bash
npm run dev
```
Expected: `Backend running at http://localhost:3001` with no errors.

- [ ] **Step 4: Manually verify both endpoints return JSON arrays**

In a second terminal, run:
```bash
curl -s http://localhost:3001/api/doctors | head -c 400
curl -s http://localhost:3001/api/districts | head -c 400
```
Expected for `/api/doctors`: JSON array beginning with something like `[{"department_code":"internal","name":"王建明","department_name":"內科"}, ...]`.
Expected for `/api/districts`: JSON array beginning with `[{"city_name":"台北市","name":"中正區"}, ...]`.

- [ ] **Step 5 (optional — only if git is initialized): commit**

```bash
git add backend/server.js
git commit -m "feat(backend): add /api/doctors and /api/districts list endpoints"
```

---

## Task 2: Install frontend dependencies

**Files:**
- Modify: `frontend/package.json` (auto-updated by npm)
- Modify: `frontend/package-lock.json` (auto-updated)

- [ ] **Step 1: Install `react-router-dom` and `@tanstack/react-table`**

Run in `frontend/`:
```bash
npm install react-router-dom @tanstack/react-table
```
Expected: `added N packages` with no errors. Both appear in `frontend/package.json` under `dependencies`.

- [ ] **Step 2: Verify versions**

```bash
node -e "const p = require('./package.json'); console.log(p.dependencies['react-router-dom'], p.dependencies['@tanstack/react-table']);"
```
Expected: two version strings printed (e.g. `^7.x.x ^8.x.x`).

- [ ] **Step 3 (optional): commit**

```bash
git add frontend/package.json frontend/package-lock.json
git commit -m "chore(frontend): add react-router-dom and @tanstack/react-table"
```

---

## Task 3: Create centralized API client

**Files:**
- Create: `frontend/src/api.ts`

- [ ] **Step 1: Create `frontend/src/api.ts`**

```ts
import axios from "axios";

const BASE = "http://localhost:3001/api";

export type TableKey =
  | "patients"
  | "registrations"
  | "departments"
  | "doctors"
  | "cities"
  | "districts";

export const TABLE_LABELS: Record<TableKey, string> = {
  patients: "病患 Patients",
  registrations: "掛號紀錄 Registrations",
  departments: "科別 Departments",
  doctors: "醫師 Doctors",
  cities: "縣市 Cities",
  districts: "區域 Districts",
};

export const TABLE_ORDER: TableKey[] = [
  "patients",
  "registrations",
  "departments",
  "doctors",
  "cities",
  "districts",
];

export const api = {
  list: async (key: TableKey): Promise<Record<string, unknown>[]> => {
    const res = await axios.get(`${BASE}/${key}`);
    return res.data as Record<string, unknown>[];
  },
};
```

- [ ] **Step 2: Verify TypeScript compiles**

Run in `frontend/`:
```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3 (optional): commit**

```bash
git add frontend/src/api.ts
git commit -m "feat(frontend): add centralized API client with TableKey type"
```

---

## Task 4: Extract existing page into `pages/RegistrationPage.tsx`

**Files:**
- Create: `frontend/src/pages/RegistrationPage.tsx` (moved from `App.tsx`)
- Modify: `frontend/src/App.tsx` (becomes the router root)

- [ ] **Step 1: Create `frontend/src/pages/` directory**

```bash
mkdir -p frontend/src/pages
```

- [ ] **Step 2: Move `App.tsx` contents to `pages/RegistrationPage.tsx`**

Copy the entire current `frontend/src/App.tsx` to `frontend/src/pages/RegistrationPage.tsx`. Then in the NEW file:

1. Rename the component from `App` to `RegistrationPage`:
   - Change `export default function App()` (or `function App`) to `export default function RegistrationPage()`.
2. Leave all other code (Taiwan ID validation, form state, etc.) unchanged.

- [ ] **Step 3: Replace `frontend/src/App.tsx` with a router root**

Overwrite `frontend/src/App.tsx` with:

```tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegistrationPage from "./pages/RegistrationPage";
import DataViewerPage from "./pages/DataViewerPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RegistrationPage />} />
        <Route path="/data" element={<DataViewerPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

- [ ] **Step 4: Create a placeholder `DataViewerPage.tsx` so the import resolves**

Create `frontend/src/pages/DataViewerPage.tsx`:

```tsx
export default function DataViewerPage() {
  return <div style={{ padding: 24 }}>Data viewer — coming in Task 7</div>;
}
```

- [ ] **Step 5: Manually verify the app still loads**

Run in `frontend/`:
```bash
npm run dev
```
Open http://localhost:5173 in a browser.
Expected:
- `/` shows the existing registration form exactly as before.
- Navigating to http://localhost:5173/data shows the placeholder text "Data viewer — coming in Task 7".
- Browser console has no errors.

- [ ] **Step 6 (optional): commit**

```bash
git add frontend/src/App.tsx frontend/src/pages/
git commit -m "refactor(frontend): split App.tsx into router + RegistrationPage"
```

---

## Task 5: Create column definitions for all six tables

**Files:**
- Create: `frontend/src/components/tables/patientsColumns.ts`
- Create: `frontend/src/components/tables/registrationsColumns.ts`
- Create: `frontend/src/components/tables/departmentsColumns.ts`
- Create: `frontend/src/components/tables/doctorsColumns.ts`
- Create: `frontend/src/components/tables/citiesColumns.ts`
- Create: `frontend/src/components/tables/districtsColumns.ts`
- Create: `frontend/src/components/tables/index.ts`

- [ ] **Step 1: Create directory**

```bash
mkdir -p frontend/src/components/tables
```

- [ ] **Step 2: Create `patientsColumns.ts`**

```ts
import type { ColumnDef } from "@tanstack/react-table";

export type PatientRow = {
  medical_no: string;
  name: string;
  gender: string | null;
  birthday: string | null;
  age: number | null;
  phone: string | null;
  city_name: string | null;
  district_name: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
};

export const patientsColumns: ColumnDef<PatientRow>[] = [
  { accessorKey: "medical_no", header: "病歷號" },
  { accessorKey: "name", header: "姓名" },
  { accessorKey: "gender", header: "性別" },
  { accessorKey: "birthday", header: "生日" },
  { accessorKey: "age", header: "年齡" },
  { accessorKey: "phone", header: "電話" },
  { accessorKey: "city_name", header: "縣市" },
  { accessorKey: "district_name", header: "區域" },
  { accessorKey: "address", header: "地址" },
  { accessorKey: "created_at", header: "建立時間" },
  { accessorKey: "updated_at", header: "更新時間" },
];
```

- [ ] **Step 3: Create `registrationsColumns.ts`**

Backend returns rows shaped like `{ reg_date, reg_period, department_code, reg_number, patient_medical_no, visit_type, doctor_name, status, created_at, patient_name, medical_no, dept_name }`.

```ts
import type { ColumnDef } from "@tanstack/react-table";

export type RegistrationRow = {
  reg_date: string;
  reg_period: string;
  department_code: string;
  dept_name: string;
  reg_number: string;
  patient_medical_no: string;
  patient_name: string;
  visit_type: string;
  doctor_name: string;
  status: string;
  created_at: string;
};

export const registrationsColumns: ColumnDef<RegistrationRow>[] = [
  { accessorKey: "reg_date", header: "日期" },
  { accessorKey: "reg_period", header: "時段" },
  { accessorKey: "dept_name", header: "科別" },
  { accessorKey: "reg_number", header: "號碼" },
  { accessorKey: "patient_medical_no", header: "病歷號" },
  { accessorKey: "patient_name", header: "姓名" },
  { accessorKey: "doctor_name", header: "醫師" },
  { accessorKey: "visit_type", header: "就診類型" },
  { accessorKey: "status", header: "狀態" },
  { accessorKey: "created_at", header: "掛號時間" },
];
```

- [ ] **Step 4: Create `departmentsColumns.ts`**

```ts
import type { ColumnDef } from "@tanstack/react-table";

export type DepartmentRow = { code: string; name: string };

export const departmentsColumns: ColumnDef<DepartmentRow>[] = [
  { accessorKey: "code", header: "代碼" },
  { accessorKey: "name", header: "科別名稱" },
];
```

- [ ] **Step 5: Create `doctorsColumns.ts`**

```ts
import type { ColumnDef } from "@tanstack/react-table";

export type DoctorRow = {
  department_code: string;
  department_name: string;
  name: string;
};

export const doctorsColumns: ColumnDef<DoctorRow>[] = [
  { accessorKey: "department_code", header: "科別代碼" },
  { accessorKey: "department_name", header: "科別名稱" },
  { accessorKey: "name", header: "醫師姓名" },
];
```

- [ ] **Step 6: Create `citiesColumns.ts`**

```ts
import type { ColumnDef } from "@tanstack/react-table";

export type CityRow = { name: string };

export const citiesColumns: ColumnDef<CityRow>[] = [
  { accessorKey: "name", header: "縣市名稱" },
];
```

- [ ] **Step 7: Create `districtsColumns.ts`**

```ts
import type { ColumnDef } from "@tanstack/react-table";

export type DistrictRow = { city_name: string; name: string };

export const districtsColumns: ColumnDef<DistrictRow>[] = [
  { accessorKey: "city_name", header: "縣市" },
  { accessorKey: "name", header: "區域名稱" },
];
```

- [ ] **Step 8: Create `index.ts` that maps `TableKey` → columns**

```ts
import type { ColumnDef } from "@tanstack/react-table";
import type { TableKey } from "../../api";
import { patientsColumns } from "./patientsColumns";
import { registrationsColumns } from "./registrationsColumns";
import { departmentsColumns } from "./departmentsColumns";
import { doctorsColumns } from "./doctorsColumns";
import { citiesColumns } from "./citiesColumns";
import { districtsColumns } from "./districtsColumns";

export const COLUMNS_BY_TABLE: Record<TableKey, ColumnDef<any>[]> = {
  patients: patientsColumns,
  registrations: registrationsColumns,
  departments: departmentsColumns,
  doctors: doctorsColumns,
  cities: citiesColumns,
  districts: districtsColumns,
};
```

- [ ] **Step 9: Verify TypeScript compiles**

Run in `frontend/`:
```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 10 (optional): commit**

```bash
git add frontend/src/components/tables/
git commit -m "feat(frontend): add column defs for all six tables"
```

---

## Task 6: Create `TablePane` component

**Files:**
- Create: `frontend/src/components/TablePane.tsx`

- [ ] **Step 1: Create `TablePane.tsx`**

```tsx
import { useEffect, useMemo, useRef, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import { RefreshCw } from "lucide-react";
import { api, TABLE_LABELS, TABLE_ORDER, type TableKey } from "../api";
import { COLUMNS_BY_TABLE } from "./tables";

const AUTO_REFRESH_MS = 5000;
const PAGE_SIZE = 20;

interface TablePaneProps {
  paneIndex: number;
  tableKey: TableKey;
  autoRefresh: boolean;
  onChangeTable: (next: TableKey) => void;
}

export default function TablePane({
  paneIndex,
  tableKey,
  autoRefresh,
  onChangeTable,
}: TablePaneProps) {
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string>("");
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  // Track latest request to ignore stale responses after table switch / unmount.
  const requestIdRef = useRef(0);

  const fetchRows = async () => {
    const myId = ++requestIdRef.current;
    setLoading(true);
    setError(null);
    try {
      const data = await api.list(tableKey);
      if (myId !== requestIdRef.current) return; // stale
      setRows(data);
      setUpdatedAt(new Date().toLocaleTimeString());
    } catch (err: any) {
      if (myId !== requestIdRef.current) return;
      setError(err?.response?.data?.error || err?.message || "無法載入資料");
    } finally {
      if (myId === requestIdRef.current) setLoading(false);
    }
  };

  // Refetch when the table changes; reset filter/sort/pagination.
  useEffect(() => {
    setGlobalFilter("");
    setSorting([]);
    fetchRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableKey]);

  // Auto-refresh interval.
  useEffect(() => {
    if (!autoRefresh) return;
    const id = setInterval(fetchRows, AUTO_REFRESH_MS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRefresh, tableKey]);

  const columns = useMemo(() => COLUMNS_BY_TABLE[tableKey], [tableKey]);

  const table = useReactTable({
    data: rows,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: PAGE_SIZE } },
  });

  return (
    <div className="flex flex-col border border-gray-300 rounded-lg bg-white shadow-sm overflow-hidden h-full">
      {/* Pane header */}
      <div className="flex flex-wrap items-center gap-2 px-3 py-2 border-b bg-[#F3F6F0]">
        <select
          value={tableKey}
          onChange={(e) => onChangeTable(e.target.value as TableKey)}
          className="border rounded px-2 py-1 text-sm bg-white"
        >
          {TABLE_ORDER.map((k) => (
            <option key={k} value={k}>
              {TABLE_LABELS[k]}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="🔍 搜尋..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="flex-1 min-w-[120px] border rounded px-2 py-1 text-sm"
        />
        <button
          onClick={fetchRows}
          className="flex items-center gap-1 px-2 py-1 text-sm bg-[#7C9070] text-white rounded hover:bg-[#5A7050]"
          title="重新整理"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          重新整理
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="px-3 py-2 text-sm text-red-700 bg-red-50 border-b border-red-200">
          無法載入資料：{error}
        </div>
      )}

      {/* Table body */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-gray-100 sticky top-0">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => {
                  const sort = h.column.getIsSorted();
                  return (
                    <th
                      key={h.id}
                      onClick={h.column.getToggleSortingHandler()}
                      className="px-3 py-2 text-left font-medium border-b cursor-pointer select-none whitespace-nowrap"
                    >
                      {flexRender(h.column.columnDef.header, h.getContext())}
                      {sort === "asc" ? " ▲" : sort === "desc" ? " ▼" : ""}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-3 py-6 text-center text-gray-400"
                >
                  {loading ? "載入中..." : "沒有資料"}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  {r.getVisibleCells().map((c) => (
                    <td
                      key={c.id}
                      className="px-3 py-1.5 border-b whitespace-nowrap"
                    >
                      {String(c.getValue() ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pane footer */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-t bg-[#FAFBF7] text-xs text-gray-600">
        <span>
          {table.getFilteredRowModel().rows.length} rows
          {updatedAt && ` · updated ${updatedAt}`}
          {` · pane ${paneIndex + 1}`}
        </span>
        <span className="flex items-center gap-1">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-2 py-0.5 border rounded disabled:opacity-40"
          >
            «
          </button>
          <span>
            {table.getState().pagination.pageIndex + 1} / {Math.max(1, table.getPageCount())}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-2 py-0.5 border rounded disabled:opacity-40"
          >
            »
          </button>
        </span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run in `frontend/`:
```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3 (optional): commit**

```bash
git add frontend/src/components/TablePane.tsx
git commit -m "feat(frontend): add TablePane component"
```

---

## Task 7: Build `DataViewerPage` with layout selector and pane grid

**Files:**
- Modify (overwrite placeholder): `frontend/src/pages/DataViewerPage.tsx`

- [ ] **Step 1: Overwrite `DataViewerPage.tsx` with the full implementation**

```tsx
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react";
import TablePane from "../components/TablePane";
import { TABLE_ORDER, type TableKey } from "../api";

type Layout = 1 | 2 | 4;

const DEFAULT_PANES: Record<Layout, TableKey[]> = {
  1: ["registrations"],
  2: ["patients", "registrations"],
  4: ["patients", "registrations", "departments", "doctors"],
};

function pickDefaults(layout: Layout, previous: TableKey[]): TableKey[] {
  // Keep the user's prior choices where possible; fill with the fixed default order.
  const next = [...previous];
  if (next.length > layout) return next.slice(0, layout);
  const pool = TABLE_ORDER.filter((k) => !next.includes(k));
  while (next.length < layout) {
    next.push(pool.shift() ?? DEFAULT_PANES[layout][next.length]);
  }
  return next;
}

export default function DataViewerPage() {
  const [layout, setLayout] = useState<Layout>(2);
  const [paneTables, setPaneTables] = useState<TableKey[]>(DEFAULT_PANES[2]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  // Bump this to force all panes to refetch on "Refresh all".
  const [refreshAllTick, setRefreshAllTick] = useState(0);

  // Apply layout changes.
  useEffect(() => {
    setPaneTables((prev) => pickDefaults(layout, prev));
  }, [layout]);

  const setPaneTable = useCallback((idx: number, key: TableKey) => {
    setPaneTables((prev) => {
      const next = [...prev];
      next[idx] = key;
      return next;
    });
  }, []);

  const gridClass =
    layout === 1
      ? "grid grid-cols-1 gap-3"
      : layout === 2
      ? "grid grid-cols-1 md:grid-cols-2 gap-3"
      : "grid grid-cols-1 md:grid-cols-2 gap-3";

  return (
    <div className="min-h-screen bg-[#EDF1E8] flex flex-col">
      {/* Toolbar */}
      <header className="sticky top-0 z-10 bg-gradient-to-r from-[#7C9070] to-[#5A7050] text-white px-4 py-3 shadow">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-lg font-bold mr-2">資料查詢 Data Viewer</h1>

          {/* Layout selector */}
          <div className="flex items-center gap-1 bg-white/10 rounded px-1 py-0.5">
            <span className="text-xs px-1 opacity-80">Panes:</span>
            {([1, 2, 4] as Layout[]).map((n) => (
              <button
                key={n}
                onClick={() => setLayout(n)}
                className={`px-2 py-0.5 rounded text-sm ${
                  layout === n ? "bg-white text-[#5A7050]" : "hover:bg-white/20"
                }`}
              >
                {n}
              </button>
            ))}
          </div>

          {/* Auto-refresh toggle */}
          <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="accent-white"
            />
            自動更新 (5s)
          </label>

          {/* Refresh all */}
          <button
            onClick={() => setRefreshAllTick((t) => t + 1)}
            className="flex items-center gap-1 px-2 py-1 text-sm bg-white/20 rounded hover:bg-white/30"
          >
            <RefreshCw size={14} />
            全部重新整理
          </button>

          <div className="ml-auto">
            <Link
              to="/"
              className="flex items-center gap-1 text-sm bg-white/20 px-2 py-1 rounded hover:bg-white/30"
            >
              <ArrowLeft size={14} />
              返回掛號
            </Link>
          </div>
        </div>
      </header>

      {/* Pane grid */}
      <main className="flex-1 p-3">
        <div
          className={gridClass}
          style={{ height: "calc(100vh - 80px)" }}
        >
          {paneTables.slice(0, layout).map((key, i) => (
            <TablePane
              key={`${i}-${key}-${refreshAllTick}`}
              paneIndex={i}
              tableKey={key}
              autoRefresh={autoRefresh}
              onChangeTable={(next) => setPaneTable(i, next)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run in `frontend/`:
```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Manually verify the data viewer page loads**

With the backend running on :3001 and the frontend running on :5173, open http://localhost:5173/data in a browser.

Expected:
- Green gradient header with title "資料查詢 Data Viewer".
- `[1 | 2 | 4]` pane-count buttons (2 active by default).
- Auto-update checkbox checked by default.
- Two panes visible side by side: Patients on the left, Registrations on the right.
- Each pane shows a table with rows from the DB (or "沒有資料" if empty).
- Browser console shows no errors.

- [ ] **Step 4 (optional): commit**

```bash
git add frontend/src/pages/DataViewerPage.tsx
git commit -m "feat(frontend): add DataViewerPage with layout selector and auto-refresh"
```

---

## Task 8: Add navigation link on the registration page

**Files:**
- Modify: `frontend/src/pages/RegistrationPage.tsx` (add a Link to `/data`)

- [ ] **Step 1: Import `Link` from `react-router-dom`**

At the top of `frontend/src/pages/RegistrationPage.tsx`, add:

```tsx
import { Link } from "react-router-dom";
```

- [ ] **Step 2: Add a "資料查詢" link in the existing header**

Find the top header area of the registration page. It uses the `Hospital` icon and shows the hospital name (near the top of the returned JSX — search for `<Hospital` in the file). Add a `Link` component inside that header row. For example, if the header looks like:

```tsx
<div className="... hospital-header">
  <Hospital ... />
  <h1>安康綜合醫院掛號系統</h1>
</div>
```

Change it to place the link on the right side of the same row:

```tsx
<div className="... hospital-header" style={{ display: "flex", alignItems: "center" }}>
  <Hospital ... />
  <h1 style={{ flex: 1 }}>安康綜合醫院掛號系統</h1>
  <Link
    to="/data"
    style={{
      color: "#fff",
      textDecoration: "none",
      padding: "6px 12px",
      background: "rgba(255,255,255,0.2)",
      borderRadius: 6,
      fontSize: 14,
    }}
  >
    📊 資料查詢
  </Link>
</div>
```

Adjust the surrounding style only enough to align the link to the right — do not restructure other header content.

- [ ] **Step 3: Verify TypeScript compiles and the app reloads**

```bash
npx tsc --noEmit
```
Expected: no errors.

Open http://localhost:5173/ in the browser.
Expected:
- The registration page renders as before, with a new "📊 資料查詢" link in the top header.
- Clicking the link navigates to `/data`.
- Clicking "返回掛號" on the data page returns to `/`.

- [ ] **Step 4 (optional): commit**

```bash
git add frontend/src/pages/RegistrationPage.tsx
git commit -m "feat(frontend): add nav link to data viewer from registration page"
```

---

## Task 9: Full end-to-end manual verification

**Files:** None (verification only).

- [ ] **Step 1: Ensure both servers are running**

In two terminals:
```bash
# terminal 1
cd /Users/linshimei/Desktop/HospitalRegistration/backend && npm run dev

# terminal 2
cd /Users/linshimei/Desktop/HospitalRegistration/frontend && npm run dev
```

- [ ] **Step 2: Run the spec's manual test checklist**

Open http://localhost:5173/data and verify each item from the spec:

1. All six tables are selectable in each pane's dropdown; each renders rows (or "沒有資料" for empty tables).
2. Change layout 1 → 2 → 4. Pane count updates. The 4-pane layout shows patients, registrations, departments, doctors by default.
3. Type into the search box of a pane — rows filter case-insensitively across all visible columns.
4. Click a column header — sort toggles ascending (▲) → descending (▼) → none.
5. With auto-update ON: open http://localhost:5173/ in a new tab, submit a registration. Switch back to `/data`. The new row appears in the Registrations pane within ~5 s.
6. Turn auto-update OFF. Submit another registration. The row does NOT appear until you click "全部重新整理" or the pane's ↻ button.
7. Stop the backend (Ctrl+C in terminal 1). Each pane shows a red "無法載入資料：..." banner; the rest of the UI is still usable. Restart the backend and click refresh — data returns.
8. Pagination: on the patients or registrations pane, if >20 rows exist, the « / » buttons in the footer navigate pages and show the current page / total.

- [ ] **Step 3: Build check**

Run in `frontend/`:
```bash
npm run build
```
Expected: TypeScript compiles and Vite produces a `dist/` folder with no errors.

- [ ] **Step 4 (optional): final commit**

```bash
git add -A
git commit -m "chore: verify end-to-end manual tests pass"
```

---

## Completion criteria

- `/api/doctors` and `/api/districts` return JSON arrays (Task 1).
- `/` still shows the registration form; `/data` shows the new viewer (Tasks 4, 7).
- Layout selector switches 1/2/4 panes, each pane independently pickable (Task 7).
- Search, sort, and pagination work per pane (Task 6).
- Auto-refresh toggle causes new registrations to appear within 5 s (Task 9 step 5).
- Build passes: `npm run build` in `frontend/` finishes cleanly (Task 9 step 3).
