// app/test/parcel-rollup/types.ts
export type ParcelRollupSearchParams = {
  asOfDate?: string;

  neighborhoodIds?: number[] | undefined;
  parcelIds?: number[] | undefined;

  minTotalSqft?: number | null;
  maxTotalSqft?: number | null;
  minLivableSqft?: number | null;
  maxLivableSqft?: number | null;

  conditionIds?: number[] | undefined;
  minStories?: number | null;
  maxStories?: number | null;
  baseMaterialIds?: number[] | undefined;

  minStructureCount?: number | null;
  maxStructureCount?: number | null;

  propertyClassIds?: number[] | undefined;

  taxYear?: number | null;
  minTotalValue?: number | null;
  maxTotalValue?: number | null;
  minLandValue?: number | null;
  maxLandValue?: number | null;
  minImprValue?: number | null;
  maxImprValue?: number | null;

  minValuePerTotalSqft?: number | null;
  maxValuePerTotalSqft?: number | null;
  minValuePerLivableSqft?: number | null;
  maxValuePerLivableSqft?: number | null;
};

export type ParcelRollupRow = {
  parcel_id: number;
  block: number | null;
  lot: number | null;
  ext: number | null;

  address_housenumber: string | null;
  address_street: string | null;

  address: any | null;
  neighborhoods_at_as_of: any | null;
  property_class: any | null;
  value_snapshot: any | null;

  structure_count: number | null;
  total_structure_sqft: number | null;
  total_structure_livable_sqft: number | null;

  total_value: number | null;
  value_per_total_sqft: number | null;
  value_per_livable_sqft: number | null;

  structure_snapshot: any | null;
};

export type ParcelRollupApiResponse = {
  count: number;
  data: ParcelRollupRow[];
};
