"use client";

import React from "react";
import { Tables } from "@/database-types";
import LandUseHistoryModal from "./history-modal";

type Parcel = Tables<"test_parcels">;

type LandUseRow = {
  id: number;
  parcel_id: number;
  land_use: string;
  effective_date: string | null; // ISO date
  end_date: string | null; // ISO date | null (open-ended)
};

export default function ClientParcelLandUses({
  parcel,
  data,
}: {
  parcel: Parcel;
  data: LandUseRow[];
}) {
  if (!data || data.length === 0) {
    return <p className="text-gray-500">No land use history found.</p>;
  }

  // Current = row with null end_date; else latest effective_date
  const current =
    data.find((r) => r.end_date === null) ||
    [...data].sort(
      (a, b) =>
        new Date(b.effective_date || "1970-01-01").getTime() -
        new Date(a.effective_date || "1970-01-01").getTime()
    )[0];

  const fmtDate = (d?: string | null) =>
    d ? new Date(d).toLocaleDateString() : "—";

  const InfoItem = ({
    value,
    label,
  }: {
    value: React.ReactNode;
    label: string;
  }) => (
    <div>
      <div className="font-semibold">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );

  return (
    <div className="flex flex-col gap-2">
      {/* Summary */}
      <div className="border rounded p-2 text-sm text-gray-800 flex items-start">
        <div className="flex-1">
          <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-2">
            <InfoItem
              value={current?.land_use ?? "—"}
              label="Current Land Use"
            />
            <InfoItem
              value={fmtDate(current?.effective_date)}
              label="Effective Date"
            />
            {/* <InfoItem value={fmtDate(current?.end_date)} label="End Date" /> */}
          </div>
        </div>

        <div className="print:hidden">
          <LandUseHistoryModal parcel={parcel} rows={data} />
        </div>
      </div>
    </div>
  );
}
