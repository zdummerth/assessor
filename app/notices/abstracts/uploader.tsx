"use client";

import React, { useState } from "react";
import AbstractNotice from "./notice";
import {
  HEADER_MAP,
  REQUIRED_HEADERS,
  type AbstractFormData,
  DISPLAY_ORDER,
} from "./shared";

export default function AbstractPrinter() {
  const [rows, setRows] = useState<AbstractFormData[]>([]);
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

      // Normalize headers by trimming and uppercasing to match HEADER_MAP keys
      const rawHeaders = lines[0].split("\t").map((h) => h.trim());
      const normalized = rawHeaders.map((h) => h.toUpperCase());

      // Validate presence of all raw headers in the file
      const requiredRawHeaders = Object.keys(HEADER_MAP);
      const missingRaw = requiredRawHeaders.filter(
        (raw) => !normalized.includes(raw)
      );
      if (missingRaw.length) {
        setError(`Missing required column(s): ${missingRaw.join(", ")}`);
        return;
      }

      // Build an index lookup for raw header -> column index
      const idx: Record<string, number> = {};
      normalized.forEach((h, i) => {
        idx[h] = i;
      });

      // Parse rows into canonical AbstractFormData shape
      const parsed: AbstractFormData[] = lines.slice(1).map((line) => {
        const cols = line.split("\t").map((v) => v.trim());
        const obj = {} as AbstractFormData;

        for (const { raw, key } of DISPLAY_ORDER) {
          const i = idx[raw];
          obj[key] = i != null ? (cols[i] ?? "") : "";
        }
        return obj;
      });

      // Keep any row with at least one non-empty value (optional)
      setRows(parsed.filter((r) => Object.values(r).some((v) => v !== "")));
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
          <p className="text-sm text-gray-600">Required headers (from file):</p>
          <ul className="list-disc pl-5 text-sm">
            {DISPLAY_ORDER.map(({ raw }) => (
              <li key={raw}>{raw}</li>
            ))}
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
            {rows.map((data, i) => (
              <div
                key={i}
                className={[
                  "print:break-inside-avoid",
                  "print:[page-break-inside:avoid]",
                  i < rows.length - 1 ? "mb-4 border-b-2 border-black" : "",
                ].join(" ")}
              >
                <AbstractNotice formData={data} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
