// /lib/csv.ts
"use client";

/**
 * Convert an array of objects into CSV text.
 * - Preserves header order when provided.
 * - Escapes quotes/newlines, and prefixes BOM for Excel compatibility.
 */
export function toCsv(
  rows: Record<string, any>[],
  headerOrder?: string[]
): string {
  if (!rows?.length) return "";
  const headers = headerOrder?.length ? headerOrder : Object.keys(rows[0]);

  const escape = (v: any) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    // RFC4180 escaping: wrap if comma/quote/newline; double-up quotes
  };

  const lines = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(",")),
  ];

  // Add BOM for Excel to detect UTF-8
  return "\uFEFF" + lines.join("\n");
}

/**
 * Trigger a CSV download in the browser.
 */
export function downloadCsv(filename: string, csv: string) {
  if (typeof window === "undefined") return; // no-op on server
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/**
 * Convenience: build CSV from rows + optional headers and download it.
 */
export function downloadCsvFromRows(
  filename: string,
  rows: Record<string, any>[],
  headerOrder?: string[]
) {
  const csv = toCsv(rows, headerOrder);
  downloadCsv(filename, csv);
}
