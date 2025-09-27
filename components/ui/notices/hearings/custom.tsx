"use client";

import React, { useMemo, useState } from "react";
import NoticeHeader from "../header";
import FormattedDate from "@/components/ui/formatted-date";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export default function Notice() {
  const initialFormData = useMemo(
    () => ({
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
    }),
    []
  );

  const [formData, setFormData] = useState(initialFormData);

  const hasChanges = useMemo(
    () => JSON.stringify(formData) !== JSON.stringify(initialFormData),
    [formData, initialFormData]
  );

  const currentTimestampString = new Date().toLocaleString("en-US", {
    timeZone: "America/Chicago",
  });

  const hearingTimestamp = new Date(
    `${formData.hearing_date} ${formData.hearing_time}`
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
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFormData(initialFormData)}
          className="mt-2 print:hidden"
        >
          Reset
        </Button>
      )}

      <div className="flex justify-end mb-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="print:hidden">Edit Info</Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Property Info</DialogTitle>
            </DialogHeader>

            <div className="grid gap-3">
              <div className="grid gap-1.5">
                <Label htmlFor="owner_name">Owner Name</Label>
                <Input
                  id="owner_name"
                  value={formData.owner_name}
                  onChange={(e) =>
                    setFormData({ ...formData, owner_name: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="address_1">Address 1</Label>
                <Input
                  id="address_1"
                  value={formData.address_1}
                  onChange={(e) =>
                    setFormData({ ...formData, address_1: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="address_2">Address 2</Label>
                <Input
                  id="address_2"
                  value={formData.address_2}
                  onChange={(e) =>
                    setFormData({ ...formData, address_2: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-1.5 sm:grid-cols-3 sm:gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input
                    id="zip"
                    value={formData.zip}
                    onChange={(e) =>
                      setFormData({ ...formData, zip: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-1.5 sm:grid-cols-2 sm:gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="parcel_number">Parcel Number</Label>
                  <Input
                    id="parcel_number"
                    value={formData.parcel_number}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        parcel_number: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="site_address">Site Address</Label>
                  <Input
                    id="site_address"
                    value={formData.site_address}
                    onChange={(e) =>
                      setFormData({ ...formData, site_address: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-1.5 sm:grid-cols-3 sm:gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="hearing_date">Hearing Date</Label>
                  <Input
                    id="hearing_date"
                    type="date"
                    value={formData.hearing_date}
                    onChange={(e) =>
                      setFormData({ ...formData, hearing_date: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="hearing_time">Hearing Time</Label>
                  <Input
                    id="hearing_time"
                    type="time"
                    value={formData.hearing_time}
                    onChange={(e) =>
                      setFormData({ ...formData, hearing_time: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="room">Room</Label>
                  <Input
                    id="room"
                    value={formData.room}
                    onChange={(e) =>
                      setFormData({ ...formData, room: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button>Save</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

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
