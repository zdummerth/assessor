// app/test/field-reviews/ReviewImagesGrid.tsx
"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useActionState } from "react";
import { Trash2 } from "lucide-react";
import { deleteReviewImagesAndStorage } from "./actions";
import ImageCarouselDialog, {
  type CarouselImage,
} from "@/components/image-carousel";

const initialState = { error: "", success: "" };

export type ImageDisplay = {
  id: number;
  url: string;
  caption: string | null;
  width: number;
  height: number;
  sort_order: number | null;
  created_at?: string | null;
  original_name?: string | null;
};

export default function ReviewImagesGrid({
  images,
  revalidatePath,
  title = "Images",
  className = "",
}: {
  images: ImageDisplay[];
  revalidatePath?: string;
  title?: string;
  className?: string;
}) {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [state, action, pending] = useActionState(
    deleteReviewImagesAndStorage,
    initialState
  );

  // Carousel state (internal)
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const sorted = useMemo(() => {
    return [...images].sort((a, b) => {
      const soA = a.sort_order ?? Number.MAX_SAFE_INTEGER;
      const soB = b.sort_order ?? Number.MAX_SAFE_INTEGER;
      if (soA !== soB) return soA - soB;
      const da = a.created_at ? new Date(a.created_at).getTime() : 0;
      const db = b.created_at ? new Date(b.created_at).getTime() : 0;
      return db - da;
    });
  }, [images]);

  // Map to carousel images
  const carouselImages: CarouselImage[] = useMemo(
    () =>
      sorted.map((img) => ({
        url: img.url,
        alt: img.caption || img.original_name || `image-${img.id}`,
        caption: img.caption || img.original_name || undefined,
        width: img.width,
        height: img.height,
      })),
    [sorted]
  );

  // Clear selection after a successful delete
  useEffect(() => {
    if (state.success) setSelected(new Set());
  }, [state.success]);

  const toggle = (id: number) => {
    setSelected((prev) => {
      const copy = new Set(prev);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      return copy;
    });
  };

  const allSelected = selected.size > 0 && selected.size === sorted.length;
  const toggleAll = () =>
    setSelected((prev) =>
      prev.size === sorted.length ? new Set() : new Set(sorted.map((i) => i.id))
    );

  const idsJson = JSON.stringify(Array.from(selected));

  const openViewerAt = (index: number) => {
    setViewerIndex(index);
    setViewerOpen(true);
  };

  return (
    <div className={className}>
      <form action={action}>
        {/* Controls */}
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="text-xs font-semibold text-gray-700">{title}</div>
          <div className="flex items-center gap-2">
            <label className="inline-flex items-center gap-1 text-xs">
              <input
                type="checkbox"
                className="size-4"
                onChange={toggleAll}
                checked={allSelected}
                aria-label={allSelected ? "Clear selection" : "Select all"}
              />
              {allSelected ? "Clear" : "Select all"}
            </label>

            {/* Hidden fields fed to the server action */}
            <input type="hidden" name="ids_json" value={idsJson} />
            {revalidatePath && (
              <input
                type="hidden"
                name="revalidate_path"
                value={revalidatePath}
              />
            )}

            <button
              type="submit"
              className="inline-flex items-center gap-1 px-2 py-1 rounded border text-xs text-red-700 hover:bg-red-50 disabled:opacity-60"
              disabled={pending || selected.size === 0}
              aria-busy={pending}
              title={
                selected.size === 0
                  ? "Select image(s) to delete"
                  : `Delete ${selected.size} selected`
              }
            >
              <Trash2 className="w-3 h-3" />
              {pending ? "Deleting…" : "Delete selected"}
            </button>
          </div>
        </div>

        {/* Grid */}
        {sorted.length === 0 ? (
          <div className="text-sm text-gray-500">No images yet.</div>
        ) : (
          <div className="grid gap-2 grid-cols-2 sm:grid-cols-3">
            {sorted.map((img, i) => {
              const isChecked = selected.has(img.id);
              return (
                <figure
                  key={img.id}
                  className={[
                    "relative rounded border bg-gray-50 overflow-hidden",
                    isChecked ? "ring-2 ring-blue-500" : "",
                  ].join(" ")}
                >
                  {/* Checkbox overlay — don't open viewer when toggled */}
                  <label
                    className="absolute top-1 left-1 z-10 inline-flex items-center gap-1 bg-white/90 rounded px-1 py-0.5"
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      className="size-4"
                      checked={isChecked}
                      onChange={() => toggle(img.id)}
                      aria-label={`Select image ${img.id}`}
                    />
                  </label>

                  {/* Click image to open viewer at this index */}
                  <div
                    role="button"
                    tabIndex={0}
                    className="cursor-zoom-in"
                    onClick={() => openViewerAt(i)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openViewerAt(i);
                      }
                    }}
                  >
                    <Image
                      src={img.url}
                      width={img.width}
                      height={img.height}
                      alt={
                        img.caption || img.original_name || `image-${img.id}`
                      }
                      className="w-full h-auto object-cover"
                    />
                  </div>

                  {(img.caption || img.original_name) && (
                    <figcaption className="px-2 py-1 text-[11px] text-gray-600 truncate">
                      {img.caption || img.original_name}
                    </figcaption>
                  )}
                </figure>
              );
            })}
          </div>
        )}

        {/* Status */}
        {(state.error || state.success) && (
          <div className="mt-2 text-xs">
            {state.error && <span className="text-red-600">{state.error}</span>}
            {state.success && (
              <span className="text-green-700">{state.success}</span>
            )}
          </div>
        )}
      </form>

      {/* Full-screen carousel (internal state) */}
      <ImageCarouselDialog
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
        images={carouselImages}
        initialIndex={viewerIndex}
        wrap
      />
    </div>
  );
}
