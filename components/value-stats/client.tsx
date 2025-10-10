"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, ResponsiveContainer, Legend, Cell } from "recharts";

/**
 * Data shape returned by get_category_sums_asof(as_of_date):
 *   category: 'agriculture' | 'commercial' | 'residential'
 *   assessed_land_sum, assessed_land_count
 *   assessed_bldg_sum, assessed_bldg_count
 *   assessed_total_sum, assessed_total_count
 *   new_const_sum, new_const_count
 *   taxable_total_sum, taxable_total_count
 */
export type CategoryRow = {
  category: "agriculture" | "commercial" | "residential";
  assessed_land_sum: number | null;
  assessed_land_count: number | null;
  assessed_bldg_sum: number | null;
  assessed_bldg_count: number | null;
  assessed_total_sum: number | null;
  assessed_total_count: number | null;
  new_const_sum: number | null;
  new_const_count: number | null;
  taxable_total_sum: number | null;
  taxable_total_count: number | null;
};

// Currency formatter helpers
const currencyFmt = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const fmtCurrency = (n: number | null | undefined) =>
  typeof n === "number" && Number.isFinite(n) ? currencyFmt.format(n) : "–";

// Theme colors (shadcn tokens)
const CAT_COLORS: Record<CategoryRow["category"], string> = {
  agriculture: "var(--chart-1)",
  commercial: "var(--chart-2)",
  residential: "var(--chart-3)",
};
const SECTION_COLORS: Record<"bldg_total" | "land_total", string> = {
  bldg_total: "var(--chart-4)",
  land_total: "var(--chart-5)",
};

// Label map
const LABEL: Record<CategoryRow["category"], string> = {
  agriculture: "Agriculture",
  commercial: "Commercial",
  residential: "Residential",
};

export default function AbatementDashboard({
  rows,
  asOfDate,
}: {
  rows: CategoryRow[];
  asOfDate: string;
}) {
  // Safe number getter
  const n = (v: number | null | undefined) => (typeof v === "number" ? v : 0);

  // Totals across categories
  const assessedLandTotal = rows.reduce(
    (s, r) => s + n(r.assessed_land_sum),
    0
  );
  const assessedBldgTotal = rows.reduce(
    (s, r) => s + n(r.assessed_bldg_sum),
    0
  );
  const assessedTotal = rows.reduce((s, r) => s + n(r.assessed_total_sum), 0);

  const taxableTotal = rows.reduce((s, r) => s + n(r.taxable_total_sum), 0);
  const abatedTotal = rows.reduce(
    (s, r) => s + Math.max(0, n(r.assessed_total_sum) - n(r.taxable_total_sum)),
    0
  );

  // Datasets
  const assessedByCategory = rows.map((r) => ({
    name: `${LABEL[r.category]} (Assessed)`,
    key: r.category,
    value: n(r.assessed_total_sum),
    fill: CAT_COLORS[r.category],
  }));

  const assessedBySection = [
    {
      name: "Building (Assessed)",
      key: "bldg_total",
      value: assessedBldgTotal,
      fill: SECTION_COLORS.bldg_total,
    },
    {
      name: "Land (Assessed)",
      key: "land_total",
      value: assessedLandTotal,
      fill: SECTION_COLORS.land_total,
    },
  ];

  const taxableByCategory = rows.map((r) => ({
    name: `${LABEL[r.category]} (Taxable)`,
    key: `${r.category}_taxable`,
    value: n(r.taxable_total_sum),
    fill: CAT_COLORS[r.category],
  }));

  // Abated amount per category = assessed_total_sum - taxable_total_sum
  const abatedByCategory = rows.map((r) => ({
    name: `${LABEL[r.category]} (Abated)`,
    key: `${r.category}_abated`,
    value: Math.max(0, n(r.assessed_total_sum) - n(r.taxable_total_sum)),
    fill: CAT_COLORS[r.category],
  }));

  // Grouped cards (per category)
  const GroupCard = ({ r }: { r: CategoryRow }) => {
    const land = n(r.assessed_land_sum);
    const bldg = n(r.assessed_bldg_sum);
    const total = n(r.assessed_total_sum);
    const taxable = n(r.taxable_total_sum);
    const newc = n(r.new_const_sum);
    const abated = Math.max(0, total - taxable);

    return (
      <Card
        className="rounded-2xl border"
        style={{ borderTopWidth: 6, borderTopColor: CAT_COLORS[r.category] }}
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{LABEL[r.category]}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Land (Sum)</div>
              <div className="font-medium">{fmtCurrency(land)}</div>
              <div className="text-xs text-muted-foreground">
                Count: {r.assessed_land_count ?? 0}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">
                Building (Sum)
              </div>
              <div className="font-medium">{fmtCurrency(bldg)}</div>
              <div className="text-xs text-muted-foreground">
                Count: {r.assessed_bldg_count ?? 0}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">
                Assessed Total
              </div>
              <div className="font-medium">{fmtCurrency(total)}</div>
              <div className="text-xs text-muted-foreground">
                Count: {r.assessed_total_count ?? 0}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">
                New Construction (Sum)
              </div>
              <div className="font-medium">{fmtCurrency(newc)}</div>
              <div className="text-xs text-muted-foreground">
                Count: {r.new_const_count ?? 0}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Taxable Total</div>
              <div className="font-semibold">{fmtCurrency(taxable)}</div>
              <div className="text-xs text-muted-foreground">
                Count: {r.taxable_total_count ?? 0}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground">Abated Amount</div>
              <div className="font-semibold">{fmtCurrency(abated)}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with high-level totals */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          Total Assessed & Taxable Values
        </h1>
        <div className="flex flex-col sm:flex-row sm:items-end sm:gap-8 gap-2">
          <div>
            <div className="text-xs text-muted-foreground">Assessed (All)</div>
            <div className="text-3xl font-bold">
              {fmtCurrency(assessedTotal)}
            </div>
            <div className="text-sm text-muted-foreground">
              Land: {fmtCurrency(assessedLandTotal)} • Building:{" "}
              {fmtCurrency(assessedBldgTotal)}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Taxable (All)</div>
            <div className="text-3xl font-bold">
              {fmtCurrency(taxableTotal)}
            </div>
            <div className="text-sm text-muted-foreground">
              Total Abated: {fmtCurrency(abatedTotal)}
            </div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          As of {new Date(asOfDate).toLocaleDateString()}
        </p>
      </div>

      {/* Charts — Two for Assessed, Two for Taxable */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Assessed: by Category */}
        <Card className="rounded-2xl">
          <CardHeader className="pb-0">
            <CardTitle className="text-base">
              Assessed Totals by Category
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <ChartContainer
              className="h-80"
              config={{
                agriculture: {
                  label: "Agriculture",
                  color: CAT_COLORS.agriculture,
                },
                commercial: {
                  label: "Commercial",
                  color: CAT_COLORS.commercial,
                },
                residential: {
                  label: "Residential",
                  color: CAT_COLORS.residential,
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assessedByCategory}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    label={({ value }) =>
                      typeof value === "number" ? currencyFmt.format(value) : ""
                    }
                    labelLine={false}
                  >
                    {assessedByCategory.map((d) => (
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

        {/* Assessed: by Section (Land vs Building) */}
        <Card className="rounded-2xl">
          <CardHeader className="pb-0">
            <CardTitle className="text-base">
              Assessed Land vs Building
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <ChartContainer
              className="h-80"
              config={{
                bldg_total: {
                  label: "Building",
                  color: SECTION_COLORS.bldg_total,
                },
                land_total: { label: "Land", color: SECTION_COLORS.land_total },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assessedBySection}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    label={({ value }) =>
                      typeof value === "number" ? currencyFmt.format(value) : ""
                    }
                    labelLine={false}
                  >
                    {assessedBySection.map((d) => (
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

        {/* Taxable: by Category */}
        <Card className="rounded-2xl">
          <CardHeader className="pb-0">
            <CardTitle className="text-base">
              Taxable Totals by Category
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <ChartContainer
              className="h-80"
              config={{
                agriculture_taxable: {
                  label: "Agriculture (Taxable)",
                  color: CAT_COLORS.agriculture,
                },
                commercial_taxable: {
                  label: "Commercial (Taxable)",
                  color: CAT_COLORS.commercial,
                },
                residential_taxable: {
                  label: "Residential (Taxable)",
                  color: CAT_COLORS.residential,
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taxableByCategory}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    label={({ value }) =>
                      typeof value === "number" ? currencyFmt.format(value) : ""
                    }
                    labelLine={false}
                  >
                    {taxableByCategory.map((d) => (
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

        {/* Taxable: Abated Amount by Category */}
        <Card className="rounded-2xl">
          <CardHeader className="pb-0">
            <CardTitle className="text-base">
              Abated Amount by Category
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <ChartContainer
              className="h-80"
              config={{
                agriculture_abated: {
                  label: "Agriculture (Abated)",
                  color: CAT_COLORS.agriculture,
                },
                commercial_abated: {
                  label: "Commercial (Abated)",
                  color: CAT_COLORS.commercial,
                },
                residential_abated: {
                  label: "Residential (Abated)",
                  color: CAT_COLORS.residential,
                },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={abatedByCategory}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={110}
                    label={({ value }) =>
                      typeof value === "number" ? currencyFmt.format(value) : ""
                    }
                    labelLine={false}
                  >
                    {abatedByCategory.map((d) => (
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

      {/* Grouped summary cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((r) => (
          <GroupCard key={r.category} r={r} />
        ))}
      </div>
    </div>
  );
}
