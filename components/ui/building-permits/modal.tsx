"use client";
import React, { useState } from "react";
import Modal from "@/components/ui/modal";
import Address from "@/components/ui/address";
import BuildingPermitDetail from "@/components/ui/building-permits/detail";
import ParcelNumber from "@/components/ui/parcel-number";

const PermitModal = ({
  permits,
  address,
  parcelNumber,
}: {
  permits: any;
  address: string;
  parcelNumber: string;
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  if (!permits || permits.length === 0) {
    return (
      <div className="w-full">
        <button
          onClick={() => setModalOpen(true)}
          disabled
          className="px-4 py-2 bg-zinc-700 text-white w-full hover:bg-zinc-600 rounded-md"
        >
          No Building Permits
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <button
        onClick={() => setModalOpen(true)}
        className="px-4 py-2 bg-zinc-700 text-white rounded w-full hover:bg-zinc-600 rounded-md"
      >
        {permits && (
          <span className="text-gray-200 ml-2">
            {permits.length} Building Permit{permits.length > 1 ? "s" : ""}
          </span>
        )}
      </button>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        {permits?.length > 0 && (
          <div className="flex flex-col items-center gap-2 w-full h-full">
            <Address address={address} />
            <ParcelNumber parcelNumber={parcelNumber} />
            <p>Building Permits</p>
            <div className="flex-1 flex flex-col items-center gap-2 overflow-y-auto">
              {permits.map((permit: any, index: number) => {
                return (
                  <BuildingPermitDetail
                    key={permit.parcel_number + index}
                    permit={permit}
                  />
                );
              })}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PermitModal;
