"use client";

import React from "react";
import { Tables } from "@/database-types";
import { useModal } from "@/components/ui/modal-context";
import Modal from "@/components/ui/modal";
import { History } from "lucide-react";
import FormattedDate from "../ui/formatted-date";

type Parcel = Tables<"test_parcels">;

type LandUseRow = {
  id: number;
  parcel_id: number;
  land_use: string;
  effective_date: string | null;
  end_date: string | null;
};

export default function LandUseHistoryModal({
  parcel,
  rows,
}: {
  parcel: Parcel;
  rows: LandUseRow[];
}) {
  const { currentModalId, openModal, closeModal } = useModal();
  const modalId = `land-use-history-${parcel.id}`;
  const isOpen = currentModalId === modalId;

  const sorted = [...rows].sort(
    (a, b) =>
      new Date(b.effective_date || "1970-01-01").getTime() -
      new Date(a.effective_date || "1970-01-01").getTime()
  );

  return (
    <div>
      <button
        onClick={() => openModal(modalId)}
        className="hover:text-blue-700"
      >
        <History className="w-4 h-4" />
      </button>

      <Modal open={isOpen} onClose={closeModal} title="Land Use History">
        <div className="p-2 text-sm text-gray-800 space-y-3">
          {sorted.map((r) => (
            <div key={r.id} className="border-b pb-2">
              <div className="flex justify-between font-medium">
                <span>{r.land_use}</span>
                <span className="text-xs text-gray-600">
                  Parcel #{parcel.id}
                </span>
              </div>
              <div className="text-xs text-gray-700">
                Effective: <FormattedDate date={r.effective_date || ""} /> —{" "}
                {r.end_date ? (
                  <FormattedDate date={r.end_date || ""} />
                ) : (
                  "present"
                )}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
