// lib/ratio-stats.ts
export type GroupedStats = {
  group_key: string | null;
  median_ratio: number | null;
  min_ratio: number | null;
  max_ratio: number | null;
  avg_ratio: number | null;
  n: number;
  raw_data?: any[]; // optional: raw rows per group
};

/** percentile_cont on a sorted numeric array */
function percentileCont(sorted: number[], p: number): number | null {
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

/** returns [q1, q3] from numeric array (sorted inside) */
function quartiles(arr: number[]): [number | null, number | null] {
  if (!arr.length) return [null, null];
  const s = [...arr].sort((a, b) => a - b);
  return [percentileCont(s, 0.25), percentileCont(s, 0.75)];
}

/** Trim by IQR factor (1.5 or 3). If null -> no trim */
function trimIQR(values: number[], factor: number | null): number[] {
  if (factor == null) return values;
  if (!values.length) return values;
  const s = [...values].sort((a, b) => a - b);
  const q1 = percentileCont(s, 0.25);
  const q3 = percentileCont(s, 0.75);
  if (q1 == null || q3 == null) return s;
  const iqr = q3 - q1;
  const lo = q1 - factor * iqr;
  const hi = q3 + factor * iqr;
  return s.filter((v) => v >= lo && v <= hi);
}

/** Build a group key from multiple columns for one row */
function makeKey(row: any, cols?: string[]): string | null {
  if (!cols?.length) return null;
  return cols.map((c) => row?.[c] ?? "(null)").join(" | ");
}

/** Compute grouped stats client-side */
export function computeRatioStats(
  rows: any[],
  opts?: {
    group_by?: string[]; // e.g. ['district', 'land_use_sale']
    trim_factor?: 1.5 | 3 | null; // null = no trim
    include_raw?: boolean;
  }
): GroupedStats[] {
  const groupBy = opts?.group_by ?? [];
  const factor = opts?.trim_factor ?? null;
  const include = !!opts?.include_raw;

  if (!groupBy.length) {
    // Overall stats
    const ratios = rows
      .map((r) => r?.ratio)
      .filter((x): x is number => Number.isFinite(x));
    const trimmed = trimIQR(ratios, factor);
    const s = [...trimmed].sort((a, b) => a - b);

    const median = percentileCont(s, 0.5);
    const min = s.length ? s[0] : null;
    const max = s.length ? s[s.length - 1] : null;
    const avg = s.length ? s.reduce((a, b) => a + b, 0) / s.length : null;

    return [
      {
        group_key: null,
        median_ratio: median,
        min_ratio: min,
        max_ratio: max,
        avg_ratio: avg,
        n: s.length,
        raw_data: include ? rows : undefined,
      },
    ];
  }

  // Group rows
  const buckets = new Map<string, any[]>();
  for (const r of rows) {
    const key = makeKey(r, groupBy)!;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key)!.push(r);
  }

  // Stats per group
  const out: GroupedStats[] = [];
  //@ts-expect-error TS2345
  for (const [key, bucketRows] of buckets.entries()) {
    const ratios = bucketRows
      //@ts-expect-error TS2345
      .map((r) => r?.ratio)
      //@ts-expect-error TS2345
      .filter((x): x is number => Number.isFinite(x));

    const trimmed = trimIQR(ratios, factor);
    const s = [...trimmed].sort((a, b) => a - b);

    const median = percentileCont(s, 0.5);
    const min = s.length ? s[0] : null;
    const max = s.length ? s[s.length - 1] : null;
    const avg = s.length ? s.reduce((a, b) => a + b, 0) / s.length : null;

    out.push({
      group_key: key,
      median_ratio: median,
      min_ratio: min,
      max_ratio: max,
      avg_ratio: avg,
      n: s.length,
      raw_data: include ? bucketRows : undefined,
    });
  }

  // Sort by key for consistency
  out.sort((a, b) => String(a.group_key).localeCompare(String(b.group_key)));
  return out;
}
