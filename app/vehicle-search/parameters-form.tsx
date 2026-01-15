"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { executeSearchVehicleUnified } from "./actions";
import { SearchVehicleUnifiedPresentation } from "./search-vehicle-unified-presentation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState, useCallback } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export function ParametersForm() {
  const [state, formAction, isPending] = useActionState(
    executeSearchVehicleUnified,
    {
      error: "",
      success: "",
    }
  );
  const [searchType, setSearchType] = useState<"auto" | "vin" | "description">(
    "auto"
  );

  const handleSearchTypeChange = useCallback(
    (type: "auto" | "vin" | "description") => {
      setSearchType(type);
    },
    []
  );

  return (
    <>
      <form action={formAction} className="space-y-6">
        {/* Primary Search Section */}
        <div className="space-y-4">
          {/* Inputs row/column layout */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
            {/* Search Text */}
            <div className="flex-1 min-w-[180px]">
              <Label
                htmlFor="p_search_text"
                className="text-sm font-semibold mb-2 block"
              >
                Search Text
              </Label>
              <Input
                id="p_search_text"
                name="p_search_text"
                className="font-mono text-sm h-10 pl-2"
                type="text"
                placeholder="Enter VIN or vehicle description…"
                required
                aria-required="true"
                aria-describedby={state.error ? "search-error" : undefined}
              />
            </div>

            {/* Guide Year */}
            <div className="min-w-[120px]">
              <Label htmlFor="p_guide_year" className="text-sm font-medium">
                Guide Year
              </Label>
              <select
                id="p_guide_year"
                name="p_guide_year"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                defaultValue="2026"
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
              <Label htmlFor="p_match_limit" className="text-sm font-medium">
                Match Limit
              </Label>
              <select
                id="p_match_limit"
                name="p_match_limit"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                defaultValue="10"
              >
                {[10, 25, 50, 100].map((limit) => (
                  <option key={limit} value={limit}>
                    {limit}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <div className="sm:pt-6">
              <Button
                type="submit"
                disabled={isPending}
                className="gap-2 h-10 px-6 w-full sm:w-auto"
                aria-busy={isPending}
              >
                {isPending ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Searching…
                  </>
                ) : (
                  "Search"
                )}
              </Button>
            </div>
          </div>

          {/* Search Type Selection */}
          <fieldset className="space-y-3 border-b pb-4">
            <legend className="text-sm font-semibold text-foreground">
              Search Type
            </legend>
            <div className="flex flex-col sm:flex-row gap-6">
              {(["auto", "vin", "description"] as const).map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`search-type-${type}`}
                    name="p_search_type"
                    value={type}
                    checked={searchType === type}
                    onCheckedChange={() => handleSearchTypeChange(type)}
                    aria-label={
                      type === "auto"
                        ? "Auto-detect search type"
                        : type === "vin"
                          ? "VIN Search"
                          : "Description Search"
                    }
                  />
                  <label
                    htmlFor={`search-type-${type}`}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {type === "auto"
                      ? "Auto-detect"
                      : type === "vin"
                        ? "VIN Search"
                        : "Description Search"}
                  </label>
                </div>
              ))}
            </div>
            <input type="hidden" name="p_search_type" value={searchType} />
          </fieldset>
        </div>

        {/* Error Message */}
        {state.error ? (
          <div
            id="search-error"
            className="text-red-600 text-sm p-3 bg-red-50 rounded-md border border-red-200 flex gap-2 items-start"
            role="alert"
          >
            <span className="font-semibold">Error:</span>
            <span>{state.error}</span>
          </div>
        ) : null}
      </form>

      {/* Results Section */}
      {state.data ? (
        <div className="mt-8">
          <SearchVehicleUnifiedPresentation
            data={state.data}
            searchText={state.searchText}
          />
        </div>
      ) : null}
    </>
  );
}
