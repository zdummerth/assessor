"use client";

import React from "react";
import { Tables } from "@/database-types";
import { History } from "lucide-react";
import FormattedDate from "../ui/formatted-date";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

type Parcel = Tables<"test_parcels">;

type LandUseRow = {
  id: number;
  parcel_id: number;
  land_use: string;
  effective_date: string | null;
  end_date: string | null;
};

export default function LandUseHistoryModal({
  parcel,
  rows,
}: {
  parcel: Parcel;
  rows: LandUseRow[];
}) {
  const sorted = [...rows].sort(
    (a, b) =>
      new Date(b.effective_date || "1970-01-01").getTime() -
      new Date(a.effective_date || "1970-01-01").getTime()
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          title="Land Use History"
          aria-label="Land Use History"
        >
          <History className="w-4 h-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Land Use History</DialogTitle>
          <DialogDescription>Parcel #{parcel.id}</DialogDescription>
        </DialogHeader>

        <div className="p-2 text-sm text-gray-800 space-y-3 max-h-[70vh] overflow-y-auto">
          {sorted.map((r) => (
            <div key={r.id} className="border-b pb-2">
              <div className="flex justify-between font-medium">
                <span>{r.land_use}</span>
                <span className="text-xs text-gray-600">
                  Parcel #{parcel.id}
                </span>
              </div>
              <div className="text-xs text-gray-700">
                Effective: <FormattedDate date={r.effective_date || ""} /> —{" "}
                {r.end_date ? (
                  <FormattedDate date={r.end_date || ""} />
                ) : (
                  "present"
                )}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
