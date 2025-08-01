"use client";

import FormattedDate from "@/components/ui/formatted-date";
import NoticeHeader from "../header";

export default function NoticeFromHearings({ formData }: { formData: any }) {
  const {
    parcel_number,
    owner_name,
    address_1,
    address_2,
    city,
    state,
    zip,
    site_address,
    appeal_number,
    hearing_date,
    room,
  } = formData;

  const currentTimestampString = new Date().toLocaleString("en-US", {
    timeZone: "America/Chicago",
  });

  const hearingTimestamp = new Date(hearing_date).toLocaleString("en-US", {
    timeZone: "America/Chicago",
  });

  return (
    <div className="w-[90%] mx-auto print:break-after-page border p-8 print:p-0 print:mt-4 print:border-none print:bg-white print:text-black">
      <NoticeHeader
        mailingName={owner_name}
        mailingAddress1={address_1}
        mailingAddress2={address_2}
        mailingCity={city}
        mailingState={state}
        mailingZip={zip}
        date={currentTimestampString}
      />

      <>
        <div className="my-8 flex justify-between">
          <div>
            <p className="text-sm">Parcel Number</p>
            <div>{parcel_number}</div>
          </div>
          <div>
            <p className="text-sm">Property Address</p>
            <div>{site_address}</div>
          </div>
        </div>

        <div className="text-sm">
          <p className="text-sm mb-4">
            The hearing on your appeal regarding the assessment of your property
            described above will be held before the Board of Equalization of the
            City of St. Louis at
          </p>
          <div className="text-lg text-center font-semibold mb-4">
            <FormattedDate date={hearingTimestamp} showTime />
          </div>
          <div className="text-center mb-4">
            <div>{room || "Kennedy Hearing Room 208"}</div>
            <div>City Hall, 1200 Market Street</div>
            <div>St. Louis, MO 63103</div>
          </div>
          <p className="mb-4">
            Please sign in at the receptionist's desk upon arrival as all
            appeals will be heard in the order of appearance.
          </p>
          <p className="mb-4">
            If you cannot appear at the assigned date and time, you must
            reschedule within 48 hours of receipt of this notice. If you are
            unable to attend the hearing, the Board will still hear your appeal
            and render a decision based on the information available.
          </p>
          <p className="mb-4">
            If you plan to park on the City Hall lot, please arrive early to
            allow time to secure parking space and for security screening.
          </p>
          <p className="mb-4">
            Please be advised that if you bring any physical supporting
            documents, you must present at least 6 copies of each document.
          </p>
          <p className="mb-4">
            Any digital supporting documents can be emailed to:{" "}
            <span className="font-semibold">appeal@stlouis-mo.gov</span>
          </p>
          <p>BOE Contact: 314-622-4185</p>
        </div>
      </>
    </div>
  );
}
