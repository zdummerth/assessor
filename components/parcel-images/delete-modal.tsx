"use client";

import React from "react";
import { Trash } from "lucide-react";
import DeleteFile from "./delete";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface DeleteFileModalProps {
  bucket: string;
  path: string;
}

export default function DeleteParcelImageModal({
  bucket,
  path,
}: DeleteFileModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          title="Delete Parcel Image"
          aria-label="Delete Parcel Image"
        >
          <Trash className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete this file?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. You’re about to permanently delete:
            <br />
            <code className="text-sm">{path}</code>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-3">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <DeleteFile bucket={bucket} path={path} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
