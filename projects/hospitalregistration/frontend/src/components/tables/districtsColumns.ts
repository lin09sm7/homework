import type { ColumnDef } from "@tanstack/react-table";
import "./meta";

export type DistrictRow = { city_name: string; name: string };

export const districtsColumns: ColumnDef<DistrictRow>[] = [
  { accessorKey: "city_name", header: "縣市", meta: { sqlType: "TEXT", pk: true, notNull: true, fk: { table: "cities", column: "name" } } },
  { accessorKey: "name", header: "區域名稱", meta: { sqlType: "TEXT", pk: true, notNull: true } },
];
