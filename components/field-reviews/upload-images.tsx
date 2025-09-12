// app/test/field-reviews/UploadReviewImagesModal.tsx
"use client";

import { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import { useActionState } from "react";
import { uploadReviewImages } from "./actions";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Description,
} from "@headlessui/react";

const initialState = { error: "", success: "" };

type PreviewItem = {
  file: File;
  url: string;
  caption: string;
  width: number;
  height: number;
};

async function probeImage(
  file: File
): Promise<{ width: number; height: number }> {
  if ("createImageBitmap" in window) {
    const bmp = await createImageBitmap(file);
    const w = bmp.width;
    const h = bmp.height;
    // @ts-ignore
    bmp.close?.();
    return { width: w, height: h };
  }
  const url = URL.createObjectURL(file);
  try {
    const { width, height } = await new Promise<{
      width: number;
      height: number;
    }>((resolve, reject) => {
      const img = new Image();
      img.onload = () =>
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = url;
    });
    return { width, height };
  } finally {
    URL.revokeObjectURL(url);
  }
}

export default function UploadReviewImagesModal({
  reviewId,
  revalidatePath,
  buttonLabel = "Add Images",
  title = "Upload Images",
}: {
  reviewId: number;
  revalidatePath?: string;
  buttonLabel?: string;
  title?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const [state, action, pending] = useActionState(
    uploadReviewImages,
    initialState
  );
  const [items, setItems] = useState<PreviewItem[]>([]);
  const [error, setError] = useState<string>("");

  // Auto-close on success
  useEffect(() => {
    if (state.success) clearAndClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.success]);

  const onFiles = async (fileList: FileList | null) => {
    if (!fileList) return;
    const files = Array.from(fileList);

    const next: PreviewItem[] = [];
    let nonImageFound = false;

    for (const f of files) {
      if (!f.type || !f.type.startsWith("image/")) {
        nonImageFound = true;
        continue;
      }
      const { width, height } = await probeImage(f);
      next.push({
        file: f,
        url: URL.createObjectURL(f),
        caption: "",
        width,
        height,
      });
    }

    setItems((prev) => [...prev, ...next]);
    setError(nonImageFound ? "Skipped non-image file(s)." : "");
  };

  const removeAt = (idx: number) => {
    setItems((prev) => {
      const copy = [...prev];
      const [removed] = copy.splice(idx, 1);
      if (removed) URL.revokeObjectURL(removed.url);
      return copy;
    });
  };

  const onCaption = (idx: number, value: string) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], caption: value };
      return copy;
    });
  };

  const submit = async (formData: FormData) => {
    items.forEach((it) => {
      formData.append("files", it.file);
      formData.append("captions", it.caption || "");
      formData.append("widths", String(it.width));
      formData.append("heights", String(it.height));
    });
    formData.append("review_id", String(reviewId));
    if (revalidatePath) formData.append("revalidate_path", revalidatePath);
    return action(formData);
  };

  const clearAndClose = () => {
    items.forEach((it) => URL.revokeObjectURL(it.url));
    setItems([]);
    setError("");
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded border hover:bg-gray-50"
      >
        <PlusCircle className="w-4 h-4" />
        {buttonLabel}
      </button>

      <Dialog
        open={isOpen}
        onClose={() => {
          if (!pending) clearAndClose();
        }}
        className="relative z-50"
      >
        <DialogBackdrop className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm" />

        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="w-full max-w-2xl space-y-4 border bg-white p-6 md:p-8 rounded-xl shadow-lg">
            <DialogTitle className="text-base font-semibold">
              {title}
            </DialogTitle>
            <Description className="text-sm text-gray-600">
              Select and upload images for this review. You can add captions for
              each image before uploading.
            </Description>

            <form action={submit} className="space-y-4 text-sm">
              <div className="grid gap-2">
                <label className="font-medium">Select Images</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => onFiles(e.currentTarget.files)}
                  className="border rounded px-3 py-2"
                />
                {error && <div className="text-xs text-red-600">{error}</div>}
              </div>

              {items.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {items.map((it, idx) => (
                    <div
                      key={idx}
                      className="rounded border bg-white p-2 space-y-2"
                    >
                      <div className="aspect-video overflow-hidden rounded">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={it.url}
                          alt={`preview-${idx}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-xs text-gray-600">
                        {it.width}×{it.height}px •{" "}
                        {Math.round(it.file.size / 1024)} KB
                      </div>
                      <div className="grid gap-1">
                        <label className="text-xs text-gray-600">Caption</label>
                        <input
                          type="text"
                          value={it.caption}
                          onChange={(e) => onCaption(idx, e.target.value)}
                          className="border rounded px-2 py-1"
                          placeholder="Optional caption"
                        />
                      </div>
                      <div className="text-right">
                        <button
                          type="button"
                          onClick={() => removeAt(idx)}
                          className="text-xs px-2 py-1 rounded border hover:bg-gray-50"
                          disabled={pending}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-2 flex items-center justify-between gap-2">
                <div className="text-xs text-gray-600">
                  {state.error && (
                    <span className="text-red-600">{state.error}</span>
                  )}
                  {state.success && (
                    <span className="text-green-700">{state.success}</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 rounded border"
                    onClick={clearAndClose}
                    disabled={pending}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-green-600 text-white disabled:opacity-60"
                    aria-busy={pending}
                    disabled={pending || items.length === 0}
                  >
                    {pending ? "Uploading…" : "Upload"}
                  </button>
                </div>
              </div>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
