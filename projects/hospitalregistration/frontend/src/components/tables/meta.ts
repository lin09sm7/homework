import "@tanstack/react-table";

export type SqlType = "TEXT" | "INTEGER" | "REAL" | "BLOB";

export interface ColumnSchemaMeta {
  sqlType: SqlType;
  pk?: boolean;
  fk?: { table: string; column: string };
  notNull?: boolean;
  joined?: boolean; // virtual column from JOIN, not a real column on the table
}

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends unknown, TValue> extends ColumnSchemaMeta {}
}
