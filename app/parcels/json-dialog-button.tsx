// app/test/parcel-rollup/json-dialog-button.tsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

function prettyJson(value: unknown) {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export function JsonDialogButton({
  label,
  title,
  value,
}: {
  label: string;
  title: string;
  value: unknown;
}) {
  const isEmpty =
    value == null ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === "object" &&
      !Array.isArray(value) &&
      value &&
      Object.keys(value as Record<string, unknown>).length === 0);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={isEmpty}>
          {label}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[70vh] rounded-md border">
          <pre className="p-4 text-xs leading-relaxed">{prettyJson(value)}</pre>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
