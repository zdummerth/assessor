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
  covTotals: number;
};

type YearData = {
  [key: string]: {
    covTotals: number;
  };
};

type SortField = "month" | "covTotals";
type SortDirection = "asc" | "desc";

export function COVRecaptureReport({ year }: { year: number }) {
  const [data, setData] = useState<YearData>(() => {
    const initialData: YearData = {};
    MONTHS.forEach((month) => {
      initialData[month] = {
        covTotals: 0,
      };
    });
    return initialData;
  });

  const [sortField, setSortField] = useState<SortField>("covTotals");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const sortedData = useMemo(() => {
    const dataArray: MonthData[] = MONTHS.map((month, index) => ({
      month,
      monthIndex: index,
      covTotals: data[month].covTotals,
    }));

    return dataArray.sort((a, b) => {
      let compareValue = 0;

      if (sortField === "month") {
        compareValue = a.monthIndex - b.monthIndex;
      } else if (sortField === "covTotals") {
        compareValue = a.covTotals - b.covTotals;
      }

      return sortDirection === "asc" ? compareValue : -compareValue;
    });
  }, [data, sortField, sortDirection]);

  const totals = useMemo(() => {
    let covTotals = 0;

    MONTHS.forEach((month) => {
      covTotals += data[month].covTotals;
    });

    return { covTotals };
  }, [data]);

  const handleInputChange = (month: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setData((prev) => ({
      ...prev,
      [month]: {
        covTotals: numValue,
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
              <SelectItem value="covTotals">COV Totals</SelectItem>
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
            <div className="grid grid-cols-2 bg-gray-100 border-b border-gray-300 text-xs font-semibold">
              <div className="p-2 border-r border-gray-300">Month</div>
              <div className="p-2 text-right">COV Totals</div>
            </div>

            {/* Input Rows */}
            {MONTHS.map((month, index) => (
              <div
                key={month}
                className={`grid grid-cols-2 ${
                  index < MONTHS.length - 1 ? "border-b border-gray-300" : ""
                }`}
              >
                <div className="p-2 border-r border-gray-300 text-sm font-medium">
                  {month.slice(0, 3)}
                </div>
                <div className="p-1">
                  <Input
                    type="number"
                    min="0"
                    value={data[month].covTotals || ""}
                    onChange={(e) => handleInputChange(month, e.target.value)}
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
              COV Recapture Report
            </h2>
          </div>

          {/* Year Subheader */}
          <div className="text-center mb-6 print:mb-8">
            <h3 className="text-lg lg:text-xl font-medium">Year: {year}</h3>
          </div>

          {/* Two Column Grid - Sorted Display */}
          <div className="border border-black rounded-lg overflow-hidden print:rounded-none">
            {/* Header Row */}
            <div className="grid grid-cols-2 bg-gray-100 print:bg-gray-200 border-b border-black font-semibold text-sm lg:text-base">
              <div className="p-2 lg:p-3 border-r border-black">Month</div>
              <div className="p-2 lg:p-3 text-right">
                Certificate Of Value Totals
              </div>
            </div>

            {/* Data Rows - Sorted */}
            {sortedData.map((monthData, index) => (
              <div
                key={monthData.month}
                className={`grid grid-cols-2 text-sm lg:text-base ${
                  index < sortedData.length - 1 ? "border-b border-black" : ""
                }`}
              >
                <div className="p-2 lg:p-3 border-r border-black font-medium">
                  {monthData.month}
                </div>
                <div className="p-2 lg:p-3 text-right">
                  {monthData.covTotals.toLocaleString()}
                </div>
              </div>
            ))}

            {/* Totals Row */}
            <div className="grid grid-cols-2 bg-gray-50 print:bg-gray-200 border-t-2 border-t-black font-bold text-sm lg:text-base">
              <div className="p-2 lg:p-3 border-r border-black">Total</div>
              <div className="p-2 lg:p-3 text-right">
                {totals.covTotals.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
