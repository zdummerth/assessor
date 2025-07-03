"use client";

import React, { useState, useMemo } from "react";
import { Tables } from "@/database-types";
import ParcelNumber from "../ui/parcel-number-updated";
import { House, LayoutList } from "lucide-react";
import Image from "next/image";

const STORAGE_PREFIX =
  "https://ptaplfitlcnebqhoovrv.supabase.co/storage/v1/object/public/parcel-images/";

type Comparable = Tables<"test_comparables">;

export default function ComparablesTable({ values }: { values: any[] }) {
  const [layout, setLayout] = useState<"table" | "card">("table");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  if (values.length === 0) return null;

  const subject = values[0];
  if (!subject?.subject_parcel) {
    return (
      <div className="w-full flex flex-col items-center justify-center mt-16">
        <p className="text-center">No comparables found</p>
      </div>
    );
  }

  const comparables = values;

  const selectedComps = useMemo(
    () =>
      comparables.filter(
        (comp) => comp.parcel_id?.id && selectedIds.includes(comp.parcel_id.id)
      ),
    [comparables, selectedIds]
  );

  const computeStats = (key: "net_selling_price" | "adjusted_price") => {
    const values = selectedComps
      .map((comp) => Number(comp[key] || 0))
      .sort((a, b) => a - b);
    if (values.length === 0) return { median: 0, average: 0 };
    const median =
      values.length % 2 === 1
        ? values[Math.floor(values.length / 2)]
        : (values[values.length / 2 - 1] + values[values.length / 2]) / 2;
    const average = values.reduce((a, b) => a + b, 0) / values.length;
    return { median, average };
  };

  const saleStats = computeStats("net_selling_price");
  const adjustedStats = computeStats("adjusted_price");

  const getImageUrl = (record: any) => {
    const imageName =
      record.parcel_id.test_parcel_image_primary?.test_images?.image_url ||
      record.parcel_id.test_parcel_images?.[0]?.test_images?.image_url ||
      null;
    return imageName ? STORAGE_PREFIX + imageName : null;
  };

  const toggleSelection = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    const allIds = comparables
      .map((comp) => comp.parcel_id?.id)
      .filter(Boolean);
    setSelectedIds(allIds);
  };

  const deselectAll = () => {
    setSelectedIds([]);
  };

  const LayoutToggle = () => (
    <div className="flex gap-2 mb-4 print:hidden">
      <button
        className={`p-2 border rounded ${layout === "table" ? "bg-blue-100" : ""}`}
        onClick={() => setLayout("table")}
      >
        <LayoutList className="w-4 h-4" />
      </button>
      <button
        className={`p-2 border rounded ${layout === "card" ? "bg-blue-100" : ""}`}
        onClick={() => setLayout("card")}
      >
        <span className="text-sm">Card</span>
      </button>
      <button
        className="p-2 border rounded bg-green-100 text-sm"
        onClick={selectAll}
      >
        Select All
      </button>
      <button
        className="p-2 border rounded bg-red-100 text-sm"
        onClick={deselectAll}
      >
        Deselect All
      </button>
    </div>
  );

  const ParcelCard = ({ record, index }: { record: any; index: number }) => {
    const imageUrl = getImageUrl(record);
    const id = record.parcel_id?.id;

    return (
      <div
        className={`border rounded p-4 break-inside-avoid print:w-full ${
          selectedIds.includes(id) ? "" : "print:hidden"
        }`}
      >
        <div className="flex gap-6 mb-4">
          <div className="w-48 h-48 relative">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt="Parcel"
                fill
                className="object-cover rounded"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
                <House className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <div className="text-xl font-semibold">{`Comp ${index + 1}`}</div>
            <ParcelNumber {...record.parcel_id} />
            <div className="text-base text-gray-800">{record.address}</div>
            <div className="flex flex-wrap gap-4">
              <div className="text-sm text-gray-600">
                <strong>Neighborhood:</strong> {record.neighborhood_code} –{" "}
                {record.neighborhood_group}
              </div>
              <div className="text-sm text-gray-600">
                <strong>Land Use:</strong> {record.land_use}
              </div>
              <div className="text-sm text-gray-600">
                <strong>CDU:</strong> {record.cdu} | <strong>GLA:</strong>{" "}
                {record.total_living_area?.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">
                <strong>Sale Price:</strong> $
                {Number(record.net_selling_price || 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">
                <strong>Adjusted Price:</strong> $
                {Number(record.adjusted_price || 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">
                <strong>Date of Sale:</strong>{" "}
                {record.date_of_sale
                  ? new Date(record.date_of_sale).toLocaleDateString()
                  : "—"}
              </div>
              <div className="text-sm text-gray-600">
                <strong>Gower Dist:</strong> {record.gower_dist?.toFixed(4)} |{" "}
                <strong>Miles:</strong> {record.miles_distance?.toFixed(2)} mi
              </div>
              <div className="text-sm text-gray-600">
                <strong>Sale ID:</strong> {record.sale_id}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-2 print:hidden">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={selectedIds.includes(id)}
              onChange={() => toggleSelection(id)}
            />
            <span className="ml-2 text-sm">Select</span>
          </label>
        </div>
      </div>
    );
  };

  const subjectImageName =
    subject.subject_parcel.test_parcel_image_primary?.test_images?.image_url ||
    subject.subject_parcel.test_parcel_images?.[0]?.test_images?.image_url ||
    null;

  const subjectImageUrl = subjectImageName
    ? STORAGE_PREFIX + subjectImageName
    : null;

  console.log("Subject Image URL:", subject.subject_parcel);

  return (
    <div className="w-full">
      <div className="mb-6 p-4 border rounded bg-yellow-50">
        <div className="flex items-center gap-4">
          <div className="w-48 h-48 relative">
            {subjectImageUrl ? (
              <Image
                src={subjectImageUrl}
                alt="Subject"
                fill
                className="object-cover rounded"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded">
                <House className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex justiyfy-between w-full">
            <div>
              <div className="text-lg mb-1">Subject Parcel</div>
              <ParcelNumber {...subject.subject_parcel} />
              <div className="">{subject.subject_address}</div>
              <div className="">
                {subject.subject_neighborhood_code} –{" "}
                {subject.subject_neighborhood_group} |{" "}
                {subject.subject_land_use}
              </div>
              <div className="">
                CDU: {subject.subject_cdu} | GLA:{" "}
                {subject.subject_total_living_area?.toLocaleString()}
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-2 text-sm text-gray-700">
            <div>
              <strong>Selected Comparables:</strong> {selectedComps.length}
            </div>

            <table className="text-sm text-left text-gray-700 border w-full max-w-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">Metric</th>
                  <th className="px-4 py-2 border">Median</th>
                  <th className="px-4 py-2 border">Average</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border font-semibold">Sale Price</td>
                  <td className="px-4 py-2 border">
                    ${Math.round(saleStats.median || 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border">
                    ${Math.round(saleStats.average || 0).toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border font-semibold">
                    Adjusted Price
                  </td>
                  <td className="px-4 py-2 border">
                    ${Math.round(adjustedStats.median || 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border">
                    ${Math.round(adjustedStats.average || 0).toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <LayoutToggle />

      {layout === "table" ? (
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700 print:hidden">
              <tr>
                <th className="px-4 py-2">Select</th>
                <th className="px-4 py-2">Image</th>
                <th className="px-4 py-2">Parcel</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Address</th>
                <th className="px-4 py-2">Neighborhood</th>
                <th className="px-4 py-2">Land Use</th>
                <th className="px-4 py-2">Sale Price</th>
                <th className="px-4 py-2">Adjusted Price</th>
              </tr>
            </thead>
            <tbody>
              {comparables.map((comp, i) => {
                const imageUrl = getImageUrl(comp);
                const id = comp.parcel_id?.id;
                const isSelected = selectedIds.includes(id);
                return (
                  <tr key={id} className={!isSelected ? "print:hidden" : ""}>
                    <td className="px-4 py-2 print:hidden">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelection(id)}
                      />
                    </td>
                    <td className="px-4 py-2">
                      <div className="w-24 h-24 relative rounded overflow-hidden">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt="Placeholder"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <House className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <ParcelNumber {...comp.parcel_id} />
                    </td>
                    <td className="px-4 py-2">{`Comp ${i + 1}`}</td>
                    <td className="px-4 py-2">{comp.address}</td>
                    <td className="px-4 py-2">
                      {comp.neighborhood_code} – {comp.neighborhood_group}
                    </td>
                    <td className="px-4 py-2">{comp.land_use}</td>
                    <td className="px-4 py-2">
                      ${Number(comp.net_selling_price || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-2">
                      ${Number(comp.adjusted_price || 0).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="w-full space-y-6 print:columns-1 print:gap-4 print:[&>*:nth-child(3n)]:mb-16">
          {comparables.map((comp, i) => (
            <ParcelCard key={comp.parcel_id?.id} record={comp} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
