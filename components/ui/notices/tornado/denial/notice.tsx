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

  // Denial-specific
  denial_reason?: string;
};

export default function TornadoReliefDenialNotice({
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
    !!formData?.denial_reason &&
    !!(
      formData?.address_1 ||
      formData?.address_2 ||
      (formData?.city && formData?.state && formData?.zip)
    );

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

          {/* Denial Letter */}
          <div className="space-y-4">
            <p className="font-bold uppercase">
              Denial — Tornado Property Tax Relief
            </p>

            <p>
              Your application for property tax relief related to the May 16,
              2025 tornado has been <strong>denied</strong> by the Board of
              Equalization for the property listed above. As a result, no
              proration of the assessed value will be applied.
            </p>

            {/* Denial Reason */}
            <div className="border rounded">
              <div className="p-3">
                <p className="text-xs uppercase text-gray-600">Denial Reason</p>
                <p className="font-semibold whitespace-pre-wrap">
                  {formData.denial_reason}
                </p>
              </div>
            </div>

            <p className="mt-3">
              If you have additional documentation or believe this decision was
              made in error, please contact our office. We can explain the
              decision and discuss next steps.
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
            <li>Denial Reason</li>
          </ul>
        </div>
      )}
    </div>
  );
}
