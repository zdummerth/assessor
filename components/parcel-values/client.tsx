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
      <div className="border rounded p-2 text-sm text-gray-800 flex flex-col gap-1">
        <div className="flex gap-4 justify-between items-center gap-4">
          <p className="text-base font-semibold">${total.toLocaleString()}</p>
          <ParcelValuesModal parcel={parcel} allValues={values} />
        </div>
        {resTotal > 0 && (
          <p className="text-gray-500">
            Residential: ${resTotal.toLocaleString()}
          </p>
        )}
        {comTotal > 0 && (
          <p className="text-gray-500">
            Commercial: ${comTotal.toLocaleString()}
          </p>
        )}
        {agrTotal > 0 && (
          <p className="text-gray-500">
            Agricultural: ${agrTotal.toLocaleString()}
          </p>
        )}
        {newConstructionTotal > 0 && (
          <p className="text-gray-500">
            New Construction: ${newConstructionTotal.toLocaleString()}
          </p>
        )}
        <div className="flex items-center gap-4 pt-1">
          <p className="text-gray-600">{latest.tax_year}</p>
          <span className="text-xs text-gray-500">{latest.value_type}</span>
        </div>
      </div>
    </div>
  );
}
