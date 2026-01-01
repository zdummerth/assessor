// app/test/parcel-rollup/page.tsx
// import Filters from "./filters";
import { ParcelRollupDataTable } from "./table";
import FiltersDialog from "./test/filters-apply";

/* ----------------------------- types ----------------------------- */

type SearchParams = {
  as_of_date?: string;

  nbhds?: string;
  parcel_ids?: string;

  min_total_sqft?: string;
  max_total_sqft?: string;
  min_livable_sqft?: string;
  max_livable_sqft?: string;

  condition_ids?: string;
  min_stories?: string;
  max_stories?: string;
  base_material_ids?: string;

  min_structures?: string;
  max_structures?: string;

  property_class_ids?: string;

  tax_year?: string;
  min_total_value?: string;
  max_total_value?: string;
  min_land_value?: string;
  max_land_value?: string;
  min_impr_value?: string;
  max_impr_value?: string;

  min_value_per_total_sqft?: string;
  max_value_per_total_sqft?: string;
  min_value_per_livable_sqft?: string;
  max_value_per_livable_sqft?: string;
};

/* ----------------------------- helpers ----------------------------- */

function parseNumber(v?: string): number | null {
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function parseNumberArray(v?: string): number[] | undefined {
  if (!v || v.length === 0) return undefined;
  const arr = v.split(",").map(Number).filter(Number.isFinite);
  return arr.length ? arr : undefined;
}

/* ----------------------------- page ----------------------------- */

export default async function ParcelRollupPage({
  searchParams,
}: {
  // Next.js App Router: searchParams is a Promise
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const asOfDate =
    typeof params?.as_of_date === "string" && params.as_of_date.length > 0
      ? params.as_of_date
      : undefined;

  const neighborhoodIds = parseNumberArray(params?.nbhds);
  const parcelIds = parseNumberArray(params?.parcel_ids);

  const minTotalSqft = parseNumber(params?.min_total_sqft);
  const maxTotalSqft = parseNumber(params?.max_total_sqft);
  const minLivableSqft = parseNumber(params?.min_livable_sqft);
  const maxLivableSqft = parseNumber(params?.max_livable_sqft);

  const conditionIds = parseNumberArray(params?.condition_ids);
  const minStories = parseNumber(params?.min_stories);
  const maxStories = parseNumber(params?.max_stories);
  const baseMaterialIds = parseNumberArray(params?.base_material_ids);

  const minStructureCount = parseNumber(params?.min_structures);
  const maxStructureCount = parseNumber(params?.max_structures);

  const propertyClassIds = parseNumberArray(params?.property_class_ids);

  const taxYear = parseNumber(params?.tax_year);
  const minTotalValue = parseNumber(params?.min_total_value);
  const maxTotalValue = parseNumber(params?.max_total_value);
  const minLandValue = parseNumber(params?.min_land_value);
  const maxLandValue = parseNumber(params?.max_land_value);
  const minImprValue = parseNumber(params?.min_impr_value);
  const maxImprValue = parseNumber(params?.max_impr_value);

  const minValuePerTotalSqft = parseNumber(params?.min_value_per_total_sqft);
  const maxValuePerTotalSqft = parseNumber(params?.max_value_per_total_sqft);
  const minValuePerLivableSqft = parseNumber(
    params?.min_value_per_livable_sqft
  );
  const maxValuePerLivableSqft = parseNumber(
    params?.max_value_per_livable_sqft
  );

  return (
    <main className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-base font-semibold">Parcel Rollup Search</h1>
      </div>

      <FiltersDialog />
      <ParcelRollupDataTable
        asOfDate={asOfDate}
        neighborhoodIds={neighborhoodIds}
        parcelIds={parcelIds}
        minTotalSqft={minTotalSqft}
        maxTotalSqft={maxTotalSqft}
        minLivableSqft={minLivableSqft}
        maxLivableSqft={maxLivableSqft}
        conditionIds={conditionIds}
        minStories={minStories}
        maxStories={maxStories}
        baseMaterialIds={baseMaterialIds}
        minStructureCount={minStructureCount}
        maxStructureCount={maxStructureCount}
        propertyClassIds={propertyClassIds}
        taxYear={taxYear}
        minTotalValue={minTotalValue}
        maxTotalValue={maxTotalValue}
        minLandValue={minLandValue}
        maxLandValue={maxLandValue}
        minImprValue={minImprValue}
        maxImprValue={maxImprValue}
        minValuePerTotalSqft={minValuePerTotalSqft}
        maxValuePerTotalSqft={maxValuePerTotalSqft}
        minValuePerLivableSqft={minValuePerLivableSqft}
        maxValuePerLivableSqft={maxValuePerLivableSqft}
      />
    </main>
  );
}
