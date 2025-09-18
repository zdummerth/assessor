"use client";

import React from "react";
import { type AbstractFormData } from "./shared";

function Field({ label, value }: { label: string; value: string | undefined }) {
  return (
    <div className="space-y-1 min-w-0">
      <p className="text-xs font-semibold uppercase text-gray-700">{label}</p>
      <div className="text-sm break-words">{value ?? ""}</div>
    </div>
  );
}

export default function AbstractNotice({
  formData,
}: {
  formData: AbstractFormData;
}) {
  return (
    <div className="border p-8 print:p-4 print:border-none print:bg-white print:text-black text-sm leading-6 space-y-4">
      <div className="grid grid-cols-4 gap-4">
        <Field label="DATE FILED" value={formData.date_filed} />
        <Field label="DAILY NUMBER" value={formData.daily_no} />
        <Field label="TYPE OF CONVEYANCE" value={formData.type_of_conveyance} />
        <Field label="DATE OF DEED" value={formData.date_of_deed} />
      </div>

      <div>
        <Field label="FROM" value={formData.from} />
      </div>

      <div className="space-y-1">
        <Field label="TO" value={formData.to} />
        <div className="text-sm break-words pl-0">
          {formData.to_address ?? ""}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Field label="CONSIDERATION" value={formData.consideration} />
        <Field label="STAMPS" value={formData.stamps} />
        <Field label="CITY BLOCK" value={formData.city_block} />
      </div>

      <div>
        <Field label="LEGAL DESCRIPTION" value={formData.legal_description} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Field label="ABSTRACT" value={formData.abstract} />
        <Field label="SP TAX" value={formData.sp_tax} />
        <Field label="TRANSFER" value={formData.transfer} />
      </div>

      <div>
        <Field label="MORTGAGE" value={formData.mortgage} />
      </div>
    </div>
  );
}
