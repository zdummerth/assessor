"use client";

import React, { useState } from "react";
import Notice from "./notice";
import {
  REQUIRED_HEADERS,
  type NoticeFormData,
  type RequiredHeader,
} from "./shared";

export default function NoticePrinter() {
  const [rows, setRows] = useState<NoticeFormData[]>([]);
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

      // Validate required headers against the type keys
      const missing = REQUIRED_HEADERS.filter((h) => !headers.includes(h));
      if (missing.length) {
        setError(`Missing required column(s): ${missing.join(", ")}`);
        return;
      }

      const idx = Object.fromEntries(headers.map((h, i) => [h, i])) as Record<
        string,
        number
      >;

      const parsed: NoticeFormData[] = lines.slice(1).map((line) => {
        const cols = line.split("\t").map((v) => v.trim());

        // Build a row with only the required headers (matches NoticeFormData keys)
        const row = REQUIRED_HEADERS.reduce(
          (acc, h) => {
            acc[h] = cols[idx[h]] ?? "";
            return acc;
          },
          {} as Record<RequiredHeader, string>
        ) as NoticeFormData;

        return row;
      });

      // Keep rows that have at least one non-empty value (optional)
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
          <p className="text-sm text-gray-600">Required headers:</p>
          <ul className="list-disc pl-5 text-sm">
            {REQUIRED_HEADERS.map((h) => (
              <li key={h}>{h}</li>
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
                className={i < rows.length - 1 ? "break-after-page" : ""}
              >
                <Notice formData={data} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
