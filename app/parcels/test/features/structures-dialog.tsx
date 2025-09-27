"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  parcelId: number | null;
  structures: any[];
};

export default function StructuresDialog({
  open,
  onOpenChange,
  parcelId,
  structures,
}: Props) {
  console.log("StructuresDialog render", { open, parcelId, structures });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Structures for parcel {parcelId ?? "—"}</DialogTitle>
          <DialogDescription>
            Basic details of structures associated with this parcel.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 max-h-[65vh] overflow-auto">
          {Array.isArray(structures) && structures.length ? (
            structures.map((s, i) => (
              <div key={i} className="rounded-lg border p-3 text-sm">
                <div className="grid gap-2 sm:grid-cols-3">
                  <div>
                    <span className="text-muted-foreground">Type:</span>{" "}
                    {String(s?.type ?? "")}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Year built:</span>{" "}
                    {String(s?.year_built ?? "")}
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      Area (finished):
                    </span>{" "}
                    {String(s?.finished_area ?? s?.total_finished_area ?? "")}
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      Area (unfinished):
                    </span>{" "}
                    {String(
                      s?.unfinished_area ?? s?.total_unfinished_area ?? ""
                    )}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Condition:</span>{" "}
                    {String(s?.condition ?? s?.avg_condition ?? "")}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-muted-foreground">
              No structures found.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
