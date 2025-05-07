import React from "react";

interface AppealsCalendarProps {
  appeals: any[];
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
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

export const AppealsCalendar: React.FC<AppealsCalendarProps> = ({
  appeals,
}) => {
  const year = 2025;
  const months = Array.from({ length: 8 }, (_, i) => 4 + i); // May (4) to Dec (11)

  // Group appeals by date string
  const grouped = appeals.reduce<Record<string, any[]>>((acc, appeal) => {
    if (appeal.hearing_ts) {
      const key = new Date(appeal.hearing_ts).toDateString();
      acc[key] = acc[key] || [];
      acc[key].push(appeal);
    }
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {months.map((monthIndex) => {
        const startOfMonth = new Date(year, monthIndex, 1);
        const endOfMonth = new Date(year, monthIndex + 1, 0);
        const firstDayIndex = startOfMonth.getDay();
        const daysInMonth = endOfMonth.getDate();

        const cells: (Date | null)[] = [];
        for (let i = 0; i < firstDayIndex; i++) cells.push(null);
        for (let d = 1; d <= daysInMonth; d++)
          cells.push(new Date(year, monthIndex, d));

        const weeks: (Date | null)[][] = [];
        for (let i = 0; i < cells.length; i += 7) {
          weeks.push(cells.slice(i, i + 7));
        }

        return (
          <div key={monthIndex}>
            <h3 className="text-xl font-semibold mb-2">
              {MONTH_NAMES[monthIndex]} {year}
            </h3>
            <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium mb-2">
              {DAYS.map((day) => (
                <div key={day} className="py-1">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {weeks.map((week, wi) =>
                week.map((date, di) => (
                  <div
                    key={`${monthIndex}-${wi}-${di}`}
                    className="min-h-[100px] border rounded p-1 overflow-auto bg-white dark:bg-gray-800 text-xs"
                  >
                    {date && (
                      <>
                        <div className="font-semibold mb-1">
                          {date.getDate()}
                        </div>
                        {grouped[date.toDateString()]
                          ?.sort(
                            (a, b) =>
                              new Date(a.hearing_ts).getTime() -
                              new Date(b.hearing_ts).getTime()
                          )
                          .map((appeal) => (
                            <div key={appeal.appeal_number} className="mb-1">
                              <div className="">
                                <span className="font-mono">
                                  {appeal.parcel_year.parcel_number}
                                </span>{" "}
                                • <span>{appeal.appeal_appraiser}</span>
                              </div>
                              <div className="text-gray-500 truncate">
                                {new Date(appeal.hearing_ts).toLocaleTimeString(
                                  undefined,
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </div>
                            </div>
                          ))}
                      </>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AppealsCalendar;
