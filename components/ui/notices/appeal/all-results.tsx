"use client";

import React, { useMemo, useState } from "react";

// ---- Helpers ----
function chunk<T>(arr: T[], size = 2): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

const REQUIRED_HEADERS = [
  "parcel_number",
  "site_address",
  "res_land_original",
  "res_structure_original",
  "res_land_new",
  "res_structure_new",
  "com_land_original",
  "com_structure_original",
  "com_land_new",
  "com_structure_new",
  "appeal_type",
  "appeal_number",
  "hearing_date",
] as const;

type TSVRow = Record<(typeof REQUIRED_HEADERS)[number], string> &
  Record<string, string>;

const toNum = (v: string | number | undefined) => {
  if (v === undefined || v === null) return 0;
  const s = String(v).replace(/[, ]+/g, "");
  const n = parseInt(s, 10);
  return Number.isFinite(n) ? n : 0;
};

const onlyDate = (s: string) => {
  const m = String(s).match(/^\d{4}-\d{2}-\d{2}/);
  return m ? m[0] : s;
};

const labelize = (key: string) =>
  key
    .split("_")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");

// ---- Component ----
export default function HearingResultsCardsTwoPerPage() {
  const [rows, setRows] = useState<TSVRow[]>([]);
  const [error, setError] = useState<string>("");

  const handleTSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result ?? "").trim();
        if (!text) {
          setRows([]);
          setError("The file appears to be empty.");
          return;
        }

        const lines = text.split(/\r?\n/);
        const headers = lines[0].split("\t").map((h) => h.trim());

        const missing = REQUIRED_HEADERS.filter((h) => !headers.includes(h));
        if (missing.length > 0) {
          setRows([]);
          setError(`Missing required column(s): ${missing.join(", ")}`);
          return;
        }

        const parsed: TSVRow[] = lines.slice(1).map((line) => {
          const values = line.split("\t").map((v) => v.trim());
          const row: Record<string, string> = {};
          headers.forEach((h, i) => (row[h] = values[i] ?? ""));
          return row as TSVRow;
        });

        setRows(parsed);
      } catch (err) {
        console.error(err);
        setRows([]);
        setError(
          "There was a problem reading the TSV. Please check the file format."
        );
      }
    };

    reader.readAsText(file);
  };

  // Columns AFTER hearing_date = voting/board result columns
  const boardColumns = useMemo(() => {
    if (rows.length === 0) return [] as string[];
    const allCols = Object.keys(rows[0]);
    const cutoffIndex = allCols.indexOf("hearing_date");
    return cutoffIndex >= 0 ? allCols.slice(cutoffIndex + 1) : [];
  }, [rows]);

  // Precompute assessed values and totals
  const formatted = useMemo(() => {
    return rows.map((r) => {
      const assessed = {
        res_land_original: toNum(r.res_land_original),
        res_land_new: toNum(r.res_land_new),
        res_structure_original: toNum(r.res_structure_original),
        res_structure_new: toNum(r.res_structure_new),
        com_land_original: toNum(r.com_land_original),
        com_land_new: toNum(r.com_land_new),
        com_structure_original: toNum(r.com_structure_original),
        com_structure_new: toNum(r.com_structure_new),
      };

      const total_original =
        assessed.res_land_original +
        assessed.res_structure_original +
        assessed.com_land_original +
        assessed.com_structure_original;

      const total_new =
        assessed.res_land_new +
        assessed.res_structure_new +
        assessed.com_land_new +
        assessed.com_structure_new;

      return {
        ...r,
        assessed,
        total_original,
        total_new,
        hearingDateOnly: onlyDate(r.hearing_date),
      };
    });
  }, [rows]);

  // Two cards per printed page
  const pairs = useMemo(() => chunk(formatted, 2), [formatted]);

  return (
    <div className="space-y-4 text-black">
      {/* Upload */}
      <div className="print:hidden">
        <label className="block mb-2 text-sm font-medium">
          Upload Hearing Results (.tsv)
        </label>
        <input
          type="file"
          accept=".tsv,.txt"
          onChange={handleTSVUpload}
          className="border border-black rounded px-4 py-2 w-full md:w-96 bg-white text-black"
        />
        {error && <p className="mt-2 text-sm font-medium">{error}</p>}
        {!error && rows.length === 0 && (
          <p className="mt-2 text-sm">
            Expected headers:{" "}
            <span className="font-medium">{REQUIRED_HEADERS.join(", ")}</span>
          </p>
        )}
      </div>

      {/* Cards: two per printed page */}
      <div className="space-y-4">
        {pairs.length === 0 ? (
          <div className="border border rounded p-4 text-center bg-white">
            Upload a TSV file to display results.
          </div>
        ) : (
          pairs.map((pair, pairIdx) => (
            <div
              key={`pair-${pairIdx}`}
              className={
                pairIdx < pairs.length - 1
                  ? "space-y-4 print:break-after-page"
                  : "space-y-4"
              }
            >
              {pair.map((r, i) => (
                <div
                  key={`${r.parcel_number}-${r.appeal_number}-${pairIdx}-${i}`}
                  className="border rounded p-4 bg-white space-y-3 break-inside-avoid print:break-inside-avoid"
                >
                  {/* Card header */}
                  <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                    <div className="flex flex-wrap items-baseline gap-x-3">
                      <div className="text-base font-semibold">
                        {r.parcel_number}
                      </div>
                      <div className="text-sm">{r.site_address}</div>
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold">Appeal #:</span>{" "}
                      {r.appeal_number} <span className="mx-2">|</span>
                      <span className="font-semibold">Hearing date:</span>{" "}
                      {r.hearingDateOnly} <span className="mx-2">|</span>
                      <span className="font-semibold">Type:</span>{" "}
                      {r.appeal_type}
                    </div>
                  </div>

                  {/* Assessed Value Table (mimic your structure) */}
                  <div className="text-xs">
                    <div className="overflow-x-auto border rounded">
                      <table className="min-w-full table-auto border-collapse text-xs">
                        <thead>
                          <tr>
                            <th className="border px-4 py-2 text-left">
                              Category
                            </th>
                            <th className="border px-4 py-2 text-right">
                              Original Appraised Value
                            </th>
                            <th className="border px-4 py-2 text-right">
                              New Appraised Value
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            {
                              label: "Residential Land",
                              original: r.assessed.res_land_original,
                              new: r.assessed.res_land_new,
                            },
                            {
                              label: "Residential Improvements",
                              original: r.assessed.res_structure_original,
                              new: r.assessed.res_structure_new,
                            },
                            {
                              label: "Commercial Land",
                              original: r.assessed.com_land_original,
                              new: r.assessed.com_land_new,
                            },
                            {
                              label: "Commercial Improvements",
                              original: r.assessed.com_structure_original,
                              new: r.assessed.com_structure_new,
                            },
                          ].map((row) => (
                            <tr key={row.label}>
                              <td className="border px-4 py-2">{row.label}</td>
                              <td className="border px-4 py-2 text-right">
                                ${row.original.toLocaleString()}
                              </td>
                              <td className="border px-4 py-2 text-right">
                                ${row.new.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                          <tr className="font-semibold">
                            <td className="border px-4 py-2">Total</td>
                            <td className="border px-4 py-2 text-right">
                              ${r.total_original.toLocaleString()}
                            </td>
                            <td className="border px-4 py-2 text-right">
                              ${r.total_new.toLocaleString()}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Voting Results as chips (black & white) */}
                  {boardColumns.length > 0 && (
                    <div className="text-xs">
                      <div className="mb-2 font-semibold">Voting Results</div>
                      <div className="flex flex-wrap gap-2">
                        {boardColumns.map((col) => {
                          const raw = String(
                            //@ts-expect-error ts
                            (r as Record<string, string>)[col] ?? ""
                          ).trim();
                          if (!raw) return null;
                          return (
                            <span
                              key={col}
                              className="inline-flex items-center gap-1 border rounded px-2 py-1 bg-white"
                              title={labelize(col)}
                            >
                              <span className="font-semibold">
                                {labelize(col)}
                              </span>
                              <span className="mx-1">·</span>
                              <span>{raw}</span>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
