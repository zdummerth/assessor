"use client";
import React, { useState } from "react";
import Modal from "@/components/ui/modal";
import Address from "./address";
import { ArrowUp, ArrowDown } from "lucide-react";

const AppraisedValueModal = ({
  parcel,
  address,
}: {
  parcel: any;
  address: string;
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="w-full">
      <button
        onClick={() => setModalOpen(true)}
        className="px-4 py-2 bg-zinc-700 text-white rounded w-full hover:bg-zinc-600 rounded-md flex gap-4 justify-center"
      >
        <span>${parcel.working_appraised_total_2025.toLocaleString()}</span>
        <div className="justify-self-end flex gap-1 items-center justify-center text-sm mt-1">
          {parcel.working_percent_change > 0 ? (
            <ArrowUp size={12} className="text-green-500" />
          ) : (
            <ArrowDown size={12} className="text-red-500" />
          )}
          <p>{parcel.working_percent_change.toFixed(2).toLocaleString()}%</p>
        </div>
      </button>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="text-center">
          <Address address={address} />
          <p className="text-sm mt-2 mb-4">{parcel.parcel_number}</p>
          <p className="mt-10 mb-2">Appraised Values</p>
          <div className="flex flex-col gap-2 mb-8">
            <div className="grid grid-cols-3 items-center justify-center gap-8 border border-foreground rounded-md p-2">
              <span className="text-xs justify-self-start">Current</span>
              <span>
                ${parcel.working_appraised_total_2025.toLocaleString()}
              </span>
              <div className="justify-self-end flex gap-1 items-center justify-center text-sm mt-1">
                {parcel.working_percent_change > 0 ? (
                  <ArrowUp size={12} className="text-green-500" />
                ) : (
                  <ArrowDown size={12} className="text-red-500" />
                )}
                <p>
                  {parcel.working_percent_change.toFixed(2).toLocaleString()}%
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 items-center justify-center gap-8 border border-foreground rounded-md p-2">
              <span className="text-xs justify-self-start">2025</span>
              <span>${parcel.appraised_total_2025.toLocaleString()}</span>
              <div className="justify-self-end flex gap-1 items-center justify-center text-sm mt-1">
                {parcel.percent_change > 0 ? (
                  <ArrowUp size={12} className="text-green-500" />
                ) : (
                  <ArrowDown size={12} className="text-red-500" />
                )}
                <p>{parcel.percent_change.toFixed(2).toLocaleString()}%</p>
              </div>
            </div>
            <div className="grid grid-cols-3 items-center justify-between border border-foreground rounded-md p-2">
              <span className="text-xs justify-self-start">2024</span>
              <span>${parcel.appraised_total_2024.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AppraisedValueModal;
