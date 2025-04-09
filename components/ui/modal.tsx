"use client";
import React, { useEffect, ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, title, children }) => {
  // Listen for the Escape key to close the modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      // Disable scrolling on the main page
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable scrolling when modal is closed
      document.body.style.overflow = "";
    }

    // Cleanup: re-enable scrolling if the component unmounts
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Background Overlay */}
      <div
        className="fixed inset-0 bg-black opacity-90"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-background p-6 rounded-lg shadow-lg z-10 max-w-xl w-full h-[90%] m-8">
        {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
        <div className="h-3/4 overflow-y-auto">{children}</div>
        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
