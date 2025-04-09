"use client";
import React, { useState } from "react";
import Modal from "@/components/ui/modal";
import Address from "./address";
import FormattedDate from "./formatted-date";

const SalesModal = ({
  sales,
  address,
  parcelNumber,
}: {
  sales: any;
  address: string;
  parcelNumber: string;
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  // Check if structures is empty or undefined
  if (!sales || sales.length === 0) {
    return (
      <div className="w-full">
        <button
          onClick={() => setModalOpen(true)}
          disabled
          className="px-4 py-2 bg-zinc-700 text-white rounded w-full hover:bg-zinc-600 rounded-md"
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
        <span className="text-sm text-gray-200 ml-2">
          {sales.length} Sale{sales.length == 1 ? "" : "s"}
        </span>
      </button>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="flex flex-col items-center gap-2 w-full mt-6">
          <Address address={address} />
          <p className="text-sm mt-2 mb-4">{parcelNumber}</p>
          {/* <p>Structures</p> */}
          {sales.map((sale: any) => {
            return (
              <div
                key={sale.document_number + parcelNumber}
                className="border border-foreground rounded-md p-2 w-full"
              >
                <div className="flex justify-between items-center gap-2">
                  {sale.sale_type ? (
                    <span className="text-sm">{sale.sale_type}</span>
                  ) : (
                    <span className="text-sm">Pending Sale Type</span>
                  )}
                  <FormattedDate className="text-sm" date={sale.date_of_sale} />
                </div>
                <span>${sale.net_selling_price?.toLocaleString()}</span>
              </div>
            );
          })}
        </div>
      </Modal>
    </div>
  );
};

export default SalesModal;
