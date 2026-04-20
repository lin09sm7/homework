# Data Viewer Page — Design Spec

**Date:** 2026-04-20
**Project:** 安康綜合醫院掛號系統 (Hospital Registration System)
**Author:** Design session with Claude

## Purpose

Add a read-only data viewer page so users can inspect the contents of every database table and observe, in real time, the rows that are created or updated when they use the main registration page. The viewer supports a configurable multi-pane layout (1, 2, or 4 panes) so users can watch multiple tables side by side.

## Goals

- Expose all six database tables (`patients`, `registrations`, `departments`, `doctors`, `cities`, `districts`) in one page.
- Let the user view multiple tables simultaneously in a 1 / 2 / 4-pane layout, each pane selecting its own table.
- Auto-refresh (toggleable, 5-second interval) so registrations performed on the main page appear without a manual reload.
- Provide search, sort, and pagination per pane.
- Keep the main registration flow untouched.

## Non-Goals (YAGNI)

- Authentication or user accounts.
- Editing, deleting, or adding rows from this page (read-only).
- CSV / Excel export.
- Column visibility toggles, saved layouts, or persistent user preferences.
- Server-side sorting / filtering / pagination (dataset is small).

## Architecture

### Routing

Introduce `react-router-dom` to the frontend. `App.tsx` becomes a thin router root:

```tsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<RegistrationPage />} />
    <Route path="/data" element={<DataViewerPage />} />
  </Routes>
</BrowserRouter>
```

- `/` — existing registration form (content of current `App.tsx` extracted into `RegistrationPage`).
- `/data` — new data viewer page.

A navigation link ("資料查詢 / View Data") is added to the `RegistrationPage` header; a "← Back to Registration" link is added to the `DataViewerPage` header.

### File layout

```
frontend/src/
├── App.tsx                         (router only)
├── main.tsx
├── api.ts                          (central API client)
├── pages/
│   ├── RegistrationPage.tsx        (moved from App.tsx)
│   └── DataViewerPage.tsx          (new)
├── components/
│   ├── TablePane.tsx               (new — reusable pane)
│   └── tables/                     (column definitions per table)
│       ├── patientsColumns.ts
│       ├── registrationsColumns.ts
│       ├── departmentsColumns.ts
│       ├── doctorsColumns.ts
│       ├── citiesColumns.ts
│       └── districtsColumns.ts
```

### Dependencies to add

- `react-router-dom` — routing.
- `@tanstack/react-table` (v8) — headless table (sort, filter, pagination). Styled with existing Tailwind.

## DataViewerPage

Three areas: sticky top toolbar, pane grid, no footer.

### Toolbar

- Layout selector: `[ 1 | 2 | 4 ]` buttons (active one highlighted).
- Global auto-refresh toggle with interval indicator (e.g. `🔄 Auto 5s ✓`).
- "Refresh all" manual button.
- "← Back to Registration" link on the right.

### Pane grid

- 1 pane → full width.
- 2 panes → 2 columns (stack to 1 on narrow screens).
- 4 panes → 2×2 grid.

### State

```ts
type TableKey =
  | 'patients'
  | 'registrations'
  | 'departments'
  | 'doctors'
  | 'cities'
  | 'districts';

const [layout, setLayout] = useState<1 | 2 | 4>(2);
const [paneTables, setPaneTables] = useState<TableKey[]>([
  'patients',
  'registrations',
]);
const [autoRefresh, setAutoRefresh] = useState(true);
```

When the layout changes, `paneTables` grows or shrinks. New panes default to the next unused table in a fixed order: `patients → registrations → departments → doctors → cities → districts`.

## TablePane component

One pane is fully self-contained. Props:

```ts
interface TablePaneProps {
  paneIndex: number;
  tableKey: TableKey;
  autoRefresh: boolean;
  onChangeTable: (newKey: TableKey) => void;
}
```

### Responsibilities

1. **Table picker** — `<select>` listing all six tables. Changing re-fetches.
2. **Search box** — one text input bound to TanStack Table's `globalFilter`; case-insensitive match across all visible columns.
3. **Table** — TanStack Table with sortable headers (click toggles asc → desc → none), pagination at 20 rows/page.
4. **Footer** — row count and last-updated timestamp (e.g. `42 rows · updated 14:23:05`).
5. **Auto-refresh** — when the page-level toggle is on, the pane polls its endpoint every 5 s via `setInterval`. Manual refresh button resets the timer.
6. **Column defs** — imported from `components/tables/<table>Columns.ts`; pane stays generic.

### Layout sketch

```
┌──────────────────────────────────────────────────────┐
│ [Patients ▾]    🔍 search...          ↻ refresh      │
├──────────────────────────────────────────────────────┤
│ medical_no ▲ │ name │ gender │ birthday │ phone │... │
│ A123456789   │ 王小明│  男   │ 1990-01-01│ ...  │    │
│ ...                                                  │
├──────────────────────────────────────────────────────┤
│ 42 rows · updated 14:23:05          « 1 2 3 »        │
└──────────────────────────────────────────────────────┘
```

## Backend API changes

Most endpoints already exist. Add two new endpoints in `backend/server.js` for "list all" of doctors and districts.

### Existing (reused as-is)

- `GET /api/patients`
- `GET /api/registrations` (already joins patient / department / doctor)
- `GET /api/departments`
- `GET /api/cities`

### New endpoints

- `GET /api/doctors` — all doctors with `department_code` and `department_name` joined.
- `GET /api/districts` — all districts with `city_name` joined.

Both follow the same pattern as existing handlers (simple `SELECT ... JOIN`, no auth, no pagination).

### Response shape

Consistent with existing endpoints:

```json
[ { "col1": "...", "col2": "..." }, ... ]
```

### Frontend API client

A new `frontend/src/api.ts` centralizes the base URL (currently hardcoded and duplicated in `App.tsx`):

```ts
const BASE = 'http://localhost:3001/api';

export const api = {
  list: (key: TableKey) =>
    axios.get(`${BASE}/${key}`).then(r => r.data),
  // existing patient / registration calls migrate here too
};
```

## Data flow

1. User submits registration on `/` → `POST /api/registrations` → SQLite write.
2. User navigates to `/data` (or already has it open in another tab/window).
3. Auto-refresh ON → the Registrations pane polls `GET /api/registrations` every 5 s; the new row appears within the interval.
4. Auto-refresh OFF → user clicks "Refresh all" or the per-pane ↻ button.

## Error handling

- **Fetch failure in a pane** → inline red banner ("無法載入資料 — retry"). Other panes keep working.
- **Backend error** → returns `{ error: "..." }` with HTTP 500; pane renders the message.
- **Empty result** → pane shows centered "No data".
- **Loading** → shimmer/spinner placeholder in the table body.

## Testing

Manual test checklist (project currently has no automated test suite):

1. Load `/data` — verify all six tables are selectable and render rows.
2. Change layout 1 → 2 → 4 — verify pane count updates and new panes default sensibly.
3. Type in the search box — verify case-insensitive filtering across columns.
4. Click a column header — verify sort toggles asc → desc → none.
5. With auto-refresh ON, open `/` in another tab, submit a registration, switch back to `/data` — new row appears within 5 s.
6. Turn auto-refresh OFF, submit another registration — row does NOT appear until manual refresh.
7. Stop the backend — verify panes show an error banner, not a blank page.
8. Pagination — verify navigation on a table with >20 rows (patients or registrations).

## Open questions

None at spec time. Any discovered during implementation will be surfaced in the implementation plan.
