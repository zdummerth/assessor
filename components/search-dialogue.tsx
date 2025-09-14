// app/components/SearchDialog.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Search } from "lucide-react";

import ParcelSearchClient from "@/components/parcel-search-client";
import SalesAddressSearch from "@/components/ui/sales/search-by-address";

export default function SearchDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Trigger button: just a search icon when closed */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="p-2 rounded"
        aria-label="Open search dialog"
      >
        <Search className="w-5 h-5" />
      </button>

      {/* The dialog itself */}
      <Dialog open={open} onClose={setOpen} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-zinc-900/70 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-5xl h-[85vh] overflow-y-auto rounded border bg-background p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <DialogTitle className="text-base font-semibold">
                Parcel & Sales Search
              </DialogTitle>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded border text-sm"
              >
                Close
              </button>
            </div>

            <div className="flex gap-4">
              <ParcelSearchClient />
              <SalesAddressSearch className="flex-1" />
            </div>

            <div className="mt-6 flex justify-end"></div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
