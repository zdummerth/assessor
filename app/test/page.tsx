"use client";
import React, { useRef } from "react";

export default function MyDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openDialog = () => {
    dialogRef.current?.showModal();
  };

  const closeDialog = () => {
    dialogRef.current?.close();
  };

  return (
    <div>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={openDialog}
      >
        Open Dialog
      </button>

      <dialog ref={dialogRef} className="rounded-lg p-4 shadow-lg">
        <h2 className="text-xl font-semibold mb-2">Dialog Title</h2>
        <p className="mb-4">This is a native HTML dialog.</p>
        <button
          className="bg-red-500 text-white px-3 py-1 rounded"
          onClick={closeDialog}
        >
          Close
        </button>
      </dialog>
    </div>
  );
}
