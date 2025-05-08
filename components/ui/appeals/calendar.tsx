"use client";
import React, { useState, useMemo } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface Appeal {
  appeal_number: string;
  hearing_ts?: string;
  // add other fields if you want to render more info
}

interface AppealsCalendarProps {
  appeals: Appeal[];
}

export default function AppealsCalendar({ appeals }: any) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Map appeals by date string for quick lookup
  const appealsByDate = useMemo(() => {
    const map: Record<string, Appeal[]> = {};
    appeals.forEach((a: any) => {
      if (a.hearing_ts) {
        const key = new Date(a.hearing_ts).toDateString();
        map[key] = map[key] || [];
        map[key].push(a);
      }
    });
    return map;
  }, [appeals]);

  const monthStart = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );
  const monthDays = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  const startWeekday = monthStart.getDay(); // 0 = Sunday

  // Build array of day cells (null for empty)
  const cells: (Date | null)[] = [
    ...Array(startWeekday).fill(null),
    ...Array.from(
      { length: monthDays },
      (_, i) =>
        new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1)
    ),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const prevMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  const nextMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );

  const monthLabel = monthStart.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="max-w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <button
          onClick={prevMonth}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
        >
          <ArrowLeft />
        </button>
        <h2 className="text-lg font-medium">{monthLabel}</h2>
        <button
          onClick={nextMonth}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
        >
          <ArrowRight />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-600 dark:text-gray-400">
        {weekdays.map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Day Cells */}
      <div className="grid grid-cols-7 border-t border-gray-200 dark:border-gray-700">
        {cells.map((day, idx) => {
          const key = day ? day.toDateString() : `empty-${idx}`;
          const dayAppeals = day ? appealsByDate[key] || [] : [];
          return (
            <div
              key={key}
              className={`border-l border-b border-gray-200 dark:border-gray-700 h-24 p-1 flex flex-col ${
                day
                  ? "bg-white dark:bg-gray-800"
                  : "bg-gray-50 dark:bg-gray-900"
              }`}
            >
              {day && (
                <>
                  <span className="text-xs font-medium text-gray-800 dark:text-gray-200">
                    {day.getDate()}
                  </span>
                  <div className="mt-1 flex-1 overflow-y-auto space-y-0.5 text-[10px]">
                    {dayAppeals.map((a) => (
                      <div
                        key={a.appeal_number}
                        className="truncate bg-blue-100 text-blue-800 px-1 rounded"
                      >
                        {a.appeal_number}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
