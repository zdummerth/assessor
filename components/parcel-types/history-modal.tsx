"use client";

import React from "react";
import { useModal } from "@/components/ui/modal-context";
import Modal from "@/components/ui/modal";
import FormattedDate from "../ui/formatted-date";
import { History } from "lucide-react";

type TypeValue = {
  type_key: string;
  value: string;
  effective_date: string;
};

interface TypeHistoryModalProps {
  parcel_id: string;
  values: TypeValue[];
}

export default function TypeHistoryModal({
  parcel_id,
  values,
}: TypeHistoryModalProps) {
  const { currentModalId, openModal, closeModal } = useModal();
  const modalId = `type-history-${parcel_id}`;
  const isOpen = currentModalId === modalId;

  return (
    <div>
      <button
        onClick={() => openModal(modalId)}
        className="hover:text-blue-700"
      >
        <History className="w-4 h-4" />
      </button>

      <Modal open={isOpen} onClose={closeModal} title="Type History">
        <div className="p-2">
          {values.length === 0 ? (
            <p className="text-sm text-gray-500">No history available.</p>
          ) : (
            <ul className="text-sm text-gray-800 space-y-2">
              {values.map((entry, i) => (
                <li key={i} className="flex justify-between">
                  <span>
                    {entry.type_key}: <strong>{entry.value}</strong>
                  </span>
                  <span>
                    <FormattedDate date={entry.effective_date} month="short" />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Modal>
    </div>
  );
}
