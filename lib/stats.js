/**
 * Summarize a field across an array of objects.
 *
 * @param {Array<object>} rows
 * @param {string} field
 * @param {'auto'|'numeric'|'categorical'} [columnType='auto']  Force column type or autodetect.
 *
 * Behavior:
 * - If columnType === 'numeric' (or autodetected numeric):
 *     returns { type:'numeric', field, count, min, max, avg, median }
 *     (count = number of numeric-like, non-null values)
 * - If columnType === 'categorical' (or autodetected categorical):
 *     returns { type:'categorical', field, count, frequencies:[{ value, count, pct }] }
 *     (count = total rows, includes null/undefined)
 */
export function summarizeField(rows, field, columnType = "auto") {
  const values = rows.map((r) => r?.[field]);

  // Helpers
  const isNumericLike = (v) => {
    if (v === null || v === undefined) return false;
    if (typeof v === "boolean") return false;
    if (typeof v === "number") return Number.isFinite(v);
    if (typeof v === "string") {
      const s = v.trim();
      if (s === "") return false;
      const n = Number(s);
      return Number.isFinite(n);
    }
    return false;
  };

  const toNumber = (v) =>
    typeof v === "number" ? v : Number(String(v).trim());

  const median = (nums) => {
    if (!nums.length) return null;
    const s = [...nums].sort((a, b) => a - b);
    const m = Math.floor(s.length / 2);
    return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
  };

  // Decide type
  let effectiveType = columnType;
  if (effectiveType === "auto") {
    const nonNullish = values.filter(
      (v) =>
        v !== null &&
        v !== undefined &&
        !(typeof v === "string" && v.trim() === "")
    );
    const allNumeric = nonNullish.length > 0 && nonNullish.every(isNumericLike);
    effectiveType = allNumeric ? "numeric" : "categorical";
  }

  if (effectiveType === "numeric") {
    const nums = values
      .filter(isNumericLike)
      .map(toNumber)
      .filter(Number.isFinite);
    const n = nums.length;
    const min = n ? Math.min(...nums) : null;
    const max = n ? Math.max(...nums) : null;
    const avg = n ? nums.reduce((a, b) => a + b, 0) / n : null;
    const med = median(nums);
    return {
      type: "numeric",
      field,
      count: n,
      min,
      max,
      avg,
      median: med,
    };
  }

  // categorical
  const freqMap = new Map();
  let total = 0;
  for (const v of values) {
    const key = v === undefined ? null : v; // normalize undefined -> null
    total += 1;
    const k = key === null ? "__NULL__" : String(key);
    freqMap.set(k, (freqMap.get(k) || 0) + 1);
  }
  const frequencies = [...freqMap.entries()]
    .map(([k, count]) => ({
      value: k === "__NULL__" ? null : k,
      count,
      pct: total ? count / total : 0,
    }))
    .sort(
      (a, b) =>
        b.count - a.count || String(a.value).localeCompare(String(b.value))
    );

  return {
    type: "categorical",
    field,
    count: total,
    frequencies,
  };
}

/**
 * Group rows by the given columns and summarize a target field per group.
 *
 * @param {Array<object>} rows                         Input rows
 * @param {string[]} groupBy                           Columns to group by (order matters)
 * @param {string} field                               Target field to summarize
 * @param {'auto'|'numeric'|'categorical'} [columnType='auto']  Force summary type or autodetect
 * @returns {Array<{ group_values: Record<string, any>, group_size: number, summary: ReturnType<typeof summarizeField> }>}
 *
 * Notes:
 * - group_values maps each groupBy column to its value (undefined normalized to null).
 * - group_size is total rows in the group (not the numeric count inside summary).
 * - summary is whatever summarizeField returns (numeric or categorical).
 */
export function groupBySummarize(rows, groupBy, field, columnType = "auto") {
  if (!Array.isArray(rows) || rows.length === 0) {
    return groupBy.length
      ? []
      : [
          {
            group_values: {},
            group_size: 0,
            summary: summarizeField([], field, columnType),
          },
        ];
  }

  const normalize = (v) => (v === undefined ? null : v);

  // Build buckets keyed by a stable JSON tuple of group-by values
  const buckets = new Map(); // key -> { rows: object[], tuple: any[] }
  for (const r of rows) {
    const tuple = groupBy.map((col) => normalize(r?.[col]));
    const key = JSON.stringify(tuple);
    let entry = buckets.get(key);
    if (!entry) {
      entry = { rows: [], tuple };
      buckets.set(key, entry);
    }
    entry.rows.push(r);
  }

  // Build output objects
  const out = [];
  for (const { rows: bucketRows, tuple } of buckets.values()) {
    const group_values = {};
    groupBy.forEach((col, i) => {
      group_values[col] = tuple[i];
    });

    out.push({
      group_values,
      group_size: bucketRows.length,
      summary: summarizeField(bucketRows, field, columnType),
    });
  }

  // Stable sort by the groupBy columns (ascending). Nulls last.
  const cmp = (a, b) => {
    for (const col of groupBy) {
      const av = a.group_values[col];
      const bv = b.group_values[col];

      const aNull = av === null || av === undefined;
      const bNull = bv === null || bv === undefined;
      if (aNull && bNull) continue;
      if (aNull) return 1; // nulls last
      if (bNull) return -1;

      // numeric-first compare when both are numbers
      if (typeof av === "number" && typeof bv === "number") {
        if (av !== bv) return av - bv;
        continue;
      }

      const as = String(av);
      const bs = String(bv);
      if (as !== bs) return as.localeCompare(bs);
    }
    return 0;
  };

  if (groupBy.length > 0) out.sort(cmp);

  // If no groupBy provided, return a single overall summary for convenience
  if (groupBy.length === 0) {
    return [
      {
        group_values: {},
        group_size: rows.length,
        summary: summarizeField(rows, field, columnType),
      },
    ];
  }

  return out;
}

/** Continuous percentile (expects a sorted numeric array). */
export function percentileCont(sorted, p) {
  if (!Array.isArray(sorted) || sorted.length === 0) return null;
  if (p <= 0) return sorted[0];
  if (p >= 1) return sorted[sorted.length - 1];
  const idx = (sorted.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  const frac = idx - lo;
  return sorted[lo] + (sorted[hi] - sorted[lo]) * frac;
}

/** IQR trimming (factor: 1.5 or 3). Returns a new sorted array when factor provided. */
export function trimIQR(values, factor) {
  const nums = (values || [])
    .map((v) => (typeof v === "number" ? v : Number(v)))
    .filter((v) => Number.isFinite(v));
  if (!nums.length || factor == null) return [...nums].sort((a, b) => a - b);
  const s = [...nums].sort((a, b) => a - b);
  const q1 = percentileCont(s, 0.25);
  const q3 = percentileCont(s, 0.75);
  if (q1 == null || q3 == null) return s;
  const iqr = q3 - q1;
  const lo = q1 - factor * iqr;
  const hi = q3 + factor * iqr;
  return s.filter((v) => v >= lo && v <= hi);
}

/**
 * Compute grouped numeric stats with optional IQR trimming.
 * Returns: [{ group_values, median, avg, min, max, count }]
 *
 * @param {Array<object>} rows
 * @param {string[]} groupBy
 * @param {string} valueKey                // e.g., "sale_price" or "ratio"
 * @param {''|'1.5'|'3'} trimChoice        // '' = no trim
 */
export function computeGroupedNumeric(
  rows,
  groupBy,
  valueKey,
  trimChoice = ""
) {
  const tf = trimChoice ? Number(trimChoice) : null;

  const buckets = new Map(); // key -> { rows: object[], tuple: any[] }
  const normalize = (v) => (v === undefined ? null : v);

  if (!groupBy?.length) {
    // ✅ ensure a real bucket object (not raw array), with empty tuple
    buckets.set("[]", { rows: rows || [], tuple: [] });
  } else {
    for (const r of rows || []) {
      const tuple = groupBy.map((col) => normalize(r?.[col]));
      const key = JSON.stringify(tuple);
      let entry = buckets.get(key);
      if (!entry) {
        entry = { rows: [], tuple };
        buckets.set(key, entry);
      }
      entry.rows.push(r);
    }
  }

  const out = [];
  for (const { rows: bucketRows, tuple } of buckets.values()) {
    const group_values = {};
    (groupBy || []).forEach(
      (col, i) => (group_values[col] = tuple?.[i] ?? null)
    );

    // Accept numbers or numeric-like strings
    const rawVals = (bucketRows || [])
      .map((r) => r?.[valueKey])
      .map((v) => (typeof v === "number" ? v : Number(v)))
      .filter((v) => Number.isFinite(v));

    const trimmed = tf
      ? trimIQR(rawVals, tf)
      : [...rawVals].sort((a, b) => a - b);
    const s = trimmed; // already sorted
    const n = s.length;
    const median = percentileCont(s, 0.5);
    const avg = n ? s.reduce((a, b) => a + b, 0) / n : null;
    const min = n ? s[0] : null;
    const max = n ? s[n - 1] : null;

    out.push({ group_values, median, avg, min, max, count: n });
  }

  // Initial stable sort by first group column (if any)
  if (groupBy?.length) {
    const first = groupBy[0];
    out.sort((a, b) =>
      String(a.group_values[first] ?? "").localeCompare(
        String(b.group_values[first] ?? "")
      )
    );
  } else {
    // single "Overall" row
    if (out.length === 1) out[0].group_values = {};
  }

  return out;
}

/**
 * Sort grouped summaries by metric or group column.
 * sortKey: "median" | "avg" | "min" | "max" | "count" | `group:<col>`
 * sortDir: "asc" | "desc"
 */
export function sortGroupSummaries(groups, sortKey, sortDir) {
  const arr = [...(groups || [])];
  const dir = sortDir === "desc" ? -1 : 1;

  arr.sort((a, b) => {
    let av, bv;

    if (String(sortKey).startsWith("group:")) {
      const col = String(sortKey).slice("group:".length);
      av = a.group_values?.[col];
      bv = b.group_values?.[col];
    } else {
      av = a?.[sortKey];
      bv = b?.[sortKey];
    }

    const aNull = av == null;
    const bNull = bv == null;
    if (aNull && bNull) return 0;
    if (aNull) return 1;
    if (bNull) return -1;

    if (typeof av === "number" && typeof bv === "number") {
      return dir * (av - bv);
    }
    const as = String(av);
    const bs = String(bv);
    return dir * as.localeCompare(bs);
  });

  return arr;
}
