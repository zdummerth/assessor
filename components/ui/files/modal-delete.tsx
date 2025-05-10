"use client";
import React, { useState } from "react";
import Modal from "@/components/ui/modal";
import DeleteFile from "./delete";
import { Trash } from "lucide-react";

const DeleteFileModal = ({
  bucket,
  path,
  fileName,
}: {
  bucket: string;
  path: string;
  fileName: string;
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
          <p>{fileName}</p>
          <p>Are you sure you want to delete this file?</p>
          <p>This action cannot be undone.</p>
          <div>
            <DeleteFile fileName={fileName} bucket={bucket} path={path} />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DeleteFileModal;
