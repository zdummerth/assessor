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

/**
 * Hook to fetch comparable sales using the find_comps function.
 *
 * @param parcelId The subject parcel ID (required)
 * @param options  Optional params like k, years, max_distance_miles, etc.
 */
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
      ? `/test/parcels/${parcelId}/comps/search/?${params.toString()}`
      : null;

  const { data, error, isLoading } = useSWR(url, fetcher);

  return {
    data,
    isLoading,
    error,
  };
}

export function useSalesSearch(options?: {
  start_date?: string;
  end_date?: string;
  valid_only?: boolean;
  address?: string;
}) {
  const params = new URLSearchParams();

  if (options?.start_date) params.set("start_date", options.start_date);
  if (options?.end_date) params.set("end_date", options.end_date);
  if (options?.valid_only !== undefined) {
    params.set("valid_only", options.valid_only ? "1" : "0");
  }
  if (options?.address) params.set("address", options.address);

  const url =
    options && Object.keys(options).length > 0
      ? `/test/sales/search?${params.toString()}`
      : `/test/sales/search`;

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
      ? `/test/sales/search-by-address?${params.toString()}`
      : `/test/sales/search-by-address`;

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
      ? `/test/parcels/${parcelId}/compare?${params.toString()}`
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

export function useRatioMedians(options?: {
  start_date?: string; // 'YYYY-MM-DD'
  end_date?: string; // 'YYYY-MM-DD'
  as_of_date?: string; // 'YYYY-MM-DD'
  group_by?: string[]; // e.g., ['district', 'land_use_sale']
  land_uses?: string[]; // e.g., ['5000','5100']
  trim_factor?: 1.5 | 3; // or undefined
  include_raw?: boolean; // default false
}) {
  const params = new URLSearchParams();

  if (options?.start_date) params.set("start_date", options.start_date);
  if (options?.end_date) params.set("end_date", options.end_date);
  if (options?.as_of_date) params.set("as_of_date", options.as_of_date);

  if (options?.group_by?.length) {
    params.set("group_by", options.group_by.join(","));
  }
  if (options?.land_uses?.length) {
    params.set("land_uses", options.land_uses.join(","));
  }
  if (options?.trim_factor) {
    params.set("trim_factor", String(options.trim_factor));
  }
  if (options?.include_raw !== undefined) {
    params.set("include_raw", options.include_raw ? "1" : "0");
  }

  const hasAny =
    options && Object.keys(options).length > 0 && Array.from(params).length > 0;

  const url = hasAny
    ? `/test/ratios/medians?${params.toString()}`
    : `/test/ratios/medians`;

  const { data, error, isLoading } = useSWR<RatioMediansRow[]>(url, fetcher);

  return { data, error, isLoading };
}

export function useLandUseOptions() {
  const { data, error, isLoading } = useSWR<string[]>(
    "/test/land-uses",
    fetcher
  );
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

export function useRatiosRaw(options?: {
  start_date?: string; // 'YYYY-MM-DD'
  end_date?: string; // 'YYYY-MM-DD'
  as_of_date?: string; // 'YYYY-MM-DD'
  land_uses?: string[]; // filter returned rows by land_use_sale
}) {
  const params = new URLSearchParams();
  if (options?.start_date) params.set("start_date", options.start_date);
  if (options?.end_date) params.set("end_date", options.end_date);
  if (options?.as_of_date) params.set("as_of_date", options.as_of_date);
  if (options?.land_uses?.length)
    params.set("land_uses", options.land_uses.join(","));

  const url =
    options && Object.keys(options).length > 0
      ? `/test/ratios/raw?${params.toString()}`
      : `/test/ratios/raw`;

  const { data, error, isLoading } = useSWR<RatioRow[]>(url, fetcher);

  return { data: data ?? [], error, isLoading };
}

export type RatiosFeaturesRow = {
  sale_id: number;
  sale_date: string; // date
  sale_price: number | null;
  sale_type: string | null;
  parcel_id: number;
  value_row_id: number | null;
  value_year: number | null;
  date_of_assessment: string | null; // timestamptz
  current_value: number | string | null; // PG numeric may be string
  ratio: number | string | null; // PG numeric may be string
  land_use_sale: string | null;
  land_use_asof: string | null;
  block: number | null;
  lot: string | null;
  ext: number | null;
  structure_count: number | null;
  total_finished_area: number | null;
  total_unfinished_area: number | null;
  avg_year_built: number | null;
  avg_condition: number | string | null; // PG numeric may be string
  land_use: string | null;
  lat: number | null;
  lon: number | null;
  district: string | null;
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
      ? `/test/ratios/ratio-features?${params.toString()}`
      : `/test/ratios/ratio-features`;

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

export function useParcelFeatures(
  parcelId: number | null,
  options?: {
    as_of_date?: string | Date; // "YYYY-MM-DD" or Date
  }
) {
  const params = new URLSearchParams();

  // keep the query param for parity, even though parcelId is in the path
  if (parcelId !== null) params.set("parcel_id", String(parcelId));

  if (options?.as_of_date) {
    const v =
      options.as_of_date instanceof Date
        ? options.as_of_date.toISOString().slice(0, 10)
        : options.as_of_date;
    params.set("as_of_date", v);
  }

  // path: /test/[parcel_id]/features
  const base = parcelId !== null ? `/test/${parcelId}/features` : null;
  const qs = params.toString();
  const url = base ? (qs ? `${base}?${qs}` : base) : null;

  const { data, error, isLoading, mutate } = useSWR<ParcelFeaturesRow[]>(
    url,
    fetcher
  );

  return {
    data, // array (usually 0 or 1 row, filtered by parcel_id)
    isLoading,
    error,
    mutate,
  };
}
