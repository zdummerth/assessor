"use client";

import React, { useMemo, useState } from "react";
import NoticeHeader from "@/components/ui/notices/header";
import FormattedDate from "@/components/ui/formatted-date";
import signatureImage from "@/public/shawns-signature.png";
import Image from "next/image";

type FormState = {
  // Header/mail fields
  owner_name: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  zip: string;

  // Body fields
  parcel_number: string;
  site_address: string;
  hearing_date: string; // ISO date (yyyy-mm-dd)
  appeal_number: string;

  // Totals entered by user (no calculation)
  total_assessed_original: string; // keep as string for inputs, convert when displaying
  total_assessed_new: string;
};

export default function Notice() {
  const [form, setForm] = useState<FormState>({
    owner_name: "",
    address_1: "",
    address_2: "",
    city: "",
    state: "",
    zip: "",

    parcel_number: "",
    site_address: "",
    hearing_date: "",
    appeal_number: "",

    total_assessed_original: "",
    total_assessed_new: "",
  });

  const currentTimestampString = useMemo(
    () =>
      new Date().toLocaleString("en-US", {
        timeZone: "America/Chicago",
      }),
    []
  );

  const requiredFieldsEntered =
    form.parcel_number &&
    form.owner_name &&
    (form.address_1 ||
      form.address_2 ||
      (form.city && form.state && form.zip)) &&
    form.site_address;

  const totalOriginalNum = Number(form.total_assessed_original || 0);
  const totalNewNum = Number(form.total_assessed_new || 0);

  return (
    <div className="w-[90%] mx-auto print:break-after-page border p-8 print:p-0 print:border-none print:bg-white print:text-black">
      {/* Editor Form (hidden when printing) */}
      <form
        className="print:hidden mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"
        onSubmit={(e) => e.preventDefault()}
      >
        <fieldset className="border rounded p-4 space-y-2">
          <legend className="font-semibold">Mailing / Header</legend>
          <div className="grid grid-cols-1 gap-2">
            <label className="flex flex-col">
              <span>Owner Name</span>
              <input
                className="border rounded px-2 py-1"
                value={form.owner_name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, owner_name: e.target.value }))
                }
              />
            </label>
            <label className="flex flex-col">
              <span>Address 1</span>
              <input
                className="border rounded px-2 py-1"
                value={form.address_1}
                onChange={(e) =>
                  setForm((f) => ({ ...f, address_1: e.target.value }))
                }
              />
            </label>
            <label className="flex flex-col">
              <span>Address 2</span>
              <input
                className="border rounded px-2 py-1"
                value={form.address_2}
                onChange={(e) =>
                  setForm((f) => ({ ...f, address_2: e.target.value }))
                }
              />
            </label>
            <div className="grid grid-cols-3 gap-2">
              <label className="flex flex-col">
                <span>City</span>
                <input
                  className="border rounded px-2 py-1"
                  value={form.city}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, city: e.target.value }))
                  }
                />
              </label>
              <label className="flex flex-col">
                <span>State</span>
                <input
                  className="border rounded px-2 py-1"
                  value={form.state}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, state: e.target.value }))
                  }
                />
              </label>
              <label className="flex flex-col">
                <span>ZIP</span>
                <input
                  className="border rounded px-2 py-1"
                  value={form.zip}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, zip: e.target.value }))
                  }
                />
              </label>
            </div>
          </div>
        </fieldset>

        <fieldset className="border rounded p-4 space-y-2">
          <legend className="font-semibold">Notice Details</legend>
          <div className="grid grid-cols-1 gap-2">
            <label className="flex flex-col">
              <span>Parcel Number</span>
              <input
                className="border rounded px-2 py-1"
                value={form.parcel_number}
                onChange={(e) =>
                  setForm((f) => ({ ...f, parcel_number: e.target.value }))
                }
              />
            </label>
            <label className="flex flex-col">
              <span>Site Address</span>
              <input
                className="border rounded px-2 py-1"
                value={form.site_address}
                onChange={(e) =>
                  setForm((f) => ({ ...f, site_address: e.target.value }))
                }
              />
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex flex-col">
                <span>Hearing Date</span>
                <input
                  type="date"
                  className="border rounded px-2 py-1"
                  value={form.hearing_date}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, hearing_date: e.target.value }))
                  }
                />
              </label>
              <label className="flex flex-col">
                <span>Appeal Number</span>
                <input
                  className="border rounded px-2 py-1"
                  value={form.appeal_number}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, appeal_number: e.target.value }))
                  }
                />
              </label>
            </div>
          </div>
        </fieldset>

        <fieldset className="border rounded p-4 space-y-2 md:col-span-2">
          <legend className="font-semibold">Assessed Totals</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <label className="flex flex-col">
              <span>Original Total Assessed</span>
              <input
                type="number"
                inputMode="numeric"
                className="border rounded px-2 py-1"
                value={form.total_assessed_original}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    total_assessed_original: e.target.value,
                  }))
                }
              />
            </label>
            <label className="flex flex-col">
              <span>New Total Assessed</span>
              <input
                type="number"
                inputMode="numeric"
                className="border rounded px-2 py-1"
                value={form.total_assessed_new}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    total_assessed_new: e.target.value,
                  }))
                }
              />
            </label>
          </div>
        </fieldset>
      </form>

      <NoticeHeader
        mailingName={form.owner_name}
        mailingAddress1={form.address_1}
        mailingAddress2={form.address_2}
        mailingCity={form.city}
        mailingState={form.state}
        mailingZip={form.zip}
        date={currentTimestampString}
      />

      {requiredFieldsEntered ? (
        <>
          <div className="my-4 flex flex-wrap gap-8 text-xs">
            <div>
              <p>Parcel Number</p>
              <div>{form.parcel_number}</div>
            </div>
            <div>
              <p>Property Address</p>
              <div>{form.site_address}</div>
            </div>
            <div>
              <p>Hearing Date</p>
              <div>
                {form.hearing_date ? (
                  <FormattedDate date={form.hearing_date} />
                ) : (
                  <span className="opacity-60">—</span>
                )}
              </div>
            </div>
            <div>
              <p>Appeal Number</p>
              <div>
                {form.appeal_number || <span className="opacity-60">—</span>}
              </div>
            </div>
          </div>

          {/* Assessed Value Table (Totals only) */}
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
                  <tr className="font-semibold bg-gray-50">
                    <td className="border px-4 py-2">Personal Property</td>
                    <td className="border px-4 py-2 text-right">
                      $
                      {Number.isFinite(totalOriginalNum)
                        ? totalOriginalNum.toLocaleString()
                        : "0"}
                    </td>
                    <td className="border px-4 py-2 text-right">
                      $
                      {Number.isFinite(totalNewNum)
                        ? totalNewNum.toLocaleString()
                        : "0"}
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
            <Image
              src={signatureImage}
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
            <li>Address 1 (or Address 2, or City/State/ZIP)</li>
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
