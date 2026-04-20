import type { ColumnDef } from "@tanstack/react-table";
import "./meta";

export type DoctorRow = {
  department_code: string;
  department_name: string;
  name: string;
};

export const doctorsColumns: ColumnDef<DoctorRow>[] = [
  { accessorKey: "department_code", header: "科別代碼", meta: { sqlType: "TEXT", pk: true, notNull: true, fk: { table: "departments", column: "code" } } },
  { accessorKey: "name", header: "醫師姓名", meta: { sqlType: "TEXT", pk: true, notNull: true } },
  { accessorKey: "department_name", header: "科別名稱", meta: { sqlType: "TEXT", joined: true } },
];
