"use client";

import React, { useState } from "react";
import TornadoReliefApprovalNotice from "./notice";

// Keep address_2 optional like before; add the two new required assessed fields.
const REQUIRED_HEADERS = [
  "parcel_number",
  "site_address",
  "owner_name",
  "address_1",
  "city",
  "state",
  "zip",
  "original_appraised_value",
  "adjusted_appraised_value",
  "original_assessed_value",
  "adjusted_assessed_value",
  "days_unocc",
] as const;

type Row = Record<string, string>;

// helpers to coerce TSV strings -> numbers (tolerates $ and ,)
const toCurrencyNumber = (v: string | undefined): number | undefined => {
  if (!v) return undefined;
  const cleaned = v.replace(/[$,\s]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : undefined;
};

const toInt = (v: string | undefined): number | undefined => {
  if (!v) return undefined;
  const n = Number(v.replace(/[,\s]/g, ""));
  return Number.isInteger(n) ? n : undefined;
};

export default function NoticePrinter() {
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState("");

  const handleTSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setRows([]);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result ?? "");
      const lines = text.split(/\r?\n/).filter(Boolean);
      if (lines.length === 0) {
        setError("The TSV file is empty.");
        return;
      }

      const headers = lines[0].split("\t").map((h) => h.trim().toLowerCase());

      // Validate required headers (case-insensitive)
      const missing = REQUIRED_HEADERS.filter((h) => !headers.includes(h));
      if (missing.length) {
        setError(`Missing required column(s): ${missing.join(", ")}`);
        return;
      }

      // index map for quick lookup
      const idx = Object.fromEntries(headers.map((h, i) => [h, i])) as Record<
        string,
        number
      >;

      const parsed: Row[] = lines.slice(1).map((line) => {
        const cols = line.split("\t").map((v) => v.trim());
        const row: Row = {};
        // include all headers we know about (so address_2 can still come through if present)
        headers.forEach((h) => {
          row[h] = cols[idx[h]] ?? "";
        });
        return row;
      });

      // keep any row that has at least one non-empty required field
      setRows(
        parsed.filter((r) => REQUIRED_HEADERS.some((h) => (r[h] ?? "") !== ""))
      );
    };

    reader.readAsText(file);
  };

  return (
    <div className="">
      <div className="print:hidden space-y-2">
        <label className="block text-sm font-medium">Upload TSV file</label>
        <input
          type="file"
          accept=".tsv,.txt"
          onChange={handleTSVUpload}
          className="border rounded px-3 py-2"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}

        <div>
          <p className="text-sm text-gray-600">Required headers:</p>
          <ul className="list-disc pl-5 text-sm">
            {REQUIRED_HEADERS.map((h) => (
              <li key={h}>{h}</li>
            ))}
            <li className="italic text-gray-500">address_2 (optional)</li>
          </ul>
        </div>
      </div>

      {rows.length > 0 && (
        <>
          <button
            onClick={() => window.print()}
            className="print:hidden inline-block px-4 py-2 rounded bg-blue-600 text-white"
          >
            Print
          </button>

          <div className="">
            {rows.map((data, i) => {
              // Build the props object expected by TornadoReliefApprovalNotice
              const formData = {
                parcel_number: data["parcel_number"] ?? "",
                site_address: data["site_address"] ?? "",
                owner_name: data["owner_name"] ?? "",
                address_1: data["address_1"] ?? "",
                address_2: data["address_2"] ?? "",
                city: data["city"] ?? "",
                state: data["state"] ?? "",
                zip: data["zip"] ?? "",
                original_appraised_value: toCurrencyNumber(
                  data["original_appraised_value"]
                ),
                adjusted_appraised_value: toCurrencyNumber(
                  data["adjusted_appraised_value"]
                ),
                original_assessed_value: toCurrencyNumber(
                  data["original_assessed_value"]
                ),
                adjusted_assessed_value: toCurrencyNumber(
                  data["adjusted_assessed_value"]
                ),
                days_unocc: toInt(data["days_unocc"]),
              };

              return (
                <div
                  key={i}
                  className={i < rows.length - 1 ? "break-after-page" : ""}
                >
                  <TornadoReliefApprovalNotice formData={formData} />
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
