// app/components/ClientScoresLite.tsx
"use client";

import { useMemo } from "react";
import type { FeatureBreakdown, ScoreRow } from "./server";
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
  title,
}: {
  rows: ScoreRow[];
  className?: string;
  title?: string;
}) {
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
      {title && <h3 className="text-sm mb-2 text-foreground/80">{title}</h3>}

      <div
        className={`grid grid-cols-1
        ${cards.length % 2 === 0 ? "md:grid-cols-2" : "md:grid-cols-1"}
        ${cards.length === 3 ? "lg:grid-cols-3" : ""}
        ${cards.length >= 4 ? "lg:grid-cols-4" : ""}
        gap-4`}
      >
        {cards.map((c) => (
          <ScoreCard key={c.key} y_pred={c.y_pred} contribs={c.contribs} />
        ))}
      </div>
    </div>
  );
}

function ScoreCard({
  y_pred,
  contribs,
}: {
  y_pred: number | null;
  contribs: Array<{ term: string; coef: number; x: number; contrib: number }>;
}) {
  return (
    <div className="flex items-start gap-4 border rounded p-2 justify-between">
      <Info label="Predicted Price" value={fmtUSD(y_pred)} />
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="print:hidden"
            aria-label="Open model estimate details"
            title="Open model estimate details"
          >
            <Plus className="inline w-4 h-4" />
          </Button>
        </DialogTrigger>

        <DialogContent className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-sm">
              Model Estimate — Details
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded border p-3">
              <div className="text-sm text-gray-600">Predicted Price</div>
              <div className="text-2xl font-semibold">{fmtUSD(y_pred)}</div>
            </div>

            <div className="rounded border overflow-auto">
              <div className="p-2 text-sm font-medium">
                Feature breakdown
                {contribs.length ? ` (${contribs.length})` : ""}
              </div>

              {!contribs.length ? (
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

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
