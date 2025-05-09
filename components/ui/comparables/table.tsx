// components/comparables/ComparablesTable.tsx
"use client";
import React, { useState, useMemo } from "react";
import FormattedDate from "@/components/ui/formatted-date";
import Address from "@/components/ui/address";
import ParcelNumber from "@/components/ui/parcel-number";

export interface Comparable {
  id: number;
  parcel_number: string;
  address: string;
  neighborhood: string;
  condition: string;
  gla: number;
  construction_type: string;
  net_selling_price: number;
  date_of_sale: string;
  gower_dist: number;
  touched: string;
}

interface Props {
  data: Comparable[];
}

const ComparablesTable: React.FC<Props> = ({ data }) => {
  // extract unique conditions
  const conditions = useMemo(
    () => Array.from(new Set(data.map((d) => d.condition))),
    [data]
  );
  const [activeCond, setActiveCond] = useState<string>(conditions[0] ?? "");

  // sorting state
  const [sortField, setSortField] = useState<keyof Comparable | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (field: keyof Comparable) => {
    if (sortField === field) {
      setSortAsc((prev) => !prev);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // filtered by condition
  const filtered = useMemo(
    () => data.filter((d) => d.condition === activeCond),
    [data, activeCond]
  );

  // sorted copy
  const sorted = useMemo(() => {
    if (!sortField) return filtered;
    const arr = [...filtered];
    arr.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortAsc ? aVal - bVal : bVal - aVal;
      }
      return sortAsc
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
    return arr;
  }, [filtered, sortField, sortAsc]);

  const headers: {
    key: keyof Comparable;
    label: string;
    align?: "left" | "right";
  }[] = [
    { key: "parcel_number", label: "Parcel #", align: "left" },
    { key: "address", label: "Address", align: "left" },
    { key: "neighborhood", label: "Neighborhood", align: "left" },
    { key: "condition", label: "Condition", align: "left" },
    { key: "gla", label: "GLA", align: "right" },
    { key: "construction_type", label: "Construction", align: "left" },
    { key: "net_selling_price", label: "Sale Price", align: "right" },
    { key: "date_of_sale", label: "Date of Sale", align: "left" },
    { key: "gower_dist", label: "Gower Dist", align: "right" },
    { key: "touched", label: "Touched", align: "right" },
  ];

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex space-x-2 mb-4">
        {conditions.map((cond) => (
          <button
            key={cond}
            onClick={() => setActiveCond(cond)}
            className={`px-3 py-1 rounded ${
              cond === activeCond
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {cond}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {headers.map(({ key, label, align }) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className={`px-4 py-2 text-sm font-medium text-gray-700 cursor-pointer text-${
                    align ?? "left"
                  }`}
                >
                  <div className="flex items-center">
                    {label}
                    {sortField === key && (
                      <span className="ml-1 text-xs">
                        {sortAsc ? "▲" : "▼"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {sorted.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-nowrap text-sm">
                  <ParcelNumber parcelNumber={item.parcel_number} />
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">
                  <Address address={item.address} />
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">
                  {item.neighborhood}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">
                  {item.condition}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                  {item.gla}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">
                  {item.construction_type}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                  ${item.net_selling_price.toLocaleString()}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">
                  <FormattedDate date={item.date_of_sale} />
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                  {item.gower_dist.toFixed(2)}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                  {item.touched}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparablesTable;
