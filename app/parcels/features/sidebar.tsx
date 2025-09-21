// components/parcel-features/FiltersSidebar.tsx
"use client";

import MultiSelectAutocomplete from "@/components/inputs/multi-select-autocomplete";
import MultiSelect from "@/components/inputs/multi-select";

type NeighborhoodOption = { value: string; label: string };

export default function FiltersSidebar(props: {
  asOfDate: string;
  selectedLandUses: string[];
  selectedNeighborhoods: string[];
  ilikeStreet: string;
  tfaMin: string;
  tfaMax: string;
  cvMin: string;
  cvMax: string;

  setAsOfDate: (v: string) => void;
  setSelectedLandUses: (v: string[]) => void;
  setSelectedNeighborhoods: (v: string[]) => void;
  setIlikeStreet: (v: string) => void;
  setTfaMin: (v: string) => void;
  setTfaMax: (v: string) => void;
  setCvMin: (v: string) => void;
  setCvMax: (v: string) => void;

  landUseOptions: string[];
  luLoading: boolean;
  luError?: unknown;

  neighborhoodOptions: NeighborhoodOption[];
  nbLoading: boolean;
  nbError?: unknown;
}) {
  return (
    <div className="rounded-lg border bg-white p-4 lg:sticky lg:top-4">
      <div className="mb-3">
        <h2 className="text-sm font-semibold">Filters</h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-medium">As-of date</label>
          <input
            type="date"
            value={props.asOfDate}
            onChange={(e) => props.setAsOfDate(e.target.value)}
            className="w-full rounded border px-2 py-1 text-sm"
          />
        </div>

        <div className="space-y-1">
          <MultiSelectAutocomplete
            options={props.landUseOptions}
            value={props.selectedLandUses}
            onChange={props.setSelectedLandUses}
            label="Land Uses"
            className="w-full"
            placeholder={
              props.luError
                ? "Failed to load"
                : props.luLoading
                  ? "Loading…"
                  : "Search land uses…"
            }
          />
        </div>

        <div className="space-y-1">
          <MultiSelect
            options={props.neighborhoodOptions}
            value={props.selectedNeighborhoods}
            onChange={props.setSelectedNeighborhoods}
            label="Neighborhoods"
            className="w-full"
            placeholder={
              props.nbError
                ? "Failed to load"
                : props.nbLoading
                  ? "Loading…"
                  : "Select neighborhoods…"
            }
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium">Street contains</label>
          <input
            value={props.ilikeStreet}
            onChange={(e) => props.setIlikeStreet(e.target.value)}
            placeholder="KING"
            className="w-full rounded border px-2 py-1 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium">Finished sf ≥</label>
            <input
              type="number"
              value={props.tfaMin}
              onChange={(e) => props.setTfaMin(e.target.value)}
              className="w-full rounded border px-2 py-1 text-sm"
              inputMode="numeric"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium">Finished sf ≤</label>
            <input
              type="number"
              value={props.tfaMax}
              onChange={(e) => props.setTfaMax(e.target.value)}
              className="w-full rounded border px-2 py-1 text-sm"
              inputMode="numeric"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium">Current value ≥</label>
            <input
              type="number"
              value={props.cvMin}
              onChange={(e) => props.setCvMin(e.target.value)}
              className="w-full rounded border px-2 py-1 text-sm"
              inputMode="numeric"
              placeholder="e.g. 100000"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium">Current value ≤</label>
            <input
              type="number"
              value={props.cvMax}
              onChange={(e) => props.setCvMax(e.target.value)}
              className="w-full rounded border px-2 py-1 text-sm"
              inputMode="numeric"
              placeholder="e.g. 500000"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
