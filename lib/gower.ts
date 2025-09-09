// gower.ts
type GowerType = "numeric" | "categorical" | "boolean" | "date";

type FieldSpec<T> = {
  key: keyof T;
  type: GowerType;
  weight?: number; // default 1
};

type GowerResult<T> = { item: T; distance: number };

/**
 * Compute Gower distances from `subject` to each item in `candidates`.
 * - Mixed types supported (numeric, categorical, boolean, date).
 * - Per-feature ranges are auto-derived from subject + candidates.
 * - Missing values are skipped for that feature for that pair.
 * - Weights are supported (default 1 per field).
 */
export function gowerDistances<T extends Record<string, any>>(
  subject: T,
  candidates: T[],
  fields: FieldSpec<T>[]
): GowerResult<T>[] {
  if (!candidates.length || !fields.length)
    return candidates.map((item) => ({ item, distance: 0 }));

  // ---- 1) Build ranges for numeric/date features over subject + candidates ----
  const keysNeedingRange = fields
    .filter((f) => f.type === "numeric" || f.type === "date")
    .map((f) => f.key);

  const mins = new Map<keyof T, number>();
  const maxs = new Map<keyof T, number>();

  const consider = (k: keyof T, v: any) => {
    if (v === null || v === undefined) return;
    const n =
      typeof v === "number"
        ? v
        : fields.find((f) => f.key === k)?.type === "date"
          ? toMillis(v)
          : NaN;
    if (!Number.isFinite(n)) return;
    mins.set(k, Math.min(mins.get(k) ?? n, n));
    maxs.set(k, Math.max(maxs.get(k) ?? n, n));
  };

  // include subject + all candidates
  for (const k of keysNeedingRange) consider(k, subject[k]);
  for (const item of candidates)
    for (const k of keysNeedingRange) consider(k, item[k]);

  // ---- 2) Distance per candidate ----
  const results: GowerResult<T>[] = [];

  for (const item of candidates) {
    let weightedSum = 0; // Σ w_j * d_j
    let weightDen = 0; // Σ w_j (only for features with both values present)

    for (const f of fields) {
      const key = f.key;
      const w = f.weight ?? 1;

      const a = subject[key];
      const b = item[key];

      // skip if either missing
      if (a === null || a === undefined || b === null || b === undefined)
        continue;

      let d = 0;

      switch (f.type) {
        case "numeric": {
          const range = (maxs.get(key) ?? 0) - (mins.get(key) ?? 0);
          if (range === 0) {
            d = 0;
            break;
          }
          const aNum = Number(a);
          const bNum = Number(b);
          if (!Number.isFinite(aNum) || !Number.isFinite(bNum)) continue;
          d = Math.abs(aNum - bNum) / range;
          break;
        }

        case "date": {
          const aMs = toMillis(a);
          const bMs = toMillis(b);
          if (!Number.isFinite(aMs) || !Number.isFinite(bMs)) continue;
          const range = (maxs.get(key) ?? 0) - (mins.get(key) ?? 0);
          if (range === 0) {
            d = 0;
            break;
          }
          d = Math.abs(aMs - bMs) / range;
          break;
        }

        case "categorical": {
          d = String(a) === String(b) ? 0 : 1;
          break;
        }

        case "boolean": {
          d = Boolean(a) === Boolean(b) ? 0 : 1;
          break;
        }
      }

      // Clamp numeric guard
      if (!Number.isFinite(d)) continue;
      if (d < 0) d = 0;
      if (d > 1) d = 1;

      weightedSum += w * d;
      weightDen += w;
    }

    const distance = weightDen > 0 ? weightedSum / weightDen : 0;
    results.push({ item, distance });
  }

  results.sort((a, b) => a.distance - b.distance);
  return results;
}

// ---- Helpers ----
function toMillis(v: any): number {
  if (v instanceof Date) return v.getTime();
  if (typeof v === "number") return v; // already ms
  if (typeof v === "string") {
    // Accept "YYYY-MM-DD" or ISO
    const t = Date.parse(v);
    return Number.isFinite(t) ? t : NaN;
  }
  return NaN;
}
