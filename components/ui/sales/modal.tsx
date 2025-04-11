"use client";
import React, { useState } from "react";
import Modal from "@/components/ui/modal";
import Address from "@/components/ui/address";
import BuildingPermitDetail from "@/components/ui/building-permits/detail";
import SalesDetail from "@/components/ui/sales/detail";
import ParcelNumber from "@/components/ui/parcel-number";

const SaleModal = ({
  sales,
  address,
  parcelNumber,
}: {
  sales: any;
  address: string;
  parcelNumber: string;
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  if (!sales || sales.length === 0) {
    return (
      <div className="w-full">
        <button
          onClick={() => setModalOpen(true)}
          disabled
          className="px-4 py-2 bg-zinc-700 text-white w-full hover:bg-zinc-600 rounded-md"
        >
          No Sales
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
        {sales && (
          <span className="text-gray-200 ml-2">
            {sales.length} Sale{sales.length > 1 ? "s" : ""}
          </span>
        )}
      </button>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        {sales?.length > 0 && (
          <div className="flex flex-col items-center gap-2 w-full h-full">
            <Address address={address} />
            <ParcelNumber parcelNumber={parcelNumber} />
            <p>Sales</p>
            <div className="flex-1 flex flex-col items-center gap-2 overflow-y-auto">
              {sales.map((sale: any, index: number) => {
                return (
                  <SalesDetail key={sale.parcel_number + index} sale={sale} />
                );
              })}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default SaleModal;
