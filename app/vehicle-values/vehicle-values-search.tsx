"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combobox";

export default function VehicleValuesSearch() {
  const searchParams = useSearchParams();
  const { push } = useRouter();
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Guide Year</Label>
          <Combobox
            endpoint="/api/guide-years"
            transformData={(data) => {
              return data.map((g: any) => ({
                value: g.guide_year,
                label: g.guide_year,
              }));
            }}
            value={guideYear}
            onChange={(value) => handleParamChange("guide_year", value)}
            placeholder="Select guide year…"
          />
        </div>
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
            placeholder="Select vehicle model…"
          />
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <Button type="button" variant="outline" onClick={handleClear}>
          Clear
        </Button>
      </div>
    </div>
  );
}
