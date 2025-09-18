// app/components/client/ClientParcelValues.tsx
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

export type ParcelValueRow = {
  id: number;
  parcel_id: number;
  year: number;
  category: string | null;
  date_of_assessment: string | null; // timestamptz
  last_changed: string | null; // date
  changed_by: string | null;
  reason_for_change: string | null;

  app_bldg_agriculture: number | null;
  app_bldg_commercial: number | null;
  app_bldg_residential: number | null;
  app_bldg_exempt: number | null;

  app_land_agriculture: number | null;
  app_land_commercial: number | null;
  app_land_residential: number | null;
  app_land_exempt: number | null;

  app_new_const_agriculture: number | null;
  app_new_const_commercial: number | null;
  app_new_const_residential: number | null;
  app_new_const_exempt: number | null;

  bldg_agriculture: number | null;
  bldg_commercial: number | null;
  bldg_residential: number | null;
  bldg_exempt: number | null;

  land_agriculture: number | null;
  land_commercial: number | null;
  land_residential: number | null;
  land_exempt: number | null;

  new_const_agriculture: number | null;
  new_const_commercial: number | null;
  new_const_residential: number | null;
  new_const_exempt: number | null;

  app_total_value: number | null; // generated column
};

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
            aria-label="Open all values"
            title="Show all values"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div>No values found for {currentYear}.</div>
      )}

      <Dialog open={open} onClose={setOpen} className="relative z-50">
        <DialogBackdrop className="fixed inset-0 bg-zinc-800/70 backdrop-blur-sm" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-5xl rounded border bg-background max-h-[90vh] overflow-y-auto p-4">
            <DialogTitle className="text-sm font-semibold">
              All Values — Details
            </DialogTitle>

            <p className="mt-1 text-xs text-muted-foreground">
              Each cell shows <span className="font-medium">Appraised</span>{" "}
              (larger) over <span className="font-medium">Assessed</span>{" "}
              (smaller).
            </p>

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

function ValuePair({
  appraised,
  assessed,
  appClass = "text-sm md:text-base font-semibold",
  assessedClass = "text-[11px] text-muted-foreground",
}: {
  appraised?: number | null;
  assessed?: number | null;
  appClass?: string;
  assessedClass?: string;
}) {
  return (
    <div className="leading-tight">
      <div className={appClass}>{fmtUSD(appraised)}</div>
      <div className={assessedClass}>{fmtUSD(assessed)}</div>
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

  // Assessed category components
  const assessedBldgA = r.bldg_agriculture;
  const assessedBldgC = r.bldg_commercial;
  const assessedBldgR = r.bldg_residential;
  const assessedBldgE = r.bldg_exempt;

  const assessedLandA = r.land_agriculture;
  const assessedLandC = r.land_commercial;
  const assessedLandR = r.land_residential;
  const assessedLandE = r.land_exempt;

  const assessedNewA = r.new_const_agriculture;
  const assessedNewC = r.new_const_commercial;
  const assessedNewR = r.new_const_residential;
  const assessedNewE = r.new_const_exempt;

  const assessedBldg = sum(
    assessedBldgA,
    assessedBldgC,
    assessedBldgR,
    assessedBldgE
  );
  const assessedLand = sum(
    assessedLandA,
    assessedLandC,
    assessedLandR,
    assessedLandE
  );
  const assessedNewConst = sum(
    assessedNewA,
    assessedNewC,
    assessedNewR,
    assessedNewE
  );
  const assessedTotal = sum(assessedBldg, assessedLand, assessedNewConst);

  // Appraised category components
  const appBldgA = r.app_bldg_agriculture;
  const appBldgC = r.app_bldg_commercial;
  const appBldgR = r.app_bldg_residential;
  const appBldgE = r.app_bldg_exempt;

  const appLandA = r.app_land_agriculture;
  const appLandC = r.app_land_commercial;
  const appLandR = r.app_land_residential;
  const appLandE = r.app_land_exempt;

  const appNewA = r.app_new_const_agriculture;
  const appNewC = r.app_new_const_commercial;
  const appNewR = r.app_new_const_residential;
  const appNewE = r.app_new_const_exempt;

  const appTotal = d.appTotal ?? sum(d.appBldg, d.appLand, d.appNewConst);

  return (
    <div className="rounded border">
      {/* Summary header */}
      <div className="p-2">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
          <Info label="Year" value={d.year} />
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

      {/* Combined table with breakouts (Ag, Com, Res, Exempt) */}
      <div className="border-t overflow-auto">
        <table className="min-w-[900px] w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr className="text-left align-bottom">
              <th className="p-2">Type</th>
              <th className="p-2">Agriculture</th>
              <th className="p-2">Commercial</th>
              <th className="p-2">Residential</th>
              <th className="p-2">Exempt</th>
              <th className="p-2">Row Total</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {/* Building */}
            <tr>
              <td className="p-2 font-medium">Building</td>
              <td className="p-2">
                <ValuePair appraised={appBldgA} assessed={assessedBldgA} />
              </td>
              <td className="p-2">
                <ValuePair appraised={appBldgC} assessed={assessedBldgC} />
              </td>
              <td className="p-2">
                <ValuePair appraised={appBldgR} assessed={assessedBldgR} />
              </td>
              <td className="p-2">
                <ValuePair appraised={appBldgE} assessed={assessedBldgE} />
              </td>
              <td className="p-2">
                <ValuePair
                  appraised={d.appBldg}
                  assessed={assessedBldg}
                  appClass="text-base font-semibold"
                />
              </td>
            </tr>

            {/* Land */}
            <tr>
              <td className="p-2 font-medium">Land</td>
              <td className="p-2">
                <ValuePair appraised={appLandA} assessed={assessedLandA} />
              </td>
              <td className="p-2">
                <ValuePair appraised={appLandC} assessed={assessedLandC} />
              </td>
              <td className="p-2">
                <ValuePair appraised={appLandR} assessed={assessedLandR} />
              </td>
              <td className="p-2">
                <ValuePair appraised={appLandE} assessed={assessedLandE} />
              </td>
              <td className="p-2">
                <ValuePair
                  appraised={d.appLand}
                  assessed={assessedLand}
                  appClass="text-base font-semibold"
                />
              </td>
            </tr>

            {/* New Construction */}
            <tr>
              <td className="p-2 font-medium">New Const.</td>
              <td className="p-2">
                <ValuePair appraised={appNewA} assessed={assessedNewA} />
              </td>
              <td className="p-2">
                <ValuePair appraised={appNewC} assessed={assessedNewC} />
              </td>
              <td className="p-2">
                <ValuePair appraised={appNewR} assessed={assessedNewR} />
              </td>
              <td className="p-2">
                <ValuePair appraised={appNewE} assessed={assessedNewE} />
              </td>
              <td className="p-2">
                <ValuePair
                  appraised={d.appNewConst}
                  assessed={assessedNewConst}
                  appClass="text-base font-semibold"
                />
              </td>
            </tr>

            {/* Totals */}
            <tr className="bg-gray-50 dark:bg-gray-800 font-medium">
              <td className="p-2">Total</td>
              <td className="p-2">
                <ValuePair
                  appraised={sum(appBldgA, appLandA, appNewA)}
                  assessed={sum(assessedBldgA, assessedLandA, assessedNewA)}
                />
              </td>
              <td className="p-2">
                <ValuePair
                  appraised={sum(appBldgC, appLandC, appNewC)}
                  assessed={sum(assessedBldgC, assessedLandC, assessedNewC)}
                />
              </td>
              <td className="p-2">
                <ValuePair
                  appraised={sum(appBldgR, appLandR, appNewR)}
                  assessed={sum(assessedBldgR, assessedLandR, assessedNewR)}
                />
              </td>
              <td className="p-2">
                <ValuePair
                  appraised={sum(appBldgE, appLandE, appNewE)}
                  assessed={sum(assessedBldgE, assessedLandE, assessedNewE)}
                />
              </td>
              <td className="p-2">
                <ValuePair
                  appraised={appTotal}
                  assessed={assessedTotal}
                  appClass="text-lg font-semibold"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
