"use client";

import React from "react";
import Modal from "@/components/ui/modal";
import DeleteFile from "./delete";
import { Trash } from "lucide-react";
import { useModal } from "@/components/ui/modal-context";

interface DeleteFileModalProps {
  bucket: string;
  path: string;
}

export default function DeleteParcelImageModal({
  bucket,
  path,
}: DeleteFileModalProps) {
  const { currentModalId, openModal, closeModal } = useModal();
  const modalId = `delete-file-${bucket}-${path}`;
  const isOpen = currentModalId === modalId;

  return (
    <div className="w-full">
      <button
        onClick={() => openModal(modalId)}
        className={`${currentModalId ? "hidden" : ""}`}
        title="Delete Parcel Image"
      >
        <Trash className="w-4 h-4" />
      </button>

      <Modal open={isOpen} onClose={closeModal}>
        <div className="flex flex-col items-center gap-4 p-6">
          <p className="font-semibold">Delete "{path}"?</p>
          <p>This action cannot be undone.</p>
          <div className="flex space-x-4">
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <DeleteFile bucket={bucket} path={path} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
