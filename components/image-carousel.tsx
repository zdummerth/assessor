// app/components/ImageCarouselDialog.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";

export type CarouselImage = {
  url: string; // image src
  alt?: string;
  caption?: string;
  width?: number; // optional (for preload hints)
  height?: number; // optional (for preload hints)
};

type Props = {
  open: boolean;
  onClose: () => void;
  images: CarouselImage[];
  initialIndex?: number; // default 0
  wrap?: boolean; // loop around; default true
};

export default function ImageCarouselDialog({
  open,
  onClose,
  images,
  initialIndex = 0,
  wrap = true,
}: Props) {
  const count = images.length;
  const safeInitial = Math.min(
    Math.max(initialIndex, 0),
    Math.max(0, count - 1)
  );
  const [idx, setIdx] = useState(safeInitial);

  // keep initialIndex only when opened
  useEffect(() => {
    if (open) setIdx(safeInitial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, safeInitial]);

  const prev = () => {
    if (count === 0) return;
    if (idx > 0) setIdx(idx - 1);
    else if (wrap) setIdx(count - 1);
  };

  const next = () => {
    if (count === 0) return;
    if (idx < count - 1) setIdx(idx + 1);
    else if (wrap) setIdx(0);
  };

  // Keyboard controls
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, idx, count, wrap]);

  // Basic swipe
  const startX = useRef<number | null>(null);
  const deltaX = useRef(0);
  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    deltaX.current = 0;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    deltaX.current = e.touches[0].clientX - startX.current;
  };
  const onTouchEnd = () => {
    const threshold = 50; // px
    if (Math.abs(deltaX.current) > threshold) {
      if (deltaX.current > 0) prev();
      else next();
    }
    startX.current = null;
    deltaX.current = 0;
  };

  const current = images[idx];

  // Preload neighbors (optional, light-weight hint)
  const neighbors = useMemo(() => {
    if (count < 2) return [];
    const left = idx > 0 ? idx - 1 : wrap ? count - 1 : null;
    const right = idx < count - 1 ? idx + 1 : wrap ? 0 : null;
    return [left, right].filter((v) => v != null) as number[];
  }, [idx, count, wrap]);

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/90" />

      <div className="fixed inset-0 flex items-center justify-center">
        <DialogPanel className="relative w-full h-full">
          {/* Top bar */}
          <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-3">
            <div className="text-xs text-white/80 px-2 py-1 rounded bg-white/10">
              {count > 0 ? `${idx + 1} / ${count}` : "0 / 0"}
            </div>
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-full p-2 bg-white/10 hover:bg-white/20 text-white"
              aria-label="Close viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Main image area */}
          <div
            className="absolute inset-0 flex flex-col"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div className="relative flex-1">
              {current ? (
                <div className="absolute inset-0">
                  {/* Next/Image with object-contain full screen */}
                  <Image
                    src={current.url}
                    alt={current.alt || current.caption || ""}
                    fill
                    sizes="100vw"
                    priority
                    className="object-contain select-none"
                    draggable={false}
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/70">
                  No images
                </div>
              )}
            </div>

            {/* Caption */}
            {current?.caption && (
              <div className="px-4 py-3 text-sm text-white/90 bg-gradient-to-t from-black/50 to-transparent">
                {current.caption}
              </div>
            )}
          </div>

          {/* Prev / Next controls */}
          {count > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 inline-flex items-center justify-center rounded-full p-3 bg-white/10 hover:bg-white/20 text-white"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 inline-flex items-center justify-center rounded-full p-3 bg-white/10 hover:bg-white/20 text-white"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </DialogPanel>
      </div>

      {/* Preload neighbors */}
      {neighbors.map((n) => (
        <link
          key={n}
          rel="preload"
          as="image"
          href={images[n].url}
          // type is optional; add if known: images[n].mimeType
        />
      ))}
    </Dialog>
  );
}
