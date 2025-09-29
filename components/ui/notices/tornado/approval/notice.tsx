"use client";

import React from "react";
import NoticeHeader from "../../header";
import Image from "next/image";
import signatureImage from "@/public/shawns-signature.png";

type NoticeFormData = {
  parcel_number?: string;
  site_address?: string;
  owner_name?: string;
  address_1?: string;
  address_2?: string;
  city?: string;
  state?: string;
  zip?: string;

  // NEW FIELDS (approval specifics)
  original_assessed_value?: number; // cents not assumed; pass whole-dollar integer
  adjusted_assessed_value?: number; // after proration/relief
  days_unoccupied?: number; // total calendar days
};

export default function TornadoReliefApprovalNotice({
  formData,
}: {
  formData: NoticeFormData;
}) {
  const currentTimestampString = new Date().toLocaleString("en-US", {
    timeZone: "America/Chicago",
  });

  const requiredFieldsEntered =
    !!formData?.parcel_number &&
    !!formData?.site_address &&
    !!formData?.owner_name &&
    !!(
      formData?.address_1 ||
      formData?.address_2 ||
      (formData?.city && formData?.state && formData?.zip)
    );

  const fmtUSD = (n?: number) =>
    typeof n === "number" && Number.isFinite(n)
      ? n.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        })
      : "—";

  return (
    <div className="w-[90%] mx-auto print:break-after-page border p-8 print:p-4 print:border-none print:bg-white print:text-black text-sm leading-6">
      <NoticeHeader
        mailingName={formData.owner_name ?? ""}
        mailingAddress1={formData.address_1 ?? ""}
        mailingAddress2={formData.address_2 ?? ""}
        mailingCity={formData.city ?? ""}
        mailingState={formData.state ?? ""}
        mailingZip={formData.zip ?? ""}
        date={currentTimestampString}
      />

      {requiredFieldsEntered ? (
        <>
          {/* Parcel + Site Address */}
          <div className="my-4 flex flex-wrap gap-8 text-xs">
            <div>
              <p className="font-semibold uppercase text-gray-700">
                Parcel Number
              </p>
              <div>{formData.parcel_number}</div>
            </div>
            <div>
              <p className="font-semibold uppercase text-gray-700">
                Property Address
              </p>
              <div>{formData.site_address}</div>
            </div>
          </div>

          {/* Approval Letter */}
          <div className="space-y-4">
            <p className="font-bold uppercase">
              Approval — Tornado Property Tax Relief
            </p>

            <p>
              Your application for property tax relief related to the May 16,
              2025 tornado, has been <strong>approved</strong> by the Board of
              Equalization for the property listed above. The Assessor has
              prorated the assessed value based on the period the residence was
              unoccupied and uninhabitable due to the disaster.
            </p>

            {/* Relief Summary (new fields) */}
            <div className="border rounded">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0 text-sm">
                <div className="p-3 border-b md:border-b-0 md:border-r">
                  <p className="text-xs uppercase text-gray-600">
                    Original Assessed Value
                  </p>
                  <p className="font-semibold">
                    {fmtUSD(formData.original_assessed_value)}
                  </p>
                </div>
                <div className="p-3 border-b md:border-b-0 md:border-r">
                  <p className="text-xs uppercase text-gray-600">
                    Adjusted Assessed Value
                  </p>
                  <p className="font-semibold">
                    {fmtUSD(formData.adjusted_assessed_value)}
                  </p>
                </div>
                <div className="p-3">
                  <p className="text-xs uppercase text-gray-600">
                    Days Unoccupied
                  </p>
                  <p className="font-semibold">
                    {typeof formData.days_unoccupied === "number"
                      ? formData.days_unoccupied.toLocaleString("en-US")
                      : "—"}
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-3">
              The adjusted assessed value will be used to compute the tax due
              for the 2025 tax year. The tax rates for the 2025 tax year will be
              set by the various taxing districts later this year. The amount of
              tax relief will not be known until the tax rates are set.
            </p>

            <div className="mt-2 text-sm">
              <p className="font-medium">
                Questions? Contact the Assessor’s Office:
              </p>
              <ul className="mt-1 space-y-1">
                <li>
                  <strong>Phone:</strong> 314-622-4185
                </li>
                <li>
                  <strong>Email:</strong> assessor-office@stlouis-mo.gov
                </li>
                <li>
                  <strong>Mail:</strong> 1200 Market St, Room 120, St. Louis, MO
                  63103
                </li>
              </ul>
            </div>
          </div>

          {/* Signature */}
          <div className="mt-8 text-xs text-left">
            <Image
              src={signatureImage}
              alt="Signature"
              width={200}
              height={74}
            />
            <p className="font-semibold">Shawn T. Ordway</p>
            <p className="text-xs">Assessor</p>
          </div>
        </>
      ) : (
        <div className="text-sm text-red-600">
          <p className="mb-4">
            Please fill out all required fields to generate the notice.
          </p>
          <ul className="list-disc pl-5">
            <li>Owner Name</li>
            <li>Address 1 (or Address 2, or City/State/ZIP)</li>
            <li>Parcel Number</li>
            <li>Site Address</li>
          </ul>
        </div>
      )}
    </div>
  );
}
