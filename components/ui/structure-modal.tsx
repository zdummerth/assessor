"use client";
import React, { useState } from "react";
import Modal from "@/components/ui/modal";
import Address from "./address";

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
                <div
                  key={structure.parcel_number + index}
                  className="grid grid-cols-3 border border-foreground rounded-md p-2 w-full"
                >
                  <div className="justify-self-start">
                    <div className="text-xs">Total Area</div>
                    <div>{structure.total_area.toLocaleString()} sqft</div>
                  </div>
                  <div className="justify-self-center text-center">
                    <div className="text-xs">GLA</div>
                    <div>{structure.gla.toLocaleString()} sqft</div>
                  </div>
                  <div className="justify-self-end text-right">
                    <div className="text-xs">CDU</div>
                    <div>{structure.cdu || "NA"}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StructureModal;
