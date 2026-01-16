"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

interface VehicleSearchProps {
  placeholder: string;
  defaultGuideYear?: number;
  defaultMatchLimit?: number;
  defaultSearchType?: "auto" | "vin" | "description";
}

export default function VehicleSearch({
  placeholder,
  defaultGuideYear = 2026,
  defaultMatchLimit = 10,
  defaultSearchType = "auto",
}: VehicleSearchProps) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);

    // Reset to page 1 when search changes
    params.set("page", "1");

    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }

    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleGuideYearChange = (year: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("guide_year", year);
    params.set("page", "1");
    replace(`${pathname}?${params.toString()}`);
  };

  const handleMatchLimitChange = (limit: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("match_limit", limit);
    params.set("page", "1");
    replace(`${pathname}?${params.toString()}`);
  };

  const handleSearchTypeChange = (type: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("search_type", type);
    params.set("page", "1");
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
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
          defaultValue={searchParams.get("query")?.toString()}
        />
        <Search className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
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
            defaultValue={
              searchParams.get("search_type")?.toString() || defaultSearchType
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
            defaultValue={
              searchParams.get("guide_year")?.toString() || defaultGuideYear
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
            defaultValue={
              searchParams.get("match_limit")?.toString() || defaultMatchLimit
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
    </div>
  );
}
