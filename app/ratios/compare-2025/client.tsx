"use client";

import * as React from "react";

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// charts
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

type AnyRow = Record<string, any>;

type HistBin = {
  binStart: number;
  binEnd: number;
  count: number;
  label: string;
};

/* ---------------- Formatting ---------------- */

function formatRatio(n: number | null | undefined) {
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 2,
  }).format(n as number);
}

/* ---------------- Stats ---------------- */

function quantileSorted(vals: number[], p: number) {
  const n = vals.length;
  if (!n) return NaN;
  const idx = (n - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  const h = idx - lo;
  return (1 - h) * vals[lo] + h * vals[hi];
}

function medianSorted(vals: number[]) {
  return quantileSorted(vals, 0.5);
}

function computeStatsIQR3(values: number[]) {
  const sorted = values
    .filter((v) => Number.isFinite(v) && v > 0)
    .sort((a, b) => a - b);

  const q1 = quantileSorted(sorted, 0.25);
  const q3 = quantileSorted(sorted, 0.75);
  const iqr = q3 - q1;

  const lower = Math.max(0, q1 - 3 * iqr);
  const upper = q3 + 3 * iqr;

  const filtered = sorted.filter((v) => v >= lower && v <= upper);

  return {
    n_total: sorted.length,
    n_kept: filtered.length,
    median: filtered.length ? medianSorted(filtered) : NaN,
    min: filtered.length ? filtered[0] : NaN,
    max: filtered.length ? filtered[filtered.length - 1] : NaN,
    filtered,
  };
}

/* ---------------- Histogram ---------------- */

function toPct(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 0,
  }).format(n);
}

/** Fixed-range histogram across [0.0, 1.3] with fixed binWidth (default 10%) */
function buildHistogram(vals: number[], binWidth: number): HistBin[] {
  const min = 0;
  const max = 1.3;
  const bins = Math.ceil((max - min) / binWidth);

  const hist: HistBin[] = Array.from({ length: bins }, (_, i) => {
    const start = min + i * binWidth;
    const end = i === bins - 1 ? max : start + binWidth;
    return {
      binStart: start,
      binEnd: end,
      count: 0,
      label: `${toPct(start)}–${toPct(end)}`,
    };
  });

  for (const v of vals) {
    if (!Number.isFinite(v) || v < min || v > max) continue;
    const idx = Math.min(Math.floor((v - min) / binWidth), bins - 1);
    hist[idx].count += 1;
  }

  return hist;
}

function chartColorVar(i: number) {
  return `hsl(var(--chart-${(i % 6) + 1}))`;
}

/* ---------------- Component ---------------- */

export default function RatioCompareClient({ rows }: { rows: AnyRow[] }) {
  // ✅ remove the slider: fixed 10% bins
  const binWidth = 0.1;

  const makeComparison = React.useCallback(
    (label: string, subset: AnyRow[]) => {
      const before = subset
        .map((r) => Number(r.before_ratio))
        .filter(Number.isFinite);
      const current = subset
        .map((r) => Number(r.current_ratio))
        .filter(Number.isFinite);

      const beforeStats = computeStatsIQR3(before);
      const currentStats = computeStatsIQR3(current);

      return {
        label,
        before: {
          stats: beforeStats,
          hist: buildHistogram(beforeStats.filtered, binWidth),
        },
        current: {
          stats: currentStats,
          hist: buildHistogram(currentStats.filtered, binWidth),
        },
      };
    },
    [binWidth]
  );

  const normalize = (v: unknown) =>
    String(v ?? "")
      .trim()
      .toLowerCase();

  const comparisons = React.useMemo(
    () => [
      makeComparison("All Sales", rows),
      makeComparison(
        "Southside Review = TRUE",
        rows.filter((r) => r.southside_review === "TRUE")
      ),
      makeComparison(
        "Southside Review = FALSE",
        rows.filter((r) => r.southside_review === "FALSE")
      ),
      makeComparison(
        "Category: Single Family",
        rows.filter((r) => normalize(r.category) === "single family")
      ),
      makeComparison(
        "Category: Multi Family",
        rows.filter((r) => normalize(r.category) === "multi family")
      ),
      makeComparison(
        "Category: Condominium",
        rows.filter((r) => normalize(r.category) === "condominium")
      ),
    ],
    [rows, makeComparison]
  );

  return (
    <div className="space-y-6">
      <style jsx global>{`
        @media print {
          /* Each category = one centered page */
          .print-page {
            display: flex;
            align-items: center; /* vertical centering */
            justify-content: center; /* horizontal centering */

            min-height: calc(100vh - 1.5in);
            break-after: page;
            page-break-after: always;
          }

          /* Don't force a blank page at the end */
          .print-page:last-child {
            break-after: auto;
            page-break-after: auto;
          }

          /* Keep card nicely sized on paper */
          .print-page > * {
            width: 100%;
            max-width: 10in; /* prevents edge-to-edge stretching */
          }

          /* Optional: avoid card splitting */
          .print-page,
          .print-page * {
            break-inside: avoid;
            page-break-inside: avoid;
          }
        }
      `}</style>

      {/* Full-width comparison cards (each prints on its own page) */}
      <div className="space-y-6">
        {comparisons.map((c, i) => (
          <div
            key={c.label}
            className={`print-page ${i === comparisons.length - 1 ? "" : ""}`}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{c.label}</CardTitle>
              </CardHeader>

              <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* BEFORE */}
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="secondary">Before</Badge>
                    <Badge>Median {formatRatio(c.before.stats.median)}</Badge>
                    <Badge variant="outline">
                      Min {formatRatio(c.before.stats.min)}
                    </Badge>
                    <Badge variant="outline">
                      Max {formatRatio(c.before.stats.max)}
                    </Badge>
                  </div>

                  <ChartContainer
                    className="h-[260px]"
                    config={{
                      count: {
                        label: "Before",
                        color: chartColorVar(i),
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={c.before.hist}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="label" tickLine={false} />
                        <YAxis allowDecimals={false} />
                        <ChartTooltip
                          content={<ChartTooltipContent nameKey="count" />}
                        />
                        <Bar dataKey="count" fill="var(--color-count)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>

                {/* CURRENT */}
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="secondary">Current</Badge>
                    <Badge>Median {formatRatio(c.current.stats.median)}</Badge>
                    <Badge variant="outline">
                      Min {formatRatio(c.current.stats.min)}
                    </Badge>
                    <Badge variant="outline">
                      Max {formatRatio(c.current.stats.max)}
                    </Badge>
                  </div>

                  <ChartContainer
                    className="h-[260px]"
                    config={{
                      count: {
                        label: "Current",
                        color: chartColorVar(i + 1),
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={c.current.hist}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="label" tickLine={false} />
                        <YAxis allowDecimals={false} />
                        <ChartTooltip
                          content={<ChartTooltipContent nameKey="count" />}
                        />
                        <Bar dataKey="count" fill="var(--color-count)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
