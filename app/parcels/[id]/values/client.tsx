// app/components/client/ClientParcelValues.tsx
"use client";

import { useMemo, useState } from "react";
import type { ParcelValueRow } from "./server";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Plus } from "lucide-react";
import { Info } from "@/components/ui/lib";
import FormattedDate from "@/components/ui/formatted-date";

function fmtUSD(n?: number | null) {
  if (n == null || Number.isNaN(Number(n))) return "—";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(n));
}
function sum(...vals: Array<number | null | undefined>) {
  return vals.reduce((a, b) => (a || 0) + (Number(b) || 0), 0);
}

export default function ClientParcelValues({
  rows,
  className = "",
}: {
  rows: ParcelValueRow[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  const currentYear = new Date().getFullYear();

  const sorted = useMemo(() => {
    const getTs = (r: ParcelValueRow) =>
      new Date(
        r.date_of_assessment || r.last_changed || `${r.year}-01-01`
      ).getTime();
    return [...(rows ?? [])].sort((a, b) => {
      const byYear = b.year - a.year;
      if (byYear !== 0) return byYear;
      return getTs(b) - getTs(a);
    });
  }, [rows]);

  const currentYearRows = useMemo(
    () => sorted.filter((r) => r.year === currentYear),
    [sorted, currentYear]
  );

  const mostRecentThisYear = currentYearRows[0] ?? null;

  // Precompute a compact “appraised” breakdown for each row
  type Derived = {
    id: number;
    year: number;
    appBldg: number;
    appLand: number;
    appNewConst: number;
    appTotal: number | null;
    dateOfAssessment: string | null;
    lastChanged: string | null;
    category: string | null;
    changedBy: string | null;
    reason: string | null;
    raw: ParcelValueRow;
  };

  const derived = useMemo<Derived[]>(
    () =>
      //@ts-expect-error TS2345
      sorted.map((r) => ({
        id: r.id,
        year: r.year,
        appBldg: sum(
          r.app_bldg_agriculture,
          r.app_bldg_commercial,
          r.app_bldg_residential,
          r.app_bldg_exempt
        ),
        appLand: sum(
          r.app_land_agriculture,
          r.app_land_commercial,
          r.app_land_residential,
          r.app_land_exempt
        ),
        appNewConst: sum(
          r.app_new_const_agriculture,
          r.app_new_const_commercial,
          r.app_new_const_residential,
          r.app_new_const_exempt
        ),
        appTotal: r.app_total_value,
        dateOfAssessment: r.date_of_assessment,
        lastChanged: r.last_changed,
        category: r.category,
        changedBy: r.changed_by,
        reason: r.reason_for_change,
        raw: r,
      })),
    [sorted]
  );

  return (
    <div className={className}>
      {/* Inline: most recent value for current year */}
      {mostRecentThisYear ? (
        <div className="flex justify-between items-start">
          <div className="flex-1 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Info label="Year" value={mostRecentThisYear.year} />
            <Info
              label="Appraised Total"
              value={fmtUSD(mostRecentThisYear.app_total_value)}
            />
            <Info
              label="Date of Assessment"
              value={
                <FormattedDate
                  date={mostRecentThisYear.date_of_assessment || ""}
                />
              }
            />
            <Info
              label="Last Changed"
              value={
                <FormattedDate date={mostRecentThisYear.last_changed || ""} />
              }
            />
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="hover:bg-gray-50"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div>No values found for {currentYear}.</div>
      )}

      {/* Dialog: all values + details */}
      <Dialog open={open} onClose={setOpen} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-zinc-800/70 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-5xl rounded border bg-background max-h-[90vh] overflow-y-auto p-4">
            <DialogTitle className="text-sm font-semibold">
              All Values — Details
            </DialogTitle>

            <div className="mt-3 space-y-6">
              {derived.map((row) => (
                <ValueDetails key={row.id} d={row} />
              ))}
            </div>

            <div className="mt-6 flex justify-end">
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

function ValueDetails({
  d,
}: {
  d: {
    id: number;
    year: number;
    appBldg: number;
    appLand: number;
    appNewConst: number;
    appTotal: number | null;
    dateOfAssessment: string | null;
    lastChanged: string | null;
    category: string | null;
    changedBy: string | null;
    reason: string | null;
    raw: ParcelValueRow;
  };
}) {
  const r = d.raw;

  const assessedBldg =
    sum(
      r.bldg_agriculture,
      r.bldg_commercial,
      r.bldg_residential,
      r.bldg_exempt
    ) || 0;
  const assessedLand =
    sum(
      r.land_agriculture,
      r.land_commercial,
      r.land_residential,
      r.land_exempt
    ) || 0;
  const assessedTotal = assessedBldg + assessedLand; // exclude new const if separate; adjust if needed

  return (
    <div className="rounded border">
      {/* Summary header */}
      <div className="p-2">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          <Info label="Year" value={d.year} />
          <Info label="Appraised Building" value={fmtUSD(d.appBldg)} />
          <Info label="Appraised Land" value={fmtUSD(d.appLand)} />
          <Info label="Appraised New Const." value={fmtUSD(d.appNewConst)} />
          <Info label="Appraised Total" value={fmtUSD(d.appTotal)} />
          <Info label="Category" value={d.category ?? "—"} />
          <Info
            label="Assessed Date"
            value={<FormattedDate date={d.dateOfAssessment || ""} />}
          />
          <Info
            label="Last Changed"
            value={<FormattedDate date={d.lastChanged || ""} />}
          />
          <Info label="Changed By" value={d.changedBy ?? "—"} />
          <Info label="Reason" value={d.reason ?? "—"} />
        </div>
      </div>

      {/* Appraised breakdown table */}
      <div className="border-t overflow-auto">
        <table className="min-w-[720px] w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr className="text-left">
              <th className="p-2">Type</th>
              <th className="p-2">Agriculture</th>
              <th className="p-2">Commercial</th>
              <th className="p-2">Residential</th>
              <th className="p-2">Exempt</th>
              <th className="p-2">Row Total</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <Row4
              label="Appraised Building"
              a={r.app_bldg_agriculture}
              c={r.app_bldg_commercial}
              r={r.app_bldg_residential}
              e={r.app_bldg_exempt}
            />
            <Row4
              label="Appraised Land"
              a={r.app_land_agriculture}
              c={r.app_land_commercial}
              r={r.app_land_residential}
              e={r.app_land_exempt}
            />
            <Row4
              label="Appraised New Const."
              a={r.app_new_const_agriculture}
              c={r.app_new_const_commercial}
              r={r.app_new_const_residential}
              e={r.app_new_const_exempt}
            />
            <tr className="bg-gray-50 dark:bg-gray-800 font-medium">
              <td className="p-2">Appraised Total (DB)</td>
              <td className="p-2" colSpan={4}></td>
              <td className="p-2">{fmtUSD(r.app_total_value)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Assessed (non-appraised) breakdown table */}
      <div className="border-t overflow-auto">
        <table className="min-w-[720px] w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr className="text-left">
              <th className="p-2">Type</th>
              <th className="p-2">Agriculture</th>
              <th className="p-2">Commercial</th>
              <th className="p-2">Residential</th>
              <th className="p-2">Exempt</th>
              <th className="p-2">Row Total</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            <Row4
              label="Assessed Building"
              a={r.bldg_agriculture}
              c={r.bldg_commercial}
              r={r.bldg_residential}
              e={r.bldg_exempt}
            />
            <Row4
              label="Assessed Land"
              a={r.land_agriculture}
              c={r.land_commercial}
              r={r.land_residential}
              e={r.land_exempt}
            />
            <Row4
              label="Assessed New Const."
              a={r.new_const_agriculture}
              c={r.new_const_commercial}
              r={r.new_const_residential}
              e={r.new_const_exempt}
            />
            <tr className="bg-gray-50 dark:bg-gray-800 font-medium">
              <td className="p-2">Assessed Total (calc)</td>
              <td className="p-2" colSpan={4}></td>
              <td className="p-2">{fmtUSD(assessedTotal)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Row4({
  label,
  a,
  c,
  r,
  e,
}: {
  label: string;
  a?: number | null;
  c?: number | null;
  r?: number | null;
  e?: number | null;
}) {
  const rowTotal = sum(a, c, r, e);
  return (
    <tr>
      <td className="p-2 font-medium">{label}</td>
      <td className="p-2">{fmtUSD(a)}</td>
      <td className="p-2">{fmtUSD(c)}</td>
      <td className="p-2">{fmtUSD(r)}</td>
      <td className="p-2">{fmtUSD(e)}</td>
      <td className="p-2">{fmtUSD(rowTotal)}</td>
    </tr>
  );
}
