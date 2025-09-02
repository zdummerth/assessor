"use client";

import React from "react";
import AddressHistoryModal from "./history-modal";
import Address from "../ui/address";

export default function ClientParcelAddress({ address }: { address: any }) {
  if (!address) {
    return <p className="text-gray-500">No geocoded address found.</p>;
  }

  return (
    <div className="border rounded p-2 text-sm text-gray-800">
      <div className="flex gap-4 justify-between items-center mb-1">
        <div className="font-semibold">
          <Address
            address={`${address.housenumber} ${address.street}`}
            fullAddress={`${address.housenumber} ${address.street}, ${address.city}, ${address.state} ${address.postcode}`}
          />
        </div>
        <AddressHistoryModal address={address} />
      </div>
      {address.postcode && (
        <div className="text-xs text-gray-500">{address.postcode}</div>
      )}
      {address.district && (
        <div className="text-xs text-gray-500 mt-1">{address.district}</div>
      )}
    </div>
  );
}
