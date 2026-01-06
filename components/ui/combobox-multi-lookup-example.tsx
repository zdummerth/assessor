// Example usage of ComboboxMultiLookup
"use client";

import { useState } from "react";
import { ComboboxMultiLookup } from "./combobox-multi-lookup";

export function ComboboxMultiLookupExample() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [employeeType, setEmployeeType] = useState<string>("appraiser");

  return (
    <div className="space-y-6 p-8 max-w-2xl">
      <h2 className="text-2xl font-bold">Combobox Multi Lookup Examples</h2>

      {/* Basic Example */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Select Employees</label>
        <ComboboxMultiLookup
          endpoint="/api/employees"
          value={selectedIds}
          onChange={setSelectedIds}
          placeholder="Select employees…"
          title="Select Employees"
          description="Choose one or more employees"
          showProgress
        />
      </div>

      {/* With Query Parameters */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Select Appraisers</label>
        <ComboboxMultiLookup
          endpoint="/api/employees"
          params={{ role: "appraiser", status: "active" }}
          value={selectedIds}
          onChange={setSelectedIds}
          placeholder="Select appraisers…"
          title="Select Active Appraisers"
        />
      </div>

      {/* Custom Data Transformation */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Select Parcels</label>
        <ComboboxMultiLookup
          endpoint="/devnet-reviews/api"
          params={{ page_size: 100 }}
          transformData={(data) =>
            data.map((r: any) => ({
              value: r.id,
              label: `${r.due_date} - ${r.kind}`,
            }))
          }
          placeholder="Select parcels…"
          title="Select Parcels"
          searchPlaceholder="Search by parcel number or owner…"
        />
      </div>

      {/* With Custom Keys */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Select Land Uses</label>
        <ComboboxMultiLookup
          endpoint="/api/employees"
          //   valueKey="code"
          //   labelKey="description"
          value={selectedIds}
          onChange={setSelectedIds}
          placeholder="Select land uses…"
          title="Select Land Use Types"
          groupBy={(option) => option.label.charAt(0).toUpperCase()}
        />
      </div>

      {/* With Auto-Refresh */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Select Employees (Auto-refresh)
        </label>
        <ComboboxMultiLookup
          endpoint="/neighborhoods/api"
          params={{ page_size: 300 }}
          value={selectedIds}
          transformData={(data) =>
            data.map((r: any) => ({
              value: r.id,
              label: `${r.name} (${r.neighborhood})`,
            }))
          }
          onChange={setSelectedIds}
          refreshInterval={30000} // Refresh every 30 seconds
          placeholder="Select active reviews…"
          title="Active Reviews"
          description="This list refreshes every 30 seconds"
        />
      </div>

      {/* Dynamic Parameters */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Employee Type Filter</label>
        <select
          value={employeeType}
          onChange={(e) => setEmployeeType(e.target.value)}
          className="w-full rounded-md border px-3 py-2 text-sm"
        >
          <option value="appraiser">Appraisers</option>
          <option value="clerk">Clerks</option>
          <option value="admin">Admins</option>
        </select>

        <label className="text-sm font-medium">Select by Type</label>
        <ComboboxMultiLookup
          endpoint="/api/employees"
          params={{ type: employeeType }}
          value={selectedIds}
          onChange={setSelectedIds}
          placeholder="Select employees…"
          title={`Select ${employeeType}s`}
          // SWR will automatically refetch when params change
        />
      </div>

      {/* Display Selected Values */}
      <div className="p-4 border rounded-md bg-muted/50">
        <h3 className="font-medium mb-2">Selected IDs:</h3>
        <pre className="text-xs">{JSON.stringify(selectedIds, null, 2)}</pre>
      </div>
    </div>
  );
}
