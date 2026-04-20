import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RefreshCw } from "lucide-react";
import TablePane from "../components/TablePane";
import { TABLE_ORDER, type TableKey } from "../api";

type Layout = 1 | 2 | 4 | 6;

const DEFAULT_PANES: Record<Layout, TableKey[]> = {
  1: ["registrations"],
  2: ["patients", "registrations"],
  4: ["patients", "registrations", "departments", "doctors"],
  6: ["patients", "registrations", "departments", "doctors", "cities", "districts"],
};

function pickDefaults(layout: Layout, previous: TableKey[]): TableKey[] {
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
  const [refreshAllTick, setRefreshAllTick] = useState(0);

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
      ? "grid grid-cols-1 md:grid-cols-2 gap-3 auto-rows-fr"
      : layout === 4
      ? "grid grid-cols-1 md:grid-cols-2 md:grid-rows-2 gap-3 auto-rows-fr"
      : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-3 auto-rows-fr";

  // 6-pane layout: indexes 0 and 1 span 2 columns (wide slots for patients/registrations by default).
  const paneExtraClass = (i: number): string =>
    layout === 6 && i < 2 ? "lg:col-span-2" : "";

  return (
    <div className="h-screen bg-[#EDF1E8] flex flex-col overflow-hidden">
      <header className="sticky top-0 z-10 bg-gradient-to-r from-[#7C9070] to-[#5A7050] text-white px-4 py-3 shadow">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-lg font-bold mr-2">資料查詢 Data Viewer</h1>

          <div className="flex items-center gap-1 bg-white/10 rounded px-1 py-0.5">
            <span className="text-xs px-1 opacity-80">Panes:</span>
            {([1, 2, 4, 6] as Layout[]).map((n) => (
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

          <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="accent-white"
            />
            自動更新 (5s)
          </label>

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

      <main className="flex-1 min-h-0 p-3 overflow-hidden">
        <div className={`${gridClass} h-full`}>
          {paneTables.slice(0, layout).map((key, i) => (
            <div
              key={`${i}-${key}-${refreshAllTick}`}
              className={`h-full min-w-0 min-h-0 overflow-hidden ${paneExtraClass(i)}`}
            >
              <TablePane
                paneIndex={i}
                tableKey={key}
                autoRefresh={autoRefresh}
                onChangeTable={(next) => setPaneTable(i, next)}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
