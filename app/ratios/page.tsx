// app/sales/page.tsx
"use server";

import { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import FiltersDialog from "../parcels/test/filters-apply";
import ParcelNumber from "@/components/ui/parcel-number-updated";

// shadcn/ui
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { parse } from "path";

function csvToArray(v: string | null): string[] {
  if (!v) return [];
  return v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function formatCurrency(n: number | null | undefined) {
  if (n === null || n === undefined) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(n));
}
function formatNumber(
  n: number | null | undefined,
  opts: Intl.NumberFormatOptions = {}
) {
  if (n === null || n === undefined) return "—";
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
    ...opts,
  }).format(Number(n));
}
function formatRatio(n: number | null | undefined) {
  if (n === null || n === undefined) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 2,
  }).format(Number(n));
}
function makeUrl(
  base: string,
  params: Record<string, string | number | undefined | null>
) {
  const url = new URL(base, "http://dummy");
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    url.searchParams.set(k, String(v));
  });
  const qs = url.searchParams.toString();
  return qs ? `?${qs}` : "";
}

type Row = {
  sale_id: number;
  sale_date: string | null;
  sale_price: number | null;
  sale_type: string | null;
  is_valid: boolean | null;
  parcel_id: number;

  value_row_id: number | null;
  value_year: number | null;
  date_of_assessment: string | null;
  current_value: number | null;
  ratio: number | null;

  land_use_sale: string | null;
  land_use_asof: string | null;

  block: number | null;
  lot: string | null;
  ext: number | null;

  structure_count: number | null;
  total_finished_area: number | null;
  total_unfinished_area: number | null;
  avg_year_built: number | null;
  avg_condition: number | null;
  total_units: number | null;

  land_area: number | null;
  land_to_building_area_ratio: number | null;

  price_per_sqft_building_total: number | null;
  price_per_sqft_finished: number | null;
  price_per_sqft_land: number | null;
  price_per_unit: number | null;

  land_use: string | null;
  lat: number | null;
  lon: number | null;
  district: string | null;
  neighborhoods_at_sale: any | null;
  house_number: string | null;
  street: string | null;
  postcode: string | null;

  structures: any[] | null;
};

/** Skeleton shown while the table stream loads */
function TableSkeleton() {
  const cols = 13;
  return (
    <div className="rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            {Array.from({ length: cols }).map((_, i) => (
              <TableHead key={i}>
                <Skeleton className="h-4 w-28" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 8 }).map((_, r) => (
            <TableRow key={r}>
              {Array.from({ length: cols }).map((__, c) => (
                <TableCell key={c}>
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={cols}>
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-48" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}

/** Data-fetching server component to enable Suspense streaming */
async function SalesTableContent({
  searchParams,
}: {
  searchParams: {
    as_of_date?: string;
    start_date?: string;
    end_date?: string;
    lus?: string;
    page?: string;
    page_size?: string;
    sort?: string;
    sort_dir?: "asc" | "desc";
  };
}) {
  const asOfDate = searchParams.as_of_date || "";
  const startDate = searchParams.start_date || "";
  const endDate = searchParams.end_date || "";

  const selectedLandUses = csvToArray(searchParams.lus || "");
  const page = parseInt(searchParams.page || "") || 1;
  const page_size = parseInt(searchParams.page_size || "") || 25;
  const sort = searchParams.sort || "sale_date";
  const sort_dir = (searchParams.sort_dir as "asc" | "desc") || "desc";

  const supabase = await createClient();

  // Call your RPC. Keep types relaxed until you generate types.
  const { data, error, count } = await supabase
    //@ts-expect-error js
    .rpc<Row>(
      "get_ratios",
      {
        p_as_of_date: asOfDate || undefined,
        p_start_date: startDate || undefined,
        p_end_date: endDate || undefined,
        p_land_uses: selectedLandUses.length > 0 ? selectedLandUses : undefined,
        p_valid_only: true,
      },
      { count: "exact" }
    )
    .order(sort, { ascending: sort_dir === "asc" })
    .range((page - 1) * page_size, page * page_size - 1);

  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <p className="text-center font-medium">Error fetching ratios</p>
        <p className="text-sm text-muted-foreground mt-2">{error.message}</p>
      </div>
    );
  }

  //   console.log("SalesTableContent data", { data, count, error });
  const rows = (data ?? []) as Row[];
  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / page_size));

  const basePath = "/sales";
  const qBase = {
    as_of_date: asOfDate,
    start_date: startDate,
    end_date: endDate,
    lus: selectedLandUses.join(","),
    page_size,
  };

  const th = (key: string, label: string) => {
    const nextDir: "asc" | "desc" =
      sort === key
        ? sort_dir === "asc"
          ? "desc"
          : "asc"
        : key === "sale_date"
          ? "desc"
          : "asc";
    const href = makeUrl(basePath, {
      ...qBase,
      sort: key,
      sort_dir: nextDir,
      page: 1, // reset page on new sort
    });
    const active = sort === key;
    return (
      <TableHead className="whitespace-nowrap">
        <Link
          href={href}
          className={`hover:underline ${active ? "font-semibold" : ""}`}
        >
          {label}
          {active ? (sort_dir === "asc" ? " ▲" : " ▼") : ""}
        </Link>
      </TableHead>
    );
  };

  return (
    <div className="rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px]">Parcel</TableHead>
            <TableHead>Address</TableHead>
            {th("sale_date", "Sale Date")}
            {th("sale_price", "Price")}
            {th("ratio", "Ratio")}
            {th("current_value", "Current Appraised Value")}
            {th("land_use_sale", "LU (Sale)")}
            {th("land_use_asof", "LU (As-Of)")}
            {th("structure_count", "Structs")}
            {th("total_finished_area", "Finished SF")}
            {th("land_area", "Land SF")}
            {th("price_per_sqft_finished", "$/SF Fin")}
            {th("price_per_unit", "$/Unit")}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={13}
                className="text-center text-muted-foreground"
              >
                No results.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((r) => {
              const addr = [r.house_number, r.street].filter(Boolean).join(" ");
              return (
                <TableRow key={`${r.sale_id}-${r.parcel_id}`}>
                  <TableCell>
                    <ParcelNumber
                      id={r.parcel_id}
                      block={r.block || 0}
                      lot={parseInt(r.lot || "0") || 0}
                      ext={r.ext || 0}
                    />
                  </TableCell>
                  <TableCell className="max-w-[220px]">
                    <div className="truncate">{addr || "—"}</div>
                    <div className="text-xs text-muted-foreground">
                      {r.postcode ?? ""} {r.district ? `• ${r.district}` : ""}
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {r.sale_date
                      ? new Date(r.sale_date).toLocaleDateString()
                      : "—"}
                    {r.sale_type ? (
                      <Badge variant="secondary" className="ml-2">
                        {r.sale_type}
                      </Badge>
                    ) : null}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatCurrency(r.sale_price)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatRatio(r.ratio)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatCurrency(r.current_value)}
                  </TableCell>
                  <TableCell>{r.land_use_sale ?? "—"}</TableCell>
                  <TableCell>{r.land_use_asof ?? "—"}</TableCell>
                  <TableCell className="text-right">
                    {formatNumber(r.structure_count)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatNumber(r.total_finished_area)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatNumber(r.land_area)}
                  </TableCell>
                  <TableCell className="text-right">
                    {r.price_per_sqft_finished
                      ? `$${formatNumber(r.price_per_sqft_finished, {
                          maximumFractionDigits: 0,
                        })}`
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    {r.price_per_unit
                      ? `$${formatNumber(r.price_per_unit, {
                          maximumFractionDigits: 0,
                        })}`
                      : "—"}
                  </TableCell>

                  {/* <TableCell>
                    <details>
                      <summary className="cursor-pointer text-sm underline underline-offset-2">
                        View
                      </summary>
                      <div className="mt-2 space-y-2">
                        {(r.structures ?? []).map((s: any) => {
                          const st = s.structure ?? {};
                          const sections: any[] = s.sections ?? [];
                          return (
                            <div key={st.id} className="rounded-lg border p-2">
                              <div className="text-sm font-medium">
                                Structure #{st.id} • {st.type ?? "—"}{" "}
                                {st.category ? `(${st.category})` : ""}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Year: {st.year_built ?? "—"} • Units:{" "}
                                {st.units ?? "—"} • Material:{" "}
                                {st.material ?? "—"}
                              </div>
                              {sections.length > 0 ? (
                                <div className="mt-2">
                                  <div className="text-xs font-semibold mb-1">
                                    Sections
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {sections.map((sec) => (
                                      <div
                                        key={sec.id}
                                        className="rounded-md border p-2 text-xs"
                                      >
                                        <div>Type: {sec.type}</div>
                                        <div>
                                          Floor: {sec.floor_number ?? "—"}
                                        </div>
                                        <div>
                                          Finished:{" "}
                                          {formatNumber(sec.finished_area)}
                                        </div>
                                        <div>
                                          Unfinished:{" "}
                                          {formatNumber(sec.unfinished_area)}
                                        </div>
                                        <div>
                                          Material: {sec.material ?? "—"}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <div className="text-xs text-muted-foreground mt-1">
                                  No active sections at sale date.
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </details>
                  </TableCell> */}
                </TableRow>
              );
            })
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={13}>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {total.toLocaleString()} result{total === 1 ? "" : "s"} • Page{" "}
                  {page} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <Link
                    href={makeUrl("/sales", {
                      ...qBase,
                      sort,
                      sort_dir,
                      page: Math.max(1, page - 1),
                    })}
                  >
                    <Button variant="outline" size="sm" disabled={page <= 1}>
                      Prev
                    </Button>
                  </Link>
                  <Link
                    href={makeUrl("/sales", {
                      ...qBase,
                      sort,
                      sort_dir,
                      page: Math.min(totalPages, page + 1),
                    })}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages}
                    >
                      Next
                    </Button>
                  </Link>
                </div>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}

export default async function Page(props: {
  searchParams?: Promise<{
    as_of_date?: string;
    start_date?: string;
    end_date?: string;
    lus?: string;
    page?: string;
    page_size?: string;
    sort?: string;
    sort_dir?: "asc" | "desc";
  }>;
}) {
  const searchParams = (await props.searchParams) || {};
  const suspenseKey = JSON.stringify(searchParams); // to reset on param change

  return (
    <div className="w-full p-4 space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">Single-Parcel Sale Ratios</h1>
        <FiltersDialog />
      </div>

      <Suspense key={suspenseKey} fallback={<TableSkeleton />}>
        <SalesTableContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
