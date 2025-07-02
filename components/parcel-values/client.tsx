"use client";

import React from "react";
import { Tables } from "@/database-types";
import ParcelValuesModal from "./history-modal";

type Parcel = Tables<"test_parcels">;
type ParcelValue = Tables<"test_parcel_values">;

export default function ClientParcelValues({
  values,
  parcel,
}: {
  values: ParcelValue[];
  parcel: Parcel;
}) {
  if (!values || values.length === 0) {
    return <p className="text-gray-500">No parcel values found.</p>;
  }

  // Assume values are sorted by tax_year descending in server component
  const latest = values[0];

  const total =
    latest.res_land +
    latest.res_building +
    latest.com_land +
    latest.com_building +
    latest.agr_land +
    latest.agr_building;

  const newConstructionTotal =
    latest.res_new_construction +
    latest.com_new_construction +
    latest.agr_new_construction;

  const resTotal = latest.res_land + latest.res_building;

  const comTotal = latest.com_land + latest.com_building;

  const agrTotal = latest.agr_land + latest.agr_building;

  return (
    <div className="flex flex-col gap-2">
      <div className="border rounded p-3 shadow-sm flex flex-col gap-1">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h3 className="text-sm text-gray-600">
              Tax Year - {latest.tax_year}
            </h3>
            <span>
              <span className="text-xs text-gray-500">{latest.value_type}</span>
            </span>
          </div>
          <ParcelValuesModal parcel={parcel} allValues={values} />
        </div>
        <p className="text-lg font-bold">${total.toLocaleString()}</p>
        {resTotal > 0 && (
          <p className="text-sm text-gray-500">
            Residential: ${resTotal.toLocaleString()}
          </p>
        )}
        {comTotal > 0 && (
          <p className="text-sm text-gray-500">
            Commercial: ${comTotal.toLocaleString()}
          </p>
        )}
        {agrTotal > 0 && (
          <p className="text-sm text-gray-500">
            Agricultural: ${agrTotal.toLocaleString()}
          </p>
        )}
        {newConstructionTotal > 0 && (
          <p className="text-sm text-gray-500">
            New Construction: ${newConstructionTotal.toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}
