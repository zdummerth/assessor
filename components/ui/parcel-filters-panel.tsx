// components/ui/ParcelsFilterPanel.tsx
import React from "react";
import ParcelFilters from "@/components/ui/filters-parcels";
import { YearSelectFilter, SelectFilter } from "@/components/ui/filter-client";

interface ParcelsFilterPanelProps {
  sortColumnKey?: string;
  sortDirectionKey?: string;
  year?: string;
  classKey?: string;
}

const ParcelsFilterPanel: React.FC<ParcelsFilterPanelProps> = ({
  sortColumnKey = "parcel_number",
  sortDirectionKey = "asc",
  year = new Date().getFullYear().toString(),
  classKey = "all",
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-sm mb-2">Sort by</div>
        <div className="flex gap-2 text-sm">
          <SelectFilter
            values={[
              { value: "parcel_number", label: "Parcel Number" },
              { value: "occupancy", label: "Occupancy" },
            ]}
            defaultValue={sortColumnKey}
            urlParam="sortColumn"
          />
          <div className="w-[120px]">
            <SelectFilter
              values={[
                { value: "asc", label: "Asc" },
                { value: "desc", label: "Desc" },
              ]}
              defaultValue={sortDirectionKey}
              urlParam="sortDirection"
            />
          </div>
        </div>
      </div>

      <div>
        <div className="text-sm my-2">Year</div>
        <YearSelectFilter defaultValue={year} />
      </div>

      <div>
        <div className="text-sm my-2">Property Class</div>
        <SelectFilter
          values={[
            { value: "Residential", label: "Residential" },
            { value: "Commercial", label: "Commercial" },
            { value: "Exempt", label: "Exempt" },
            { value: "all", label: "All" },
          ]}
          defaultValue={classKey}
          urlParam="propertyClass"
        />
      </div>

      <ParcelFilters />
    </div>
  );
};

export default ParcelsFilterPanel;
