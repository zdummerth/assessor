"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

type MonthData = {
  assessorTotals: number;
  totalAbstracts: number;
};

type YearData = {
  [key: string]: MonthData;
};

export function StateTaxCommissionReport({ year }: { year: number }) {
  const [data, setData] = useState<YearData>(() => {
    const initialData: YearData = {};
    MONTHS.forEach((month) => {
      initialData[month] = {
        assessorTotals: 0,
        totalAbstracts: 0,
      };
    });
    return initialData;
  });

  const totals = useMemo(() => {
    let assessorTotals = 0;
    let totalAbstracts = 0;

    MONTHS.forEach((month) => {
      assessorTotals += data[month].assessorTotals;
      totalAbstracts += data[month].totalAbstracts;
    });

    return { assessorTotals, totalAbstracts };
  }, [data]);

  const handleInputChange = (
    month: string,
    field: keyof MonthData,
    value: string,
  ) => {
    const numValue = parseInt(value) || 0;
    setData((prev) => ({
      ...prev,
      [month]: {
        ...prev[month],
        [field]: numValue,
      },
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="print:block hidden">
        <style jsx global>{`
          @media print {
            body * {
              visibility: hidden;
            }
            .printable-report,
            .printable-report * {
              visibility: visible;
            }
            .printable-report {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
          }
        `}</style>
      </div>

      <div className="print:hidden flex justify-end">
        <Button onClick={handlePrint} variant="outline">
          Print Report
        </Button>
      </div>

      <div className="printable-report bg-white p-8 border rounded-lg print:border-none print:rounded-none">
        {/* Full Width Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">State Tax Commission</h1>
          <h2 className="text-2xl font-semibold mt-2">Yearly Report</h2>
        </div>

        {/* Year Subheader */}
        <div className="text-center mb-8">
          <h3 className="text-xl font-medium">Year: {year}</h3>
        </div>

        {/* Three Column Grid */}
        <div className="border border-black rounded-lg overflow-hidden print:rounded-none">
          {/* Header Row */}
          <div className="grid grid-cols-3 bg-gray-100 print:bg-gray-200 border-b border-black font-semibold">
            <div className="p-3 border-r border-black">Month</div>
            <div className="p-3 border-r border-black text-right">
              Assessor's Totals
            </div>
            <div className="p-3 text-right">Total Abstracts Conveyed</div>
          </div>

          {/* Data Rows */}
          {MONTHS.map((month, index) => (
            <div
              key={month}
              className={`grid grid-cols-3 ${
                index < MONTHS.length - 1 ? "border-b border-black" : ""
              }`}
            >
              <div className="p-3 border-r border-black font-medium">
                {month}
              </div>
              <div className="p-3 border-r border-black">
                {/* Input shown during editing */}
                <Input
                  type="number"
                  min="0"
                  value={data[month].assessorTotals || ""}
                  onChange={(e) =>
                    handleInputChange(month, "assessorTotals", e.target.value)
                  }
                  className="text-right border-gray-300 print:hidden"
                  placeholder="0"
                />
                {/* Value shown when printing */}
                <div className="hidden print:block text-right">
                  {data[month].assessorTotals.toLocaleString()}
                </div>
              </div>
              <div className="p-3">
                {/* Input shown during editing */}
                <Input
                  type="number"
                  min="0"
                  value={data[month].totalAbstracts || ""}
                  onChange={(e) =>
                    handleInputChange(month, "totalAbstracts", e.target.value)
                  }
                  className="text-right border-gray-300 print:hidden"
                  placeholder="0"
                />
                {/* Value shown when printing */}
                <div className="hidden print:block text-right">
                  {data[month].totalAbstracts.toLocaleString()}
                </div>
              </div>
            </div>
          ))}

          {/* Totals Row */}
          <div className="grid grid-cols-3 bg-gray-50 print:bg-gray-200 border-t-2 border-t-black font-bold">
            <div className="p-3 border-r border-black">Total</div>
            <div className="p-3 border-r border-black text-right">
              {totals.assessorTotals.toLocaleString()}
            </div>
            <div className="p-3 text-right">
              {totals.totalAbstracts.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
