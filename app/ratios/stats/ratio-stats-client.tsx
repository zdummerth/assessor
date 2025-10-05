// app/sales/stats/ratio-stats-client.tsx
"use client";

import * as React from "react";
import type { RatioRow } from "./page";

// shadcn/ui
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// shadcn/ui charts (Recharts)
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

type TrimMode = "none" | "iqr1_5" | "iqr3";
type GroupMode = "none" | "lu" | "nset";
type GroupSort = "name" | "size";

type NSetEntry = {
  set_id: number;
  set_name?: string | null;
  neighborhood_id?: number | null;
  neighborhood_code?: string | number | null;
  neighborhood_name?: string | null;
};

/** Formatters */
function formatRatio(n: number | null | undefined) {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 2,
  }).format(Number(n));
}

/** Quantiles + stats (arrays must be numeric) */
function quantileSorted(sortedVals: number[], p: number): number {
  const n = sortedVals.length;
  if (n === 0) return NaN;
  if (p <= 0) return sortedVals[0];
  if (p >= 1) return sortedVals[n - 1];
  const idx = (n - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  const h = idx - lo;
  return (1 - h) * sortedVals[lo] + h * sortedVals[hi];
}
function medianSorted(sortedVals: number[]): number {
  return quantileSorted(sortedVals, 0.5);
}
function mean(vals: number[]): number {
  if (vals.length === 0) return NaN;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function computeStats(allRatios: number[], mode: TrimMode) {
  const sorted = [...allRatios].sort((a, b) => a - b);
  const q1 = quantileSorted(sorted, 0.25);
  const q3 = quantileSorted(sorted, 0.75);
  const iqr = q3 - q1;

  let lower = -Infinity;
  let upper = +Infinity;
  if (mode === "iqr1_5") {
    lower = q1 - 1.5 * iqr;
    upper = q3 + 1.5 * iqr;
  } else if (mode === "iqr3") {
    lower = q1 - 3 * iqr;
    upper = q3 + 3 * iqr;
  }

  const filtered = sorted.filter((v) => v >= lower && v <= upper);

  return {
    n_total: sorted.length,
    n_kept: filtered.length,
    n_dropped: sorted.length - filtered.length,
    q1,
    q3,
    iqr,
    bounds:
      mode === "none"
        ? null
        : {
            lower,
            upper,
          },
    min: filtered.length ? filtered[0] : NaN,
    max: filtered.length ? filtered[filtered.length - 1] : NaN,
    median: filtered.length ? medianSorted(filtered) : NaN,
    mean: filtered.length ? mean(filtered) : NaN,
    filtered,
  };
}

type HistBin = {
  binStart: number; // inclusive
  binEnd: number; // exclusive (last bin inclusive)
  count: number;
  label: string; // for axis ticks
};

function toPct(n: number, digits = 0) {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: digits,
  }).format(n);
}

/** Fixed-range histogram across [0.0, 1.3] with given binWidth (e.g. 0.10 = 10%) */
function buildHistogramFixedRange(vals: number[], binWidth: number): HistBin[] {
  const min = 0.0;
  const max = 1.3;
  const width = Math.max(0.001, binWidth); // guard
  const binCount = Math.max(1, Math.ceil((max - min) / width));

  const bins: HistBin[] = Array.from({ length: binCount }, (_, i) => {
    const start = min + i * width;
    let end = start + width;
    if (i === binCount - 1) end = max; // clamp final bin to max
    const startPct = toPct(start, 0);
    const endPct = toPct(end, 0);
    return {
      binStart: start,
      binEnd: end,
      count: 0,
      label: `${startPct}–${endPct}`,
    };
  });

  vals.forEach((v) => {
    if (!Number.isFinite(v)) return;
    if (v < min || v > max) return; // drop values outside fixed range
    let idx = Math.floor((v - min) / width);
    if (idx >= binCount) idx = binCount - 1; // include exact max in last bin
    bins[idx].count += 1;
  });

  return bins;
}

/** Make a user-friendly label for a neighborhood entry */
function labelFromNEntry(e?: NSetEntry) {
  if (!e) return "(Unknown)";
  if (e.neighborhood_name && String(e.neighborhood_name).trim().length > 0) {
    return String(e.neighborhood_name);
  }
  if (e.neighborhood_code !== null && e.neighborhood_code !== undefined) {
    return String(e.neighborhood_code);
  }
  if (e.neighborhood_id !== null && e.neighborhood_id !== undefined) {
    return String(e.neighborhood_id);
  }
  return "(Unknown)";
}

/** Round-robin chart color per group */
function chartColorVar(i: number) {
  const idx = (i % 6) + 1; // --chart-1 .. --chart-6
  return `hsl(var(--chart-${idx}))`;
}

/* ---------- tiny stat tile ---------- */
function StatTile({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-lg border bg-card/50 p-3">
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div
        className={`mt-1 text-sm font-semibold ${
          highlight ? "text-primary" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}

export default function RatioStatsClient({ rows }: { rows: RatioRow[] }) {
  // Default trim: 1.5×IQR
  const [mode, setMode] = React.useState<TrimMode>("iqr1_5");
  // Slider controls BIN WIDTH in percent; default 10%
  const [binPct, setBinPct] = React.useState<number>(10);
  const binWidth = Math.max(0.001, (binPct ?? 10) / 100); // 0.10 = 10%

  const [groupMode, setGroupMode] = React.useState<GroupMode>("none");
  const [groupSort, setGroupSort] = React.useState<GroupSort>("size");

  // Neighborhood set selection (used when groupMode === "nset")
  const allSets = React.useMemo(() => {
    // collect unique {set_id, set_name}
    const map = new Map<number, string>();
    for (const r of rows) {
      const arr = (r.neighborhoods_at_sale || []) as NSetEntry[];
      for (const e of arr) {
        if (typeof e?.set_id === "number") {
          map.set(e.set_id, e.set_name ?? `Set ${e.set_id}`);
        }
      }
    }
    return Array.from(map.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([id, name]) => ({ id, name }));
  }, [rows]);

  const defaultSetId =
    allSets.find((s) => s.id === 1)?.id ?? allSets[0]?.id ?? 1;
  const [selectedSetId, setSelectedSetId] =
    React.useState<number>(defaultSetId);

  // keep selectedSetId in range of available sets
  React.useEffect(() => {
    if (!allSets.some((s) => s.id === selectedSetId)) {
      setSelectedSetId(allSets[0]?.id ?? 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allSets.length]);

  // Pull numeric ratios
  const ratios = React.useMemo(
    () =>
      rows
        .map((r) => (r.ratio === null ? NaN : Number(r.ratio)))
        .filter((x) => Number.isFinite(x)),
    [rows]
  );

  /** Compute the group key and label for each row */
  function getGroupKeyAndLabel(row: RatioRow): { key: string; label: string } {
    if (groupMode === "none") return { key: "All sales", label: "All sales" };
    if (groupMode === "lu") {
      const key = row.land_use_sale ?? "(Unknown LU)";
      return { key, label: key };
    }
    // Neighborhood set (by code/name fallback)
    const entries = (row.neighborhoods_at_sale ?? []) as NSetEntry[];
    const n = entries.find((e) => e?.set_id === selectedSetId);
    const label = labelFromNEntry(n);
    // Use the displayed label as the key so same neighborhoods group together
    const key = label;
    return { key, label };
  }

  // Group rows by selected mode
  const grouped = React.useMemo(() => {
    const map = new Map<string, { label: string; ratios: number[] }>();
    for (const r of rows) {
      const v = r.ratio === null ? NaN : Number(r.ratio);
      if (!Number.isFinite(v)) continue;
      const { key, label } = getGroupKeyAndLabel(r);
      const cur = map.get(key);
      if (cur) cur.ratios.push(v);
      else map.set(key, { label, ratios: [v] });
    }
    // If no rows or mode none, ensure a single bucket
    if (map.size === 0 && groupMode === "none") {
      map.set("All sales", { label: "All sales", ratios });
    }
    return map;
  }, [rows, ratios, groupMode, selectedSetId]);

  // Compute stats + histograms per group (fixed range 0%..130% with chosen binWidth)
  const entries = React.useMemo(() => {
    const list = Array.from(grouped.entries()).map(
      ([key, { label, ratios }]) => {
        const stats = computeStats(ratios, mode);
        const hist = buildHistogramFixedRange(stats.filtered, binWidth);
        return { key, label, stats, hist, size: ratios.length };
      }
    );
    if (groupSort === "name") {
      list.sort((a, b) => a.label.localeCompare(b.label));
    } else {
      list.sort((a, b) => b.size - a.size || a.label.localeCompare(b.label));
    }
    return list;
  }, [grouped, mode, binWidth, groupSort]);

  // Overall badges
  const n_total = ratios.length;
  const n_groups = entries.length;
  const n_kept_sum = entries.reduce((acc, e) => acc + e.stats.n_kept, 0);
  const n_dropped_sum = entries.reduce((acc, e) => acc + e.stats.n_dropped, 0);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Controls</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <div className="text-sm font-medium">Group by</div>
            <Select
              value={groupMode}
              onValueChange={(v) => setGroupMode(v as GroupMode)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="lu">Land Use (sale)</SelectItem>
                <SelectItem value="nset">Neighborhood Set</SelectItem>
              </SelectContent>
            </Select>

            {/* Neighborhood set chooser only when grouping by nset */}
            {groupMode === "nset" ? (
              <div className="space-y-2">
                <Label className="text-xs">Neighborhood Set</Label>
                <Select
                  value={String(selectedSetId)}
                  onValueChange={(v) => setSelectedSetId(Number(v))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose set" />
                  </SelectTrigger>
                  <SelectContent>
                    {allSets.map((s) => (
                      <SelectItem key={s.id} value={String(s.id)}>
                        {s.name ? `${s.name} (Set ${s.id})` : `Set ${s.id}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="text-xs text-muted-foreground">
                  Groups are labeled by <b>neighborhood name</b> if present,
                  else by <b>code</b>.
                </div>
              </div>
            ) : (
              <div className="text-xs text-muted-foreground">
                Choose how to partition the ratio distribution.
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="text-sm font-medium">Group sort</div>
            <Select
              value={groupSort}
              onValueChange={(v) => setGroupSort(v as GroupSort)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort groups" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="size">By size (desc)</SelectItem>
                <SelectItem value="name">By name (A→Z)</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-xs text-muted-foreground">
              Ordering for the group cards.
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-medium">Outlier Trimming</div>
            <RadioGroup
              value={mode}
              onValueChange={(v) => setMode(v as TrimMode)}
              className="grid gap-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="trim-none" value="none" />
                <Label htmlFor="trim-none">None</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="trim-15" value="iqr1_5" />
                <Label htmlFor="trim-15">1.5×IQR (Tukey)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="trim-3" value="iqr3" />
                <Label htmlFor="trim-3">3×IQR</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">Bin width</div>
              <div className="text-xs text-muted-foreground">
                {binPct}% width
              </div>
            </div>
            <Slider
              value={[binPct]}
              onValueChange={(v) => setBinPct(v[0] ?? 10)}
              min={2}
              max={25}
              step={1}
            />
            <div className="text-xs text-muted-foreground">
              Fixed range <b>0%–130%</b>. Equal-width bins by selected width.
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overall status */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">
          Total ratios: {n_total.toLocaleString()}
        </Badge>
        <Badge variant="default">Groups: {n_groups}</Badge>
        {n_dropped_sum > 0 ? (
          <Badge variant="destructive">
            Trimmed: {n_dropped_sum.toLocaleString()}
          </Badge>
        ) : null}
        <Badge variant="outline">Kept: {n_kept_sum.toLocaleString()}</Badge>
      </div>

      {/* Group cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
        {entries.map((g, i) => {
          const color = chartColorVar(i);
          return (
            <Card key={g.key}>
              <CardHeader className="space-y-1">
                <CardTitle className="text-base">{g.label}</CardTitle>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    Total: {g.stats.n_total.toLocaleString()}
                  </Badge>
                  <Badge variant="default">
                    Kept: {g.stats.n_kept.toLocaleString()}
                  </Badge>
                  {g.stats.n_dropped > 0 ? (
                    <Badge variant="destructive">
                      Dropped: {g.stats.n_dropped.toLocaleString()}
                    </Badge>
                  ) : null}
                </div>
              </CardHeader>
              <CardContent>
                {/* Histogram */}
                {g.hist.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    No data to plot.
                  </div>
                ) : (
                  <ChartContainer
                    className="h-[260px] w-full"
                    config={{
                      count: {
                        label: "Sales",
                        color,
                      },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={g.hist} margin={{ left: 8, right: 8 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                          dataKey="label"
                          tickLine={false}
                          axisLine={false}
                          interval={Math.max(
                            0,
                            Math.ceil(g.hist.length / 6) - 1
                          )}
                          minTickGap={12}
                        />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          width={36}
                          allowDecimals={false}
                        />
                        <ChartTooltip
                          content={
                            <ChartTooltipContent
                              labelFormatter={(label) => `Bin: ${label}`}
                              indicator="dot"
                              nameKey="count"
                            />
                          }
                        />
                        <Bar
                          dataKey="count"
                          fill="var(--color-count)"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                )}

                {/* Stats grid */}
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  <StatTile
                    label="Median"
                    value={formatRatio(g.stats.median)}
                    highlight
                  />
                  <StatTile label="Mean" value={formatRatio(g.stats.mean)} />
                  <StatTile label="Min" value={formatRatio(g.stats.min)} />
                  <StatTile label="Max" value={formatRatio(g.stats.max)} />
                  <StatTile label="Q1" value={formatRatio(g.stats.q1)} />
                  <StatTile label="Q3" value={formatRatio(g.stats.q3)} />
                  <StatTile label="IQR" value={formatRatio(g.stats.iqr)} />
                  {g.stats.bounds ? (
                    <>
                      <StatTile
                        label="Lower Bound"
                        value={formatRatio(g.stats.bounds.lower)}
                      />
                      <StatTile
                        label="Upper Bound"
                        value={formatRatio(g.stats.bounds.upper)}
                      />
                    </>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
