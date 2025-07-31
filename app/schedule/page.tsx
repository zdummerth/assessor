"use client";

import React from "react";
import FormattedDate from "@/components/ui/formatted-date";

type TimeSlot = {
  date: string;
  time: string;
};

function generateAugust2025WeekdayTimeSlots(): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const startHour = 8;
  const endHour = 16;
  const intervalMinutes = 15;

  for (let day = 1; day <= 31; day++) {
    const date = new Date(2025, 7, day); // August = 7 (0-indexed)
    const weekday = date.getDay(); // 0 = Sunday, 6 = Saturday
    if (weekday === 0 || weekday === 6) continue;

    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += intervalMinutes) {
        if (hour === endHour && minute > 45) break;

        const time = new Date(2025, 7, day, hour, minute);
        const timeString = time.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });

        const dateString = time.toISOString().split("T")[0];
        slots.push({ date: dateString, time: timeString });
      }
    }
  }

  return slots;
}

export default function TimeSlotGrid() {
  const slots = generateAugust2025WeekdayTimeSlots();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Available Time Slots</h1>
      <div className="grid grid-cols-1 gap-3 max-h-[80vh] overflow-y-auto border p-4 rounded-lg shadow">
        {slots.map((slot, index) => (
          <div
            key={index}
            className="p-3 border rounded hover:bg-blue-100 transition-colors"
          >
            <div className="text-sm font-medium text-gray-700">
              <FormattedDate date={slot.date} />
            </div>
            <div className="text-lg text-gray-900">{slot.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
