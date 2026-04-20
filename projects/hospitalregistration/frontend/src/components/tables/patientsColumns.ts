import type { ColumnDef } from "@tanstack/react-table";
import "./meta";

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
  { accessorKey: "medical_no", header: "病歷號", meta: { sqlType: "TEXT", pk: true, notNull: true } },
  { accessorKey: "name", header: "姓名", meta: { sqlType: "TEXT", notNull: true } },
  { accessorKey: "gender", header: "性別", meta: { sqlType: "TEXT" } },
  { accessorKey: "birthday", header: "生日", meta: { sqlType: "TEXT" } },
  { accessorKey: "age", header: "年齡", meta: { sqlType: "INTEGER" } },
  { accessorKey: "phone", header: "電話", meta: { sqlType: "TEXT" } },
  { accessorKey: "city_name", header: "縣市", meta: { sqlType: "TEXT", fk: { table: "cities", column: "name" } } },
  { accessorKey: "district_name", header: "區域", meta: { sqlType: "TEXT", fk: { table: "districts", column: "name" } } },
  { accessorKey: "address", header: "地址", meta: { sqlType: "TEXT" } },
  { accessorKey: "created_at", header: "建立時間", meta: { sqlType: "TEXT" } },
  { accessorKey: "updated_at", header: "更新時間", meta: { sqlType: "TEXT" } },
];
