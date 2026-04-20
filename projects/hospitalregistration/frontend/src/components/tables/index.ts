import type { ColumnDef } from "@tanstack/react-table";
import type { TableKey } from "../../api";
import { patientsColumns } from "./patientsColumns";
import { registrationsColumns } from "./registrationsColumns";
import { departmentsColumns } from "./departmentsColumns";
import { doctorsColumns } from "./doctorsColumns";
import { citiesColumns } from "./citiesColumns";
import { districtsColumns } from "./districtsColumns";

export const COLUMNS_BY_TABLE: Record<TableKey, ColumnDef<any>[]> = {
  patients: patientsColumns,
  registrations: registrationsColumns,
  departments: departmentsColumns,
  doctors: doctorsColumns,
  cities: citiesColumns,
  districts: districtsColumns,
};
