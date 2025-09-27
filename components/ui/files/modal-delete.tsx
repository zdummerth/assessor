"use client";

import React from "react";
import DeleteFile from "./delete";
import { Trash } from "lucide-react";
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

export default function DeleteFileModal({
  bucket,
  path,
}: DeleteFileModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="destructive"
          size="icon"
          className="flex justify-center items-center"
          title="Delete File"
          aria-label="Delete File"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete this file?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. You’re about to permanently delete:
            <br />
            <code className="text-sm break-all">{path}</code>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-3">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          {/* If DeleteFile renders its own destructive button, keep as-is */}
          <DeleteFile bucket={bucket} path={path} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
