// app/components/ClientSalesWithStructuresCards.tsx
"use client";

import { useMemo } from "react";
import { Plus } from "lucide-react";
import { Info } from "../ui/lib";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

function fmtUSD(n?: number | null) {
  if (n == null) return "—";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}
function fmtDate(s?: string | null) {
  if (!s) return "—";
  const d = new Date(s);
  return isNaN(+d) ? "—" : d.toLocaleDateString();
}
function fmtNum(n: number) {
  return new Intl.NumberFormat().format(n);
}

type StructureDetail = {
  id: number;
  year_built: number | null;
  full_bathrooms: number | null;
  half_bathrooms: number | null;
  condition: string;
  condition_effective_date: string | null;
  sections: Array<{
    id: number;
    type: string;
    finished_area: number;
    unfinished_area: number;
    total_area: number;
  }>;
  totals: {
    finished_area: number;
    unfinished_area: number;
    total_area: number;
  };
  _link_effective_date: string | null;
  _link_end_date: string | null;
};

export type SaleCard = {
  key: number | string;
  sale_id: number;
  sale_date: string;
  sale_price: number | null;
  sale_type: string | null;
  isValid?: boolean | null;
  summary: {
    building_count: number;
    finished_area: number;
    unfinished_area: number;
    total_area: number;
  };
  structures: StructureDetail[];
};

export default function ClientSalesWithStructuresCards({
  cards,
  title,
  className = "",
}: {
  cards: SaleCard[];
  title?: string;
  className?: string;
}) {
  const sorted = useMemo(
    () =>
      [...cards].sort(
        (a, b) =>
          new Date(b.sale_date).getTime() - new Date(a.sale_date).getTime()
      ),
    [cards]
  );

  if (sorted.length === 0) {
    return <div className={className}>No sales found.</div>;
  }

  const mostRecent = sorted[0];

  return (
    <section className={className}>
      {title && <h3 className="font-semibold">{title}</h3>}

      {/* Most recent sale summary */}
      <div className="flex justify-between items-start">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Info
            label="Most Recent Sale Date"
            value={fmtDate(mostRecent.sale_date)}
          />
          <Info
            label="Most Recent Sale Price"
            value={fmtUSD(mostRecent.sale_price)}
          />
          <Info
            label="Is Valid"
            value={<ValidBadge valid={!!mostRecent.isValid} />}
          />
          <Info label="Sale Type" value={mostRecent.sale_type ?? "—"} />
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              title="View all sales"
              aria-label="View all sales"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>

          {/* All sales dialog */}
          <DialogContent className="w-full max-w-5xl">
            <DialogHeader>
              <DialogTitle>All Sales — Full Details</DialogTitle>
            </DialogHeader>

            <div className="mt-3 space-y-6 max-h-[70vh] overflow-y-auto">
              {sorted.map((card) => (
                <SaleDetails key={card.key} card={card} />
              ))}
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}

function SaleDetails({ card }: { card: SaleCard }) {
  return (
    <div className="rounded-lg border">
      {/* Sale summary */}
      <div className="p-3">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-sm">
          <Info label="Sale ID" value={card.sale_id} />
          <Info label="Sale Date" value={fmtDate(card.sale_date)} />
          <Info label="Sale Price" value={fmtUSD(card.sale_price)} />
          <Info label="Sale Type" value={card.sale_type ?? "—"} />
          <Info
            label="Is Valid"
            value={<ValidBadge valid={!!card.isValid} />}
          />
          <Info
            label="# Buildings"
            value={String(card.summary.building_count)}
          />
          <Info
            label="Finished Area"
            value={`${fmtNum(card.summary.finished_area)} ft²`}
          />
          <Info
            label="Unfinished Area"
            value={`${fmtNum(card.summary.unfinished_area)} ft²`}
          />
          <Info
            label="Total Area"
            value={`${fmtNum(card.summary.total_area)} ft²`}
          />
        </div>
      </div>

      {/* Structures list */}
      {card.structures.length === 0 ? (
        <div className="border-t p-3 text-sm text-gray-500">
          No structures active for this sale date.
        </div>
      ) : (
        card.structures.map((s) => (
          <div key={s.id} className="border-t">
            <div className="p-3">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Structure #{s.id}</div>
                <div className="text-xs text-gray-500">
                  Link: {s._link_effective_date ?? "—"} →{" "}
                  {s._link_end_date ?? "open"}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mt-2">
                <Info label="Year Built" value={s.year_built ?? "—"} />
                <Info
                  label="Baths (F/H)"
                  value={`${s.full_bathrooms ?? 0}/${s.half_bathrooms ?? 0}`}
                />
                <Info label="Condition @ Sale" value={s.condition} />
                <Info
                  label="Condition Eff."
                  value={fmtDate(s.condition_effective_date)}
                />
                <Info
                  label="Finished Area"
                  value={`${fmtNum(s.totals.finished_area)} ft²`}
                />
                <Info
                  label="Unfinished Area"
                  value={`${fmtNum(s.totals.unfinished_area)} ft²`}
                />
                <Info
                  label="Total Area"
                  value={`${fmtNum(s.totals.total_area)} ft²`}
                />
              </div>
            </div>

            {/* Sections table */}
            <div className="border-t overflow-auto">
              <table className="min-w-[700px] w-full text-sm">
                <thead className="bg-gray-50">
                  <tr className="text-left">
                    <th className="p-2">Section</th>
                    <th className="p-2">Finished (ft²)</th>
                    <th className="p-2">Unfinished (ft²)</th>
                    <th className="p-2">Total (ft²)</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {s.sections.length === 0 ? (
                    <tr>
                      <td className="p-2 text-gray-500" colSpan={4}>
                        No sections found.
                      </td>
                    </tr>
                  ) : (
                    s.sections.map((sec) => (
                      <tr key={sec.id}>
                        <td className="p-2 font-medium">{sec.type}</td>
                        <td className="p-2">{fmtNum(sec.finished_area)}</td>
                        <td className="p-2">{fmtNum(sec.unfinished_area)}</td>
                        <td className="p-2">{fmtNum(sec.total_area)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function ValidBadge({ valid }: { valid: boolean }) {
  return (
    <span
      className={[
        "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium",
        valid
          ? "bg-green-100 text-green-800 border border-green-200"
          : "bg-red-100 text-red-800 border border-red-200",
      ].join(" ")}
    >
      {valid ? "Valid" : "Invalid"}
    </span>
  );
}
