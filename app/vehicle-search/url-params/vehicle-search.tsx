"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface VehicleSearchProps {
  placeholder: string;
  defaultGuideYear?: number;
  defaultMatchLimit?: number;
  defaultSearchType?: "auto" | "vin" | "description";
  mode?: "debounce" | "apply";
  debounceDelay?: number;
}

export default function VehicleSearch({
  placeholder,
  defaultGuideYear = 2026,
  defaultMatchLimit = 10,
  defaultSearchType = "auto",
  mode = "apply",
  debounceDelay = 300,
}: VehicleSearchProps) {
  const searchParams = useSearchParams();
  const { push } = useRouter();
  const pathname = usePathname();

  const delay = mode === "debounce" ? debounceDelay : 0;

  // Local state for "apply" mode
  const [localQuery, setLocalQuery] = useState(
    searchParams.get("query")?.toString() || ""
  );
  const [localGuideYear, setLocalGuideYear] = useState(
    searchParams.get("guide_year")?.toString() || defaultGuideYear.toString()
  );
  const [localMatchLimit, setLocalMatchLimit] = useState(
    searchParams.get("match_limit")?.toString() || defaultMatchLimit.toString()
  );
  const [localSearchType, setLocalSearchType] = useState(
    searchParams.get("search_type")?.toString() || defaultSearchType
  );
  const [isApplying, setIsApplying] = useState(false);

  // Sync local state with URL params when they change externally
  useEffect(() => {
    if (mode === "apply") {
      setLocalQuery(searchParams.get("query")?.toString() || "");
      setLocalGuideYear(
        searchParams.get("guide_year")?.toString() ||
          defaultGuideYear.toString()
      );
      setLocalMatchLimit(
        searchParams.get("match_limit")?.toString() ||
          defaultMatchLimit.toString()
      );
      setLocalSearchType(
        searchParams.get("search_type")?.toString() || defaultSearchType
      );
      // Clear loading state when URL params update
      setIsApplying(false);
    }
  }, [
    searchParams,
    mode,
    defaultGuideYear,
    defaultMatchLimit,
    defaultSearchType,
  ]);

  // Check if local state differs from URL params
  const hasChanges =
    mode === "apply" &&
    (localQuery !== (searchParams.get("query")?.toString() || "") ||
      localGuideYear !==
        (searchParams.get("guide_year")?.toString() ||
          defaultGuideYear.toString()) ||
      localMatchLimit !==
        (searchParams.get("match_limit")?.toString() ||
          defaultMatchLimit.toString()) ||
      localSearchType !==
        (searchParams.get("search_type")?.toString() || defaultSearchType));

  const handleSearch = useDebouncedCallback((term: string) => {
    if (mode === "debounce") {
      const params = new URLSearchParams(searchParams);

      // Reset to page 1 when search changes
      params.set("page", "1");

      if (term) {
        params.set("query", term);
      } else {
        params.delete("query");
      }

      push(`${pathname}?${params.toString()}`);
    } else {
      setLocalQuery(term);
    }
  }, delay);

  const handleGuideYearChange = (year: string) => {
    if (mode === "debounce") {
      const params = new URLSearchParams(searchParams);
      params.set("guide_year", year);
      params.set("page", "1");
      push(`${pathname}?${params.toString()}`);
    } else {
      setLocalGuideYear(year);
    }
  };

  const handleMatchLimitChange = (limit: string) => {
    if (mode === "debounce") {
      const params = new URLSearchParams(searchParams);
      params.set("match_limit", limit);
      params.set("page", "1");
      push(`${pathname}?${params.toString()}`);
    } else {
      setLocalMatchLimit(limit);
    }
  };

  const handleSearchTypeChange = (type: string) => {
    if (mode === "debounce") {
      const params = new URLSearchParams(searchParams);
      params.set("search_type", type);
      params.set("page", "1");
      push(`${pathname}?${params.toString()}`);
    } else {
      setLocalSearchType(type);
    }
  };

  const handleApply = (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsApplying(true);

    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    if (localQuery) {
      params.set("query", localQuery);
    } else {
      params.delete("query");
    }

    params.set("guide_year", localGuideYear);
    params.set("match_limit", localMatchLimit);
    params.set("search_type", localSearchType);

    push(`${pathname}?${params.toString()}`);
  };

  return (
    <form onSubmit={handleApply} className="space-y-4">
      {/* Search Input */}
      <div className="flex gap-2">
        <div className="relative flex flex-1 flex-shrink-0">
          <label htmlFor="search" className="sr-only">
            Search
          </label>
          <input
            id="search"
            className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
            placeholder={placeholder}
            onChange={(e) => {
              handleSearch(e.target.value);
            }}
            value={mode === "apply" ? localQuery : undefined}
            defaultValue={
              mode === "debounce"
                ? searchParams.get("query")?.toString()
                : undefined
            }
          />
          <Search className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        </div>

        {/* Search Button (only in apply mode) */}
        {mode === "apply" && (
          <Button
            type="submit"
            disabled={!hasChanges || isApplying}
            className="w-24"
          >
            {isApplying ? "Searching..." : "Search"}
          </Button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Type */}
        <div className="flex-1 min-w-[150px]">
          <label
            htmlFor="search_type"
            className="block text-sm font-medium mb-1.5"
          >
            Search Type
          </label>
          <select
            id="search_type"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={mode === "apply" ? localSearchType : undefined}
            defaultValue={
              mode === "debounce"
                ? searchParams.get("search_type")?.toString() ||
                  defaultSearchType
                : undefined
            }
            onChange={(e) => handleSearchTypeChange(e.target.value)}
          >
            <option value="auto">Auto-detect</option>
            <option value="vin">VIN</option>
            <option value="description">Description</option>
          </select>
        </div>

        {/* Guide Year */}
        <div className="min-w-[120px]">
          <label
            htmlFor="guide_year"
            className="block text-sm font-medium mb-1.5"
          >
            Guide Year
          </label>
          <select
            id="guide_year"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={mode === "apply" ? localGuideYear : undefined}
            defaultValue={
              mode === "debounce"
                ? searchParams.get("guide_year")?.toString() || defaultGuideYear
                : undefined
            }
            onChange={(e) => handleGuideYearChange(e.target.value)}
          >
            {Array.from({ length: 3 }, (_, i) => 2024 + i).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Match Limit */}
        <div className="min-w-[120px]">
          <label
            htmlFor="match_limit"
            className="block text-sm font-medium mb-1.5"
          >
            Results Per Page
          </label>
          <select
            id="match_limit"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={mode === "apply" ? localMatchLimit : undefined}
            defaultValue={
              mode === "debounce"
                ? searchParams.get("match_limit")?.toString() ||
                  defaultMatchLimit
                : undefined
            }
            onChange={(e) => handleMatchLimitChange(e.target.value)}
          >
            {[10, 25, 50, 100].map((limit) => (
              <option key={limit} value={limit}>
                {limit}
              </option>
            ))}
          </select>
        </div>
      </div>
    </form>
  );
}
