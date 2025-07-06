"use client";

import React from "react";

export default function PrintedFormPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white text-black text-sm leading-tight print:p-2 print:border-0 print:shadow-none">
      {/* PAGE 1: FORM */}
      <div>
        <h1 className="text-xl font-bold mb-6 text-center">
          Appeal Appearance Request Form
        </h1>

        {/* Appellant Info */}
        <section className="mb-6">
          <h2 className="font-semibold mb-2">Your Information</h2>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block">Full Name</label>
              <input type="text" className="w-full border p-1 rounded" />
            </div>
            <div>
              <label className="block">Phone</label>
              <input type="tel" className="w-full border p-1 rounded" />
            </div>
            <div className="col-span-2">
              <label className="block">Address</label>
              <input type="text" className="w-full border p-1 rounded" />
            </div>
            <div className="col-span-2">
              <label className="block">Email</label>
              <input type="email" className="w-full border p-1 rounded" />
            </div>
          </div>
        </section>

        {/* Contact Method */}
        <section className="mb-6">
          <h2 className="font-semibold mb-2">Preferred Method of Contact</h2>
          <div className="flex flex-wrap gap-4">
            {["Mail", "Email", "Text"].map((method) => (
              <label key={method} className="flex items-center space-x-1">
                <input type="checkbox" className="h-4 w-4" />
                <span>{method}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Attendance */}
        <section className="mb-6">
          <h2 className="font-semibold mb-2">Attendance Preference</h2>
          <div className="space-y-2">
            <label className="flex items-start space-x-2">
              <input type="checkbox" className="h-4 w-4 mt-1" />
              <span>
                <strong>Waiver of Attendance:</strong> I will not appear in
                person. I may submit documents (appraisals, sales, images, etc.)
                and my appeal will be considered.
              </span>
            </label>
            <label className="flex items-start space-x-2">
              <input type="checkbox" className="h-4 w-4 mt-1" />
              <span>
                <strong>In Person Appearance:</strong> I wish to appear. I will
                be notified of my hearing date.
              </span>
            </label>
          </div>
        </section>

        {/* Authorized Rep */}
        <section className="mb-6">
          <h2 className="font-semibold mb-2">
            Authorized Representative{" "}
            <span className="font-normal">(optional)</span>
          </h2>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block">Name</label>
              <input type="text" className="w-full border p-1 rounded" />
            </div>
            <div>
              <label className="block">Phone</label>
              <input type="tel" className="w-full border p-1 rounded" />
            </div>
            <div className="col-span-2">
              <label className="block">Address</label>
              <input type="text" className="w-full border p-1 rounded" />
            </div>
            <div className="col-span-2">
              <label className="block">Email</label>
              <input type="email" className="w-full border p-1 rounded" />
            </div>
          </div>
        </section>

        {/* Notice Before Signature */}
        <section className="mb-4 text-[13px]">
          <p className="font-medium">Please Note:</p>
          <p>
            By submitting this form, you are requesting a hearing before the
            Board. Based on the evidence presented, the value of your property
            may be <strong>lowered</strong>, <strong>maintained</strong>, or{" "}
            <strong>increased</strong>. Please ensure that all relevant
            documentation is submitted to support your appeal.
          </p>
        </section>

        {/* Signature & Date */}
        <div className="mt-6 flex items-end gap-16">
          <div>
            <label className="block font-medium">Signature of Appellant</label>
            <div className="h-16 border-b border-gray-500 mt-1 w-64" />
          </div>
          <div>
            <label className="block font-medium">Date</label>
            <div className="h-16 border-b border-gray-500 mt-1 w-40" />
          </div>
        </div>

        {/* Print Button */}
        <div className="mt-6 print:hidden flex justify-center">
          <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
          >
            Print Form
          </button>
        </div>
      </div>

      {/* PAGE 2: INSTRUCTIONS */}
      <div className="mt-10 pt-10 print:break-before-page text-sm leading-relaxed">
        <h2 className="text-xl font-bold mb-4 text-center">
          Appeal Form Instructions
        </h2>

        <ol className="list-decimal space-y-2 pl-5">
          <li>
            Only the property owner, or their designated agent or attorney, may
            file an appeal. If the property is owned by an LLC, trust,
            partnership, or corporation, the individual appearing before the
            Board must be a member of that organization or must have written
            legal authorization to represent it.
          </li>
          <li>
            The Board of Equalization will notify you of your scheduled hearing
            date and time. Please note that due to COVID-19 and ongoing public
            health considerations, hearings may be conducted in person, online,
            or by phone. You will be informed of the format along with your
            hearing notice.
          </li>
          <li>All questions on the form must be answered completely.</li>
          <li>The form must be completed using blue or black ink.</li>
          <li>
            The form must be signed by the property owner or their authorized
            legal representative.
          </li>
          <li>
            Please include a daytime phone number where you can be reached.
          </li>
          <li>
            Submit completed appeal forms via email to:{" "}
            <a
              href="mailto:zasr@stlouis-mo.gov"
              className="underline text-blue-600"
            >
              zasr@stlouis-mo.gov
            </a>
          </li>
          <li>
            All appeal forms must be{" "}
            <strong>received or postmarked by Monday, July 14, 2025</strong> to
            be valid. This is a statutory deadline and{" "}
            <strong>cannot be extended</strong> by the Board of Equalization.
          </li>

          <li>
            The Board will only schedule hearings for completed and signed
            appeal forms. Please return the form via mail or in person to:
            <div className="mt-2 pl-4">
              <p>
                <strong>Board of Equalization</strong>
              </p>
              <p>Room 120, City Hall</p>
              <p>1200 Market Street</p>
              <p>St. Louis, MO 63103</p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  );
}
