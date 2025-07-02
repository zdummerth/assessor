"use client";

import React from "react";
import { useModal } from "@/components/ui/modal-context";
import Modal from "@/components/ui/modal";
import FormattedDate from "../ui/formatted-date";
import { History } from "lucide-react";
import { Tables } from "@/database-types";

type Parcel = Tables<"test_parcels">;
type ParcelValue = Tables<"test_parcel_values">;

export default function ParcelValuesModal({
  parcel,
  allValues,
}: {
  parcel: Parcel;
  allValues: ParcelValue[];
}) {
  const { currentModalId, openModal, closeModal } = useModal();
  const modalId = `value-history-${parcel.id}`;
  const isOpen = currentModalId === modalId;

  return (
    <div>
      <button
        onClick={() => openModal(modalId)}
        className="hover:text-blue-700"
      >
        <History className="w-4 h-4" />
      </button>

      <Modal open={isOpen} onClose={closeModal} title={`Parcel Value History`}>
        <div className="p-2 text-sm text-gray-800 space-y-4">
          {allValues.map((value) => {
            const total =
              value.res_land +
              value.res_building +
              value.com_land +
              value.com_building +
              value.agr_land +
              value.agr_building;

            const newConstructionTotal =
              value.res_new_construction +
              value.com_new_construction +
              value.agr_new_construction;

            return (
              <div key={value.id} className="border-b pb-2 space-y-1">
                <div className="flex justify-between font-medium">
                  <span>
                    {value.tax_year} – {value.value_type}
                  </span>
                  <span>${total.toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-2 gap-x-4">
                  {Object.entries(value).map(([key, val]) => {
                    if (
                      key !== "res_land" &&
                      key !== "res_building" &&
                      key !== "com_land" &&
                      key !== "com_building" &&
                      key !== "agr_land" &&
                      key !== "agr_building" &&
                      key !== "res_new_construction" &&
                      key !== "com_new_construction" &&
                      key !== "agr_new_construction"
                    )
                      return null;

                    const valueInteger = parseInt(val as string, 10);
                    if (isNaN(valueInteger)) return null; // Skip non-numeric values
                    if (valueInteger == 0) return null; // Skip zero values

                    return (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-600 capitalize">
                          {key.replace(/_/g, " ")}:
                        </span>
                        <span>${valueInteger.toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="text-xs text-gray-500">
                  Created:{" "}
                  <FormattedDate date={value.created_at || ""} showTime />
                </div>
              </div>
            );
          })}
        </div>
      </Modal>
    </div>
  );
}
