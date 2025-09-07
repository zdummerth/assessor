// /lib/ratio-stats.ts
import type { RatioRow } from "@/lib/client-queries";

export type StatsRow = {
  group_values: Record<string, string | number | null>;
  median_ratio: number | null;
  min_ratio: number | null;
  max_ratio: number | null;
  avg_ratio: number | null;
  n: number;
  raw_data?: RatioRow[];
  ratios?: number[]; // trimmed ratios for this group (for per-group histograms)
};

export type TrimChoice = "" | "1.5" | "3";

export function getSaleYear(sale_date?: string | null): number | null {
  if (!sale_date) return null;
  const d = new Date(sale_date);
  return Number.isFinite(d.getTime()) ? d.getUTCFullYear() : null;
}

export function percentileCont(sorted: number[], p: number): number | null {
  if (!sorted.length) return null;
  if (p <= 0) return sorted[0];
  if (p >= 1) return sorted[sorted.length - 1];
  const idx = (sorted.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  const frac = idx - lo;
  return sorted[lo] + (sorted[hi] - sorted[lo]) * frac;
}

export function trimIQR(values: number[], factor: 1.5 | 3 | null): number[] {
  if (factor == null || !values.length) return [...values];
  const s = [...values].sort((a, b) => a - b);
  const q1 = percentileCont(s, 0.25);
  const q3 = percentileCont(s, 0.75);
  if (q1 == null || q3 == null) return s;
  const iqr = q3 - q1;
  const lo = q1 - factor * iqr;
  const hi = q3 + factor * iqr;
  return s.filter((v) => v >= lo && v <= hi);
}

export function allRatiosTrimmed(
  rows: (RatioRow & { sale_year?: number | null })[],
  trim: TrimChoice
) {
  const vals = rows
    .map((r) => r?.ratio)
    .filter((x): x is number => Number.isFinite(x));
  const tf = trim ? (Number(trim) as 1.5 | 3) : null;
  return trimIQR(vals, tf);
}

export function computeGroupedStats(
  rows: (RatioRow & { sale_year?: number | null })[],
  groupBy: string[],
  trim: TrimChoice,
  includeRaw: boolean
): StatsRow[] {
  const tf = trim ? (Number(trim) as 1.5 | 3) : null;

  // No grouping → single stats row (overall)
  if (!groupBy.length) {
    const ratios = rows
      .map((r) => r?.ratio)
      .filter((x): x is number => Number.isFinite(x));
    const trimmed = trimIQR(ratios, tf);
    const s = [...trimmed].sort((a, b) => a - b);
    const med = percentileCont(s, 0.5);
    const min = s.length ? s[0] : null;
    const max = s.length ? s[s.length - 1] : null;
    const avg = s.length ? s.reduce((a, b) => a + b, 0) / s.length : null;

    return [
      {
        group_values: {},
        median_ratio: med,
        min_ratio: min,
        max_ratio: max,
        avg_ratio: avg,
        n: s.length,
        raw_data: includeRaw ? rows : undefined,
        ratios: trimmed,
      },
    ];
  }

  // Group into buckets
  const buckets = new Map<string, RatioRow[]>();
  for (const r of rows) {
    const tuple = groupBy.map((col) =>
      col === "sale_year"
        ? ((r as any)?.sale_year ?? null)
        : ((r as any)?.[col] ?? null)
    );
    const key = JSON.stringify(tuple);
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key)!.push(r);
  }

  const out: StatsRow[] = [];
  //@ts-expect-error TS7053
  for (const [key, bucketRows] of buckets.entries()) {
    const tuple: (string | number | null)[] = JSON.parse(key);
    const gv: Record<string, string | number | null> = {};
    groupBy.forEach((col, i) => (gv[col] = tuple[i]));

    const ratios = bucketRows
      //@ts-expect-error TS7053
      .map((r) => r?.ratio)
      //@ts-expect-error TS7053
      .filter((x): x is number => Number.isFinite(x));
    const trimmed = trimIQR(ratios, tf);
    const s = [...trimmed].sort((a, b) => a - b);

    const med = percentileCont(s, 0.5);
    const min = s.length ? s[0] : null;
    const max = s.length ? s[s.length - 1] : null;
    const avg = s.length ? s.reduce((a, b) => a + b, 0) / s.length : null;

    out.push({
      group_values: gv,
      median_ratio: med,
      min_ratio: min,
      max_ratio: max,
      avg_ratio: avg,
      n: s.length,
      raw_data: includeRaw ? bucketRows : undefined,
      ratios: trimmed,
    });
  }

  // Stable order by first group column
  out.sort((a, b) => {
    const first = groupBy[0];
    const av = a.group_values[first];
    const bv = b.group_values[first];
    return String(av ?? "").localeCompare(String(bv ?? ""));
  });

  return out;
}

// Histogram binning (calculation-only; rendering stays with the component)
export function buildHistogramBins(
  ratios: number[],
  binWidth = 0.1
): { bin: number; count: number }[] {
  if (!ratios.length) return [];
  const minVal = Math.min(...ratios);
  const maxVal = Math.max(...ratios);
  const start = Math.floor(minVal / binWidth) * binWidth;
  const end = Math.ceil(maxVal / binWidth) * binWidth;

  const bins: { bin: number; count: number }[] = [];
  for (let x = start; x <= end + 1e-9; x = +(x + binWidth).toFixed(10)) {
    bins.push({ bin: +x.toFixed(10), count: 0 });
  }
  for (const r of ratios) {
    if (!Number.isFinite(r)) continue;
    let idx = Math.floor((r - start) / binWidth);
    if (idx < 0) idx = 0;
    if (idx >= bins.length) idx = bins.length - 1;
    bins[idx].count += 1;
  }
  return bins;
}

// Generic grouped stats for any numeric field on the row.
export type GenericStatsRow<T = any> = {
  group_values: Record<string, string | number | null>;
  median: number | null;
  min: number | null;
  max: number | null;
  avg: number | null;
  n: number;
  raw_data?: T[];
  values?: number[]; // trimmed/filtered numeric values for charts
};

/**
 * Compute grouped stats by a numeric field key.
 * - If applyTrim is true, apply IQR trim to the values before computing stats.
 */
export function computeGroupedStatsForKey<T extends Record<string, any>>(
  rows: (T & { sale_year?: number | null })[],
  groupBy: string[],
  valueKey: keyof T,
  options?: {
    trim?: "" | "1.5" | "3";
    includeRaw?: boolean;
    applyTrim?: boolean;
  }
): GenericStatsRow<T>[] {
  const trimChoice = options?.trim ?? "";
  const tf = trimChoice ? (Number(trimChoice) as 1.5 | 3) : null;
  const includeRaw = !!options?.includeRaw;
  const applyTrim = options?.applyTrim ?? false;

  const pickVals = (xs: T[]) => {
    const vals = xs
      .map((r) => Number(r[valueKey]))
      .filter((x) => Number.isFinite(x));
    return applyTrim ? trimIQR(vals, tf) : vals;
  };

  if (!groupBy.length) {
    const values = pickVals(rows as T[]);
    const s = [...values].sort((a, b) => a - b);
    const med = percentileCont(s, 0.5);
    const min = s.length ? s[0] : null;
    const max = s.length ? s[s.length - 1] : null;
    const avg = s.length ? s.reduce((a, b) => a + b, 0) / s.length : null;
    return [
      {
        group_values: {},
        median: med,
        min,
        max,
        avg,
        n: s.length,
        raw_data: includeRaw ? rows : undefined,
        values,
      },
    ];
  }

  const buckets = new Map<string, T[]>();
  for (const r of rows) {
    const tuple = groupBy.map((col) =>
      col === "sale_year"
        ? ((r as any)?.sale_year ?? null)
        : ((r as any)?.[col] ?? null)
    );
    const key = JSON.stringify(tuple);
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key)!.push(r);
  }

  const out: GenericStatsRow<T>[] = [];
  //@ts-expect-error TS7053
  for (const [key, bucketRows] of buckets.entries()) {
    const tuple: (string | number | null)[] = JSON.parse(key);
    const gv: Record<string, string | number | null> = {};
    groupBy.forEach((col, i) => (gv[col] = tuple[i]));

    const values = pickVals(bucketRows);
    const s = [...values].sort((a, b) => a - b);
    const med = percentileCont(s, 0.5);
    const min = s.length ? s[0] : null;
    const max = s.length ? s[s.length - 1] : null;
    const avg = s.length ? s.reduce((a, b) => a + b, 0) / s.length : null;

    out.push({
      group_values: gv,
      median: med,
      min,
      max,
      avg,
      n: s.length,
      raw_data: includeRaw ? (bucketRows as any) : undefined,
      values,
    });
  }

  out.sort((a, b) => {
    const first = groupBy[0];
    return String(a.group_values[first] ?? "").localeCompare(
      String(b.group_values[first] ?? "")
    );
  });

  return out;
}
