"use client";

import React from "react";
import NoticeHeader from "../header";
import FormattedDate from "../../formatted-date";
import siganatureImage from "@/public/shawns-signature.png";
import Image from "next/image";

export default function Notice({ formData }: { formData: any }) {
  const currentTimestampString = new Date().toLocaleString("en-US", {
    timeZone: "America/Chicago",
  });

  const requiredFieldsEntered =
    formData?.parcel_number &&
    formData?.owner_name &&
    formData?.address_1 &&
    (formData?.address_2 ||
      (formData?.city && formData?.state && formData?.zip)) &&
    formData?.site_address;

  const calculateAssessed = (
    value: number | string,
    multiplier: number,
    roundTo: number
  ) => {
    const raw = Number(value || 0) * multiplier;
    return Math.round(raw / roundTo) * roundTo;
  };

  const assessed = {
    res_land_original: calculateAssessed(formData.res_land_original, 0.19, 10),
    res_structure_original: calculateAssessed(
      formData.res_structure_original,
      0.19,
      10
    ),
    res_land_new: calculateAssessed(formData.res_land_new, 0.19, 10),
    res_structure_new: calculateAssessed(formData.res_structure_new, 0.19, 10),
    com_land_original: calculateAssessed(formData.com_land_original, 0.32, 100),
    com_structure_original: calculateAssessed(
      formData.com_structure_original,
      0.32,
      100
    ),
    com_land_new: calculateAssessed(formData.com_land_new, 0.32, 100),
    com_structure_new: calculateAssessed(formData.com_structure_new, 0.32, 100),
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

  return (
    <div className="w-[90%] mx-auto print:break-after-page border p-8 print:p-0 print:border-none print:bg-white print:text-black">
      <NoticeHeader
        mailingName={formData.owner_name}
        mailingAddress1={formData.address_1}
        mailingAddress2={formData.address_2}
        mailingCity={formData.city}
        mailingState={formData.state}
        mailingZip={formData.zip}
        date={currentTimestampString}
      />

      {requiredFieldsEntered ? (
        <>
          <div className="my-4 flex flex-wrap gap-8 text-xs">
            <div>
              <p>Parcel Number</p>
              <div>{formData.parcel_number}</div>
            </div>
            <div>
              <p>Property Address</p>
              <div>{formData.site_address}</div>
            </div>
            <div>
              <p>Hearing Date</p>
              <div>
                <FormattedDate date={formData.hearing_date} />
              </div>
            </div>
            <div>
              <p>Appeal Number</p>
              <div>{formData.appeal_number}</div>
            </div>
          </div>

          {/* Assessed Value Table */}
          <div className="my-4 text-xs">
            <div className="overflow-x-auto border rounded">
              <table className="min-w-full table-auto border-collapse text-xs">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-4 py-2 text-left">Category</th>
                    <th className="border px-4 py-2 text-right">
                      Original Assessed Value
                    </th>
                    <th className="border px-4 py-2 text-right">
                      New Assessed Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      label: "Residential Land",
                      original: assessed.res_land_original,
                      new: assessed.res_land_new,
                    },
                    {
                      label: "Residential Structure",
                      original: assessed.res_structure_original,
                      new: assessed.res_structure_new,
                    },
                    {
                      label: "Commercial Land",
                      original: assessed.com_land_original,
                      new: assessed.com_land_new,
                    },
                    {
                      label: "Commercial Structure",
                      original: assessed.com_structure_original,
                      new: assessed.com_structure_new,
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
                  <tr className="font-semibold bg-gray-50">
                    <td className="border px-4 py-2">Total</td>
                    <td className="border px-4 py-2 text-right">
                      ${total_original.toLocaleString()}
                    </td>
                    <td className="border px-4 py-2 text-right">
                      ${total_new.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="text-xs space-y-4">
            <p>
              Enclosed is a copy of the decision of the Board of Equalization
              regarding your property appeal for this year. The assessed value
              per the decision is shown above.
            </p>

            <p>
              If you disagree with the decision rendered by the Board of
              Equalization, you have the right to file an appeal with the State
              Tax Commission (STC). If you choose to appeal, you may request the
              appeal form(s) from the STC at:
            </p>

            <div className="pl-4 flex justify-between">
              <div>
                <p>
                  <strong>Attn:</strong> Legal Coordinator
                </p>
                <p>State Tax Commission of Missouri</p>
                <p>P.O. Box 146</p>
                <p>Jefferson City, MO 65102-0146</p>
              </div>
              <div>
                <p>Phone: (573) 751-2414</p>
                <p>Fax: (573) 751-1341</p>
              </div>
            </div>

            <p>
              Or you may download the forms from the STC website:{" "}
              <a
                href="https://stc.mo.gov/file-an-appeal/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                https://stc.mo.gov/file-an-appeal/
              </a>
            </p>

            <p>
              The completed appeal form(s) must be filed (delivered or
              postmarked) no later than thirty days after the date of the Board
              of Equalization notice or by <strong>September 30th</strong>,
              whichever is later.
            </p>
          </div>

          {/* Signature Line */}
          <div className="mt-8 text-sm text-left">
            {/* <div className="border-t border-black w-64 mb-1" /> */}
            <Image
              src={siganatureImage}
              alt="Signature"
              width={200}
              height={74}
            />
            <p className="font-semibold">Shawn T. Ordway</p>
            <p className="text-xs">Interim Assessor</p>
          </div>
        </>
      ) : (
        <div className="text-sm text-red-600">
          <p className="mb-4">
            Please fill out all required fields to generate the notice.
          </p>
          <ul className="list-disc pl-5">
            <li>Owner Name</li>
            <li>Address 1</li>
            <li>City</li>
            <li>State</li>
            <li>ZIP Code</li>
            <li>Parcel Number</li>
            <li>Site Address</li>
          </ul>
        </div>
      )}
    </div>
  );
}
