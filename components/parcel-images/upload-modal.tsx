"use client";

import React from "react";
import UploadImages from "./upload";
import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ParcelImageUploadModal({
  parcelId,
}: {
  parcelId: number;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          title="Upload Parcel Images"
          aria-label="Upload Parcel Images"
        >
          <ImagePlus className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Upload Parcel Images</DialogTitle>
        </DialogHeader>
        <div className="p-2 text-sm text-gray-800">
          <UploadImages parcel_id={parcelId} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
