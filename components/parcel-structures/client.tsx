"use client";

import React from "react";
import { Tables } from "@/database-types";
import StructureHistoryModal from "./history-modal";

type Parcel = Tables<"test_parcels">;

export default function ClientParcelStructures({
  data,
  parcel,
}: {
  data: any[];
  parcel: Parcel;
}) {
  if (!data || data.length === 0) {
    return <p className="text-gray-500">No structure data found.</p>;
  }

  const latest = data[0];

  return (
    <div className="flex flex-col gap-2">
      <div className="border rounded p-4 shadow-sm bg-white flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h3 className="text-sm text-gray-600">
            Year Built – {latest.year_built || "N/A"}
          </h3>
          <StructureHistoryModal parcel={parcel} structures={data} />
        </div>

        <div className="text-sm text-gray-700">
          <span className="font-medium">Material:</span> {latest.material}
        </div>

        <div className="text-sm text-gray-700">
          <span className="font-medium">Beds:</span> {latest.bedrooms}{" "}
          <span className="ml-4 font-medium">Baths:</span>{" "}
          {latest.full_bathrooms} Full, {latest.half_bathrooms} Half
        </div>

        {latest.test_structure_sections?.length > 0 && (
          <div className="text-sm text-gray-700">
            <span className="font-medium">Sections:</span>
            <ul className="list-disc list-inside mt-1">
              {latest.test_structure_sections.map((s: any) => {
                const hasFinished = s.finished_area > 0;
                const hasUnfinished = s.unfinished_area > 0;
                if (!hasFinished && !hasUnfinished) return null;

                return (
                  <li key={s.id}>
                    {s.type}{" "}
                    {hasFinished && (
                      <span> – {s.finished_area} ft² finished</span>
                    )}
                    {hasUnfinished && (
                      <span>
                        {hasFinished ? ", " : " – "}
                        {s.unfinished_area} ft² unfinished
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {latest.test_conditions?.length > 0 && (
          <div className="text-sm text-gray-700">
            <span className="font-medium">Condition:</span>{" "}
            {latest.test_conditions[0].condition}{" "}
            <span className="text-xs text-gray-500 ml-2">
              (as of {latest.test_conditions[0].effective_date})
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
