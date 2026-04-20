import type { ColumnDef } from "@tanstack/react-table";
import "./meta";

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
  { accessorKey: "reg_date", header: "日期", meta: { sqlType: "TEXT", pk: true, notNull: true } },
  { accessorKey: "reg_period", header: "時段", meta: { sqlType: "TEXT", pk: true, notNull: true } },
  { accessorKey: "department_code", header: "科別代碼", meta: { sqlType: "TEXT", pk: true, notNull: true, fk: { table: "departments", column: "code" } } },
  { accessorKey: "reg_number", header: "號碼", meta: { sqlType: "TEXT", pk: true, notNull: true } },
  { accessorKey: "dept_name", header: "科別名稱", meta: { sqlType: "TEXT", joined: true } },
  { accessorKey: "patient_medical_no", header: "病歷號", meta: { sqlType: "TEXT", notNull: true, fk: { table: "patients", column: "medical_no" } } },
  { accessorKey: "patient_name", header: "姓名", meta: { sqlType: "TEXT", joined: true } },
  { accessorKey: "doctor_name", header: "醫師", meta: { sqlType: "TEXT", notNull: true, fk: { table: "doctors", column: "name" } } },
  { accessorKey: "visit_type", header: "就診類型", meta: { sqlType: "TEXT" } },
  { accessorKey: "status", header: "狀態", meta: { sqlType: "TEXT" } },
  { accessorKey: "created_at", header: "掛號時間", meta: { sqlType: "TEXT" } },
];
