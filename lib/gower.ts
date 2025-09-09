// ---------- Haversine ----------
export function haversineMiles(
  lat1?: number | null,
  lon1?: number | null,
  lat2?: number | null,
  lon2?: number | null
): number | null {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const a = Number(lat1),
    b = Number(lon1),
    c = Number(lat2),
    d = Number(lon2);
  if (![a, b, c, d].every(Number.isFinite)) return null;
  const R = 3958.7613; // miles
  const dLat = toRad(c - a);
  const dLon = toRad(d - b);
  const s1 = Math.sin(dLat / 2);
  const s2 = Math.sin(dLon / 2);
  const A = s1 * s1 + Math.cos(toRad(a)) * Math.cos(toRad(c)) * s2 * s2;
  const C = 2 * Math.atan2(Math.sqrt(A), Math.sqrt(1 - A));
  return R * C;
}

// ---------- Gower helper (numeric/categorical/boolean) ----------
type GowerType = "numeric" | "categorical" | "boolean";
export type FieldSpec<T> = { key: keyof T; type: GowerType; weight?: number };
type GowerResult<T> = { item: T; distance: number; index: number };

export function gowerDistances<T extends Record<string, any>>(
  subject: T,
  candidates: T[],
  fields: FieldSpec<T>[]
): GowerResult<T>[] {
  if (!candidates.length || !fields.length) return [];

  const numericKeys = fields
    .filter((f) => f.type === "numeric")
    .map((f) => f.key);
  const mins = new Map<keyof T, number>();
  const maxs = new Map<keyof T, number>();
  const add = (k: keyof T, v: any) => {
    if (v == null) return;
    const n = Number(v);
    if (!Number.isFinite(n)) return;
    mins.set(k, Math.min(mins.get(k) ?? n, n));
    maxs.set(k, Math.max(maxs.get(k) ?? n, n));
  };
  for (const k of numericKeys) add(k, subject[k]);
  for (const item of candidates) for (const k of numericKeys) add(k, item[k]);

  return candidates
    .map((item, idx) => {
      let wsum = 0,
        wden = 0;
      for (const f of fields) {
        const w = f.weight ?? 1;
        const a = subject[f.key];
        const b = item[f.key];
        if (a == null || b == null) continue;

        let d = 0;
        if (f.type === "numeric") {
          const aNum = Number(a),
            bNum = Number(b);
          if (!Number.isFinite(aNum) || !Number.isFinite(bNum)) continue;
          const range = (maxs.get(f.key) ?? 0) - (mins.get(f.key) ?? 0);
          d = range === 0 ? 0 : Math.abs(aNum - bNum) / range;
        } else if (f.type === "categorical") {
          d = String(a) === String(b) ? 0 : 1;
        } else {
          d = Boolean(a) === Boolean(b) ? 0 : 1;
        }

        if (!Number.isFinite(d)) continue;
        if (d < 0) d = 0;
        if (d > 1) d = 1;
        wsum += w * d;
        wden += w;
      }
      return { item, distance: wden > 0 ? wsum / wden : 0, index: idx };
    })
    .sort((a, b) => a.distance - b.distance);
}
