// app/api/parcels/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/* ----------------------------- helpers ----------------------------- */

function parseIntArray(v: string | null): number[] | null {
  if (!v) return null;
  const arr = v.split(",").map(Number).filter(Number.isFinite);
  return arr.length ? arr : null;
}

function parseBigIntArray(v: string | null): number[] | null {
  if (!v) return null;
  const arr = v.split(",").map(Number).filter(Number.isFinite);
  return arr.length ? arr : null;
}

function parseIntVal(v: string | null): number | null {
  if (v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function parseNumeric(v: string | null): number | null {
  if (v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/* ------------------------------ handler ----------------------------- */

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  /* ---------- pagination ---------- */

  const page =
    parseIntVal(searchParams.get("page")) &&
    parseIntVal(searchParams.get("page"))! > 0
      ? parseIntVal(searchParams.get("page"))!
      : 1;

  const pageSize =
    parseIntVal(searchParams.get("page_size")) &&
    parseIntVal(searchParams.get("page_size"))! > 0
      ? parseIntVal(searchParams.get("page_size"))!
      : 25;

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  /* ---------- build rpc params ---------- */

  const params: Record<string, unknown> = {};

  const add = (key: string, value: unknown) => {
    if (value !== null && value !== undefined) {
      params[key] = value;
    }
  };

  // as-of
  add("p_as_of_date", searchParams.get("as_of_date"));

  // ids
  add(
    "p_neighborhood_ids",
    parseIntArray(searchParams.get("neighborhood_ids"))
  );
  add("p_parcel_ids", parseBigIntArray(searchParams.get("parcel_ids")));

  // structure size
  add("p_min_total_area_sqft", parseIntVal(searchParams.get("min_total_sqft")));
  add("p_max_total_area_sqft", parseIntVal(searchParams.get("max_total_sqft")));
  add("p_min_livable_sqft", parseIntVal(searchParams.get("min_livable_sqft")));
  add("p_max_livable_sqft", parseIntVal(searchParams.get("max_livable_sqft")));

  // structure attributes
  add("p_condition_ids", parseBigIntArray(searchParams.get("condition_ids")));
  add("p_min_stories", parseIntVal(searchParams.get("min_stories")));
  add("p_max_stories", parseIntVal(searchParams.get("max_stories")));
  add(
    "p_base_material_ids",
    parseBigIntArray(searchParams.get("base_material_ids"))
  );

  // structure count
  add("p_min_structure_count", parseIntVal(searchParams.get("min_structures")));
  add("p_max_structure_count", parseIntVal(searchParams.get("max_structures")));

  // property class
  add(
    "p_property_class_ids",
    parseIntArray(searchParams.get("property_class_ids"))
  );

  // values
  add("p_tax_year", parseIntVal(searchParams.get("tax_year")));
  add("p_min_total_value", parseNumeric(searchParams.get("min_total_value")));
  add("p_max_total_value", parseNumeric(searchParams.get("max_total_value")));
  add("p_min_land_value", parseNumeric(searchParams.get("min_land_value")));
  add("p_max_land_value", parseNumeric(searchParams.get("max_land_value")));
  add("p_min_impr_value", parseNumeric(searchParams.get("min_impr_value")));
  add("p_max_impr_value", parseNumeric(searchParams.get("max_impr_value")));

  // value per sqft
  add(
    "p_min_value_per_total_sqft",
    parseNumeric(searchParams.get("min_value_per_total_sqft"))
  );
  add(
    "p_max_value_per_total_sqft",
    parseNumeric(searchParams.get("max_value_per_total_sqft"))
  );
  add(
    "p_min_value_per_livable_sqft",
    parseNumeric(searchParams.get("min_value_per_livable_sqft"))
  );
  add(
    "p_max_value_per_livable_sqft",
    parseNumeric(searchParams.get("max_value_per_livable_sqft"))
  );

  /* ---------- supabase ---------- */

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data, error, count } = await supabase
    .rpc("search_parcel_rollup_asof_v10", params, { count: "estimated" })
    .range(from, to);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    page,
    pageSize,
    count: count ?? 0,
    data,
  });
}
