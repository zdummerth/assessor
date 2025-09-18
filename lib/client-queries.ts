"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useSearch(query: string) {
  const { data, error, isLoading } = useSWR(
    query ? `/parcels/search/?query=${encodeURIComponent(query)}` : null,
    fetcher
  );

  return {
    data,
    isLoading,
    error,
  };
}

export function useComps(
  parcelId: number | null,
  options?: {
    k?: number;
    years?: number;
    min_living_area?: number;
    max_living_area?: number;
    max_distance_miles?: number;
    living_area_band?: number;
    require_same_land_use?: boolean;
    weights?: Record<string, number>;
  }
) {
  const params = new URLSearchParams();

  if (parcelId) params.set("parcel_id", String(parcelId));
  if (options?.k) params.set("k", String(options.k));
  if (options?.years) params.set("years", String(options.years));
  if (options?.min_living_area)
    params.set("min_living_area", String(options.min_living_area));
  if (options?.max_living_area)
    params.set("max_living_area", String(options.max_living_area));
  if (options?.max_distance_miles)
    params.set("max_distance_miles", String(options.max_distance_miles));
  if (options?.living_area_band)
    params.set("living_area_band", String(options.living_area_band));
  if (options?.require_same_land_use !== undefined)
    params.set(
      "require_same_land_use",
      options.require_same_land_use ? "1" : "0"
    );
  if (options?.weights) params.set("weights", JSON.stringify(options.weights));

  const url =
    parcelId !== null
      ? `/parcels/${parcelId}/comps/search/?${params.toString()}`
      : null;

  const { data, error, isLoading } = useSWR(url, fetcher);

  return {
    data,
    isLoading,
    error,
  };
}

export function useSalesSearchByAddress(options?: {
  address?: string;
  valid_only?: boolean;
}) {
  const params = new URLSearchParams();

  if (options?.address) params.set("address", options.address);
  if (options?.valid_only !== undefined) {
    params.set("valid_only", options.valid_only ? "1" : "0");
  }

  const url =
    options && Object.keys(options).length > 0
      ? `/sales/search-by-address?${params.toString()}`
      : `/sales/search-by-address`;

  const { data, error, isLoading } = useSWR(url, fetcher);

  return {
    data,
    isLoading,
    error,
  };
}

export function useCompare(
  parcelId: number | null,
  compSaleIds: number[] | null
) {
  const params = new URLSearchParams();

  if (compSaleIds && compSaleIds.length > 0) {
    params.set("comp_sale_ids", compSaleIds.join(","));
  }

  if (parcelId) params.set("subject_parcel_id", String(parcelId));

  const url =
    parcelId !== null && compSaleIds && compSaleIds.length > 0
      ? `/parcels/${parcelId}/compare?${params.toString()}`
      : null;

  const { data, error, isLoading } = useSWR(url, fetcher);

  return {
    data,
    isLoading,
    error,
  };
}

export type RatioMediansRow = {
  group_key: string | null;
  median_ratio: number | null;
  min_ratio: number | null;
  max_ratio: number | null;
  avg_ratio: number | null;
  n: number;
  raw_data?: any; // jsonb array if include_raw=true
};

export function useLandUseOptions() {
  const { data, error, isLoading } = useSWR<string[]>("/land-uses", fetcher);
  return {
    options: Array.isArray(data) ? data : [],
    isLoading,
    error,
  };
}

export type RatioRow = {
  // minimal shape expected from get_ratios
  sale_id: number;
  parcel_id: number;
  sale_date: string; // 'YYYY-MM-DD' (or ISO)
  sale_price: number | null;
  sale_type?: string | null;

  // grouping keys we may use
  land_use_sale?: string | null;
  land_use_asof?: string | null;
  district?: string | null;
  value_year?: number | null;

  // computed by get_ratios
  ratio: number | null;
  // you may have more columns — keep it open-ended
  [k: string]: any;
};

type PgNumeric = number | string | null;
export type RatiosFeaturesRow = {
  parcel_id: number;
  block: number;
  lot: string;
  ext: number;

  // Values as-of
  value_row_id: number | null;
  value_year: number | null;
  date_of_assessment: string | null; // timestamptz
  current_value: PgNumeric;
  sale_id: number | null; // if part of a sale
  sale_date: string | null; // 'YYYY-MM-DD'
  sale_price: number | null; // if part of a sale
  sale_type: string | null; // if part of a sale
  ratio: PgNumeric; // if part of a sale

  // Structures / physical
  structure_count: number;
  total_finished_area: number | null;
  total_unfinished_area: number | null;
  avg_year_built: number | null;
  avg_condition: PgNumeric;
  total_units: number | null;

  // Land & derived
  land_area: PgNumeric;
  land_to_building_area_ratio: PgNumeric;
  values_per_sqft_building_total: PgNumeric;
  values_per_sqft_finished: PgNumeric;
  values_per_sqft_land: PgNumeric;
  values_per_unit: PgNumeric;

  // LU & geo
  land_use: string | null;
  lat: number | null;
  lon: number | null;
  district: string | null;
  neighborhoods_at_as_of: Array<{
    set_id: number | null;
    set_name: string | null;
    neighborhood_id: number | null;
    neighborhood_code: number | string | null;
    neighborhood_name: string | null;
  }>;
  house_number: string | null;
  street: string | null;
  postcode: string | null;
};

// For get_parcel_value_features_asof
export type ParcelValueFeaturesRow = {
  parcel_id: number;
  block: number;
  lot: string;
  ext: number;

  // Values as-of
  value_row_id: number | null;
  value_year: number | null;
  date_of_assessment: string | null; // timestamptz
  current_value: number | string | null; // PG numeric

  // Structures / physical
  structure_count: number;
  total_finished_area: number | null;
  total_unfinished_area: number | null;
  avg_year_built: number | null;
  avg_condition: number | string | null; // PG numeric
  total_units: number | null;

  // Land & derived
  land_area: number | string | null; // PG numeric
  land_to_building_area_ratio: number | string | null; // PG numeric
  values_per_sqft_building_total: number | string | null; // PG numeric
  values_per_sqft_finished: number | string | null; // PG numeric
  values_per_sqft_land: number | string | null; // PG numeric
  values_per_unit: number | string | null; // PG numeric

  // LU & geo
  land_use: string | null;
  lat: number | null;
  lon: number | null;
  district: string | null;
  neighborhoods_at_as_of: Array<{
    set_id: number | null;
    set_name: string | null;
    neighborhood_id: number | null;
    neighborhood_code: number | string | null; // sometimes stored numeric-like
    neighborhood_name: string | null;
  }>;
  house_number: string | null;
  street: string | null;
  postcode: string | null;
};

export function useRatiosFeatures(options?: {
  start_date?: string; // 'YYYY-MM-DD'
  end_date?: string; // 'YYYY-MM-DD'
  as_of_date?: string; // 'YYYY-MM-DD'
  land_uses?: string[]; // filter by land_use_sale
  valid_only?: boolean; // defaults to true on the API
}) {
  const params = new URLSearchParams();
  if (options?.start_date) params.set("start_date", options.start_date);
  if (options?.end_date) params.set("end_date", options.end_date);
  if (options?.as_of_date) params.set("as_of_date", options.as_of_date);
  if (options?.land_uses?.length)
    params.set("land_uses", options.land_uses.join(","));
  if (typeof options?.valid_only === "boolean")
    params.set("valid_only", String(options.valid_only));

  const url =
    options && Object.keys(options).length > 0
      ? `/sales/ratio-features?${params.toString()}`
      : `/sales/ratio-features`;

  const { data, error, isLoading } = useSWR<RatiosFeaturesRow[]>(url, fetcher);

  return { data: data ?? [], error, isLoading };
}

export type ParcelFeaturesRow = {
  parcel_id: number;
  block: number | null;
  lot: string | null;
  ext: number | null;
  structure_count: number | null;
  total_finished_area: number | null;
  total_unfinished_area: number | null;
  avg_year_built: number | null;
  avg_condition: number | null;
  land_use: string | null;
  lat: number | null;
  lon: number | null;
  district: string | null;
  house_number: string | null;
  street: string | null;
  postcode: string | null;
};

export type SaleParcelJSON = {
  parcel_id: number;
  land_use_sale: string | null;
  district: string | null;
  house_number: string | null;
  street: string | null;
  postcode: string | null;
  lat: number | null;
  lon: number | null;
  block: number | null;
  lot: string | null;
  ext: number | null;
  land_area: number | null;
};

export type MultiParcelSaleRow = {
  sale_id: number;
  sale_date: string; // 'YYYY-MM-DD'
  sale_price: number | null;
  sale_type: string | null;
  is_valid: boolean | null;

  parcel_count: number;
  structure_count: number;
  total_finished_area: number | null;
  total_unfinished_area: number | null;
  land_area_total: number | null;
  avg_year_built: number | null;
  avg_condition: number | null;
  total_units: number | null;

  land_to_building_area_ratio: number | null;
  price_per_sqft_building_total: number | null;
  price_per_sqft_finished: number | null;
  price_per_sqft_land: number | null;
  price_per_unit: number | null;

  parcels: SaleParcelJSON[] | null; // JSONB array from SQL
};

export function useMultiParcelSales(options?: {
  start_date?: string; // 'YYYY-MM-DD'
  end_date?: string; // 'YYYY-MM-DD'
  land_uses?: string[]; // filter: any parcel in sale matches
  valid_only?: boolean; // defaults to true on the API
}) {
  const params = new URLSearchParams();
  if (options?.start_date) params.set("start_date", options.start_date);
  if (options?.end_date) params.set("end_date", options.end_date);
  if (options?.land_uses?.length)
    params.set("land_uses", options.land_uses.join(","));
  if (typeof options?.valid_only === "boolean")
    params.set("valid_only", String(options.valid_only));

  const url =
    options && Object.keys(options).length > 0
      ? `/sales/ratio-features-multi?${params.toString()}`
      : `/sales/ratio-features-multi`;

  const { data, error, isLoading } = useSWR<MultiParcelSaleRow[]>(url, fetcher);

  return { data: data ?? [], error, isLoading };
}
