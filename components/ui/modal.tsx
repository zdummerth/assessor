"use client";

import React, { useEffect, ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, title, children }) => {
  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Panel */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-5xl w-full mx-4 transform transition-transform duration-200 ease-out scale-100 animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 overflow-auto max-h-[70vh]">{children}</div>
      </div>
    </div>
  );
};

export default Modal;

/**
 * Tailwind animations (add to your globals.css or tailwind config):
 *
 * @keyframes fade-in-up {
 *   from { opacity: 0; transform: translateY(10px); }
 *   to   { opacity: 1; transform: translateY(0); }
 * }
 * .animate-fade-in-up { animation: fade-in-up 0.2s ease-out; }
 */
