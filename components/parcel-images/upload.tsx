"use client";
import { uploadImages } from "@/app/actions";
import { useActionState } from "react";
import { useEffect, useState, useRef, ChangeEvent } from "react";

const initialState = { error: "", success: "" };

const UploadImages = ({ parcel_id }: { parcel_id: number }) => {
  const [state, action, pending] = useActionState(uploadImages, initialState);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clear selected files on success
  useEffect(() => {
    if (state.success) setFiles([]);
  }, [state.success]);

  const handleSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  return (
    <form action={action} className="max-w-md w-full space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        name="files"
        multiple
        required
        className="hidden"
        onChange={handleSelect}
      />

      <div className="flex gap-2 w-full">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition"
        >
          {files.length === 0 ? "Browse Images" : `${files.length} Selected`}
        </button>
        <button
          type="submit"
          disabled={pending || files.length === 0}
          className="w-full inline-flex justify-center items-center bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 rounded-lg transition"
        >
          {pending && (
            <svg
              className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
          )}
          {pending ? "Uploading..." : "Upload Images"}
        </button>
      </div>

      {files.length > 0 && (
        <ul className="bg-gray-50 p-2 rounded space-y-1 text-sm text-gray-700">
          {files.map((file) => (
            <li key={file.name + file.size} className="truncate">
              {file.name} &mdash; {(file.size / 1024).toFixed(1)} KB
            </li>
          ))}
        </ul>
      )}

      {/* Inline status messages */}
      {state.error ? (
        <div
          role="alert"
          aria-live="polite"
          className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
        >
          {state.error || "Upload failed."}
        </div>
      ) : state.success ? (
        <div
          role="status"
          aria-live="polite"
          className="rounded border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800"
        >
          {state.success || "Upload complete."}
        </div>
      ) : null}

      <input type="hidden" name="parcel_id" value={parcel_id} />
    </form>
  );
};

export default UploadImages;
