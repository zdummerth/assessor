"use client";

import React, { useState } from "react";
import Image from "next/image";
import DeleteParcelImageModal from "./parcel-images/delete-modal";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ImageFile {
  publicURL: string;
  metadata?: { mimetype?: string };
  updated_at?: string;
  image_url: string;
}

interface ImageGalleryProps {
  images: ImageFile[];
  bucket: string;
  path?: string;
}

export default function ImageGallery({
  images,
  bucket,
  path,
}: ImageGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeLightbox = () => setIsOpen(false);

  const showPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((idx) => (idx - 1 + images.length) % images.length);
  };

  const showNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((idx) => (idx + 1) % images.length);
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div>
      {/* Grid of thumbnails */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
        {images.map((image, index) => (
          <div key={image.image_url} className="relative group">
            <div onClick={() => openLightbox(index)} className="cursor-pointer">
              <Image
                src={image.publicURL}
                alt={image.image_url}
                width={360}
                height={360}
                className="object-cover w-full h-32 md:h-64 rounded"
              />
            </div>
            <div className="absolute top-2 right-2 z-10">
              <DeleteParcelImageModal
                bucket={bucket}
                path={path ? `${path}/${image.image_url}` : image.image_url}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Lightbox Carousel */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={closeLightbox}
        >
          <div
            className="max-w-full max-h-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[currentIndex].publicURL}
              alt={images[currentIndex].image_url}
              width={800}
              height={800}
              className="max-h-[90vh] object-contain"
            />
            <div className="fixed bottom-2 left-1/2 transform -translate-x-1/2 flex items-center space-x-8 bg-black bg-opacity-90 p-2 rounded-md">
              <button onClick={showPrev} className="text-white">
                <ChevronLeft size={24} />
              </button>
              <button onClick={closeLightbox} className="text-white">
                <X size={24} />
              </button>
              <button onClick={showNext} className="text-white">
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
