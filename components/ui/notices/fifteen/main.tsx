"use client";

import React, { useMemo, useState } from "react";
import NoticeHeader from "../header";
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

type NoticeProps = { data: any };

export default function Notice({ data }: NoticeProps) {
  const initialFormData = useMemo(
    () => ({
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
    }),
    [data]
  );

  const [formData, setFormData] = useState(initialFormData);

  const hasChanges = useMemo(
    () => JSON.stringify(formData) !== JSON.stringify(initialFormData),
    [formData, initialFormData]
  );

  const currentTimestampString = new Date().toLocaleString("en-US", {
    timeZone: "America/Chicago",
  });

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
                  <Label htmlFor="appraised_total">Appraised Value</Label>
                  <Input
                    id="appraised_total"
                    type="number"
                    inputMode="numeric"
                    value={formData.appraised_total}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        appraised_total:
                          e.target.value === ""
                            ? 0
                            : Number.isNaN(Number(e.target.value))
                              ? formData.appraised_total
                              : Number(e.target.value),
                      })
                    }
                  />
                </div>
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
          This will in no way affect your ability to appeal your value to the
          Board of Equalization. State law requires the Assessor to revalue all
          real property in the City as of January 1st of every odd-numbered
          year.
        </p>
        <p className="mt-4">
          For questions or to schedule an interior inspection, please call
          314-622-4185 or email us at zasr@stlouis-mo.gov.
        </p>
      </div>
    </div>
  );
}
