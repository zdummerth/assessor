"use client";

import React, { useState } from "react";
import { useModal } from "@/components/ui/modal-context";
import Modal from "@/components/ui/modal";
import NoticeHeader from "../header";
import FormattedDate from "../../formatted-date";

export default function Notice({ formData: initialData }: { formData?: any }) {
  const { currentModalId, openModal, closeModal } = useModal();
  const modalId = `edit-hearing-form`;
  const isOpen = currentModalId === modalId;

  const initialFormData = {
    parcel_number: "",
    owner_name: "",
    address_1: "",
    address_2: "",
    city: "",
    state: "",
    zip: "",
    site_address: "",
    appeal_number: "",
    room: "Kennedy Hearing Room 208",
    hearing_date: "",
    res_land_original: "",
    res_structure_original: "",
    res_land_new: "",
    res_structure_new: "",
    com_land_original: "",
    com_structure_original: "",
    com_land_new: "",
    com_structure_new: "",
  };

  const [formData, setFormData] = useState(initialData ?? initialFormData);

  const hasChanges =
    JSON.stringify(formData) !== JSON.stringify(initialFormData);

  const currentTimestampString = new Date().toLocaleString("en-US", {
    timeZone: "America/Chicago",
  });

  const requiredFieldsEntered =
    formData.parcel_number &&
    formData.owner_name &&
    formData.address_1 &&
    (formData.address_2 || (formData.city && formData.state && formData.zip)) &&
    formData.site_address;

  return (
    <div className="w-[90%] mx-auto print:break-after-page border p-8 print:p-0 print:border-none print:bg-white print:text-black">
      {hasChanges && (
        <button
          onClick={() => setFormData(initialFormData)}
          className="mt-2 px-4 py-2 bg-gray-300 text-sm rounded hover:bg-gray-400 print:hidden"
        >
          Reset
        </button>
      )}

      <div className="flex justify-end mb-4 print:hidden">
        <button
          onClick={() => openModal(modalId)}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Edit Info
        </button>
      </div>

      <Modal open={isOpen} onClose={closeModal}>
        <div className="p-6 flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-center">
            Edit Property Info
          </h2>

          {[
            { label: "Owner Name", key: "owner_name" },
            { label: "Address 1", key: "address_1" },
            { label: "Address 2", key: "address_2" },
            { label: "City", key: "city" },
            { label: "State", key: "state" },
            { label: "ZIP Code", key: "zip" },
            { label: "Parcel Number", key: "parcel_number" },
            { label: "Site Address", key: "site_address" },
            { label: "Hearing Date", key: "hearing_date" },
            { label: "Appeal Number", key: "appeal_number" },
            { label: "Residential Land (Original)", key: "res_land_original" },
            {
              label: "Residential Structure (Original)",
              key: "res_structure_original",
            },
            { label: "Residential Land (New)", key: "res_land_new" },
            { label: "Residential Structure (New)", key: "res_structure_new" },
            { label: "Commercial Land (Original)", key: "com_land_original" },
            {
              label: "Commercial Structure (Original)",
              key: "com_structure_original",
            },
            { label: "Commercial Land (New)", key: "com_land_new" },
            { label: "Commercial Structure (New)", key: "com_structure_new" },
          ].map(({ label, key }) => (
            <label key={key} className="text-sm">
              {label}
              <input
                className="w-full border px-2 py-1 mt-1 rounded"
                type={key === "hearing_date" ? "date" : "text"}
                //@ts-ignore
                value={formData[key] ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, [key]: e.target.value })
                }
              />
            </label>
          ))}

          <label className="text-sm">
            Room
            <input
              className="w-full border px-2 py-1 mt-1 rounded"
              type="text"
              value={formData.room ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, room: e.target.value })
              }
            />
          </label>

          <button
            onClick={closeModal}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Save
          </button>
        </div>
      </Modal>

      {/* <div className="pt-4"></div> */}
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
              <p className="">Parcel Number</p>
              <div>{formData.parcel_number}</div>
            </div>
            <div>
              <p className="">Property Address</p>
              <div>{formData.site_address}</div>
            </div>
            <div>
              <p className="">Hearing Date</p>
              <div>
                <FormattedDate date={formData.hearing_date} />
              </div>
            </div>
            <div>
              <p className="">Appeal Number</p>
              <div>{formData.appeal_number}</div>
            </div>
          </div>

          {/* Value Comparison Table */}
          <div className="my-4 text-xs">
            <div className="overflow-x-auto border rounded">
              <table className="min-w-full table-auto border-collapse text-xs">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-4 py-2 text-left">Category</th>
                    <th className="border px-4 py-2 text-right">
                      Original Appraised Value
                    </th>
                    <th className="border px-4 py-2 text-right">
                      New Appraised Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      label: "Residential Land",
                      original: formData.res_land_original,
                      new: formData.res_land_new,
                    },
                    {
                      label: "Residential Structure",
                      original: formData.res_structure_original,
                      new: formData.res_structure_new,
                    },
                    {
                      label: "Commercial Land",
                      original: formData.com_land_original,
                      new: formData.com_land_new,
                    },
                    {
                      label: "Commercial Structure",
                      original: formData.com_structure_original,
                      new: formData.com_structure_new,
                    },
                  ].map((row) => (
                    <tr key={row.label}>
                      <td className="border px-4 py-2">{row.label}</td>
                      <td className="border px-4 py-2 text-right">
                        ${Number(row.original).toLocaleString() || "0"}
                      </td>
                      <td className="border px-4 py-2 text-right">
                        ${Number(row.new).toLocaleString() || "0"}
                      </td>
                    </tr>
                  ))}
                  <tr className="font-semibold bg-gray-50">
                    <td className="border px-4 py-2">Total</td>
                    <td className="border px-4 py-2 text-right">
                      $
                      {(
                        Number(formData.res_land_original || 0) +
                        Number(formData.res_structure_original || 0) +
                        Number(formData.com_land_original || 0) +
                        Number(formData.com_structure_original || 0)
                      ).toLocaleString()}
                    </td>
                    <td className="border px-4 py-2 text-right">
                      $
                      {(
                        Number(formData.res_land_new || 0) +
                        Number(formData.res_structure_new || 0) +
                        Number(formData.com_land_new || 0) +
                        Number(formData.com_structure_new || 0)
                      ).toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="text-xs space-y-4">
            <p>
              Enclosed is a copy of the decision of the Board of Equalization
              regarding your property appeal for this year. The appraised value
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
          <div className="mt-16 text-sm text-left">
            <div className="border-t border-black w-64 mb-1" />
            <div>Board Member</div>
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
