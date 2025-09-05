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
    <div className="w-[90%] mx-auto print:break-after-page border p-8 print:p-4 print:border-none print:bg-white print:text-black text-sm leading-6">
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

          {/* Condensed Tornado Relief Letter */}
          <div className="space-y-2">
            <p className="font-bold uppercase">
              Property Tax Relief – Tornado-Damaged Homes
            </p>

            <p>
              Following the May 16, 2025 tornado, the Mayor and Board of
              Aldermen enacted the Occupancy Law (RSMo 137.082). This law lets
              the Assessor prorate property taxes for homes left unoccupied and
              uninhabitable by a natural disaster.
            </p>

            <p>
              To apply, submit a relief application to the Assessor’s Office.
              Forms are available:
            </p>
            <ul className="list-disc pl-6">
              <li>
                Online:{" "}
                <span className="underline">
                  https://www.stlouis-mo.gov/government/departments/assessor/real-estate/disaster-taxrelief/property-tax-relief-service.cfm
                </span>
              </li>
              <li>In person at the Assessor’s Office</li>
              <li>By mail upon request</li>
            </ul>

            <p>
              This program applies only to <strong>residential homes</strong>{" "}
              that became uninhabitable. Relief depends on how long the home
              remains vacant.{" "}
              <em>
                Commercial, agricultural, and personal property are not
                eligible.
              </em>
            </p>

            <p>
              Homes that remained habitable may not qualify for this program but
              could be eligible for other disaster recovery assistance:{" "}
              <span className="underline">
                https://www.stlouis-mo.gov/government/recovery/tornado-2025/rebuild/index.cfm
              </span>
            </p>

            <p>
              Questions? Contact the Assessor’s Office:
              <br />
              <strong>Phone:</strong> 314-622-4185 &nbsp; | &nbsp;
              <strong>Email:</strong>{" "}
              <a
                href="mailto:assessor-office@stlouis-mo.gov"
                className=" underline"
              >
                assessor-office@stlouis-mo.gov
              </a>
            </p>
          </div>
          <div className="mt-8 text-xs text-left">
            {/* <div className="border-t border-black w-64 mb-1" /> */}
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
