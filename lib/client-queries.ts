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
