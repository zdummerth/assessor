// app/taxes/by-year/page.tsx
import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/database-types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

type DistrictRow = Tables<"tax_districts">;
type SubdistrictRow = Tables<"tax_subdistricts">;
type RateYearRow = Tables<"tax_rate_years">; // includes: applies_to: json/jsonb

type SubdistrictWithRates = SubdistrictRow & {
  tax_rate_years?: RateYearRow[];
};
type DistrictWithRelations = DistrictRow & {
  tax_subdistricts?: SubdistrictWithRates[];
};

export const metadata = { title: "Tax Rates by Year" };

const PTYPES = ["res", "com", "agr", "pp"] as const;
type PType = (typeof PTYPES)[number];

function fmtRateRaw(v: number | null | undefined) {
  return Number(v ?? 0).toFixed(6); // do NOT multiply by 100
}
function fmtCap(v: number | null | undefined) {
  return v == null ? "—" : Number(v).toFixed(2);
}

function safeAppliesTo(v: unknown): string[] {
  if (Array.isArray(v)) return v.map((s) => String(s).toLowerCase());
  // If you want null/empty to mean "all types", replace return [] with [...PTYPES]
  return [];
}

export default async function Page() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tax_districts")
    .select(
      `
      *,
      tax_subdistricts(
        *,
        tax_rate_years(*)
      )
    `
    )
    .order("code", { ascending: true })
    .order("name", { ascending: true, referencedTable: "tax_subdistricts" });

  if (error) {
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <p className="text-center">Error fetching tax data</p>
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  const districts = (data ?? []) as DistrictWithRelations[];

  // All tax years present, newest first
  const years = Array.from(
    new Set(
      districts.flatMap((d) =>
        (d.tax_subdistricts ?? []).flatMap((sd) =>
          (sd.tax_rate_years ?? []).map((ry) => ry.tax_year)
        )
      )
    )
  ).sort((a, b) => b - a);

  const ratesForYear = (sd: SubdistrictWithRates, year: number) =>
    (sd.tax_rate_years ?? []).filter((r) => r.tax_year === year);

  return (
    <div className="w-full flex flex-col gap-6 p-4 mb-10 max-w-7xl mx-auto">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tax Rates by Year</h1>
          <p className="text-sm text-muted-foreground">
            Cards per year. Per-district totals and overall year totals by
            property type. Rates are shown as stored (no ×100).
          </p>
        </div>
      </div>

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
        // ---- Overall YEAR totals across ALL districts/subdistricts ----
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

        districts.forEach((d) => {
          (d.tax_subdistricts ?? []).forEach((sd) => {
            ratesForYear(sd, year).forEach((r) => {
              const applies = safeAppliesTo((r as any).applies_to);
              PTYPES.forEach((t) => {
                if (applies.includes(t)) {
                  if (r.rate_type === "percentage") {
                    yearTotalsPct[t] += Number(r.rate ?? 0);
                  } else if (r.rate_type === "fixed") {
                    yearTotalsFixed[t] += Number(r.rate ?? 0);
                  }
                }
              });
            });
          });
        });

        const YearTotalsBadges = () => (
          <div className="flex flex-wrap gap-2">
            {PTYPES.map((t) => {
              const hasPct = yearTotalsPct[t] !== 0;
              const hasFixed = yearTotalsFixed[t] !== 0;
              return (
                <div key={t} className="flex items-center gap-2">
                  <Badge
                    variant={hasPct ? "default" : "secondary"}
                    className="capitalize"
                  >
                    {t}: {hasPct ? fmtRateRaw(yearTotalsPct[t]) : "—"}{" "}
                    <span className="ml-1 text-muted-foreground">(% type)</span>
                  </Badge>
                  {hasFixed ? (
                    <Badge variant="outline" className="capitalize">
                      {t}: {fmtRateRaw(yearTotalsFixed[t])}{" "}
                      <span className="ml-1 text-muted-foreground">
                        ($ type)
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
                <Badge variant="secondary">Snapshot</Badge>
              </div>
              <CardDescription>
                Totals are grouped by property type and separated by{" "}
                <code>rate_type</code>.
              </CardDescription>

              {/* Overall Year Totals */}
              <div className="pt-1">
                <div className="text-xs font-medium mb-1 text-muted-foreground">
                  Year totals (all districts)
                </div>
                <YearTotalsBadges />
              </div>
            </CardHeader>

            <CardContent className="space-y-8">
              {districts.map((d, districtIdx) => {
                const subs = (d.tax_subdistricts ??
                  []) as SubdistrictWithRates[];

                // Per-district totals for this year
                const totalsPct: Record<PType, number> = {
                  res: 0,
                  com: 0,
                  agr: 0,
                  pp: 0,
                };
                const totalsFixed: Record<PType, number> = {
                  res: 0,
                  com: 0,
                  agr: 0,
                  pp: 0,
                };

                subs.forEach((sd) => {
                  ratesForYear(sd, year).forEach((r) => {
                    const applies = safeAppliesTo((r as any).applies_to);
                    PTYPES.forEach((t) => {
                      if (applies.includes(t)) {
                        if (r.rate_type === "percentage") {
                          totalsPct[t] += Number(r.rate ?? 0);
                        } else if (r.rate_type === "fixed") {
                          totalsFixed[t] += Number(r.rate ?? 0);
                        }
                      }
                    });
                  });
                });

                const hasAny = subs.some(
                  (sd) => ratesForYear(sd, year).length > 0
                );

                const DistrictTotalsBadges = () => (
                  <div className="flex flex-wrap gap-2">
                    {PTYPES.map((t) => {
                      const hasPct = totalsPct[t] !== 0;
                      const hasFixed = totalsFixed[t] !== 0;
                      return (
                        <div key={t} className="flex items-center gap-2">
                          <Badge
                            variant={hasPct ? "default" : "secondary"}
                            className="capitalize"
                          >
                            {t}: {hasPct ? fmtRateRaw(totalsPct[t]) : "—"}{" "}
                            <span className="ml-1 text-muted-foreground">
                              (% type)
                            </span>
                          </Badge>
                          {hasFixed ? (
                            <Badge variant="outline" className="capitalize">
                              {t}: {fmtRateRaw(totalsFixed[t])}{" "}
                              <span className="ml-1 text-muted-foreground">
                                ($ type)
                              </span>
                            </Badge>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                );

                return (
                  <div key={`${year}-${d.id}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <h2 className="text-base font-semibold">
                            {d.name ?? "(Unnamed District)"}{" "}
                            {d.code ? (
                              <Badge
                                variant="outline"
                                className="ml-1 font-mono"
                              >
                                {d.code}
                              </Badge>
                            ) : null}
                          </h2>
                        </div>
                        {d.description ? (
                          <p className="text-xs text-muted-foreground">
                            {d.description}
                          </p>
                        ) : null}
                      </div>
                      <DistrictTotalsBadges />
                    </div>

                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[40%]">
                              Subdistrict
                            </TableHead>
                            <TableHead>Rate (raw)</TableHead>
                            <TableHead>Rate Type</TableHead>
                            <TableHead>Cap</TableHead>
                            <TableHead className="hidden md:table-cell">
                              Applies To
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {hasAny ? (
                            subs.flatMap((sd) => {
                              const rows = ratesForYear(sd, year);
                              if (rows.length === 0) {
                                return (
                                  <TableRow key={`${sd.id}-none`}>
                                    <TableCell className="font-medium">
                                      {sd.name ?? "(Unnamed Subdistrict)"}
                                    </TableCell>
                                    <TableCell
                                      colSpan={4}
                                      className="text-muted-foreground"
                                    >
                                      —
                                    </TableCell>
                                  </TableRow>
                                );
                              }
                              return rows.map((r) => {
                                const applies = safeAppliesTo(
                                  (r as any).applies_to
                                );
                                return (
                                  <TableRow key={r.id}>
                                    <TableCell className="font-medium">
                                      {sd.name ?? "(Unnamed Subdistrict)"}
                                    </TableCell>
                                    <TableCell>{fmtRateRaw(r.rate)}</TableCell>
                                    <TableCell className="capitalize">
                                      {r.rate_type}
                                    </TableCell>
                                    <TableCell>{fmtCap(r.cap)}</TableCell>
                                    <TableCell className="hidden md:table-cell">
                                      {applies.length
                                        ? applies.join(", ")
                                        : "—"}
                                    </TableCell>
                                  </TableRow>
                                );
                              });
                            })
                          ) : (
                            <TableRow>
                              <TableCell
                                colSpan={5}
                                className="text-muted-foreground"
                              >
                                No subdistrict rates recorded for this district
                                in {year}.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>

                    {districtIdx < districts.length - 1 ? (
                      <Separator className="my-6" />
                    ) : null}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
