"use client";
import React, { useState } from "react";
import Modal from "@/components/ui/modal";
import Address from "@/components/ui/address";
import ParcelNumber from "@/components/ui/parcel-number";
import AppealDetail from "@/components/ui/appeals/detail";

const AppealModal = ({
  appeals,
  address,
  parcelNumber,
}: {
  appeals: any;
  address: string;
  parcelNumber: string;
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  if (!appeals || appeals.length === 0) {
    return (
      <div className="w-full">
        <button
          onClick={() => setModalOpen(true)}
          disabled
          className="px-4 py-2 bg-zinc-700 text-white rounded w-full hover:bg-zinc-600 rounded-md"
        >
          No Appeals
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
        <span className="text-gray-200">
          {appeals.length} Appeal{appeals.length == 1 ? "" : "s"}
        </span>
      </button>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="flex flex-col items-center gap-2 w-full h-full">
          <Address address={address} />
          <p className="text-sm mt-2 mb-4">
            <ParcelNumber parcelNumber={parcelNumber} />
          </p>
          <div className="flex-1 flex flex-col items-center gap-2 overflow-y-auto">
            {appeals.map((appeal: any, index: number) => {
              return (
                <AppealDetail
                  key={appeal.appeal_number + parcelNumber}
                  appeal={appeal}
                />
              );
            })}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AppealModal;
