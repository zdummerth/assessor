"use client";

import { useMemo, useState } from "react";
import Modal from "@/components/ui/modal";

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

type SaleCard = {
  key: number | string;
  sale_id: number;
  sale_date: string;
  sale_price: number | null;
  sale_type: string | null;
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
}: {
  cards: SaleCard[];
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const gridClass = useMemo(
    () =>
      `grid grid-cols-1 ${
        cards.length % 2 === 0 ? "md:grid-cols-2" : "md:grid-cols-1"
      } gap-4`,
    [cards.length]
  );

  return (
    <div className={gridClass}>
      {cards.map((c, idx) => (
        <div
          key={c.key}
          className="rounded border overflow-hidden shadow-sm hover:shadow transition-shadow"
        >
          {/* Summary card content */}
          <div className="p-3 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">Sale Date</div>
              <div className="font-medium text-sm">{fmtDate(c.sale_date)}</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">Sale Price</div>
              <div className="font-semibold text-base">
                {fmtUSD(c.sale_price)}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">Sale Type</div>
              <div className="font-medium text-sm">{c.sale_type ?? "—"}</div>
            </div>

            <div className="border-t pt-3 space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500"># Buildings</span>
                <span className="font-medium">{c.summary.building_count}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Finished Area</span>
                <span className="font-medium">
                  {fmtNum(c.summary.finished_area)} ft²
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Unfinished Area</span>
                <span className="font-medium">
                  {fmtNum(c.summary.unfinished_area)} ft²
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Total Area</span>
                <span className="font-semibold">
                  {fmtNum(c.summary.total_area)} ft²
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end border-t">
              <button
                onClick={() => setOpenIdx(idx)}
                className="text-sm px-3 py-1.5 rounded border hover:bg-gray-50"
              >
                Details
              </button>
            </div>
          </div>
        </div>
      ))}

      {openIdx != null && (
        <DetailsModal card={cards[openIdx]} onClose={() => setOpenIdx(null)} />
      )}
    </div>
  );
}

function DetailsModal({
  card,
  onClose,
}: {
  card: SaleCard;
  onClose: () => void;
}) {
  return (
    <Modal
      open={true}
      onClose={onClose}
      title={`Sale #${card.sale_id} — Structures`}
    >
      <div className="space-y-4">
        {/* Sale summary */}
        <div className="rounded border p-3 text-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Info label="Sale Date" value={fmtDate(card.sale_date)} />
            <Info label="Sale Price" value={fmtUSD(card.sale_price)} />
            <Info label="Sale Type" value={card.sale_type ?? "—"} />
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
          <div className="rounded border p-3 text-sm text-gray-500">
            No structures active for this sale date.
          </div>
        ) : (
          card.structures.map((s) => (
            <div key={s.id} className="rounded border">
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

        <div className="pt-2 flex items-center justify-end">
          <button className="px-4 py-2 rounded border" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

function Info({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-gray-500">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
