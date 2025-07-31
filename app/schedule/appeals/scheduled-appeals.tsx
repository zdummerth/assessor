"use client";

import { useState, useMemo } from "react";
import FormattedDate from "@/components/ui/formatted-date";

type ScheduledAppeal = {
  id: number;
  appeal_number: string;
  appellant_name: string;
  sched_scheduled_hearings: {
    sched_hearing_slots: {
      slot_time: string;
      duration_minutes: number;
    };
  };
};

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function differenceInMinutes(start: Date, end: Date) {
  return Math.round((end.getTime() - start.getTime()) / 60000);
}

function getAugustWeekdays(): string[] {
  const days: string[] = [];
  for (let d = 1; d <= 31; d++) {
    const date = new Date(2025, 7, d);
    const dayOfWeek = date.getDay();
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      days.push(date.toISOString().slice(0, 10));
    }
  }
  return days;
}

export default function ScheduledAppeals({
  data,
}: {
  data: ScheduledAppeal[];
}) {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [showOpenSlots, setShowOpenSlots] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const slotRanges = useMemo(() => {
    return data
      .map((a) => {
        const slot = a.sched_scheduled_hearings?.sched_hearing_slots;
        if (!slot?.slot_time || !slot?.duration_minutes) return null;
        const start = new Date(slot.slot_time);
        const end = new Date(start.getTime() + slot.duration_minutes * 60000);
        return { start, end };
      })
      .filter((r): r is { start: Date; end: Date } => !!r);
  }, [data]);

  const groupedAppeals = useMemo(() => {
    const map: { [key: string]: ScheduledAppeal[] } = {};
    for (const appeal of data) {
      const slotTime =
        appeal.sched_scheduled_hearings?.sched_hearing_slots?.slot_time;
      if (!slotTime) continue;
      if (!map[slotTime]) map[slotTime] = [];
      map[slotTime].push(appeal);
    }
    return map;
  }, [data]);

  const visibleAppeals = useMemo(() => {
    const filtered: [string, ScheduledAppeal[]][] = Object.entries(
      groupedAppeals
    )
      .filter(([slotTime]) => {
        if (!selectedDate) return true;
        return slotTime.startsWith(selectedDate);
      })
      .map(([slotTime, appeals]) => {
        const matching = appeals.filter((a) => {
          const q = searchQuery.toLowerCase();
          return (
            a.appeal_number.toLowerCase().includes(q) ||
            a.appellant_name.toLowerCase().includes(q)
          );
        });
        return [slotTime, matching] as [string, ScheduledAppeal[]];
      })
      .filter(([, appeals]) => appeals.length > 0)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime());

    return filtered;
  }, [groupedAppeals, selectedDate, searchQuery]);

  const allWeekdays = useMemo(() => getAugustWeekdays(), []);

  const openSlotRanges = useMemo(() => {
    const rangesByDay: Record<string, { start: Date; end: Date }[]> = {};

    for (const day of allWeekdays) {
      const [year, month, date] = day.split("-").map(Number);
      const dayStart = new Date(year, month - 1, date, 8, 0);
      const dayEnd = new Date(year, month - 1, date, 16, 45);

      const taken = slotRanges
        .filter((r) => r.start.toISOString().startsWith(day))
        .sort((a, b) => a.start.getTime() - b.start.getTime());

      const open: { start: Date; end: Date }[] = [];
      let current = new Date(dayStart);

      for (const { start, end } of taken) {
        if (start > current) {
          open.push({ start: new Date(current), end: new Date(start) });
        }
        if (end > current) {
          current = new Date(end);
        }
      }

      if (current < dayEnd) {
        open.push({ start: new Date(current), end: new Date(dayEnd) });
      }

      rangesByDay[day] = open;
    }

    return rangesByDay;
  }, [slotRanges, allWeekdays]);

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl font-semibold">Schedule</h2>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showOpenSlots}
              onChange={(e) => setShowOpenSlots(e.target.checked)}
            />
            Show Open Slots
          </label>
        </div>
        <input
          type="text"
          placeholder="Search by appeal # or name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border rounded px-3 py-1 text-sm w-full md:w-64"
        />
        <select
          className="border rounded px-2 py-1 text-sm"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        >
          <option value="">All Dates</option>
          {allWeekdays.map((day) => (
            <option key={day} value={day}>
              <FormattedDate date={day} />
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-y-auto max-h-[600px] pr-2 space-y-6">
        {showOpenSlots
          ? Object.entries(openSlotRanges)
              .filter(([day]) => !selectedDate || day === selectedDate)
              .map(([day, ranges]) => (
                <div key={day} className="mb-4">
                  <p className="font-semibold text-gray-700 mb-1">
                    <FormattedDate date={day} />
                  </p>
                  {ranges.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">
                      No open time ranges
                    </p>
                  ) : (
                    ranges.map((range, i) => (
                      <div
                        key={i}
                        className="border rounded p-3 bg-green-50 text-sm mb-1"
                      >
                        {formatTime(range.start)} – {formatTime(range.end)} (
                        {differenceInMinutes(range.start, range.end)} min)
                      </div>
                    ))
                  )}
                </div>
              ))
          : visibleAppeals.map(([slotTime, appeals]) => {
              const first = appeals[0];
              const slot = first.sched_scheduled_hearings?.sched_hearing_slots;
              const start = new Date(slot.slot_time);
              const end = new Date(
                start.getTime() + slot.duration_minutes * 60000
              );

              return (
                <div key={slotTime}>
                  <div className="text-sm font-semibold text-gray-700 border-b mb-1">
                    {/* @ts-ignore */}
                    <FormattedDate date={start} />
                    {formatTime(start)} – {formatTime(end)} (
                    {slot.duration_minutes} min)
                  </div>
                  <div className="space-y-2">
                    {appeals.map((appeal) => (
                      <div
                        key={appeal.id}
                        className="border rounded p-3 bg-white shadow-sm"
                      >
                        <p className="font-medium">
                          Appeal #{appeal.appeal_number} –{" "}
                          {appeal.appellant_name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
}
