"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { executeSearchVehicleUnified } from "./actions";
import { SearchVehicleUnifiedPresentation } from "./search-vehicle-unified-presentation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
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

  return (
    <>
      <form action={formAction} className="space-y-4">
        <div className="space-y-4">
          {/* Search Text Input */}
          <div className="flex gap-2 items-end">
            <div className="flex-1 max-w-md">
              <Label htmlFor="p_search_text">Search Text</Label>
              <Input
                id="p_search_text"
                name="p_search_text"
                className="font-mono"
                type="text"
                placeholder="Enter VIN or vehicle description"
                required
              />
            </div>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Searching..." : "Search"}
            </Button>
          </div>

          {/* Search Type Selection */}
          <div className="space-y-2">
            <Label>Search Type</Label>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="search-type-auto"
                  name="p_search_type"
                  value="auto"
                  checked={searchType === "auto"}
                  onCheckedChange={(checked) => {
                    if (checked) setSearchType("auto");
                  }}
                />
                <label
                  htmlFor="search-type-auto"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Auto-detect
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="search-type-vin"
                  name="p_search_type"
                  value="vin"
                  checked={searchType === "vin"}
                  onCheckedChange={(checked) => {
                    if (checked) setSearchType("vin");
                  }}
                />
                <label
                  htmlFor="search-type-vin"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  VIN Search
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="search-type-description"
                  name="p_search_type"
                  value="description"
                  checked={searchType === "description"}
                  onCheckedChange={(checked) => {
                    if (checked) setSearchType("description");
                  }}
                />
                <label
                  htmlFor="search-type-description"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Description Search
                </label>
              </div>
            </div>
            <input type="hidden" name="p_search_type" value={searchType} />
          </div>

          {/* Advanced Options */}
          <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                Advanced Options
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    showAdvanced ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="p_guide_year" className="text-xs">
                    Guide Year
                  </Label>
                  <select
                    id="p_guide_year"
                    name="p_guide_year"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue="2026"
                  >
                    {Array.from({ length: 11 }, (_, i) => 2020 + i).map(
                      (year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      )
                    )}
                  </select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Default: 2026
                  </p>
                </div>
                <div>
                  <Label htmlFor="p_match_limit" className="text-xs">
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
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Default: 10
                  </p>
                </div>
                <div>
                  <Label htmlFor="p_similarity_threshold" className="text-xs">
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
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Default: 0.4
                  </p>
                </div>
                <div>
                  <Label htmlFor="p_year_tolerance" className="text-xs">
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
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Default: 1 (for NHTSA API fallback)
                  </p>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {state.error && (
          <div className="text-red-500 text-sm">{state.error}</div>
        )}
      </form>

      {state.data && (
        <div className="mt-6">
          <SearchVehicleUnifiedPresentation
            data={state.data}
            searchText={state.searchText}
          />
        </div>
      )}
    </>
  );
}
