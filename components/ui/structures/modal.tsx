"use client";
import React, { useState } from "react";
import Modal from "@/components/ui/modal";
import Address from "@/components/ui/address";
import StructureDetail from "@/components/ui/structures/detail";

const StructureModal = ({
  structures,
  address,
  parcelNumber,
}: {
  structures: any;
  address: string;
  parcelNumber: string;
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  // summarize the structures data
  const summarizedStructures = structures.reduce(
    (acc: any, structure: any) => {
      acc.total_area += structure.total_area || 0;
      acc.gla += structure.gla || 0;
      return acc;
    },
    { total_area: 0, gla: 0 }
  );

  // Check if structures is empty or undefined
  if (!structures || structures.length === 0) {
    return (
      <div className="w-full">
        <button
          onClick={() => setModalOpen(true)}
          disabled
          className="px-4 py-2 bg-zinc-700 text-white w-full hover:bg-zinc-600 rounded-md"
        >
          No Structures
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
        {`${summarizedStructures?.gla.toLocaleString() || "0"} sqft GLA`}
        {structures && (
          <span className="text-sm text-gray-200 ml-2">
            {structures.length} Structure{structures.length > 1 ? "s" : ""}
          </span>
        )}
      </button>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        {structures?.length > 0 && (
          <div className="flex flex-col items-center gap-2 w-full mt-6">
            <Address address={address} />
            <p className="text-sm mt-2 mb-4">{parcelNumber}</p>
            <p>Structures</p>
            {structures.map((structure: any, index: number) => {
              return (
                <StructureDetail
                  key={structure.parcel_number + index}
                  structure={structure}
                />
              );
            })}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StructureModal;
