"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";

const GUIDE_YEAR_OPTIONS = [
  {
    value: "2024",
    label: "2024",
  },
  {
    value: "2025",
    label: "2025",
  },
  {
    value: "2026",
    label: "2026",
  },
];

export default function VehicleValuesSearch() {
  const searchParams = useSearchParams();
  const { push, replace } = useRouter();
  const pathname = usePathname();

  // Get current guide year from URL or current year as default
  const guideYear =
    searchParams.get("guide_year") || new Date().getFullYear().toString();

  const vehicleType = searchParams.get("type") || "";

  const vehicleMake = searchParams.get("make") || "";

  const vehicleModel = searchParams.get("model") || "";

  // Update guide year and reset pagination
  const handleParamChange = (urlParam: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(urlParam, value);
    } else {
      params.delete(urlParam);
    }
    params.set("page", "1");
    push(`${pathname}?${params.toString()}`);
  };

  const handleClear = () => {
    push(pathname);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Guide Year</Label>
          <Combobox
            options={GUIDE_YEAR_OPTIONS}
            value={guideYear}
            onChange={(value) => handleParamChange("guide_year", value)}
            placeholder="Select guide year…"
          />
        </div>

        {guideYear && (
          <div className="space-y-2">
            <Label>Type</Label>
            <Combobox
              endpoint="/api/types-by-guide-year"
              params={{ guide_year: guideYear }}
              transformData={(data) => {
                return data.map((g: any) => ({
                  value: g.type,
                  label: g.type,
                }));
              }}
              value={vehicleType}
              onChange={(value) => handleParamChange("type", value)}
              onOptionNotFound={() => {
                const params = new URLSearchParams(searchParams);
                params.delete("type");
                replace(`${pathname}?${params.toString()}`);
              }}
              placeholder="Select vehicle type…"
            />
          </div>
        )}

        {guideYear && vehicleType && (
          <div className="space-y-2">
            <Label>Make</Label>
            <Combobox
              endpoint="/api/makes-by-guide-year-type"
              params={{ guide_year: guideYear, type: vehicleType }}
              transformData={(data) => {
                return data.map((g: any) => ({
                  value: g.make,
                  label: g.make,
                }));
              }}
              value={vehicleMake}
              onChange={(value) => handleParamChange("make", value)}
              onOptionNotFound={() => {
                const params = new URLSearchParams(searchParams);
                params.delete("make");
                params.delete("model");
                replace(`${pathname}?${params.toString()}`);
              }}
              placeholder="Select vehicle make…"
            />
          </div>
        )}

        {guideYear && vehicleType && vehicleMake && (
          <div className="space-y-2">
            <Label>Model</Label>
            <Combobox
              endpoint="/api/models-by-guide-year-type-make"
              params={{
                guide_year: guideYear,
                type: vehicleType,
                make: vehicleMake,
              }}
              transformData={(data) => {
                return data.map((g: any) => ({
                  value: g.model,
                  label: g.model,
                }));
              }}
              value={vehicleModel}
              onChange={(value) => handleParamChange("model", value)}
              onOptionNotFound={() => {
                const params = new URLSearchParams(searchParams);
                params.delete("model");
                replace(`${pathname}?${params.toString()}`);
              }}
              placeholder="Select vehicle model…"
            />
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" onClick={handleClear}>
          Clear
        </Button>
      </div>
    </div>
  );
}
