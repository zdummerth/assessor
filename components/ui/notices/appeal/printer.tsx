"use client";

import React, { useState } from "react";
import Notice from "./decision-letter";

const REQUIRED_HEADERS = [
  "parcel_number",
  "owner_name",
  "address_1",
  "address_2",
  "city",
  "state",
  "zip",
  "site_address",
  "appeal_number",
  "room",
  "hearing_date",
  "res_land_original",
  "res_structure_original",
  "res_land_new",
  "res_structure_new",
  "com_land_original",
  "com_structure_original",
  "com_land_new",
  "com_structure_new",
];

export default function NoticePrinter() {
  const [notices, setNotices] = useState<any[]>([]);
  const [error, setError] = useState("");

  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const lines = text.trim().split("\n");
      const headers = lines[0].split(",").map((h) => h.trim());

      // Check for missing headers
      const missing = REQUIRED_HEADERS.filter(
        (required) => !headers.includes(required)
      );

      if (missing.length > 0) {
        setError(
          `The CSV file is missing required column(s): ${missing.join(", ")}`
        );
        setNotices([]);
        return;
      }

      const rows = lines.slice(1).map((line) => {
        const values = line.split(",").map((v) => v.trim());
        const row: Record<string, string> = {};
        headers.forEach((header, i) => {
          row[header] = values[i] ?? "";
        });
        return row;
      });

      setNotices(rows);
    };

    reader.readAsText(file);
  };

  return (
    <>
      <div className="p-4 print:hidden">
        <label className="block mb-2 text-sm font-medium">
          Upload CSV File
        </label>
        <input
          type="file"
          accept=".csv"
          onChange={handleCSVUpload}
          className="border rounded px-4 py-2"
        />
        {error && (
          <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>
        )}
      </div>
      <div className="mb-6 p-4 print:hidden">
        <p className="mb-4 text-sm text-gray-600">
          Upload a CSV file with the following headers:
        </p>
        <ul className="list-disc pl-5 mb-4">
          {REQUIRED_HEADERS.map((header) => (
            <li key={header} className="text-sm text-gray-800">
              {header}
            </li>
          ))}
        </ul>
      </div>

      {notices.length > 0 && (
        <div>
          <button
            onClick={() => window.print()}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded print:hidden"
          >
            Print Notices
          </button>

          <div className="">
            {notices.map((data, i) => (
              <div
                key={i}
                className={i < notices.length - 1 ? "break-after-page" : ""}
              >
                <Notice formData={data} />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
