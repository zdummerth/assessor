import useSWR from "swr";

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
  });

type ParcelRollupSearchParams = {
  asOfDate?: string;

  neighborhoodIds?: number[] | null;
  parcelIds?: number[] | null;

  minTotalSqft?: number;
  maxTotalSqft?: number;
  minLivableSqft?: number;
  maxLivableSqft?: number;

  conditionIds?: number[] | null;
  minStories?: number;
  maxStories?: number;
  baseMaterialIds?: number[] | null;

  minStructureCount?: number;
  maxStructureCount?: number;

  propertyClassIds?: number[] | null;

  taxYear?: number;
  minTotalValue?: number;
  maxTotalValue?: number;
  minLandValue?: number;
  maxLandValue?: number;
  minImprValue?: number;
  maxImprValue?: number;

  minValuePerTotalSqft?: number;
  maxValuePerTotalSqft?: number;
  minValuePerLivableSqft?: number;
  maxValuePerLivableSqft?: number;
};

export function useParcelRollupSearch(
  paramsInput: ParcelRollupSearchParams | null
) {
  const params = new URLSearchParams();

  if (paramsInput) {
    const {
      asOfDate,

      neighborhoodIds,
      parcelIds,

      minTotalSqft,
      maxTotalSqft,
      minLivableSqft,
      maxLivableSqft,

      conditionIds,
      minStories,
      maxStories,
      baseMaterialIds,

      minStructureCount,
      maxStructureCount,

      propertyClassIds,

      taxYear,
      minTotalValue,
      maxTotalValue,
      minLandValue,
      maxLandValue,
      minImprValue,
      maxImprValue,

      minValuePerTotalSqft,
      maxValuePerTotalSqft,
      minValuePerLivableSqft,
      maxValuePerLivableSqft,
    } = paramsInput;

    if (asOfDate) params.set("as_of_date", asOfDate);

    if (neighborhoodIds?.length)
      params.set("neighborhood_ids", neighborhoodIds.join(","));

    if (parcelIds?.length) params.set("parcel_ids", parcelIds.join(","));

    if (minTotalSqft != null)
      params.set("min_total_sqft", String(minTotalSqft));
    if (maxTotalSqft != null)
      params.set("max_total_sqft", String(maxTotalSqft));
    if (minLivableSqft != null)
      params.set("min_livable_sqft", String(minLivableSqft));
    if (maxLivableSqft != null)
      params.set("max_livable_sqft", String(maxLivableSqft));

    if (conditionIds?.length)
      params.set("condition_ids", conditionIds.join(","));
    if (minStories != null) params.set("min_stories", String(minStories));
    if (maxStories != null) params.set("max_stories", String(maxStories));
    if (baseMaterialIds?.length)
      params.set("base_material_ids", baseMaterialIds.join(","));

    if (minStructureCount != null)
      params.set("min_structures", String(minStructureCount));
    if (maxStructureCount != null)
      params.set("max_structures", String(maxStructureCount));

    if (propertyClassIds?.length)
      params.set("property_class_ids", propertyClassIds.join(","));

    if (taxYear != null) params.set("tax_year", String(taxYear));
    if (minTotalValue != null)
      params.set("min_total_value", String(minTotalValue));
    if (maxTotalValue != null)
      params.set("max_total_value", String(maxTotalValue));
    if (minLandValue != null)
      params.set("min_land_value", String(minLandValue));
    if (maxLandValue != null)
      params.set("max_land_value", String(maxLandValue));
    if (minImprValue != null)
      params.set("min_impr_value", String(minImprValue));
    if (maxImprValue != null)
      params.set("max_impr_value", String(maxImprValue));

    if (minValuePerTotalSqft != null)
      params.set("min_value_per_total_sqft", String(minValuePerTotalSqft));
    if (maxValuePerTotalSqft != null)
      params.set("max_value_per_total_sqft", String(maxValuePerTotalSqft));
    if (minValuePerLivableSqft != null)
      params.set("min_value_per_livable_sqft", String(minValuePerLivableSqft));
    if (maxValuePerLivableSqft != null)
      params.set("max_value_per_livable_sqft", String(maxValuePerLivableSqft));
  }

  const url =
    paramsInput !== null ? `/api/parcels/search?${params.toString()}` : null;

  const { data, error, isLoading } = useSWR(url, fetcher);

  return {
    data,
    isLoading,
    error,
  };
}
