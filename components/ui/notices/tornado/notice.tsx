"use client";

import React from "react";
import NoticeHeader from "../header";
import Image from "next/image";
import signatureImage from "@/public/shawns-signature.png";

type NoticeFormData = {
  parcel_number?: string;
  site_address?: string;
  name?: string;
  address_1?: string;
  address_2?: string;
  city?: string;
  state?: string;
  zip?: string;
};

export default function Notice({ formData }: { formData: NoticeFormData }) {
  const currentTimestampString = new Date().toLocaleString("en-US", {
    timeZone: "America/Chicago",
  });

  const requiredFieldsEntered =
    !!formData?.parcel_number &&
    !!formData?.site_address &&
    !!formData?.name &&
    !!(
      formData?.address_1 ||
      formData?.address_2 ||
      (formData?.city && formData?.state && formData?.zip)
    );

  return (
    <div className="w-[90%] mx-auto print:break-after-page border p-8 print:p-0 print:border-none print:bg-white print:text-black">
      <NoticeHeader
        mailingName={formData.name ?? ""}
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
              <p className="font-semibold uppercase tracking-wide text-gray-700">
                Parcel Number
              </p>
              <div>{formData.parcel_number}</div>
            </div>
            <div>
              <p className="font-semibold uppercase tracking-wide text-gray-700">
                Property Address
              </p>
              <div>{formData.site_address}</div>
            </div>
          </div>

          {/* Letter Body */}
          <div className="text-sm leading-6 space-y-4">
            <p>Dear Property Owner,</p>

            <p>
              We are writing to inform you that your property may qualify for
              relief related to recent tornado damage. If your parcel suffered
              damage or destruction due to a tornado, you may be eligible for a
              reduction in assessed value or other disaster-related tax relief
              programs for the current assessment year.
            </p>

            <p>
              To determine eligibility, please prepare documentation such as
              insurance claims, contractor estimates, photographs, or inspection
              reports that show the nature and extent of the damage, along with
              the date the damage occurred. Submitting this information helps us
              verify eligibility and process any applicable adjustments as
              quickly as possible.
            </p>

            <p>
              If you believe your property at{" "}
              <strong>{formData.site_address}</strong> (Parcel{" "}
              <strong>{formData.parcel_number}</strong>) was impacted, please
              contact our office to start the review. Our staff can walk you
              through the steps, timelines, and required materials.
            </p>

            <p>
              Thank you for your attention. We understand the stress severe
              weather events can cause and are committed to assisting affected
              property owners.
            </p>

            <p>Sincerely,</p>
          </div>

          {/* Signature */}
          <div className="mt-8 text-sm text-left">
            <Image
              src={signatureImage}
              alt="Signature"
              width={200}
              height={74}
              className="select-none"
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
