"use client";

import React, { useState } from "react";
import { useModal } from "@/components/ui/modal-context";
import Modal from "@/components/ui/modal";
import NoticeHeader from "../header";
import FormattedDate from "@/components/ui/formatted-date";

export default function Notice() {
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
    hearing_date: "",
    hearing_time: "",
    room: "Kennedy Hearing Room 208",
  };

  const [formData, setFormData] = useState(initialFormData);

  // Compare formData with initialFormData
  const hasChanges =
    JSON.stringify(formData) !== JSON.stringify(initialFormData);

  const currentTimestampString = new Date().toLocaleString("en-US", {
    timeZone: "America/Chicago",
  });

  const hearingTimestamp = new Date(
    formData.hearing_date + " " + formData.hearing_time
  ).toLocaleString("en-US", {
    timeZone: "America/Chicago",
  });

  const requiredFieldsEntered =
    formData.parcel_number &&
    formData.owner_name &&
    formData.address_1 &&
    (formData.address_2 || (formData.city && formData.state && formData.zip)) &&
    formData.site_address &&
    formData.hearing_date &&
    formData.hearing_time;

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
            Site Address
            <input
              className="w-full border px-2 py-1 mt-1 rounded"
              value={formData.site_address}
              onChange={(e) =>
                setFormData({ ...formData, site_address: e.target.value })
              }
            />
          </label>

          <label className="text-sm">
            Hearing Date
            <input
              type="date"
              className="w-full border px-2 py-1 mt-1 rounded"
              value={formData.hearing_date}
              onChange={(e) =>
                setFormData({ ...formData, hearing_date: e.target.value })
              }
            />
          </label>

          <label className="text-sm">
            Hearing Time
            <input
              type="time"
              className="w-full border px-2 py-1 mt-1 rounded"
              value={formData.hearing_time}
              onChange={(e) =>
                setFormData({ ...formData, hearing_time: e.target.value })
              }
            />
          </label>

          <label className="text-sm">
            Room
            <input
              className="w-full border px-2 py-1 mt-1 rounded"
              type="text"
              value={formData.room}
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
      {requiredFieldsEntered ? (
        <>
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
            <p className="text-sm mb-4">
              The hearing on your appeal regarding the assessment of your
              property described above will be held before the Board of
              Equalization of the City of St. Louis at
            </p>
            <div className="text-lg text-center font-semibold mb-4">
              <FormattedDate date={hearingTimestamp} showTime />
            </div>
            <div className="text-center mb-4">
              <div>{formData.room}</div>
              <div>City Hall, 1200 Market Street</div>
              <div>St. Louis, MO 63103</div>
            </div>
            <div></div>
            <p className="mb-4">
              Please sign in at the receptionist's desk upon arrival as all
              appeals will be heard in the order of appearance.
            </p>
            <p className="mb-4">
              If you cannot appear at the assigned date and time, you must
              reschedule within 48 hours of receipt of this notice. If you are
              unable to attend the hearing, the Board will still hear your
              appeal and render a decision based on the information available.
            </p>
            <p className="mb-4">
              If you plan to park on the City Hall lot, please arrive early to
              allow time to secure parking space and for security screening.
            </p>
            <p className="mb-4">
              Please be advised that if you bring bring any physical supporting
              documents, you must present at least 6 copies of each document.
            </p>
            <p className="mb-4">
              Any digital supporting documents can be emailed to:{" "}
              <span className="font-semibold">appeal@stlouis-mo.gov</span>
            </p>
            <p>BOE Contact: 314-622-4185</p>
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
            <li>Hearing Date</li>
            <li>Hearing Time</li>
          </ul>
        </div>
      )}
    </div>
  );
}
