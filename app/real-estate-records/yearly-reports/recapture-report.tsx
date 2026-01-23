"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUp, ArrowDown } from "lucide-react";

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
  month: string;
  monthIndex: number;
  assessorTotals: number;
  recorderDailyHigh: number;
};

type YearData = {
  [key: string]: {
    assessorTotals: number;
    recorderDailyHigh: number;
  };
};

type SortField = "month" | "assessorTotals" | "recorderDailyHigh";
type SortDirection = "asc" | "desc";

export function RecaptureReport({ year }: { year: number }) {
  const [data, setData] = useState<YearData>(() => {
    const initialData: YearData = {};
    MONTHS.forEach((month) => {
      initialData[month] = {
        assessorTotals: 0,
        recorderDailyHigh: 0,
      };
    });
    return initialData;
  });

  const [sortField, setSortField] = useState<SortField>("assessorTotals");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const sortedData = useMemo(() => {
    const dataArray: MonthData[] = MONTHS.map((month, index) => ({
      month,
      monthIndex: index,
      assessorTotals: data[month].assessorTotals,
      recorderDailyHigh: data[month].recorderDailyHigh,
    }));

    return dataArray.sort((a, b) => {
      let compareValue = 0;

      if (sortField === "month") {
        compareValue = a.monthIndex - b.monthIndex;
      } else if (sortField === "assessorTotals") {
        compareValue = a.assessorTotals - b.assessorTotals;
      } else if (sortField === "recorderDailyHigh") {
        compareValue = a.recorderDailyHigh - b.recorderDailyHigh;
      }

      return sortDirection === "asc" ? compareValue : -compareValue;
    });
  }, [data, sortField, sortDirection]);

  const totals = useMemo(() => {
    let assessorTotals = 0;
    let recorderDailyHigh = 0;

    MONTHS.forEach((month) => {
      assessorTotals += data[month].assessorTotals;
      recorderDailyHigh += data[month].recorderDailyHigh;
    });

    return { assessorTotals, recorderDailyHigh };
  }, [data]);

  const handleInputChange = (
    month: string,
    field: "assessorTotals" | "recorderDailyHigh",
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

  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
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

      <div className="print:hidden flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <span className="text-sm font-medium">Sort by:</span>
          <Select
            value={sortField}
            onValueChange={(value) => setSortField(value as SortField)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="assessorTotals">Assessor's Totals</SelectItem>
              <SelectItem value="recorderDailyHigh">Daily High</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={toggleSortDirection}
            variant="outline"
            size="icon"
            title={sortDirection === "asc" ? "Ascending" : "Descending"}
          >
            {sortDirection === "asc" ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )}
          </Button>
        </div>
        <Button onClick={handlePrint} variant="outline">
          Print Report
        </Button>
      </div>

      {/* Side by Side Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:grid-cols-1">
        {/* Input Form - Hidden when printing */}
        <div className="print:hidden bg-white p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Enter Monthly Data</h3>
          <div className="border border-gray-300 rounded overflow-hidden">
            {/* Header Row */}
            <div className="grid grid-cols-3 bg-gray-100 border-b border-gray-300 text-xs font-semibold">
              <div className="p-2 border-r border-gray-300">Month</div>
              <div className="p-2 border-r border-gray-300 text-right">
                Assessor
              </div>
              <div className="p-2 text-right">Daily High</div>
            </div>

            {/* Input Rows */}
            {MONTHS.map((month, index) => (
              <div
                key={month}
                className={`grid grid-cols-3 ${
                  index < MONTHS.length - 1 ? "border-b border-gray-300" : ""
                }`}
              >
                <div className="p-2 border-r border-gray-300 text-sm font-medium">
                  {month.slice(0, 3)}
                </div>
                <div className="p-1 border-r border-gray-300">
                  <Input
                    type="number"
                    min="0"
                    value={data[month].assessorTotals || ""}
                    onChange={(e) =>
                      handleInputChange(month, "assessorTotals", e.target.value)
                    }
                    className="text-right border-gray-300 h-8 text-sm"
                    placeholder="0"
                  />
                </div>
                <div className="p-1">
                  <Input
                    type="number"
                    min="0"
                    value={data[month].recorderDailyHigh || ""}
                    onChange={(e) =>
                      handleInputChange(
                        month,
                        "recorderDailyHigh",
                        e.target.value,
                      )
                    }
                    className="text-right border-gray-300 h-8 text-sm"
                    placeholder="0"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Display Report - Sorted */}
        <div className="printable-report bg-white p-4 lg:p-8 border rounded-lg print:border-none print:rounded-none print:w-full print:col-span-2">
          {/* Full Width Header */}
          <div className="text-center mb-4 print:mb-6">
            <h1 className="text-2xl lg:text-3xl font-bold">
              State Tax Commission
            </h1>
            <h2 className="text-xl lg:text-2xl font-semibold mt-2">
              Recapture Report
            </h2>
          </div>

          {/* Year Subheader */}
          <div className="text-center mb-6 print:mb-8">
            <h3 className="text-lg lg:text-xl font-medium">Year: {year}</h3>
          </div>

          {/* Three Column Grid - Sorted Display */}
          <div className="border border-black rounded-lg overflow-hidden print:rounded-none">
            {/* Header Row */}
            <div className="grid grid-cols-3 bg-gray-100 print:bg-gray-200 border-b border-black font-semibold text-sm lg:text-base">
              <div className="p-2 lg:p-3 border-r border-black">Month</div>
              <div className="p-2 lg:p-3 border-r border-black text-right">
                Assessor's Totals
              </div>
              <div className="p-2 lg:p-3 text-right">Recorder's Daily High</div>
            </div>

            {/* Data Rows - Sorted */}
            {sortedData.map((monthData, index) => (
              <div
                key={monthData.month}
                className={`grid grid-cols-3 text-sm lg:text-base ${
                  index < sortedData.length - 1 ? "border-b border-black" : ""
                }`}
              >
                <div className="p-2 lg:p-3 border-r border-black font-medium">
                  {monthData.month}
                </div>
                <div className="p-2 lg:p-3 border-r border-black text-right">
                  {monthData.assessorTotals.toLocaleString()}
                </div>
                <div className="p-2 lg:p-3 text-right">
                  {monthData.recorderDailyHigh.toLocaleString()}
                </div>
              </div>
            ))}

            {/* Totals Row */}
            <div className="grid grid-cols-3 bg-gray-50 print:bg-gray-200 border-t-2 border-t-black font-bold text-sm lg:text-base">
              <div className="p-2 lg:p-3 border-r border-black">Total</div>
              <div className="p-2 lg:p-3 border-r border-black text-right">
                {totals.assessorTotals.toLocaleString()}
              </div>
              <div className="p-2 lg:p-3 text-right">
                {totals.recorderDailyHigh.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
