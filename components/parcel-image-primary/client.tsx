// ParcelImageGallery.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import DeleteParcelImageModal from "../parcel-images/delete-modal";
import ParcelImageUploadModal from "@/components/parcel-images/upload-modal";

type ParcelImage = {
  url: string;
  isPrimary: boolean;
  path: string;
};

export default function ParcelImageGallery({
  images,
  parcel_id,
}: {
  images: ParcelImage[];
  parcel_id: number;
}) {
  const [selectedUrl, setSelectedUrl] = useState(
    images.find((img) => img.isPrimary)?.url || images[0].url
  );
  const path = images.find((img) => img.isPrimary)?.path || images[0].path;

  return (
    <div className="w-full space-y-4">
      {/* Main Image */}
      <div className="w-full flex">
        <div className="relative w-full h-64 border rounded-lg overflow-hidden">
          <Image
            src={selectedUrl}
            alt="Primary parcel image"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="flex flex-col gap-2 ml-2">
          <ParcelImageUploadModal parcelId={parcel_id} />
          <DeleteParcelImageModal bucket={"parcel_images"} path={path} />
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex flex-wrap gap-2">
        {images.map((img) => (
          <div
            key={img.url}
            className={`relative w-12 h-12 rounded border cursor-pointer ${
              img.url === selectedUrl ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => setSelectedUrl(img.url)}
          >
            <Image
              src={img.url}
              alt="Parcel thumbnail"
              fill
              className="object-cover rounded"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
