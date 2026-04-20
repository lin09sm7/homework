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
import { RefreshCw, Maximize2, Minimize2 } from "lucide-react";
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
  const [maximized, setMaximized] = useState(false);

  const requestIdRef = useRef(0);

  const fetchRows = async () => {
    const myId = ++requestIdRef.current;
    setLoading(true);
    setError(null);
    try {
      const data = await api.list(tableKey);
      if (myId !== requestIdRef.current) return;
      setRows(data);
      setUpdatedAt(new Date().toLocaleTimeString());
    } catch (err: unknown) {
      if (myId !== requestIdRef.current) return;
      const e = err as { response?: { data?: { error?: string } }; message?: string };
      setError(e?.response?.data?.error || e?.message || "無法載入資料");
    } finally {
      if (myId === requestIdRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    setGlobalFilter("");
    setSorting([]);
    fetchRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableKey]);

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

  const containerClass = maximized
    ? "fixed inset-0 z-50 flex flex-col border border-gray-300 bg-white shadow-xl overflow-hidden"
    : "flex flex-col border border-gray-300 rounded-lg bg-white shadow-sm overflow-hidden h-full";

  return (
    <div className={containerClass}>
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
        <button
          onClick={() => setMaximized((m) => !m)}
          className="flex items-center gap-1 px-2 py-1 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          title={maximized ? "還原" : "放大檢視"}
        >
          {maximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          {maximized ? "還原" : "放大"}
        </button>
      </div>

      {error && (
        <div className="px-3 py-2 text-sm text-red-700 bg-red-50 border-b border-red-200">
          無法載入資料：{error}
        </div>
      )}

      <div className="flex-1 overflow-auto">
        <table className="w-full text-xs border-collapse table-fixed">
          <thead className="bg-gray-100 sticky top-0">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((h) => {
                  const sort = h.column.getIsSorted();
                  const meta = h.column.columnDef.meta;
                  return (
                    <th
                      key={h.id}
                      onClick={h.column.getToggleSortingHandler()}
                      className="px-1.5 py-1 text-left font-medium border-b cursor-pointer select-none align-top break-words"
                    >
                      <div className="flex items-center gap-1">
                        <span>{flexRender(h.column.columnDef.header, h.getContext())}</span>
                        {sort === "asc" ? <span>▲</span> : sort === "desc" ? <span>▼</span> : null}
                      </div>
                      {meta && (
                        <div className="mt-0.5 flex flex-wrap items-center gap-1 text-[10px] font-normal leading-tight">
                          <span className="px-1 rounded bg-gray-200 text-gray-700">
                            {meta.sqlType}
                          </span>
                          {meta.pk && (
                            <span className="px-1 rounded bg-yellow-200 text-yellow-900" title="Primary Key">
                              PK
                            </span>
                          )}
                          {meta.fk && (
                            <span
                              className="px-1 rounded bg-blue-200 text-blue-900"
                              title={`Foreign Key → ${meta.fk.table}.${meta.fk.column}`}
                            >
                              FK→{meta.fk.table}
                            </span>
                          )}
                          {meta.notNull && !meta.pk && (
                            <span className="px-1 rounded bg-gray-300 text-gray-700" title="NOT NULL">
                              NN
                            </span>
                          )}
                          {meta.joined && (
                            <span className="px-1 rounded bg-purple-200 text-purple-900" title="Joined column (not stored on this table)">
                              JOIN
                            </span>
                          )}
                        </div>
                      )}
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
                <tr key={r.id} className="hover:bg-gray-50 align-top">
                  {r.getVisibleCells().map((c) => (
                    <td
                      key={c.id}
                      className="px-1.5 py-0.5 border-b break-words"
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
