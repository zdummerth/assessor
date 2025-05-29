"use client";

import React, { useState } from "react";
import { useModal } from "@/components/ui/modal-context";
import Modal from "@/components/ui/modal";
import NoticeHeader from "../header";

export default function Notice({ data }: { data: any }) {
  const { currentModalId, openModal, closeModal } = useModal();
  const modalId = `edit-${data.parcel_number}`;
  const isOpen = currentModalId === modalId;

  const initialFormData = {
    parcel_number: data.parcel_number,
    appraised_total: data.appraised_total,
    owner_name: data.owner_name,
    address_1: data.owner_address_1,
    address_2: data.owner_address_2 || "",
    city: data.owner_city,
    state: data.owner_state,
    zip: data.owner_zip,
    site_address:
      `${data.site_street_number || ""} ${data.prefix_directional || ""} ${data.site_street_name || ""} ${data.site_zip_code || ""}`.trim(),
  };

  const [formData, setFormData] = useState(initialFormData);

  // Compare formData with initialFormData
  const hasChanges =
    JSON.stringify(formData) !== JSON.stringify(initialFormData);

  const currentTimestampString = new Date().toLocaleString("en-US", {
    timeZone: "America/Chicago",
  });

  return (
    <div className="w-[90%] mx-auto print:break-after-page border p-8 print:p-0 print:mt-4 print:border-none print:bg-white print:text-black">
      {hasChanges && (
        <button
          onClick={() => setFormData(initialFormData)}
          className="mt-2 px-4 py-2 bg-gray-300 text-sm rounded hover:bg-gray-400 print:hidden"
        >
          Reset
        </button>
      )}

      <div className="flex justify-end mb-4">
        <button
          onClick={() => openModal(modalId)}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 print:hidden"
        >
          Edit Info
        </button>
      </div>

      {/* Modal for editing form data */}
      <Modal open={isOpen} onClose={closeModal}>
        <div className="p-6 flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-center">
            Edit Property Info
          </h2>

          <label className="text-sm">
            Owner Name
            <input
              className="w-full border px-2 py-1 mt-1 rounded"
              value={formData.owner_name}
              onChange={(e) =>
                setFormData({ ...formData, owner_name: e.target.value })
              }
            />
          </label>

          <label className="text-sm">
            Address 1
            <input
              className="w-full border px-2 py-1 mt-1 rounded"
              value={formData.address_1}
              onChange={(e) =>
                setFormData({ ...formData, address_1: e.target.value })
              }
            />
          </label>

          <label className="text-sm">
            Address 2
            <input
              className="w-full border px-2 py-1 mt-1 rounded"
              value={formData.address_2}
              onChange={(e) =>
                setFormData({ ...formData, address_2: e.target.value })
              }
            />
          </label>

          <label className="text-sm">
            City
            <input
              className="w-full border px-2 py-1 mt-1 rounded"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
            />
          </label>

          <label className="text-sm">
            State
            <input
              className="w-full border px-2 py-1 mt-1 rounded"
              value={formData.state}
              onChange={(e) =>
                setFormData({ ...formData, state: e.target.value })
              }
            />
          </label>

          <label className="text-sm">
            ZIP Code
            <input
              className="w-full border px-2 py-1 mt-1 rounded"
              value={formData.zip}
              onChange={(e) =>
                setFormData({ ...formData, zip: e.target.value })
              }
            />
          </label>

          <label className="text-sm">
            Parcel Number
            <input
              className="w-full border px-2 py-1 mt-1 rounded"
              value={formData.parcel_number}
              onChange={(e) =>
                setFormData({ ...formData, parcel_number: e.target.value })
              }
            />
          </label>

          <label className="text-sm">
            Appraised Value
            <input
              type="number"
              className="w-full border px-2 py-1 mt-1 rounded"
              value={formData.appraised_total}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  appraised_total: parseFloat(e.target.value),
                })
              }
            />
          </label>

          <label className="text-sm">
            Site Address
            <input
              className="w-full border px-2 py-1 mt-1 rounded"
              value={formData.site_address}
              onChange={(e) =>
                setFormData({ ...formData, site_address: e.target.value })
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

      {/* Header and seal */}
      <NoticeHeader
        mailingName={formData.owner_name}
        mailingAddress1={formData.address_1}
        mailingAddress2={formData.address_2}
        mailingCity={formData.city}
        mailingState={formData.state}
        mailingZip={formData.zip}
        date={currentTimestampString}
      />

      {/* Parcel and address */}
      <div className="my-8 flex justify-between">
        <div>
          <p className="text-sm">Parcel Number</p>
          <div>{formData.parcel_number}</div>
        </div>
        <div>
          <p className="text-sm">Property Address</p>
          <div>{formData.site_address}</div>
        </div>
      </div>

      <div className="text-sm">
        <p className="text-sm">
          The preliminary analysis by the City of St. Louis Assessor’s office
          indicates the residential value of your property will increase by more
          than 15% for the 2025 reassessment. The preliminary total value we
          have determined for your property for the 2025 reassessment is:
        </p>
        <p className="font-bold text-xl my-4 text-center">
          ${data.appraised_total.toLocaleString()}
        </p>
        <p>
          Missouri law requires Assessors to complete a physical inspection of
          any residential property that increases by more than 15% due to
          reassessment (excluding new construction). Such physical inspection
          includes an on-site personal observation and review of all exterior
          portions of the land and buildings and improvements to which the
          inspector has or may reasonably and lawfully gain external access. As
          part of the physical inspection process, you are hereby notified of
          your right for an interior inspection of your property. An interior
          inspection will only be performed if specifically requested by the
          taxpayer. If you do not want us to enter your property due to health
          or other concerns, you can submit pictures and other information about
          the condition of your home by emailing zasr@stlouis-mo.gov.
        </p>
        <p className="mt-4">
          Please make sure you include your parcel number and address in your
          email.
        </p>
        <p className="mt-4">
          <span className="font-bold">
            If you agree with your property's value and do not want an interior
            inspection, then no action is required.
          </span>{" "}
          This will in no way affect your ability to appeal after you receive
          your Change of Assessment notice in May 2025. State law requires the
          Assessor to revalue all real property in the City as of January 1st of
          every odd-numbered year.
        </p>
        <p className="mt-4">
          For questions or to schedule an interior inspection, please call
          314-622-4185 or email us at zasr@stlouis-mo.gov.
        </p>
      </div>
    </div>
  );
}
