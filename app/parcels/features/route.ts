// app/api/find-parcel-features/route.ts
import { createClient } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";

// Columns returned by get_parcel_value_features_asof
const NUMERIC_COLS = new Set([
  "avg_condition",
  "avg_year_built",
  "block",
  "current_value",
  "ext",
  "land_area",
  "lat",
  "lon",
  "parcel_id",
  "structure_count",
  "total_finished_area",
  "total_unfinished_area",
  "total_units",
  "value_row_id",
  "value_year",
  "values_per_sqft_building_total",
  "values_per_sqft_finished",
  "values_per_sqft_land",
  "values_per_unit",
]);
const STRING_COLS = new Set([
  "date_of_assessment",
  "district",
  "house_number",
  "land_use",
  "lot",
  "postcode",
  "street",
  // "neighborhoods_at_as_of" is JSON; skip generic filtering here
]);

// Allow sorting on any non-JSON column above
//@ts-expect-error d
const SORTABLE_COLS = new Set([...NUMERIC_COLS, ...STRING_COLS]);

function parseCsvNums(v: string | null) {
  if (!v) return undefined;
  const arr = v
    .split(",")
    .map((x) => Number(x.trim()))
    .filter(Number.isFinite);
  return arr.length ? arr : undefined;
}
function parseCsvStrings(v: string | null) {
  if (!v) return undefined;
  const arr = v
    .split(",")
    .map((x) => x.trim())
    .filter((x) => x.length > 0);
  return arr.length ? arr : undefined;
}

export async function GET(request: NextRequest) {
  try {
    const sp = request.nextUrl.searchParams;

    // ---- RPC args (optional) ----
    const asOfDate = sp.get("as_of_date") || undefined;
    if (asOfDate) {
      const d = new Date(asOfDate);
      if (isNaN(d.getTime())) {
        return Response.json({ error: "Invalid as_of_date" }, { status: 400 });
      }
    }
    const landUsesArg = parseCsvNums(sp.get("land_uses")); // -> p_land_uses
    const neighborhoodsArg = parseCsvNums(sp.get("neighborhoods")); // -> p_neighborhoods
    const parcelIdsArg = parseCsvNums(sp.get("parcel_ids")); // -> p_parcel_ids

    // ---- Pagination ----
    const page = Math.max(1, Number(sp.get("page") ?? 1));
    const pageSize = Math.min(
      500,
      Math.max(1, Number(sp.get("page_size") ?? 50))
    );
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    // ---- Sorting (multi) ----
    // Example: sort=total_finished_area,-current_value,land_use
    const sortParam = sp.get("sort") ?? "";
    const sortParts = sortParam
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => ({
        col: s.replace(/^-/, ""),
        asc: !s.startsWith("-"),
      }))
      .filter(({ col }) => SORTABLE_COLS.has(col));

    // ---- Init client ----
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // ---- Build args for RPC ----
    const args: {
      p_as_of_date?: string;
      p_land_uses?: number[];
      p_neighborhoods?: number[];
      p_parcel_ids?: number[];
    } = {};
    if (asOfDate) args.p_as_of_date = asOfDate;
    if (landUsesArg) args.p_land_uses = landUsesArg;
    if (neighborhoodsArg) args.p_neighborhoods = neighborhoodsArg;
    if (parcelIdsArg) args.p_parcel_ids = parcelIdsArg;

    // ---- Base query (use count for pagination metadata if available) ----
    let query = supabase.rpc("get_parcel_value_features_asof", args, {
      count: "exact",
    });

    // ---- Conditional chaining filters (supports any returned column)
    //    Use query params like:
    //      eq_district=Central
    //      ilike_street=%KING%
    //      gte_total_finished_area=1000
    //      lte_value_year=2025
    //      in_land_use=1110,1111,1120
    //      neq_parcel_id=123
    //      is_postcode=null  (or "not.null")
    //
    //    Numeric columns will be auto-cast to numbers for eq/neq/gt/gte/lt/lte/in
    //
    const ops = [
      "eq",
      "neq",
      "gt",
      "gte",
      "lt",
      "lte",
      "ilike",
      "in",
      "is",
    ] as const;
    //@ts-expect-error d
    for (const [key, rawVal] of sp.entries()) {
      const m = key.match(/^(\w+?)_(.+)$/); // op_colName
      if (!m) continue;
      const [, op, col] = m as unknown as [
        string,
        (typeof ops)[number],
        string,
      ];
      if (
        !(ops as readonly string[]).includes(op) ||
        (!NUMERIC_COLS.has(col) && !STRING_COLS.has(col))
      )
        continue;

      // Convert value
      let val: any = rawVal;
      const isNumeric = NUMERIC_COLS.has(col);
      if (op === "in") {
        val = isNumeric ? parseCsvNums(rawVal) : parseCsvStrings(rawVal);
        if (!val) continue; // nothing to filter
      } else if (op === "is") {
        // 'null' or 'not.null'
        const v = String(rawVal).toLowerCase();
        if (v === "null") {
          query = query.is(col, null);
          continue;
        } else if (v === "not.null" || v === "notnull" || v === "not_null") {
          // PostgREST doesn't have is not null shortcut; emulate with .not('is', 'null') unavailable.
          // Use .neq with null; PostgREST treats eq/neq null specially.
          query = query.not(col, "is", null as any);
          continue;
        } else {
          continue;
        }
      } else if (isNumeric) {
        const n = Number(rawVal);
        if (!Number.isFinite(n)) continue;
        val = n;
      }

      // Apply op
      switch (op) {
        case "eq":
          query = query.eq(col, val);
          break;
        case "neq":
          query = query.neq(col, val);
          break;
        case "gt":
          query = query.gt(col, val);
          break;
        case "gte":
          query = query.gte(col, val);
          break;
        case "lt":
          query = query.lt(col, val);
          break;
        case "lte":
          query = query.lte(col, val);
          break;
        case "ilike":
          query = query.ilike(col, String(val));
          break;
        case "in":
          query = query.in(col, val as any[]);
          break;
      }
    }

    // ---- Sorting (apply in order)
    for (const { col, asc } of sortParts) {
      query = query.order(col, { ascending: asc, nullsFirst: !asc });
    }

    // ---- Pagination (range is inclusive)
    query = query.range(start, end);

    // Execute
    const { data, error, count } = await query;
    if (error) {
      console.error("Supabase error:", error);
      return Response.json(
        { error: "Database query failed." },
        { status: 500 }
      );
    }

    const hasMore =
      typeof count === "number"
        ? end + 1 < count
        : (data?.length ?? 0) === pageSize;

    return Response.json({
      data,
      meta: {
        page,
        page_size: pageSize,
        start,
        end,
        total: count ?? null, // may be null if backend doesn't return counts for RPC
        has_more: hasMore,
        sort: sortParts,
      },
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return Response.json({ error: "Unexpected error" }, { status: 500 });
  }
}
