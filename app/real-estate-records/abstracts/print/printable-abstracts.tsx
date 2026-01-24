"use client";

import type { DeedAbstract } from "../types";

type PrintableAbstractsProps = {
  deedAbstracts: DeedAbstract[];
  bookTitle?: string;
};

export function PrintableAbstracts({
  deedAbstracts,
  bookTitle,
}: PrintableAbstractsProps) {
  const formatCurrency = (cents: number | null) => {
    if (cents === null) return "—";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(cents / 100);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <>
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }

          @page :right {
            margin-top: 0.75in;
            margin-bottom: 0.75in;
            margin-left: 1.2in;
            margin-right: 0.75in;

            @top-right {
              content: "${bookTitle} -  " counter(page);
            }
          }
          @page :left {
            margin-top: 0.75in;
            margin-bottom: 0.55in;
            margin-left: 0.75in;
            margin-right: 1.2in;

            @top-left {
              content: "${bookTitle} -  " counter(page);
            }
          }

          body {
            background: white;
            margin: 0;
            padding: 0;
            /* font-size: 200px !important; */
          }

          .print-container {
            max-width: none;
            margin: 0;
            padding: 0;
          }

          .abstract-wrap {
            page-break-inside: avoid;
            break-inside: avoid;
          }
        }
      `}</style>
      <div className="print-container mx-auto max-w-4xl px-4 py-6">
        {/* Screen controls */}
        <div className="no-print mb-4 flex gap-3">
          <button
            onClick={() => window.print()}
            className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
          >
            Print Abstracts
          </button>
          <a
            href={`/real-estate-records/abstracts/books/${bookTitle ? encodeURIComponent(bookTitle) : ""}`}
            className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 font-semibold text-gray-700 hover:bg-gray-100"
          >
            Back to Book Page
          </a>
        </div>

        {/* Printable abstracts */}
        <div className="flex flex-col">
          {deedAbstracts.map((abstract) => (
            <div key={abstract.id} className="abstract-wrap">
              <div className="flex flex-col gap-2 border-b border-gray-900 bg-white pb-8 pt-2">
                {/* Row 1: Daily Number, Date Filed, Type, Date of Deed */}
                <div className="grid grid-cols-4 gap-x-4 gap-y-1">
                  <div className="min-w-0">
                    <p className="text-[0.65rem] font-semibold uppercase text-gray-600">
                      Daily Number
                    </p>
                    <div className="break-words font-semibold">
                      {abstract.daily_number || "—"}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[0.65rem] font-semibold uppercase text-gray-600">
                      Date Filed
                    </p>
                    <div className="break-words font-semibold">
                      {formatDate(abstract.date_filed)}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[0.65rem] font-semibold uppercase text-gray-600">
                      Type of Conveyance
                    </p>
                    <div className="break-words font-semibold">
                      {abstract.type_of_conveyance || "—"}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[0.65rem] font-semibold uppercase text-gray-600">
                      Date of Deed
                    </p>
                    <div className="break-words font-semibold">
                      {formatDate(abstract.date_of_deed)}
                    </div>
                  </div>
                </div>

                {/* Grantor Section */}
                <div className="mt-1">
                  <h3 className="mb-1 text-xs font-bold uppercase text-gray-800">
                    From (Grantor)
                  </h3>
                  <div className="break-words font-semibold">
                    {abstract.grantor_name || "—"}
                  </div>
                  <div className="break-words text-sm text-gray-700">
                    {abstract.grantor_address || "—"}
                  </div>
                </div>

                {/* Grantee Section */}
                <div>
                  <h3 className="mb-1 text-xs font-bold uppercase text-gray-800">
                    To (Grantee)
                  </h3>
                  <div className="break-words font-semibold">
                    {abstract.grantee_name || "—"}
                  </div>
                  <div className="break-words text-sm text-gray-700">
                    {abstract.grantee_address || "—"}
                  </div>
                </div>

                {/* Consideration, Stamps, City Block, Transfer */}
                <div className="grid grid-cols-4 gap-x-4 gap-y-1">
                  <div className="min-w-0">
                    <p className="text-[0.65rem] font-semibold uppercase text-gray-600">
                      Consideration
                    </p>
                    <div className="break-words font-semibold">
                      {formatCurrency(abstract.consideration_amount)}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[0.65rem] font-semibold uppercase text-gray-600">
                      Stamps
                    </p>
                    <div className="break-words font-semibold">
                      {abstract.stamps || "—"}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[0.65rem] font-semibold uppercase text-gray-600">
                      City Block
                    </p>
                    <div className="break-words font-semibold">
                      {abstract.city_block || "—"}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[0.65rem] font-semibold uppercase text-gray-600">
                      Transfer
                    </p>
                    <div className="break-words font-semibold">
                      {abstract.is_transfer ? "Yes" : "No"}
                    </div>
                  </div>
                </div>

                {/* Title Company */}
                <div className="min-w-0">
                  <p className="text-[0.65rem] font-semibold uppercase text-gray-600">
                    Title Company
                  </p>
                  <div className="break-words text-sm">
                    {abstract.title_company || "—"}
                  </div>
                </div>

                {/* Legal Description */}
                <div className="min-w-0">
                  <p className="text-[0.65rem] font-semibold uppercase text-gray-600">
                    Legal Description
                  </p>
                  <div className="whitespace-pre-line break-words text-sm">
                    {abstract.legal_description || "—"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
