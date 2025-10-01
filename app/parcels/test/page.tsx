// app/(whatever)/page.tsx
import { parse } from "path";
import ParcelFeaturesBrowserClient from "./browser";
import luSets from "@/lib/land_use_arrays.json";

type LuSet = "all" | "residential" | "other" | "lots";

// land-use set helpers
const residential = (luSets as any).residential as number[];
const commercial = (luSets as any).commercial as number[];
const industrial = (luSets as any).agriculture as number[];
const lotsArr = (luSets as any).lots as number[];
const single_family = (luSets as any).single_family as number[];
const condo = (luSets as any).condo as number[];

const all_residential = [...residential, ...single_family, ...condo];
const all_other = [...commercial, ...industrial];

const setCodes = (k: LuSet): string[] | null => {
  switch (k) {
    case "residential":
      return all_residential.map(String);
    case "other":
      return all_other.map(String);
    case "lots":
      return lotsArr.map(String);
    case "all":
    default:
      return []; // null => no default constraint
  }
};

function strOf(q: Record<string, string | string[] | undefined>, k: string) {
  const v = q[k];
  if (typeof v === "string") return v;
  if (Array.isArray(v)) return v.join(",");
  return "";
}
function numOr(v: string | null, fallback: number) {
  const n = v ? Number(v) : NaN;
  return Number.isFinite(n) ? n : fallback;
}
function csvToArray(v: string | null): string[] {
  if (!v) return [];
  return v
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default async function Page(props: {
  searchParams?: Promise<{
    set?: string;
    as_of_date?: string;
    lus?: string;
    nbhds?: string;
    street?: string;
    tfa_min?: string;
    tfa_max?: string;
    cv_min?: string;
    cv_max?: string;
    abated?: string;
    page?: string;
    page_size?: string;
    sort?: string;
    [k: string]: string | string[] | undefined;
  }>;
}) {
  const searchParams = await props.searchParams;
  // read params
  const setKey = ((): LuSet => {
    const s = searchParams?.set || "residential";
    return ["all", "residential", "other", "lots"].includes(s)
      ? (s as LuSet)
      : "residential";
  })();

  const asOfDate = searchParams?.as_of_date || "";
  const selectedLandUses = csvToArray(searchParams?.lus || "");
  const selectedNeighborhoods = csvToArray(searchParams?.nbhds || "");
  const ilikeStreet = searchParams?.street || "";
  const tfaMin = parseInt(searchParams?.tfa_min || "");
  const tfaMax = parseInt(searchParams?.tfa_max || "");
  const cvMin = parseInt(searchParams?.cv_min || "");
  const cvMax = parseInt(searchParams?.cv_max || "");
  const isAbatedOnly = searchParams?.abated === "1";

  const page = parseInt(searchParams?.page || "") || 1;
  const page_size = parseInt(searchParams?.page_size || "") || 25;
  const sort = searchParams?.sort || "";

  // build filters object
  const filters: any = {};
  if (ilikeStreet) {
    filters.ilike = { ...(filters.ilike || {}), street: `%${ilikeStreet}%` };
  }
  const gte: Record<string, number> = {};
  const lte: Record<string, number> = {};
  if (tfaMin && Number.isFinite(Number(tfaMin)))
    gte.total_finished_area = Number(tfaMin);
  if (tfaMax && Number.isFinite(Number(tfaMax)))
    lte.total_finished_area = Number(tfaMax);
  if (cvMin && Number.isFinite(Number(cvMin)))
    gte.current_value = Number(cvMin);
  if (cvMax && Number.isFinite(Number(cvMax)))
    lte.current_value = Number(cvMax);
  if (Object.keys(gte).length) filters.gte = gte;
  if (Object.keys(lte).length) filters.lte = lte;

  // land_uses defaulting: null when set === "all"
  const activeSetOptions = setCodes(setKey);
  const land_uses =
    selectedLandUses.length > 0
      ? selectedLandUses
      : setKey === "all"
        ? []
        : (activeSetOptions ?? []);

  const hookOpts = {
    as_of_date: asOfDate || undefined,
    land_uses: land_uses || [], // may be null
    neighborhoods: selectedNeighborhoods.length ? selectedNeighborhoods : [],
    is_abated: isAbatedOnly ? true : undefined,
    page,
    page_size,
    sort: sort || undefined,
    filters,
  };

  return <ParcelFeaturesBrowserClient hookOpts={hookOpts} />;
}
