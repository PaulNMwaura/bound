"use client";

import { useState, useEffect } from "react";

interface CalendarState {
    daysInMonth: number[]; // Explicitly type as an array of numbers
    startDay: number; // Type for the starting day of the week
}
interface CalendarProps {
    unavailableDays: number[]; // Array of unavailable day numbers
    setSelectedDate: (date: string) => void;
}
  
export default function Calendar({ setSelectedDate, unavailableDays }: CalendarProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [calendar, setCalendar] = useState<CalendarState>({
      daysInMonth: [], // Initial empty array
      startDay: 0, // Default starting day
  });
  const handleDateSelection = (day: number) => {
    if (unavailableDays.includes(day)) return; // Ignore unavailable days

    setSelectedDay(day);
    const now = new Date();
    const selectedDate = new Date(now.getFullYear(), now.getMonth(), day).toISOString();
        // .split("T")[0]; // Format: YYYY-MM-DD
    
    setSelectedDate(selectedDate); // Pass selected date to parent component
  };

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-indexed: January is 0

    // Get the number of days in the current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Get the starting day of the current month (0 = Sunday, 1 = Monday, etc.)
    const startDay = new Date(year, month, 1).getDay();

    setCalendar({
      daysInMonth: Array.from({ length: daysInMonth }, (_, i) => i + 1),
      startDay,
    });
    }, []);

  return (
    <div className="max-w-md mx-auto p-4 bg-[#E4EBF3]/90 rounded-lg shadow">
      {/* Header: Days of the week */}
      <div className="grid grid-cols-7 font-bold text-gray-700">
        <div className="w-12 text-center">Sun</div>
        <div className="w-12 text-center">Mon</div>
        <div className="w-12 text-center">Tue</div>
        <div className="w-12 text-center">Wed</div>
        <div className="w-12 text-center">Thu</div>
        <div className="w-12 text-center">Fri</div>
        <div className="w-12 text-center">Sat</div>
      </div>
      
      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1 text-center mt-2 cursor-pointer">
        {/* Empty boxes for days before the 1st */}
        {Array.from({ length: calendar.startDay }).map((_, i) => (
          <div key={`empty-${i}`}></div>
        ))}

        {/* Days of the month */}
        {calendar.daysInMonth.map((day) => (
          <div key={day} className={`py-2 rounded ${unavailableDays.includes(day) ? "bg-purple-500 text-white hover:bg-red-600" : selectedDay===day ? "bg-blue-500 text-white" : "bg-white text-black hover:bg-orange-500"}`} onClick={() => handleDateSelection(day)}>
            {day}
        </div>
        ))}
      </div>
    </div>
  );
}
