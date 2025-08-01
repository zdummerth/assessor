"use client";

import React, { useState } from "react";
import NoticeFromHearings from "@/components/ui/notices/appeal/hearing";
import GroupedNoticeFromHearings from "@/components/ui/notices/appeal/hearing-grouped";

const REQUIRED_HEADERS = [
  "parcel",
  "property_class",
  "appeal",
  "situs",
  "hearing_datetime",
  "hearing_room",
  "email",
  "name",
  "address1",
  "address2",
  "city",
  "state_code",
  "zip_code",
  "source",
];

export default function NoticePrinterFromHearingsWithSwitch() {
  const [notices, setNotices] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [viewType, setViewType] = useState<"individual" | "grouped">(
    "individual"
  );

  const handleTSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const lines = text.trim().split("\n");
      const headers = lines[0].split("\t").map((h) => h.trim());

      const missing = REQUIRED_HEADERS.filter((h) => !headers.includes(h));
      if (missing.length > 0) {
        setError(`Missing required column(s): ${missing.join(", ")}`);
        setNotices([]);
        return;
      }

      const rows = lines.slice(1).map((line) => {
        const values = line.split("\t").map((v) => v.trim());
        const row: Record<string, string> = {};
        headers.forEach((header, i) => {
          row[header] = values[i] ?? "";
        });

        return {
          parcel_number: row["parcel"],
          owner_name: row["name"],
          address_1: row["address1"],
          address_2: row["address2"],
          city: row["city"],
          state: row["state_code"],
          zip: row["zip_code"],
          site_address: row["situs"],
          appeal_number: row["appeal"],
          room: row["hearing_room"] || "Kennedy Hearing Room 208",
          hearing_date: row["hearing_datetime"],
          res_land_original: 0,
          res_structure_original: 0,
          res_land_new: 0,
          res_structure_new: 0,
          com_land_original: 0,
          com_structure_original: 0,
          com_land_new: 0,
          com_structure_new: 0,
        };
      });

      setNotices(rows);
    };

    reader.readAsText(file);
  };

  return (
    <>
      <div className="p-4 print:hidden">
        <label className="block mb-2 text-sm font-medium">
          Upload Hearing TSV File
        </label>
        <input
          type="file"
          accept=".tsv,text/tab-separated-values"
          onChange={handleTSVUpload}
          className="border rounded px-4 py-2"
        />
        {error && (
          <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>
        )}
      </div>

      {notices.length > 0 && (
        <div className="p-4 print:hidden">
          <label className="block mb-1 text-sm font-medium">View Mode</label>
          <select
            value={viewType}
            onChange={(e) =>
              setViewType(e.target.value as "individual" | "grouped")
            }
            className="border px-3 py-2 rounded text-sm"
          >
            <option value="individual">Individual Notices</option>
            <option value="grouped">Grouped Notices by Owner/Address</option>
          </select>
        </div>
      )}

      {notices.length > 0 && (
        <div className="px-4">
          <button
            onClick={() => window.print()}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded print:hidden"
          >
            Print Notices
          </button>

          {viewType === "individual" ? (
            <div className="space-y-8 print:space-y-0">
              {notices.map((data, i) => (
                <div
                  key={i}
                  className={i < notices.length - 1 ? "break-after-page" : ""}
                >
                  <NoticeFromHearings formData={data} />
                </div>
              ))}
            </div>
          ) : (
            <GroupedNoticeFromHearings data={notices} />
          )}
        </div>
      )}
    </>
  );
}
