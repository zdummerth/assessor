"use client";

import React, { useState } from "react";
import RatioCompareClient from "./client";

export type TSVRow = Record<string, string>;

export default function RatioStudyTSVTable() {
  const [rows, setRows] = useState<TSVRow[]>([]);
  const [error, setError] = useState("");

  const handleTSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setRows([]);

    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const lines = text.trim().split("\n");

      if (lines.length < 2) {
        setError("TSV file appears to be empty or invalid.");
        return;
      }

      const headers = lines[0].split("\t").map((h) => h.trim());

      const parsedRows = lines.slice(1).map((line) => {
        const values = line.split("\t");
        const row: TSVRow = {};
        headers.forEach((header, i) => {
          row[header] = values[i]?.trim() ?? "";
        });
        return row;
      });

      setRows(parsedRows);
    };

    reader.readAsText(file);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Upload */}
      <div className="print:hidden">
        <label className="block mb-2 text-sm font-medium">
          Upload Ratio Study TSV
        </label>
        <input
          type="file"
          accept=".tsv"
          onChange={handleTSVUpload}
          className="border rounded px-4 py-2"
        />
        {error && (
          <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>
        )}
      </div>

      {/* Report */}
      {rows.length > 0 && <RatioCompareClient rows={rows} />}
    </div>
  );
}
