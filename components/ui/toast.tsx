// Toast.tsx
"use client";

import React, { useState, useEffect, Fragment } from "react";
import { Transition } from "@headlessui/react";
import { CheckCircle, XCircle, X } from "lucide-react";

interface ToastProps {
  /** Message to show on success */
  successMessage?: string;
  /** Message to show on error */
  errorMessage?: string;
  /** Duration (ms) to show toast before auto-dismiss */
  timeOpen?: number;
}

const Toast: React.FC<ToastProps> = ({
  successMessage,
  errorMessage,
  timeOpen = 5000,
}) => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => setOpen(false), timeOpen);
    return () => clearTimeout(timer);
  }, [open, timeOpen]);

  const isError = Boolean(errorMessage);
  const message = errorMessage || successMessage || "";

  const bgClass = isError
    ? "bg-red-100 dark:bg-red-900"
    : "bg-green-100 dark:bg-green-900";

  const borderClass = isError
    ? "border-red-300 dark:border-red-700"
    : "border-green-300 dark:border-green-700";

  const icon = isError ? (
    <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
  ) : (
    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
  );

  return (
    <Transition
      as={Fragment}
      show={open}
      enter="transform transition duration-300 ease-out"
      enterFrom="translate-y-2 opacity-0"
      enterTo="translate-y-0 opacity-100"
      leave="transform transition duration-200 ease-in"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div
        className={`max-w-sm w-full ${bgClass} border ${borderClass} rounded-lg shadow-lg p-4 flex items-start gap-3`}
        role="alert"
      >
        {icon}
        <div className="flex-1 text-sm font-medium text-gray-900 dark:text-gray-100">
          {message}
        </div>
        <button
          onClick={() => setOpen(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1 rounded"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </Transition>
  );
};

export default Toast;
