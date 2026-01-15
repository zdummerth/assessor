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
  const [showAdvanced, setShowAdvanced] = useState(false);
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
          <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
            <div className="flex-1">
              <Label
                htmlFor="p_search_text"
                className="text-sm font-semibold mb-2 block"
              >
                Search Text
              </Label>
              <Input
                id="p_search_text"
                name="p_search_text"
                className="font-mono text-sm h-10"
                type="text"
                placeholder="Enter VIN or vehicle description…"
                required
                aria-required="true"
                aria-describedby={state.error ? "search-error" : undefined}
              />
            </div>
            <Button
              type="submit"
              disabled={isPending}
              className="gap-2 h-10 px-6"
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

        {/* Advanced Options */}
        <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-foreground h-9"
              aria-expanded={showAdvanced}
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  showAdvanced ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
              Advanced Options
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-4">
            <fieldset className="space-y-4">
              <legend className="text-sm font-semibold text-foreground">
                Filter Options
              </legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Guide Year */}
                <div className="space-y-2">
                  <Label htmlFor="p_guide_year" className="text-sm font-medium">
                    Guide Year
                  </Label>
                  <select
                    id="p_guide_year"
                    name="p_guide_year"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue="2026"
                    aria-describedby="guide-year-help"
                  >
                    {Array.from({ length: 11 }, (_, i) => 2020 + i).map(
                      (year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      )
                    )}
                  </select>
                  <p
                    id="guide-year-help"
                    className="text-xs text-muted-foreground"
                  >
                    Default: 2026
                  </p>
                </div>

                {/* Match Limit */}
                <div className="space-y-2">
                  <Label
                    htmlFor="p_match_limit"
                    className="text-sm font-medium"
                  >
                    Match Limit
                  </Label>
                  <Input
                    id="p_match_limit"
                    name="p_match_limit"
                    type="number"
                    placeholder="10"
                    min="1"
                    max="100"
                    step="1"
                    className="h-10"
                    aria-describedby="match-limit-help"
                  />
                  <p
                    id="match-limit-help"
                    className="text-xs text-muted-foreground"
                  >
                    Default: 10
                  </p>
                </div>

                {/* Similarity Threshold */}
                <div className="space-y-2">
                  <Label
                    htmlFor="p_similarity_threshold"
                    className="text-sm font-medium"
                  >
                    Similarity Threshold
                  </Label>
                  <Input
                    id="p_similarity_threshold"
                    name="p_similarity_threshold"
                    type="number"
                    placeholder="0.4"
                    min="0"
                    max="1"
                    step="0.1"
                    className="h-10"
                    aria-describedby="similarity-help"
                  />
                  <p
                    id="similarity-help"
                    className="text-xs text-muted-foreground"
                  >
                    Default: 0.4
                  </p>
                </div>

                {/* Year Tolerance */}
                <div className="space-y-2">
                  <Label
                    htmlFor="p_year_tolerance"
                    className="text-sm font-medium"
                  >
                    Year Tolerance
                  </Label>
                  <Input
                    id="p_year_tolerance"
                    name="p_year_tolerance"
                    type="number"
                    placeholder="1"
                    min="0"
                    max="5"
                    step="1"
                    className="h-10"
                    aria-describedby="year-tolerance-help"
                  />
                  <p
                    id="year-tolerance-help"
                    className="text-xs text-muted-foreground"
                  >
                    Default: 1
                  </p>
                </div>
              </div>
            </fieldset>
          </CollapsibleContent>
        </Collapsible>

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
