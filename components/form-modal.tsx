"use client";
import React, { useState, useEffect, use, useActionState } from "react";
import { updateDataCollectionNoteAction } from "@/app/actions";
import { useFormStatus } from "react-dom";
import { Pencil } from "lucide-react";

type ModalFormProps = {
  header: string;
  parcelNumber: string; // Added parcel_number prop
  note?: string; // Optional note prop
  subHeader: string; // Added subHeader prop
};

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="bg-green-500 text-white px-4 py-2 rounded"
      disabled={pending}
    >
      {pending ? "Saving..." : "Save"}
    </button>
  );
};

const ModalForm: React.FC<ModalFormProps> = ({
  header,
  subHeader,
  parcelNumber,
  note = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  //@ts-ignore
  const [state, action] = useActionState(updateDataCollectionNoteAction, false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  console.log("state", state);
  console.log("parcelNumber", parcelNumber);

  useEffect(() => {
    if (state.success) {
      closeModal();
    }
  }, [state]);

  return (
    (<div>
      <button onClick={openModal} className="px-4 py-2 rounded">
        <Pencil size={16} className="text-gray-500" />{" "}
      </button>
      {isOpen && (
        // Overlay container that covers the entire viewport.
        (<div
          className="fixed inset-0 bg-gray-700 bg-opacity-85 flex justify-center items-center"
          onClick={closeModal} // Close when clicking outside the modal content.
        >
          {/* Modal content container */}
          <div
            className="bg-background p-6 rounded shadow-lg sm:w-[90%] md:w-[75%] max-w-lg max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside.
          >
            <h2 className="text-xl mb-4">{header}</h2>
            <h3 className="text-lg mb-4">{subHeader}</h3>

            <form action={action}>
              {/* Example form field */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="note">
                  Field Review Notes
                </label>
                <textarea
                  rows={10}
                  id="note"
                  name="note"
                  className="w-full border rounded px-3 py-2"
                  defaultValue={note} // Set the default value to the note prop
                />
                <input
                  type="hidden"
                  name="parcel_number"
                  value={parcelNumber}
                />
              </div>
              {/* Action buttons */}
              <div className="flex justify-end space-x-2">
                <SubmitButton />
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>)
      )}
    </div>)
  );
};

export default ModalForm;
