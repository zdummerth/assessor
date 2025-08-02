"use client";

import React from "react";
import { useModal } from "@/components/ui/modal-context";
import Modal from "@/components/ui/modal";
import { History } from "lucide-react";

export default function AddressHistoryModal({ address }: { address: any }) {
  const { currentModalId, openModal, closeModal } = useModal();
  const modalId = `address-details-${address.place_id}`;
  const isOpen = currentModalId === modalId;

  return (
    <div>
      <button
        onClick={() => openModal(modalId)}
        className="hover:text-blue-700"
      >
        <History className="w-4 h-4" />
      </button>

      <Modal open={isOpen} onClose={closeModal} title="Full Address Details">
        <div className="p-2 text-sm text-gray-800 space-y-2 max-h-[70vh] overflow-y-auto">
          {Object.entries(address).map(([key, val]) => {
            if (val === null || val === "" || key == "place_id") return null;

            return (
              <div key={key} className="flex justify-between gap-4">
                <span className="text-gray-600">{key.replace(/_/g, " ")}:</span>
                <span className="text-right max-w-[60%] break-words">
                  {typeof val === "number" ? val.toFixed(6) : String(val)}
                </span>
              </div>
            );
          })}
        </div>
      </Modal>
    </div>
  );
}
