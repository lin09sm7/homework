import type { ColumnDef } from "@tanstack/react-table";
import "./meta";

export type DepartmentRow = { code: string; name: string };

export const departmentsColumns: ColumnDef<DepartmentRow>[] = [
  { accessorKey: "code", header: "代碼", meta: { sqlType: "TEXT", pk: true, notNull: true } },
  { accessorKey: "name", header: "科別名稱", meta: { sqlType: "TEXT", notNull: true } },
];
