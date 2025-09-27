"use client";

import React from "react";
import { History } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Address = Record<string, any>;

export default function AddressHistoryModal({ address }: { address: Address }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="hover:text-blue-700"
          title="Full Address Details"
          type="button"
        >
          <History className="w-4 h-4" />
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Full Address Details</DialogTitle>
        </DialogHeader>

        <div className="p-2 text-sm text-gray-800 space-y-2 max-h-[70vh] overflow-y-auto">
          {Object.entries(address).map(([key, val]) => {
            if (val === null || val === "" || key === "place_id") return null;

            const display =
              typeof val === "number" && Number.isFinite(val)
                ? val.toFixed(6)
                : String(val);

            return (
              <div key={key} className="flex justify-between gap-4">
                <span className="text-gray-600">{key.replace(/_/g, " ")}:</span>
                <span className="text-right max-w-[60%] break-words">
                  {display}
                </span>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
