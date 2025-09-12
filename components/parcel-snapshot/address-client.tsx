// app/components/ParcelAddressClient.tsx
"use client";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import Address from "../ui/address";
import { Plus } from "lucide-react";

type AnyAddress = {
  housenumber?: string | number | null;
  street?: string | null;
  city?: string | null;
  state?: string | null;
  postcode?: string | number | null;
  full_address?: string | null; // if you store a prebuilt full string
  // timestamps (any one might exist)
  effective_date?: string | null;
  updated_at?: string | null;
  created_at?: string | null;
  // allow unknown extra fields without TS errors
  [key: string]: any;
};

export default function ParcelAddressClient({
  addresses,
  title = "Addresses",
  className = "",
}: {
  addresses: AnyAddress[];
  title?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  // Sort by the best available date desc
  const sorted = useMemo(() => {
    const getTs = (a: AnyAddress) =>
      new Date(a.effective_date || a.updated_at || a.created_at || 0).getTime();
    return [...(addresses ?? [])].sort((a, b) => getTs(b) - getTs(a));
  }, [addresses]);

  const mostRecent = sorted[0];

  // Normalize into the props your <Address /> expects
  const toProps = (a?: AnyAddress) => {
    if (!a) return { address: "", fullAddress: "" };
    const hn = a.housenumber ?? "";
    const st = a.street ?? "";
    const city = a.city ?? "";
    const state = a.state ?? "";
    const pc = a.postcode ?? "";
    const address = `${hn} ${st}`.trim();
    const fullAddress =
      a.full_address ??
      [address, [city, state].filter(Boolean).join(", "), pc]
        .filter(Boolean)
        .join(", ")
        .replace(/\s+,/g, ","); // tidy accidental spaces
    return { address, fullAddress };
  };

  if (!sorted.length) {
    return (
      <div className={className}>
        <div className="text-sm text-gray-600">No addresses found.</div>
      </div>
    );
  }

  const recentProps = toProps(mostRecent);

  return (
    <div className={className}>
      {/* Most recent address */}
      <div className="flex items-center gap-4">
        <Address
          address={recentProps.address}
          fullAddress={recentProps.fullAddress}
        />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="hover:bg-gray-50"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Full list dialog */}
      <Dialog open={open} onClose={setOpen} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-2xl rounded-xl border p-6 bg-background">
            <DialogTitle className="text-sm font-semibold text-gray-800">
              {title}
            </DialogTitle>

            <div className="mt-3 max-h-[60vh] overflow-y-auto divide-y">
              {sorted.map((addr, i) => {
                const p = toProps(addr);
                const key =
                  addr.id ??
                  `${p.fullAddress}-${addr.effective_date ?? addr.updated_at ?? addr.created_at ?? i}`;
                return (
                  <div key={key} className="py-2">
                    <Address address={p.address} fullAddress={p.fullAddress} />
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded border text-sm hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}
