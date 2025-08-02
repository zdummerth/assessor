"use client";

import React from "react";
import { useModal } from "@/components/ui/modal-context";
import Modal from "@/components/ui/modal";
import { History } from "lucide-react";
import { Tables } from "@/database-types";
import FormattedDate from "../ui/formatted-date";

type Parcel = Tables<"test_parcels">;

export default function StructureHistoryModal({
  parcel,
  structures,
}: {
  parcel: Parcel;
  structures: any[];
}) {
  const { currentModalId, openModal, closeModal } = useModal();
  const modalId = `structure-history-${parcel.id}`;
  const isOpen = currentModalId === modalId;

  return (
    <div>
      <button
        onClick={() => openModal(modalId)}
        className="hover:text-blue-700"
      >
        <History className="w-4 h-4" />
      </button>

      <Modal open={isOpen} onClose={closeModal} title="Structure History">
        <div className="p-2 text-sm text-gray-800 space-y-4">
          {structures.map((s) => (
            <div key={s.id} className="border-b pb-2 space-y-1">
              <div className="flex justify-between font-medium">
                <span>Year Built: {s.year_built || "N/A"}</span>
                <span>Material: {s.material}</span>
              </div>
              <div>
                Beds: {s.bedrooms}, Rooms: {s.rooms}, Full Baths:{" "}
                {s.full_bathrooms}, Half Baths: {s.half_bathrooms}
              </div>

              {s.test_structure_sections?.length > 0 && (
                <div>
                  Sections:
                  <ul className="list-disc list-inside">
                    {s.test_structure_sections.map((sec: any) => (
                      <li key={sec.id}>
                        {sec.type} – {sec.finished_area} ft² finished /{" "}
                        {sec.unfinished_area} ft² unfinished
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {s.test_conditions?.length > 0 && (
                <div className="text-xs text-gray-500">
                  Condition: {s.test_conditions[0].condition} –{" "}
                  <FormattedDate date={s.test_conditions[0].effective_date} />
                </div>
              )}
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
