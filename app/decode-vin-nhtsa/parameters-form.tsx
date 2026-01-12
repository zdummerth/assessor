"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { executeDecodeVinNhtsa } from "./actions";
import { DecodeVinNhtsaPresentation } from "./decode-vin-nhtsa-presentation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function ParametersForm() {
  const [state, formAction, isPending] = useActionState(executeDecodeVinNhtsa, {
    error: "",
    success: "",
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <>
      <form action={formAction} className="space-y-4">
        <div className="space-y-4">
          {/* VIN Input */}
          <div className="flex gap-2 items-end">
            <div className="flex-1 max-w-md">
              <Label htmlFor="p_vin">VIN</Label>
              <Input
                id="p_vin"
                name="p_vin"
                className="font-mono"
                type="text"
                placeholder="Enter 17-character VIN"
                maxLength={17}
                required
              />
            </div>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Decoding..." : "Decode VIN"}
            </Button>
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
                    Default: 1
                  </p>
                </div>
                <div>
                  <Label htmlFor="p_match_threshold" className="text-xs">
                    Match Threshold
                  </Label>
                  <Input
                    id="p_match_threshold"
                    name="p_match_threshold"
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
                  <Label htmlFor="p_make_threshold" className="text-xs">
                    Make Threshold
                  </Label>
                  <Input
                    id="p_make_threshold"
                    name="p_make_threshold"
                    type="number"
                    placeholder="0.5"
                    min="0"
                    max="1"
                    step="0.1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Default: 0.5
                  </p>
                </div>
                <div>
                  <Label htmlFor="p_model_threshold" className="text-xs">
                    Model Threshold
                  </Label>
                  <Input
                    id="p_model_threshold"
                    name="p_model_threshold"
                    type="number"
                    placeholder="0.6"
                    min="0"
                    max="1"
                    step="0.1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Default: 0.6
                  </p>
                </div>
                <div>
                  <Label htmlFor="p_trim_threshold" className="text-xs">
                    Trim Threshold
                  </Label>
                  <Input
                    id="p_trim_threshold"
                    name="p_trim_threshold"
                    type="number"
                    placeholder="0.3"
                    min="0"
                    max="1"
                    step="0.1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Default: 0.3
                  </p>
                </div>
                <div>
                  <Label htmlFor="p_limit" className="text-xs">
                    Result Limit
                  </Label>
                  <Input
                    id="p_limit"
                    name="p_limit"
                    type="number"
                    placeholder="10"
                    min="1"
                    max="50"
                    step="1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Default: 10
                  </p>
                </div>
                <div>
                  <Label htmlFor="p_guide_year" className="text-xs">
                    Guide Year
                  </Label>
                  <Input
                    id="p_guide_year"
                    name="p_guide_year"
                    type="number"
                    placeholder="All years"
                    min="2000"
                    max="2100"
                    step="1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Optional - Filter by guide year
                  </p>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {state.error && (
          <div className="text-sm text-red-500">{state.error}</div>
        )}
      </form>

      {/* Results Section */}
      {state.data && (
        <div className="mt-6">
          <DecodeVinNhtsaPresentation
            data={state.data}
            searchedVin={state.searchedVin}
            error={state.error}
            isLoading={isPending}
          />
        </div>
      )}
    </>
  );
}
