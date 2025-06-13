"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useSearch(query: string) {
  const { data, error, isLoading } = useSWR(
    query ? `/parcels/search/?query=${query}` : null,
    fetcher
  );

  return {
    data,
    isLoading,
    error,
  };
}
