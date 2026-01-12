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
import { executeSearchVinWithGuideMatches } from "./actions";
import { SearchVinWithGuideMatchesPresentation } from "./search-vin-with-guide-matches-presentation";

export function ParametersForm() {
  const [state, formAction, isPending] = useActionState(
    executeSearchVinWithGuideMatches,
    { error: "", success: "" }
  );

  return (
    <>
      <form action={formAction} className="space-y-4">
        <div className="flex gap-2">
          <div>
            <Label htmlFor="p_vin">VIN</Label>
            <Input
              id="p_vin"
              name="p_vin"
              className="p-2 w-96"
              type="text"
              placeholder="Enter VIN"
              required
            />
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Searching..." : "Search"}
          </Button>
        </div>

        {state.error && (
          <div className="text-sm text-red-500">{state.error}</div>
        )}
      </form>

      {/* Results Section */}
      {state.data && (
        <div className="mt-6">
          <SearchVinWithGuideMatchesPresentation
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
