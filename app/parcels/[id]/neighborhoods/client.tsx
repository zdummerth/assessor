"use client";

import { useMemo, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Plus } from "lucide-react";
import { Info } from "@/components/ui/lib";
import FormattedDate from "@/components/ui/formatted-date";

export type ParcelNeighborhoodRow = {
  id: number;
  parcel_id: number;
  neighborhood_id: number;
  effective_date: string; // date
  end_date: string | null; // date
  created_at: string | null; // timestamptz
  // nested (via Supabase)
  neighborhoods?: {
    id: number;
    name: string | null;
    neighborhood: number | null;
    set_id: number | null;
    neighborhood_sets?: {
      id: number;
      name: string;
    } | null;
  } | null;
};

function isCurrent(eff: string, end: string | null): boolean {
  // Treat dates as local calendar dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const effD = new Date(eff);
  effD.setHours(0, 0, 0, 0);

  if (effD > today) return false;
  if (!end) return true;

  const endD = new Date(end);
  endD.setHours(0, 0, 0, 0);
  // current if end date is strictly after today
  return endD > today;
}

function getNeighborhoodLabel(n?: {
  name?: string | null;
  neighborhood?: number | null;
}) {
  if (!n) return "—";
  if (n.name && n.name.trim() !== "") return n.name;
  if (n.neighborhood != null) return String(n.neighborhood);
  return "—";
}

export default function ClientParcelNeighborhoods({
  rows,
  className = "",
  title,
}: {
  rows: ParcelNeighborhoodRow[];
  className?: string;
  title?: string;
}) {
  const [open, setOpen] = useState(false);

  // Newest first by effective_date, then created_at
  const sorted = useMemo(() => {
    const toTs = (r: ParcelNeighborhoodRow) => {
      const eff = new Date(r.effective_date).getTime();
      const ca = r.created_at ? new Date(r.created_at).getTime() : 0;
      return [eff, ca] as const;
    };
    return [...(rows ?? [])].sort((a, b) => {
      const [ae, ac] = toTs(a);
      const [be, bc] = toTs(b);
      if (be !== ae) return be - ae;
      return bc - ac;
    });
  }, [rows]);

  const current = useMemo(
    () => sorted.filter((r) => isCurrent(r.effective_date, r.end_date)),
    [sorted]
  );

  return (
    <section className={className}>
      <div className="flex items-start justify-between">
        {title && <h3 className="text-sm font-semibold">{title}</h3>}
      </div>

      {/* Current assignments */}
      <div className="flex justify-between items-start gap-4 border rounded p-2">
        {current.length === 0 ? (
          <div className="mt-2 text-sm text-gray-600">
            No current neighborhood assignments.
          </div>
        ) : (
          <>
            {current.map((r) => {
              const n = r.neighborhoods;
              const setName = n?.neighborhood_sets?.name ?? "—";
              //@ts-expect-error TS2345
              const nName = getNeighborhoodLabel(n);
              return (
                <div key={r.id} className="flex gap-8">
                  <Info label="Neighborhood" value={nName} />
                  <Info label="Set" value={setName} />
                </div>
              );
            })}
          </>
        )}
        <button
          type="button"
          className="hover:bg-gray-500"
          onClick={() => setOpen(true)}
          aria-label="Open neighborhood history"
          title="Show all historical neighborhood links"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* History dialog */}
      <Dialog open={open} onClose={setOpen} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-zinc-800/70 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-4xl rounded border bg-background max-h-[90vh] overflow-y-auto p-4">
            <DialogTitle className="text-sm font-semibold">
              Neighborhood History
            </DialogTitle>

            <div className="mt-3 overflow-auto">
              <table className="min-w-[800px] w-full text-sm">
                <thead className="bg-gray-500">
                  <tr className="text-left">
                    <th className="p-2">Neighborhood</th>
                    <th className="p-2">Set</th>
                    <th className="p-2">Effective</th>
                    <th className="p-2">End</th>
                    <th className="p-2">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {sorted.map((r) => {
                    const n = r.neighborhoods;
                    return (
                      <tr key={r.id}>
                        {/* @ts-expect-error ts */}
                        <td className="p-2">{getNeighborhoodLabel(n)}</td>
                        <td className="p-2">
                          {n?.neighborhood_sets?.name ?? "—"}
                        </td>
                        <td className="p-2">
                          <FormattedDate date={r.effective_date} />
                        </td>
                        <td className="p-2">
                          <FormattedDate date={r.end_date || ""} />
                        </td>
                        <td className="p-2">
                          <FormattedDate date={r.created_at || ""} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded border text-sm hover:bg-gray-500"
              >
                Close
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </section>
  );
}
