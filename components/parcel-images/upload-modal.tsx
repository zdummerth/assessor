"use client";

import React from "react";
import { useModal } from "@/components/ui/modal-context";
import Modal from "@/components/ui/modal";
import { ImagePlus } from "lucide-react";
import UploadImages from "./upload";

export default function ParcelImageUploadModal({
  parcelId,
}: {
  parcelId: number;
}) {
  const { currentModalId, openModal, closeModal } = useModal();
  const modalId = `upload-images-${parcelId}`;
  const isOpen = currentModalId === modalId;

  return (
    <div>
      <button
        onClick={() => openModal(modalId)}
        className="hover:text-blue-700"
      >
        <ImagePlus className="w-4 h-4" />
      </button>

      <Modal open={isOpen} onClose={closeModal} title="Upload Parcel Images">
        <div className="p-2 text-sm text-gray-800">
          <UploadImages parcel_id={parcelId} />
        </div>
      </Modal>
    </div>
  );
}
