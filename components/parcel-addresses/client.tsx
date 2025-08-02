"use client";

import React from "react";
import AddressHistoryModal from "./history-modal";

export default function ClientParcelAddress({ address }: { address: any }) {
  if (!address) {
    return <p className="text-gray-500">No geocoded address found.</p>;
  }

  return (
    <div className="border rounded p-4 shadow-sm bg-white text-sm text-gray-800">
      <div className="flex justify-between items-center mb-1">
        <div className="font-semibold">
          {address.housenumber} {address.street}
        </div>
        <AddressHistoryModal address={address} />
      </div>
      {address.postcode && (
        <div className="text-xs text-gray-500">{address.postcode}</div>
      )}
    </div>
  );
}
