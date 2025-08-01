"use client";

import FormattedDate from "@/components/ui/formatted-date";
import NoticeHeader from "../header";
import { FileQuestion } from "lucide-react";

type Hearing = {
  parcel_number: string;
  site_address: string;
  hearing_date: string;
  room: string;
  appeal_number: string;
};

type MailingKey = string;

function groupHearingsByMailingAddress(
  records: any[]
): { formData: any; hearings: Hearing[] }[] {
  const groups: Record<string, { formData: any; hearings: Hearing[] }> = {};

  records.forEach((rec) => {
    const key = [
      rec.owner_name,
      rec.address_1,
      rec.address_2,
      rec.city,
      rec.state,
      rec.zip,
    ]
      .map((v) => v?.trim() || "")
      .join("|");

    if (!groups[key]) {
      groups[key] = {
        formData: {
          owner_name: rec.owner_name,
          address_1: rec.address_1,
          address_2: rec.address_2,
          city: rec.city,
          state: rec.state,
          zip: rec.zip,
        },
        hearings: [],
      };
    }

    groups[key].hearings.push({
      parcel_number: rec.parcel_number,
      site_address: rec.site_address,
      hearing_date: rec.hearing_date,
      room: rec.room,
      appeal_number: rec.appeal_number,
    });
  });

  // Convert to array and sort by mailing address_1 then address_2
  const sortedGroups = Object.values(groups).sort((a, b) => {
    const a1 = a.formData.address_1?.toLowerCase() || "";
    const b1 = b.formData.address_1?.toLowerCase() || "";
    const a2 = a.formData.address_2?.toLowerCase() || "";
    const b2 = b.formData.address_2?.toLowerCase() || "";

    return a1.localeCompare(b1) || a2.localeCompare(b2);
  });

  return sortedGroups;
}

export default function GroupedNoticeFromHearings({ data }: { data: any[] }) {
  const groups = groupHearingsByMailingAddress(data);
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <>
      {Object.values(groups).map(({ formData, hearings }, i) => (
        <div
          key={i}
          className="w-[90%] mx-auto print:bg-white print:text-black print:border-none"
        >
          {/* Notice Header and Intro */}
          <div className="border p-8 print:p-0 print:border-none print:bg-white print:text-black break-inside-avoid">
            <NoticeHeader
              mailingName={formData.owner_name}
              mailingAddress1={formData.address_1}
              mailingAddress2={formData.address_2}
              mailingCity={formData.city}
              mailingState={formData.state}
              mailingZip={formData.zip}
              date={formattedDate}
              paddingTop="pt-0"
            />

            <div className="text-sm mt-4">
              <p className="mb-4">
                The Board of Equalization has scheduled hearings regarding the
                assessment of your properties. All hearings will be held at:
              </p>
              <div className="text-center mb-4">
                <div>City Hall, 1200 Market Street</div>
                <div>St. Louis, MO 63103</div>
              </div>

              <p className="mb-4">
                Please sign in at the receptionist's desk upon arrival as all
                appeals will be heard in the order of appearance.
              </p>
              <p className="mb-4">
                All available hearing dates have been filled and rescheduling is
                not possible. If you are unable to attend the scheduled hearing,
                your case will still be heard and a decision will be made based
                on the information available.
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
          </div>

          {/* Hearing Table on Separate Page */}
          <div className="mt-12 text-xs print:mt-4 print:break-after-page">
            <table className="w-full border border-gray-400 break-inside-auto">
              <thead className="bg-gray-100 print:table-header-group">
                <tr>
                  <th className="border px-2 py-1 text-left">Parcel</th>
                  <th className="border px-2 py-1 text-left">
                    Property Address
                  </th>
                  <th className="border px-2 py-1 text-left">Hearing Date</th>
                  <th className="border px-2 py-1 text-left">Room</th>
                  <th className="border px-2 py-1 text-left">Appeal #</th>
                </tr>
              </thead>
              <tbody className="print:table-row-group">
                {hearings.map((h, j) => (
                  <tr key={j} className="break-inside-avoid">
                    <td className="border px-2 py-1 whitespace-nowrap">
                      {h.parcel_number}
                    </td>
                    <td className="border px-2 py-1">{h.site_address}</td>
                    <td className="border px-2 py-1">
                      <FormattedDate
                        date={h.hearing_date}
                        showTime
                        month="short"
                      />
                    </td>
                    <td className="border px-2 py-1">{h.room}</td>
                    <td className="border px-2 py-1">{h.appeal_number}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </>
  );
}
