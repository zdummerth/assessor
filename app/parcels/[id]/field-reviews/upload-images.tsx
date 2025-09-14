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
  width: number; // original width
  height: number; // original height
  targetWidth: number; // user-selected width to resize to
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
    const dims = await new Promise<{ width: number; height: number }>(
      (resolve, reject) => {
        const img = new Image();
        img.onload = () =>
          resolve({ width: img.naturalWidth, height: img.naturalHeight });
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = url;
      }
    );
    return dims;
  } finally {
    URL.revokeObjectURL(url);
  }
}

// Resize helper: returns a new File downscaled to targetWidth (keeping aspect ratio).
async function resizeImage(
  file: File,
  targetWidth: number,
  mime: string,
  quality = 0.9
): Promise<{ file: File; width: number; height: number }> {
  // Load image
  const bitmap =
    "createImageBitmap" in window
      ? await createImageBitmap(file)
      : // @ts-expect-error TS2345
        await new Promise<Image>((resolve, reject) => {
          const img = new Image();
          const url = URL.createObjectURL(file);
          img.onload = () => {
            URL.revokeObjectURL(url);
            resolve(img);
          };
          img.onerror = (e) => reject(e);
          img.src = url;
        });

  const srcW =
    "width" in bitmap
      ? (bitmap as ImageBitmap).width
      : (bitmap as HTMLImageElement).naturalWidth;
  const srcH =
    "height" in bitmap
      ? (bitmap as ImageBitmap).height
      : (bitmap as HTMLImageElement).naturalHeight;

  const tw = Math.min(targetWidth, srcW);
  const th = Math.round((srcH * tw) / srcW);

  const canvas = document.createElement("canvas");
  canvas.width = tw;
  canvas.height = th;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context not available");

  // Draw with high quality
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap as any, 0, 0, tw, th);

  // Prefer original type when supported for encoding; fall back to image/jpeg.
  const outType =
    mime && ["image/jpeg", "image/png", "image/webp"].includes(mime)
      ? mime
      : "image/jpeg";

  const blob: Blob = await new Promise((resolve) =>
    canvas.toBlob(
      (b) => resolve(b as Blob),
      outType,
      outType === "image/jpeg" || outType === "image/webp" ? quality : undefined
    )
  );

  const nameParts = file.name.split(".");
  const base = nameParts.slice(0, -1).join(".") || file.name;
  const ext =
    outType === "image/png" ? "png" : outType === "image/webp" ? "webp" : "jpg";
  const newFile = new File([blob], `${base}-w${tw}.${ext}`, {
    type: outType,
    lastModified: Date.now(),
  });

  // @ts-ignore
  if ("close" in bitmap) (bitmap as ImageBitmap).close?.();

  return { file: newFile, width: tw, height: th };
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
  const [state, formAction, pending] = useActionState(
    //@ts-expect-error TS2345
    async (prevState, _formData: FormData) => {
      // Build a fresh FormData with your resized files & fields
      const out = new FormData();

      // <-- use your component state (items, maxWidth, etc.) here
      const resized = await Promise.all(
        items.map(async (it) => {
          const targetW = Math.min(
            it.targetWidth,
            Math.min(it.width, maxWidth)
          );
          if (targetW >= it.width) {
            return {
              file: it.file,
              width: it.width,
              height: it.height,
              caption: it.caption,
            };
          }
          const r = await resizeImage(it.file, targetW, it.file.type, 0.9);
          return {
            file: r.file,
            width: r.width,
            height: r.height,
            caption: it.caption,
          };
        })
      );

      for (const r of resized) {
        out.append("files", r.file);
        out.append("captions", r.caption || "");
        out.append("widths", String(r.width));
        out.append("heights", String(r.height));
      }
      out.append("review_id", String(reviewId));
      if (revalidatePath) out.append("revalidate_path", revalidatePath);

      // Call your *server* action here
      return await uploadReviewImages(prevState, out);
    },
    initialState
  );
  const [items, setItems] = useState<PreviewItem[]>([]);
  const [error, setError] = useState<string>("");

  // Global max width (users can tweak)
  const [maxWidth, setMaxWidth] = useState<number>(1600);

  // Auto-close on success
  useEffect(() => {
    if (state.success) clearAndClose();
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
        targetWidth: Math.min(width, maxWidth), // initialize to <= global max
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

  const onTargetWidth = (idx: number, value: number) => {
    setItems((prev) => {
      const copy = [...prev];
      const original = copy[idx];
      const clamped = Math.max(
        50,
        Math.min(value, Math.min(original.width, maxWidth))
      );
      copy[idx] = { ...original, targetWidth: clamped };
      return copy;
    });
  };

  // When global max changes, clamp each item targetWidth
  useEffect(() => {
    setItems((prev) =>
      prev.map((it) => ({
        ...it,
        targetWidth: Math.min(it.targetWidth, Math.min(it.width, maxWidth)),
      }))
    );
  }, [maxWidth]);

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
        className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded border hover:bg-gray-500"
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
        <DialogBackdrop className="fixed inset-0 bg-zinc-900/80 bg-opacity-70 backdrop-blur-sm" />

        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="w-full max-w-5xl max-h-[90vh] overflow-y-auto space-y-4 border bg-background p-4 rounded shadow-lg">
            <DialogTitle className="text-base font-semibold">
              {title}
            </DialogTitle>
            <Description className="text-sm text-gray-600">
              Select and upload images. Optionally set a max width and resize
              images before uploading.
            </Description>

            <form action={formAction} className="space-y-4 text-sm">
              <div className="grid gap-2 sm:grid-cols-2">
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

                <div className="grid gap-2">
                  <label className="font-medium">Max width (px)</label>
                  <input
                    type="number"
                    min={100}
                    step={10}
                    value={maxWidth}
                    onChange={(e) =>
                      setMaxWidth(Math.max(100, Number(e.target.value || 100)))
                    }
                    className="border rounded px-3 py-2"
                  />
                  <p className="text-xs text-gray-500">
                    All images will be clamped to this width (or smaller).
                  </p>
                </div>
              </div>

              {items.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {items.map((it, idx) => {
                    const maxForItem = Math.min(it.width, maxWidth);
                    const percent = Math.round(
                      (it.targetWidth / it.width) * 100
                    );
                    return (
                      <div key={idx} className="rounded border p-2 space-y-2">
                        <div className="aspect-video overflow-hidden rounded">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={it.url}
                            alt={`preview-${idx}`}
                            className="w-full h-full object-cover"
                            style={{ maxWidth: "100%" }}
                          />
                        </div>

                        <div className="text-xs text-gray-600">
                          Original: {it.width}×{it.height}px •{" "}
                          {Math.round(it.file.size / 1024)} KB
                        </div>

                        <div className="grid gap-1">
                          <label className="text-xs text-gray-600">
                            Target width (px)
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="range"
                              min={50}
                              max={maxForItem}
                              step={10}
                              value={it.targetWidth}
                              onChange={(e) =>
                                onTargetWidth(idx, Number(e.target.value))
                              }
                              className="w-full"
                            />
                            <input
                              type="number"
                              min={50}
                              max={maxForItem}
                              step={10}
                              value={it.targetWidth}
                              onChange={(e) =>
                                onTargetWidth(idx, Number(e.target.value))
                              }
                              className="w-28 border rounded px-2 py-1"
                            />
                          </div>
                          <div className="text-xs text-gray-500">
                            ~{percent}% of original (max for this image:{" "}
                            {maxForItem}px)
                          </div>
                        </div>

                        <div className="grid gap-1">
                          <label className="text-xs text-gray-600">
                            Caption
                          </label>
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
                            className="text-xs px-2 py-1 rounded border hover:bg-gray-500"
                            disabled={pending}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
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
