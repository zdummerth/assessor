"use client";
import React, { useState } from "react";
import Modal from "@/components/ui/modal";
import Address from "./address";

const FormattedDate = ({
  date,
  className = "",
  showTime,
}: {
  date: string;
  className?: string;
  showTime?: boolean;
}) => {
  const localDate = new Date(date);
  const formattedDate = localDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
  const formattedTime = localDate
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
    })
    .toLowerCase();
  return (
    <p className={className}>
      {formattedDate} {formattedTime && showTime ? formattedTime : ""}
    </p>
  );
};

const BuildingPermitModal = ({
  permits,
  address,
  parcelNumber,
}: {
  permits: any;
  address: string;
  parcelNumber: string;
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  // Check if structures is empty or undefined
  if (!permits || permits.length === 0) {
    return (
      <div className="w-full">
        <button
          onClick={() => setModalOpen(true)}
          disabled
          className="px-4 py-2 bg-zinc-700 text-white rounded w-full hover:bg-zinc-600 rounded-md"
        >
          No Permits
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
        <span className="text-sm text-gray-200 ml-2">
          {permits.length} Permit{permits.length == 1 ? "" : "s"}
        </span>
      </button>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="flex flex-col items-center gap-2 w-full mt-6">
          <Address address={address} />
          <p className="text-sm mt-2 mb-4">{parcelNumber}</p>
          {/* <p>Structures</p> */}
          {permits.map((item: any, index: number) => {
            return (
              <div
                key={index}
                className="flex flex-col gap-2 items-center border border-foreground rounded-lg p-2 w-full"
              >
                <div className="flex justify-around gap-4 items-center w-full">
                  <div className="flex flex-col gap-1">
                    {/* <p className="text-xs">Type</p> */}
                    <p>{item.permit_type}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    {/* <p className="text-xs">Status</p> */}
                    <p>{item.status}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-center">
                  <span className="text-sm">{item.request}</span>
                  <span className="text-sm">Cost</span>
                  <span>${item.cost.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-sm">Issued Date</span>
                  <FormattedDate date={item.issued_date} />
                </div>
                <div>
                  <span className="text-sm">Completion Date</span>
                  <FormattedDate date={item.completion_date} />
                </div>
              </div>
            );
          })}
        </div>
      </Modal>
    </div>
  );
};

export default BuildingPermitModal;
