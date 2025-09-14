// app/components/ParcelLandUsesClient.tsx
"use client";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Plus } from "lucide-react";
import { Info } from "../ui/lib";
import FormattedDate from "../ui/formatted-date";

type AnyLandUse = {
  id?: number | string | null;
  land_use?: string | null;
  effective_date?: string | null;
  end_date?: string | null;
  created_at?: string | null;
  // allow unknown extra fields without TS errors
  [key: string]: any;
};

function fmtDate(s?: string | null) {
  if (!s) return null;
  const d = new Date(s);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ParcelLandUsesClient({
  landUses,
  title = "Land Use History",
  className = "",
}: {
  landUses: AnyLandUse[];
  title?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  // Sort by effective_date desc, then created_at desc
  const sorted = useMemo(() => {
    const getTs = (lu: AnyLandUse) =>
      new Date(lu.effective_date || lu.created_at || 0).getTime();
    return [...(landUses ?? [])].sort((a, b) => getTs(b) - getTs(a));
  }, [landUses]);

  if (!sorted.length) {
    return (
      <div className={className}>
        <div className="text-sm text-gray-600">No land use records found.</div>
      </div>
    );
  }

  const current = sorted[0];
  const currentEff = fmtDate(current.effective_date);
  const currentEnd = fmtDate(current.end_date);

  return (
    <div className={className}>
      {/* Current land use */}
      <Info
        label="Occupancy"
        value={
          <div className="flex items-center gap-4">
            <div>{current.land_use ?? "—"}</div>
            <FormattedDate date={currentEff ?? ""} />
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="hover:bg-gray-50"
              aria-label="View all land uses"
              title="View all land uses"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        }
      />

      {/* Full list dialog */}
      <Dialog open={open} onClose={setOpen} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-2xl rounded-xl border p-6 bg-background">
            <DialogTitle className="text-sm font-semibold text-gray-800">
              {title}
            </DialogTitle>

            <div className="mt-3 max-h-[60vh] overflow-y-auto divide-y">
              {sorted.map((lu, i) => {
                const key =
                  lu.id ??
                  `${lu.land_use ?? "unknown"}-${
                    lu.effective_date ?? lu.created_at ?? i
                  }`;
                const eff = fmtDate(lu.effective_date);
                const end = fmtDate(lu.end_date);
                return (
                  <div key={key} className="py-2">
                    <div className="text-sm font-medium text-gray-800">
                      {lu.land_use ?? "—"}
                    </div>
                    <div className="text-xs text-gray-600">
                      {eff ? `${eff} – ${end ?? "Present"}` : (end ?? "—")}
                    </div>
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
