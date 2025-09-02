"use client";

import React from "react";
import { Tables } from "@/database-types";
import StructureHistoryModal from "./history-modal";
// import AddConditionModal from "@/components/structures/add-conditions-modal";
import ConditionsCRUDModal from "../structures/conditions-crud-modal";

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
      {/* <AddConditionModal
        structureId={latest.id}
        // defaultEffectiveDate={defaultConditionDate} // "YYYY-MM-DD"
        revalidatePath={`/test/parcels`} // or current page path
        buttonLabel="Add Condition"
      /> */}
      <ConditionsCRUDModal
        structureId={latest.id}
        conditions={latest.test_conditions}
        revalidatePath={`/test/parcels/${latest.id}`}
      />
      <div className="border rounded p-2 text-sm text-gray-800 flex">
        <div className="flex-1">
          <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-2">
            <InfoItem
              value={latest.test_conditions[0]?.condition || "—"}
              label={
                latest.test_conditions[0]
                  ? `condition as of ${latest.test_conditions[0].effective_date}`
                  : "Condition"
              }
            />
            <InfoItem value={latest.year_built || "N/A"} label="Year Built" />
            <InfoItem value={latest.material || "—"} label="Material" />
            <InfoItem value={latest.bedrooms ?? "—"} label="Bedrooms" />
            <InfoItem
              value={`${latest.full_bathrooms ?? 0}`}
              label="Full Baths"
            />
            <InfoItem
              value={`${latest.half_bathrooms ?? 0}`}
              label="Half Baths"
            />
            {latest.test_structure_sections?.length > 0 && (
              <>
                {latest.test_structure_sections.map((s: any) => {
                  const hasFinished = s.finished_area > 0;
                  const hasUnfinished = s.unfinished_area > 0;
                  if (!hasFinished && !hasUnfinished) return null;

                  const valueParts = [];
                  if (hasFinished)
                    valueParts.push(`${s.finished_area} ft² finished`);
                  if (hasUnfinished)
                    valueParts.push(`${s.unfinished_area} ft² unfinished`);

                  return (
                    <InfoItem
                      key={s.id}
                      value={valueParts.join(", ")}
                      label={s.type}
                    />
                  );
                })}
              </>
            )}
          </div>
        </div>
        <div className="print:hidden">
          <StructureHistoryModal parcel={parcel} structures={data} />
        </div>
      </div>
    </div>
  );
}
