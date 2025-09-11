// app/test/sales/explorer/shared.ts
import { type RatiosFeaturesRow } from "@/lib/client-queries";

export type SortDir = "asc" | "desc";
export type SortKey =
  | "median"
  | "avg"
  | "min"
  | "max"
  | "count"
  | `group:${string}`;
export type ViewMode = "table" | "cards";

export type RawRow = RatiosFeaturesRow & { sale_year?: number | null };

export const RESIDENTIAL_LU_DEFAULTS = [
  "1010",
  "1110",
  "1111",
  "1114",
  "1115",
  "1120",
  "1130",
  "1140",
];

export const isNum = (x: any): x is number =>
  typeof x === "number" && Number.isFinite(x);

export const fmtMoney = (n: number | null) =>
  isNum(n)
    ? new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(n || 0)
    : "—";

export const fmtRatio = (n: number | null) => (isNum(n) ? n.toFixed(3) : "—");

export const fmtDate = (d: string | null | undefined) =>
  d
    ? new Date(d).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";
