"use client";

import { useState, useEffect } from "react";

interface CalendarState {
  daysInMonth: number[];
  startDay: number;
}

interface Appointment {
  date: string;
  status: string;
}

interface CalendarProps {
  appointments: Appointment[];
}

export default function Calendar({ appointments }: CalendarProps) {
  const [calendar, setCalendar] = useState<CalendarState>({
    daysInMonth: [],
    startDay: 0,
  });
  const [acceptedDays, setAcceptedDays] = useState<number[]>([]);

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-indexed: January is 0

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDay = new Date(year, month, 1).getDay();

    setCalendar({
      daysInMonth: Array.from({ length: daysInMonth }, (_, i) => i + 1),
      startDay,
    });

    // Extract days with accepted appointments
    const acceptedDaysSet = new Set<number>();
    appointments.forEach(({ date, status }) => {
      const appointmentDate = new Date(date);
      if (
        status === "accepted" &&
        appointmentDate.getFullYear() === year &&
        appointmentDate.getMonth() === month
      ) {
        acceptedDaysSet.add(appointmentDate.getDate());
      }
    });

    setAcceptedDays(Array.from(acceptedDaysSet));
  }, [appointments]);

  return (
    <section className="mt-4 px-3">
      <div className="w-full max-w-3xl mx-auto p-10 bg-white rounded-lg shadow-lg">
        {/* Month & Year Header */}
        <div className="text-center text-xl font-semibold text-gray-700 mb-4">
          {new Date().toLocaleString("default", { month: "long", year: "numeric" })}
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 text-gray-600 font-medium text-sm border-b pb-2">
          <div className="text-center">Sun</div>
          <div className="text-center">Mon</div>
          <div className="text-center">Tue</div>
          <div className="text-center">Wed</div>
          <div className="text-center">Thu</div>
          <div className="text-center">Fri</div>
          <div className="text-center">Sat</div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mt-2">
          {/* Empty cells for days before the 1st */}
          {Array.from({ length: calendar.startDay }).map((_, i) => (
            <div key={`empty-${i}`} className="h-12 md:h-16"></div>
          ))}

          {/* Days of the month */}
          {calendar.daysInMonth.map((day) => (
            <div
              key={day}
              className={`relative h-12 md:h-16 border rounded-lg flex items-start p-2 text-sm ${
                acceptedDays.includes(day) ? "bg-blue-100 border-blue-500" : "bg-white border-gray-300"
              }`}
            >
              <span className="text-gray-700 font-medium">{day}</span>

              {/* Indicator for accepted appointments */}
              {acceptedDays.includes(day) && (
                <div className="absolute bottom-2 left-2 right-2 bg-blue-500 text-white text-xs text-center py-1 rounded-md">
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
