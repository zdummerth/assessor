"use client";
import React, { useState } from "react";
import Modal from "@/components/ui/modal";
import ParcelNumber from "@/components/ui/parcel-number";
import { DeleteListItem } from "@/components/ui/lists/delete";
import { Trash } from "lucide-react";

const DeleteListItemModal = ({
  list_id,
  parcel_number,
  year,
}: {
  list_id: string;
  parcel_number: string;
  year: string | number;
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="w-full">
      <button
        onClick={() => setModalOpen(true)}
        className="w-8 py-2 bg-red-500 text-white rounded hover:bg-red-700 rounded-md flex justify-center items-center"
      >
        <Trash size={16} />
      </button>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="flex flex-col items-center gap-2 w-full h-full">
          <div className="text-sm mt-2 mb-4">
            <ParcelNumber parcelNumber={parcel_number} />
          </div>
          <p>{year}</p>
          <p>Do you want to delete this parcel from list?</p>
          <div>
            <DeleteListItem
              list_id={list_id}
              parcel={parcel_number}
              year={year.toString()}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DeleteListItemModal;
