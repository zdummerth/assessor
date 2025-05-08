import React from "react";
import CopyToClipboard from "@/components/copy-to-clipboard";
import FormattedDate from "@/components/ui/formatted-date";
import Address from "../address";
import ParcelNumber from "../parcel-number";
import { ArrowRight } from "lucide-react";

export default function AppealTable({ appeals }: any) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
              Year
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
              Appeal
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
              Type
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
              Status
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
              Before → After
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
              Parcel
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
              Address
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
              Appraised
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
              Nbd
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
              Occ
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
              Appraiser
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
              Hearing
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {appeals.map((a: any) => (
            <tr
              key={a.appeal_number}
              className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                {a.year}
              </td>

              <td className="px-4 py-3 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-gray-800 dark:text-gray-100">
                    {a.appeal_number}
                  </span>
                  <CopyToClipboard
                    text={a.appeal_number.toString().padStart(10, "0")}
                  />
                </div>
              </td>

              <td className="px-4 py-3 text-sm">
                <span className="inline-block text-xs font-medium px-2 py-1">
                  {a.appeal_type}
                </span>
              </td>

              <td className="px-4 py-3 text-sm">
                <span className="inline-block text-xs font-medium px-2 py-1 rounded-full">
                  {a.status}
                </span>
              </td>

              <td className="px-4 py-3 text-sm">
                <div className="flex items-center space-x-1">
                  <span>${a.before_total.toLocaleString()}</span>
                  <ArrowRight size={14} className="text-gray-400" />
                  <span>${a.after_total.toLocaleString()}</span>
                </div>
              </td>

              <td className="px-4 py-3 text-sm font-mono text-gray-700 dark:text-gray-200">
                <ParcelNumber parcelNumber={a.parcel_year.parcel_number} />
              </td>

              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                <Address
                  address={`
                    ${a.parcel_year.site_street_number || ""}
                    ${a.parcel_year.prefix_directional || ""}
                    ${a.parcel_year.site_street_name || ""}
                    ${a.parcel_year.site_zip_code || ""}
                  `}
                />
              </td>

              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                ${a.parcel_year.appraised_total.toLocaleString()}
              </td>

              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                {a.parcel_year.neighborhood}
              </td>

              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                {a.parcel_year.land_use}
              </td>

              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                {a.appeal_appraiser}
              </td>

              <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-200">
                {a.hearing_ts ? (
                  <FormattedDate date={a.hearing_ts} showTime />
                ) : (
                  <span className="italic text-gray-400">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
