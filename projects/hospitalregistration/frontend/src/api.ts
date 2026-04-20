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
