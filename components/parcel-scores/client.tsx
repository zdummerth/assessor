// app/components/ClientScoresLite.tsx
"use client";

import { useMemo, useState } from "react";
import type { FeatureBreakdown, ScoreRow } from "./server";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Info } from "../ui/lib";

function fmtUSD(n?: number | null) {
  if (n == null || Number.isNaN(Number(n))) return "—";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(n));
}

function toSortedBreakdown(
  fb: FeatureBreakdown | null | undefined
): Array<{ term: string; coef: number; x: number; contrib: number }> {
  if (!fb) return [];
  return Object.entries(fb)
    .map(([term, v]) => ({
      term,
      coef: Number(v?.coef ?? 0),
      x: Number(v?.x ?? 0),
      contrib: Number(v?.contrib ?? 0),
    }))
    .filter((r) => r.x !== 0 && Number.isFinite(r.contrib))
    .sort((a, b) => Math.abs(b.contrib) - Math.abs(a.contrib));
}

export default function ClientScoresLite({
  rows,
  className = "",
  title = "Model Estimate",
}: {
  rows: ScoreRow[];
  className?: string;
  title?: string;
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const cards = useMemo(
    () =>
      rows.map((r, idx) => ({
        key: idx,
        y_pred: r.y_pred,
        contribs: toSortedBreakdown(r.feature_breakdown),
        raw: r,
      })),
    [rows]
  );

  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm text-foreground/80">{title}</h3>
        <button
          onClick={() => setOpenIdx(0)}
          className="hover:bg-gray-50 print:hidden"
          aria-label="Open model estimate details"
          title="Open model estimate details"
        >
          <Plus className="inline w-4 h-4 mr-1" />
        </button>
      </div>

      <div
        className={`grid grid-cols-1
        ${cards.length % 2 === 0 ? "md:grid-cols-2" : "md:grid-cols-1"}
        ${cards.length === 3 ? "lg:grid-cols-3" : ""}
        ${cards.length >= 4 ? "lg:grid-cols-4" : ""}
        gap-4`}
      >
        {cards.map((c) => (
          <div key={c.key} className="">
            <div className="flex items-center justify-between">
              <div className="font-semibold">{fmtUSD(c.y_pred)}</div>
            </div>
          </div>
        ))}
      </div>

      {openIdx != null && (
        <DetailsDialog
          y_pred={cards[openIdx].y_pred}
          contribs={cards[openIdx].contribs}
          onClose={() => setOpenIdx(null)}
        />
      )}
    </div>
  );
}

function DetailsDialog({
  y_pred,
  contribs,
  onClose,
}: {
  y_pred: number | null;
  contribs: Array<{ term: string; coef: number; x: number; contrib: number }>;
  onClose: () => void;
}) {
  const count = contribs.length;

  return (
    <Dialog open={true} onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-xl border bg-white p-6">
          <DialogTitle className="text-sm font-semibold text-gray-800">
            Model Estimate — Details
          </DialogTitle>

          <div className="mt-4 space-y-4">
            <div className="rounded border p-3">
              <div className="text-sm text-gray-600">Predicted Price</div>
              <div className="text-2xl font-semibold">{fmtUSD(y_pred)}</div>
            </div>

            <div className="rounded border overflow-auto">
              <div className="p-2 text-sm font-medium">
                Feature breakdown{count ? ` (${count})` : ""}
              </div>
              {!count ? (
                <div className="p-3 text-sm text-gray-500">
                  No contributing features.
                </div>
              ) : (
                <table className="min-w-[720px] w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr className="text-left">
                      <th className="p-2">Feature</th>
                      <th className="p-2">x</th>
                      <th className="p-2">Coef</th>
                      <th className="p-2">Contribution</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {contribs.map((c) => (
                      <tr key={c.term} className="align-top">
                        <td className="p-2 break-all">{c.term}</td>
                        <td className="p-2">
                          {new Intl.NumberFormat().format(c.x)}
                        </td>
                        <td className="p-2">
                          {new Intl.NumberFormat(undefined, {
                            maximumFractionDigits: 6,
                          }).format(c.coef)}
                        </td>
                        <td className="p-2">{fmtUSD(c.contrib)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                className="px-4 py-2 rounded border hover:bg-gray-50"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
