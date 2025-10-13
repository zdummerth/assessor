"use client";

import * as React from "react";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { DistrictWithRelations, SubdistrictWithRates } from "./server";

import {
  ResponsiveContainer,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const PTYPES = ["res", "com", "agr", "pp"] as const;
type PType = (typeof PTYPES)[number];

type RateRow = NonNullable<SubdistrictWithRates["tax_rate_years"]>[number];

const BAR_COLORS = {
  res: { fill: "#3B82F6", stroke: "#1D4ED8" }, // blue
  com: { fill: "#F59E0B", stroke: "#B45309" }, // orange
  agr: { fill: "#10B981", stroke: "#047857" }, // green
  pp: { fill: "#8B5CF6", stroke: "#6D28D9" }, // purple
};

function fmtRate4(v: number | null | undefined) {
  return Number(v ?? 0).toFixed(4); // no ×100
}
function fmtCap(v: number | null | undefined) {
  return v == null ? "—" : Number(v).toFixed(2);
}
function safeAppliesTo(val: unknown): string[] {
  if (Array.isArray(val)) return val.map((s) => String(s).toLowerCase());
  return [];
}

type Props = {
  districts: DistrictWithRelations[];
};

export default function ByYearClient({ districts }: Props) {
  const years = useMemo(() => {
    const set = new Set<number>();
    for (const d of districts) {
      for (const sd of d.tax_subdistricts ?? []) {
        for (const ry of sd.tax_rate_years ?? []) set.add(ry.tax_year);
      }
    }
    return Array.from(set).sort((a, b) => b - a);
  }, [districts]);

  const ratesForYear = (sd: SubdistrictWithRates, year: number): RateRow[] =>
    (sd.tax_rate_years ?? []).filter((r) => r.tax_year === year);

  return (
    <div className="w-full flex flex-col gap-6">
      {years.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Rate Years Found</CardTitle>
            <CardDescription>
              Add entries to <code>tax_rate_years</code> to see results here.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {years.map((year) => {
        // Overall YEAR totals (across all districts/subdistricts), separated by rate_type
        const yearTotalsPct: Record<PType, number> = {
          res: 0,
          com: 0,
          agr: 0,
          pp: 0,
        };
        const yearTotalsFixed: Record<PType, number> = {
          res: 0,
          com: 0,
          agr: 0,
          pp: 0,
        };

        // Build per-district totals (percentage-only), same as before
        const districtChartData = districts.map((d) => {
          const totalsPct: Record<PType, number> = {
            res: 0,
            com: 0,
            agr: 0,
            pp: 0,
          };

          for (const sd of d.tax_subdistricts ?? []) {
            for (const r of ratesForYear(sd, year)) {
              const applies = safeAppliesTo((r as any).applies_to);
              for (const t of PTYPES) {
                if (applies.includes(t)) {
                  if (r.rate_type === "percentage") {
                    totalsPct[t] += Number(r.rate ?? 0);
                    yearTotalsPct[t] += Number(r.rate ?? 0);
                  } else if (r.rate_type === "fixed") {
                    yearTotalsFixed[t] += Number(r.rate ?? 0);
                  }
                }
              }
            }
          }

          return {
            district: d.code || d.name || `District ${d.id}`,
            ...totalsPct,
          };
        });

        // ---- NEW: Pie data (each slice = district total percentage across all property types)
        const pieData = districtChartData.map((row) => ({
          name: row.district,
          value:
            (row.res ?? 0) + (row.com ?? 0) + (row.agr ?? 0) + (row.pp ?? 0),
        }));

        // simple categorical palette for districts
        const PIE_COLORS = [
          "#3B82F6", // blue
          "#F59E0B", // amber
          "#10B981", // emerald
          "#8B5CF6", // violet
          "#EF4444", // red
          "#06B6D4", // cyan
          "#84CC16", // lime
          "#F97316", // orange
          "#A78BFA", // indigo/violet
          "#22C55E", // green
        ];

        const YearTotalsBadges = () => (
          <div className="flex flex-wrap gap-2">
            {PTYPES.map((t) => {
              const hasPct = yearTotalsPct[t] !== 0;
              const hasFixed = yearTotalsFixed[t] !== 0;
              return (
                <div key={t} className="flex items-center gap-2">
                  <Badge
                    variant={hasPct ? "default" : "secondary"}
                    className="capitalize text-lg"
                  >
                    {t}: {hasPct ? fmtRate4(yearTotalsPct[t]) : "—"}{" "}
                    <span className="ml-1 text-muted-foreground">(%)</span>
                  </Badge>
                  {hasFixed ? (
                    <Badge variant="outline" className="capitalize">
                      {t}: {fmtRate4(yearTotalsFixed[t])}{" "}
                      <span className="ml-1 text-muted-foreground">
                        ($ fixed)
                      </span>
                    </Badge>
                  ) : null}
                </div>
              );
            })}
          </div>
        );

        return (
          <Card key={year} className="overflow-hidden">
            <CardHeader className="space-y-2">
              <div className="flex items-center gap-3">
                <CardTitle className="text-xl">Tax Year {year}</CardTitle>
              </div>

              <div className="pt-1">
                <YearTotalsBadges />
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Dialog to view full details (single flat table of subdistrict rates) */}
              <DetailsDialog
                year={year}
                districts={districts}
                ratesForYear={ratesForYear}
              />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

/** Shadcn Dialog that shows a single flat table of subdistrict rates for the selected year.
 * Columns: District | Subdistrict | Rate | Cap | Applies To
 * - Rounds Rate to 4 digits.
 * - Excludes rows where rate is null/undefined/0.
 */
function DetailsDialog({
  year,
  districts,
  ratesForYear,
}: {
  year: number;
  districts: DistrictWithRelations[];
  ratesForYear: (sd: SubdistrictWithRates, year: number) => RateRow[];
}) {
  // Build a flat list of rows across all districts/subdistricts
  const rows = useMemo(() => {
    const out: {
      district: string;
      subdistrict: string;
      rate: number;
      cap: number | null;
      appliesTo: string[];
    }[] = [];

    for (const d of districts) {
      const districtLabel = d.code || d.name || `District ${d.id}`;
      for (const sd of d.tax_subdistricts ?? []) {
        const subName = sd.name ?? "(Unnamed Subdistrict)";
        const rset = ratesForYear(sd, year);

        for (const r of rset) {
          const rateNum = Number(r.rate ?? 0);
          if (!Number.isFinite(rateNum) || rateNum === 0) continue; // skip zero/nonexistent

          out.push({
            district: districtLabel,
            subdistrict: subName,
            rate: rateNum,
            cap: r.cap == null ? null : Number(r.cap),
            appliesTo: safeAppliesTo((r as any).applies_to),
          });
        }
      }
    }

    out.sort(
      (a, b) =>
        a.district.localeCompare(b.district) ||
        a.subdistrict.localeCompare(b.subdistrict)
    );

    return out;
  }, [districts, ratesForYear, year]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="inline-flex items-center rounded-md border px-3 py-2 text-sm hover:bg-muted transition">
          View details
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Rates for {year}</DialogTitle>
        </DialogHeader>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[18%]">District</TableHead>
                <TableHead className="w-[32%]">Subdistrict</TableHead>
                <TableHead className="w-[15%]">Rate</TableHead>
                <TableHead className="w-[15%]">Cap</TableHead>
                <TableHead>Applies To</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-muted-foreground">
                    No non-zero subdistrict rates recorded for {year}.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row, i) => (
                  <TableRow key={`${row.district}-${row.subdistrict}-${i}`}>
                    <TableCell className="font-medium">
                      {row.district}
                    </TableCell>
                    <TableCell>{row.subdistrict}</TableCell>
                    <TableCell>{fmtRate4(row.rate)}</TableCell>
                    <TableCell>{fmtCap(row.cap)}</TableCell>
                    <TableCell>
                      {row.appliesTo.length ? row.appliesTo.join(", ") : "—"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
