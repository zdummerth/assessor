"use client";

import React from "react";
import TypeHistoryModal from "./history-modal";
import FormattedDate from "../ui/formatted-date";

type TypeValue = {
  type_key: string;
  value: string;
  effective_date: string;
};

function groupByTypeKey(values: TypeValue[]) {
  const groups: Record<string, TypeValue[]> = {};
  for (const val of values) {
    if (!groups[val.type_key]) {
      groups[val.type_key] = [];
    }
    groups[val.type_key].push(val);
  }
  return groups;
}

export default function ClientComponent({
  values,
  parcel_id,
}: {
  values: TypeValue[];
  parcel_id: number;
}) {
  if (!values || values.length === 0) {
    return <p className="text-gray-500">No type values found.</p>;
  }

  const grouped = groupByTypeKey(values);

  return (
    <div className="flex gap-2 flex-wrap">
      {Object.entries(grouped).map(([typeKey, groupValues]) => {
        const mostRecent = groupValues[0]; // already ordered by effective_date DESC
        return (
          <div
            key={typeKey}
            className=" flex gap-4 items-start border rounded p-2 shadow-sm"
          >
            <div>
              <h2 className="text-sm text-gray-600">{typeKey}</h2>
              <p className="text-lg font-semibold">{mostRecent.value}</p>
            </div>
            <TypeHistoryModal
              parcel_id={`${parcel_id}-${typeKey}`}
              values={groupValues}
            />
          </div>
        );
      })}
    </div>
  );
}
