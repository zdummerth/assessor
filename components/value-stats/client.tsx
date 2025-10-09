"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Pie, PieChart, ResponsiveContainer, Legend, Cell } from "recharts";

// --- Types matching the SQL function return shape
export type StatRow = {
  column_name: string; // e.g., "bldg_agriculture"
  mean: number | null;
  median: number | null;
  count_nonzero: number | null;
  sum_nonzero: number | null;
};

// Currency formatter
const currencyFmt = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const fmtCurrency = (n: number | null | undefined) =>
  typeof n === "number" && Number.isFinite(n) ? currencyFmt.format(n) : "–";

// Friendly labels
const LABELS: Record<string, string> = {
  bldg_agriculture: "Building – Agriculture",
  bldg_commercial: "Building – Commercial",
  bldg_residential: "Building – Residential",
  land_agriculture: "Land – Agriculture",
  land_commercial: "Land – Commercial",
  land_residential: "Land – Residential",
  new_const_agriculture: "New Const – Agriculture",
  new_const_commercial: "New Const – Commercial",
  new_const_residential: "New Const – Residential",
  bldg_total: "Building Total",
  land_total: "Land Total",
  new_const_total: "New Construction Total",
  agriculture_all: "Agriculture (All)",
  commercial_all: "Commercial (All)",
  residential_all: "Residential (All)",
};

// Color tokens (uses your shadcn theme vars)
const CAT_COLORS: Record<string, string> = {
  agriculture_all: "var(--chart-4)",
  commercial_all: "var(--chart-2)",
  residential_all: "var(--chart-3)",
};
const SECTION_COLORS: Record<string, string> = {
  bldg_total: "var(--chart-3)",
  land_total: "var(--chart-4)",
};

export default function StatsClient({
  rows,
  asOfDate,
}: {
  rows: StatRow[];
  asOfDate: string;
}) {
  // Helper to access a row by column_name
  const row = (key: string): StatRow | undefined =>
    rows.find((r) => r.column_name === key);

  // Build chart datasets (include `fill` so Legend matches slice colors)
  const catData = [
    {
      name: "Agriculture (All)",
      key: "agriculture_all",
      value: row("agriculture_all")?.sum_nonzero ?? 0,
      fill: CAT_COLORS.agriculture_all,
    },
    {
      name: "Commercial (All)",
      key: "commercial_all",
      value: row("commercial_all")?.sum_nonzero ?? 0,
      fill: CAT_COLORS.commercial_all,
    },
    {
      name: "Residential (All)",
      key: "residential_all",
      value: row("residential_all")?.sum_nonzero ?? 0,
      fill: CAT_COLORS.residential_all,
    },
  ];

  const sectionData = [
    {
      name: "Building Total",
      key: "bldg_total",
      value: row("bldg_total")?.sum_nonzero ?? 0,
      fill: SECTION_COLORS.bldg_total,
    },
    {
      name: "Land Total",
      key: "land_total",
      value: row("land_total")?.sum_nonzero ?? 0,
      fill: SECTION_COLORS.land_total,
    },
  ];

  // Grid ordering (cards)
  const cardOrder = [
    "bldg_agriculture",
    "bldg_commercial",
    "bldg_residential",
    "land_agriculture",
    "land_commercial",
    "land_residential",
    "new_const_agriculture",
    "new_const_commercial",
    "new_const_residential",
    "bldg_total",
    "land_total",
    "new_const_total",
    "agriculture_all",
    "commercial_all",
    "residential_all",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Value Stats</h1>
          <p className="text-sm text-muted-foreground">
            As of {new Date(asOfDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Charts FIRST */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Category totals pie (Agriculture/Commercial/Residential) */}
        <Card className="rounded-2xl">
          <CardHeader className="pb-0">
            <CardTitle className="text-base">Category Totals (All)</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <ChartContainer
              className="h-80"
              config={{
                agriculture_all: {
                  label: "Agriculture (All)",
                  color: CAT_COLORS.agriculture_all,
                },
                commercial_all: {
                  label: "Commercial (All)",
                  color: CAT_COLORS.commercial_all,
                },
                residential_all: {
                  label: "Residential (All)",
                  color: CAT_COLORS.residential_all,
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={catData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    label={({ value }) => fmtCurrency(Number(value))}
                    labelLine={false}
                  >
                    {catData.map((d) => (
                      <Cell key={d.key} fill={d.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={<ChartTooltipContent nameKey="name" />}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Section totals pie (Building vs Land) */}
        <Card className="rounded-2xl">
          <CardHeader className="pb-0">
            <CardTitle className="text-base">Section Totals</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <ChartContainer
              className="h-80"
              config={{
                bldg_total: {
                  label: "Building Total",
                  color: SECTION_COLORS.bldg_total,
                },
                land_total: {
                  label: "Land Total",
                  color: SECTION_COLORS.land_total,
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sectionData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    label={({ value }) => fmtCurrency(Number(value))}
                    labelLine={false}
                  >
                    {sectionData.map((d) => (
                      <Cell key={d.key} fill={d.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip
                    content={<ChartTooltipContent nameKey="name" />}
                  />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Cards grid AFTER charts */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {cardOrder.map((key) => {
          const r = row(key);
          if (!r) return null;
          return (
            <Card key={key} className="rounded-2xl">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base leading-tight">
                    {LABELS[key] ?? key}
                  </CardTitle>
                  <Badge
                    variant="secondary"
                    className="text-[10px] uppercase tracking-wide"
                  >
                    {r.count_nonzero ?? 0} non-zero
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <div className="text-xs text-muted-foreground">Mean</div>
                    <div className="font-medium">{fmtCurrency(r.mean)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Median</div>
                    <div className="font-medium">{fmtCurrency(r.median)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Sum</div>
                    <div className="font-medium">
                      {fmtCurrency(r.sum_nonzero)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
