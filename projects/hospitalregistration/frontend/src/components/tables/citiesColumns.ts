import type { ColumnDef } from "@tanstack/react-table";
import "./meta";

export type CityRow = { name: string };

export const citiesColumns: ColumnDef<CityRow>[] = [
  { accessorKey: "name", header: "縣市名稱", meta: { sqlType: "TEXT", pk: true, notNull: true } },
];
