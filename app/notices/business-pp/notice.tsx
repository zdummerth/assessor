"use client";

import React from "react";
import NoticeHeader from "@/components/ui/notices/header";
import Image from "next/image";
import signatureImage from "@/public/shawns-signature.png";
import { type NoticeFormData } from "./shared";

export default function Notice({ formData }: { formData: NoticeFormData }) {
  const currentTimestampString = new Date().toLocaleString("en-US", {
    timeZone: "America/Chicago",
  });

  // Optional: ensure the rendered notice only shows when all fields are non-empty.
  const requiredFieldsEntered =
    formData.parcel_number &&
    formData.site_address &&
    formData.name &&
    formData.address_1 &&
    formData.city &&
    formData.state &&
    formData.zip &&
    formData.av &&
    formData.mv;

  return (
    <div className="w-[90%] mx-auto print:break-after-page border p-8 print:p-4 print:border-none print:bg-white print:text-black text-sm leading-6">
      <NoticeHeader
        mailingName={formData.name}
        mailingAddress1={formData.address_1}
        mailingAddress2={"" /* no address_2 in type */}
        mailingCity={formData.city}
        mailingState={formData.state}
        mailingZip={formData.zip}
        date={currentTimestampString}
      />

      {requiredFieldsEntered ? (
        <>
          {/* Parcel + Site Address */}
          <div className="my-2 flex flex-wrap gap-8 text-xs">
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

          {/* Notice Content */}
          <div className="space-y-2">
            <div>
              <div className="font-semibold text-center">
                Notice of Increased Assessed Value To Be Fixed By The Board Of
                Equalization
              </div>
              <div className="text-center my-2">
                ${formData.mv} <span className="italic">appraised value</span>
                <br />${formData.av}{" "}
                <span className="italic">assessed value</span>
              </div>
            </div>

            <p>
              The Assessor’s Office has informed the Board of Equalization that
              the property has been classified as a{" "}
              <strong>short-term rental</strong> and that a{" "}
              <strong>business personal property</strong> value should apply for
              2025. The Board plans to adopt the value as determined by the
              Assessor’s Office, which will result in a business personal
              property account being created for the 2025 tax year.
            </p>

            <p>
              The change resulted because the{" "}
              <em>fixtures, furniture, and equipment</em> used for short-term
              rental business are taxable as business personal property.
              Missouri law defines business personal property as tangible
              personal property which is used in a trade or business or used for
              the production of income and which has a determinable life of
              longer than one year.
            </p>

            <p>
              If you disagree with this determination, you may attend the Board
              of Equalization meeting on{" "}
              <strong>Monday, October 13, 2025</strong> between{" "}
              <strong>9:00 a.m. and 11:00 a.m.</strong> and show cause why this
              assessment should not be made. Please contact the Board prior to
              the hearing to schedule an exact time.
            </p>

            <p>
              The Board meets in person in{" "}
              <strong>Room 124 (Recorder of Deeds Meeting Room)</strong>, City
              Hall, <strong>1200 Market Street, St. Louis, MO 63103</strong>.
            </p>

            <div className="mt-2 text-[13px]">
              <p className="font-semibold uppercase">Contact</p>
              <ul className="flex gap-8 pl-8 list-disc">
                <li>
                  <a href="mailto:appeal@stlouis-mo.gov" className="underline">
                    appeal@stlouis-mo.gov
                  </a>
                </li>
                <li>314-622-4181</li>
                <li>1200 Market Street, Room 120, St. Louis, MO 63103</li>
              </ul>
            </div>
          </div>

          {/* Signature */}
          <div className="mt-6 text-xs text-left">
            <Image
              src={signatureImage}
              alt="Signature"
              width={150}
              height={56}
              priority
            />
            <p className="font-semibold">Shawn T. Ordway</p>
            <p className="text-xs">Assessor</p>
          </div>
          <i className="block text-[10px] text-gray-600 w-[500px] mx-auto text-center">
            Assessments for real estate and personal property are mutually
            exclusive of, and not related to, the City’s Building Division
            recent enactment of short-term rental regulations which are on hold
            pending the outcome of litigation.
          </i>
        </>
      ) : (
        <div className="text-sm text-red-600">
          <p className="mb-4">
            Please fill out all required fields to generate the notice.
          </p>
          <ul className="list-disc pl-5">
            <li>Owner Name</li>
            <li>Address 1</li>
            <li>City, State, ZIP</li>
            <li>Parcel Number</li>
            <li>Site Address</li>
            <li>Assessed Value</li>
            <li>Appraised Value</li>
          </ul>
        </div>
      )}
    </div>
  );
}
